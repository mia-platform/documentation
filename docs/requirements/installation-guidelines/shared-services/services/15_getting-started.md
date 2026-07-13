---
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the Services chart

This guide walks through installing the `services` chart to deploy the Mia Platform homepage and the authentication/authorization layer.

## Required tools

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/helm/helm_install/) v3
- A running **Keycloak** instance with a configured realm and a registered OIDC client for `authtool-bff`. See the [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md).

## Required information

| Information | Example |
|---|---|
| Public homepage URL | `https://home.your-domain.com` |
| Keycloak realm issuer URL | `https://keycloak.your-domain.com/realms/my-realm` |
| OIDC client ID for `authtool-bff` | `homepage-bff` |
| Private container registry credentials | Nexus username and password |

## Step 1: Create the authtool-bff secret

The `authtool-bff` service requires three cryptographic secrets. Generate and create them in the target namespace:

```bash
# Generate RSA private key (base64 encoded, no passphrase)
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key)
rm private.key private.key.pub

# Generate cookie secret and Redis token encryption key
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)

# Create the Kubernetes secret
kubectl create secret generic authtool-bff-keys \
  --namespace services \
  --from-literal=privateKey="$privateKey" \
  --from-literal=cookieSecret="$cookieSecret" \
  --from-literal=tokenEncKey="$tokenEncKey"
```

:::info
Alternatively, set `secrets.authtoolBffKeys.enabled: true` in your `values.yaml` and provide the values inline; the chart will create the Secret automatically. This is convenient for GitOps pipelines where secret values are injected at deploy time.
:::

If using `authtoolBff.tokenAuthMethod: client_secret_post` or `client_secret_basic` instead of the default `private_key_jwt`, also include the `clientSecret` key with the OIDC client secret from Keycloak.

## Step 2: Create the rbac-management secret

The `rbacManagement` service requires a PostgreSQL connection string, stored as a Kubernetes secret:

```bash
kubectl create secret generic rbac-management-keys \
  --namespace services \
  --from-literal=postgres-connection-string="postgresql://<user>:<password>@<host>:5432/<database>"
```

A helper script is also available in the chart repository (`hacks/setup_rbac_management_keys.sh`), which reads `NAMESPACE`, `RBAC_MANAGEMENT_KEYS_SECRET_NAME`, and `POSTGRES_CONNECTION_STRING` from the environment.

:::info
Alternatively, set `secrets.rbacManagementKeys.enabled: true` in your `values.yaml` and provide `secrets.rbacManagementKeys.postgresConnectionString` inline; the chart will create the Secret automatically.
:::

## Step 3: Create the image pull secret

```bash
kubectl create secret docker-registry nexus-pull-secret \
  --namespace services \
  --docker-server=nexus.mia-platform.eu \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD>
```

:::info
Alternatively, set `global.imagePullSecret.enabled: true` and provide `global.imageCredentials.registry`/`username`/`password`/`email` in your `values.yaml`; the chart will create the `kubernetes.io/dockerconfigjson` Secret automatically and reference it on every pod. This is convenient for CI/CD pipelines, where `username`/`password` are typically injected at deploy time via `--set` rather than committed to a values file.
:::

## Step 4: Prepare a values file

Create a `values.yaml` with the minimum required configuration:

```yaml
# values.yaml

# Public URL of the homepage
url: "https://home.your-domain.com"

# Set to true for Mia Platform PaaS deployments
isPaaS: false

# Keycloak realm issuer URL
authorizationServer:
  issuer: "https://keycloak.your-domain.com/realms/my-realm"

# Traefik IngressRoute
ingressRoute:
  enabled: true
  entryPoints:
    - websecure

# authtool-bff OIDC configuration
authtoolBff:
  tokenAuthMethod: "private_key_jwt"
  config:
    clientId: "homepage-bff"

# Image pull secret
global:
  imagePullSecret:
    enabled: true
    name: nexus-pull-secret
  imageCredentials:
    registry: "nexus.mia-platform.eu"
    username: "<USERNAME>"
    password: "<PASSWORD>"
    email: "operations@your-domain.com"
```

See the [Helm Values reference](/requirements/installation-guidelines/shared-services/services/helm-values/00_overview.md) for the full list of available options.

## Step 5: Add the Helm repository and install

```bash
helm repo add mia-platform \
  https://nexus.mia-platform.eu/repository/helm-internal/ \
  --username <YOUR_USERNAME> \
  --password <YOUR_PASSWORD>

helm repo update

helm install services mia-platform/services \
  --namespace services \
  --create-namespace \
  --values values.yaml \
  --atomic \
  --timeout 5m
```

## Step 6: Verify

Check that all pods are running:

```bash
kubectl get pods -n services
```

Expected output:
```
NAME                               READY   STATUS    RESTARTS   AGE
access-control-xxxx                1/1     Running   0          1m
api-gateway-xxxx                   1/1     Running   0          1m
authtool-bff-xxxx                  1/1     Running   0          1m
cache-xxxx                         1/1     Running   0          1m
homepage-website-xxxx              1/1     Running   0          1m
rbac-management-xxxx               1/1     Running   0          1m
```

Navigate to `https://home.your-domain.com`; you should be redirected to the Keycloak login page and, after authentication, see the Mia Platform homepage.

## Using the services-deployment wrapper

For multi-environment setups, it is recommended to use the `services-deployment` repository, which wraps the `services` chart as a Helm dependency and provides per-environment values files.

1. Clone or fork `services-deployment`.
2. Update `Chart.yaml` to pin the desired chart version:

```yaml title="Chart.yaml"
dependencies:
  - name: services
    version: "~X.Y"
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

3. Create or update a values file under `values/` for your environment (e.g. `values/production.yaml`). Note that all values must be nested under the `services:` key since it is a subchart, **except** `global.*`, which Helm automatically shares with subcharts and must stay at the top level:

```yaml title="values/production.yaml"
global:
  imagePullSecret:
    enabled: true
    name: nexus-pull-secret
  imageCredentials:
    registry: "nexus.mia-platform.eu"
    email: "operations@your-domain.com"
    # username/password are typically injected at deploy time via --set

services:
  url: "https://home.your-domain.com"
  isPaaS: false
  authorizationServer:
    issuer: "https://keycloak.your-domain.com/realms/my-realm"
  authtoolBff:
    config:
      clientId: "homepage-bff"
```

4. Deploy:

```bash
helm dependency update

helm upgrade --install services . \
  --namespace services \
  --create-namespace \
  --values values/production.yaml \
  --atomic
```
