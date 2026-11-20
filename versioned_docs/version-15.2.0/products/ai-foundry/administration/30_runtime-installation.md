---
id: runtime-installation
title: Runtime installation
sidebar_label: Runtime installation
---

# Runtime installation

**adk-be-app** is the agentic engine underneath the whole Mia-Platform suite: the service that actually runs the [agents](/products/ai-foundry/basic-concepts/20_agent.md) and [playbooks](/products/ai-foundry/basic-concepts/21_playbook.md) you author in AI Foundry. This page explains how to install it on its own, as a container, so that you can use those agents from outside AI Foundry and the applications provided by Mia-Platform.

## What the runtime is for

AI Foundry separates *authoring* from *execution*. You define models, prompts, skills, MCP servers, agents, and playbooks in AI Foundry, where they are stored as Catalog resources. The runtime is the component that executes them: it loads the agents from the Catalog, calls the models, invokes tools and MCP servers, and keeps the state of every conversation in PostgreSQL. It exposes the result through the ADK APIs: `/run` and `/run_sse` to talk to an agent, and the session endpoints to manage conversations.

The Mia-Platform applications that embed agents rely on this same engine. Installing it on its own lets a system or application of your own call those APIs and use the agents and playbooks defined in your Catalog, without re-implementing the execution logic or duplicating their configuration. Because the runtime reads the Catalog with its own [service account](#authenticate-to-the-catalog-with-a-service-account), the callers do not need to carry a Catalog token, and a change made in AI Foundry reaches them without a redeploy.

To install it you need three things: a PostgreSQL database, the URL of your Catalog, and a service account to read it with. Everything else is configured through [environment variables](#environment-variables) and a handful of [Secrets](#secrets).

## Installation at a glance

1. Prepare a [PostgreSQL](#postgresql) database (14+) and a role that can create tables.
2. [Register a service account](/products/mia-platform-suite/rbac_management.md#registering-a-service-account) in Platform Administration, with the RBAC roles to read Catalog items, and keep its private key.
3. Make sure the pod can reach the models: set the [provider credentials](#model-access) your Models need.
4. Create the [Secrets](#secrets): the database connection string, the service-account key, the model credentials, and the registry pull secret.
5. Deploy the [container](#container) with the [required variables](#required) and the [service-account variables](#the-variables).
6. [Verify the installation](#verify-the-installation) and call `/run` from your application.

## What the installation does and does not do

The runtime exposes the ADK APIs (`/run`, `/run_sse`, and sessions), runs the agents defined in AI Foundry, and stores sessions in PostgreSQL. It reads the Catalog with its own service-account identity, so it works even when the caller carries **no** token, much like the user-driven interactions from Home, Catalog, and AI Foundry.

It does not:

| Limit                      | Detail                                                                                                                                                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authenticate anyone**    | The runtime does not validate tokens: it receives them and forwards them to the [MCP servers](/products/ai-foundry/basic-concepts/14_mcp-server.md) configured on the agents. Whoever exposes it must put something that authenticates in front of it, or keep it reachable in-cluster only. |
| **Write to AI Foundry**    | Configurations are created in AI Foundry, from the UI or the API, not from the runtime.                                                                                                                                                      |
| **Ship a UI**              | The AI Foundry console is a separate deployment.                                                                                                                                                                                             |
| **Authorize per user**     | It always reads the Catalog as the service account: what a caller can see does not depend on that caller's permissions.                                                                                                                      |

## Requirements

### PostgreSQL

PostgreSQL is the only mandatory infrastructure dependency.

| Requirement       | Detail                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Version           | **14+**                                                                                                                                                                                                                                          |
| Connection string | `postgresql+asyncpg://user:pwd@host:5432/dbname`: the **asyncpg** driver, not `postgresql://`.                                                                                                                                                   |
| Privileges        | The role must be able to **create tables**: at startup the service creates the ADK session and event tables, `session_metadata`, `artifacts`, and the system tables itself. No external migration and no manual DDL are needed.                    |
| Dedicated schema  | Optional: add `?options=-csearch_path%3Dmy_schema` to the connection string. The schema is created at startup if missing, so `CREATE` on the database is required.                                                                              |
| Growth            | Events, `session_metadata`, and `artifacts` grow with no automatic retention. `artifacts` is where tool responses above about 100,000 characters end up: it is the first table to watch.                                                         |

:::note
The system tables (agents, playbooks, models, skills, and so on) are created in any case, but when Catalog mode is on they **stay empty**: the Catalog is the source of configuration, and the database holds sessions, events, and artifacts.
:::

### A reachable Catalog and a service account

| Requirement                 | Example                                                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catalog URL                 | `https://demo.catalog.cloud.mia-platform.eu`                                                                                                                                  |
| Identity provider and realm | `https://auth.tools.mia-platform.eu` and `mia-platform-demo`                                                                                                                  |
| Service account             | Registered as described in [Registering a service account](/products/mia-platform-suite/rbac_management.md#registering-a-service-account), **with the RBAC roles** needed to read Catalog items: registration creates the identity, not the permissions. |
| The account's private key   | Reachable by the pod, from a [Secret](#secrets).                                                                                                                              |
| Token scope                 | `mia:catalog`. On the **PaaS**, also `organization:*`.                                                                                                                        |
| Organization and tenant     | The pair the runtime reads the Catalog with (`CATALOG_ACL_*`). See [Scoping headers](/products/catalog/usage/catalog-api.md#scoping-headers).                                  |

### Model access

[Models](/products/ai-foundry/basic-concepts/10_model.md) are Catalog items and are instantiated **through LiteLLM**: the model name (`vertex_ai/gemini-…`, `azure/gpt-…`, `litellm_proxy/…`) decides which variables are needed, and it is LiteLLM that reads them, not the application. Credentials therefore live in the pod's environment (see [Secrets](#secrets)), while the non-secret parameters (`api_base`, `api_version`, `vertex_project`, `vertex_location`) can live in the Model's `arguments`, where they are visible and versioned.

The most common combinations are:

```sh
# Vertex AI / Gemini
GOOGLE_APPLICATION_CREDENTIALS=/secrets/google/sa-key.json   # mounted file
GOOGLE_CLOUD_PROJECT=<project>
GOOGLE_CLOUD_LOCATION=<region>
GOOGLE_GENAI_USE_VERTEXAI=true

# AI Gateway / LiteLLM proxy (`litellm_proxy/...` models)
LITELLM_PROXY_API_BASE=<endpoint>
LITELLM_PROXY_API_KEY=<api-key>

# Azure OpenAI (`azure/...` models)
AZURE_API_BASE=<endpoint>
AZURE_API_VERSION=<api-version>
AZURE_API_KEY=<api-key>

# Azure AI Foundry / model catalog (`azure_ai/...` models)
AZURE_AI_API_BASE=<endpoint>
AZURE_AI_API_KEY=<api-key>
```

:::tip
The names change with the model prefix: `azure/` uses `AZURE_API_*`, while `azure_ai/` uses `AZURE_AI_API_*`. When one agent returns an `AuthenticationError` while the others work, it is almost always the Model's prefix not matching the variables that are present.
:::

### Container

| Requirement | Value                                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime     | Kubernetes                                                                                                                                                             |
| Image       | `nexus.mia-platform.eu/ai-foundry/adk-be-app:0.8.2`                                                                                                                    |
| Port        | `8000` (override with `HTTP_PORT`)                                                                                                                                     |
| Probes      | `GET /-/ready` (readiness) and `GET /-/healthz` (liveness). Do not use a TCP probe: the pod would stay `Ready` with no database behind it.                              |
| Resources   | Requests `800Mi` / `300m`, limits `2000Mi` / `1000m`                                                                                                                   |
| Egress      | To the Catalog, the identity provider, the model provider, and every MCP server configured on the agents                                                                |
| Replicas    | At least 2, to survive a node drain. Each replica has its own agent cache (see [What changes about the reads](#what-changes-about-the-reads)).                          |

On `/run_sse` the response is a stream: any proxy in front of the service must have response buffering and response timeouts disabled.

## Authenticate to the Catalog with a service account

:::caution
The flow described here **requires version 0.7.5** or later. Other ways to authenticate Catalog reads exist, such as forwarding or exchanging the caller's token, or using a Keycloak client with a client secret, but they are not covered by this page.
:::

A Mia-Platform service account has no password and no client secret: the platform registers its public key as a JWKS, and whoever holds the private key signs a short-lived JWT, the *client assertion*, to obtain an access token (RFC 7523, `private_key_jwt`). The same mechanism is described step by step in [Requesting an access token](/products/mia-platform-suite/rbac_management.md#requesting-an-access-token). As of 0.7.5 the runtime signs the assertion itself, so no incoming token and no shared secret is needed.

### How it works

```text
adk-be-app                                   Keycloak                Catalog
──────────                                   ────────                ───────
signs the assertion (RS256, kid)
  iss = sub = client_id
  aud = token endpoint, jti, exp = iat+300s
POST /token  ──────────────────────────────▶  200 access_token
  grant_type=client_credentials
  client_assertion_type=…jwt-bearer
  client_assertion=<JWT>
  scope=mia:catalog [organization:*]
reads the agents  ─────────────────────────────────────────────────▶  200
  Authorization: Bearer <access_token>
  x-mia-acl-context: <organization/tenant>
```

The runtime derives three things on its own, so they need no configuration:

| Derived value          | How                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The `kid`**          | Derived from the key as its RFC 7638 thumbprint, the same value the registration procedure computes for the JWKS. `SERVICE_ACCOUNT_KID` is only for a registered JWKS that uses a different `kid`.                 |
| **The token endpoint** | Derived from `KEYCLOAK_URL` and `KEYCLOAK_REALM`. `SERVICE_ACCOUNT_TOKEN_URL` overrides it and spares you that pair.                                                                                             |
| **The token cache**    | The token is refreshed 30 seconds before it expires and shared across concurrent callers. The assertion, by contrast, is signed on every token request, because its `jti` is single-use.                          |

### The variables

Two are sufficient: the `client_id` and the key.

| Variable                          | Value                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `SERVICE_ACCOUNT_CLIENT_ID`       | The `client_id` **returned by registration**, not the `subject` the UIs show for the account.                  |
| `SERVICE_ACCOUNT_PRIVATE_KEY_PATH`| Path to the key mounted from a Secret (**preferred**).                                                         |
| `SERVICE_ACCOUNT_PRIVATE_KEY`     | The PEM itself, with escaped `\n`. When both are set, the file wins.                                           |
| `SERVICE_ACCOUNT_SCOPE`           | Defaults to `mia:catalog`. On the **PaaS**, use `mia:catalog organization:*`.                                  |
| `SERVICE_ACCOUNT_TOKEN_URL`       | Empty means derived from `KEYCLOAK_URL` and `KEYCLOAK_REALM`.                                                  |
| `SERVICE_ACCOUNT_KID`             | Empty means derived from the key.                                                                              |
| `SERVICE_ACCOUNT_ASSERTION_TTL`   | Assertion lifetime in seconds. Defaults to `300`.                                                              |

The minimal configuration, with the key mounted as a file, is:

```sh
SERVICE_ACCOUNT_CLIENT_ID=<client_id from registration>
SERVICE_ACCOUNT_PRIVATE_KEY_PATH=/secrets/service-account/private.key
SERVICE_ACCOUNT_SCOPE=mia:catalog organization:*        # organization:* on the PaaS only
SERVICE_ACCOUNT_TOKEN_URL=https://<auth-host>/realms/<realm>/protocol/openid-connect/token
```

### Troubleshoot authentication

**`organization:*` is missing on the PaaS.** Without that scope the token is issued but the Catalog answers **403**: it looks like a permissions problem and is in fact the scope. To tell the failures apart:

| Outcome                                   | Meaning                                                                                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_client` on the token request     | Wrong `client_id` (it is not the `subject`), a `kid` that is not registered, or a signature that does not verify. The identity provider does not distinguish them.                      |
| `invalid_scope` on the token request      | You are asking for a scope the account was not registered with.                                                                                                                         |
| `401` from the Catalog                    | The token is not valid for the Catalog.                                                                                                                                                 |
| `403` from the Catalog                    | The token is valid, the permissions are not: missing RBAC roles, or `organization:*` missing on the PaaS.                                                                               |

**Asking for more scopes is not safer, it is more brittle.** The token endpoint refuses the whole request (`invalid_scope`) if you name a scope the account was not registered with. Reading the Catalog needs `mia:catalog` only: the rule of requesting all three scopes (`mia:catalog`, `mia:ai-foundry`, and `mia:authz`) applies to whoever **calls** the AI Foundry APIs, as described in [Programmatic access](/products/ai-foundry/overview.md#programmatic-access), and here AI Foundry is this service.

:::caution
Half a configuration is an error, not a fallback. Either the client id or the key is enough to turn the credential on: if the other half is missing, the service says which one by name instead of quietly falling back to a different identity.
:::

### What changes about the reads

With the service account, the runtime holds a credential **outside a request** too, which makes two reads usable that would otherwise fail:

| Read             | Variable                                      | Effect                                                                                                                |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Startup pre-load | `LOAD_PLAYBOOKS_ON_STARTUP` (default `true`)  | Agents are ready before the first request.                                                                            |
| Periodic reload  | `AGENT_RELOAD_INTERVAL` (default `0`, off)    | Set it in seconds, for example `300`, to pick up changes made in AI Foundry without a restart.                        |

Two behaviors are worth knowing:

- On a cache miss for an `app_name`, the runtime reloads **inside the request**, so the first call to an agent it has never seen is slower.
- `POST /api/agent-cache/flush` affects **only the replica that answers**. With several replicas, either accept that each one refreshes on its own, or run `kubectl rollout restart`.

## Environment variables

The service reads, in order of precedence, the **environment variables**, then the `config/config.yaml` shipped in the image, then the defaults in code. The tables below give the defaults **in code**; where the image's `config.yaml` imposes a different one, it is called out.

### Required

| Variable          | Default   | Notes                                                                                                                                                                                         |
| ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | *(empty)* | The asyncpg connection string. The service does not start without it.                                                                                                                         |
| `CATALOG_API_URL` | *(empty)* | The Catalog URL. **This variable is what turns Catalog mode on**: leave it empty and agents and playbooks are read from the PostgreSQL tables instead.                                         |

### Catalog and multi-tenancy

| Variable                    | Default   | Notes                                                        |
| --------------------------- | --------- | ------------------------------------------------------------ |
| `CATALOG_ACL_ORGANIZATION`  | *(empty)* | Organization declared in the `x-mia-acl-context` header.     |
| `CATALOG_ACL_TENANT`        | *(empty)* | Tenant id.                                                   |
| `CATALOG_ACL_TENANT_NAME`   | *(empty)* | Optional, descriptive only.                                  |

When a request carries its own `x-mia-acl-context`, that one wins over these. With `CATALOG_ACL_ORGANIZATION` empty the header is not sent at all: this is fine against a Catalog that does not require it, but not in a multi-tenant environment.

### Service account

These are the seven variables described in [The variables](#the-variables): `SERVICE_ACCOUNT_CLIENT_ID`, `SERVICE_ACCOUNT_PRIVATE_KEY_PATH`, `SERVICE_ACCOUNT_PRIVATE_KEY`, `SERVICE_ACCOUNT_SCOPE` (default `mia:catalog`), `SERVICE_ACCOUNT_TOKEN_URL`, `SERVICE_ACCOUNT_KID`, and `SERVICE_ACCOUNT_ASSERTION_TTL` (default `300`). `KEYCLOAK_URL` and `KEYCLOAK_REALM` are only needed when `SERVICE_ACCOUNT_TOKEN_URL` is not given.

### Agent loading

| Variable                    | Default           | Notes                                                                                   |
| --------------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `LOAD_PLAYBOOKS_ON_STARTUP` | `true`            | Pre-loads the agents from the playbooks at startup.                                     |
| `AGENT_RELOAD_INTERVAL`     | `0`               | Seconds between periodic reloads. `0` disables it.                                      |
| `ROOT_AGENT_NAME`           | `assistant_agent` | PostgreSQL mode only.                                                                   |
| `SEED_SYNC_MODE`            | `empty-only`      | PostgreSQL mode only: `sync` makes the seed files the source of truth.                  |

### Server, CORS, and exposure

| Variable                       | Default                                                      | Notes                                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HTTP_PORT`                    | `8000`                                                       | Listening port.                                                                                                                                                        |
| `LOG_LEVEL`                    | `INFO`                                                       |                                                                                                                                                                        |
| `ALLOWED_ORIGINS`              | `[]` in code, **`["*", …]` in the image's `config.yaml`**    | **CORS is therefore open** until you pass this variable: a JSON list, for example `["https://app.example"]`.                                                           |
| `URL_PREFIX`                   | *(empty)*                                                    | Path prefix behind a reverse proxy, for example `/api/adk`.                                                                                                            |
| `AUTO_CREATE_SESSION`          | `false`                                                      | With `true`, the session is created on the first `/run` instead of answering 404.                                                                                      |
| `SERVE_WEB_INTERFACE`          | `false`                                                      | ADK's development UI: **keep it `false`** in a real deployment.                                                                                                        |
| `LOGO_TEXT`, `LOGO_IMAGE_URL`  | *(empty)*                                                    | Branding for that development UI only.                                                                                                                                 |

### Database and sessions

| Variable               | Default | Notes                                                                                                                                              |
| ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DB_POOL_SIZE`         | `5`     | Persistent connections per replica.                                                                                                                |
| `DB_POOL_MAX_OVERFLOW` | `10`    | Extra connections under load. Size PostgreSQL's `max_connections` for `(pool + overflow) × replicas`.                                              |

### Executable skills

| Variable                     | Default | Notes                                                                       |
| ---------------------------- | ------- | --------------------------------------------------------------------------- |
| `SKILL_SCRIPT_TIMEOUT`       | `60`    | Maximum seconds for the script of a [Skill](/products/ai-foundry/basic-concepts/12_skill.md). |
| `SKILL_SCRIPT_ALLOW_NETWORK` | `false` | `true` gives scripts network access: weigh it carefully.                    |

### The runtime's own models

Two models are used by the service for itself, not to answer users:

| Variable                      | Default            | Notes                                                                                                                                                                                                                                  |
| ----------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `COMPACTION_SUMMARIZER_MODEL` | `gemini-2.5-flash` | Summarizes the conversation as the context grows.                                                                                                                                                                                      |
| `SESSION_NAMER_MODEL`         | *(empty)*          | Titles the sessions. Empty does **not** disable it: the reserved `session_namer` playbook wins if it exists in the Catalog, otherwise a built-in default is used. This variable is the deployment-level override.                       |

Both must be reachable with the credentials described in [Model access](#model-access). Otherwise compaction and titling fail while the agents keep working, a failure you only see in the logs.

### Introspection and observability tools

| Variable                                | Default   | Notes                                                                                                                                  |
| --------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `FOUNDRY_INTROSPECTION_TOOLS`           | `false`   | Attaches tools that read platform entities and observability data: turn it on only if the agents need it.                              |
| `ALLOW_PRIVATE_NETWORK_MCP`             | `false`   | Allows [MCP servers](/products/ai-foundry/basic-concepts/14_mcp-server.md) on private addresses to be contacted.                       |
| `TEMPO_BASE_URL`, `TEMPO_AUTH_HEADER`   | *(empty)* | Trace source for the observability tools. Without them, those tools reply that it is not configured.                                   |

### Telemetry

| Variable                                                                    | Default   | Notes                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` (or `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`)     | *(empty)* | **Its presence turns tracing on**: without it no exporter is created. The exporter is **HTTP/protobuf only**, so give the collector's HTTP endpoint (typically `:4318`), not the gRPC one.                                  |
| `OTEL_EXPORTER_OTLP_HEADERS`                                                | *(empty)* | The collector's authentication headers, for example `Authorization=Basic …`.                                                                                                                                                |
| `OTEL_SERVICE_NAME`                                                         | *(empty)* | Service name in the traces.                                                                                                                                                                                                 |
| `DEPLOYMENT_ENVIRONMENT`                                                    | *(empty)* | Environment declared in the OTLP resource attributes.                                                                                                                                                                       |

The traces produced this way are the ones you explore in [AI Providers](/products/ai-foundry/observability/30_ai_providers.md).

## Secrets

Create the following Secrets. None of these values belongs in a ConfigMap or in a versioned configuration file.

| Secret                       | Key                          | How it reaches the container                                                                                    | Mandatory                                                   |
| ---------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `adk-be-app-db`              | `DATABASE_URL`               | Env `DATABASE_URL` via `secretKeyRef`.                                                                          | **Yes**                                                     |
| `adk-service-account`        | `private.key` (PEM)          | **Mounted as a file** and referenced by `SERVICE_ACCOUNT_PRIVATE_KEY_PATH`, or env `SERVICE_ACCOUNT_PRIVATE_KEY`. | **Yes**, in this mode                                       |
| Model provider credentials   | Provider-dependent           | A mounted file for `GOOGLE_APPLICATION_CREDENTIALS`, env for API keys. See [Model access](#model-access).        | Yes, unless the models need no credential                   |
| OTLP headers                 | `OTEL_EXPORTER_OTLP_HEADERS` | Env via `secretKeyRef`.                                                                                         | Only with a collector that authenticates                    |

In addition, create the registry **pull secret** for `nexus.mia-platform.eu`: a `kubernetes.io/dockerconfigjson` Secret referenced in `imagePullSecrets`.

Create the private key Secret from the file produced by registration:

```sh
kubectl -n <ns> create secret generic adk-service-account \
  --from-file=private.key=./private.key
```

Then make it readable by the pod with this Deployment fragment:

```yaml
    volumeMounts:
      - name: service-account
        mountPath: /secrets/service-account
        readOnly: true
    env:
      - name: SERVICE_ACCOUNT_PRIVATE_KEY_PATH
        value: /secrets/service-account/private.key
      - name: DATABASE_URL
        valueFrom:
          secretKeyRef: { name: adk-be-app-db, key: DATABASE_URL }
  volumes:
    - name: service-account
      secret:
        secretName: adk-service-account
        defaultMode: 0400
```

The file is preferable to the variable: a read-only mounted Secret does not show up in a `printenv`, in crash logs, or in a pod description. If your deployment tooling cannot mount volumes, `SERVICE_ACCOUNT_PRIVATE_KEY` accepts the PEM with escaped newlines (`\n`), which the runtime restores.

:::caution
The private key is never shared and never committed: only the public half goes to the platform, as a JWKS. Rotating it means registering the new key and restarting the pod, because the credential is resolved once, at startup.
:::

:::note
If you deploy the runtime through the `ai-foundry` Helm chart (0.5.0-beta.7), the `adk-be-app-keys` Secret is already provided for and feeds `DATABASE_URL`, the Vertex credentials file, and the OTLP headers. That chart version has neither a field nor a volume for the service-account key: pass it as a variable through `adkBeApp.env[].valueFrom.secretKeyRef`, and the `SERVICE_ACCOUNT_*` variables through `adkBeApp.extraEnv`. See the [chart installation guide](/requirements/installation-guidelines/ai-foundry/15_getting-started.md#step-3-create-the-adk-be-app-secret).
:::

## Verify the installation

1. **Check that the credential was resolved.** Two lines must appear in the startup logs:

   ```text
   Service-account credentials loaded | client_id=… kid=… (derived from the key) token_url=… scope='mia:catalog organization:*'
   Catalog auth: service account (…)
   ```

   `Catalog auth: none configured` means the variables never reached the container. A `ConfigurationException` about the key means a wrong path or a truncated PEM.

2. **Check that the service is ready**, and so is the database:

   ```sh
   kubectl -n <ns> exec deploy/adk-be-app -- \
     python -c "import urllib.request;print(urllib.request.urlopen('http://localhost:8000/-/ready').status)"
   ```

3. **Check that the agents are visible.** No token is needed: the runtime uses its own.

   ```sh
   curl -s http://adk-be-app/list-apps | jq
   curl -s -X POST http://adk-be-app/api/agent-cache/flush | jq
   ```

   If the list is empty, the logs say which of three things was missing: `discovery failed` (credential or network: see [Troubleshoot authentication](#troubleshoot-authentication)), `no agents found via playbooks` (no enabled playbook in that organization or tenant), or an error on a single item.

4. **Start a conversation**, using an `app_name` from `/list-apps`:

   ```sh
   curl -s -X POST http://adk-be-app/run \
     -H 'Content-Type: application/json' \
     -d '{
       "app_name": "<playbook>_<agent>",
       "user_id": "external-system",
       "session_id": "s-001",
       "new_message": {"role": "user", "parts": [{"text": "Test"}]}
     }' | jq '.[] | {author, text: .content.parts[0].text}'
   ```

   An `Agent ... is not available` error is almost always the shape of the `app_name`: compare it with `/list-apps` rather than rebuilding it by hand.

Once a conversation works, you can follow it in [AI Sessions](/products/ai-foundry/observability/20_ai_sessions.md).

## See also

- [Overview](/products/ai-foundry/overview.md#programmatic-access): how the AI Foundry APIs are called machine-to-machine.
- [Registering a service account](/products/mia-platform-suite/rbac_management.md#registering-a-service-account): create the identity the runtime reads the Catalog with.
- [Model](/products/ai-foundry/basic-concepts/10_model.md): how models are configured and served through the AI Gateway.
- [AI security](/products/ai-foundry/administration/10_ai-security.md): LLM credentials, virtual keys, and teams.
