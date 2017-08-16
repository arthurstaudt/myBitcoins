#myBitcoins - Chrome Extension

*Essa extensão tem como objetivo acompanhar em tempo real a valorização/desvalorização
do bitcoin no Mercado Bitcoin.*

###Instalação do Projeto

1 - Executar npm (bower, gulp):
```sh
npm install
```

2 - Copiar Jquery, crypto e bootstrap (js, css)
```sh
npm run production
```

3 - Renomear arquivo `app/env_example.json` para `app/env.json`

4 - Inserir TAPI_ID, SECRET e PIN no arquivo `app/env.json`


###Instalação no Google Chrome

*Importar somente a pasta `app/` do projeto nas Extensões do Chrome:*
- [chrome://extensions](chrome://extensions)

***Obs:** Caso não veja a opção para importar uma extensão, selecione o modo desenvolvedor.*