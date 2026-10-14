---
id: how_to_use
title: How to use
sidebar_label: How to use
---



Once the _Proxy Manager_ is up and running, you can contact each external service defined in the configuration by sending a request to it at a specific endpoint, which corresponds to the **basePath** field provided in the configuration.

All the subroutes exposed by the external service will also be reachable through the proxy.

## Proxy usage example

Let's suppose that a user wants to use the Proxy Manager to fetch some data from the endpoint `https://third-party-service.com/api/data`.

The user can define a proxy with the following configuration:

```json
{
  "targetBaseUrl": "https://third-party-service.com/api",
  "basePath": "/third-party-api"
}
```

Now the `/third-party-api/data` endpoint can be called to fetch the data from the third-party service.

## Management API

The service exposes a set of endpoints to manage the proxies collection:

### GET `/-/proxies`

Returns the list of proxies. The API accepts the `basePath` query parameter to filter the list of proxies, and returns a paginated response. The API never returns sensitive data like the `clientSecret` or `password` for the proxies.

#### Query parameters

- `basePath` (optional): filters the list of proxies by the proxy base path.
- `page` (optional): the page number of the paginated response. Default value is 1.
- `per_page` (optional): the number of returned items per page. Default value is 25.

#### Example response

```json
[
  {
    "authentication": "oauth2",
    "tokenIssuerUrl": "http://external-service.com/auth/oauth/token",
    "targetBaseUrl": "https://external-service.com",
    "basePath": "/external-service",
    "grantType": "client_credentials",
    "clientId": "6779ef20e75817b79602",
    // client secret is not returned
  },
  {
    "authentication": "none",
    "targetBaseUrl": "https://other-service.com",
    "basePath": "/other-service",
  }
]
```

### POST `/-/proxies`

Creates a new proxy. The API request body accepts a proxy matching the *proxy* schema specified in the [configuration schema](#configuration-schema).

#### Example request body

```json
{
  "targetBaseUrl": "https://external-service.com",
  "basePath": "/external-service",
  // other fields are optional
}
```

#### Example response

`proxy_1234`: the id of the created proxy on the CRUD collection.

### PATCH `/-/proxies/{id}`

Updates an existing proxy. The API requires the *id* path parameter, representing its object id on the CRUD collection. It returns the updated proxy as a whole, except for sensitive fields like the `clientSecret` or the `password`.

##### Path parameters

- `id`: the object id of the proxy to update.

#### Example request body

```json
{
  "basePath": "/updated-url",
  "authentication": "none",
  "username": null, // unsets the username
  "password": null, // unsets the password
}
```

#### Example response

```json
{
  "basePath": "/updated-url",
  "targetBaseUrl": "https://external-service.com",
  "authentication": "none",
  // other unchanged fields
}
```

### PATCH `/-/proxies`

Updates an existing proxy. The API accepts the `basePath` query parameter to determine the proxy to update. It returns the updated proxies count.

#### Query parameters

- `basePath` (required): selects the proxy to update by its unique base path.

#### Example request body

```json
{
  "basePath": "/updated-url",
  "authentication": "none",
  "username": null, // unsets the username
  "password": null, // unsets the password
}
```

#### Example response

```json
{
  "count": 1,
}
```

:::info  
Both PATCH APIs accept a request body containing the fields to update.  
In order to unset a specific field, the corresponding property in the request body must be explicitly set to `null`. Not setting the property will not unset the field.
:::

### DELETE `/-/proxies`

Deletes one or more proxies. The API accepts the `basePath` query parameter to determine the single proxy to delete or `basePathPrefix` to delete all the proxies with a basePath starting with the provided prefix.

#### Query parameters

At least one of the two following parameters needs to be specified.

- `basePath`: selects the proxy to delete by its unique base path.
- `basePathPrefix`: selects the proxies to delete by a shared base path prefix.
