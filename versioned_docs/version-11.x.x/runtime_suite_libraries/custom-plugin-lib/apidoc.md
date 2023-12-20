---
id: apidoc
title: API documentation
sidebar_label: Apidoc
---
Services developed with this library automatically also exposes the documentation of the routes and decorators that
are implemented. The documentation is specified using the [OpenAPI 2.0 standard](https://swagger.io/specification/v2/)
and exhibited through [Swagger](https://swagger.io).

Once the service is started, its documentation can be accessed at
route [`http://localhost:3000/documentation`](http://localhost:3000/documentation).  

The specification of the request scheme
and responses to a route must conform to the format accepted by
[Fastify](https://www.fastify.io/docs/latest/Validation-and-Serialization).

## Example

```js
const customService = require('@mia-platform/custom-plugin-lib')()

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

module.exports = customService(async function exampleService(service) {
  service.addRawCustomPlugin('GET', '/endpoint', function handler(request,reply) { ... }, schema)
})
```
