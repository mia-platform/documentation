---
id: udp
title: 'Envoy Use Case: UDP'
sidebar_label: 'Use Case: UDP'
---

Envoy allows to accept UDP requests.

The Mia-Platform Console helps to configure the Envoy API Gateway using the [advanced section](/products/console/api-console/advanced-section/index.md).


With the following configuration we configure the api gateway to accept UDP requests to the port 33333 and forward it to the service `udp-server` that accepts traffic at the port 33333.

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
The listener monitors on the port 33333 for incoming UDP packets. Configuring the IP address to `0.0.0.0` we are accepting packets from any address. 

In this configuration, with the field `udp_listener_config.downstream_socket_config.max_rx_datagram_size` we set a maximum size for incoming packets to 9000 bytes. If not set, the default is 1500 bytes. 

We also define a proxy filter that indicates `udp_cluster` as cluster to forward the traffic to. The timeout assigned in the proxy filter is of 60 seconds.

Envoy will also create metrics that will have the prefix `udp_stats`.

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

The configuration creates a cluster `udp_cluster` that forwards the incoming UDP requests to the service `udp-server` to the port 33333.

With the `connect_timeout` field we say that Envoy will wait up to 30 seconds when trying to connect to any endpoint in this cluster.
We set `LOGICAL_DNS` as cluster type which means the endpoints are discovered using DNS resolution, and the DNS results are cached and periodically refreshed.

Finally as load balancing policy we set the standard strategy `ROUND_ROBIN`.
