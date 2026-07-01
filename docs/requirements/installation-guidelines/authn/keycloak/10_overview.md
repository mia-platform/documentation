---
title: Keycloak Overview
sidebar_label: Overview
---

# Keycloak

The `keycloak-operator` Helm chart deploys a Keycloak instance on Kubernetes using the [official Keycloak Operator](https://www.keycloak.org/operator/installation) and a Mia Platform custom image optimised for PostgreSQL, OpenTelemetry, and Vault-based secret management.

## What the chart deploys

| Component | Description |
|---|---|
| **Keycloak Operator** | Controller that manages the Keycloak custom resource lifecycle (install, upgrade, HA). Deployed as a `Deployment` in the target namespace. |
| **CRDs** | `Keycloak` and `KeycloakRealmImport` custom resource definitions installed from the chart's `crds/` directory. Helm installs CRDs before templates, handling the operator bootstrap ordering automatically. |
| **Keycloak CR** (`k8s.keycloak.org/v2beta1`) | Declarative specification of the Keycloak instance. The operator translates it into a managed `StatefulSet`. |
| **RBAC** | `ClusterRole`, `Role`, and `RoleBinding` for the operator. Monitoring RBAC (`monitoring.coreos.com` permissions) is always included so the operator can manage `ServiceMonitor` resources. |
| **Service** | `ClusterIP` service exposing the Keycloak HTTP port. |
| **Ingress / IngressRoute** | Optional. Standard Kubernetes `Ingress` or Traefik `IngressRoute` for public and admin hostnames — mutually exclusive. |
| **ExternalSecrets** | Optional. `ExternalSecret` resources that sync Vault-backed secrets and PKCS12 keystores from a remote secret store into Kubernetes secrets, via the External Secrets Operator. |

## Custom Mia Platform image

The chart uses a Mia Platform pre-built image (`nexus.mia-platform.eu/platform/auth/keycloak`) built with `kc.sh build --optimized` at image time, which reduces startup time significantly compared to the standard Keycloak image. The image includes:

- **PostgreSQL driver** — the only supported database vendor for production deployments.
- **Health and metrics endpoints** — required for the operator's liveness/readiness probes and for Prometheus ServiceMonitor scraping.
- **OpenTelemetry** — distributed traces, metrics, and structured logs exportable to any OTEL Collector.
- **File vault** (`KC_VAULT=file`) — Keycloak resolves `${vault.<name>}` placeholders from mounted secrets, enabling credential injection without environment variables.
- **SCIM 2.0** (`KC_FEATURE_SCIM_API`) — built-in user provisioning endpoint for automated user lifecycle management.

The image tag format is `<appVersion>-<keycloakVersion>-postgres` (e.g. `0.3.0-26.6.4-postgres`).

## Operator and Keycloak version decoupling

The Keycloak Operator version (`operator.image.tag`) and the Keycloak instance image version (`keycloak.image.tag`) are pinned independently. This means:

- **Patch-only Keycloak bump** — change only `keycloak.image.tag`. The running operator detects the CR update and performs a rolling StatefulSet update without restarting itself.
- **Operator bump** — change only `operator.image.tag` in a separate release. The operator pod restarts but the Keycloak StatefulSet is not modified.
- **Minor or major Keycloak bump** — bump both in separate releases (operator first). See the [upgrade guide](/requirements/installation-guidelines/authn/keycloak/100_how-to-upgrade.md) for details.

This separation means that routine Keycloak patch upgrades never require an operator restart.

## Update strategy

The Keycloak CR defaults to `update.strategy: Auto`. The operator evaluates whether a rolling update is safe at each reconciliation:

- **Same major.minor, patch-only change** → rolling update on the StatefulSet, zero downtime.
- **Minor or major version change** → recreate strategy: the StatefulSet is scaled to zero and back up. Downtime is expected for database schema migrations.

## Prerequisites

| Component | Required | Notes |
|---|---|---|
| Kubernetes | **yes** | ≥ 1.28 recommended |
| PostgreSQL | **yes** (external for production) | `postgres.enabled: true` deploys a single-instance Bitnami PostgreSQL for development and testing only |
| External Secrets Operator | when `vault.enabled: true` or `keystore.enabled: true` | Must be installed and configured separately; the chart does not deploy ESO or its CRDs |
| Prometheus Operator | no | `ServiceMonitor` resources are created by the Keycloak Operator automatically when `serviceMonitor.enabled: true` |
| Traefik | no | Required only when using `ingressRoute.enabled: true` |

## Secrets required before installation

The chart does **not** create secrets containing sensitive credentials. The following Kubernetes secrets must be provisioned in the target namespace before running `helm install`:

| Secret name | Keys | Purpose |
|---|---|---|
| `keycloak-bootstrap-admin` | `username`, `password` (type: `kubernetes.io/basic-auth`) | Temporary bootstrap admin account. Keycloak removes it automatically after the first permanent admin is created. |
| `keycloak-vault-secrets` | realm-specific entries (e.g. `master_keystore-password`) | Mounted read-only at `/opt/keycloak/secrets`. Keycloak resolves `${vault.<name>}` placeholders from these files. Required only when `vault.enabled: true`. |
| `keycloak-keystore` | `keystore.p12` (PKCS12 binary) | Token-signing keystore mounted at `/opt/keycloak/keystore`. Required only when `keystore.enabled: true`. |

When `vault.enabled: true` or `keystore.enabled: true`, the chart renders `ExternalSecret` resources that sync these secrets from a remote store (e.g. HashiCorp Vault, AWS Secrets Manager) automatically, provided the External Secrets Operator is installed and a `SecretStore` / `ClusterSecretStore` is configured.
