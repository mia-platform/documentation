---
title: Helm Values Overview
sidebar_label: Overview
---

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
