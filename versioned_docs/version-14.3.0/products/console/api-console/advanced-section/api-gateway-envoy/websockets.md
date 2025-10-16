---
id: websockets
title: 'Envoy Use Case: WebSockets'
sidebar_label: 'Use Case: WebSockets'
---

Envoy supports tunneling WebSockets over HTTP/2 and above. This feature can be enabled from the console through the advanced section.

:::info
If you wish to know more about Envoy WebSocket support, visit the [official documentation](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/upgrades).
:::

Firstly, you will need to configure the microservice, and add the corresponding entry in `clusters.yaml`. For example:

```yaml
- "@type": type.googleapis.com/envoy.config.cluster.v3.Cluster
  name: websocket-service
  connect_timeout: 30s
  type: LOGICAL_DNS
  lb_policy: ROUND_ROBIN
  load_assignment:
    cluster_name: websocket-service
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: websocket-service
              port_value: 80
```

Since WebSockets need the configuration of an additional property in the corresponding route, the WebSocket's endpoint cannot be added in the Endpoints section. Instead, you will need to create it through the `endpoints.yaml` extension file.

```yaml
- listener_name: frontend
  match: 
    path: "/websocket-route"
  route:
    timeout: 0s
    cluster: websocket-service
    upgrade_configs:
      upgrade_type: websocket
```

The snippet above adds a frontend endpoint towards the `websocket-service` configured beforehand. In the property `upgrade_configs`, you can specify the type of upgrade desired for the corresponding connection, `websocket` in this case.

:::warning
The described endpoint is just a simple example to highlight the WebSocket configuration. Remember to edit it if you need additional features (e.g. rewrites, secret resolution, etc.).
:::