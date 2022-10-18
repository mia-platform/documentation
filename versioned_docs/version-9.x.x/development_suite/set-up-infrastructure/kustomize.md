---
id: kustomize
title:  Kustomize your configuration
sidebar_label: Kustomize your configuration
---

Optionally you can use [Kustomize](https://kustomize.io/) as a project-level configuration manager. This feature allows you to modify the default configuration of your microservices on a per-environment basis in a simple declarative way with pure YAML. Learn how to enable this feature [here](./create-project.mdx#create-a-template).

With Kustomize, you can specify `overlays` to overwrite the default configuration of your microservices for a specific environment. To do so, you have to manually modify the project configuration by editing the following files inside the chosen environment folder (`./overlays/%envId%/`):

* `kustomization.yaml`: file that contains the directives that define the resulting configuration for the services deployed in the selected environment `%envId%`. Here, you can specify both the new resources to add and the base resources to patch. For more info see [here](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/#kustomize-feature-list).
* `%resourceName%.yaml` (put your actual resource name instead of `%resourceName%`): files containing the new resources to add to your base configuration.
* `%patchName%.patch.yaml` (put your actual patch name instead of `%patchName%`): files containing possible partial modifications to your base project configuration.

### The new project structure

To enable Kustomize, you need to manually change the project configuration structure from this one:

```plain
.
├── configuration
│   ├── %resourceName%.yaml
│   └── %envId%
|       └── %resourceName%.yaml
└── variables
    └── %envId%.env
```

To this one:

```plain
.
├── configuration
│   ├── kustomization.yaml
│   └── %resourceName%.yaml
└── overlays
    └── %envId%
        ├── kustomization.yaml
        ├── variables.env
        ├── %resourceName%.yaml        
        └── %patchName%.patch.yaml
```

Firstly, you need to move all of your environment folders to a new first-level directory called `overlays`. Then, you have to place the `.env` variables files from `variables` in the corresponding environment folder of the new location and rename it to `variables.env`. Remember to add `kustomization.yaml` files.

## Use cases

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

For example, imagine you want to inject a sidecar proxy to all your Kubernetes deployments.

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
- deployments.yaml

patches:
- path: sidecar.patch.yaml
  target:
    kind: Deployment
```

:::info
When using `target`, the `metadata.name` of the patch will be ignored.
:::

Once deployed, you will see the two Deployment resources with an additional `istio-proxy` container.
