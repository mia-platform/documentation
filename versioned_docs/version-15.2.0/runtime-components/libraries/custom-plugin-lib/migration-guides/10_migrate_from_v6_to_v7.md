---
id: migrate_from_vto_v7
title: Migrate from v6 to v7
sidebar_label: Migrate from v6 to v7
---

With v7 the `getServiceProxy` and `getDirectServiceProxy` methods have been removed.

In order to upgrade to v7 you need to change the implementation using such methods to use another HTTP Client.

:::tip

Custom Plugin Lib already provides the [`getHttpClient`](/runtime-components/libraries/custom-plugin-lib/http_client.md) method to build an axios-based HTTP client since [v5.0.0](/runtime-components/libraries/custom-plugin-lib/changelog.md#v500---2022-05-13).

Main breaking changes from the already existent `getServiceProxy` and `getDirectServiceProxy`:

- streams respond with an object with headers, payload and statusCode. The payload has the stream interface
- `allowedStatusCodes` array of status codes is replaced by the function `validateStatus` (which accept by default 2xx)
- `agent` to configure the proxy is renamed to `proxy` and it is now an object
- `port` and `protocol` are now accepted only in url and baseUrl

:::

## Migrate getDirectServiceProxy

```js
const proxy = fastify.getServiceProxy('my-service', {})
// becomes
const proxy = fastify.getHttpClient('http://microservice-gateway/', {})
```

## Migrate getServiceProxy

```js
const proxy = fastify.getServiceProxy('my-service', {})
// becomes
const proxy = fastify.getHttpClient('http://my-service/', {})
```
