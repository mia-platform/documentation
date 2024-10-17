---
id: udp
title: 'Envoy Use Case: UDP'
sidebar_label: 'Use Case: UDP'
---

Envoy allows to accept UDP requests.

The Mia-Platform Console helps to configure the Envoy API Gateway with the advanced section.

### Create the udp listener

```yaml
- "@type": type.googleapis.com/envoy.config.listener.v3.Listener
  name: udp
  address:
    socket_address:
      protocol: UDP
      address: 0.0.0.0
      port_value: 33333
  udp_listener_config:
    downstream_socket_config:
      max_rx_datagram_size: 9000
  listener_filters: 
    - name: envoy.filters.udp_listener.udp_proxy 
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.udp.udp_proxy.v3.UdpProxyConfig
        stat_prefix: udp_stats  
        cluster: udp_cluster
        idle_timeout: 60s    
```

This configuration creates a listener named `udp` that accepts and proxies UDP traffic. 
The listener listen on the port 33333 for incoming UDP packets accepting from any address.

As listener configuration we set a maximum size for incoming packets to 9000 bytes.

We also define a proxy filter that indicates `udp_cluster` as cluster to which forward the traffic and sets a timeout of 60 seconds.

### Create the udp cluster

We also configure a cluster that defines how Envoy forwards traffic to the desired service.

```yaml
- "@type": type.googleapis.com/envoy.config.cluster.v3.Cluster
  name: udp_cluster
  connect_timeout: 30s
  type: LOGICAL_DNS
  lb_policy: ROUND_ROBIN
  load_assignment:
    cluster_name: udp_cluster
    endpoints:
      - lb_endpoints:
          - endpoint:
              address:
                socket_address:
                  address: udp-server
                  port_value: 33333   
```

This cluster forwards the incoming UDP requests to the service `udp-server` to the port 33333.

With this configuration we configured an api gateway to accept UDP requests to the port 33333 and forward it to the service `udp-server` that accepts traffic at the port 33333.


