---
id: kubernetes
title: Kubernetes Connector
sidebar_label: Kubernetes
---

# Kubernetes Connector

The Kubernetes connector ingests the cluster, its namespaces, workloads, pods, services, network policies, Helm releases, Traefik ingress routes and cert-manager certificates from the API server of a [Kubernetes](https://kubernetes.io/) cluster into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: lists every resource of the selected types and exits. Use it for an initial load, for scheduled runs, or to try the mappings with `--local-output`.
- **Run** — push-based: watches the cluster. It first sends everything that already exists, like a sync, and then every creation, change and deletion as it happens.

The connector only ever **reads** from the cluster: it uses `list`, `get` and `watch` calls and never creates, updates or deletes any Kubernetes object. One `ibdm` instance monitors one cluster: to monitor several clusters, run one instance per cluster, each with its own connection settings.

## Commands

```sh
ibdm sync k8s --include-internal-mappings=all
ibdm run  k8s --include-internal-mappings=all
```

The commands use every internal mapping of the source. To select only some of them, or to add mappings of your own, see [Mappings](/requirements/installation-guidelines/catalog/connectors/00_overview.md#mappings).

## Configuration

The connector supports two **mutually exclusive** ways of connecting to the cluster, and exactly one must be configured: setting variables of both is a configuration error.

- **Token mode (recommended)** — `ibdm` connects to the API server with a ServiceAccount bearer token. Set `K8S_API_SERVER` and `K8S_BEARER_TOKEN`, and preferably `K8S_CA_CERT`, so that the certificate of the API server is verified.
- **Kubeconfig mode** — `ibdm` loads the connection from a kubeconfig file. Set `K8S_KUBECONFIG_PATH`, and optionally `K8S_KUBECONFIG_CONTEXT`. It uses the credentials of whoever created the kubeconfig, so it is better suited to trying the connector than to production. `exec` authentication plugins configured in the kubeconfig are run by `ibdm`: their binary must be available where `ibdm` runs, and they must work without asking for input. The legacy `auth-provider` entries, such as `oidc`, are not supported and must be replaced by an `exec` plugin.

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `K8S_API_SERVER` | Token mode | _(empty)_ | URL of the API server, for example `https://203.0.113.10`. Must be an `http` or `https` URL. It is also part of every item identifier, see [Cluster identity and the Console link](#cluster-identity-and-the-console-link). |
| `K8S_BEARER_TOKEN` | Token mode | _(empty)_ | ServiceAccount token used to authenticate. |
| `K8S_CA_CERT` | No | _(empty)_ | Base64 encoded PEM bundle of the certificate authority of the API server. |
| `K8S_INSECURE_SKIP_VERIFY` | No | `false` | Skips the verification of the API server certificate. For local tests only. Cannot be combined with `K8S_CA_CERT`. |
| `K8S_CLUSTER_NAME` | No | host of the API server | Name given to the cluster item. |
| `K8S_KUBECONFIG_PATH` | Kubeconfig mode | _(empty)_ | Path of the kubeconfig file. |
| `K8S_KUBECONFIG_CONTEXT` | No | current context | Context of the kubeconfig to use. Requires `K8S_KUBECONFIG_PATH`. |

Every request to the API server has a timeout of 30 seconds, and lists are read in pages of 500 objects.

## Preparing the cluster

`ibdm` needs a ServiceAccount with read-only access to the resources you want to synchronize, and a token for it.

### Read-only access

Apply the following manifest on the cluster to create the ServiceAccount and a read-only ClusterRole:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ibdm-k8s-reader
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ibdm-k8s-reader
rules:
  - apiGroups: [""]
    resources: ["namespaces", "nodes", "services", "pods"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "statefulsets", "daemonsets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["networking.k8s.io"]
    resources: ["networkpolicies"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["traefik.io"]
    resources: ["ingressroutes"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["cert-manager.io"]
    resources: ["certificates"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: ibdm-k8s-reader
subjects:
  - kind: ServiceAccount
    name: ibdm-k8s-reader
    namespace: default
roleRef:
  kind: ClusterRole
  name: ibdm-k8s-reader
  apiGroup: rbac.authorization.k8s.io
```

Grant only what you need: each rule is only used by the data types that read its resources, so you can drop the rules of the types you do not synchronize. The `watch` verb is only needed by `ibdm run`. A resource whose definition is not installed on the cluster, such as Traefik ingress routes or cert-manager certificates, is skipped without error.

:::warning
The `secrets` rule is needed only by the `helmrelease` type, which reads the Secrets where Helm stores its releases. Kubernetes cannot restrict a role to Secrets with a given label, so this rule gives the ServiceAccount read access to **every Secret in the cluster**, even though `ibdm` only requests the ones labelled `owner=helm`. If this is not acceptable for the cluster, remove the rule and do not select the `helmreleases` mapping.
:::

### Creating a long-lived token

For anything that runs continuously, use a token that does not expire. Create a Secret of type `kubernetes.io/service-account-token` for the ServiceAccount:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ibdm-k8s-reader-token
  namespace: default
  annotations:
    kubernetes.io/service-account.name: ibdm-k8s-reader
type: kubernetes.io/service-account-token
```

Kubernetes fills the Secret with the token and the certificate authority of the cluster. Read them, and the API server address, with:

```sh
# K8S_BEARER_TOKEN
kubectl -n default get secret ibdm-k8s-reader-token -o jsonpath='{.data.token}' | base64 -d

# K8S_CA_CERT (already base64 encoded)
kubectl -n default get secret ibdm-k8s-reader-token -o jsonpath='{.data.ca\.crt}'

# K8S_API_SERVER
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
```

Store the token in a secret manager, or in a Kubernetes Secret of the cluster where `ibdm` runs, and inject it as an environment variable. The token is read once, when `ibdm` starts:

- **Rotating the token** — create a second Secret, update `K8S_BEARER_TOKEN` and restart `ibdm`, then delete the old Secret.
- **Revoking the token** — delete the Secret. The token stops working immediately.

:::note
Short-lived tokens (`kubectl create token ibdm-k8s-reader --duration=1h`) are fine for a one-off `ibdm sync` or for trying the connector, but `ibdm run` does not reload its token: it starts failing with authentication errors when the token expires.
:::

## Supported data types

| Type | Item kind | Sync | Run |
| :--- | :-------- | :--- | :-- |
| `cluster` | `K8sCluster` | ✅ | ✅ |
| `namespace` | `K8sNamespace` | ✅ | ✅ |
| `deployment` | `K8sDeployment` | ✅ | ✅ |
| `statefulset` | `K8sStatefulSet` | ✅ | ✅ |
| `daemonset` | `K8sDaemonSet` | ✅ | ✅ |
| `service` | `K8sService` | ✅ | ✅ |
| `networkpolicy` | `K8sNetworkPolicy` | ✅ | ✅ |
| `helmrelease` | `K8sHelmRelease` | ✅ | ✅ |
| `ingressroute` | `TraefikIngressRoute` | ✅ | ✅ |
| `certificate` | `K8sCertificate` | ✅ | ✅ |
| `pod` | `K8sPod` | ✅ | ✅ |

The `cluster` item carries the nodes of the cluster, with their versions, architecture, CPU capacity and taints: nodes have no item of their own. Workloads carry their replicas and containers, with images and resource requests and limits; pods carry their owner, node, phase, running images, resources, security contexts and volume types. Environment variables, Secret contents and volume contents are never read into any item, and Helm release values are never read.

Pods that completed (phase `Succeeded`) are not synchronized, and fields that change all the time, such as the readiness, the restart count and the container state, are not part of the items.

### Relationships

Every namespaced item is linked to its namespace with a `part-of` relationship, and every namespace to the cluster. The other relationships have their own data types:

| Type | Relationship |
| :--- | :----------- |
| `ingressRouteServiceRelationship` | `TraefikIngressRoute` `dependency` `K8sService`. Only Kubernetes `Service` targets are linked: a route pointing at a Traefik internal service, such as `api@internal`, gets no link. |
| `workloadHelmReleaseRelationship` | Workload (`K8sDeployment`, `K8sStatefulSet` or `K8sDaemonSet`) `part-of` `K8sHelmRelease`, from the `meta.helm.sh/release-name` and `meta.helm.sh/release-namespace` annotations that Helm adds to the objects it creates. |
| `serviceWorkloadRelationship` | `K8sService` `dependency` workload, when the selector of the service matches the pod template labels of a workload in the same namespace. |
| `podOwnerRelationship` | `K8sPod` `part-of` the `K8sDeployment`, `K8sStatefulSet` or `K8sDaemonSet` that owns it. Pods owned by anything else, such as a Job, are not linked. |

## Internal mappings

`ibdm mappings list k8s` prints the internal mappings of this source, and the [Internal Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/reference/20_internal-mappings.md#k8s) reference lists the Item Type each one writes. Every Item Type has to be registered in the Catalog before `ibdm` sends items of that type.

| Internal mapping | Sync | Run | Its relationships point at |
| :--------------- | :--- | :-- | :------------------------- |
| `clusters` | ✅ | ✅ | the Console cluster item, see [Cluster identity and the Console link](#cluster-identity-and-the-console-link) |
| `namespaces` | ✅ | ✅ | `clusters` |
| `deployments`, `statefulsets`, `daemonsets`, `services`, `networkpolicies`, `helmreleases`, `ingressroutes`, `certificates`, `pods` | ✅ | ✅ | `namespaces` |
| `ingressroute-service-relationships` | ✅ | ✅ | `ingressroutes`, `services` |
| `workload-helmrelease-relationships` | ✅ | ✅ | `deployments`, `statefulsets`, `daemonsets`, `helmreleases` |
| `service-workload-relationships` | ✅ | ✅ | `services`, `deployments`, `statefulsets`, `daemonsets` |
| `pod-owner-relationships` | ✅ | ✅ | `pods`, `deployments`, `statefulsets`, `daemonsets` |

A type is only read from the cluster when a mapping for it is selected. Every mapping reads the objects it needs on its own, so any selection works: a relationship mapping selected alone still lists the objects it is derived from, without writing them.

A relationship points at an item only through its identifier, so it points at nothing when the mapping of the item at the other end is not selected: for example, `pods` without `namespaces` creates relationships towards namespace items that do not exist. The Catalog accepts such relationships without error. The four `…-relationships` mappings write the generic `mia-platform.eu/v1` `relationships` Item Type, so selecting several of them needs no `--allow-shared-item-types`.

## Cluster identity and the Console link

The items of a cluster get their identifiers from the address configured in `K8S_API_SERVER`, without the `https://` prefix. The cluster item also creates a `dependency` relationship from the cluster item of the [Mia-Platform Console connector](/requirements/installation-guidelines/catalog/connectors/mia-platform-console.md) to the Kubernetes one, computing the identifier of the Console item from the same address.

For that relationship to point to a real item, `K8S_API_SERVER` must be **exactly** the connection URL registered for the cluster in the Console, without `https://`. A different spelling, such as a host name instead of an IP address, or an address with a port (`…:443`) when the Console has none, produces a different identifier: the synchronization still works, but the link points to nothing.

The same address is part of every identifier, so changing it creates new items instead of updating the existing ones.

## Sync and run behaviour

A **sync** lists every selected type in pages. A failure while reading one type is logged and does not stop the other types, and the failures are reported when the sync ends. A sync only creates and updates items: it never removes the items of objects that no longer exist. Use `ibdm run` to keep the Catalog aligned with deletions.

**Run** keeps one watch open for every selected type, and first sends the full set of existing objects. After that:

- creating or changing an object sends an update, and deleting it sends a deletion of the item and of its relationships;
- a change that does not alter any field of the item, for example a status change of a deployment, sends nothing;
- the cluster item is sent at the start and again whenever the data of its nodes changes, and is never deleted;
- a Helm upgrade or rollback updates the release item; a release is deleted only when it has no deployed revision left and Helm is not writing a new one, as happens when it is uninstalled;
- a pod that completes (phase `Succeeded`) is removed from the Catalog together with its relationships;
- relationships that depend on both ends, such as the one between a service and its workloads, are recomputed when either side changes;
- connections that drop are re-established automatically, and a watch that cannot start is logged while the other types keep working.

There is no periodic full resync: the watches are the only source of changes.

## Limitations

- Helm releases are read from Secrets, the Helm 3 default. Releases stored in ConfigMaps and Helm 2 releases are not found.
- Only the `traefik.io` API group is supported for ingress routes, not the legacy `traefik.containo.us` group.
- Services are linked to workloads through the pod template labels, not through the running pods, and a service without a selector gets no link.
- Init containers carry only their name and image, without resources.

## Troubleshooting

| Symptom | Likely cause |
| :------ | :----------- |
| `the server has asked for the client to provide credentials` | The token is wrong, expired, or belongs to another cluster. |
| `forbidden` errors for some types | The ServiceAccount lacks the rule for that resource: add it to the ClusterRole. |
| `informer did not sync in time` | The cluster cannot be reached or is slow. `ibdm` keeps retrying, so check the network between `ibdm` and the API server. |
| Nothing is sent for a type | No mapping for that type is selected (check the mappings logged at start), or its custom resource is not installed. |
| The Console link points to nothing | `K8S_API_SERVER` differs from the URL registered in the Console, see [Cluster identity and the Console link](#cluster-identity-and-the-console-link). |
| TLS errors | Set `K8S_CA_CERT`, or use `K8S_INSECURE_SKIP_VERIFY=true` for tests only. |
| The cluster uses OIDC and token mode fails | The address may be an authentication proxy that rejects ServiceAccount tokens. Use the address of the API server itself, or kubeconfig mode with an `exec` plugin. |

The full reference is the [Kubernetes source documentation](https://github.com/mia-platform/ibdm/blob/main/docs/how-to/130_k8s-source.md) of `ibdm`.

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
- [Mia-Platform Console Connector](/requirements/installation-guidelines/catalog/connectors/mia-platform-console.md) — publishes the cluster items the Kubernetes clusters are linked to.
