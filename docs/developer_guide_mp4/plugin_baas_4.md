# Custom Plugin sulla Piattaforma 4

[TOC]

## Introduzione

Un **custom plugin** è un microservizio custom che fa parte di un deploy della piattaforma
allo stesso modo del servizio di CRUD, del Microservice Gateway, e di tutti gli altri servizi che la compongono. Questo microservizio nasce perchè spesso si ha l'esigenza di implementare, oltre a endpoint di tipo CRUD, anche **funzionalità custom**, come ad esempio logiche di business che coinvolgono una o più collezioni o servizi esterni oppure rotte di Backend for Frontend.


Nella piattaforma 4 è prevista quindi la possibilità di integrare un comportamento custom tramite _custom plugin_. Questo significa che in linea di principio qualunque microservizio (anche già esistente) può essere integrato all'interno della piattaforma.

Per facilitare lo sviluppo è stata però creata una libreria _node.js_ con un relativo template per lo sviluppo e l'integrazione del servizio all'interno della architettura MIA.
Di seguito è presentata una **guida per lo sviluppo in locale di nuove funzionalità**.

## Integrazione di un servizio già esistente

Requisiti:

* Versionamento all'interno di gitlab (a cui punta l'API Console)
* Immagine docker del servizio sul repository di immagini Nexus

A questo punto per rendere il servizio compatibile con la piattaforma ed associabile ad un endpoint con API Console, basta creare una cartella `config` nella root del progetto con all'interno un file `Dockerimage` che contiene il link all'immagine nexus.

Es:
```bash
cd /path/to/repository/root/

mkdir config
cd config
echo '<nexus-repository>/<image-path>:<revision>' > Dockerimage
```

## Libreria Custom Plugin

La libreria custom plugin di MIA permette di:

* definire nuove rotte con comportamento custom (non di tipo CRUD)
* accedere all'id e ai gruppi dell'utente
* definire decoratori di PRE o di POST
* contattare gli altri servizi della piattaforma
* scrivere logiche testabili in modo autonomo rispetto alla piattaforma

### Esempio, Hello World Plugin

Una volta ottenuto l'accesso alle credenziali necessarie per scaricare la libreria, la si può installare (installeremo anche fastify-cli per lanciare il plugin):
```bash
npm i @npm-mia-platform/libraries-custom-plugin fastify-cli --save
```

A questo punto si può creare il plugin di helloworld creando il file `index.js` con il seguente contenuto:
```js
const customService = require('@mia-platform/custom-plugin-lib')()

module.exports = customService(async function index(service) {
  service.addRawCustomPlugin('GET', '/hello/', async function handler(req) {
    return `Hello ${req.getUserId() || 'World'}`
  })
})
```

*Nota: ricordarsi di mettere lo slash in fondo al nome dell'endpoint altrimenti torna 404 Not Found*

La libreria è in grado di estrarre dalla richiesta alcune informazioni legate alla piattaforma, quali l'id utente (`null` se non loggato), i gruppi, etc.
I metodi della richiesta aggiunti dalla libreria sono anche forniti durante l'autocompletamento per accelerare lo sviluppo.

Una volta settate le variabili d'ambiente è possibile lanciare in locale il servizio:
```
set -a && source default.env
npm start
```

### Interrogare altri servizi della piattaforma
Dalla richiesta dei custom plugin è anche possibile ottenere dei proxy per interrogare gli altri microservizi che compongono la piattaforma.
Questi proxy si fanno carico di trasmettere gli header della piattaforma automaticamente.
Ci sono due possibilità:

* ottenere un proxy che passa per il microservice-gateway (per avere anche l'ACL, e tutti i decoratori di PRE e di POST), chiamando il seguente metodo:
```js
const proxy = req.getServiceProxy()
const res = await proxy.get('/heroes/')
```
* ottenere un proxy diretto al servizio. In tal caso ACL e altri decoratori non vedranno questa richiesta.
```js
const proxy = req.getDirectServiceProxy('service-name')
const res = await proxy.post('/heroes/', { name: 'Super' })
```

I metodi del proxy http utilizzabili sono i seguenti:

* `get(path, querystring, options)`
* `post(path, body, querystring, options)`
* `put(path, body, querystring, options)`
* `patch(path, body, querystring, options)`
* `delete(path, body, querystring, options)`

Il body può essere:

* un oggetto: serializzato in JSON
* un buffer
* uno stream

Similmente, dalle opzioni è possibile impostare il formato del body con l'opzione `returnAs`, che può assumere i valori:

* `JSON` (default): per ottenere un oggetto come body della risposta
* `BUFFER`: per avere un buffer come body della risposta
* `STREAM`: per avere nel body della risposta lo stream http

### Decoratori di PRE e POST

Si possono definire facilmente dei decoratori di PRE e POST del `Microservice Gateway` aggiungendoli al `service`.

#### Decoratore di PRE
Ad esempio per definire un decoratore di pre che aggiunge un header è sufficiente scrivere:
```js
service.addPreDecorator('/addHeader', async function handler(req) {
  const headers = req.getOriginalRequestHeaders()
  const newHeader = { new: 'header' }
  return req.changeOriginalRequest()
    .setHeaders({ ...headers, ...newHeader })
})
```

I metodi per recuperare le informazioni sulla chiamata sono i seguenti:

* `req.getOriginalRequestBody()`
* `req.getOriginalRequestHeaders()`
* `req.getOriginalRequestMethod()`
* `req.getOriginalRequestPath()`
* `req.getOriginalRequestQuery()`


Mentre per modificare la richiesta, come da esempio dopo `changeOriginalRequest` si possono concatenare i seguenti metodi:

* `setBody(<new body>)`
* `setHeaders(<new headers>)`
* `setQuery(<new query>)`

#### Decoratore di POST
Similmente si può aggiungere un decoratore di POST, con il metodo `addPostDecorator`.
Di seguito si definisce ad esempio un decoratore di POST che manda il body di risposta ad un servizio ma non modifica la risposta alla richiesta originale:

```js
service.addPostDecorator('/saveResponse', async function handler(req) {
  const proxy = req.getServiceProxy()
  await proxy.post('/responses/', req.getOriginalResponseBody())
  return req.leaveOriginalResponseUnmodified()
})
```

In aggiunta ai metodi per ottenere la richiesta e modificare la risposta come nel decoratore di PRE, sono disponibili i seguenti metodi per recuperare informazioni sulla risposta:

* `req.getOriginalResponseBody()`
* `req.getOriginalResponseHeaders()`
* `req.getOriginalResponseStatusCode()`

Sia per i decoratori di PRE che per quelli di POST è possibile interrompere la catena di decoratori e ritornare una risposta arbitraria tramite il metodo `abortChain`:

```js
return req.abortChain({<finalStatusCode>, <finalBody>, <finalHeaders>})
```
