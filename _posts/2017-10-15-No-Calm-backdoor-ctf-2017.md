---
title:  "No Calm - BackdoorCTF 2017"
date:   2017-10-15 13:56:22
categories: [write-ups]
tags: [BackdoorCTF 2017]
---

Analisando o ELF

![anabin]({{ "../images/anabin.png" | absolute_url }})

Rodando o file.
``` ruby
$ ./challenge
Usage ./challenge <each byte of flag separated by spaces>
```

No início do programa, o número de argumentos é verificado em relação ao valor 31. Isso nos deixa com 30 argumentos que devemos fornecer 
desde que o primeiro argumento é sempre o caminho do próprio binário. Usando a saída que obtivemos anteriormente, podemos inferir que a 
flag tem um comprimento de 30 bytes. O programa continua analisando os argumentos iterando sobre eles em um loop e armazenando o primeiro 
byte de cada um em uma matriz. Em seguida, segue uma sequência muito longa de blocos:

cada byte da flag será um argumento, olhando para o código, podemos ver que cada byte da flag está sendo salvo da variável v6 a 35


ttem varias condições, faz o cmp, deduzi que cada cmp seria um byte da flag, e a teoria estava certa, com um simples solve em py
teremos a flag

mas antes, vamos pegar os cmp, para não ficar pegando um por um no radare2, vamos fazer de uma maneira mais simples e eficaz
vou mostrar duas forma de fazer isso, uma com objdump depois convertendo o hex, e outra com ida(o jeito simples)!
``` python
$objdump -d challenge | grep cmp
  400879:       83 f8 51                cmp    $0x51,%eax
  40089b:       83 f8 35                cmp    $0x35,%eax
  4008bd:       83 f8 57                cmp    $0x57,%eax
  4008e1:       83 f8 5a                cmp    $0x5a,%eax
  400903:       3d 9c 00 00 00          cmp    $0x9c,%eax
  400927:       83 f8 42                cmp    $0x42,%eax
  40094b:       83 f8 62                cmp    $0x62,%eax
  40096d:       3d 8c 00 00 00          cmp    $0x8c,%eax
  400991:       83 f8 5c                cmp    $0x5c,%eax
  4009b5:       83 f8 26                cmp    $0x26,%eax
  4009d7:       3d aa 00 00 00          cmp    $0xaa,%eax
  4009fb:       83 f8 3c                cmp    $0x3c,%eax
  400a1f:       83 f8 1d                cmp    $0x1d,%eax
  400a41:       3d a1 00 00 00          cmp    $0xa1,%eax
  400a65:       83 f8 45                cmp    $0x45,%eax
  400a89:       3d a3 00 00 00          cmp    $0xa3,%eax
  400aad:       83 f8 1b                cmp    $0x1b,%eax
  400acf:       83 f8 45                cmp    $0x45,%eax
  400af3:       3d 93 00 00 00          cmp    $0x93,%eax
  400b17:       83 f8 2b                cmp    $0x2b,%eax
  400b39:       83 f8 3b                cmp    $0x3b,%eax
  400b5d:       3d 92 00 00 00          cmp    $0x92,%eax
  400b81:       83 f8 56                cmp    $0x56,%eax
  400ba3:       83 f8 2c                cmp    $0x2c,%eax
  400bc7:       83 f8 43                cmp    $0x43,%eax
  400be9:       83 f8 59                cmp    $0x59,%eax
  400c0b:       83 f8 4b                cmp    $0x4b,%eax
  400c2f:       83 f8 75                cmp    $0x75,%eax
  400c4d:       83 f8 7d                cmp    $0x7d,%eax
  400c6b:       83 f8 7d                cmp    $0x7d,%eax
```

``` c
[0x51, 0x35, 0x57, 0x5a, 0x9c, 0x42, 0x62, 0x8c, 0x5c, 0x26, 0xaa, 0x3c, 0x1d, 0xa1, 0x45, 0xa3, 0x1b, 0x45, 0x93, 0x2b, 0x3b, 0x92, 0x56, 0x2c, 0x43, 0x59, 0x4b, 0x75, 0x7d, 0x7d]
```

``` python
python
>>> 0x51
81
>>> 0x35
53
>>> 0x57
87
```

com IDA, apenas ir na função e converter o binário em pseudo code C.

![ida]({{ "../images/ida.png" | absolute_url }})

Agora vamos fazer o solve

Podemos ver que verifica 3 bytes no momento, com 3 verificações de operação diferentes E isso se repete para todos os 3 bytes ao longo da flag

``` python
from z3 import *

def solve(a1, a2, a3):
    a = Int('a')
    b = Int('b')
    c = Int('c')
    s = Solver()
    s.add(b + a - c == a1)
    s.add(a - b + c == a2)
    s.add(b - a + c == a3)
    assert s.check() == sat
    m = s.model()
    return chr(m[a].as_long()) + chr(m[b].as_long()) + chr(m[c].as_long())

res = solve(81, 53, 87)
res += solve(90, 156, 66)
res += solve(98, 140, 92)
res += solve(38, 170, 60)
res += solve(29, 161, 69)
res += solve(163, 27, 69)
res += solve(147, 43, 59)
res += solve(146, 86, 44)
res += solve(67, 89, 75)
res += solve(117, 125, 125)

print res
```

``` ruby
$ python solve.py
$ CTF{Now_th1s_1s_t0_g3t_ANGRyy}
```
