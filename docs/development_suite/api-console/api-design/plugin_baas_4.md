# Custom Microservice in Node.js

In addition to standard components (e.g., CRUD), the platform can include components that encapsulate ad-hoc logics that are autonomously developed and integrated: they are called **Custom Microservices**. A Custom Microservice (**CM**) is a service that receives HTTP requests, whose cycle of use and deploy is managed by the platform.  


A CM encapsulates ad-hoc business logics that can be developed by any user of the platform and potentially in any programming language. However, to facilitate its adoption and use, Mia-Platform team has created a `custom-plugin-lib`, a library in [node.js](https://github.com/mia-platform/custom-plugin-lib),based on the [fastify](https://fastify.io) library. Using `custom-plugin-lib` it is possible to create a CM by implementing the following steps:

* [HTTP Routes handler](#rotte)
* [changing the behaviour according to the client that is making the request, whether the user is logged in and its belonging groups](#identificazione-utente-e-client)
* [requests to other services or CM of the platform](#interrogazioni-ad-endpoint-e-servizi-della-piattaforma)
* [PRE and POST decorators](#decoratori-di-pre-e-post)

In the remaining part of this guide it will be described how to develop, test and deploy a CM in Node.js withing the platform ecosystem using the `custom-plugin-lib` library.

## Installation and Bootstrap

To start developing it is necessary to have installed `node.js` on your laptop and to initialize a node project with the following commands:


```bash
mkdir my-custom-plugin
cd my-custom-plugin
npm init -y
```

Aprire il file `package.json` e modificare opportunamente i campi `name`, `description`.
Il campo `version` all'inzio è meglio valorizzarlo a `0.0.1`.

`custom-plugin-lib` può essere installata usando `npm`, assieme alla sua dipendenza `fastify-cli`, necessaria per l'avvio
e l'esecuzione del CM

```bash
npm i --save @npm-mia-platform/libraries-custom-plugin fastify-cli
```

La libreria può essere utilizzata per istanziare un server HTTP
in questo modo, incollando il questo pezzo di codice in un file, nominandolo `index.js`

```js
process.env.USERID_HEADER_KEY=''
process.env.GROUPS_HEADER_KEY=''
process.env.CLIENTTYPE_HEADER_KEY=''
process.env.BACKOFFICE_HEADER_KEY=''
process.env.MICROSERVICE_GATEWAY_SERVICE_NAME=''

const customPlugin = require('@mia-platform/custom-plugin-lib')()

module.exports = customPlugin(async service => {

  // alle richieste in GET sulla rotta /status/alive
  // rispondi con l'oggetto JSON { "status": "ok" }
  service.addRawCustomPlugin(
    'GET',
    '/status/alive',
    async (request, reply) => ({
      status: 'ok'
    })
  )
})
```

Per avviare il CM è sufficiente modificare il file `package.json` in questo modo
```js
  //...
  "scripts": {
    // ...  
    "start": "fastify start src/index.js",
```
eseguire un ```npm start``` ed aprire un browser alla url [`http://localhost:3000/status/alive`](http://localhost:3000/status/alive),
per ottenere una risposta.

## Factory esposta da `custom-plugin-lib`  

`custom-plugin-lib` esporta una funzione la quale crea l'infrastruttura pronta ad accogliere la definizione
di rotte e decoratori. Questo estratto di codice ne esemplifica l'utilizzo.
```js
const customPlugin = require('@mia-platform/custom-plugin-lib')()

module.exports = customPlugin(function(service) { })
```
L'argomento della funzione `customPlugin` è una **funzione di dichiarazione** il cui argomento è un oggetto che permette
di definire rotte e decoratori.


## Rotte

`custom-plugin-lib` permette di definire il comportamento del CM in risposta ad una richiesta HTTP, in stile dichiarativo.
A tal fine si utilizza la funzione `addRawCustomPlugin` esposta dal primo argomento della funzione di dichiarazione.
```js
service.addRawCustomPlugin(httpVerb, path, handler, schema)
```
i cui argomenti sono, nell'ordine

* `httpVerb` - il verbo HTTP della richiesta (e.g., `GET`)
* `path` - il path della rotta (e.g., `/status/alive`)
* [`handler`](#handlers) - funzione che contiene il vero e proprio comportamento. Deve rispettare la stessa interfaccia definita nella
documentazione degli handler di [fastify](https://www.fastify.io/docs/latest/Routes/#async-await).
* [`schema`](#schema-e-documentazione-di-una-rotta) - definizione dello schema dati di richiesta e risposta.
Il formato è quello accettato da [fastify](https://www.fastify.io/docs/latest/Validation-and-Serialization)


#### Esempio
```js
const customPlugin = require('@mia-platform/custom-plugin-lib')()

// comportamento in risposta all'interrogazione
async function aliveHandler(request, reply) {
  return { status: 'ok' }
}

// schema della risposta
const aliveSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      }
    }
  }
}

// wiring e dichiarazione delle rotte
module.exports = customPlugin(async function(service) {
  service.addRawCustomPlugin('GET', '/status/alive', aliveHandler, aliveSchema)
})
```

## Handlers

Un `handler` è una funzione che rispetta l'interfaccia degli handler di [fastify](https://www.fastify.io/docs/latest/Routes/) ed
accetta una [Request](https://www.fastify.io/docs/latest/Request/) ed una [Reply](https://www.fastify.io/docs/latest/Reply/).
Oltre all'interfaccia di Request di fastify, `custom-plugin-lib` decora l'istanza Request con informazioni legate alla Piattaforma come
l'`id` utente correntemente loggato, i suoi gruppi, il tipo di client che ha eseguito la richiesta HTTP e se la richeista proviene dal CMS.
Inoltre l'istanza di Request è decorata anche con metodi che permettono di eseguire richieste HTTP verso altri servizi
rilasciati all'interno della Piattaforma.

### Identificazione Utente e Client

L'istanza di `Request` (il primo argomento di un handler) viene decorato con le funzioni

* `getUserId` - espone l'`id` dell'utente, se loggato o `null`
* `getGroups` - espone un array contenente stringhe che identificano i gruppi di appartenenza dell'utente loggato
* `getClientType` - espone il tipo di client che ha eseguito la richiesta HTTP
* `isFromBackOffice` - espone un booleano per discriminare se la richiesta HTTP proveniente dal CMS

#### Esempio
```js
async function helloHandler(request, reply) {
  // accesso all'id dell'utente (passato come
  // header all'interno della piattaforma)
  return `Hello ${request.getUserId()}`
}
```

### Interrogazioni ad Endpoint e Servizi della Piattaforma

Sia dall'istanza di `Request` (il primo argomento di un handler) sia dell'istanza di `Service` (il primo argomento della funzione di dichiarazione) è possibile ottenere un oggetto proxy per interrogare
gli altri endpoint o servizi che compongono la Piattaforma. Questi proxy si fanno carico di trasmettere gli header della
Piattaforma automaticamente. Esistono due tipi di proxy, ritornati da due funzioni distinte:

* `getServiceProxy(options)` - proxy che passa per `microservice-gateway`
* `getDirectServiceProxy(serviceName, options)` - proxy diretto al servizio

La differenza fondamentale tra i due proxy è che il primo attiva tutte le logiche che sono censite in `microservice-gateway`,
mentre il secondo no. Ad esempio, se una risorsa esposta dal servizio CRUD è protetta da ACL, questa protezione verrà
bypassata utilizzando il proxy diretto.

Per il proxy diretto è necessario specificare il `serviceName` del servizio da interrogare. La porta non può essere specificata nel `serviceName` ma deve essere passata nel campo `port` delle `options`. Nel caso di `getServiceProxy`, non si deve, invece, specificare il nome del servizio in quanto è implicitamente quello del `microservice-gateway`.
Il parametro `options` è un oggetto con i seguenti campi opzionali:

* `port` - un intero che identifica la porta del servizio da interrogare
* `protocol` - una stringa che identifica il protocollo da usare (sono supportati solo 'http' e 'https')
* `headers` -  un oggetto che rappresenta l'insieme degli header da inoltrare al servizio
* `prefix` - una stringa che rappresenta il prefisso del path delle chiamate al servizio 

Potenzialmente, il metodo `getDirectServiceProxy`, permette di interrogare anche servizi esterni alla piattaforma. In questo caso, però è necessario tener presente che verranno automaticamente inoltrati gli header di piattaforma.

Entrambi i proxy, di default, inoltrano al servizio chiamato i quattro `mia-headers`. Per fare ciò è necessario che siano presenti le seguenti variabili d'ambiente: 

* `USERID_HEADER_KEY`
* `GROUPS_HEADER_KEY`
* `CLIENTTYPE_HEADER_KEY`
* `BACKOFFICE_HEADER_KEY`

I valori di queste variabili devono specificare la chiave dei quattro `mia-headers`.

Inoltre, è possibile inoltrare al servizio chiamato anche altri headers della richiesta originale. Per fare ciò è necessario definire una ulteriore variabile d'ambiente, `ADDITIONAL_HEADERS_TO_PROXY`, il cui valore deve essere una stringa contente le chiavi degli headers da inoltrare separati da una virgola.

Entrambi i proxy espongono le funzioni

* `get(path, querystring, options)`
* `post(path, body, querystring, options)`
* `put(path, body, querystring, options)`
* `patch(path, body, querystring, options)`
* `delete(path, body, querystring, options)`

Gli argomenti da passare a queste funzioni sono:

* `path` - una stringa che identifica la rotta a cui si desidera inviare la richiesta
* `body` - facoltativo, il body della richiesta che può essere:
    * un oggetto JSON
    * un [Buffer](https://nodejs.org/api/buffer.html#)
    * uno [Stream](https://nodejs.org/api/stream.html)
* `querystring` - facoltativo, un oggetto che rappresenta la querystring
* `options` - facoltativo, un oggetto che ammette i seguenti campi:
    * `returnAs` - una stringa che identifica il formato con cui si desidera ricevere la risposta. Può essere `JSON`, `BUFFER` o `STREAM`. Default `JSON`.
    * `allowedStatusCodes` - un array di interi che definisce quali status code della risposta sono accettati. Se lo status code di risposta non è contenuto in questo array, la promise verrà rifiutata con un errore da cui sarà possibile accedere alla risposta tramite `error.response`. Se questo parametro viene omesso sarà accettato qualsiasi codice di risposta.

#### Esempio
```js
// esempio di post ad un endpoint
async function tokenGeneration(request, response) {
  // ...
  const crudProxy = request
    .getServiceProxy()
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })
  // ...
}
```
```js
// esempio di post ad un endpoint bypassando il proxy
async function tokenGeneration(request, response) {
  // ...
  const crudProxy = request
    .getDirectServiceProxy('crud-service')
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })
  // ...
}
```

## Decoratori di PRE e POST

Tramite `custom-plugin-lib` è possibile dichiarare decoratori di PRE e di POST. Dal punto di vista concettuale, un decoratore
di (1) PRE o di (2) POST è una trasformazione applicata da `microservice-gateway` rispettivamente a (1) una richiesta indirizzata
verso un servizio (**richiesta originale**) oppure (2) alla risposta (**risposta originale**) che questo servizio invia al
chiamante. Dal punto di vista pratico, i decoratori sono implementati come richieste HTTP in `POST` verso un CM specificato.

La dichiarazione di un decoratore utilizzando `custom-plugin-lib` avviene in maniera simile alla dichiarazione di una rotta

* `service.addPreDecorator(path, handler)`
* `service.addPostDecorator(path, handler)`

#### Esempio
```js
module.exports = customService(async function(service) {
  // handler in questo caso è specificato in maniera simile come per le rotte
  service.addPreDecorator('/is-valid', handler)
})
```

### Accesso e Manipolazione della Richiesta Originale
Le funzioni utilità esposte dall'istanza `Request` (il primo parametro di un handler) servono per accedere alla richiesta originale

* `getOriginalRequestBody()` - ritorna il body della richiesta originale
* `getOriginalRequestHeaders()` - ritorna gli headers della richiesta originale
* `getOriginalRequestMethod()` - ritorna il metodo della richiesta originale
* `getOriginalRequestPath()` - ritorna il path della richiesta originale
* `getOriginalRequestQuery()` - ritorna la querystring della richiesta originale

Oltre ai metodi descritti sopra, l'istanza di `Request` espone un'interfaccia per modificare la richiesta originale, la quale che verrà
inoltrata da `microservice-gateway` al servizio target. Questa interfaccia è accessibile utilizzando il metodo dell'istanza `Request`
`changeOriginalRequest` il quale ritorna un oggetto con i seguenti metodi:

* `setBody(newBody)` - modifica il body della richiesta originale
* `setHeaders(newHeaders)` - modifica gli headers della richiesta originale
* `setQuery(newQuery)` - modifica la querystring della richiesta originale

Per lasciare invariata la richiesta originale, invece, viene utilizzata la funzione `leaveOriginalRequestUnmodified`.

In tutti i casi l'handler di un decoratore PRE deve ritornare o l'oggetto ritornato da `changeOriginalRequest` oppure l'oggetto ritornato da `leaveOriginalRequestUnmodified`.

### Esempio di Decoratore di PRE
```js
// questo decoratore di PRE legge un header della richiesta originale
// e lo converte in parametro della querystring
async function attachTokenToQueryString(request, response) {
  const originalHeaders = request.getOriginalRequestHeaders()
  const token = originalHeaders['x-token']

  if(token) {
    return request
      .changeOriginalRequest()
      .setQuery({ token })
  }
  // in caso il token non sia stato specificato negli headers
  // si lascia invariata la richiesta originale
  return request.leaveOriginalRequestUnmodified()
}
```

### Accesso e Manipolazione della Risposta Originale

Come per la richiesta original, l'istanza `Request` (il primo parametro di un handler) viene decorato con funzioni utili per
accedere anche alla risposta originale

* `getOriginalResponseBody()`
* `getOriginalResponseHeaders()`
* `getOriginalResponseStatusCode()`

Oltre alle funzioni descritte sopra, l'istanza `Request` espone un'interfaccia per modificare la risposta originale, la quale che verrà
inoltrata da `microservice-gateway` al client chiamante. Questa interfaccia è accessibile utilizzando la funzione
`changeOriginalResponse` concatenandola con invocazioni alle funzioni

* `setBody(newBody)` - modifica il body della risposta originale
* `setHeaders(newHeaders)` - modifica gli headers della risposta originale
* `setQuery(newQuery)` - modifica la querystring della risposta originale
* `setStatusCode(newStatusCode)` - modifica lo status code della risposta originale

Per lasciare invariata la risposta originale, invece, viene utilizzata la funzione `leaveOriginalResponseUnmodified`.

In tutti i casi l'handler di un decoratore PRE deve ritornare o l'oggetto ritornato da `changeOriginalResponse` oppure l'oggetto ritornato da `leaveOriginalResponseUnmodified`.

### Esempio di Decoratore di POST
```js
// questo decoratore di POST legge un token dal body della risposta orginale
// e lo converte in header.
async function attachTokenToHeaders(request, response) {
  const originalBody = request.getOriginalResponseBody()
  const token = originalBody.token

  if(token) {
    return request
      .changeOriginalResponse()
      .setHeaders({
        ...request.getOriginalResponseHeaders(),
        "x-token": token,
      })
  }
  // in caso il token non sia presente nel body della risposta
  // si lascia invariata la risposta originale
  return request.leaveOriginalResponseUnmodified()
}
```

### Stop della Catena dei Decoratori

Tramite `microservice-gateway` è possibile definire una catena sequenziale di decoratori, in modo che l'output di un
singolo decoratore viene passato al decoratore successivo. In casi particolari, tuttavia, può  essere necessario
interrompere la catena e ritornare una risposta al chiamante originale.

A tal fine, l'istanza `Request` (il primo argomento di un handler) espone la funzione
```js
abortChain(finalStatusCode, finalBody, finalHeaders)
```

#### Esempio
```js
// questo decoratore di PRE verifica che sia presente un token
// nell'header della richiesta originale. Se non è presente
// interrompe la catena restituendo un error 401 al client
async function validateToken(request, response) {
  const headers = request.getOriginalResponseHeaders()
  const token = headers['x-token']
  if(!token) {
    return request.abortChain(401)
  }
  return request.leaveOriginalRequestUnmodified()
}
```

## Schema e Documentazione di una Rotta

Un CM sviluppato con `custom-plugin-lib` espone automaticamente anche la documentazione delle rotte e dei decoratori che
sono implementati. La documentazione viene specificata usando lo standard [OpenAPI 2.0](https://swagger.io/specification/v2/)
ed esposta tramite [Swagger](https://swagger.io). Una volta avviato il CM, la sua documentazione è accessibile all'indirizzo
rotta [`http://localhost:3000/documentation`](http://localhost:3000/documentation). La specifica dello schema delle richieste
e delle risposte di una rotta deve essere conforme al formato accettato da
[fastify](https://www.fastify.io/docs/latest/Validation-and-Serialization).

### Esempio
```js
const schema = {
  body: {
    type: 'object',
    properties: {
      someKey: { type: 'string' },
      someOtherKey: { type: 'number' }
    }
  },

  querystring: {
    name: { type: 'string' },
    excitement: { type: 'integer' }
  },

  params: {
    type: 'object',
    properties: {
      par1: { type: 'string' },
      par2: { type: 'number' }
    }
  },

  headers: {
    type: 'object',
    properties: {
      'x-foo': { type: 'string' }
    },
    required: ['x-foo']
  }
}
```

## Variabili d'Ambiente

Come ogni servizio della Piattaforma, un CM deve essere predisposto per essere rilasciato in ambienti diversi, a partire
dall'ambiente locale (la macchina di sviluppo) fino agli ambienti di sviluppo, test e produzione. Le differenze tra vari
ambienti sono gestite tramite il meccanismo delle variabili d'ambiente.

Per avviare un CM sviluppato con `custom-plugin-lib` è necessario che siano disponibili al processo `nodejs` le variabili
d'ambiente

```bash
USERID_HEADER_KEY=miauserid
GROUPS_HEADER_KEY=miausergroups
CLIENTTYPE_HEADER_KEY=miaclienttype
BACKOFFICE_HEADER_KEY=isbackoffice
MICROSERVICE_GATEWAY_SERVICE_NAME=microservice-gateway
```

Tra queste variabili, quella più interessante è `MICROSERVICE_GATEWAY_SERVICE_NAME`, che contiene il nome di rete (o indirizzo IP)
al quale è accessibile `microservice-gateway` e viene letta durante la [comunicazione con con gli altri servizi](#interrogazioni-ad-enpoint-e-servizi-della-piattaforma) interni
alla Piattaforma. L'implicazione è che `MICROSERVICE_GATEWAY_SERVICE_NAME` rende possibile la configurazione del proprio CM in locale
per interrogare una specifica installazione della Piattaforma. Ad esempio

```bash
MICROSERVICE_GATEWAY_SERVICE_NAME=dev.instance.example/v1/
```

Oltre a quelle obbligatorie, tramite `custom-plugin-lib` è possibile definire altre variabili d'ambiente in base alle
esigenze del singolo CM, per poi accedervi ed utilizzarne i valori nel codice degli handlers. Per la definizione si
usa il formato [JSON schema](http://json-schema.org/).

Nel caso in cui al CM non venga fornito il corretto set di variabili d'ambiente,
il CM non parte restituendo in output quale variabile d'ambiente manca.


### Esempio
```js
// la variabile d'ambiente VARIABLE deve essere disponibile al processo
const serverSchema = {    
  type: 'object',
  required: ['VARIABLE'],  
  properties: {  
    VARIABLE: {  
      type: 'string',  
    },  
  },  
}  
const customPlugin = require('@mia-platform/custom-plugin-lib')(serverSchema)

module.exports = customPlugin(async service => {
  // nel config di service si
  // possono trovare le variabili
  // d'ambiente dichiarate
  const VARIABILE = service.config.VARIABILE

  service.addRawCustomPlugin(
    'GET',
    '/variable',
    async function (request, reply) {
      return {
        // è possibile accedere alla configurazione tramite `this.config`
        secret: this.config.VARIABLE,
      }
    }
  )
})
```

## Testing

`custom-plugin-lib` è costruita su fastify e quindi si integra con gli [strumenti di testing](https://www.fastify.io/docs/latest/Testing/)
messi a disposizione dal framework. Un esempio completo di questo tipo di test è presente online nel repository di
`custom-plugin-lib` su [Github](https://github.com/mia-platform/custom-plugin-lib/blob/master/examples/advanced/test/).

### Integration and Unit test

Il testing di un CM costruito con `custom-plugin-lib` può essere effettuato a più livelli di astrazione. Una delle
possibilià è quella di utilizzare una tecnica che si chiama _fake http injection_ per la quale è possibile simulare
la ricezione di una richiesta HTTP. In questo modo si esercita tutta la logica del CM dallo strato HTTP, agli handler e
questo è un esempio di Integration Testing.

#### Esempio Integration Test

Nell'esempio sottostante il framework di test [Mocha](https://mochajs.org/).

```js
'use strict'

const assert = require('assert')

process.env.USERID_HEADER_KEY=''
process.env.GROUPS_HEADER_KEY=''
process.env.CLIENTTYPE_HEADER_KEY=''
process.env.BACKOFFICE_HEADER_KEY=''
process.env.MICROSERVICE_GATEWAY_SERVICE_NAME=''
const fastify = require('fastify')

const customPlugin = require('@mia-platform/custom-plugin-lib')()
const index = customPlugin(async service => {
  service.addRawCustomPlugin(
    'GET',
    '/status/alive',
    async (request, reply) => ({
      status: 'ok'
    })
  )
})

const createTestServer = () => {
  // silent => trace for enabliing logs
  const createdServer = fastify({ logger: { level: 'silent' } })
  createdServer.register(index)
  return createdServer
}

describe('/status/alive', () => {
  it('should be available', async () => {
    const server = createTestServer()

    const response = await server.inject({
      url: '/status/alive',
    })

    assert.equal(response.statusCode, 200)
  })
})
```

#### Esempio di Integration Test con mock delle chiamate HTTP

COMING SOON

#### Esempio di Unit Test

COMING SOON

## Organizzazione del codice

COMING SOON

## Rilascio

COMING SOON

## Log e Metriche

COMING SOON
