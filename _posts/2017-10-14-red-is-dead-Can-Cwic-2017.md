---
title:  "Red is Dead - Can CWIC CTF 2017"
date:   2017-10-14 10:47:06
categories: [write-ups]
tags: [Can CWIC CTF 2017]
---
Challenge:

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
é até meio incomum ver isso mas enfim, ele tá usando o sizeof para pegar a quantidade de bytes da estrutura user e definir
na variável color, ou seja, o que era 8 bytes agr virou 24 bytes!, o que isso nos ajudará?
poderemos fazer um buffer overflow que nos dará a proxima função
