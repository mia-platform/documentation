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
- The Keycloak realm configured with the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md) `0.1.47` or later, with `products.aiFoundry: true` and `products.aiServices: true`.
- [Homepage & RBAC](/requirements/installation-guidelines/shared-services/services/15_getting-started.md) installed. AI Foundry calls its authorization API (`authzUrl`) for users, tenants, roles and permissions.
- [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md) installed in its own namespace. AI Foundry uses its LiteLLM AI gateway, Temporal, Docling and memory service.
- An **OpenBao** instance for the `secretStoreService` credential store and, optionally, **Langfuse** and **Prometheus** for the trace and metric screens.
- An external **PostgreSQL** server (v15+) accessible from the cluster, with one database shared by `adk-be-app`, `ai-foundry-be` and `ai-foundry-workflows`, and a separate database for `workspace-service`.

:::info
The installation of Langfuse, OpenBao and Prometheus is not covered by these guides yet: we are working to provide the documentation to install these components as well.
:::

## Required information

| Information | Example |
|---|---|
| Public AI Foundry URL | `https://ai-foundry.your-domain.com` |
| Environment name | `production` |
| Keycloak realm issuer URL | `https://keycloak.your-domain.com/realms/my-realm` |
| OIDC client ID for `authtool-bff` (website) | `ai-foundry-website-bff` |
| OIDC client ID for `authtool-bff` (token exchange) | `ai-foundry-token-exchange` |
| PostgreSQL connection string of `adk-be-app` (shared AI Foundry database, `asyncpg` driver) | `postgresql+asyncpg://user:pass@host:5432/ai_foundry` |
| PostgreSQL connection string of `ai-foundry-be` and `ai-foundry-workflows` (same database) | `postgresql://user:pass@host:5432/ai_foundry` |
| PostgreSQL connection string (workspace service database) | `postgresql://user:pass@host:5432/ai_workspace` |
| LiteLLM AI gateway URL of AI Services | `https://<ai-services host>/litellm/` |
| LiteLLM master key of AI Services (`secrets.litellmProxyKeys.masterKey` of the AI Services values) | `sk-...` |
| Temporal frontend address and Temporal namespace of AI Services | `temporal-frontend.<ai-services namespace>.svc.cluster.local:7233`, a namespace from `temporal.namespaces` of the AI Services values |
| OpenBao address and its AppRole `role-id`/`secret-id` | `https://openbao.your-domain.com` |
| Docling route of AI Services (optional) | `https://<ai-services host>/api/docling/` |
| Mia Platform Catalog URL | `https://catalog.your-domain.com` |
| Authorization API URL of Homepage & RBAC (`authzUrl`) | `https://home.your-domain.com` |
| Private container registry credentials | Nexus username and password |

## Step 1: Create the authtool-bff secret

The `authtool-bff` service requires cryptographic key material for session management. Generate and create the secret in the target namespace:

```bash
# Generate the RSA private keys (no passphrase) of the website client and of the token-exchange client
ssh-keygen -t rsa -b 4096 -m PEM -f website.key -N "" > /dev/null
ssh-keygen -t rsa -b 4096 -m PEM -f token-exchange.key -N "" > /dev/null

# Generate cookie secret and Redis token encryption key
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)

kubectl create secret generic authtool-bff-keys \
  --namespace ai-foundry \
  --from-file=website-key.pem=website.key \
  --from-file=exchangeCatalog-key.pem=token-exchange.key \
  --from-file=exchangeAuthz-key.pem=token-exchange.key \
  --from-file=exchangeAiServices-key.pem=token-exchange.key \
  --from-literal=cookie-secret.key="$cookieSecret" \
  --from-literal=redis-token-enc.key="$tokenEncKey"
```

The Secret holds one `<client>-key.pem` entry for each client that uses `private_key_jwt`, or `<client>-client-secret` for a client that uses `client_secret_post` or `client_secret_basic`.

:::info
Alternatively, set `secrets.authtoolBffKeys.enabled: true` in your `values.yaml` and provide the values inline; the chart will create the Secret automatically. This is convenient for GitOps pipelines where secret values are injected at deploy time.
:::

`authtool-bff` is configured with four OIDC clients: `website` (the browser login/logout flow), `exchangeCatalog` (a token-exchange client aliased `catalog-api`), `exchangeAuthz` (a token-exchange client aliased `authz-api`), and `exchangeAiServices` (a token-exchange client aliased `ai-services-api`, used to call AI Services). Each client has its own key material, nested under `secrets.authtoolBffKeys.website.*` / `secrets.authtoolBffKeys.exchangeCatalog.*` / `secrets.authtoolBffKeys.exchangeAuthz.*` / `secrets.authtoolBffKeys.exchangeAiServices.*`. Every declared client needs its credential, otherwise `authtool-bff` fails at startup: if you do not use AI Services, set `authtoolBff.config.clients.exchangeAiServices: null` and leave `aiServicesClientId` empty.

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

The `adkBeApp` requires a PostgreSQL connection string:

```bash
kubectl create secret generic adk-be-app-keys \
  --namespace ai-foundry \
  --from-literal=postgresConnectionString="postgresql+asyncpg://<user>:<password>@<host>:5432/<database>" \
  --from-literal=otelExporterOtlpHeaders=""
```

`adk-be-app` connects with the `asyncpg` driver: its connection string must start with `postgresql+asyncpg://`.

If your LiteLLM gateway requires a key, also add the `litellmProxyApiKey` entry and set `secrets.adkBeAppKeys.litellmProxyApiKey`.

:::info
Alternatively, set `secrets.adkBeAppKeys.enabled: true` in your `values.yaml` and provide `postgresConnectionString` (and the optional keys) inline.
:::

## Step 4: Create the secrets of the other services

The chart refuses to render when an enabled service has no credential. Create the following Secrets, or set the matching `secrets.<name>.enabled: true` and provide the values inline. The chart no longer creates an `ai-foundry-bff-keys` Secret.

| Secret | Keys | Used by |
|---|---|---|
| `ai-foundry-be-keys` | `postgresConnectionString` (same database as `adk-be-app-keys`, but as `postgresql://` without the `+asyncpg` driver suffix); `litellmAdminKey` (the LiteLLM master key of AI Services) and `mcpConsentKeySecret` (a random secret, kept stable over time), both needed with `aiFoundryBe.config.litellmBaseUrl`; optional `langfuseAuthHeader`, `prometheusAuthHeader` | `aiFoundryBe`, `aiFoundryProvisioner` |
| `ai-foundry-workflows-keys` | `postgresConnectionString` (same database as `adk-be-app-keys`; both `postgresql://` and `postgresql+asyncpg://` are accepted) | `aiFoundryWorkflows` |
| `secret-store-service-keys` | `storeRoleId`, `storeSecretId` (the AppRole pair of your OpenBao) | `secretStoreService` with the default `approle` auth method |
| `workspace-service-keys` | `postgresConnectionString` (a database of its own) | `workspaceService` |
| `ai-foundry-provisioner-keys` | `privateKey` or `clientSecret` of the `ai-foundry-provisioner` Keycloak client | `aiFoundryProvisioner`, only when `catalogUrl` is set |

```bash
kubectl create secret generic ai-foundry-be-keys \
  --namespace ai-foundry \
  --from-literal=postgresConnectionString="postgresql://<user>:<password>@<host>:5432/<database>" \
  --from-literal=litellmAdminKey="<LiteLLM master key of AI Services>" \
  --from-literal=mcpConsentKeySecret="$(openssl rand -hex 32)"

kubectl create secret generic ai-foundry-workflows-keys \
  --namespace ai-foundry \
  --from-literal=postgresConnectionString="postgresql://<user>:<password>@<host>:5432/<database>"

kubectl create secret generic secret-store-service-keys \
  --namespace ai-foundry \
  --from-literal=storeRoleId="<OpenBao AppRole role-id>" \
  --from-literal=storeSecretId="<OpenBao AppRole secret-id>"

kubectl create secret generic workspace-service-keys \
  --namespace ai-foundry \
  --from-literal=postgresConnectionString="postgresql://<user>:<password>@<host>:5432/<workspace database>"
```

:::tip
To skip a feature instead, set `aiFoundryWorkflows.enabled: false` or `workspaceService.enabled: false`. With `secretStoreService.config.auth.method: jwt` (and `auth.jwt.role`), `secret-store-service-keys` is not needed.
:::

## Step 5: Create the image pull secret

Create the pull Secret yourself, or let the chart create it: the chart creates it only when `global.imagePullSecret.name` and all of `global.imageCredentials.registry`, `username`, `password` and `email` are set. `global.imagePullSecret.enabled: true` adds the reference to every pod in both cases. Run the command below only if you do not set the credentials in your values; otherwise skip it, because Helm cannot create a Secret that already exists outside the release.

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

# Authorization API of Homepage & RBAC (the services chart's api-gateway, routed to
# rbacManagement), used by aiFoundryBff, aiFoundryBe, accessControl and aiFoundryProvisioner
authzUrl: "https://home.your-domain.com"
authzClientId: "authz-api"

# authtool-bff base URL: the token exchange towards Catalog, Authz and AI Services
# happens only when it is set. AI Services accepts only tokens exchanged for the
# ai-services-api audience.
authtoolBffUrl: "http://authtool-bff"
aiServicesClientId: "ai-services-api"

# Keycloak realm issuer URL
authorizationServer:
  issuer: "https://keycloak.your-domain.com/realms/my-realm"

# Traefik IngressRoute
ingressRoute:
  enabled: true
  entryPoints:
    - websecure

# ADK Backend App: LiteLLM AI gateway of AI Services
adkBeApp:
  config:
    litellmProxyApiBase: "https://<ai-services host>/litellm/"

# ai-foundry-be: admin API of the same LiteLLM gateway, needed for the model
# providers, the model catalogue and the spend screens (uses litellmAdminKey)
aiFoundryBe:
  config:
    litellmBaseUrl: "https://<ai-services host>/litellm/"

# Agentic Workflows: Temporal of AI Services (or set aiFoundryWorkflows.enabled: false)
aiFoundryWorkflows:
  config:
    temporalAddress: "temporal-frontend.<ai-services namespace>.svc.cluster.local:7233"
    temporalNamespace: "<Temporal namespace from the AI Services values>"

# Credential store in front of your OpenBao
secretStoreService:
  config:
    storeAddr: "https://openbao.your-domain.com"

# Migration hook Job: with catalogUrl set it needs the ai-foundry-provisioner
# Keycloak client (see the Helm Values reference); disable it to skip the migration
aiFoundryProvisioner:
  enabled: false

# Docling route of AI Services (optional: empty leaves /api/docling/ unrouted)
apiGateway:
  docling:
    url: "https://<ai-services host>/api/docling/"

# Secrets created in Steps 1 to 4 are referenced by name; to let the chart create
# them, set secrets.<name>.enabled: true and provide the values inline.

# authtool-bff OIDC clients: website (browser login) + three token-exchange clients
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
      exchangeAiServices:
        clientId: "ai-foundry-token-exchange"
        clientAlias: "ai-services-api"
        tokenAuthMethod: "private_key_jwt"

# Image pull secret: created by the chart only when name and all the imageCredentials are set
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

The links to the other Mia Platform products shown in the website menu (Homepage, Catalog, Console, Flow) are not set in the chart values: the website reads them from the product configuration of the organization, served by the authorization API of Homepage & RBAC (`authzUrl`).

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
    # username/password are typically injected at deploy time via --set;
    # the chart creates the pull Secret only when all of them are set

aiFoundry:
  url: "https://ai-foundry.your-domain.com"
  environment: "production"

  catalogUrl: "https://catalog.your-domain.com"
  catalogClientId: "catalog-api"

  authzUrl: "https://home.your-domain.com"
  authzClientId: "authz-api"

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
    aiFoundryBeKeys:
      enabled: true
    aiFoundryWorkflowsKeys:
      enabled: true
    secretStoreServiceKeys:
      enabled: true
    workspaceServiceKeys:
      enabled: true
    # credential values are typically injected at deploy time

  authtoolBffUrl: "http://authtool-bff"
  aiServicesClientId: "ai-services-api"

  adkBeApp:
    config:
      litellmProxyApiBase: "https://<ai-services host>/litellm/"

  aiFoundryBe:
    config:
      litellmBaseUrl: "https://<ai-services host>/litellm/"

  aiFoundryWorkflows:
    config:
      temporalAddress: "temporal-frontend.<ai-services namespace>.svc.cluster.local:7233"
      temporalNamespace: "<Temporal namespace from the AI Services values>"

  secretStoreService:
    config:
      storeAddr: "https://openbao.your-domain.com"

  aiFoundryProvisioner:
    enabled: false

  apiGateway:
    docling:
      url: "https://<ai-services host>/api/docling/"

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
        exchangeAiServices:
          clientId: "ai-foundry-token-exchange"
          clientAlias: "ai-services-api"
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
