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
Currently, we support Envoy `1.21.1`.
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

<!-- ### Extensions migration from NGINX

If you are moving from our [API Gateway based on NGINX](../api-gateway/overview) you should also migrate existing extensions in order to reproduce the same behavior with Envoy. Depending on the extension, this migration can be more or less complicated. In the following sections we will illustrate the migration process for the most commonly used NGINX extensions.

#### Endpoints extension migration

With NGINX API Gateway additional endpoints can be defined using multiple [maps](../../development_suite/api-console/advanced-section/api-gateway/how-to#what-is-a-map):

- `maps-proxyUrl.*.map` for path rewrite
- `maps-proxyName.*.map` for upstream definition

Together, these maps, contain the complete definition of the additional endpoints. In order to add those endpoints to Envoy we can use the [endpoints extension](../../development_suite/api-console/advanced-section/api-gateway-envoy/extensions.md#endpoints). For example, assuming we have the following maps:

```
# File: maps-proxyUrl.before.map

"~^(secreted|unsecreted)-1-GET-/app_dataentry" "cms-site";
"~^(secreted|unsecreted)-1-GET-/users/me" "authentication-service";
"~^(GET|POST|PUT|PATCH|DELETE)-/v2/api/projects(?<path>[/\?].*|$)$" "/api/projects$path";
```

```
# File: maps-proxyName.before.map

"~^(secreted|unsecreted)-1-GET-/app_dataentry" "cms-site";
"~^(secreted|unsecreted)-1-GET-/users/me" "authentication-service";
"~^(GET|POST|PUT|PATCH|DELETE)-/v2/api/projects(?<path>[/\?].*|$)$" "/api/projects$path";
```

They can be translated to:

```yaml
# File: endpoints.yaml
```

The match translation can be done in many ways, we recommend to use: `path` for exact matches, `prefix` for prefixes and `safe_regex` for everything else. -->
