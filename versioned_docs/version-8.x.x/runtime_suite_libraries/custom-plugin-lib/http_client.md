---
id: http_client
title: Call the other services on the Platform project
sidebar_label: Http client
---
You can call any service or any endpoint defined on the Platform project, obtaining and using a proxy object.

For example, if you need to connect to a CRUD, you have to use a Proxy towards the `crud-service`.

You can get a proxy calling these methods both on `Request`(the first argument of handler) and `Service` (the Fastify instance):

* `getServiceProxy(options)` - returns a proxy  passing through the [Microservice Gateway](../../runtime_suite/microservice-gateway/overview).
  * `options` - is an object with the following optional fields:
    * `port` - an integer that identifies the port of the service to be queried
    * `protocol` - a string that identifies the protocol to use (only `http` and `https` are supported, the default value is `http`)
    * `headers` - an object that represents the set of headers to send to the service
    * `prefix` - a string representing the prefix of the service call path
    * `timeout` - set a request timeout
    * `agent` - set a custom node agent
* `getDirectServiceProxy(serviceNameOrURL, options)` - returns a direct proxy to the service
  * `serviceNameOrURL` - The name of the service to call. You can pass:
    * just the hostname, without protocol and port (that you can specify into the `options` field)
    * a complete url string (e.g. _http://myurl:3000_); you can include _protocol_ and _port_ into the url string directly
  * `options` - The same options described above

Potentially, the `getDirectServiceProxy` method allows you to also query services outside the Platform. In this case, however, it is necessary to bear in mind that the platform headers will be automatically forwarded.

Both proxies, by default, forward the four Mia headers to the service called. In addition, other headers of the original request can also be forwarded to the named service. To do this it is necessary to define an additional environment variable, `ADDITIONAL_HEADERS_TO_PROXY`, whose value must be a string containing the keys of the headers to be forwarded separated by a comma.

Both proxies expose the methods to perform a specific HTTP request to service.

* `get(path, querystring, options)`
* `post(path, body, querystring, options)`
* `put(path, body, querystring, options)`
* `patch(path, body, querystring, options)`
* `delete(path, body, querystring, options)`

All methods return a *Promise object*. You can access to:

* **Status code** of the response trough the `statusCode` property
* **Body** of the response trough the `payload` property
* **Headers** of the response trough the `headers` property

The params to be passed to these functions are:

* `path` -  a string that identifies the route to which you want to send the request.
* `body` - optional, the body of the request which can be:
  * a JSON object
  * a [Buffer](https://nodejs.org/api/buffer.html#)
  * one [Stream](https://nodejs.org/api/stream.html)
* `querystring` - optional, an object that represents the querystring.
* `options` - optional, an object that admits all the `options` listed above for the `getServiceProxy` and `getDirectServiceProxy` methods (which will eventually be overwritten), plus the following fields:
  * `returnAs` - a string that identifies the format in which you want to receive the response. It can be `JSON`,`BUFFER` or `STREAM`. Default `JSON`.
  * `allowedStatusCodes` - an array of integers that defines which status codes of the response are accepted. If the response status code is not contained in this array, the promise will be rejected. If this parameter is omitted, the promise is resolved in any case (even if the interrogated server answers 500).
  * `isMiaHeaderInjected` - a boolean value that identifies whether Mia's headers should be forwarded in the request. Default `true`.

## Examples

```js
// Example of a request towards `tokens-collection` endpoint passing through Microservice Gateway
async function tokenGeneration(request, response) {
  const crudProxy = request.getServiceProxy()
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })

  const tokens=result.payload;
  // ...
}
```

```js
// and bypassing Microservice Gateway
async function tokenGeneration(request, response) {
  const crudProxy = request.getDirectServiceProxy('crud-service')
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })
  
  const tokens=result.payload;
  // ...
}
```
