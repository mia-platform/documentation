---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the Catalog chart

This guide walks through installing the `catalog` chart to deploy the Mia Platform Context Catalog.

## Required tools

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/helm/helm_install/) v3
- A running **Keycloak** instance with a configured realm and a registered OIDC client for `authtool-bff`. See the [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md).
- A `catalog-engine` OIDC client in the same realm, used by `catalogEngine` to sync Catalog permissions to the authorization API (`catalogEngine.config.authzServiceAuthorization`, enabled by default). The [Realm Management](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md) chart creates it (from version `0.1.31`, with `products.catalog: true`) as a `private_key_jwt` client that reads its keys from `<Catalog URL>/.well-known/jwks.json`, with the `mia:authz` and `mia:authz-roles` default scopes and a service account.
- An external **PostgreSQL** database (v14+) for `catalogEngine`.
- A **Kafka** cluster. Two deployment options are supported:
  1. An existing **external** broker (Kafka, Confluent, MSK, a cluster managed by a Strimzi operator, etc.), connected via `catalogKafkaContext` and the `kafka-keys` Secret.
  2. An **embedded** Kafka cluster, deployed by the chart in the Catalog namespace with plain Kubernetes resources, without any operator (`catalogKafkaContext.embedded.enabled: true`). It requires a StorageClass able to provision a `ReadWriteOnce` volume per Kafka node.

## Required information

| Information | Example |
|---|---|
| Public Catalog URL | `https://catalog.your-domain.com` |
| Environment name | `production` |
| Keycloak realm issuer URL | `https://keycloak.your-domain.com/realms/my-realm` |
| OIDC client ID for `authtool-bff` (website) | `catalog-website-bff` |
| OIDC client ID for `authtool-bff` (token exchange) | `catalog-token-exchange` |
| OIDC client ID for `catalogEngine` (permissions sync) | `catalog-engine` |
| PostgreSQL connection string for catalogEngine | `postgresql://user:pass@host:5432/catalog` |
| PostgreSQL connection string for itemsCompressor | `postgresql://user:pass@host:5432/catalog` |
| Kafka bootstrap servers (if external) | `kafka.your-domain.com:9092` |
| External authorization API URL (optional, for `accessControl`) | `https://home.your-domain.com` |
| Private container registry credentials | Nexus username and password |
| AI Services public URL, used by `adkBeApp` and the `/api/docling/` route (unless disabled) | `https://<ai-services host>` |

## Step 1: Create the authtool-bff secret

The `authtool-bff` service requires cryptographic key material for session management:

```bash
# Generate RSA private key (base64 encoded, no passphrase)
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key)
rm private.key private.key.pub

# Generate cookie secret and Redis token encryption key
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)

kubectl create secret generic authtool-bff-keys \
  --namespace catalog \
  --from-literal=privateKey="$privateKey" \
  --from-literal=cookieSecret="$cookieSecret" \
  --from-literal=tokenEncKey="$tokenEncKey"
```

:::info
Alternatively, set `secrets.authtoolBffKeys.enabled: true` in your `values.yaml` and provide the values inline; the chart will create the Secret automatically.
:::

`authtool-bff` is configured with two OIDC clients: `website` (the browser login/logout flow) and `exchange` (a token-exchange client used to obtain `authz-api`-audience tokens for calling authorization APIs on the user's behalf). Each client has its own key material, nested under `secrets.authtoolBffKeys.website.*` / `secrets.authtoolBffKeys.exchange.*`.

## Step 2: Create the access-control secret

When `accessControl.config.externalContext.enabled: true` (used together with `authzUrl`), `accessControl` authenticates as its own OIDC client to fetch external authorization context:

```bash
kubectl create secret generic access-control-keys \
  --namespace catalog \
  --from-literal=key.pem="$(base64 < access-control-private.key)"
```

Use `client-secret` instead of `key.pem` when `accessControl.config.externalContext.authorization.tokenAuthMethod` is not `private_key_jwt`.

:::info
Alternatively, set `secrets.accessControlKeys.enabled: true` and provide `secrets.accessControlKeys.privateKey` (or `.clientSecret`) inline.
:::

## Step 3: Create the catalog-engine secret

The `catalogEngine` requires a PostgreSQL connection string and, when `catalogEngine.config.authzServiceAuthorization.enabled: true` (default), the credentials of the `catalog-engine` OIDC client:

```bash
kubectl create secret generic catalog-engine-keys \
  --namespace catalog \
  --from-literal=postgres-connection-string="postgresql://user:pass@host:5432/catalog" \
  --from-file=key.pem=catalog-engine-private.key
```

`key.pem` is the PEM private key of the `catalog-engine` client. Use `client-secret` instead of `key.pem` when `catalogEngine.config.authzServiceAuthorization.tokenAuthMethod` is not `private_key_jwt`.

:::info
Alternatively, set `secrets.catalogEngineKeys.enabled: true` and provide `secrets.catalogEngineKeys.postgresConnectionString` and `secrets.catalogEngineKeys.privateKey` (or `.clientSecret`) inline.
:::

## Step 4: Create the items-compressor secret

`itemsCompressor` uses a dedicated PostgreSQL schema (not MongoDB) as its deduplication cache:

```bash
kubectl create secret generic items-compressor-keys \
  --namespace catalog \
  --from-literal=postgres-connection-string="postgresql://user:pass@host:5432/catalog"
```

:::info
Alternatively, set `secrets.itemsCompressorKeys.enabled: true` and provide `secrets.itemsCompressorKeys.postgresConnectionString` inline.
:::

## Step 5: Create the Kafka secret (external Kafka only)

Skip this step if you are using the **embedded Kafka** (`catalogKafkaContext.embedded.enabled: true`): the chart fills in the `kafka-keys` Secret itself, and `secrets.kafkaKeys.enabled: true` cannot be combined with it.

For an external Kafka cluster with SASL authentication:

```bash
kubectl create secret generic kafka-keys \
  --namespace catalog \
  --from-literal=bootstrapServers="kafka.your-domain.com:9092" \
  --from-literal=saslUsername="catalog-user" \
  --from-literal=saslPassword="<PASSWORD>"
```

:::info
Set `secrets.kafkaKeys.enabled: true` to have the chart create this Secret inline.
:::

## Step 6: Create the ADK secret (optional)

The `adkBeApp` component requires GCP credentials. Skip this step if you set `adkBeApp.enabled: false`.

```bash
kubectl create secret generic adk-be-app-keys \
  --namespace catalog \
  --from-file=google-application-credentials.json=service-account.json \
  --from-literal=postgresConnectionString="postgresql://user:pass@host:5432/catalog" \
  --from-literal=otelExporterOtlpHeaders=""
```

:::info
Set `secrets.adkBeAppKeys.enabled: true` to have the chart create this Secret inline. The `googleApplicationCredentials` field must contain the full JSON content of the service account key file.
:::

## Step 7: Create the image pull secret

```bash
kubectl create secret docker-registry nexus-pull-secret \
  --namespace catalog \
  --docker-server=nexus.mia-platform.eu \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD>
```

## Step 8: Prepare a values file

Create a `values.yaml` with the minimum required configuration:

```yaml
# values.yaml

# Public URL of the Catalog
url: "https://catalog.your-domain.com"
environment: "production"

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

# authtool-bff OIDC clients: website (browser login) + exchange (token-exchange for authz-api)
authtoolBff:
  config:
    clients:
      website:
        clientId: "catalog-website-bff"
        tokenAuthMethod: "private_key_jwt"
      exchange:
        clientId: "catalog-token-exchange"
        clientAlias: "authz-api"
        tokenAuthMethod: "private_key_jwt"

# AI Services integration (see the note below to disable it)
aiServicesClientId: "ai-services-api"
adkBeApp:
  config:
    # Required while aiGatewayEnabled is true (default)
    litellmProxyApiBase: "https://<ai-services host>/litellm/"
    secretStoreBaseUrl: "https://<ai-services host>"
apiGateway:
  docling:
    # Optional: AI Services Docling, served on /api/docling/
    url: "https://<ai-services host>/api/docling/"

# Optional: URL of an external authorization API (e.g. the services chart's api-gateway,
# routed to rbacManagement) used by accessControl to enrich policy evaluation
# authzUrl: "https://home.your-domain.com"

# Kafka event pipeline
# Option A: embedded Kafka, deployed in the Catalog namespace without any operator
catalogKafkaContext:
  embedded:
    enabled: true
    replicas: 1

# Option B: external Kafka (comment out the block above and use this)
# catalogKafkaContext:
#   connectionConfig:
#     useBootstrapServers: true
#     useSaslUsername: true
#     useSaslPassword: true
#     saslMechanism: SCRAM-SHA-256
#     securityProtocol: SASL_SSL

# Image pull secret
global:
  imagePullSecret:
    enabled: true
    name: nexus-pull-secret
  # Omit imageCredentials if you created the Secret manually in Step 7: the chart
  # creates it only when registry, username, password and email are all set
  imageCredentials:
    registry: "nexus.mia-platform.eu"
    username: "<USERNAME>"
    password: "<PASSWORD>"
    email: "operations@your-domain.com"
```

`adkBeApp` is enabled by default and, with the default `adkBeApp.config.aiGatewayEnabled: true`, the chart fails to render unless `litellmProxyApiBase` and `secretStoreBaseUrl` are set. If you do not use the AI Services LiteLLM gateway, set `adkBeApp.config.aiGatewayEnabled: false` instead. When `adkBeApp.config.catalogApiUrl` is empty, `adkBeApp` reads the agents through the release's own API gateway, so `apiGateway.enabled` must be `true`.

:::tip
To reduce resource usage in non-production environments, disable the ADK Backend App:
```yaml
adkBeApp:
  enabled: false
```
:::

If you set `namespacePrefix`, the chart prepends it (as `<namespacePrefix>-<name>`) to the names of its microservice resources, including the Secrets of the previous steps (for example `<namespacePrefix>-catalog-engine-keys`) and the image pull secret: when you create these Secrets yourself, use the prefixed names. The `kafka-keys` Secret is not prefixed.

See the [Helm Values reference](/requirements/installation-guidelines/catalog/helm-values/00_overview.md) for the full list of available options.

## Step 9: Add the Helm repository and install

```bash
helm repo add mia-platform \
  https://nexus.mia-platform.eu/repository/helm-internal/ \
  --username <YOUR_USERNAME> \
  --password <YOUR_PASSWORD>

helm repo update

helm install catalog mia-platform/catalog \
  --namespace catalog \
  --create-namespace \
  --values values.yaml \
  --atomic \
  --timeout 10m
```

## Step 10: Verify

```bash
kubectl get pods -n catalog
```

All pods should reach `Running` state. Navigate to `<url>/website/` to access the Catalog UI.

## Using the catalog-deployment wrapper

If you are using the `catalog-deployment` wrapper repository for multi-environment GitOps, all chart values must be nested under the `catalog:` key (the chart name, no alias), **except** `global.*`, which Helm automatically shares with subcharts and must stay at the top level:

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

catalog:
  url: "https://catalog.your-domain.com"
  environment: "production"
  isPaaS: true

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
    catalogEngineKeys:
      enabled: true
    itemsCompressorKeys:
      enabled: true

  authtoolBff:
    config:
      clients:
        website:
          clientId: "catalog-website-bff"
          tokenAuthMethod: "private_key_jwt"
        exchange:
          clientId: "catalog-token-exchange"
          clientAlias: "authz-api"
          tokenAuthMethod: "private_key_jwt"

  aiServicesClientId: "ai-services-api"
  adkBeApp:
    config:
      litellmProxyApiBase: "https://<ai-services host>/litellm/"
      secretStoreBaseUrl: "https://<ai-services host>"
  apiGateway:
    docling:
      url: "https://<ai-services host>/api/docling/"
```

Deploy with:

```bash
helm dependency update

helm install catalog . \
  --namespace catalog \
  --create-namespace \
  --values values/production.yaml \
  --atomic \
  --timeout 10m
```
