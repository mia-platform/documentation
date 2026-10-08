---
id: http_client
title: Call the other services on the Platform project
sidebar_label: Http client
---

You can call any service or any endpoint defined on the Platform project, obtaining and using a proxy object.

For example, if you need to connect to a CRUD, you have to use a Proxy towards the `crud-service`.

You can get a proxy calling these methods both on `Request` (the first argument of handler) and `Service` (the Fastify instance):

* `getHttpClient(baseURL, options)` - returns an http client configured with the given base URL and options.
  * `baseURL` - the base URL of the service, with protocol, host and it is possible to add a base prefix. The prefix must ends with a slash. Keep in mind that in method functions you must start the path without slash if you want to reuse the path prefix.
  * `options` - an object with the following optional fields:
    * `headers` - an object that represents the set of headers to send to the service
    * `timeout` - set a request timeout
    * `cert` - set a custom certificate to use for the requests
    * `key` - set a custom key to use for the requests
    * `ca` - set a custom ca to use for the requests
    * `logger` - the Pino logger instance, it is used to log request (headers, payload and url) and response (headers, payload and status code) in trace level and error message if there is an error during the API call. If not passed, no log are printed. Keep in mind that headers, payload and url could contains sensitive information. If it is the case, do not pass the logger instance or use the redact options to hide the sensitive information ([read here](/runtime-components/libraries/lc39/service-options.md) for more information).
    * `isMiaHeaderInjected` - a boolean value that identifies whether Mia's headers should be forwarded in the request. Default `true`.
    * `httpsAgent` - an instance of `require('https').Agent` that will be used for the requests, only if `cert`, `key` and `ca` are not configured.

Potentially, the `getHttpClient` method allows you to also query services outside the Platform. In this case, however, it is necessary to bear in mind that the platform headers will be automatically forwarded. You can do it by setting the `isMiaHeaderInjected` option value to false.

The http client created from the Request by default forwards the four Mia headers to the service called. In addition, other headers of the original request can also be forwarded to the named service. To do this it is necessary to define an additional environment variable, `ADDITIONAL_HEADERS_TO_PROXY`, whose value must be a string containing the keys of the headers to be forwarded separated by a comma.

The client expose the methods to perform a specific HTTP request to service.

* `get(path, options)`
* `post(path, body, options)`
* `put(path, body, options)`
* `patch(path, body, options)`
* `delete(path, body, options)`

The params to be passed to these functions are:

* `path` *required* - a string which identifies the route to which you want to send the request (it handles also the query string). Keep in mind that if base url contains a prefix, you must start the path without slash if you want to reuse the path prefix.
* `body` - the body of the request which can be:
  * a JSON object
  * a [Buffer](https://nodejs.org/api/buffer.html#)
  * one [Stream](https://nodejs.org/api/stream.html)
* `options` - optional, an object that admits all the `options` listed above for the `getHttpHeader` methods (which will eventually be overwritten), plus the following fields:
  * `returnAs` - a string that identifies the format in which you want to receive the response. It can be `JSON`,`BUFFER` or `STREAM`. Default `JSON`.
  * `validateStatus` - a function which returns a boolean indicating whether the status code is valid or not. Default `(status) => status >= 200 && status < 300`.
  * `errorMessageKey` - key of the response object (if response in JSON) that will be used to identify the error message. Default `message`.
  * `proxy`: object that contains the following fields:
    * `protocol`: 'http' or 'https'
    * `host`: host of the proxy service
    * `port`: port of the proxy service in number format
    * `auth`: object that contains the following fields:
      * `username`: username to use for the proxy authentication
      * `password`: password to use for the proxy authentication
  * `query`: object that will be stringified and add to the query

All methods return a *Promise object*. You can access to:

* **Status code** of the response trough the `statusCode` property
* **Body** of the response trough the `payload` property
* **Headers** of the response trough the `headers` property
* **Duration** of the http call trough the `duration` property

If service responds with status code not valid (it is possible to modify this using the `validateStatus` ), the error object contains:

* **Message** of the response trough the `message` property (or it is possible to customize the key using the `errorMessageKey` option) if response is in JSON. Otherwise, it returns a default error message `Something went wrong`
* **Status code** of the response trough the `statusCode` property
* **Body** of the response trough the `payload` property
* **Headers** of the response trough the `headers` property
* **Duration** of the http call trough the `duration` property

If error is not an http error, it is throw the error message and the error code.

## Examples

```js
async function tokenGeneration(request, response) {
  const crudProxy = request.getHttpClient('http://my-service/base-path/')
  const result = await crudProxy
    .post('/tokens-collection/', {
      id: request.body.quotationId,
      valid: true
    })

  const tokens=result.payload;
  // ...
}
```
