[TOC]

## Introduzione
Su Mia Platform è possibile rilasciare un sito statico (HTML, CSS, JavaScript) che interagisce con le API della 
piattaforma. Un esempio è [https://www.mia-platform.eu/](https://www.mia-platform.eu/)

A differenza delle API CRUD, descritte nella sezione [API](api.md), le *plugins* sono un contenitore di codice
custom *node.js* che risponde ad un endpoint API e consentono di:

Il concetto è semplice: le risorse statiche sono servite dall'endpoit sotto custom_themes e lato JavaScript 
sono invocati gli endpoint a runtime.

## Esempio, Hello World theme

Per realizzare un tema:
 - creare una directory con il nome del tema
 
```
mkdir -p app_hello/public
cd app_hello
```

 - creare un file config.json con il seguente contenuto
 
```
{
  "id": "hello",
  "type": "MIATheme",
  "system": true,
  "internal": true,
  "collection": false,
  "extendable": false,
  "configurable": false
}
```

 - copiare in public la build statica, con il file index.html
 
```
 <!DOCTYPE html>
 <html>
 <head>
   <title>MakeItApp - BaaS - Hello</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 </head>
 
 <body>
   <p>Hello!!!!</p>
 </body>
 
 </html>
```

 - copiare app_hello in custom_themes e riavviare la piattaforma

```
 cp -rf app_hello custom-themes
 docker exec -it <dockerid> pm2 restart 0
```

 - chiamare l'endpoint [https://preprod.baas.makeitapp.eu/hello](https://preprod.baas.makeitapp.eu/hello)

 


