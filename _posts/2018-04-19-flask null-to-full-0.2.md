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
```

Regras Variáveis:
``` python
@app.route('/user/<username>')
def show_user_profile():
    return 'User %s' % username
```
Opcionalmente, um conversor pode ser usado especificando uma regra com <converter: variable_name>
Ex: `/user/<int: age>`
Os seguintes conversores que as rules aceita:

|   string |  aceita qualquer texto sem barra (o padrão) |
|   int    |  aceita inteiros |
|   float  |  como int mas para valores de ponto flutuante |
|   path   |  como string, mas também aceita barras |
|   any    |  corresponde a um dos itens fornecidos |
|   uuid   |  aceita strings UUID |

Acabamos de definir duas rotas, quando o usuário acessar `localhost:5000/data` ele irá acessar a pagina data, bem óbvio né.
já na `/user/<username>` você deverá passar um argumento, então podemos acessar da seguinte maneira `localhost:5000/user/<argument>`.
e eu terei o retorno o username digitado via GET, no meu caso colocarei heaven no argumento.
`User heaven`

para passar um conversor a sintax é assim
