---
id: jwt-authn
title: 'Envoy Use Case: JWT Authentication'
sidebar_label: 'Use Case: JWT Authentication'
---

Among the wide variety of features provided by the Envoy API Gateway, you can enable JWT authentication for your project.

To do so, you need to combine different extensions in advanced mode:

- The **JWT authentication** filter, in the `http-filter.yaml` extension file;
- A **Lua script** to extract metadata from the JWT payload, in the `on-requests-scripts.yaml` extension file;
- An overwrite of the **authorization service**, to add a few headers, in the `authorization-service.yaml` extension file.

:::info
This is just an example with our JWT configuration. You are invited to customize these extensions based on your application's needs.
:::

### JWT authentication filter

The snippet below shows the implementation of a **JWT authentication filter** for the `frontend` listener.

```yaml
- listener_name: frontend
  name: envoy.filters.http.jwt_authn
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication
    providers:
      provider1:
        issuer: my-custom-issuer
        from_cookies:
        - sid
        local_jwks:
          inline_string: '{"keys":[{"kty":"oct","alg":"HS256","k":"{{JWT_TOKEN_SIGN_KEY_BASE64}}"}]}'
        forward: true
        payload_in_metadata: my_payload
        jwt_cache_config:
          jwt_cache_size: 100
    rules:
    - match:
        path: /api/sample-route-1
    - match:
        path: /api/sample-route-2
    - match:
        prefix: /api
      requires:
        provider_name: provider1
```

This filter applies JWT authentication on all the `/api` routes, except the ones explicitly listed (`/api/sample-route-1` and `/api/sample-route-2`).

:::info
In case you want to use the configuration above, please make sure the variable `JWT_TOKEN_SIGN_KEY_BASE64` exists and contains the correct sign key (or use your own sign key).
:::

#### **Local JWKS**

In the example above, the JWKS location is specified through an inline string. The same property `local_jwks` allows you to retrieve it from a local file, as in the following snippet:

```yaml
local_jwks:
  filename: /etc/envoy/jwks/jwks1.txt
```

#### **Remote JWKS**

If your authentication service exposes a `/.well-known/jwks.json` endpoint, you could fetch the JWKS remotely via HTTP through the `remote_jwks` property. This field defines the HTTP URI of the remote server and the cache duration.

:::warning
Remember that the upstream in the `cluster` field must be an existing cluster in your configuration.
:::

For example:

```yaml
remote_jwks:
  http_uri:
    uri: http://authentication-cluster/.well-known/jwks.json
    cluster: authentication-service
    timeout: 1s
  cache_duration:
    seconds: 300
```

On the other hand, if you want to retrieve the JWKS from an HTTPS endpoint (for example, an auth0 server), the configuration would look like the following:

```yaml
remote_jwks:
  http_uri:
    uri: https://example.auth0.com/.well-known/jwks.json
    cluster: jwks-cluster
    timeout: 1s
  cache_duration:
    seconds: 300
```

To reach the endpoint at the specified URI, you will need to define its corresponding upstream in the `clusters.yaml` extension file, together with its TLS context (for HTTPS):

```yaml
- "@type": type.googleapis.com/envoy.config.cluster.v3.Cluster
  name: jwks-cluster
  connect_timeout: 30s
  type: LOGICAL_DNS
  lb_policy: ROUND_ROBIN
  dns_lookup_family: V4_ONLY
  load_assignment:
    cluster_name: jwks-cluster
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: example.auth0.com
              port_value: 443
  transport_socket:
    name: envoy.transport_sockets.tls
    typed_config:
      '@type': type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext
      sni: example.auth0.com
      common_tls_context:
        validation_context:
          trusted_ca:
            filename: /etc/ssl/certs/ca-certificates.crt
```

The `dns_lookup_family` field needs to be set to `V4_ONLY` to force IPv4 connectivity to auth0, otherwise the fetch of the JWKS fails (see [this blogpost](https://farcaller.net/jwks-remote-fetch-is-failed/) for a more detailed explanation of the error).

For more details concerning the filter properties, visit [this section](/runtime_suite/envoy-api-gateway/filters.md).

### LUA script

This script extracts the **JWT payload** from the JWT authentication filter metadata and creates new metadata ready to be used in their corresponding headers. This step is necessary to format the data correctly for the authorizer and the underlying services.

```yaml
- listener_name: frontend
  body: |+
    local filter_payload = request_handle:streamInfo():dynamicMetadata():get("envoy.filters.http.jwt_authn")

    if (filter_payload ~= nil and filter_payload["my_payload"] ~= nil) then
        local jwt_payload = filter_payload["my_payload"]
        local userid = jwt_payload["sub"]
        local user = jwt_payload["user"]
        local groups = table.concat(user["groups"], ", ")
        local properties = string.format(
            '{"email":"%s","name":"%s","username":"%s"}',
            user["email"],
            user["name"],
            user["userId"]
        )

        request_handle:streamInfo():dynamicMetadata():set("mia.metadata", "mia_userid", userid)
        request_handle:streamInfo():dynamicMetadata():set("mia.metadata", "mia_groups", groups)
        request_handle:streamInfo():dynamicMetadata():set("mia.metadata", "mia_userproperties", properties)
    end
```

:::caution
Be aware that these properties depend on the **JWT format**.
:::

### External authorization filter

Lastly, you need to overwrite the **authorizer filter** to add the headers containing the payload data to the authorization request. This way, the authorization service will check if the authentication step has already been executed.

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
          - key: miauserid
            value: '%DYNAMIC_METADATA(["mia.metadata","mia_userid"])%'
          - key: miausergroups
            value: '%DYNAMIC_METADATA(["mia.metadata","mia_groups"])%'
          - key: miauserproperties
            value: '%DYNAMIC_METADATA(["mia.metadata","mia_userproperties"])%'
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

As you may notice, the last three headers include the JWT metadata, extracted and formatted in the previously specified LUA script.

If you are using an authorization service that is different from the one provided in our marketplace, do not forget to add the corresponding cluster:

```yaml
- "@type": type.googleapis.com/envoy.config.cluster.v3.Cluster
  name: authorization-service
  connect_timeout: 30s
  type: LOGICAL_DNS
  lb_policy: ROUND_ROBIN
  load_assignment:
    cluster_name: authorization-service
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: authorization-service
              port_value: 80
```

:::caution
Remember to change the `cluster` and `server_uri` properties of the filter if you are using a custom authorization service.
:::
