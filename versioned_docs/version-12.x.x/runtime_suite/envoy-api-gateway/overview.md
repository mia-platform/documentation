---
id: overview
title: What is Envoy
sidebar_label: Overview
---
Envoy is a high-performance C++ edge and service proxy, built for microservice applications. Its advanced configuration allows shaping it to work as an API Gateway, to securely manage communication among the project's services. Thanks to its extensive features, the user can customize and enhance its functionalities, adapting them to the application's needs. If you want to know more about Envoy, see the [official website](https://www.envoyproxy.io/).

## Why should I pick Envoy for my project?

Envoy offers a valid alternative to our [API Gateway based on NGINX](../api-gateway/overview). Despite its raw configuration may not be straightforward to write and understand, it provides many advantages:

- **Improved latency:** it performs very well under heavy traffic conditions, with a lower response time with respect to NGINX.
- **JWT authentication:** thanks to its JWT filter, Envoy supports JWT parsing and payload extraction for authentication purposes.
- **Extensions:** Envoy offers a vast variety of [filters](./filters.md), that can be added to improve and customize the default configuration according to the project's needs.
- **Coming soon - RBAC authorization:** Envoy will provide full support for our RBAC authorization, therefore you will not need to rewrite or update your existing policies.

## Default architecture

The configuration of the Envoy API Gateway is divided between 2 main components:

- The **Listener Discovery Service (LDS)**
- The **Cluster Discovery Service (CDS)**

The **LDS** dynamically loads the configuration of the listeners. Each one is identified by a name and an address and has its filter chain. Listeners allow you to build a multi-port architecture, exposing port `8080` for the application traffic, and port `8081` for the backoffice traffic.

On the other hand, the **CDS** presents a list of the available upstream clusters, each corresponding to an underlying service. All the application services need to be declared as clusters in the CDS, to make them reachable for Envoy. Each cluster is identified by its name, followed by the endpoint information, i.e. service name and port.

:::info
Currently, we support Envoy versions greater or equal to `v1.21.1`.
:::

:::caution
If you're using Envoy together with an authorization service, make sure you're using version `2.4.0` or latest.
:::

## Configuration steps

### New project

If you want to create a new project with Envoy as API Gateway, you have two possibilities:

- Use the **Template with Envoy**, which provides a set of basic services (e.g. authorizer, crud service, microservice gateway, etc) together with a default working configuration of the Envoy API Gateway.
- Create a new blank project and add the Envoy API Gateway from the Marketplace. The backend will build the configuration from scratch as you add new services to your project.

### Replacing your current API Gateway with Envoy

If you already have an existing project and want to switch to Envoy, you will just need to delete your current API Gateway and add Envoy from the Marketplace. The backend will automatically rebuild the endpoint and route configuration, thus the service will be ready to use at the first deployment.

:::warning
The existing extensions for the previous API Gateway cannot be automatically migrated, thus they have to be migrated manually.
:::

## Prometheus metrics

Prometheus metrics are exposed by Envoy at the port *9901* with path `/stats/prometheus`.

So, to configure [ServiceMonitor](../../development_suite/api-console/api-design/microservice-monitoring#configure-servicemonitor) in Console, you should set:

- **Path**: `/stats/prometheus`
- **Port**: *9901*
- **Scraping Interval**: `60s`

## Troubleshooting

### Repeated 404 - Not Found for all configured endpoints

If you're repeatedly getting a "404 - Not Found" error from Envoy while trying to contact different endpoints correctly defined in the console, you should check for your authorization service's version: versions previous to `2.4.0` don't support Envoy compatibility.
