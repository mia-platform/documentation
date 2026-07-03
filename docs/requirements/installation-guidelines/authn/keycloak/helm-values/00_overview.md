---
title: Helm Values Overview
sidebar_label: Overview
---

# Keycloak Helm Values Reference

This page documents all configurable values for the `keycloak-operator` Helm chart. Values are organized by functional area.

:::tip
For a minimal working configuration, see the [Getting Started guide](/requirements/installation-guidelines/authn/keycloak/15_getting-started.md). For a production HA example, see `ci/prod-ha-example.yaml` in the chart repository.
:::

## imagePullSecrets

| Key | Type | Default | Description |
|---|---|---|---|
| `imagePullSecrets` | list | `[]` | Image pull secrets applied to all pods (operator + Keycloak). Use when the chart image repository requires authentication. |

## Bootstrap admin helper (`adminBootstrap`)

A convenience helper that creates the bootstrap admin Kubernetes Secret in-cluster. Useful for development. In production, create the secret out-of-band.

| Key | Type | Default | Description |
|---|---|---|---|
| `adminBootstrap.enabled` | bool | `false` | Enable in-cluster bootstrap admin secret creation. |
| `adminBootstrap.username` | string | `"admin"` | Bootstrap admin username. |
| `adminBootstrap.password` | string | `""` | Bootstrap admin password. |

:::warning
`adminBootstrap` stores credentials in plain-text Helm values. **Do not use in production** — create `keycloak-bootstrap-admin` manually or via ESO instead.
:::

## Vault integration (`vault`)

Syncs secrets from HashiCorp Vault via [External Secrets Operator](https://external-secrets.io/) and mounts them inside the Keycloak pods.

| Key | Type | Default | Description |
|---|---|---|---|
| `vault.enabled` | bool | `false` | Enable Vault ExternalSecret creation. |
| `vault.name` | string | `"keycloak-vault-secrets"` | Name of the synced Kubernetes Secret. |
| `vault.refreshInterval` | string | `"1h"` | How often ESO re-syncs from Vault. |
| `vault.mountPath` | string | `"/opt/keycloak/secrets"` | Path inside the pod where the secret is mounted as a volume. |
| `vault.secretStoreRef.name` | string | `""` | Name of the ESO `SecretStore` or `ClusterSecretStore`. |
| `vault.secretStoreRef.kind` | string | `"SecretStore"` | Kind: `SecretStore` or `ClusterSecretStore`. |
| `vault.data` | list | `[]` | Individual key mappings from Vault to Secret keys. |
| `vault.dataFrom` | list | `[]` | Bulk-fetch all keys from a Vault path. |

## Keystore (`keystore`)

Syncs a PKCS12 keystore from an external secret store and mounts it into the Keycloak pods. Used for custom token-signing keys (configure a `java-keystore` key provider in the realm to activate).

| Key | Type | Default | Description |
|---|---|---|---|
| `keystore.enabled` | bool | `false` | Enable keystore ExternalSecret creation. |
| `keystore.name` | string | `"keycloak-keystore"` | Name of the synced Kubernetes Secret. |
| `keystore.refreshInterval` | string | `"1h"` | How often ESO re-syncs. |
| `keystore.secretStoreRef.name` | string | `""` | Name of the ESO SecretStore. |
| `keystore.secretStoreRef.kind` | string | `"SecretStore"` | Kind: `SecretStore` or `ClusterSecretStore`. |
| `keystore.mountPath` | string | `"/opt/keycloak/keystore"` | Path inside the pod where the keystore file is mounted. |
| `keystore.keystoreKey` | string | `"keystore.p12"` | Key in the synced Secret that holds the PKCS12 binary. |
| `keystore.data` | list | `[]` | Remote references to fetch the keystore binary. |

## Grafana dashboards (`grafana`)

Creates labeled ConfigMaps that the Grafana sidecar picks up automatically.

| Key | Type | Default | Description |
|---|---|---|---|
| `grafana.enabled` | bool | `false` | Deploy Keycloak Grafana dashboard ConfigMaps. |
| `grafana.postgres` | bool | `false` | Also deploy PostgreSQL dashboard ConfigMaps (requires `postgres_exporter` metrics). |
| `grafana.defaultLabel` | bool | `true` | Add the default `grafana_dashboard: "1"` label. |
| `grafana.extraLabels` | object | `{}` | Additional labels to add to dashboard ConfigMaps. |

## PostgreSQL subchart (`postgres`) — dev only

Deploys a single-instance PostgreSQL via the Bitnami subchart and auto-wires the Keycloak CR database connection to it.

:::warning Development only
Do not enable `postgres.enabled` in production. Provision PostgreSQL externally and configure the connection via `keycloak.db.*`.
:::

| Key | Type | Default | Description |
|---|---|---|---|
| `postgres.enabled` | bool | `false` | Deploy the embedded PostgreSQL subchart. |
| `postgres.auth.username` | string | `"keycloak"` | PostgreSQL username. |
| `postgres.auth.password` | string | `""` | PostgreSQL password. |
| `postgres.auth.database` | string | `"keycloak"` | PostgreSQL database name. |

## Keycloak Operator (`operator`)

Configuration for the Keycloak Operator Deployment that manages the Keycloak CR.

| Key | Type | Default | Description |
|---|---|---|---|
| `operator.enabled` | bool | `true` | Deploy the Keycloak Operator. |
| `operator.replicaCount` | int | `1` | Number of operator replicas. |
| `operator.image.repository` | string | `"quay.io/keycloak/keycloak-operator"` | Operator image repository. |
| `operator.image.tag` | string | `"26.6.4"` | Operator image tag. **Bump independently from `keycloak.image.tag`** to avoid unnecessary operator restarts during Keycloak rolling updates. |
| `operator.image.pullPolicy` | string | `"IfNotPresent"` | Image pull policy. |
| `operator.resources` | object | `{}` | Resource requests and limits for the operator pod. |
| `operator.service.enabled` | bool | `true` | Create a Service for the operator. |
| `operator.service.type` | string | `"ClusterIP"` | Service type. |
| `operator.service.port` | int | `8080` | Service port. |
| `operator.podAnnotations` | object | `{}` | Annotations for the operator pod. |
| `operator.nodeSelector` | object | `{}` | Node selector for the operator pod. |
| `operator.tolerations` | list | `[]` | Tolerations for the operator pod. |

## Keycloak CR (`keycloak`)

Configuration for the Keycloak custom resource managed by the operator.

### Basic settings

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.enabled` | bool | `true` | Deploy the Keycloak CR. Set to `false` to deploy only the operator. |
| `keycloak.version` | string | `"26.6.4"` | Keycloak version. Used by the operator to validate image compatibility. |
| `keycloak.instances` | int | `1` | Number of Keycloak replicas (StatefulSet). Use `2` or more for HA. |
| `keycloak.image.repository` | string | `"nexus.mia-platform.eu/platform/auth/keycloak"` | Keycloak image repository. |
| `keycloak.image.tag` | string | `"0.3.0-26.6.4-postgres"` | Keycloak image tag. The custom Mia Platform image includes PostgreSQL JDBC driver, OTEL agent, and Vault integration. |
| `keycloak.imagePullSecrets` | list | `~` | Image pull secrets for the Keycloak pods. |

### Bootstrap admin

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.bootstrapAdmin.secret` | string | `""` | Name of the `kubernetes.io/basic-auth` Secret containing the bootstrap admin credentials. Must be created before installation. |

### Database (`keycloak.db`)

All fields map directly to the Keycloak CR `db` spec. When `postgres.enabled: true`, these are auto-populated from the subchart.

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.db.vendor` | string | `"postgres"` | Database type. Currently only `postgres` is supported by the custom image. |
| `keycloak.db.host` | string | `~` | Database hostname. |
| `keycloak.db.port` | int | `~` | Database port. |
| `keycloak.db.database` | string | `~` | Database name. |
| `keycloak.db.schema` | string | `~` | Database schema. |
| `keycloak.db.url` | string | `~` | Full JDBC URL. Use instead of `host`/`port`/`database` when needed. |
| `keycloak.db.usernameSecret` | object | `~` | Reference to a Secret key containing the DB username (`{name, key}`). |
| `keycloak.db.passwordSecret` | object | `~` | Reference to a Secret key containing the DB password (`{name, key}`). |
| `keycloak.db.poolInitialSize` | int | `~` | Initial connection pool size. |
| `keycloak.db.poolMinSize` | int | `~` | Minimum connection pool size. |
| `keycloak.db.poolMaxSize` | int | `~` | Maximum connection pool size. |

### Hostname (`keycloak.hostname`)

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.hostname.hostname` | string | `~` | **Required.** Public URL for the Keycloak instance. Must include the scheme (e.g. `https://keycloak.example.com`) when `hostname.admin` is set. |
| `keycloak.hostname.admin` | string | `~` | Admin console URL (separate hostname). Should be on a VPN-only or internal-LB address. When set, `hostname.hostname` must be a full URL. |
| `keycloak.hostname.adminUrl` | string | `~` | Backend admin URL for the operator. Defaults to `hostname.admin` when set. |
| `keycloak.hostname.strict` | bool | `true` | Reject requests that don't match the configured hostname. Disable only during initial setup. |
| `keycloak.hostname.backchannelDynamic` | bool | `~` | Enable dynamic backchannel URL resolution. |

### HTTP (`keycloak.http`)

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.http.httpEnabled` | bool | `true` | Enable plain HTTP listener. Required when TLS is terminated at the ingress/proxy layer. |
| `keycloak.http.httpPort` | int | `~` | HTTP listener port (default: 8080). |
| `keycloak.http.httpsPort` | int | `~` | HTTPS listener port (default: 8443). |
| `keycloak.http.tlsSecret` | string | `~` | Name of the TLS Secret for HTTPS termination at the Keycloak pod. |

### Ingress

The chart supports two mutually exclusive ingress approaches: **Kubernetes Ingress** or **Traefik IngressRoute**.

**Standard Ingress (`keycloak.ingress`):**

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.ingress.enabled` | bool | `false` | Create a standard Kubernetes Ingress. |
| `keycloak.ingress.className` | string | `""` | Ingress class name (e.g. `nginx`). |
| `keycloak.ingress.annotations` | object | `{}` | Ingress annotations. |
| `keycloak.ingress.tlsSecret` | string | `""` | TLS secret name for the Ingress. |

**Admin Ingress (`keycloak.adminIngress`)** — used when `hostname.admin` points to a separate domain:

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.adminIngress.enabled` | bool | `false` | Create a separate admin Ingress. Must be on an internal/VPN hostname. |
| `keycloak.adminIngress.className` | string | `""` | Ingress class name (e.g. `nginx-internal`). |
| `keycloak.adminIngress.annotations` | object | `{}` | Ingress annotations. |
| `keycloak.adminIngress.tlsSecret` | string | `""` | TLS secret name. |

**Traefik IngressRoute (`keycloak.ingressRoute` / `keycloak.adminIngressRoute`):**

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.ingressRoute.enabled` | bool | `false` | Create a Traefik IngressRoute for the main hostname. |
| `keycloak.ingressRoute.entryPoints` | list | `["websecure"]` | Traefik entry points to attach. |
| `keycloak.adminIngressRoute.enabled` | bool | `false` | Create a Traefik IngressRoute for the admin hostname. |
| `keycloak.adminIngressRoute.entryPoints` | list | `["websecure"]` | Traefik entry points for the admin route. |

### Resources and scheduling

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.resources.requests.cpu` | string | `"500m"` | CPU request. |
| `keycloak.resources.requests.memory` | string | `"512Mi"` | Memory request. |
| `keycloak.resources.limits.cpu` | string | `"2"` | CPU limit. |
| `keycloak.resources.limits.memory` | string | `"1536Mi"` | Memory limit. |
| `keycloak.scheduling` | object | `~` | Full Kubernetes scheduling spec (affinity, tolerations, topologySpreadConstraints). When `null`, the chart injects a default pod anti-affinity by `topology.kubernetes.io/zone`. |
| `keycloak.podDisruptionBudget.enabled` | bool | `false` | Create a PodDisruptionBudget. |
| `keycloak.podDisruptionBudget.minAvailable` | int/string | — | Minimum available pods during disruptions. |
| `keycloak.podDisruptionBudget.maxUnavailable` | int/string | — | Maximum unavailable pods during disruptions. |

### Update strategy

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.update.strategy` | string | `"Auto"` | Keycloak CR update strategy. `Auto` performs a rolling update for patch-level version bumps and falls back to recreate for minor/major bumps. `RecreateOnImageChange` always recreates (downtime on any image change). |

### Monitoring

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.serviceMonitor.enabled` | bool | `true` | Enable Prometheus ServiceMonitor creation (via the Keycloak Operator). |
| `keycloak.serviceMonitor.interval` | string | `"15s"` | Prometheus scrape interval. |

### Telemetry and tracing

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.telemetry.endpoint` | string | — | OpenTelemetry collector endpoint (e.g. `http://otel-collector.monitoring.svc:4317`). |
| `keycloak.telemetry.serviceName` | string | — | Service name for OTEL spans. |
| `keycloak.telemetry.protocol` | string | — | OTEL protocol: `grpc` (default) or `http/protobuf`. |
| `keycloak.tracing.enabled` | bool | — | Enable Keycloak distributed tracing. |
| `keycloak.tracing.endpoint` | string | — | Tracing collector endpoint. |
| `keycloak.tracing.protocol` | string | — | Tracing protocol: `grpc` or `http/protobuf`. |

### Additional options

| Key | Type | Default | Description |
|---|---|---|---|
| `keycloak.additionalOptions` | list | `[]` | Extra Keycloak server options as `{name, value}` objects. Applied after chart-injected defaults (`log-console-output: json`, `metrics-enabled`, etc.). |
| `keycloak.env` | list | `[]` | Extra environment variables injected into the Keycloak container. |
| `keycloak.proxy.headers` | string | `"xforwarded"` | Proxy headers mode: `xforwarded` or `forwarded`. Required when running behind a load balancer. |
| `keycloak.transaction.xaEnabled` | bool | `false` | Enable XA transactions. Disable when the database does not support XA (e.g. PgBouncer in transaction mode). |
| `keycloak.cache` | object | `{}` | Keycloak Infinispan cache configuration. |
| `keycloak.truststores` | object | `{}` | Trust store configuration for outbound TLS (e.g. LDAP, identity providers). |
| `keycloak.unsupported` | object | `{}` | Unsupported `podTemplate` overrides for direct pod spec patching. |
| `keycloak.startOptimized` | bool | `true` | Use the optimized start mode (pre-built image). Set to `false` when using a non-optimized image. |

## Realm imports (`realms`)

| Key | Type | Default | Description |
|---|---|---|---|
| `realms` | list | `[]` | List of `KeycloakRealmImport` CR definitions. Iterate this list to create realm import resources. In most deployments, realms are managed via the `keycloak-realm-management` chart instead. |
# Helm Values — keycloak-operator chart

This page describes all configurable values for the `keycloak-operator` chart. Values are documented by group; see `values.yaml` for defaults and inline comments.

## Operator

Controls the Keycloak Operator deployment.

| Key | Default | Description |
|---|---|---|
| `operator.enabled` | `true` | Deploy the Keycloak Operator |
| `operator.image.repository` | `quay.io/keycloak/keycloak-operator` | Operator image repository |
| `operator.image.tag` | `26.6.4` | Operator image tag. Pinned independently from the Keycloak image. |
| `operator.replicaCount` | `1` | Number of operator replicas |
| `operator.resources` | `{}` | CPU/memory resource requests and limits for the operator pod |
| `operator.nodeSelector` | `{}` | Node selector for the operator pod |
| `operator.tolerations` | `[]` | Tolerations for the operator pod |

## Keycloak instance

Controls the `Keycloak` custom resource, which the operator translates into a `StatefulSet`.

### Identity and hostnames

| Key | Default | Description |
|---|---|---|
| `keycloak.enabled` | `true` | Create the Keycloak CR |
| `keycloak.name` | `keycloak` | `metadata.name` of the Keycloak CR |
| `keycloak.instances` | `1` | Number of Keycloak pods (StatefulSet replicas) |
| `keycloak.hostname.hostname` | `~` | Public-facing URL. **Must include the scheme** (e.g. `https://keycloak.example.com`). When `hostname.admin` is set, the scheme is mandatory. |
| `keycloak.hostname.admin` | `~` | Admin console URL (e.g. `https://keycloak-admin.internal.example.com`). Restricts all `/admin` paths to this address. |
| `keycloak.hostname.strict` | `true` | Reject requests that do not match the configured hostname. |

### Image

| Key | Default | Description |
|---|---|---|
| `keycloak.image.repository` | `nexus.mia-platform.eu/platform/auth/keycloak` | Keycloak image repository |
| `keycloak.image.tag` | `0.3.0-26.6.4-postgres` | Keycloak image tag in the format `<appVersion>-<keycloakVersion>-postgres` |
| `keycloak.imagePullSecrets` | `~` | Image pull secrets for the Keycloak pods |

### Database

For production, provision an external PostgreSQL instance and configure the connection here.

| Key | Default | Description |
|---|---|---|
| `keycloak.db.vendor` | `postgres` | Database vendor. Only `postgres` is supported. |
| `keycloak.db.host` | `~` | Database host (auto-wired when `postgres.enabled: true`) |
| `keycloak.db.port` | `~` | Database port (defaults to 5432) |
| `keycloak.db.database` | `~` | Database name |
| `keycloak.db.usernameSecret` | `~` | Kubernetes secret reference for the database username (`{name, key}`) |
| `keycloak.db.passwordSecret` | `~` | Kubernetes secret reference for the database password (`{name, key}`) |
| `keycloak.db.poolMinSize` | `~` | Minimum connection pool size |
| `keycloak.db.poolMaxSize` | `~` | Maximum connection pool size |

**Example — external PostgreSQL:**

```yaml
keycloak:
  db:
    vendor: postgres
    host: postgres.database.svc
    port: 5432
    database: keycloak
    usernameSecret:
      name: keycloak-db
      key: username
    passwordSecret:
      name: keycloak-db
      key: password
```

### Bootstrap admin

| Key | Default | Description |
|---|---|---|
| `keycloak.bootstrapAdmin.secret` | `""` | Name of the `kubernetes.io/basic-auth` secret with `username` and `password` keys used to bootstrap the first admin account. The secret must be created before install. |

### Ingress and IngressRoute

The chart supports two mutually exclusive routing approaches. Use standard `Ingress` for nginx-class controllers, or `IngressRoute` for Traefik.

**Standard Ingress:**

| Key | Default | Description |
|---|---|---|
| `keycloak.ingress.enabled` | `false` | Create a Kubernetes `Ingress` for the main hostname |
| `keycloak.ingress.className` | `""` | Ingress class (e.g. `nginx`) |
| `keycloak.ingress.tlsSecret` | `""` | TLS secret name for the main hostname |
| `keycloak.adminIngress.enabled` | `false` | Create a separate `Ingress` for the admin hostname. The operator-managed ingress covers only the main hostname. |
| `keycloak.adminIngress.className` | `""` | Ingress class for the admin ingress |
| `keycloak.adminIngress.tlsSecret` | `""` | TLS secret name for the admin ingress |

**Traefik IngressRoute:**

| Key | Default | Description |
|---|---|---|
| `keycloak.ingressRoute.enabled` | `false` | Create a Traefik `IngressRoute` for the main hostname |
| `keycloak.ingressRoute.entryPoints` | `[websecure]` | Traefik entrypoints |
| `keycloak.adminIngressRoute.enabled` | `false` | Create a Traefik `IngressRoute` for the admin hostname |

### HTTP and proxy

| Key | Default | Description |
|---|---|---|
| `keycloak.http.httpEnabled` | `true` | Enable the HTTP (non-TLS) listener. Required when TLS termination is handled by a load balancer or ingress controller. |
| `keycloak.http.tlsSecret` | `~` | TLS secret to enable HTTPS passthrough directly on Keycloak. |
| `keycloak.proxy.headers` | `xforwarded` | Reverse proxy headers mode. Use `xforwarded` when behind a load balancer or ingress. |

### Resources

| Key | Default | Description |
|---|---|---|
| `keycloak.resources.requests.cpu` | `500m` | CPU request |
| `keycloak.resources.requests.memory` | `512Mi` | Memory request |
| `keycloak.resources.limits.cpu` | `2` | CPU limit |
| `keycloak.resources.limits.memory` | `1536Mi` | Memory limit |

### Scheduling and high availability

| Key | Default | Description |
|---|---|---|
| `keycloak.scheduling` | `~` | Pod scheduling overrides. Accepts `affinity`, `tolerations`, and `topologySpreadConstraints`. When not set, the chart injects a default zone-aware `podAntiAffinity` rule. |
| `keycloak.podDisruptionBudget.enabled` | `false` | Create a `PodDisruptionBudget` for Keycloak pods |
| `keycloak.podDisruptionBudget.minAvailable` | — | Minimum number of pods that must remain available during voluntary disruptions |
| `keycloak.podDisruptionBudget.maxUnavailable` | — | Maximum number of pods that can be unavailable during voluntary disruptions |

**Example — HA with PDB and topology spread:**

```yaml
keycloak:
  instances: 3

  scheduling:
    topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: ScheduleAnyway
        labelSelector:
          matchLabels:
            app.kubernetes.io/instance: keycloak
            app.kubernetes.io/managed-by: keycloak-operator

  podDisruptionBudget:
    enabled: true
    minAvailable: 2
```

### Monitoring

| Key | Default | Description |
|---|---|---|
| `keycloak.serviceMonitor.enabled` | `true` | Instruct the Keycloak Operator to create a `ServiceMonitor` for Prometheus scraping |
| `keycloak.serviceMonitor.interval` | `15s` | Scrape interval |

The operator creates the `ServiceMonitor` automatically — no additional Prometheus configuration is required beyond having the Prometheus Operator installed.

### Telemetry (OpenTelemetry)

| Key | Default | Description |
|---|---|---|
| `keycloak.telemetry.endpoint` | — | OTLP exporter endpoint (e.g. `http://otel-collector.monitoring.svc:4317`) |
| `keycloak.telemetry.serviceName` | — | Service name reported in OTEL spans |
| `keycloak.telemetry.protocol` | — | OTLP protocol: `grpc` (default) or `http/protobuf` |
| `keycloak.tracing.enabled` | — | Enable distributed tracing |
| `keycloak.tracing.endpoint` | — | Tracing OTLP endpoint |

## Vault integration (ExternalSecret)

Syncs secrets from a remote secret store into a Kubernetes secret that is mounted read-only inside Keycloak pods. Keycloak resolves `${vault.<name>}` placeholders from mounted files.

| Key | Default | Description |
|---|---|---|
| `vault.enabled` | `false` | Create an `ExternalSecret` for Vault-backed secrets |
| `vault.name` | `keycloak-vault-secrets` | Target Kubernetes secret name |
| `vault.secretStoreRef.name` | `""` | Name of the `SecretStore` or `ClusterSecretStore` to pull from |
| `vault.secretStoreRef.kind` | `SecretStore` | Kind of the secret store |
| `vault.refreshInterval` | `1h` | How often to re-sync from the remote store |
| `vault.data` | `[]` | Individual key mappings from the remote store |
| `vault.dataFrom` | `[]` | Bulk extraction from the remote store |
| `vault.mountPath` | `/opt/keycloak/secrets` | Mount path inside Keycloak pods |

**Naming convention:** Keycloak's file vault uses `<realm>_<secretname>` as the key. For example, the keystore password for the `master` realm is stored as `master_keystore-password` and referenced in realm config as `${vault.keystore-password}`.

## Keystore (ExternalSecret)

Syncs a PKCS12 keystore from a remote secret store and mounts it into Keycloak pods. Use this to supply token-signing keys managed externally.

| Key | Default | Description |
|---|---|---|
| `keystore.enabled` | `false` | Create an `ExternalSecret` for the keystore |
| `keystore.name` | `keycloak-keystore` | Target Kubernetes secret name |
| `keystore.secretStoreRef.name` | `""` | SecretStore name |
| `keystore.secretStoreRef.kind` | `SecretStore` | SecretStore kind |
| `keystore.mountPath` | `/opt/keycloak/keystore` | Mount path inside Keycloak pods |
| `keystore.keystoreKey` | `keystore.p12` | Key inside the synced secret holding the keystore binary |
| `keystore.data` | `[]` | Remote references to fetch the keystore binary |

## Grafana dashboards

| Key | Default | Description |
|---|---|---|
| `grafana.enabled` | `false` | Create Keycloak dashboard `ConfigMap` resources with `grafana_dashboard: "1"` label for sidecar auto-discovery |
| `grafana.postgres` | `false` | Also create PostgreSQL dashboard `ConfigMap` resources (requires `grafana.enabled: true`) |
| `grafana.defaultLabel` | `true` | Add the `grafana_dashboard: "1"` label |
| `grafana.extraLabels` | `{}` | Additional labels on dashboard `ConfigMap` resources |

## PostgreSQL (development only)

Deploys a single-instance Bitnami PostgreSQL via a subchart dependency. **For development and testing only — do not use in production.**

| Key | Default | Description |
|---|---|---|
| `postgres.enabled` | `false` | Deploy Bitnami PostgreSQL and auto-wire the Keycloak DB connection |
| `postgres.auth.username` | `keycloak` | Database user |
| `postgres.auth.password` | `""` | Database password |
| `postgres.auth.database` | `keycloak` | Database name |

When `postgres.enabled: true`, the chart automatically sets `keycloak.db.host`, `keycloak.db.usernameSecret`, and `keycloak.db.passwordSecret` to point at the Bitnami instance.

## Complete production example

```yaml
# keycloak-prod-values.yaml
keycloak:
  instances: 2

  imagePullSecrets:
    - name: nexus-pull-secret

  hostname:
    hostname: https://keycloak.example.com
    admin: https://keycloak-admin.internal.example.com
    strict: true

  ingress:
    enabled: true
    className: nginx
    tlsSecret: keycloak-tls

  adminIngress:
    enabled: true
    className: nginx-internal
    tlsSecret: keycloak-admin-tls

  http:
    httpEnabled: true

  proxy:
    headers: xforwarded

  db:
    vendor: postgres
    host: postgres.database.svc
    port: 5432
    database: keycloak
    usernameSecret:
      name: keycloak-db
      key: username
    passwordSecret:
      name: keycloak-db
      key: password

  bootstrapAdmin:
    secret: keycloak-bootstrap-admin

  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: "2"
      memory: 1536Mi

  podDisruptionBudget:
    enabled: true
    minAvailable: 1

  serviceMonitor:
    enabled: true
    interval: 15s
```
