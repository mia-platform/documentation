---
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the Keycloak chart

## Chart structure

The `keycloak-operator` chart is organised as follows:

```
keycloak-operator/
├── Chart.yaml            # chart metadata; appVersion tracks the custom image version
├── values.yaml           # default values (flat — no subchart nesting)
├── values.schema.json    # JSON Schema for values validation
├── crds/                 # Keycloak Operator CRDs (installed by Helm before templates)
│   ├── keycloaks.k8s.keycloak.org.yaml
│   └── keycloakrealmimports.k8s.keycloak.org.yaml
└── templates/
    ├── _helpers.tpl              # name, fullname, labels, serviceaccount helpers
    ├── keycloak.yaml             # Keycloak CR (k8s.keycloak.org/v2beta1)
    ├── realmimport.yaml          # KeycloakRealmImport CRs (iterates realms[])
    ├── admin-ingress.yaml        # Ingress for the admin hostname
    ├── keystore.yaml             # ExternalSecret for the PKCS12 keystore
    ├── NOTES.txt
    ├── grafana/
    │   ├── configmap-dashboard-keycloak.yaml
    │   └── configmap-dashboard-postgres.yaml
    └── operator/
        ├── clusterrole.yaml
        ├── deployment.yaml
        ├── role.yaml
        ├── rolebinding.yaml
        ├── service.yaml
        └── serviceaccount.yaml
```

Key design points:

- **CRDs in `crds/`** — Helm installs them before any template is rendered, solving the chicken-and-egg problem of having both the operator deployment and the Keycloak CR in the same chart.
- **Operator RBAC is always-on** — monitoring RBAC is not conditional; the operator always has `ServiceMonitor` permissions, so Prometheus integration works out of the box.
- **Flat values** — all configuration is at the root level (no subchart nesting), with the exception of `postgres.*` which proxies to the optional Bitnami PostgreSQL dependency.

## Prerequisites

Before installing, ensure the following are in place:

1. A Kubernetes cluster with `kubectl` access configured.
2. [Helm](https://helm.sh/) v3.
3. An external PostgreSQL instance reachable from the cluster (for production). The database, user, and password should be provisioned before install.
4. If using `vault.enabled: true` or `keystore.enabled: true`: the External Secrets Operator installed with a configured `SecretStore` or `ClusterSecretStore`.

## Step 1 — Create required secrets

Create the bootstrap admin secret in the target namespace:

```bash
kubectl create secret generic keycloak-bootstrap-admin \
  --namespace keycloak \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=temp-admin \
  --from-literal=password=<ADMIN_PASSWORD>
```

If using an external PostgreSQL instance, create the database credentials secret:

```bash
kubectl create secret generic keycloak-db \
  --namespace keycloak \
  --from-literal=username=keycloak \
  --from-literal=password=<DB_PASSWORD>
```

## Step 2 — Prepare a values file

Below is a minimal production values file for a two-instance deployment with an external PostgreSQL database:

```yaml
# my-keycloak-values.yaml
keycloak:
  instances: 2

  hostname:
    hostname: https://keycloak.example.com
    admin: https://keycloak-admin.internal.example.com
    strict: true

  # Public Ingress — expose /realms/, /resources/, /.well-known/
  ingress:
    enabled: true
    className: nginx
    tlsSecret: keycloak-tls

  # Admin Ingress — should be behind a VPN or private load-balancer
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
```

See the [Helm Values reference](/requirements/installation-guidelines/authn/keycloak/helm-values/00_overview.md) for the full list of available values.

## Step 3 — Install

```bash
helm upgrade --install keycloak . \
  --namespace keycloak \
  --create-namespace \
  -f my-keycloak-values.yaml
```

Helm installs the CRDs first, then creates the operator `Deployment`, followed by the `Keycloak` CR. The operator reconciles the CR and provisions the Keycloak `StatefulSet`.

## Step 4 — Verify

Check that the operator and Keycloak pods are running:

```bash
kubectl get pods -n keycloak
```

Expected output (2-instance deployment):

```
NAME                                    READY   STATUS    RESTARTS   AGE
keycloak-0                              1/1     Running   0          2m
keycloak-1                              1/1     Running   0          90s
keycloak-operator-<hash>                1/1     Running   0          3m
```

Check the Keycloak CR status:

```bash
kubectl get keycloak -n keycloak keycloak -o jsonpath='{.status.conditions}' | jq .
```

The condition `Ready` should be `True`. Access the admin console at the admin hostname configured in `keycloak.hostname.admin`.
