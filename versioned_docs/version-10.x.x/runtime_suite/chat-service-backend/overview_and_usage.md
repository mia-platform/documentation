---
id: overview_and_usage
title: Chat Service Backend
sidebar_label: Overview and usage
---
## Overview

The Chat Service Backend is a Mia-Platform plugin acting as a proxy between your project's microservices and the [Stream Chat APIs](https://getstream.io/chat/docs/rest/), introducing a Token Provider to validate and generate a token for your users.

### How it works

The service forwards REST requests to Stream Chat using an authenticated API key and token provided as environment variables.

## Usage

### `/proxy/*`

`GET POST PUT PATCH DELETE`
These endpoints are used to forward requests to Stream and should be used with caution. Please refer to the [REST Docs](https://getstream.io/chat/docs/rest) to ensure the correct parameters or body schema is provided.

#### Responses

```text
200 - Successful response
201 - Successful response
400 - Bad request
429 - Too many requests
```

### `/token/:userId`

`GET`
Generates an access token for the specified user ID to connect to Stream Chat client-side. This request will not fail if the user does not exist (see [Upsert users](https://getstream.io/chat/docs/rest/#users-updateusers) to create a new user) but the access token will not be valid to connect client-side. The expiration duration of the token can be specified in seconds in the `EXPIRATION_TOKEN_DURATION` environment variable; if not specified the token has no expiration. See the section on [Refreshing Tokens](https://getstream.io/chat/docs/node/tokens_and_authentication/?language=javascript&q=testing#how-to-refresh-expired-tokens) for further instructions.

#### Responses

```text
201 - Successful response
400 - Bad request
```

#### Response body schema

```json
201: {
  "userId": string,
  "token": string
}

400: {
  "errorMsg": string
}
```

### `/api-key`

`GET`
Retrieves the Stream Chat API key to connect the client.

#### Responses

```text
200 - Successful response
400 - Bad request
```

#### Response body schema

```json
200: {
  "api_key": string
}

400: {
  "errorMsg": string
}
```

### `/config?clientType=`

`GET`
Retrieves a configuration object for the specified client type (e.g. web, mobile, etc.).
This configuration is directly retrieved from a config map as described in the [Configuration](configuration.md) section and can be used to pass client-specific variables as stylesheet objects or other public parameters.
Under the specific client type it is possible to provide custom error messages for the client, that will be provided **only in case** the client is not authenticated or does not have authentication info.

The same response includes an optional `authentication` key that will contain useful information to connect the client, i.e. `apiKey`, `userId`, `userToken`. If no user exists or the endpoint is publicly exposed without authentication the response will include the `ERROR_OBJ_KEY` (defaulting to _errors_) object containing error messages. Please note that the information about the authenticated user are retrieved from the `USERID_HEADER_KEY` header (defaults to `userid`).

#### Response body schema

```json
{
  "authentication": {
    "apiKey": string,
    "userId": string,
    "userToken": string
  },
  // OR
  "error": {
    "title": string,
    "message": string
  }
  // other configurations as defined in config map under the {clientType} key
}
```

### `/webhook/verify`

`POST` Validate a Stream Chat request.

The `verifyWebhook` method of the [Stream SDK](https://getstream.io/chat/docs/react/webhooks_overview/) is used to validate the request. 
The method requires two variables as input:
- `rawBody`
- `headers['x-signature']`

which are respectively requested as input from the `/webhook/verify` endpoint as `rawBody` and `signature`.

Unfortunately, [Fastify by default parse the rawBody](https://github.com/fastify/fastify/issues/707) causing the verification to fail.
To solve this problem, in the service that contacts the `/webhook/verify` endpoint, we manipulate the request like this:

```js
// override built-in parser. otherwise everything _except_ json will be a buffer
service.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
  done(null, body)
})

// set a catch-all for everything other than json.
service.addContentTypeParser('*', (req, payload, done) => {
  const chunks = []
  payload.on('data', chunk => {
    chunks.push(chunk)
  })
  payload.on('end', () => {
    done(null, Buffer.concat(chunks))
  })
})
```

#### Request body schema
```json
{
  "rawBody": {
    "type": string
  },
  "signature": {
    "type": string
  }
}
```

#### Response body schema
```json
200: {
  "isValid": {
    "type": boolean
  }
}

400: {
  "errorMsg": string
}

500: {
  "errorMsg": string
}
```
