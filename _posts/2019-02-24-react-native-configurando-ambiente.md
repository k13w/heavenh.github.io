---
title:  "React Native -#1 Configurando o ambiente via device-android"
date:   2019-02-24 13:22:24
categories: [learn]
tags: [react-native]
---
Depois de pesquisar por conteudo bom ensinando a configurar um ambiente react-native e nao achar, resolvi fazer eu mesmo e
debugando erro por erro, vamos lá consegui resumi um tópico eficiente

Pacotes que iramos precisar para rodar o react-native:

``` ruby
- Node js
- Jdk8
- Android studio(Android SDK, Android SDK Platform)
```
Configurando variaveis de ambiente:

1° - Crie uma nova variavel de ambiente com o nome "ANDROID_HOME" e coloque o path do android-sdk

O SDK é instalado, por padrão no seguinte caminho

``` ruby
C:\Users\<username>\AppData\Local\Android\Sdk
```

2° - Crie uma variavel de ambiente com o nome "JAVA_HOME" e coloque o path do java-jdk

``` ruby
C:\Program Files\Java\jdk1.8.0_201
```

3° - Adicione um novo caminho no PATH para o platform-tools

``` ruby
C:\Users\<username>\AppData\Local\Android\Sdk\platform-tools
```

Abra a pasta do seu projeto e va para -> Android
Crie um arquivo com o nome
``` ruby
local.properties
```
Abra o arquivo e coloque esse caminho de acordo com seu OS

Windows:
``` ruby
sdk.dir = C:\\Users\\<username>\\AppData\\Local\\Android\\sdk
```
macOS: 
``` ruby
sdk.dir = /Users/<username>/Library/Android/sdk
```
linux:
``` ruby
sdk.dir = /home/<username>/Android/Sdk
```

Feito isso vamos instalar o react-native-cli

Abra o terminal e rode um
``` ruby
npm install -g react-native-cli
```

Agora vamos criar nosso projeto:
``` ruby
react-native init moon
cd react-native init moon
react-native run-android
```

Feito isso você deve se deparar com a tela inicial do react-native no seu celular
