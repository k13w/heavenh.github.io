---
title:  "Flask Null to Full - Criando seu servidor web"
date:   2018-04-19 16:11:42
categories: [frameworks]
tags: [flask]
---

Bem vindo, nesse post começarei uma série de docs/learn sobre flask, também será meu diário pessoal
tudo que eu aprender vou colocar aqui, quem sabe no futuro eu precise não é mesmo!?

Bem, vamos começar importando o flask para o nosso app.

``` python
from flask import Flask
```

Quem já tem conhecimento com python sabe que eu apenas importei a class Flask do módulo flask.

``` python
app = Flask(__name__)
```

Defino a váriavel app que recebe a class Flask(), essa class serve para definir o nome do seu app, 
você pode colocar dentro dos `()` o nome entre parenteses ou usar o método `__name__`, esse método irá definir automaticamente o nome do app com base o nome do seu arquivo.
``` python
if __name__ == "__main__":
    app.run()
```

Em python nós não temos uma função main(), então, quando executamos um `python app.py` ele irá executar todo
o código, para isso nós colocamos uma condição, Se o método `__name__` for igual o método `__main__`, execute app.run()
dessa forma nós pegaremos só um bloco do código!

Bem, já temos nosso servidor web funcionando!

se você rodar um `python app.py`, verá que ele está rodando no localhost na porta 5000

``` python
from flask import Flask

app = Flask(__name__)

if __name__ == "__main__":
    app.run()
```
