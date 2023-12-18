---
id: kustomize-use-cases
title: Kustomize Use Cases
sidebar_label: Kustomize Use Cases
---
In this page you can see examples of how you can use Kustomize in order to manage some use cases.

### Patch replicas

To show you how Kustomize can be helpful, let's analyze a simple use case where we have a project and want to change the number of static replicas only for the production environment.

As a starting point, let's assume we have a project containing a microservice called `hello-world` with a deployment file similar to the following:

```yaml
# file: ./configuration/helloworld.deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  replicas: 1
  template:
    spec:
      containers:
      - image: hello-world:latest
```

The base configuration sets the number of replicas to 1. Now, let's define an overlay for the production environment that changes the number of replicas from 1 to 2.

Add the following file:

```yaml
# file: ./overlays/production/helloworld.patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  replicas: 2
```

This way, when the production environment will be deployed, there will be two static replicas of the `hello-world` service. Notice that `./overlays/production/kustomization.yaml` is automatically generated and can be left empty.

### Patch all deployments

In addition, Kustomize allows you to specify a list of targets in the  `kustomization.yaml` files included in overlays. This feature allows applying patches to multiple resources at once.

The snippet below includes all the available targets:

```yaml
patches:
  - path: <relative path to file containing patch>
    target:
      group: <optional group>
      version: <optional version>
      kind: <optional kind>
      name: <optional name or regex pattern>
      namespace: <optional namespace>
      labelSelector: <optional label selector>
      annotationSelector: <optional annotation selector>
```

For example, imagine you want to inject a sidecar proxy into all your Kubernetes deployments.

Let's suppose you already have a couple of microservices with the following deployments:

```yaml
# file: ./configuration/helloworld.deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  replicas: 1
  template:
    spec:
      containers:
      - image: hello-world:latest
---
# file: ./configuration/goodbyeworld.deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: goodbye-world
spec:
  replicas: 1
  template:
    spec:
      containers:
      - image: hello-world:latest
```

First off, you need to create the patch containing the sidecar container specification in the environment of interest (e.g. development).

```yaml
# file: ./overlays/development/sidecar.patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: not-important
spec:
  template:
    spec:
      containers:
        - name: istio-proxy
          image: docker.io/istio/proxyv2
          args:
          - proxy
          - sidecar
```

Then, to apply the patch to all your Deployments, you have to manually edit the `kustomization.yaml` file in the selected overlay directory. For instance, if you want to inject the sidecar in the development environment, the corresponding `kustomization.yaml` would look like this:

```yaml
# file: ./overlays/development/kustomization.yaml
resources:
- ../../configuration

patches:
- path: sidecar.patch.yaml
  target:
    kind: Deployment
```

:::info
When using `target`, the `metadata.name` of the patch will be ignored.
:::

Once deployed, you will see the two Deployment resources with an additional `istio-proxy` container.

You can choose to add other conditions to find the targets to patch instead patching all deployments.
For example, you can patch only deployments with a specific label or annotation:

```yaml
# file: ./overlays/development/kustomization.yaml
resources:
- ../../configuration

patches:
- path: sidecar.patch.yaml
  target:
    kind: Deployment
    labelSelector: myLabel=labelValue,otherLabel=otherValue
    annotationSelector: myAnnotation=annotationValue,otherAnnotation=otherValue
```

With the example above, the `istio-proxy` container will be added to deployments with **all the specified labels and annotations**.

:::info
You can apply labels to microservices inside the Design section of the Mia-Platform Console, or, in case of Self-Hosted installation, you can [set default labels](/marketplace/add_to_marketplace/contributing_overview.md#common-to-microservice-items-plugins-templates-examples) to the microservices created from Marketplace.
:::
