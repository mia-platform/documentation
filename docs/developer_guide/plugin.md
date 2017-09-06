[TOC]

## Introduzione
A differenza delle API CRUD, descritte nella sezione [API](api.md), le *plugins* sono un contenitore di codice
custom *node.js* che risponde ad un endpoint API e consentono di:

- definire una o più route, ognuna con una o più funzioni di handler;
- definire l'ACL per ogni handler;
- accedere alle proprietà dell'utente che ha fatto la login nel caso che l'endpoint lo richieda;
- accedere ai dati salvati su mongo DB;
- accedere ai servizi di files, push notifications, email marketing e altri servizi che saranno in futuro disponibili;
- scrivere logiche complesse, testabili in modo autonomo.

Una plugin, è installabile nella directory custom_plugins. Una volta installata è necessario fare restart di 
Mia Platform.

Segue una guida dettagliata per scrivere una plugin.

## Esempio, Hello World plugin

Per realizzare un plugin:
 - creare una directory con il nome della plugin
 
 ```
 mkdir plugin_hello
 cd plugin_hello
 ```
 
 - creare un file index.js con il seguente contenuto

```
const MIACollection = require('mia-collection');

class MIAPluginHello extends MIACollection {
  initializeRoutes() {
    super.initializeRoutes();
    const router = this.getRouter();
    router.add('/hello', 'GET', 'sayHello', {
      async: true,
      acl_name: 'read',
    });
  }

  sayHello(context, args, callback) {
    const name = args.name || 'no name';
    this.log('info', name);
    callback(null, 'Hello ' + name + ' !');
  }
}

module.exports = MIAPluginHello;

```
 - creare un file config.json con il seguente contenuto
 ```
 {
   "id": "helloworld",
   "type": "MIAPluginHello",
   "system": true,
   "internal": true,
   "collection": false,
   "extendable": false,
   "configurable": false,
   "special": false,
   "cmsProperties": {
     "label": "Hello",
     "layoutType": "table",
     "category": {
       "name": "Undefined",
       "order": 0
     },
     "hidden": true,
     "cmsOrder": 0,
     "blocked": true,
     "icon": "book"
   }
 }
 ```
 - copiare plugin_hello in custom_plugins e riavviare la piattaforma
 ```
 cp -rf plugin_hello custom_plugins
 docker exec -it <dockerid> pm2 restart 0
 ```
 - chiamare l'endpoint

```
curl -X GET https://preprod.baas.makeitapp.eu/helloworld/hello?name=Groot -H "secret: secret"

```

 - la risposta è

```
Hello Groot !
```

## Anamnesi di una Plugin

## Accedere al Database
 - find
 - count
 - insert
 - update
 - remove
 


