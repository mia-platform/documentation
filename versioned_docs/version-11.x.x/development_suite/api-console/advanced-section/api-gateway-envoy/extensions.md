---
id: extensions
title: "Envoy API Gateway: Advanced Configuration"
sidebar_label: Extensions
---

Aside from the standard API Gateway features, the console provides the possibility to write extended configurations in advanced mode. In this section, you can either specify further properties that are not included in the default configuration or enhance your API Gateway with additional features.

Advanced extensions are divided by their scopes and can be edited in their corresponding file, contained in the `api-gateway-envoy` section:

- `external-authorization.yaml`
- `endpoints.yaml`
- `clusters.yaml`
- `request-headers.yaml`
- `response-headers.yaml`
- `rate-limiter.yaml`
- `http-filters.yaml`
- `listeners.yaml`
- `on-request-scripts.yaml`
- `on-response-scripts.yaml`
- `patches.yaml`

## Available extensions

The above-mentioned files accept a list of YAML objects of the corresponding type, following the conventional structure defined in the official Envoy documentation.

This section provides an in-depth look at the Envoy advanced mode. Each extension comes with a short description, a link to the official documentation, and a valid sample snippet to try on your project.

:::warning
For **endpoints**, **headers**, **HTTP filters** and **LUA scripts** you **MUST** specify the listener name in an additional property called `listener_name`.
:::

### Listeners

**Envoy docs:** [Listener configuration](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/config/listener/v3/listener.proto)

Listeners should be added to the `listeners.yaml` files. You can either add a new listener or overwrite an existing one by specifying the same `name` property.

The minimum valid listener configuration is the following:

```yaml
- "@type": type.googleapis.com/envoy.config.listener.v3.Listener
  name: custom-listener
  address:
    socket_address:
      protocol: TCP
      address: 0.0.0.0
      port_value: 1234
  filter_chains: []
```

### Clusters

**Envoy docs:** [Cluster configuration](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/config/cluster/v3/cluster.proto)

Similarly to listeners, clusters should be included in `clusters.yaml` and can be either added or overwritten.

Here's an example of a valid cluster configuration:

```yaml
- "@type": type.googleapis.com/envoy.config.cluster.v3.Cluster
  name: my-upstream
  connect_timeout: 30s
  type: LOGICAL_DNS
  lb_policy: ROUND_ROBIN
  load_assignment:
    cluster_name: my-upstream
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: my-upstream
              port_value: 80
```

### Endpoints

**Envoy docs:** [Routes](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/config/route/v3/route_components.proto#envoy-v3-api-msg-config-route-v3-route)

This extension allows you to add or overwrite endpoints and routes in the `endpoints.yaml` file. Endpoints added with this feature will have priority over the automatically generated ones (assuming they have the same path, prefix, or regex).

The snippet below illustrates an example of a frontend `GET` route towards `my-upstream` with prefix rewrite. Remember to set the `timeout` property to `0s` to disable the default request timeout and enforce the global `stream_idle_timeout` ([learn more](/development_suite/api-console/advanced-section/api-gateway-envoy/timeouts.md)).

```yaml
- listener_name: frontend
  match:
    headers:
    - name: ':method'
      string_match:
        safe_regex:
          google_re2: {}
          regex: ^(GET)$
    prefix: /endpoint/route/
  route:
    timeout: 0s
    prefix_rewrite: /route/
    cluster: my-upstream
```

:::warning
To overwrite an endpoint, make sure the path/prefix/regex is **exactly the same** as the one already present.
:::

:::warning
**Be careful:** endpoints added in advanced mode may not be placed in the correct order when a regular expression is used to match the path. This could lead to endpoints mismatching when a request is processed.
:::

### Headers

**Envoy config:** [Routes](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/config/route/v3/route_components.proto#config-route-v3-route) (see `request_headers_to_add` and `response_headers_to_add`)

Header customization is split into two files:

- `request-headers.yaml`, whose headers will be added to the **request** of the specified listener;
- `response-headers.yaml`,  whose headers will be added to the **response** of the specified listener.

:::info
If you wish to overwrite an existing header, you need to specify the header in the corresponding extension file with the same `key` and set `append` to `false`.
:::

Header configuration example:

```yaml
- listener_name: frontend
  header:
    key: my-header
    value: header-value
  append: false
```

### External authorization

**Envoy docs:** [External authorization](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/extensions/filters/http/ext_authz/v3/ext_authz.proto)

With this extension, you can either add or customize your authorization service, overwriting the already existing one (if present).

For instance, the following snippet adds two custom headers (`custom-authz-header-1` and `custom-authz-header-2`) to our default frontend authorizer:

```yaml
- listener_name: frontend
  name: envoy.filters.http.ext_authz
  typed_config:
    '@type': 'type.googleapis.com/envoy.extensions.filters.http.ext_authz.v3.ExtAuthz'
    transport_api_version: V3
    http_service:
      server_uri:
        uri: http://authorization-service
        cluster: authorization-service
        timeout: 10s
        path_prefix: /auth
      authorization_request:
        headers_to_add:
        - key: X-Forwarded-Host
          value: '%REQ(HOST)%'
        - key: Scheme
          value: '%REQ(X-FORWARDED-PROTO)%'
        - key: X-Real-IP
          value: '%REQ(X-ENVOY-EXTERNAL-ADDRESS)%'
        - key: X-Original-URI
          value: '%REQ(:path)%'
        - key: Original-Request-Uri
          value: '%REQ(:path)%'
        - key: Original-Request-Method
          value: '%REQ(:method)%'
        - key: client-type
          value: '%DYNAMIC_METADATA(["mia.metadata","client_type"])%'
        - key: isbackoffice
          value: '%DYNAMIC_METADATA(["mia.metadata","isbackoffice"])%'
        - key: cookie
          value: '%REQ(cookie)%'
        - key: isbackoffice
          value: '0'
        - key: custom-authz-header-1
          value: 'value-1'
        - key: custom-authz-header-2
          value: 'value-2'
        authorization_response:
          dynamic_metadata_from_headers:
            patterns:
            - exact: mia-userid
            - exact: mia-groups
            - exact: mia-allowed
            - exact: mia-userproperties
    failure_mode_allow: false
    include_peer_certificate: true
```

:::info
If the custom authorization service is not already present, remember to create the microservice and add the corresponding cluster.
:::

### Rate limiter

**Envoy docs:** [Global rate limit](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/extensions/filters/http/ratelimit/v3/rate_limit.proto), [Local rate limit](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/extensions/filters/http/local_ratelimit/v3/local_rate_limit.proto)

This extension allows creating custom rate limit configurations, overwriting the existing filters. You can use this file to change the external rate limit service, modify local rate limit thresholds, and so on.

:::info
If you are using the global rate limit service from our marketplace, you do not need to edit the corresponding filter from extension.
:::

A valid global rate limit filter with a custom gRPC service would look like this:

```yaml
- listener_name: frontend
  name: envoy.filters.http.ratelimit
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.ratelimit.v3.RateLimit
    domain: mia_limit
    rate_limited_as_resource_exhausted: true
    rate_limit_service:
      transport_api_version: V3
      grpc_service:
        envoy_grpc:
          cluster_name: custom-rls
```

:::info
If the custom rate limit service is not already present, remember to create the microservice and add the corresponding cluster.
:::

Local rate limit, on the other hand, can be created or customized as follows:

```yaml
- listener_name: frontend
  name: envoy.filters.http.local_ratelimit
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.local_ratelimit.v3.LocalRateLimit
    stat_prefix: http_local_rate_limiter
    token_bucket:
      max_tokens: 1500
      tokens_per_fill: 1250
      fill_interval: 1s
    filter_enabled:
      runtime_key: local_rate_limit_enabled
      default_value:
        numerator: 100
        denominator: HUNDRED
    filter_enforced:
      runtime_key: local_rate_limit_enforced
      default_value:
        numerator: 100
        denominator: HUNDRED
    response_headers_to_add:
      - append: false
        header:
          key: x-local-rate-limit
          value: 'true'
    local_rate_limit_per_downstream_connection: false
```

The local rate limit filter above enables and enforces rate limit on 100% of the requests, and sets the threshold to 1250 requests per second, with a possible burst of 250 requests.

### LUA Scripts

**Envoy docs:** [LUA filter](https://www.envoyproxy.io/docs/envoy/v1.21.0/configuration/http/http_filters/lua_filter#config-http-filters-lua)

Envoy is a largely extensible tool. In this sense, one of the most attractive features is the capability to hook custom LUA scripts on request and response manipulation. The console allows users to specify these custom scripts through two files: `on-request-scripts.yaml`, which contains scripts to be executed when Envoy processes a request, and `on-response-scripts.yaml` for responses manipulation. These two YAML files should include a list of objects having two properties: `listener_name`, which is the identifier of the listener to which the script will be added, and `body`, the script content. The user can specify more than one script for a listener, and they will be executed in the order in which they are listed, as in the following example:

```yaml
- listener_name: frontend
  body: |
print("First script")
request_handle:logInfo("Hello from first script.")
- listener_name: frontend
  body: |
print("Second script")
request_handle:logInfo("Hello from second script.")
```

Every script has in its scope a variable called `request_handle` or `response_handle` (respectively for request and response scripts) that can be used to manipulate the actual request/response and its context. Please refer to the official documentation for a comprehensive overview of LUA scripts.

LUA scripts can be used to log request and response data, for debugging purposes. For example, you can extract:

- **Headers**, with `request_handle:headers():get("header-name")`
- The **body**, with `request_handle:body()`

#### Importing a library

Sometimes it could be useful to import external LUA libraries or refactor existing scripts into dedicated files. This could be done using the LUA scripts extension in combination with [configmaps](/development_suite/api-console/api-design/services.md#configmaps). For example, let's assume we have a file called `my-library.lua` that exports a function called `myLibFunction` and we want to apply this function to incoming requests. This could be done through the following steps:

1. Create a configmap for the API Gateway service and mount it in an arbitrary path, in this example, we have chosen `/etc/lua/lib`
2. Add your script file `my-library.lua` to the configmap you just created
3. Let's hook this library to the gateway using the scripts extension, to do it add the following snippet to the corresponding file `on-request-scripts.yaml` in the advanced section
```yaml
- listener_name: frontend
  body: |-
    local myLib = require('/etc/lua/lib/my-library')
    myLib.myLibFunction(request_handle)
```

In this way, `myLibFunction` will be invoked on every incoming request on the `frontend` listener.

### HTTP filters

**Envoy docs:** [HTTP filters list](https://www.envoyproxy.io/docs/envoy/v1.21.0/api-v3/config/filter/http/http)

If you want to enhance your API Gateway with additional features, this extension file accepts any HTTP filter available in the Envoy version supported in our marketplace. The filters should be added to a list, along with the `listener_name` additional property, similarly to other extensions.

HTTP filters sorting is critical, as it changes the order in which the various features are executed. This is supported through the custom property `order`, through which the user can specify the placement of the filter in the filter chain. If the `order` property is not defined, it defaults to `50`. To better decide where your filter should be placed, you can find below the list of orders of the explicitly supported filters:

- `envoy.filters.http.local_ratelimit`: 1
- `envoy.filters.http.ratelimit`: 10
- `envoy.filters.http.compressor`: 20
- `envoy.filters.http.decompressor`: 21
- `default`: 50
- `envoy.filters.http.rbac`: 60
- `envoy.filters.http.ext_authz`: 70
- `envoy.filters.http.router`: 100

:::warning
When defining orders, keep in mind that the `envoy.filters.http.router` must be the **last filter** in the chain.
:::

:::caution
Be careful when you add LUA filters using this extension, they will lack the default secret validation. Please refer to [this section](#lua-scripts) if you want secret validation alongside custom LUA scripts.
:::

### Patching arbitrary listeners' properties

This extension allows users to patch properties of a listener by specifying the path of the property to be modified. 

A path is a dot-separated list of properties. A path lookup is performed by recursively selecting the property starting from the whole listener configuration and advancing when a match occurs. If the specified path is not in the object's tree, a corresponding object will be generated.

The extension expects a YAML encoded list of objects. Every object contains a property named `listener_name` that selects the target listener. The other keys in the object are interpreted as paths and their corresponding values will be put in the target listener's path. A `null` value expresses the intention to delete the target property from the listener.

For example, the following patch will set the request timeout to `'30s'` on the `frontend` listener and will delete the `access_log` property:

```yaml
- listener_name: LISTENER
  'filter_chains.0.filters.0.typed_config.stream_idle_timeout': '30s'
  'filter_chains.0.filters.0.typed_config.access_log': null
``` 