---
title: Serial - CSAW 2017 Quals
layout: post
---

Challenge:

Temos um servidor dando para a porta 4239, conectando via nc o servidor retornou o seguinte:
``` python
nc misc.chal.csaw.io 4239
```

``` python
8-1-1 even parity. Respond with '1' if you got the byte, '0' to retransmit. 00110011101
```

Analisar:

Depois de alguma pesquisa no google com "paridade par 8-1-1", descobri  que quando enviamos dados, podemos ter algumas vezes um erro na transmissão, então cada vez que enviamos um byte, contamos o número de "1" nesse byte e, se o número é mesmo, adicionamos "0" no nosso byte, se o número de "1" é estranho, adicionamos "1" ao nosso byte.
Exemplo:
0110 1100 0: aqui o número de "1" é 4, 4% 2 == 0, então 4 é mesmo assim, o bit de paridade deve ser 0, sem erro na transmissão
0001 0110 0: aqui o número de "1" é 3, 3% 2 == 1, então 3 é estranho, o bit de paridade deve ser 1, eles têm um erro na transmissão
0101 1110 1: aqui o número de "1" é 5, 5% 2 == 1, então 5 é estranho, o número de paridade deve ser 1, sem erro na transmissão
O N em 8-n-1 não é teste de paridade, em nosso desafio temos 8-1-1, então nós temos um teste de paridade em nosso byte.

Cada vez que temos 11 bits, o primeiro bit é sempre "0", ele é "começar", então nós temos o nosso byte (8bits), então um bit para paridade, então um bit que é sempre "1", isso significa parar

Solução:

A solução neste ponto é óbvia, em cada etapa, verificamos se eles não têm erro de transmissão contando o número de "1" em nosso byte (e somente em nosso byte não em todos os 11bits), então se corresponder ao nosso bit de paridade (antes do último bit) enviamos "1" para obter o próximo byte, caso contrário enviamos 0 para obter o byte correto.
e convertemos cada byte no caracter ascci para obter a bandeira

`solve.py`
``` python
from socket import socket, AF_INET, SOCK_STREAM
from re import compile

sock = socket(AF_INET, SOCK_STREAM)
sock.connect(('misc.chal.csaw.io', 4239))

response = compile(r'[01]{11}') # carrega os 11bits
main = sock.recv(8192) #  "8-1-1 paridade par. Responda com '1' se você obteve o byte, '0' para retransmitir.



flag = ''
solve = response.search(main)
while solve:
    string = solve.group()
    serial = string[1:9]
    parityBit = int(string[-2]) # nós convertemos em int, para comparação
    if (serial.count("1") % 2) == parityBit: # se o serial estiver certo nos envia "1"
        flag += chr(int(serial,2)) # Converter o byte em int e depois em ascii
        print flag
        sock.send("1\n")    

    else : # se o serial estiver errado, nos envia "0"
        sock.send("0\n")

    main = sock.recv(8192)
    solve = response.search(main)

print  flag
```

`The flag is : flag{@n_int3rface_betw33n_data_term1nal_3quipment_and_d@t@_circuit-term1nating_3quipment}`