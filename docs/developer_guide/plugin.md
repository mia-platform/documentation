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

Ogni plugin estende MIACollection. Un plugin ha senso di esistere se è necessario decorare i metodi CRUD o se è necessario implementare della logica custom.

MIACollection implementa la seguente interfaccia:

* `find(context, args, callback)` che risponde alla richiesta HTTP `GET` al path `/.*`
* `count(context, args, callback)` che risponde alla richiesta HTTP `GET` al path `/count`
* `save(context, args, callback)` che risponde alla richiesta HTTP `POST` al path `/` ed accetta come body un singolo oggetto
* `bulkSave(context, args, callback)` che risponde alla richiesta HTTP `POST` al path `/bulk` ed accetta come body un array di oggetti
* `update(context, args, callback)` che risponde alla richiesta HTTP `PUT` al path `/.*`
* `remove(context, args, callback)` che risponde alla richiesta HTTP `DELETE` al path `/.*`

Per implementare un endpoint custom è necessario aggiungere una rotta ed associarla ad una funzione come descritto nell'esempio "Hello World Plugin" sopra.
La funzione che viene invocata avrà a disposizione tre argomenti:

1. `context` il contesto della chiamata dove si può trovare ad esempio la sessione utente
2. `args` contiene i parametri di query in caso di `GET` o il body in caso di `POST` e `PUT`
3. `callback` è la funzione da chiamare per restiture la risposta. La funzione accetta due argomenti: il primo è l'errore che deve essere un oggetto con due campi `{ statusCode: number, message: string }`, ed il secondo è il body della risposta in caso di successo

## Accedere al Database

Di default ogni plugin si appoggia ad una collezione Mongo. Per configurare tale collezione è necessario configurare il file config.json, in particolare la collezione è indicata dal campo `name`, se definito, altrimenti dal campo `id`.

Per accedere alla collezione definita basterà invocare `this.store` con le seguenti funzioni.

 * `find(query, callback)`  restituisce tramite la callback un array di oggetti che rispettano la query
 * `first(query, callback)` restituisce tramite la callback il primo oggetto che rispetta la query
 * `count(query, callback)` restituisce tramite la callback il numero di oggetti che rispettano la query
 * `insert(objects, callback)` inserisce un oggetto o un array di oggetti nel DB e restituisce, tramite la callback, gli stessi oggetti con l'aggiunta dell'id assegnato
 * `update(query, object, callback)` aggiorna gli oggetti che rispettano la query modificando o aggiungendo i campi presenti in `object`, restituisce quindi, tramite la callback, l'oggetto `WriteResults` [DOC MongoDB](https://docs.mongodb.com/manual/reference/method/db.collection.update/#writeresults-update)
 * `remove(query, callback)` rimuove tutti gli oggetti che rispettano la query. Resituisce tramite la callback un oggetto siffatto: `{ "acknowledged" : true, "deletedCount" : 0 }`

La firma della callback è la seguente: `callback(error, result)`. È inoltre possibile non passare la callback ed usare la Promise che viene ritornata, ad esempio:

```
this.store.first({ name: "Francesco" })
  .then( user => {
    console.log("store.first success", user)
  })
  .catch( error => {
    console.log("store.first error", error)
  })
```

Nel metodo classico invece, usando la callback:

```
this.store.first({ name: "Francesco" }, (error, user) => {
  if (error) {
    console.log("store.first error", error)
    return
  }
  console.log("store.first success", user)
})
```

## Comunicazione tra plugin

Il plugin è disegnato per interagire con una singola collezione Mongo. È normale avere bisogno di interagire anche con altre collezioni o con altri plugin. Per comunicare con un'altra collezione le strade possibili sono due: collegarsi direttamente al database o passare per il plugin sovrastante.

Per il collegamento diretto al database bisogna creare lo store indicando la collezione Mongo di destinazione:

```
constructor(name, options) {
    super(name, options);
    this.usersStore = options.db.createStore('other_collection');
    // ...
}
```

Per comunicare invece con un altro plugin deve essere usato il componente `dpd`. Tale componente permette di accedere ad un altro plugin ed alle sue funzionalità tramite interfaccia HTTP. Con questo approccio il plugin protrebbe risiedere sulla stessa macchina e sullo stesso processo come su un'altra macchina. Le funzionalità del plugin a cui si può accedere devono essere esposte dal plugin stesso tramite interfaccia HTTP.

Di seguito un esempio di chiamata ad un altro plugin:

````
find(context, args, callback) {
  // ...

  context.dpd.otherplugin.get('plugin_feature_path', query, (result, error) => {
    // do something with plugin feature call result
    // ...
  });

  // ...
}
````

L'oggetto `dpd` espone come funzioni i verbi HTTP quindi get, post, put etc.. Il primo argomento da passare è opzionale ed indica il path relativo, è possibile ometterlo completamente ed passare direttamente il secondo argomento. Il secondo argomento è la query da passare al plugin. Il terzo ed ultimo argomento è la callback che verrà invocata a chiamata terminata.
