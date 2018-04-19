---
title:  "Flask Null to Full"
date:   2018-04-19 16:11:42
categories: [frameworks]
tags: [flask]
---

Bem vindo, nesse post começarei uma série de docs/ensinamentos sobre flask, também será meu diário pessoal
tudo que eu aprender vou colocar aqui, quem sabe no futuro eu precise não é mesmo!?

Bem, vamos começar importando o flask para o nosso app.

``` python
from flask import Flask
```

Quem já tem conhecimento de python sabe que o que eu fiz foi apenas importar a class Flask do módulo flask.

``` python
app = Flask(__name__)
```

Defino a váriavel app que recebe a class Flask(), essa class ela serve para pegar o nome do seu app
voce pode colocar dentro dos () o nome entre parenteses ou usar o método __name__, que 99% das pessoas usa
o esse método. __name__ vai buscar automaticamente o nome pelo seu arquivo, se nosso arquivo se chama services.py
o nome do app ficará services

``` python
if __name__ == "__main__":
    app.run()
```

Em python nós não temos uma função main() então, quando executamos um `python app.py` ele executa todo
o código para isso nós colocamos uma condição, Se __name__ for igual a função __main__, execute app.run()
dessa forma nós pegaremos só um bloco do código!

Aqui nós já temos nosso servidor web rodando

se você der um python app.py verá que ele está rodando no localhost na porta 5000

``` python
from flask import Flask

app = Flask(__name__)

if __name__ == "__main__":
    app.run()
