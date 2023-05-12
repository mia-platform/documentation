---
id: plugin_baas_4
title: Node.js Custom Plugin Lib
sidebar_label: Node.js Custom Plugin Lib
---
:::info
This library is available on [GitHub](https://github.com/mia-platform/custom-plugin-lib)
:::

In addition to standard components (e.g., CRUD), you can create your own microservices that encapsulate ad-hoc logics that are autonomously developed and integrated. Your microservice receives HTTP requests, its cycle of use and deploy is managed by the platform.  

A microservice encapsulates ad-hoc business logics that can be developed by any user of the platform and potentially in any programming language. However, to facilitate its adoption and use, Mia-Platform team has created the [Mia Service Node.js Library](https://github.com/mia-platform/custom-plugin-lib), a library in **node.js**, based on [fastify](https://fastify.io). Using `Mia Service Node.js Library` it is possible to create your own microservice by following these steps:

* [Implement HTTP routes handlers](#routes)
* [Handling different clients and users with different roles](#user-and-client-identification)
* [Sending requests to other services on the platform](#endpoint-queries-and-platform-services)
* [Implementing PRE and POST decorators](#pre-and-post-decorators)

The remaining part of this guide will describe how to develop, test and deploy your microservice in Node.js to the platform ecosystem using the `Mia Service Node.js Library` library.

## Installation and Bootstrap

### Install from Marketplace template

From the microservices area it is possible to add a new service starting from the Node.js template that is already set up and configured to use the `Mia Service Node.js Library`.

Check out the [Marketplace Documentation](/marketplace/overview_marketplace.md) for further information on how to install and bootstrap a service from a Marketplace template.

### Manual installation on a new repository

To start developing your custom service, first make sure to have Node.js installed on your local machine. Then, initialize a Node project with the following commands:

```bash
mkdir my-custom-plugin
cd my-custom-plugin
npm init -y
```

Open the `package.json` file and modify the `name`, `description` fields according to your needs.
We suggest setting the value of the `version` field to `0.0.1` to get started.

`Mia Service Node.js Library` can be installed with`npm`, along with its `fastify-cli` dependency, necessary for bootstrapping and executing the microservice.

```bash
npm i --save @mia-platform/custom-plugin-lib
```

The library can be used to instantiate an HTTP server.
To start developing with `Mia Service Node.js Library` the variables need to be available to the Node.js process environment:

* `USERID_HEADER_KEY` = miauserid
* `USER_PROPERTIES_HEADER_KEY` = miauserproperties
* `GROUPS_HEADER_KEY` = miausergroups
* `CLIENTTYPE_HEADER_KEY` = client-type
* `BACKOFFICE_HEADER_KEY` = isbackoffice
* `MICROSERVICE_GATEWAY_SERVICE_NAME` = Microservice-gateway

Among these variables, the most interesting is `MICROSERVICE_GATEWAY_SERVICE_NAME`, which contains the host name (or IP address) pointing to the `microservice-gateway` and is used for  [internal communication with other services](#endpoint-queries-and-platform-services) in your project namespace. This implies that `MICROSERVICE_GATEWAY_SERVICE_NAME` allows the user to configure their microservice to call a specific microservice inside their Mia-Platform project. For example

```Bash
MICROSERVICE_GATEWAY_SERVICE_NAME = "microservice-gateway"
```

To instantiate the HTTP server you can paste the following snippet to the service entrypoint (typically the `index.js` file).

```js
const customPlugin = require('@mia-platform/custom-plugin-lib')()
module.exports = customPlugin(async service => {

  // at the GET request on /status/alive route, respond with the JSON object { "status": "ok" }
  service.addRawCustomPlugin(
    'GET',
    '/status/alive',
    async (request, reply) => ({
      status: 'ok'
    })
  )
})
```

To start the microservice, simply edit the `package.json` file in this way

```js
//...
"scripts": {
  // ...  
  "start": "fastify start src/index.js",
  //...
```

You can now run the command `npm start` and open a browser at the url [`http://localhost:3000/status/alive`](http://localhost:3000/status/alive), to get a response.

## Factory exposed by Mia Service Node.js Library

`Mia Service Node.js Library` exports a function which creates the infrastructure to accept the definition
of routes and decorators. This code snippet illustrates its use.

```js
const customPlugin = require('@mia-platform/custom-plugin-lib')()

module.exports = customPlugin(function(service) { })
```

The argument passed to the `customPlugin` function is a **declaration function** which accepts as argument an object that allows the user
to define routes and decorators.

## Routes

`Mia Service Node.js Library` allows to define the behavior of the microservice in response to HTTP requests, in a declarative style.
For this purpose, the `addRawCustomPlugin` method is used as shown below:

```js
service.addRawCustomPlugin(httpVerb, path, handler, schema)
```

The `addRawCustomPlugin` method accepts the following parameters:

* `httpVerb` - the HTTP verb of the request (e.g.,`GET`)
* `path` - the route path (e.g.,`/status /alive`)
* [`handler`](#handlers) - function that handles the incoming request. It must respect the same interface defined in the
documentation of the handlers of [fastify](https://www.fastify.io/docs/latest/Routes/#async-await).
* [`schema`](#route-diagram-and-documentation) - definition of the request and response data schema.
The format is the one accepted by [fastify](https://www.fastify.io/docs/latest/Validation-and-Serialization)

#### Example

```js
const customPlugin = require('@mia-platform/custom-plugin-lib')()

// behavior in response to the query
async function aliveHandler(request, reply) {
  return { status: 'ok' }
}

// response schema
const aliveSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      },
    },
  },
}

// wiring and route declaration
module.exports = customPlugin(async function(service) {
  service.addRawCustomPlugin('GET', '/status/alive', aliveHandler, aliveSchema)
})
```

## Handlers

A `handler` is a function that respects the handler interface of [fastify](https://www.fastify.io/docs/latest/Routes/) and
accepts a [Request](https://www.fastify.io/docs/latest/Request/) and a [Reply](https://www.fastify.io/docs/latest/Reply/).
In addition to the fastify Request interface, `Mia Service Node.js Library` decorates the Request instance with information related to the Platform. This information includes the `id` of the user currently logged in, its groups, the type of client that performed the HTTP request and specifies whether the request comes from the CMS.
Furthermore, the Request instance is also decorated with methods that allow HTTP requests to be made to other services deployed on the Platform.

### User and Client Identification

The instance of `Request` (the first argument of a handler) is decorated with the following functions:

* `getUserId` - returns the user's id if logged in or `null` if not
* `getUserProperties` - returns the properties of the logged user if logged in, otherwise returns `null`
* `getGroups` - returns an array containing strings that identify the groups to which the logged in user belongs
* `getClientType` - returns the type of client that performed the HTTP request
* `isFromBackOffice` - returns a boolean indicating whether the HTTP request comes from the CMS

#### Example

```js
async function helloHandler(request, reply) {
  // access to the user id (passed as header inside the platform)
  return `Hello ${request.getUserId()}`
}
```

### Context

Inside the handler scope it's possible to access the service fastify instance using `this`.

#### Example

```js
module.exports = customPlugin(async function(service) {
  // decorating custom environment variable
  service.decorate('decoratedService', service.config.DECORATED_SERVICE)
  // creating custom route
  service.addRawCustomPlugin('GET', '/hello', helloHandler)
})

async function helloHandler(request, reply) {
    // `this` references the fastify context
    this.decoratedService // access custom fastify decoration
    this.config["LOG_LEVEL"] // access configured environment variable
}
```

## Endpoint queries and Platform services

Both from the `Request` (the first argument of a handler) and from the `Service` (the first argument of the declaration function) it is possible to obtain a proxy object to call other endpoints or services running in the Platform project. For example, if you need to connect to a CRUD, you have to use a Proxy towards the `crud-service`. These proxies are already configured to automatically include all necessary platform specific headers.

There are two types of proxies, returned by two distinct functions:

* `getServiceProxy(options)` - proxy passing through `microservice-gateway`
* `getDirectServiceProxy(serviceName, options)` - direct proxy to the service

The fundamental difference between the two proxies is that the first one triggers all the logics that are registered in `microservice-gateway`,
while the second does not. For example, if a resource exposed by the CRUD service is protected by ACL, this protection will come
bypassed using the direct proxy.

For the direct proxy it is necessary to specify the `serviceName` of the service to be queried. The port cannot be specified in the `serviceName` but must be passed in the `port` field of the `options` parameter. In the case of `getServiceProxy`, you should not specify the name of the service as it is implicitly that of the `microservice-gateway`.
The `options` parameter is an object with the following optional fields:

* `port` - an integer that identifies the port of the service to be queried
* `protocol` - a string that identifies the protocol to use (only `http` and `https` are supported, default value is `http`)
* `headers` - an object that represents the set of headers to forward to the service
* `prefix` - a string representing the prefix of the service call path

Potentially, the `getDirectServiceProxy` method allows you to also query services outside the platform. In this case, however, it is necessary to bear in mind that the platform headers will be automatically forwarded.

Both proxies, by default, forward the four mia-headers to the service called. To do this, the following environment variables must be present:

* USERID_HEADER_KEY
* GROUPS_HEADER_KEY
* CLIENTTYPE_HEADER_KEY
* BACKOFFICE_HEADER_KEY

The values of these variables will specify the key of the four mia-headers.

In addition, other headers of the original request can also be forwarded to the named service. To do this it is necessary to define an additional environment variable, `ADDITIONAL_HEADERS_TO_PROXY`, whose value must be a string containing the keys of the headers to be forwarded separated by a comma.

Both proxies expose the following methods:

* `get(path, querystring, options)`
* `post(path, body, querystring, options)`
* `put(path, body, querystring, options)`
* `patch(path, body, querystring, options)`
* `delete(path, body, querystring, options)`

The parameters of these methods are:

* `path` - a string that identifies the route to which you want to send the request
* `body` - optional, the body of the request which can be:
  * A JSON object
  * A [Buffer](https://nodejs.org/api/buffer.html#)
  * A [Stream](https://nodejs.org/api/stream.html)
* `querystring` - optional, an object that represents the querystring
* `options` - optional, an object that admits all the`options` listed above for the `getServiceProxy` and`getDirectServiceProxy` methods (which will eventually be overwritten), plus the following fields:
  * `returnAs` - a string that identifies the format in which you want to receive the response. It can be `JSON`,`BUFFER` or `STREAM`. Default `JSON`.
  * `allowedStatusCodes` - an array of integers that defines which status codes of the response are accepted. If the response status code is not contained in this array, the promise will be rejected. If this parameter is omitted, the promise is resolved in any case (even if the interrogated server answers 500).
  * `isMiaHeaderInjected` - Boolean value that identifies whether Mia's headers should be forwarded in the request. Default `true`.

#### Example

```js
// Example of a request towards `tokens-collection` endpoint passing through Microservice Gateway
async function tokenGeneration(request, response) {
  const crudProxy = request.getServiceProxy()
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })
  // ...
}
```

```js
// Example of a request towards `tokens-collection` endpoint bypassing Microservice Gateway
async function tokenGeneration(request, response) {
  const crudProxy = request.getDirectServiceProxy('crud-service')
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })
  // ...
}
```

## PRE and POST decorators

Through `Mia Service Node.js Library` it is possible to declare PRE and POST decorators. From a conceptual point of view, a decorator
of (1) PRE or (2) POST is a transformation applied from `microservice-gateway` to (1) a request addressed
to a service (**original request**) or (2) to the reply (**original reply**) that this service sends to
caller. From a practical point of view, decorators are implemented as HTTP requests in `POST` to a specified microservice. In order to use the decorators it is important to configure them also in the console. More information are available [in the Decorators docs](/development_suite/api-console/api-design/decorators.md).

The declaration of a decorator using `Mia Service Node.js Library` occurs in a similar way to the declaration of a route

* `service.addPreDecorator(path, handler)`
* `service.addPostDecorator(path, handler)`

#### Example

```js
module.exports = customService(async function(service) {
  // Examples of a PRE and a POST decorator definition using `Mia Service Node.js Library`.
  service.addPreDecorator('/is-valid', handler)   // PRE
  service.addPostDecorator('/is-valid', handler)  // POST

})
```

### Effective received HTTP request

PRE and POST decorator receive a POST HTTP request from `microservice-gateway` with the following json body:

#### PRE decorator schema

```json
{
    "method": "GET",
    "path": "/the-original-request-path",
    "headers": { "my": "headers" },
    "query": { "my": "query" },
    "body": { "the": "body" },
}
```

#### POST decorator schema

```json
{
  "request": {
    "method": "GET",
    "path": "/the-original-request-path",
    "query": { "my": "query" },
    "body": { "the": "body" },
    "headers": { "my": "headers" },
  },
  "response": {
    "body": { "the": "response body" },
    "headers": { "my": "response headers" },
    "statusCode": 200,
  }
}
```

### Access and Handling of the Original Request With Pre decorator

The utility functions exposed by the `Request` instance (the first parameter of a handler) are used to access the original request

* `getOriginalRequestBody()` - returns the body of the original request
* `getOriginalRequestHeaders()` - returns the headers of the original request
* `getOriginalRequestMethod()` - returns the original request method
* `getOriginalRequestPath()` - returns the path of the original request
* `getOriginalRequestQuery()` - returns the querystring of the original request

In addition to the methods described above, the `Request` instance exposes an interface to modify the original request, which will come
forwarded by `microservice-gateway` to the target service. This interface is accessible using the `Request` instance method
`changeOriginalRequest` which returns an object by the following methods:

* `setBody(newBody)` - change the body of the original request
* `setHeaders(newHeaders)` - modify the headers of the original request
* `setQuery(newQuery)` - modify the querystring of the original request

To leave the original request unchanged, the `leaveOriginalRequestUnmodified` function is used instead.

In all cases the PRE decorator handler must return either the object returned by `changeOriginalRequest` or the object returned by`leaveOriginalRequestUnmodified`.

#### Example of PRE Decorators

```js
// this PRE decorator reads a header of the original request
// and converts it to a querystring parameter
async function attachTokenToQueryString(request, response) {
  const originalHeaders = request.getOriginalRequestHeaders()
  const token = originalHeaders['x-token']

  if(token) {
    return request
      .changeOriginalRequest()
      .setQuery({ token })
  }
  // in case the token was not specified in the headers
  // the original request is left unchanged
  return request.leaveOriginalRequestUnmodified()
}
```

### Access and Manipulation of the Original Response With POST Decorator

As with the original request, the `Request` instance (the first parameter of a handler) is decorated with useful functions for
also access the original service original response information (these are available only for POST decorators)

* `getOriginalResponseBody()` - returns the body of the original response
* `getOriginalResponseHeaders()` - returns the headers of the original response
* `getOriginalResponseStatusCode()` - returns the status code of the original response

In addition to the functions described above, the `Request` instance exposes an interface to modify the original response, which will come
forwarded by `microservice-gateway` to the calling client. This interface is accessible using the function
`changeOriginalResponse` concatenating it with invocations to functions

* `setBody (newBody)` - change the body of the original answer
* `setHeaders (newHeaders)` - modify the headers of the original answer
* `setQuery (newQuery)` - modify the querystring of the original answer
* `setStatusCode (newStatusCode)` - change the status code of the original response

To leave the original answer unchanged, instead, the `leaveOriginalResponseUnmodified` function is used.

In all cases the decorator handler must return either the object returned by `changeOriginalResponse` or the object returned by`leaveOriginalResponseUnmodified`.

#### Example of POST Decorators

```js
// this POST decorator reads a token from the original reply body
// and converts it into a header.
async function attachTokenToHeaders(request, response) {
  const originalBody = request.getOriginalResponseBody()
  const token = originalBody.token

  if (token) {
    return request
      .changeOriginalResponse()
      .setHeaders({
        ...request.getOriginalResponseHeaders(),
        "x-token": token,
      })
  }
  // in case the token is not present in the body of the answer
  // the original answer remains unchanged
  return request.leaveOriginalResponseUnmodified()
}
```

### Decorator Chain Stop

Through `microservice-gateway` it is possible to define a sequencer of decorators, so that the output of a
single decorator is passed to the next decorator. In special cases, however, it may be necessary
interrupt the chain and return a response to the original caller.

For this purpose, the `Request` instance (the first argument of a handler) exposes the function

```Js
abortChain (finalStatusCode, finalBody, finalHeaders)
```

#### Example

```js
// this PRE decorator verifies that a token is present
// in the header of the original request. If it is not present
// break the chain by returning an error 401 to the client
async function validateToken(request, response) {
  const headers = request.getOriginalResponseHeaders()
  const token = headers['x-token']
  if(!token) {
    return request.abortChain(401)
  }
  return request.leaveOriginalRequestUnmodified()
}
```

## Route Diagram and Documentation

A microservice developed with `Mia Service Node.js Library` automatically also exposes the documentation of the routes and decorators that
are implemented. The documentation is specified using the [OpenAPI 2.0 standard](https://swagger.io/specification/v2/)
and exhibited through [Swagger](https://swagger.io). Once the microservice is started, its documentation can be accessed at
route *<http://localhost:3000/documentation>*. The specification of the request scheme
and responses to a route must conform to the format accepted by
[Fastify](https://www.fastify.io/docs/latest/Validation-and-Serialization).

### Example

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

  response: {
    200: {
      type: 'object',
      properties: {
        responseKey: { type: 'string' },
        otherResponseKey: { type: 'number' }
      }
    }
  },
}
```

## Environment Variables

Like any service on the Platform, a microservice must be set up to be released in different environments, starting from the local environment (the development machine) to development, test and production environments. The differences between various environments are managed through the mechanism of environment variables.  
In addition to the mandatory ones, using `Mia Service Node.js Library` it is possible to define other environment variables based on
needs of the single microservice, to then access them and use their values ​​in the code of the handlers. For the definition yes
use the [JSON schema format](http://json-schema.org/).

If the correct set of environment variables is not supplied to the microservice,
the microservice does not start by returning in output which environment variable is missing.

### Example

```js
// the env var VARIABLE will be available at runtime
const serverSchema = {
  type: 'object',
  required: ['VARIABLE'],  
  properties: {  
    VARIABLE: {  
      type: 'string',  
    },  
  },  
}  
const customPlugin = require('@mia-platform/Mia Service Node.js Library')(serverSchema)

module.exports = customPlugin(async service => {
  // in the config it is possible to find the declared env vars
  const VARIABILE = service.config.VARIABILE

  service.addRawCustomPlugin(
    'GET',
    '/variable',
    async function (request, reply) {
      return {
        // it is possible to access to the configuration through `this.config`
        secret: this.config.VARIABLE,
      }
    }
  )
})
```

## Testing

`Mia Service Node.js Library` is built on fastify and therefore integrates with [testing tools](https://www.fastify.io/docs/latest/Testing/)
made available by the framework. A complete example of this type of test is present online in the repository of
`Mia Service Node.js Library` on [GitHub](https://github.com/mia-platform/custom-plugin-lib/tree/master/examples/advanced/tests).

### Integration and Unit test

The testing of a microservice built with `Mia Service Node.js Library` can be performed at multiple levels of abstraction. One of
Possibility is to use a technique called _fake http injection_ for which it is possible to simulate
receiving an HTTP request. In this way, all the microservice logic is exercised from the HTTP layer to the handlers and
this is an example of Integration Testing.

#### Example Integration Test

In the example below the test framework [Mocha](https://mochajs.org/).

```js
'use strict'

const assert = require('assert')
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
  // silent => trace for enabling logs
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
