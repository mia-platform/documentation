---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the AI Services chart

This guide walks through installing the `ai-services` chart with its default components: the Envoy API gateway with Access Control, LiteLLM Proxy, Docling and Temporal (with its Web UI), plus the optional Memory service.

## Required tools

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/helm/helm_install/) v3
- [Traefik](https://doc.traefik.io/traefik/), if you let the chart create its `IngressRoute` (`ingressRoute.enabled: true`).
- A running **Keycloak** instance with a configured realm. See the [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md). The realm needs the AI Services clients and client scope described in [Step 1](#step-1-prepare-the-keycloak-realm).
- The platform **authorization service** that `accessControl` resolves the caller's external context against, typically exposed by the [Homepage & RBAC](/requirements/installation-guidelines/shared-services/services/15_getting-started.md) (`services`) chart's API gateway.
- An external **PostgreSQL** server. The chart does not deploy any database: LiteLLM Proxy, Temporal and Memory each need their own (see [Step 2](#step-2-prepare-the-postgresql-databases)).

## Required information

| Information | Example |
|---|---|
| Public AI Services URL | `https://ai-services.your-domain.com` |
| Keycloak realm issuer URL | `https://keycloak.your-domain.com/realms/my-realm` |
| JWT audience accepted by the API gateway | `ai-services-api` |
| Authorization service URL, gRPC (`rbacAuthzServiceUrl`) or HTTP (`authzUrl`) | `http://api-gateway.<services-namespace>.svc.cluster.local:50051` |
| OIDC client ID for `accessControl` | `ai-services-access-control` |
| PostgreSQL connection string for LiteLLM Proxy | `postgresql://user:pass@host:5432/litellm` |
| PostgreSQL host, port, user and password for Temporal | `postgres.your-domain.com`, `5432` |
| PostgreSQL connection string for Memory (optional) | `postgresql+asyncpg://user:pass@host:5432/ai_memory` |
| OIDC client ID for the Temporal Web UI login (optional) | `ai-services-temporal-ui` |
| Private container registry credentials | Nexus username and password |

## Step 1: Prepare the Keycloak realm

The chart cannot create realm objects. Before installing, make sure the realm contains:

1. The **`ai-services-access-control`** client, used by `accessControl` to authenticate to the authorization service. It is a service-account client using `private_key_jwt` ("Signed JWT") with the JWKS URL `<AI Services URL>/.well-known/jwks.json`, and its service account carries the `external-context:subscriber` and `external-context:viewer` roles. The URL configured for AI Services in the realm must be equal to the chart's `url`: if they differ, Keycloak gets a 404 when fetching the JWKS and `accessControl` never obtains a token.
2. The **`ai-services-api`** client, used only as an audience target, and the **`mia:ai-services`** client scope with an audience mapper for it. Every token minted with that scope carries the `ai-services-api` audience, which the API gateway requires (`apiGateway.authorizationServer.audiences`).
3. *(Optional, for the Temporal Web UI login.)* A **confidential** client, for example `ai-services-temporal-ui`, with the authorization-code flow enabled and `<AI Services URL>/temporal/auth/sso/callback` registered as a valid redirect URI. The redirect URI is matched verbatim.

The [Realm Management](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md) chart (version `0.1.47` or later) creates these clients, `ai-services-access-control`, `ai-services-api`, `ai-services-temporal-ui` and `ai-services-mcp-gateway`, and the `mia:ai-services` scope when `products.aiServices` is `true` and `urls.aiServices` is set to the AI Services URL. The `ai-services-temporal-ui` client reads its secret from the `<realmId>_ai-services-temporal-ui-client-secret` entry of the Keycloak vault, which you must add before the realm import.

To use the Memory MCP endpoint (`/memory/mcp`) from Claude Code or Visual Studio Code, the realm must also carry those MCP clients with `mia:ai-services` among the scopes they may request.

## Step 2: Prepare the PostgreSQL databases

| Component | Database | Notes |
|---|---|---|
| LiteLLM Proxy | One database (for example `litellm`) | Stores virtual keys, spend and registered models. |
| Temporal | Two databases on the same server: `temporal` and `temporal_visibility` (names set by `temporal.persistence.databaseName` and `temporal.persistence.visibilityDatabaseName`) | The `temporal-schema-setup` Job creates them and applies Temporal's schema migrations before every install and upgrade. If the Temporal user cannot create databases, create them beforehand and set `temporal.persistence.sql.createDatabase: false`. |
| Memory (optional) | A database of its own | The `vector` extension must be available: the service creates it at startup and refuses to run without it. The connection string must name the `postgresql+asyncpg://` driver. |

## Step 3: Create the access-control secret

`accessControl` authenticates to the authorization service with the private key of the `ai-services-access-control` client. Create a PEM-encoded private key and store it under the `key.pem` key:

```bash
openssl genrsa -out access-control.key 4096

kubectl create secret generic access-control-keys \
  --namespace ai-services \
  --from-file=key.pem=access-control.key
```

Use the `client-secret` key instead of `key.pem` when `accessControl.config.externalContext.authorization.tokenAuthMethod` is `client_secret_post` or `client_secret_basic`.

:::info
Alternatively, set `secrets.accessControlKeys.enabled: true` and provide `secrets.accessControlKeys.privateKey` (or `.clientSecret`) inline; the chart will create the Secret automatically.
:::

## Step 4: Create the LiteLLM Proxy secret

LiteLLM Proxy needs its database connection string, a master key and a salt key:

```bash
kubectl create secret generic litellm-proxy-keys \
  --namespace ai-services \
  --from-literal=postgresConnectionString="<LITELLM_POSTGRES_CONNECTION_STRING>" \
  --from-literal=masterKey="sk-$(openssl rand -hex 32)" \
  --from-literal=saltKey="$(openssl rand -hex 32)"
```

- `masterKey` is the admin key that mints every other virtual key. The LiteLLM admin API is reachable by anyone who can reach the AI Services URL, so this key is the only protection of that API.
- `saltKey` encrypts the provider credentials stored by LiteLLM. Never rotate it once models are registered: the stored credentials would become unreadable.

:::info
Alternatively, set `secrets.litellmProxyKeys.enabled: true` and provide `postgresConnectionString`, `masterKey` and `saltKey` inline. Provider credentials listed in `secrets.litellmProxyKeys.providerCredentials` are added to the Secret and injected as environment variables of the LiteLLM pod only when the chart creates the Secret.
:::

## Step 5: Create the Temporal secret

```bash
kubectl create secret generic temporal-keys \
  --namespace ai-services \
  --from-literal=postgresHost="<POSTGRES_HOST>" \
  --from-literal=postgresPort="5432" \
  --from-literal=postgresUser="<POSTGRES_USER>" \
  --from-literal=postgresPassword="<POSTGRES_PASSWORD>"
```

:::info
Alternatively, set `secrets.temporalKeys.enabled: true` and provide `postgresHost`, `postgresPort`, `postgresUser` and `postgresPassword` inline.
:::

## Step 6: Create the Memory secret (optional)

Skip this step if you leave `memoryService.enabled: false` (default).

```bash
kubectl create secret generic memory-service-keys \
  --namespace ai-services \
  --from-literal=postgresConnectionString="<MEMORY_POSTGRES_CONNECTION_STRING>"
```

Add a `litellmApiKey` key (a LiteLLM virtual key) only when `memoryService.config.aiGateway.enabled: true` routes embeddings through LiteLLM Proxy.

:::info
Alternatively, set `secrets.memoryServiceKeys.enabled: true` and provide `postgresConnectionString` (and `litellmApiKey`) inline.
:::

## Step 7: Create the Temporal UI secret (optional)

Skip this step if you leave `temporalUi.auth.enabled: false` (default). In that case the `/temporal/` route is open to anyone who can reach the AI Services URL.

```bash
kubectl create secret generic temporal-ui-keys \
  --namespace ai-services \
  --from-literal=authClientSecret="<TEMPORAL_UI_CLIENT_SECRET>"
```

`authClientSecret` is the client secret of the confidential client created in [Step 1](#step-1-prepare-the-keycloak-realm).

:::info
Alternatively, set `secrets.temporalUiKeys.enabled: true` and provide `secrets.temporalUiKeys.authClientSecret` inline.
:::

## Step 8: Create the image pull secret

```bash
kubectl create secret docker-registry nexus-pull-secret \
  --namespace ai-services \
  --docker-server=nexus.mia-platform.eu \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD>
```

:::info
Alternatively, the chart creates the image pull secret when `global.imagePullSecret.name` and all of `global.imageCredentials.registry`, `.username`, `.password` and `.email` are set. `global.imagePullSecret.enabled: true` is what makes the pods reference it.
:::

## Step 9: Prepare a values file

Create a `values.yaml` with the minimum required configuration:

```yaml
# values.yaml

# Public URL of AI Services (Envoy virtual host, IngressRoute host, LiteLLM base URL)
url: "https://ai-services.your-domain.com"

# Keycloak realm issuer URL: enables jwt_authn on the API gateway
authorizationServer:
  enabled: true
  issuer: "https://keycloak.your-domain.com/realms/my-realm"

# Audience required on the gated routes
apiGateway:
  authorizationServer:
    audiences:
      - ai-services-api

# Authorization service used by accessControl (gRPC preferred over HTTP)
rbacAuthzServiceUrl: "http://api-gateway.<services-namespace>.svc.cluster.local:50051"
# authzUrl: "http://api-gateway.<services-namespace>.svc.cluster.local:8080"

accessControl:
  enabled: true

# Traefik IngressRoute
ingressRoute:
  enabled: true
  entryPoints:
    - websecure

# Optional: Memory service (requires the memory-service-keys Secret)
# memoryService:
#   enabled: true

# Optional: Temporal Web UI login (requires the temporal-ui-keys Secret)
# temporalUi:
#   auth:
#     enabled: true
#     clientId: "ai-services-temporal-ui"

# Image pull secret
global:
  imagePullSecret:
    enabled: true
    name: nexus-pull-secret
```

:::caution
The chart refuses to render when `doclingService`, `memoryService` or `secretStoreService` is enabled without both `authorizationServer.enabled` and `accessControl.enabled`, or with an empty `apiGateway.authorizationServer.audiences`. `doclingService` is enabled by default. To install without the authentication chain, disable these components explicitly.
:::

:::tip
Set `temporal.numHistoryShards` (default `512`) before the first install. It is fixed when the Temporal schema is created and cannot be changed afterwards without a new Temporal cluster.
:::

If you set `namespacePrefix`, the chart prepends it (as `<namespacePrefix>-<name>`) to the names of its component resources, including the Secrets of the previous steps (for example `<namespacePrefix>-litellm-proxy-keys`), the image pull secret and `ingressRoute.tls.secretName`: when you create these Secrets yourself, use the prefixed names.

See the [Helm Values reference](/requirements/installation-guidelines/shared-services/ai-services/helm-values/00_overview.md) for the full list of available options.

## Step 10: Add the Helm repository and install

```bash
helm repo add mia-platform \
  https://nexus.mia-platform.eu/repository/helm-internal/ \
  --username <YOUR_USERNAME> \
  --password <YOUR_PASSWORD>

helm repo update

helm install ai-services mia-platform/ai-services \
  --version <CHART_VERSION> \
  --namespace ai-services \
  --create-namespace \
  --values values.yaml \
  --atomic \
  --timeout 10m
```

Set `--version` to the `ai-services` chart version listed in the Mia-Platform release notes.

## Step 11: Verify

```bash
kubectl get pods -n ai-services
```

All pods should reach `Running` state. To check that LiteLLM Proxy loaded the curated model cost map, query its own endpoint: `remote` with a null `fallback_reason` is the only healthy result.

```sh
kubectl exec -n ai-services deploy/litellm-proxy -c litellm-proxy -- \
  sh -c 'curl -s localhost:4000/model/cost_map/source -H "Authorization: Bearer ${LITELLM_MASTER_KEY}"'
```

## Step 12: Register models on the AI gateway

A fresh LiteLLM database contains no models, so the gateway answers `400` until a model is registered. Two options are available:

- **At runtime**: `litellmProxy.config.general_settings.store_model_in_db` is `true` by default, so models and their provider credentials can be registered through LiteLLM's UI or its `/model/new` API, authenticated with the master key. They are stored in LiteLLM's database, encrypted with the salt key.
- **Declaratively**: add the provider credential to `secrets.litellmProxyKeys.providerCredentials.<ENV_VAR_NAME>` and the model to `litellmProxy.config.model_list`, referencing the credential as `os.environ/<ENV_VAR_NAME>`. Models declared this way are read from the configuration at every start.

```yaml
litellmProxy:
  config:
    model_list:
      - model_name: gemini-2.5-flash
        litellm_params:
          model: vertex_ai/gemini-2.5-flash
          vertex_project: os.environ/VERTEXAI_PROJECT
          vertex_location: os.environ/VERTEXAI_LOCATION
          vertex_credentials: os.environ/VERTEXAI_CREDENTIALS
```

The LiteLLM pod cannot mount extra files, so pass a Vertex AI service-account key as the JSON content itself (on one line) in `providerCredentials`, not as a file path.

:::info
If AI Foundry is deployed, register `gemini-2.5-flash`: the internal agents of AI Foundry's `adk-be-app` use that model id through this gateway, and their calls fail with `400` without it.
:::

## Using the ai-services-deployment wrapper

If you are using the `ai-services-deployment` wrapper repository for multi-environment GitOps, the chart is declared as a dependency with the `aiServices` alias, so all chart values must be nested under the `aiServices:` key, **except** `global.*`, which Helm automatically shares with subcharts and must stay at the top level:

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

# Optional: the wrapper creates a cert-manager Certificate (Secret "default-cert") for this host
dns: "ai-services.your-domain.com"

aiServices:
  url: "https://ai-services.your-domain.com"

  authorizationServer:
    enabled: true
    issuer: "https://keycloak.your-domain.com/realms/my-realm"
  apiGateway:
    authorizationServer:
      audiences:
        - ai-services-api
  rbacAuthzServiceUrl: "http://api-gateway.<services-namespace>.svc.cluster.local:50051"

  ingressRoute:
    enabled: true
    tlsEnabled: true
    tls:
      secretName: default-cert

  # The secret values (privateKey, postgresConnectionString, masterKey, saltKey,
  # postgresHost, postgresUser, postgresPassword, ...) are kept in a separate,
  # encrypted values file per environment and passed at deploy time.
  secrets:
    accessControlKeys:
      enabled: true
    litellmProxyKeys:
      enabled: true
    temporalKeys:
      enabled: true

  accessControl:
    enabled: true
```

Deploy with:

```bash
helm dependency update

helm install ai-services . \
  --namespace ai-services \
  --create-namespace \
  --values values.yaml \
  --values values/production.yaml \
  --values <encrypted-secrets-values-file> \
  --atomic \
  --timeout 10m
```
