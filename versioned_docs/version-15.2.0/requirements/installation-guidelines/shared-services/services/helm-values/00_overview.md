---
id: overview
title: Helm Values Overview
sidebar_label: Overview
---

# Helm Values: services chart

This page describes all configurable values for the `services` chart. See `values.yaml` for defaults.

## URL and exposure

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `url` | string | `""` | ✅ | Full public URL where the homepage is exposed (e.g. `https://home.your-domain.com`). Used to configure OIDC redirect URIs and routing. |
| `isPaaS` | boolean | `false` | ❌ | Set to `true` for Mia Platform PaaS deployments. Enables PaaS-specific routing and features. |

## IngressRoute (Traefik)

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `ingressRoute.enabled` | boolean | `false` | ❌ | Create a Traefik `IngressRoute` resource for the homepage. |
| `ingressRoute.entryPoints` | array | `["websecure"]` | ❌ | Traefik entry points to attach the route to. |
| `ingressRoute.middlewares` | array | `[]` | ❌ | Additional Traefik middleware references (e.g. IP filtering, rate limiting). |
| `ingressRoute.tlsEnabled` | boolean | `false` | ❌ | Add a `tls` block to the `IngressRoute` spec. |
| `ingressRoute.tls` | object | `{}` | ❌ | Pass-through Traefik TLS spec (e.g. `{ secretName: my-cert }`). Rendered only when `tlsEnabled: true`. |

## Authorization server

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `authorizationServer.enabled` | boolean | `true` | ❌ | Enable OIDC token validation against the configured issuer. |
| `authorizationServer.issuer` | string | `""` | ✅ | Keycloak realm issuer URL (e.g. `https://keycloak.your-domain.com/realms/my-realm`). Used by Envoy and `authtool-bff` to discover OIDC endpoints and validate tokens. |

## Telemetry

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `telemetry.enabled` | boolean | `false` | ❌ | Enable OpenTelemetry tracing. |
| `telemetry.otelExporterOtlpEndpoint` | string | `""` | ❌ | OTLP endpoint for all signals (traces, metrics, logs). |
| `telemetry.otelExporterOtlpTracesEndpoint` | string | `""` | ❌ | OTLP endpoint for traces only. Overrides the general endpoint for traces. |

## Secrets

The chart can manage the `authtool-bff` key material as a Kubernetes `Secret`. This is optional: if you prefer to create the secret externally (e.g. via External Secrets Operator), set `enabled: false` and create the secret manually before installing.

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `secrets.authtoolBffKeys.enabled` | boolean | `false` | ❌ | When `true`, the chart creates a `Secret` named `authtool-bff-keys` from the values below. |
| `secrets.authtoolBffKeys.privateKey` | string | `""` | ❌ | RSA private key in PEM format, base64 encoded. Used when `authtoolBff.tokenAuthMethod` is `private_key_jwt`. |
| `secrets.authtoolBffKeys.cookieSecret` | string | `""` | ❌ | Secret used to sign and encrypt session cookies. |
| `secrets.authtoolBffKeys.tokenEncKey` | string | `""` | ❌ | Key used to encrypt token data stored in Redis. |
| `secrets.authtoolBffKeys.clientSecret` | string | `""` | ❌ | OIDC client secret. Required when `authtoolBff.tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

:::tip Key generation
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key); rm private.key private.key.pub
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)
```
:::

The chart can similarly manage the `rbacManagement` PostgreSQL connection string as a Kubernetes `Secret`:

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `secrets.rbacManagementKeys.enabled` | boolean | `false` | ❌ | When `true`, the chart creates a `Secret` named `rbac-management-keys` from the value below. |
| `secrets.rbacManagementKeys.postgresConnectionString` | string | `""` | ❌ | Full PostgreSQL connection string (e.g. `postgresql://user:password@host:5432/database`), mounted into the `rbacManagement` pod. |

## Global image settings

| Key | Type | Default | Description |
|---|---|---|---|
| `global.labels` | object | `{}` | Additional labels added to all resources. |
| `global.annotations` | object | `{}` | Additional annotations added to all resources. |
| `global.imagePullSecret.enabled` | boolean | `false` | When `true`, the chart creates a `kubernetes.io/dockerconfigjson` Secret from `global.imageCredentials` and references it on every pod. |
| `global.imagePullSecret.name` | string | `""` | Name of the image pull secret. Must match an existing Secret when `enabled: false`, or is created by the chart when `enabled: true`. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname (e.g. `nexus.mia-platform.eu`). Also used as the fallback registry for any microservice image that does not set its own `image.registry`. |
| `global.imageCredentials.username` | string | `""` | Registry username. Typically injected at deploy time via `--set` rather than committed to a values file. |
| `global.imageCredentials.password` | string | `""` | Registry password/token. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.email` | string | `""` | Email associated with the registry credentials (required by the `dockerconfigjson` format). |

## Service accounts

Each microservice gets its own dedicated `ServiceAccount`, created by default.

| Key | Type | Default | Description |
|---|---|---|---|
| `serviceAccounts.accessControl.enabled` | boolean | `true` | Create a ServiceAccount for `accessControl`. |
| `serviceAccounts.apiGateway.enabled` | boolean | `true` | Create a ServiceAccount for `apiGateway`. |
| `serviceAccounts.authtoolBff.enabled` | boolean | `true` | Create a ServiceAccount for `authtoolBff`. |
| `serviceAccounts.cache.enabled` | boolean | `true` | Create a ServiceAccount for `cache`. |
| `serviceAccounts.homepageWebsite.enabled` | boolean | `true` | Create a ServiceAccount for `homepageWebsite`. |
| `serviceAccounts.rbacManagement.enabled` | boolean | `true` | Create a ServiceAccount for `rbacManagement`. |
| `serviceAccounts.swaggerAggregator.enabled` | boolean | `true` | Create a ServiceAccount for `swaggerAggregator`. |

## Common microservice fields

All microservices share the following configurable fields:

| Key | Type | Description |
|---|---|---|
| `<service>.enabled` | boolean | Enable or disable the microservice. |
| `<service>.replicaCount` | integer | Number of pod replicas. |
| `<service>.autoscaling.enabled` | boolean | Enable Horizontal Pod Autoscaler. |
| `<service>.autoscaling.minReplicas` | integer | Minimum replicas when autoscaling is enabled. |
| `<service>.autoscaling.maxReplicas` | integer | Maximum replicas when autoscaling is enabled. |
| `<service>.autoscaling.targetCPUUtilizationPercentage` | integer | Target average CPU utilization used to scale the HPA. |
| `<service>.image.registry` | string | Container registry. Falls back to `global.imageCredentials.registry` when unset. |
| `<service>.image.repository` | string | Image repository path. |
| `<service>.image.tag` | string | Image tag. |
| `<service>.image.pullPolicy` | string | `IfNotPresent`, `Always`, or `Never`. |
| `<service>.resources.requests.cpu` | string | CPU request. |
| `<service>.resources.requests.memory` | string | Memory request. |
| `<service>.resources.limits.cpu` | string | CPU limit. |
| `<service>.resources.limits.memory` | string | Memory limit. |
| `<service>.logLevel` | string | Log level: `trace`, `debug`, `info`, `warn`, `error`. |
| `<service>.env` | array | Extra environment variables (`{name, value}` or `{name, valueFrom}` objects) injected into the container. |

## apiGateway

Envoy reverse proxy. Routes all inbound traffic and delegates per-request authorization to `accessControl`.

| Key | Type | Default | Description |
|---|---|---|---|
| `apiGateway.enabled` | boolean | `true` | Deploy the API gateway. |
| `apiGateway.maxBodyBytes` | integer | `10485760` | Maximum allowed request body size in bytes (default: 10 MiB). |
| `apiGateway.extraVirtualHosts` | array | `[]` | Additional hostnames (and, optionally, ports) accepted on the main virtual host, e.g. when the homepage is reachable under more than one domain/port. |
| `apiGateway.authorizationServer.audiences` | array | `["authz-api"]` | Expected token audiences accepted when validating requests against the authorization server. |
| `apiGateway.config.clusterOverrides` | object | `{}` | Override upstream cluster addresses. Keys are cluster names; values are objects with `address` (string) and `port_value` (integer). |

## accessControl

OPA-based ext-authz service. Receives authorization sub-requests from Envoy and allows or denies them based on RBAC policies.

| Key | Type | Default | Description |
|---|---|---|---|
| `accessControl.enabled` | boolean | `true` | Deploy the access control service. |

## authtoolBff

OIDC Backend-for-Frontend. Handles the PKCE login/logout flow with Keycloak and issues signed, encrypted session cookies.

| Key | Type | Default | Description |
|---|---|---|---|
| `authtoolBff.enabled` | boolean | `true` | Deploy the authtool-bff service. |
| `authtoolBff.tokenAuthMethod` | string | `private_key_jwt` | Token endpoint authentication method. One of: `private_key_jwt` (requires `privateKey` secret), `client_secret_basic`, `client_secret_post` (both require `clientSecret` secret). |
| `authtoolBff.config.clientId` | string | `""` | **Required.** OIDC client ID registered in Keycloak. |
| `authtoolBff.config.disableAccessTokenEncryption` | boolean | `false` | Disable encryption of the access token stored in Redis. Leave `false` unless required for debugging. |
| `authtoolBff.config.userClaims` | array | `[]` | List of Keycloak token claims to forward in the session. |
| `authtoolBff.config.authorizationCache` | object | `{}` | Configuration for caching authorization decisions in Redis. |

## cache

Redis instance used by `authtool-bff` for session token storage.

| Key | Type | Default | Description |
|---|---|---|---|
| `cache.enabled` | boolean | `true` | Deploy the Redis cache. |
| `cache.maxMemory` | string | `"192mb"` | Redis `maxmemory` directive. Adjust based on expected concurrent sessions. |

## homepageWebsite

Mia Platform homepage frontend Single Page Application.

| Key | Type | Default | Description |
|---|---|---|---|
| `homepageWebsite.enabled` | boolean | `true` | Deploy the homepage website. |
| `homepageWebsite.config.baseHref` | string | `"/home/"` | Base href for the SPA router. Set to `"/"` when the homepage is served at the root path. |

## rbacManagement

RBAC administration API (REST on port `80`/`3000`, gRPC on port `50051`). Manages roles, permissions, and product access, backed by an external PostgreSQL database. Requires the `rbac-management-keys` Secret (see [Secrets](#secrets)).

| Key | Type | Default | Description |
|---|---|---|---|
| `rbacManagement.enabled` | boolean | `true` | Deploy the RBAC management service. |

## swaggerAggregator

Optional API portal. Aggregates OpenAPI specs from projects and exposes them through a unified documentation interface. Disabled by default.

| Key | Type | Default | Description |
|---|---|---|---|
| `swaggerAggregator.enabled` | boolean | `false` | Deploy the Swagger aggregator. |
| `swaggerAggregator.config.clientId` | string | `""` | OIDC client ID used by the aggregator to authenticate when fetching protected OpenAPI specs. |
