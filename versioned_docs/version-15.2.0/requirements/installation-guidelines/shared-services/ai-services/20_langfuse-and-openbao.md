---
id: langfuse-and-openbao
title: Langfuse and OpenBao
sidebar_label: Langfuse and OpenBao
---

# Langfuse and OpenBao

AI Services and the products built on it rely on two utility services that are **not** part of the `ai-services` chart, nor of any other Mia Platform chart:

| Service | What it is used for | Used by |
|---|---|---|
| **[Langfuse](https://langfuse.com/)** | Trace store for AI observability: model calls, agent runs and their costs. | AI Foundry, which reads traces for its observability screens and its agents' trace tools. Traces reach it over OTLP. |
| **[OpenBao](https://openbao.org/)** | Secret store behind every `secretStoreService`. | AI Services (`gateway-keys`, the tenants' AI gateway keys), AI Foundry and Catalog, each with its own `secretStoreService` instance. |

Mia Platform does not repackage these services: install them with the tools their maintainers provide.

- **On Kubernetes**, use the official Helm charts:
  - Langfuse: [Kubernetes (Helm) deployment guide](https://langfuse.com/self-hosting/deployment/kubernetes-helm), chart repository [langfuse/langfuse-k8s](https://github.com/langfuse/langfuse-k8s).
  - OpenBao: [OpenBao on Kubernetes](https://openbao.org/docs/platform/k8s/) and its [Helm chart](https://openbao.org/docs/platform/k8s/helm/).
- **Any other way** the product supports, for example a virtual machine, Docker Compose, a cloud provider or an instance your organization already runs, by following the product's official guides:
  - Langfuse: [self-hosting overview](https://langfuse.com/self-hosting), which lists every supported deployment option.
  - OpenBao: [installing OpenBao](https://openbao.org/docs/install/). An existing HashiCorp Vault with the KV v2 secrets engine works as well.

Mia Platform components only need to reach these services over the network and to hold a credential for them. The rest of this page describes what each one must provide and how to connect it, whatever the deployment method.

:::info
Sizing, high availability, backup, upgrades and security hardening of Langfuse and OpenBao follow the official documentation of each product and are the responsibility of whoever operates them.
:::

## Langfuse

### What Mia Platform needs from Langfuse

- **A project and its API key pair** (`pk-lf-...` and `sk-lf-...`). Traces are written to that project, and AI Foundry reads them with the same pair.
- **The OTLP traces endpoint**, `<LANGFUSE_URL>/api/public/otel/v1/traces`, reachable from the cluster where telemetry is exported. Langfuse authenticates OTLP requests with HTTP Basic authentication built from the project key pair. See [Langfuse OpenTelemetry integration](https://langfuse.com/integrations/native/opentelemetry).
- **The Langfuse API**, reachable by AI Foundry's `ai-foundry-be` and `adk-be-app`.

Langfuse stores traces only, not metrics.

### Install Langfuse on Kubernetes

Follow the [Kubernetes (Helm) deployment guide](https://langfuse.com/self-hosting/deployment/kubernetes-helm) for prerequisites, sizing and the full list of values. In short:

```bash
helm repo add langfuse https://langfuse.github.io/langfuse-k8s
helm repo update

helm install langfuse langfuse/langfuse \
  --namespace langfuse \
  --create-namespace \
  --values langfuse-values.yaml
```

Things to keep in mind when you prepare `langfuse-values.yaml`:

- By default the chart deploys PostgreSQL, ClickHouse, Redis and an S3-compatible blob store next to Langfuse. To use external or managed instances, set `deploy: false` on each of them (`postgresql`, `clickhouse`, `redis`, `s3`) and provide their connection details, as described in the chart's documentation.
- For the blob store, prefer a bucket of your cloud provider (see [blob storage](https://langfuse.com/self-hosting/deployment/infrastructure/blobstorage)). On GKE, Langfuse can use a Cloud Storage bucket through [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity), with no static key: grant a Google service account `roles/storage.objectAdmin` on the bucket, allow the Kubernetes ServiceAccount of Langfuse to impersonate it (`roles/iam.workloadIdentityUser` for `<PROJECT_ID>.svc.id.goog[langfuse/langfuse]` with the release name `langfuse` in the `langfuse` namespace), then set:

  ```yaml
  langfuse:
    serviceAccount:
      annotations:
        iam.gke.io/gcp-service-account: <GSA_NAME>@<PROJECT_ID>.iam.gserviceaccount.com
  s3:
    deploy: false
    storageProvider: gcs
    bucket: <BUCKET_NAME>
  ```

- Set `langfuse.salt`, `langfuse.encryptionKey` and `langfuse.nextauth.secret` explicitly, inline or through `secretKeyRef`. The chart generates them on the first install when they are empty, but tools that render the chart with `helm template` (GitOps pipelines) generate new values on every sync. Never change `encryptionKey` once data is stored.
- Set `langfuse.nextauth.url` to the URL users open Langfuse at, and expose the web UI with an Ingress (or an equivalent route) on a host of its own: Langfuse does not support being served under a path prefix.
- To avoid creating the project and copying its keys by hand after every fresh install, use [headless initialization](https://langfuse.com/self-hosting/administration/headless-initialization): the `LANGFUSE_INIT_*` environment variables, set through `langfuse.additionalEnv`, create the organization, the project and its key pair on the first start.

With the release name `langfuse` in the `langfuse` namespace, the web service is reachable inside the cluster at `http://langfuse-web.langfuse.svc.cluster.local:3000`.

### Connect Mia Platform to Langfuse

| Where | Value |
|---|---|
| AI Services: `otelCollector.config.langfuse.tracesEndpoint` | `<LANGFUSE_URL>/api/public/otel/v1/traces` |
| AI Services: `secrets.otelCollectorKeys.langfuseOtlpBasic` | `<base64 of pk-lf-...:sk-lf-...>` |
| Any other OTLP exporter or collector that sends AI traces | `<LANGFUSE_URL>/api/public/otel/v1/traces`, with the header `Authorization: Basic <base64 of pk-lf-...:sk-lf-...>` |
| AI Foundry: `aiFoundryBe.config.langfuseBaseUrl` and `adkBeApp.config.langfuseBaseUrl` | The Langfuse base URL |
| AI Foundry: `secrets.aiFoundryBeKeys.langfuseAuthHeader` and `secrets.adkBeAppKeys.langfuseAuthHeader` | `Basic <base64 of pk-lf-...:sk-lf-...>` |

See the [AI Services Helm values](/requirements/installation-guidelines/shared-services/ai-services/helm-values/00_overview.md#otelcollector) and the [AI Foundry Helm values](/requirements/installation-guidelines/ai-foundry/helm-values/00_overview.md) for the details of each key.

## OpenBao

### What Mia Platform needs from OpenBao

Each `secretStoreService` instance needs:

- **The store address** (`secretStoreService.config.storeAddr`), for example `http://openbao.openbao.svc.cluster.local:8200`.
- **A KV v2 secrets engine** mounted at the path named by `secretStoreService.config.storeKvMount` (`secret` by default in AI Services and Catalog: check the Helm values of each product).
- **The OpenBao namespace** that holds that mount, if you use [namespaces](#reference-layout) (`secretStoreService.config.storeNamespace`).
- **A credential**, depending on `secretStoreService.config.auth.method`:
  - `jwt` (recommended on Kubernetes): the pod's own ServiceAccount token, validated by a [JWT auth mount configured with Kubernetes as the OIDC provider](https://openbao.org/docs/auth/jwt/oidc-providers/kubernetes/). No static credential is created, stored or rotated.
  - `approle` (the chart default): an [AppRole](https://openbao.org/docs/auth/approle/) `role-id` and `secret-id`, stored in `secrets.secretStoreServiceKeys.storeRoleId` and `storeSecretId`. Use it when OpenBao cannot validate the tokens of the cluster where `secretStoreService` runs.
- **A policy** attached to that credential that grants only the secrets of that product.

`secretStoreService` stores every secret at `<kv-mount>/data/<organization>/<tenant>/<collection>/<key>`.

### Reference layout

This is how Mia Platform runs OpenBao for its own environments, and the layout we recommend:

- **One OpenBao instance shared by every product**, with one [namespace](https://openbao.org/docs/concepts/namespaces/) per environment and product, for example `console/production/ai-services`, `console/production/ai-foundry` and `console/production/catalog`. Each namespace has its own KV v2 mount at `secret` and its own policies and auth mounts, so a product's credential never reaches another product's secrets.
- **JWT auth for workloads**: in each namespace, one JWT auth mount per Kubernetes cluster that runs the product (for example `jwt-<cluster>`), trusting that cluster's OIDC issuer, and one role per Kubernetes namespace of the product, bound to its ServiceAccounts (`system:serviceaccount:<k8s-namespace>:*`) and to the `openbao` audience, with short-lived tokens.
- **Auto-unseal** with a cloud KMS, so that restarted pods unseal on their own (see [below](#auto-unseal-with-a-cloud-kms)).
- **Configuration as code**: mounts, namespaces, auth methods and policies are managed with the Terraform [Vault provider](https://registry.terraform.io/providers/hashicorp/vault/latest/docs), which is compatible with OpenBao, rather than by hand. The commands in [Configure OpenBao for AI Services](#configure-openbao-for-ai-services) show the equivalent operations.

### Install OpenBao on Kubernetes

Follow [OpenBao on Kubernetes](https://openbao.org/docs/platform/k8s/) and the [Helm chart documentation](https://openbao.org/docs/platform/k8s/helm/). In short:

```bash
helm repo add openbao https://openbao.github.io/openbao-helm
helm repo update

helm install openbao openbao/openbao \
  --namespace openbao \
  --create-namespace \
  --values openbao-values.yaml
```

:::caution
By default the chart runs a single server in standalone mode, which the OpenBao documentation does not consider suitable for production. Choose the run mode, storage backend and seal configuration following [Run OpenBao on Kubernetes](https://openbao.org/docs/platform/k8s/helm/run/) and its production checklist.

After installing, OpenBao must be **initialized** (`bao operator init`) as described in the OpenBao documentation. Keep the keys and the root token it returns outside the cluster. Without auto-unseal, every restarted OpenBao pod comes back sealed and must be unsealed by hand before any `secretStoreService` can read or write secrets.
:::

With the release name `openbao` in the `openbao` namespace, OpenBao is reachable inside the cluster at `http://openbao.openbao.svc.cluster.local:8200`.

#### Auto-unseal with a cloud KMS

OpenBao can unseal itself with a key held by a cloud KMS, configured with a `seal` stanza in the server configuration (`server.standalone.config` or `server.ha.config` in the chart values). With auto-unseal, `bao operator init` returns recovery keys instead of unseal keys.

On GKE, use [Cloud KMS](https://openbao.org/docs/configuration/seal/gcpckms/) with Workload Identity, so that no credential file is needed:

1. Create a key ring and an `ENCRYPT_DECRYPT` key in Cloud KMS.
2. Create a Google service account and grant it, on that key, `cloudkms.cryptoKeyVersions.useToEncrypt`, `cloudkms.cryptoKeyVersions.useToDecrypt` and `cloudkms.cryptoKeys.get`.
3. Allow the Kubernetes ServiceAccount of OpenBao to impersonate it: `roles/iam.workloadIdentityUser` for `<PROJECT_ID>.svc.id.goog[openbao/openbao]`, with the release name `openbao` in the `openbao` namespace.
4. Annotate the ServiceAccount and add the `seal` stanza to the server configuration:

   ```yaml
   server:
     serviceAccount:
       annotations:
         iam.gke.io/gcp-service-account: <GSA_NAME>@<PROJECT_ID>.iam.gserviceaccount.com
   ```

   ```hcl
   seal "gcpckms" {
     project    = "<PROJECT_ID>"
     region     = "<KEY_RING_LOCATION>"
     key_ring   = "<KEY_RING_NAME>"
     crypto_key = "<CRYPTO_KEY_NAME>"
   }
   ```

Other cloud providers have equivalent seals: see the [seal configuration](https://openbao.org/docs/configuration/seal/) of OpenBao.

### Configure OpenBao for AI Services

The following commands prepare OpenBao for the `secretStoreService` of AI Services, which stores only the `gateway-keys` collection. Run them with the `bao` CLI, logged in with a token allowed to manage namespaces, mounts, auth methods and policies. The examples use the `console/production/ai-services` namespace of the [reference layout](#reference-layout) and a Kubernetes namespace `ai-services`: adapt both, and skip the namespace steps if you do not use OpenBao namespaces.

1. Create the namespace, one level at a time, and select it for the following commands:

   ```bash
   bao namespace create console
   BAO_NAMESPACE=console bao namespace create production
   BAO_NAMESPACE=console/production bao namespace create ai-services

   export BAO_NAMESPACE=console/production/ai-services
   ```

2. Enable the KV v2 secrets engine at the mount set in `secretStoreService.config.storeKvMount`:

   ```bash
   bao secrets enable -path=secret kv-v2
   ```

3. Write a policy that grants the `gateway-keys` collection and nothing else:

   ```bash
   bao policy write ai-services-gateway-keys - <<'EOF'
   path "secret/data/+/+/gateway-keys/*"     { capabilities = ["create", "read", "update"] }
   path "secret/metadata/+/+/gateway-keys/*" { capabilities = ["read", "delete"] }
   EOF
   ```

4. Create the credential, with **one** of the two methods.

   **JWT (recommended).** Enable a JWT auth mount that trusts the OIDC issuer of the cluster where AI Services runs, and a role for its Kubernetes namespace:

   ```bash
   bao auth enable -path=jwt-<cluster> jwt

   # On GKE the issuer is https://container.googleapis.com/v1/projects/<PROJECT_ID>/locations/<LOCATION>/clusters/<CLUSTER>.
   # On other clusters, read it with: kubectl get --raw /.well-known/openid-configuration
   bao write auth/jwt-<cluster>/config oidc_discovery_url="<CLUSTER_OIDC_ISSUER>"

   bao write auth/jwt-<cluster>/role/ai-services - <<'EOF'
   {
     "role_type": "jwt",
     "user_claim": "sub",
     "bound_audiences": ["openbao"],
     "bound_claims_type": "glob",
     "bound_claims": { "sub": "system:serviceaccount:ai-services:*" },
     "token_policies": ["ai-services-gateway-keys"],
     "token_ttl": "15m"
   }
   EOF
   ```

   OpenBao must be able to reach the issuer's discovery document. If it cannot, configure the mount with the cluster's public keys instead, as described in [Kubernetes as an OIDC provider](https://openbao.org/docs/auth/jwt/oidc-providers/kubernetes/).

   **AppRole.** Enable AppRole, create a role with the policy, then read its `role-id` and generate a `secret-id`:

   ```bash
   bao auth enable approle

   bao write auth/approle/role/ai-services \
     token_policies="ai-services-gateway-keys" \
     token_ttl=1h \
     token_max_ttl=24h

   bao read -field=role_id auth/approle/role/ai-services/role-id
   bao write -f -field=secret_id auth/approle/role/ai-services/secret-id
   ```

5. Configure AI Services. With JWT:

   ```yaml
   secretStoreService:
     enabled: true
     config:
       storeAddr: "https://openbao.your-domain.com"
       storeKvMount: "secret"
       storeNamespace: "console/production/ai-services"
       auth:
         method: jwt
         jwt:
           mount: "jwt-<cluster>"
           role: "ai-services"
   ```

   With AppRole, leave `auth.method` to `approle` and pass the two values as `storeRoleId` and `storeSecretId` (the `secret-store-service-keys` Secret, or `secrets.secretStoreServiceKeys`). See the [Helm values reference](/requirements/installation-guidelines/shared-services/ai-services/helm-values/00_overview.md#secretstoreservice).

For the `secretStoreService` instances of AI Foundry and Catalog, repeat these steps in a namespace of their own (for example `console/production/ai-foundry`), with the KV mount set in their `storeKvMount`, their Kubernetes namespace in the role and a policy covering the collections they use.

If you deploy OpenBao in another way, the same configuration applies: only the store address changes.
