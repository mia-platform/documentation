---
id: overview
title: Proxy Manager
sidebar_label: Overview
---
The _Proxy Manager_ is a microservice which acts as a proxy between client and external services.

This service can either relay the request unmodified or add an access token for accessing protected resources.

In the latter case, the service takes care of requesting the token from the authorization server and stores it until it expires. At the moment only JWT tokens are supported.

## Working modes

The service can be executed with 2 working modes:
1. Static configuration
2. Dynamic configuration

The working mode is chosen at startup by the provided environment variables:
- **CONFIGURATION_PATH** and **CONFIGURATION_FILE_NAME** &rarr; static configuration
- **CONFIGURATION_URL** &rarr; dynamic configuration

:::caution
If you provide all the environment variables listed above the service stops its execution with an error.
:::

### Static configuration

In static configuration the service exposes an endpoint for each external service defined in the configuration file. Each request to a specific endpoint will be proxied to the related external service, appending to its base url the path extracted from the original request.

### Dynamic configuration

In dynamic configuration the service exposes one endpoint with wildcard (`/*`) to match all requests. The configuration is taken from a CRUD collection, each request will be proxied to the related external service, appending to its base url the path extracted from the original request.  
For better performances the service configuration is cached for a time duration set by the environment variable **PROXY_CACHE_TTL**.

**NB**: This service does not provide an endpoint to update the service configuration; it should be performed via *crud-service*.
