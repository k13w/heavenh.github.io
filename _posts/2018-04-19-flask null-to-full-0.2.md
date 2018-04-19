---
title:  "Flask Null to Full - Criando Rotas"
date:   2018-04-19 20:05:33
categories: [frameworks]
tags: [flask]
---

Bem vindo a mais um tópico, bom nesse tópico abordarei como criar rotas dinãmicas em flask.
antes de tudo esteja ciente que há mais de uma maneira de definir rotas em flask

Decorators:
Roteando via decorator o Flask usará o nome de sua função automaticamente como `endpoint`

vamos lá

``` python
@app.route('/data/')
def data():
    return 'The data page'

@app.route('/user/<username>')
def show_user_profile():
    return 'User %s' % username
```
Os seguintes conversores que o route aceita:

|   string |  aceita qualquer texto sem barra (o padrão) |
|   int    |  aceita inteiros |
|   float  |  como int mas para valores de ponto flutuante |
|   path   |  como string, mas também aceita barras |
|   any    |  corresponde a um dos itens fornecidos |
|   uuid   |  aceita strings UUID |

Acabamos de definir duas rotas, quando o usuário acessar `localhost:5000/user` ele vai da 404, bem óbvio né
ele pede pra passar um `<username>`
então podemos acessar da seguinte maneira `localhost:5000/user/heaven`.
e eu terei o retorno do meu username.
