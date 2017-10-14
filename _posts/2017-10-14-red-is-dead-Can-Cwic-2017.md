---
title:  "Red is Dead - Can CWIC CTF 2017"
date:   2017-10-14 10:47:06
categories: [write-ups]
tags: [Can CWIC CTF 2017]
---
Challenge:

Analisando a estrutura `user` nós se depara com uma variável color [8 bytes], uma variável name [8 bytes] e um ponteiro [8 bytes]

``` C
struct user {
    char color[8];
    char name[8];
    void (*next)(struct user*);
};
```

linha 17 a  31 não importa para nós, vamos pular e ir pra função `check_knight`
``` C
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
