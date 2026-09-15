---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the AI Foundry chart

This guide walks through installing the `ai-foundry` chart to deploy the AI Foundry platform.

## Required tools

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/helm/helm_install/) v3
- A running **Keycloak** instance with a configured realm and a registered OIDC client for `authtool-bff`. See the [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md).
- A **Google Cloud** project with the [Vertex AI API](https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform) enabled and a service account with `Vertex AI User` permissions.
- An external **PostgreSQL** database (v14+) accessible from the cluster.
- A **Tempo** instance (or compatible OpenTelemetry traces backend) for agent trace collection.

## Required information

| Information | Example |
|---|---|
| Public AI Foundry URL | `https://ai-foundry.your-domain.com` |
| Environment name | `production` |
| Keycloak realm issuer URL | `https://keycloak.your-domain.com/realms/my-realm` |
| OIDC client ID for `authtool-bff` (website) | `ai-foundry-website-bff` |
| OIDC client ID for `authtool-bff` (token exchange) | `ai-foundry-token-exchange` |
| GCP project ID | `my-gcp-project` |
| GCP location | `europe-west1` |
| GCP service account key (JSON) | `service-account.json` |
| PostgreSQL connection string | `postgresql://user:pass@host:5432/ai_foundry` |
| Tempo base URL | `https://tempo.your-domain.com` |
| Mia Platform Catalog URL | `https://catalog.your-domain.com` |
| External Authorization API URL (optional, for `accessControl`/`aiFoundryBff`) | `https://home.your-domain.com` |
| Private container registry credentials | Nexus username and password |

## Step 1: Create the authtool-bff secret

The `authtool-bff` service requires cryptographic key material for session management. Generate and create the secret in the target namespace:

```bash
# Generate RSA private key (base64 encoded, no passphrase)
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key)
rm private.key private.key.pub

# Generate cookie secret and Redis token encryption key
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)

kubectl create secret generic authtool-bff-keys \
  --namespace ai-foundry \
  --from-literal=privateKey="$privateKey" \
  --from-literal=cookieSecret="$cookieSecret" \
  --from-literal=tokenEncKey="$tokenEncKey"
```

:::info
Alternatively, set `secrets.authtoolBffKeys.enabled: true` in your `values.yaml` and provide the values inline; the chart will create the Secret automatically. This is convenient for GitOps pipelines where secret values are injected at deploy time.
:::

`authtool-bff` is configured with three OIDC clients: `website` (the browser login/logout flow), `exchangeCatalog` (a token-exchange client aliased `catalog-api`), and `exchangeAuthz` (a token-exchange client aliased `authz-api`). Each client has its own key material, nested under `secrets.authtoolBffKeys.website.*` / `secrets.authtoolBffKeys.exchangeCatalog.*` / `secrets.authtoolBffKeys.exchangeAuthz.*`.

## Step 2: Create the access-control secret

When `accessControl.config.externalContext.enabled: true` (used together with `authzUrl`), `accessControl` authenticates as its own OIDC client to fetch external authorization context:

```bash
kubectl create secret generic access-control-keys \
  --namespace ai-foundry \
  --from-literal=key.pem="$(base64 < access-control-private.key)"
```

Use `client-secret` instead of `key.pem` when `accessControl.config.externalContext.authorization.tokenAuthMethod` is not `private_key_jwt`.

:::info
Alternatively, set `secrets.accessControlKeys.enabled: true` and provide `secrets.accessControlKeys.privateKey` (or `.clientSecret`) inline.
:::

## Step 3: Create the adk-be-app secret

The `adkBeApp` requires Google Cloud credentials and a PostgreSQL connection string:

```bash
kubectl create secret generic adk-be-app-keys \
  --namespace ai-foundry \
  --from-file=google-application-credentials.json=service-account.json \
  --from-literal=postgresConnectionString="postgresql://user:pass@host:5432/ai_foundry" \
  --from-literal=otelExporterOtlpHeaders=""
```

:::info
Alternatively, set `secrets.adkBeAppKeys.enabled: true` in your `values.yaml`. The `googleApplicationCredentials` field must contain the full JSON content of the service account key file (not the path).
:::

## Step 4: The ai-foundry-bff secret

Unlike the other secrets above, the `ai-foundry-bff-keys` Secret is **always created by the chart** (there is no `secrets.aiFoundryBffKeys.enabled` gate) whenever `aiFoundryBff.enabled: true`. It only contains the Tempo bearer token:

```yaml
secrets:
  aiFoundryBffKeys:
    tempoAuthHeader: "Bearer <TEMPO_TOKEN>"
```

:::tip
This value is typically injected at deploy time (e.g. via `--set` or a SOPS-encrypted values file) rather than committed in plain text.
:::

## Step 5: Create the image pull secret

```bash
kubectl create secret docker-registry nexus-pull-secret \
  --namespace ai-foundry \
  --docker-server=nexus.mia-platform.eu \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD>
```

## Step 6: Prepare a values file

Create a `values.yaml` with the minimum required configuration:

```yaml
# values.yaml

# Public URL of AI Foundry
url: "https://ai-foundry.your-domain.com"
environment: "production"

# Integration with Mia Platform Catalog
catalogUrl: "https://catalog.your-domain.com"
catalogClientId: "catalog-api"

# Optional: URL and client ID of an external Authz API (e.g. the services chart's
# api-gateway, routed to rbacManagement) used by aiFoundryBff and accessControl
# authzUrl: "https://home.your-domain.com"
# authzClientId: "authz-api"

# Optional: route token-exchange calls through authtool-bff for cross-cluster calls.
# Leave empty to forward the caller's JWT verbatim to authzUrl/catalogUrl instead.
# authtoolBffUrl: "http://authtool-bff"

# Keycloak realm issuer URL
authorizationServer:
  issuer: "https://keycloak.your-domain.com/realms/my-realm"

# Traefik IngressRoute
ingressRoute:
  enabled: true
  entryPoints:
    - websecure

# ADK Backend App — Google Cloud configuration
adkBeApp:
  config:
    googleCloudProject: "my-gcp-project"
    googleCloudLocation: "europe-west1"
    googleGenaiUseVertexai: true

# AI Foundry BFF — Tempo observability backend
aiFoundryBff:
  config:
    tempoBaseUrl: "https://tempo.your-domain.com"

# authtool-bff OIDC clients: website (browser login) + two token-exchange clients
authtoolBff:
  config:
    clients:
      website:
        clientId: "ai-foundry-website-bff"
        tokenAuthMethod: "private_key_jwt"
      exchangeCatalog:
        clientId: "ai-foundry-token-exchange"
        clientAlias: "catalog-api"
        tokenAuthMethod: "private_key_jwt"
      exchangeAuthz:
        clientId: "ai-foundry-token-exchange"
        clientAlias: "authz-api"
        tokenAuthMethod: "private_key_jwt"

# Website links to other platform products
aiFoundryWebsite:
  config:
    links:
      consoleHref: "https://console.your-domain.com"
      catalogHref: "https://catalog.your-domain.com"
      homepageHref: "https://home.your-domain.com"

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

See the [Helm Values reference](/requirements/installation-guidelines/ai-foundry/helm-values/00_overview.md) for the full list of available options.

## Step 7: Add the Helm repository and install

```bash
helm repo add mia-platform \
  https://nexus.mia-platform.eu/repository/helm-internal/ \
  --username <YOUR_USERNAME> \
  --password <YOUR_PASSWORD>

helm repo update

helm install ai-foundry mia-platform/ai-foundry \
  --namespace ai-foundry \
  --create-namespace \
  --values values.yaml \
  --atomic \
  --timeout 5m
```

## Step 8: Verify

```bash
kubectl get pods -n ai-foundry
```

All pods should reach `Running` state. Navigate to your configured `url` to access the AI Foundry interface.

## Using the ai-foundry-deployment wrapper

If you are using the `ai-foundry-deployment` wrapper repository for multi-environment GitOps, all chart values must be nested under the `aiFoundry:` key (the Helm dependency alias), **except** `global.*`, which Helm automatically shares with subcharts and must stay at the top level:

```yaml
# values/production.yaml

global:
  imagePullSecret:
    enabled: true
    name: nexus-pull-secret
  imageCredentials:
    registry: "nexus.mia-platform.eu"
    email: "operations@your-domain.com"
    # username/password are typically injected at deploy time via --set

aiFoundry:
  url: "https://ai-foundry.your-domain.com"
  environment: "production"

  catalogUrl: "https://catalog.your-domain.com"
  catalogClientId: "catalog-api"

  authorizationServer:
    issuer: "https://keycloak.your-domain.com/realms/my-realm"

  ingressRoute:
    enabled: true
    entryPoints:
      - websecure

  secrets:
    accessControlKeys:
      enabled: true
    authtoolBffKeys:
      enabled: true
    adkBeAppKeys:
      enabled: true

  adkBeApp:
    config:
      googleCloudProject: "my-gcp-project"
      googleCloudLocation: "europe-west1"
      googleGenaiUseVertexai: true

  authtoolBff:
    config:
      clients:
        website:
          clientId: "ai-foundry-website-bff"
          tokenAuthMethod: "private_key_jwt"
        exchangeCatalog:
          clientId: "ai-foundry-token-exchange"
          clientAlias: "catalog-api"
          tokenAuthMethod: "private_key_jwt"
        exchangeAuthz:
          clientId: "ai-foundry-token-exchange"
          clientAlias: "authz-api"
          tokenAuthMethod: "private_key_jwt"
```

Deploy with:

```bash
helm dependency update

helm install ai-foundry . \
  --namespace ai-foundry \
  --create-namespace \
  --values values/production.yaml \
  --atomic \
  --timeout 5m
```
