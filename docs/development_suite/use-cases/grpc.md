---
id: grpc
title:  Use gRPC services
sidebar_label: Use gRPC services
description: Configure and expose a gRPC service from Console
---

Following this guide, it is possible to release an already existent gRPC service to Kubernetes using the Mia-Platform Console.

gRPC is a modern and open source high performance Remote Procedure Call (RPC) framework incubating by CNCF. [The site](https://grpc.io/) of gRPC contains all the documentation on what it is, why it should be used and how to start to create your first gRPC service (SDK are available in multiple language).

Prerequisite:

- a Console project with at least one environment (follow [this guide](/console/project-configuration/create-a-project.mdx) if you want to create it)
<!-- TODO: change YAGES with our gRPC server -->
- a service using gRPC. In the following use case we use as example [YAGES](https://github.com/mhausenblas/yages) (yet another gRPC echo server)
- a Kubernetes cluster with installed Traefik ingress (the default ingress used in Mia-Platform PaaS)

Let's start!

## Add the service

In Console, go to the Microservices section and create a new service from Docker image. Insert `grpc-service` as name and the docker image of the selected gRPC service.

Once created, modify this information:

- API documentation path: remove the default path to avoid to fetch the documentation (since the fetch use http API);
- remove the probes path from the Runtime section (both *Readiness* and *Liveness*)
- remove all the Environment Variables except the `HTTP_PORT` env var, and set as value the port exposed by the service

:::note
Probes in gRPC can use [this tool](https://github.com/grpc-ecosystem/grpc-health-probe/) if you use Kubernetes at version less than 1.24, otherwise it is possible to add [the newly supported specific probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe). Those configuration cannot be done with Console at the moment, but if necessary you can always transform the service to [advanced](/development_suite/api-console/api-design/services.md#advanced-configuration) and set it manually.
:::

## Use inside the cluster

### Deploy

Go to the [Deploy section](/development_suite/deploy/overview.md) and deploy the branch just edited. Once the deploy is successfull, verify that all pods are running (including the `grpc-service`) from the [Runtime section](/development_suite/monitoring/introduction.md) of the Console.

### Test with port-forward

This step is possible only if your user has the permission on the Kubernetes cluster to port-forward in the specified namespace.

Prerequisite to this step are [kubectl](https://kubernetes.io/docs/tasks/tools/) and [grpcurl](https://github.com/fullstorydev/grpcurl) installed.

Copy the following command and change `MY_NAMESPACE` with the namespace where you have deployed the project.

```sh
kubectl -n MY_NAMESPACE port-forward svc/grpc-service 9000:80
```

Once the *grpc-service* is exposed locally, you can contact it with the *grpcurl*

```sh
grpcurl --plaintext localhost:9000 yages.Echo.Ping
```

and you should obtain the response

```json
{
  "text": "pong"
}
```

## From outside the cluster

### With Envoy as Api Gateway and Traefik as ingress

#### Configure envoy

To expose the server with the Envoy API Gateway, you can [create an endpoint](/development_suite/api-console/api-design/endpoints.md) on `/` which point to the `grpc-service` microservice.

:::info
It is possible to expose a specific endpoint pointing to the correct microservice.  
To contact the API, the client must have the `.proto` file loaded. Otherwise, the client try to contact the reflection method of the server, but it use a specific endpoint.  
To expose an endpoint, remember that it is created from the method called. So, if we call the method `yages.Echo.Ping`, the path colled will be `/yages.Echo/Ping`. It is possible from the Console to expose an endpoint with basePath set to `/yages.Echo` and the rewritePath to `/yages.Echo`, and it works.
:::

gRPC is based on http2, so the cluster created in envoy must use http2. To configure so, from the advanced section in design area, open the `api-gateway-envoy/clusters.yaml` file. This file can overwrite the clusters configuration (see [here](/development_suite/api-console/advanced-section/api-gateway-envoy/extensions.md#clusters) the docs).
The `http2_protocol_options` is the option necessary to make it works correctly, so you should add the following configuration:

```yaml
- "@type": type.googleapis.com/envoy.config.cluster.v3.Cluster
  name: grpc-service
  connect_timeout: 30s
  type: LOGICAL_DNS
  lb_policy: ROUND_ROBIN
  http2_protocol_options: {}
  load_assignment:
    cluster_name: grpc-service
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: grpc-service
              port_value: 80
```

It is now possible to test it using the port forward configuration method as showed in the [test with port-forward section](#test-with-port-forward).
You should only change the port-forward command (if your API Gateway is created from Mia-Platform marketplace and the name of the service is `api-gateway`):

```sh
kubectl -n MY_NAMESPACE port-forward svc/api-gateway 8080:80
```

#### Configure Traefik

To expose a gRPC endpoint from the cluster with traefik, it is necessary to add the scheme **h2c** to the *IngressRoute* resource.
In the following example, the match is to the host `MY_HOST`. Under the services field, note that the scheme is set to **h2c**. This is the configuration required to make the gRPC call works.

```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: default-ingress
  labels:
    app.kubernetes.io/instance: "ingress-controller"
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`MY_HOST`)
      middlewares:
        - name: "ingress-controller-hsts-headers"
          namespace: mia-platform
      kind: Rule
      services:
        - name: api-gateway
          port: 8080
          scheme: h2c
  tls:
    options:
      name: ingress-controller-intermediate-tls
      namespace: mia-platform
    secretName: default-cert
```

It is possible to test the connection (sobstitute  *MY_HOST* with your host, remember to add the default port *443* if not already set a port in *MY_HOST*):

```sh
grpcurl MY_HOST yages.Echo.Ping
```

:::note
The scheme **h2c** works with envoy also with rest API
:::
