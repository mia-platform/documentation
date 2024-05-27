---
id: filters
title: What is a filter?
sidebar_label: Filters
---
One of the most interesting features of Envoy is surely its massive extensibility. It supports a variety of functionalities via built-in **filters**, which can be conveniently accessed via Listener configuration.



Envoy **filters** are the building blocks of the configuration. Currently, there are 3 different types of filters, forming the following hierarchy:

- **Listener** filters
- **Network** filters
- **HTTP** filters

Among network filters, a crucial one is undoubtedly the [HTTP connection manager](https://www.envoyproxy.io/docs/envoy/v1.21.0/intro/arch_overview/http/http_connection_management#arch-overview-http-conn-man), which is in charge of core jobs such as route matching, header manipulation, and so on. It also provides the many functionalities offered by the multitude of **HTTP filters**.

## Available HTTP filters

### Compression and decompression (default)

Envoy provides filters to implement **compression** and **decompression** for requests and responses. By default, our Envoy API Gateway supports this feature and is already set up for working with **[zlib](https://zlib.net/)** (Gzip) and **[Brotli](https://brotli.org/)** libraries.

### Rate limit

Envoy offers extensive support for the configuration of both **global** and **local rate limit**.

For the global rate limit, Envoy needs to query an **external Rate Limit Service (RLS)** to make decisions for each request. This can be achieved with the **[Envoy Go/gRPC Rate Limit Service](https://github.com/envoyproxy/ratelimit)**, which provides generic rate limit support.

:::info
The rate limit service is a Go/gRPC service designed to enable generic rate limit scenarios from different types of applications. Applications request a rate limit decision based on a domain and a set of descriptors. The service reads the configuration from disk via runtime, composes a cache key, and talks to the Redis cache. A decision is then returned to the caller.[^1]
:::

If an application requires global rate limit, the rate limit service needs to be set up and deployed. The Envoy RLS is currently available in our Marketplace, with a default configuration that applies a rate limit of 1000 requests per second on each unique remote address. These settings can be customized by editing the content of the `api-gateway-ratelimit` configmap.

As mentioned before, the RLS needs to talk to a **Redis cache**. Therefore, a Redis instance should be deployed together with the rate limit service, with its URL (`service-name:port`) specified as a value in the `REDIS_URL` environment variable of the RLS. By default, the `REDIS_URL` is set to the cluster's Redis instance.

Finally, the **[global rate limit HTTP filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/rate_limit_filter#config-http-filters-rate-limit)** will be in charge of connecting Envoy to the deployed RLS, by specifying its service name.

To reduce the load on the RLS in case of heavy traffic spikes, you can configure the **local rate limit**. The **[local rate limit HTTP filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/local_rate_limit_filter#config-http-filters-local-rate-limit)** allows absorbing bursts of requests thanks to a **local token bucket**. It specifies both the **maximum number of requests** (`tokens_per_fill`) allowed per **time interval** (`fill_interval`) and the **maximum number of requests** that can be **absorbed** by the system (`max_tokens`), i.e. the requests allowed plus **bursts**. Whenever the traffic reaches the limits hereby defined, the local rate limit comes into play. It enables and enforces rate limit on a configurable percentage of the requests, hence relieving the global rate limit service from potential overload.

### External authorization

Envoy supports **external authorization** via the dedicated [HTTP filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/ext_authz_filter.html). We provide a compatible [authorization service](../../runtime_suite/authorization-service/overview) with its default Envoy filter, that will be added automatically to the filter chain when our external authorizer is picked from the Marketplace and deployed. However, you are free to deploy and configure your own in [advanced mode](../../development_suite/api-console/advanced-section/api-gateway-envoy/extensions#external-authorization).

The `authorization-request` object allows defining some actions to perform on the **request** to the authorizer. For example, it is possible to **append some headers** to the request via the list `headers_to_add`.

On the other hand, the `authorization-response` object enables the definitions of actions on the authorizer’s **response**. To let the underlying services know whether the call was authorized or not, the output of the authorizer needs to be forwarded. This can be done either by **proxying** some **response headers**, or by **saving their content as metadata**. Thus, `allowed_upstream_headers` can be used for the headers that need to be proxied **as-is**, while `dynamic_metadata_from_headers` may be leveraged to **extract metadata** for new headers to append to the request, or to make the data available for filters following in the chain.

### Secret resolution

In the Envoy API Gateway, **secret resolution** is implemented in two steps, executed in two different filters:

1. **Client key collection**, from either a header or a cookie ([header to metadata HTTP filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/header_to_metadata_filter#config-http-filters-header-to-metadata))
2. The actual secret resolution, performed in a **Lua script** ([Lua HTTP filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/lua_filter)).

These filters are also added automatically to the filter chain as soon as secret resolution is activated, and can be customized as needed in advanced mode.

The default implementation of the header to metadata filter checks whether either the header `secret` or the header `client-key` is present in the request, and eventually saves its value in the metadata variable `client_key`. If the headers are missing, but the cookie `mia_client_key` is present, `client_key` will be assigned the cookie value. Headers and cookies names can be customized according to the application's needs.

On the other hand, the Lua script in the second step is in charge of **resolving secrets**. Firstly, it checks whether the key exists or not. If there is a match, it links the API key to its corresponding client type and specifies whether the request is secreted or not. If the client key is not correct it is marked as `wrong`, and Envoy will respond with status code **403 (forbidden)** on every route. API keys can be created through the console, to add secreted routes.

### JWT authentication

Envoy supports **JWT authentication**, which can be combined with our **[Authorization Service**](../../runtime_suite/authorization-service/usage#trust-mia-platform-user-headers)** using the trusted user headers mode.

The **[JWT authentication HTTP filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/jwt_authn_filter#config-http-filters-jwt-authn)** performs all the necessary operations to decode and extract the JWT payload.

The filter is divided into two main sections:

- `providers` defines how a JWT should be **validated**, including how to extract the token, obtain the public key (JWKS), and output the payload;
- `rules` specifies rules matching and requirements. Requirements define the provider that should be applied to the request, in case the route matches the rule. To disable JWT authentication on a specific route, it is sufficient to add a matching rule without any requirement.

[^1]: From the Envoy Rate Limit Service [README](https://github.com/envoyproxy/ratelimit/blob/main/README.md#overview).
