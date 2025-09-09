---
id: overview
title: Proxy Manager
sidebar_label: Overview
---



The _Proxy Manager_ is a microservice which acts as a proxy between a client and external services.

This service can either relay the request unmodified or add an access token for accessing protected resources.

In the latter case, the service takes care of requesting the token from the authorization server and stores it until it expires. At the moment only JWT tokens are supported.

## Working modes

For each external service, the _Proxy Manager_ remaps the `targetBaseUrl` of the external service with the `basePath` of the proxy, appending the additional subroutes extracted from the original request to it.

The service working mode is defined at startup. Depending on the chosen mode, the external services to be proxied will be stored in different ways. The following sections describe the available working modes.

### Static configuration

In static configuration mode, proxies are stored in a static configuration file.  

:::tip
This working mode is activated by defining the **CONFIGURATION_PATH** and **CONFIGURATION_FILE_NAME** environment variables.
:::

### Dynamic configuration

In dynamic configuration, proxies are retrieved from a CRUD collection. The service exposes exposes one endpoint with wildcard (`/*`) to match all requests, and a set of special **management routes** to perform CRUD operations on the proxies collection: you can learn more about them in the [dedicated section](/runtime_suite/http-proxy-manager/30_configuration.md#proxies-collection-management).

For better performances the service configuration is cached for a time duration set by the environment variable **PROXY_CACHE_TTL**.

:::tip
This working mode is activated by defining the **CONFIGURATION_URL** environment variable.
:::

:::caution
If you provide all the environment variables listed above the service stops its execution with an error.
:::
