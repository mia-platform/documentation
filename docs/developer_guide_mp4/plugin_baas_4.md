# Custom Plugin in Node.js

Oltre ai componenti e servizi standard (e.g., CRUD), la piattaforma accoglie componenti che incapsulano logiche ad-hoc, 
sviluppati ed integrabili in autonomia: i **Custom Plugin**. Un Custom Plugin (**CP**) è a tutti gli effetti un servizio
che riceve richieste HTTP, il cui ciclo di vita, utilizzo e rilascio è governato dalla piattaforma. 

Un CP incapsula logiche di business ad-hoc, sviluppabili da qualsiasi utilizzatore della piattaforma
e può potenzialmente essere scritto in qualsiasi linguaggio di programmazione. Tuttiavia, per facilitarne adozione 
e sviluppo, il team di Mia-Platform ha creato `custom-plugin-lib`, una libreria in [Node.js](https://github.com/mia-platform/custom-plugin-lib), 
basata sulla libreria [fastify](https://fastify.io). Utilizzando `custom-plugin-lib` è possibile creare un CP implementando:

* [handler di rotte HTTP](#rotte)
* [cambiare comportamento in base alle informazioni di quale client ha effetuato la richiesta, dell'utente loggato e dei suoui gruppi di appartenenza](#identificazione-utente-e-client)
* [richieste ad altri servizi o CP della piattaforma](#interrogazioni-ad-enpoint-e-servizi-della-piattaforma)
* [decoratori di PRE o di POST](#decoratori-di-pre-e-post)

Nel resto di questa guida viene descritto come sviluppare, testare, rilasciare un CP in Node.js all'interno della piattaforma, 
utilizzando la libreria `custom-plugin-lib`.

## Installazione e Bootstrap

`custom-plugin-lib` può essere installata usando `npm`, assieme alla sua dipendenza `fastify-cli`, necessaria per l'avvio
e l'esecuzione del CP

```bash
npm i @npm-mia-platform/libraries-custom-plugin fastify-cli --save
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
  service.addRawCustomPlugin('GET', 
                             '/status/alive', 
                             async (request, reply) => ({ 
                               status: 'ok' 
                             }))
})
```

Per avviare il CP è sufficiente modificare il file `package.json` in questo modo
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

`custom-plugin-lib` permette di definire il comportamento del CP in risposta ad una richiesta HTTP, in stile dichiarativo. 
A tal fine si utilizza la funzione `addRawCustomPlugin` esposta dal primo argomento della funzione di dichiarazione.
```js
service.addRawCustomPlugin(httpVerb, path, handler, schema)
```
i cui argomenti sono, nell'ordine

* `httpVerb` - il verbo HTTP della richiesta (e.g., `GET`)
* `path` - il path della rotta (e.g., `/status/alive`)
* [`handler`](#handlers) - funzione che contiene il vero e proprio comportamento. Deve rispettare la stessa interfaccia definita nella
documentazione degli handler di [Fastify.io](https://www.fastify.io/docs/latest/Routes/#async-await).
* [`schema`](#schema-e-documentazione-di-una-rotta) - definizione dello schema dati di richiesta e risposta. 
Il formato è quello accettato da [Fastify.io](https://www.fastify.io/docs/latest/Validation-and-Serialization)


#### Esempio
```js
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

Un `handler` è una funzione che rispetta l'interfaccia degli handler di [Fastify.io](https://www.fastify.io/docs/latest/Routes/) ed
accetta una [Request](https://www.fastify.io/docs/latest/Request/) ed una [Reply](https://www.fastify.io/docs/latest/Reply/). 
Oltre all'interfaccia di Fastify.io, `custom-plugin-lib` decora l'oggetto della request con informazioni legate alla piattaforma, come
ad esempio l'`id` utente oppure i gruppi, ed anche con l'interfaccia che permette di eseguire richieste HTTP verso altri servizi
rilasciati all'interno della piattaforma.

### Identificazione Utente e Client

L'argomento `request` di un handler (il primo) viene decorato con le funzioni

* `getUserId` - espone l'`id` dell'utente, se loggato
* `getGroups` - espone il gruppo di appartenenza dell'utente, se loggato
* `getClientType` - espone il typo di client origine della richiesta HTTP
* `isFromBackOffice` - flag per discriminare la richiesta HTTP come proveniente da CMS

#### Esempio
```js
async function helloHandler(request, reply) {
  // accesso all'id dell'utente (passato come 
  // header all'interno della piattaforma)
  return `Hello ${request.getUserId()}`
}
```

### Interrogazioni ad Enpoint e Servizi della Piattaforma

Dall'argomento `request` di un handler (il primo) è possibile ottenere dei proxy per interrogare 
gli altri endpoint o servizi che compongono la piattaforma. Questi proxy si fanno carico di trasmettere gli header della 
piattaforma automaticamente. Esistono due tipi di proxy, ritornati da due funzioni distinte

* `getServiceProxy` - proxy che passa per `microservice-gateway`
* `getDirectServiceProxy` - proxy diretto al servizio

La differenza fondamentale tra i due proxy è che il primo attiva tutte le logiche che sono censite in `microservice-gateway`,
mentre il secondo no. Ad esempio, se una risorsa esposta dal servizio CRUD è protetta da ACL, questa protezione verrà
bypassata utilizzando il proxy diretto.

Entrambi i proxy espongono le funzioni

* `get(path, querystring, options)`
* `post(path, body, querystring, options)`
* `put(path, body, querystring, options)`
* `patch(path, body, querystring, options)`
* `delete(path, body, querystring, options)`

L'argomento più rilevante nella firma di queste funzioni è `body`, il quale può essere

* un oggetto JSON
* un [Buffer](https://nodejs.org/api/buffer.html#)
* uno [Stream](https://nodejs.org/api/stream.html)

#### Esempio
```js
// esempio di post ad un endpoint
async function tokenGeneration(request, response) {
  // ...
  const result = await request
    .getServiceProxy()
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
  const result = await request
    .getDirectServiceProxy('crud-service')
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
chiamante. Dal punto di vista pratico, i decoratori sono implementati come richieste HTTP in `POST` verso un CP specificato.

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
Le funzioni utilità esposte da `request` servono per accedere alla richiesta originale

* `getOriginalRequestBody()` - ritorna il body della richiesta originale
* `getOriginalRequestHeaders()` - ritorna gli headers della richiesta originale
* `getOriginalRequestMethod()` - ritorna il metodo della richiesta originale
* `getOriginalRequestPath()` - ritorna il path della richiesta originale
* `getOriginalRequestQuery()` - ritorna la querystring della richiesta originale

Oltre alle funzioni descritte sopra, `request` espone un'interfaccia per modificare la richiesta originale, la quale che verrà 
inoltrata da `microservice-gateway` al servizio target. Questa interfaccia è accessibile utilizzando la funzione 
`changeOriginalRequest`, concatenandola con invocazioni alle funzioni

* `setBody(newBody)` - modifica il body della richiesta originale
* `setHeaders(newHeaders)` - modifica gli headers della richiesta originale
* `setQuery(newQuery)` - modifica la querystring della richiesta originale

Per lasciare invariata la richiesta originale, invece, viene utilizzata la funzione `leaveOriginalRequestUnmodified`.

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

Come per la richiesta originale l'argomento `request` di un handler (il primo) viene decorato con funzioni utili per 
accedere anche alla risposta originale

* `getOriginalResponseBody()`
* `getOriginalResponseHeaders()`
* `getOriginalResponseStatusCode()`

Oltre alle funzioni descritte sopra, `request` espone un'interfaccia per modificare la richiesta originale, la quale che verrà 
inoltrata da `microservice-gateway` al servizio target. Questa interfaccia è accessibile utilizzando la funzione 
`changeOriginalResponse`, concatenandola con invocazioni alle funzioni

* `setBody(newBody)` - modifica il body della richiesta originale
* `setHeaders(newHeaders)` - modifica gli headers della richiesta originale
* `setQuery(newQuery)` - modifica la querystring della richiesta originale

Per lasciare invariata la richiesta originale, invece, viene utilizzata la funzione `leaveOriginalResponseUnmodified`.

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
                ... request.getOriginalResponseHeaders(), 
                "x-token": token
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

A tal fine, l'argomento `request` di un handler (il primo) espone la funzione 
```js
abortChain(finalStatusCode, finalBody, finalHeaders)
```

#### Esempio
```js
// questo decoratore di PRE verifica che sia presente un token
// nell'header della richiesta originale. Se non è presente 
// interrompe la catena
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

Un CP sviluppato con `custom-plugin-lib` espone automaticamente anche la documentazione delle rotte e dei decoratori che
sono implementati. La documentazione viene specificata usando lo standard [OpenAPI 2.0](https://swagger.io/specification/v2/)
ed esposta tramite [Swagger](https://swagger.io). Una volta avviato il CP, la sua documentazione è accessibile all'indirizzo 
rotta [`http://localhost:3000/documentation`](http://localhost:3000/documentation). La specifica dello schema delle richieste 
e delle risposte di una rotta deve essere conforme al formato accettato da 
[Fastify.io](https://www.fastify.io/docs/latest/Validation-and-Serialization).

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

Come ogni servizio della Piattaforma, un CP deve essere predisposto per essere rilasciato in ambienti diversi, a partire
dall'ambiente locale (la macchina di sviluppo) fino agli ambienti di sviluppo, test e produzione. Le differenze tra vari
ambienti sono gestite tramite il meccanismo delle variabili d'ambiente.

Per avviare un CP sviluppato con `custom-plugin-lib` è necessario che siano disponibili al processo `nodejs` le variabili
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
alla Piattaforma. L'implicazione è che `MICROSERVICE_GATEWAY_SERVICE_NAME` rende possibile la configurazione del proprio CP in locale
per interrogare una specifica installazione della Piattaforma. Ad esempio

```bash
MICROSERVICE_GATEWAY_SERVICE_NAME=dev.instance.example/v1/
```

Oltre a quelle obbligatorie, tramite `custom-plugin-lib` è possibile definire altre variabili d'ambiente in base alle
esigenze del singolo CP, per poi accedervi ed utilizzarne i valori nel codice degli handlers. Per la definizione si
usa il formato [JSON schema](http://json-schema.org/).

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
  service.addRawCustomPlugin('GET', 
                             '/variable', 
                             async (request, reply) => ({
                               // nel config di service si 
                               // possono trovare le variabili
                               // d'ambiente dichiarate
                               secret: service.config.VARIABLE
                             }))
})
```

## Testing

`custom-plugin-lib` è costruita su Fastify.io e quindi si integra con gli [strumenti di testing](https://www.fastify.io/docs/latest/Testing/) 
messi a disposizione dal framework. Un esempio completo di questo tipo di test è presente online nel repository di
`custom-plugin-lib` su [Github](https://github.com/mia-platform/custom-plugin-lib/blob/master/examples/advanced/test/).

### Integration and Unit test

Il testing di un CP costruito con `custom-plugin-lib` può essere effettuato a più livelli di astrazione. Una delle
possibilià è quella di utilizzare una tecnica che si chiama _fake http injection_ per la quale è possibile simulare
la ricezione di una richiesta HTTP. In questo modo si esercita tutta la logica del CP dallo strato HTTP, agli handler e
questo è un esempio di Integration Testing.

#### Esempio Integration Test

Nell'esempio sottostante il framework di test [Mocha](https://mochajs.org/).

```js
process.env.USERID_HEADER_KEY=''
process.env.GROUPS_HEADER_KEY=''
process.env.CLIENTTYPE_HEADER_KEY=''
process.env.BACKOFFICE_HEADER_KEY=''
process.env.MICROSERVICE_GATEWAY_SERVICE_NAME=''
const fastify = require('fastify')

const customPlugin = require('@mia-platform/custom-plugin-lib')()
const index = customPlugin(async service => {
  service.addRawCustomPlugin('GET', 
                             '/status/alive', 
                             async (request, reply) => ({ 
                               status: 'ok' 
                             }))
})

const testServer = () => {
  const createdServer = fastify()
  createdServer.register(index)
  return createdServer
}

describe('/status/alive', () => {
  it('should be available', async () => {
    const response = await testServer().inject({
      url: '/status/alive',
    })
    assert(response.statusCode === 200)
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
