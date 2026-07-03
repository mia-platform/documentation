---
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the AI Foundry chart

This guide walks through installing the `ai-foundry` chart to deploy the AI Foundry platform.

## Required tools

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/helm/helm_install/) v3
- A running **Keycloak** instance with a configured realm and a registered OIDC client for `authtool-bff`. See the [Keycloak installation guide](/requirements/installation-guidelines/authn/keycloak/15_getting-started.md).
- A **Google Cloud** project with the [Vertex AI API](https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform) enabled and a service account with `Vertex AI User` permissions.
- An external **PostgreSQL** database (v14+) accessible from the cluster.
- A **Tempo** instance (or compatible OpenTelemetry traces backend) for agent trace collection.

## Required information

| Information | Example |
|---|---|
| Public AI Foundry URL | `https://ai-foundry.your-domain.com` |
| Environment name | `production` |
| Keycloak realm issuer URL | `https://keycloak.your-domain.com/realms/my-realm` |
| OIDC client ID for `authtool-bff` | `ai-foundry-bff` |
| OIDC client ID for token exchange | `catalog-api` |
| GCP project ID | `my-gcp-project` |
| GCP location | `europe-west1` |
| GCP service account key (JSON) | `service-account.json` |
| PostgreSQL connection string | `postgresql://user:pass@host:5432/ai_foundry` |
| Tempo base URL | `https://tempo.your-domain.com` |
| Mia Platform Catalog URL | `https://catalog.your-domain.com` |
| Private container registry credentials | Nexus username and password |

## Step 1 — Create the authtool-bff secret

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
Alternatively, set `secrets.authtoolBffKeys.enabled: true` in your `values.yaml` and provide the values inline — the chart will create the Secret automatically. This is convenient for GitOps pipelines where secret values are injected at deploy time.
:::

## Step 2 — Create the adk-be-app secret

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

## Step 3 — Create the ai-foundry-bff secret

The `aiFoundryBff` service requires credentials to access Tempo and PostgreSQL:

```bash
kubectl create secret generic ai-foundry-bff-keys \
  --namespace ai-foundry \
  --from-literal=tempoAuthHeader="Bearer <TEMPO_TOKEN>" \
  --from-literal=postgresPassword="<DB_PASSWORD>" \
  --from-literal=otelExporterOtlpHeaders=""
```

:::tip
This secret is typically managed via [External Secrets Operator](https://external-secrets.io/) in production environments.
:::

## Step 4 — Create the image pull secret

```bash
kubectl create secret docker-registry nexus-pull-secret \
  --namespace ai-foundry \
  --docker-server=nexus.mia-platform.eu \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD>
```

## Step 5 — Prepare a values file

Create a `values.yaml` with the minimum required configuration:

```yaml
# values.yaml

# Public URL of AI Foundry
url: "https://ai-foundry.your-domain.com"
environment: "production"

# Integration with Mia Platform Catalog
catalogUrl: "https://catalog.your-domain.com"
catalogCluster: "console"

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

# authtool-bff OIDC client
authtoolBff:
  tokenAuthMethod: "private_key_jwt"
  config:
    clientId: "ai-foundry-bff"
    exchangeClientId: "catalog-api"

# Website links to other platform products
aiFoundryWebsite:
  config:
    links:
      consoleHref: "https://console.your-domain.com"
      catalogHref: "https://catalog.your-domain.com"
      homepageHref: "https://home.your-domain.com"

# Image pull secret
global:
  imagePullSecrets:
    - name: nexus-pull-secret
  imageCredentials:
    registry: "nexus.mia-platform.eu"
```

See the [Helm Values reference](/requirements/installation-guidelines/ai-foundry/helm-values/00_overview.md) for the full list of available options.

## Step 6 — Add the Helm repository and install

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

## Step 7 — Verify

```bash
kubectl get pods -n ai-foundry
```

All pods should reach `Running` state. Navigate to your configured `url` to access the AI Foundry interface.

## Using the ai-foundry-deployment wrapper

If you are using the `ai-foundry-deployment` wrapper repository for multi-environment GitOps, all chart values must be nested under the `aiFoundry:` key (the Helm dependency alias):

```yaml
# values/production.yaml

aiFoundry:
  url: "https://ai-foundry.your-domain.com"
  environment: "production"

  catalogUrl: "https://catalog.your-domain.com"
  catalogCluster: "console"

  authorizationServer:
    issuer: "https://keycloak.your-domain.com/realms/my-realm"

  ingressRoute:
    enabled: true
    entryPoints:
      - websecure

  secrets:
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
      clientId: "ai-foundry-bff"
      exchangeClientId: "catalog-api"
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
