---
id: clusters-overview-setup
title: Clusters Overview & Setup
sidebar_label: Clusters Overview & Setup
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Mia-Platform Console allows authorized users to manage the Kubernetes clusters on which projects are deployed. More specifically, a user can:

* Add a new connection to an existing Kubernetes cluster, also including some cluster information such as vendor, distribution, or geographics;
* Edit the connection to an existing Kubernetes cluster, and eventually the cluster information;
* Delete the connection to an existing Kubernetes cluster.

Detailed information on how to perform these operations can be found [here](/development_suite/clusters-management/add-edit-remove-cluster.md).

:::note
It is essential to point out that these operations do not have an impact on the original Kubernetes cluster, but only on the connection to the cluster itself, as they are meant to provide the user with information about it. Therefore, as an example, adding a new cluster connection does not generate a new cluster, but simply links an existing one to the Console.
:::

To access these features, head to the Company Overview area of the Console by clicking the related button on the home page, next to your company name.

![Go to Company Overview](img/go-to-company-overview.png)

You will be automatically redirected to the Clusters section, in which you can see a table containing some information about the clusters connected to the Console:

* **Cluster ID**: friendly identifier of the cluster, assigned by the user while connecting the cluster to the Console;
* **Kubernetes version**: Git version of the Kubernetes master node associated with the cluster;
* **Cluster URL**: URL used to connect to the cluster, which indicates where the cluster is exposed;
* **Vendor**: a label used to describe the vendor of the cluster (e.g. Google, AWS...);
* **Runtime service**: a label used to describe the runtime service of the cluster (e.g. WMWare Tanzu, GKE).

![Clusters table](img/clusters-table.png)

## Cluster preparation

In order to connect your cluster to the Console, there are some preparation steps that **must be done**.

You can choose between the automatic procedure and the manual one.

<Tabs>

<TabItem value="automatic" label="Automatic" default>

Contact us to receive the `Mia Platform Helm Chart` and `Template Console Helm Chart` that will automatically create the needed `ServiceAccount`, `ClusterRole` and `ClusterRoleBindings`.
    
</TabItem>
<TabItem value="manual" label="Manual" default>

### ServiceAccount

First, you must create a `ServiceAccount` on Kubernetes: this service account will be used by the Console to interact with the APIs exposed by Kubernetes on your cluster.

You can do this using the dedicated [kubectl command](https://jamesdefabia.github.io/docs/user-guide/kubectl/kubectl_create_serviceaccount/) or by creating a new Kubernetes object with the following template:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{SERVICE_ACCOUNT_NAME}}
  labels:
  annotations:
```

### ClusterRole

Next, we must define the roles needed by the previously created service account. These are the minimal roles required by the Console to work.

Here is the template to quickly define them:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: {{CLUSTER_ROLE_NAME}}
  labels:
  annotations:
rules:
  - apiGroups:
      - ""
    resources:
      - "pods"
    verbs:
      - "delete"
      - "get"
      - "list"
  - apiGroups:
      - "batch"
    resources:
      - "cronjobs"
    verbs:
      - "get"
      - "list"
  - apiGroups:
      - ""
    resources:
      - "secrets"
    verbs:
      - "create"
      - "get"
      - "list"
  - apiGroups:
      - ""
    resources:
      - pods/log
      - nodes
      - events
    verbs:
      - "get"
      - "list"
  - apiGroups:
      - "metrics.k8s.io"
    resources:
      - "pods"
    verbs:
      - "list"
  - apiGroups:
      - "apps"
      - "extensions"
    resources:
      - "deployments"
      - "daemonsets"
    verbs:
      - "get"
      - "list"
  - apiGroups:
      - "autoscaling"
    resources:
      - "horizontalpodautoscalers"
    verbs:
      - "get"
      - "list"
  - apiGroups:
      - ""
    resources:
      - "namespaces"
    verbs:
      - "create"
  - apiGroups:
      - ""
    resources:
      - "limitranges"
      - "resourcequotas"
    verbs:
      - "create"
      - "get"
      - "list"
      - "patch"
      - "update"
  - apiGroups:
      - ""
    resources:
      - "namespaces"
    verbs:
      - "get"
  - apiGroups:
      - "rbac.authorization.k8s.io"
    resources:
      - "rolebindings"
    verbs:
      - "create"
  - apiGroups:
      - ""
    resources:
      - "serviceaccounts"
    verbs:
      - "create"
      - "get"
  - apiGroups:
      - "rbac.authorization.k8s.io"
    resources:
      - "clusterroles"
    verbs:
      - bind
    resourceNames:
      - {{NAME_OF_THE_SERVICE_ACCOUNT_USED_FOR_THE_DEPLOY}}
```

### ClusterRoleBindings

Finally, we **must** associate the roles with the service account using the `ClusterRoleBindings` that can be created using the following template:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: 
  labels:
  annotations:
roleRef:
  kind: ClusterRole
  name: {{CLUSTER_ROLE_NAME}}
  apiGroup: rbac.authorization.k8s.io
subjects:
- kind: ServiceAccount
  name: {{SERVICE_ACCOUNT_NAME}}
  namespace:
```

</TabItem>

</Tabs>

### CA and Token

If everything has been made correctly, we can now extract the `Certificate Authority (CA)` and the `Token` that will be mandatory for the cluster connection.

To extract the `Token`, you can use the following command, that will also automatically decode it for you:

```sh
kubectl get secret `kubectl -n get sa $(SERVICE_ACCOUNT_NAME) -o jsonpath='{.secrets[0].name}'` -o jsonpath='{.data.token}' | base64 -d
```

To extract the `CA`, you can use the following command, that will also automatically decode it for you:

```sh
kubectl -n get secret `kubectl get sa $(SERVICE_ACCOUNT_NAME) -o jsonpath='{.secrets[0].name}'` -o jsonpath="{.data['ca\.crt']}" | base64 -d
```

:::caution
If you have created everything in a specific namespace, don't forget to specify it using the `-n` parameter of the `kubectl`.
:::

## Configure and connect the Service Account to the Cluster

:::danger
In case the service account is not configured on the specific cluster, upon creation of an environment associated with that cluster the Console will not be able to generate the token needed for deployment.
:::

There are 2 alternative ways to configure and associate the service account on Kubernetes with the cluster just created on the Console.

### 1. Via CMS

Using the Console CMS and editing the cluster on which you need to configure the service account via the appropriate section, and entering in the "Service Account" field the object that references the service account you want to configure and connect to.

![Cluster edit for Service Account](img/cluster_serviceAccount_CMS.png)

A brief example of the Service Account object:

```json
{
  "name": <serviceAccountName>
  "clusterRoleName": <clusterRoleName>
}
```

### 2. Via service request

By opening a service request in which all the details of the cluster to be configured to the service account must be specified.
