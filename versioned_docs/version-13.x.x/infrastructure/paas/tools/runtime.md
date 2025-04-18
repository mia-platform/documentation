---
id: runtime
title:  Runtime
sidebar_label: Runtime
---

Mia-Platform PaaS offering provides you with a managed Kubernetes runtime environment, customized to your specific needs, without the complexities of hosting and managing it yourself. Our runtime options help you to utilize the full potential of Kubernetes, whether through a shared cluster or a dedicated cluster exclusively for your organization.  

## Shared cluster

In a shared Kubernetes cluster configuration, multiple organizations share a single cluster while maintaining complete isolation and security. This option is ideal for those seeking a cost-effective solution, where resources are efficiently utilized across multiple projects. Our robust infrastructure and advanced resource management ensure smooth performance and a reliable experience for all tenants.  
When using this option you will get access and ownership of a set of namespaces dedicated only for your applications.  

## Dedicated cluster  

For organizations requiring enhanced control, customization, and resource isolation, our dedicated Kubernetes cluster offering is the perfect fit. With a dedicated cluster, you have exclusive access to all resources, ensuring optimal performance and security for your applications.  

## Accessing Kubernetes Clusters  

This guide assists you in configuring `kubectl` to connect to your own Kubernetes cluster. Before you begin, ensure that the [kubelogin plugin](https://github.com/int128/kubelogin) is installed. Here's how to install it based on your system:

### Install `kubelogin`

```bash
# Homebrew (macOS and Linux)
brew install int128/kubelogin/kubelogin

# Krew (macOS, Linux, Windows and ARM)
kubectl krew install oidc-login

# Chocolatey (Windows)
choco install kubelogin
```

### `kubectl` configuration

To set up `kubectl` for connecting to your Kubernetes cluster, kindly request the following information from your designated Mia-Platform contact:
* `CLUSTER_NAME`
* `CLIENT_ID`
* `OIDC_ENDPOINT`
* `OIDC_ISSUER_URL`

Next, replace the placeholders in the script below with the provided values, and then execute the commands to apply the configuration:

```bash
cluster="<CLUSTER_NAME>"
client_id="<CLIENT_ID>"
endpoint="<OIDC_ENDPOINT>"
oidc_issuer_url="<OIDC_ISSUER_URL>"

echo "Setting login-$cluster credentials"
kubectl config set-credentials "login-$cluster" \
    --exec-api-version=client.authentication.k8s.io/v1beta1 \
    --exec-command=kubectl \
    --exec-arg=oidc-login \
    --exec-arg=get-token \
    --exec-arg=--oidc-issuer-url=$oidc_issuer_url \
    --exec-arg=--oidc-client-id=$client_id \
    --exec-arg=--oidc-extra-scope=groups \
    --exec-arg=--oidc-extra-scope=openid \
    --exec-arg=--oidc-extra-scope=profile \
    --exec-arg=--oidc-extra-scope=email \
    --exec-arg=--oidc-extra-scope=offline_access

echo "Setting cluster $cluster"
kubectl config set-cluster $cluster --server=$endpoint

echo "Setting context $cluster"
kubectl config set-context $cluster --cluster $cluster --user "login-$cluster"
```

### Usage

Once configured, new kube-context will be available, view them with:

```bash
kubectl config get-contexts
```

To connect to a specific cluster, use the following command and proceed with `kubectl` as usual:  

```bash
kubectl config use-context <CONTEXT_NAME>
```

During the first command, `kubelogin` will open a new browser tab to retrieve an OIDC token, which will be stored in the `kubectl` cache folder and used for cluster authentication. 

### Troubleshooting

If you encounter issues, try deleting the OIDC token in `.kube/cache/oidc-login/{token_hash}` and retry the `kubectl` command. If the problem persists, seek assistance from our dedicated Mia-Platform PaaS support team.

## Permissions

Mia-Platform PaaS provides two main different roles for runtime:

- Developer: Developer users can view the majority of the Kubernetes Resources (pods, services, deployments, events, logs etc...) and exec/port-forward into pods using Kubernetes APIs
- Admin: Admin users can also edit, delete and create most of the Kubernetes Resources using Kubernetes APIs.

:::info
For shared Kubernetes Clusters, the already mentioned permissions are restricted only to their relative namespaces.
:::

Usually Mia-Platform teams have Admin and Developer roles depending on the environment on which they operate. Instead, external users such as partners and customer teams works with Developer permission.

If you are wondering which Kubernetes permissions each role has in depth, check the following table:

|Resources|Developer permissions|Admin permissions|
|-|-|-|
pods/exec|Create|Create|
pods/portforward|Create|Create
pods.metrics.k8s.io| Get; List; Watch | Get; List; Watch
configmaps|Get; List; Watch|Get; List; Watch
events|Get; List; Watch|Get; List; Watch
limitranges|Get; List; Watch| Update; Delete; Create; Deletecollection; Patch; Get; List; Watch|
namespaces/status| Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
namespaces|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
persistentvolumeclaims|Get; List; Watch|Get; List; Watch
pods/log|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
pods/proxy|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
pods/status|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
pods|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
resourcequotas/status|Get; List; Watch|Get; List; Watch
resourcequotas|Get; List; Watch|Get; List; Watch
services/proxy|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
services|Get; List; Watch|Get; List; Watch
challenges.acme.cert-manager.io|Get; List; Watch|Get; List; Watch
deamonset.apps|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
deployments.app/scale|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
deployments.apps|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
replicasets.apps/scale|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
replicasets.app|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
statefulsets.apps/scale|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
statefulsets.app|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
verticalpodautoscalers.autoscaling.k8s.io|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
horizontalpodautoscalers.autoscaling|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
cronjobs.batch|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
jobs.batch|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
certificates.cert-manager.io|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
sleepinfos.kube-green.com|Get; List; Watch|Update; Delete; Deletecollection; Patch; Get; List; Watch
podmonitors.monitoring.coreos.com|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
prometheusrules.monitoring.coreos.com|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
servicemonitors.monitoring.coreos.com|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
ingressroutes.traefik.containo.us|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
ingressroutetcps.traefik.containo.us|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
middlewares.traefik.containo.us|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
tlsoptions.traefik.containo.us|Get; List; Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch
secrets|List,Watch|Update; Delete; Create; Deletecollection; Patch; Get; List; Watch