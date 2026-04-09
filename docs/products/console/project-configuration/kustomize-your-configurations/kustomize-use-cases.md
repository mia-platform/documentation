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

:::tip
Sometimes you could need to patch keys containing a `/` character.
The `/` character is often used (e.g. for inline operations) by Kustomize as separator, consequently you need to replace it with the `~1` value.

For example, if you want to add the `app.kubernetes.io/component` label to one or more manifests, you should escape the slash as following:

```yaml
- patch: |-
    - op: replace
      path: /metadata/labels/app.kubernetes.io~1component
      value: monitoring
```

:::

### Patch all deployments

In addition, Kustomize allows you to specify a list of targets in the `kustomization.yaml` files included in overlays. This feature allows applying patches to multiple resources at once.

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
        - image: goodbye-world:latest
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
You can apply labels to microservices inside the Design section of the Mia-Platform Console, or, in case of Self-Hosted installation, you can [set default labels](/products/software-catalog/items-manifest/plugin.md) to the microservices created from Marketplace.
:::

### Enable **High Availability** for business critical microservices

Sometimes you need to be sure about the availability of few business critical microservices due to different reasons:

- kubernetes cluster update;
- start of a new business campaign;
- any other business.

In order to do so you probably want some microservice configured for _High Availability_.
:::info
The _High Availability_ is a characteristic of a system, an application, or a service, that guarantees operability without intervention, even if there are problems on an instance of it.
:::

Using _Kustomize_ and the _Mia-Platform Console_ you can add advanced configurations to your business critical microservices.

:::warning
The following **is a basic example** that allows you to replicate and distribute replicas of services on different nodes of your cluster.

Remember to always check your specific needs and customize the patch files based on the topology of your infrastructure and your requirements.
:::

In this example is showed how to guarantee that, on each business critical microservice, you have:

- 3 up and running replicas;
- replicas distributed through different nodes of the cluster.

We should focus just on business critical services, so we will use a specific label to identify the right targets.
The label is:

> **highAvailability**: _true_

Let's assume we have the following deployments:

```yml
# file: ./configuration/helloworld.deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
  labels:
    highAvailability: "true"
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
  labels:
    highAvailability: "false"
spec:
  replicas: 1
  template:
    spec:
      containers:
        - image: goodbye-world:latest
```

We expect to have the High Availability enabled on the `hello-world` service only, since the `goodbye-world` one doesn't have the `highAvailability: true` label.
To do so, we can use the following Kustomize configurations:

```yml
# file: ./overlays/PROD/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../configuration

patches:
  - target:
      kind: Deployment
      labelSelector: "highAvailability=true"
    patch: |-
      - op: add
        path: /spec/template/spec/topologySpreadConstraints
        value:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: ScheduleAnyway
            labelSelector:
              matchLabels:
                highAvailability: "true"
            matchLabelKeys:
              - pod-template-hash
      - op: replace
        path: /spec/replicas
        value: 3
```

The configuration shown above will edit the manifest of all the deployment workloads having the label `highAvailability: true` in two different ways:

- it will replace the value of the **replicas** field to **3**;
- it will add the **topologySpreadConstraints** property, that allows to describe the topology of your infrastructure and how the pods are distributed:
  - **maxSkew** &rarr; the degree to which Pods may be unevenly distributed. We set it to **1**, to have at most 1 different replica among nodes;
  - **topologyKey** &rarr; the topology key to be used for the pods distribution. We set it to **kubernetes.io/hostname**, that represents the k8s node;
  - **whenUnsatisfiable** &rarr; what the k8s scheduler must do if the condition is not satisfiable. Setting it to **ScheduleAnyway** ensure us the replica will be scheduled anyway.
  - **labelSelector** &rarr; enforce the topologySpreadConstraint property to spread replicas having this label
  - **matchLabelKeys** &rarr; this label will ensure the user that replicas from the same deployment will be spread across different nodes. The label used, **pod-template-hash**, is a special one that will be added automatically by Kubernetes when applying the resource and will have the same value for every replica from the same deployment.

:::tip
The **topologySpreadConstraints** is a very rich and powerful property.
It allows you to control how Pods are spread across your cluster among failure-domains such as regions, zones, nodes, and other user-defined topology domains. This can help to achieve high availability as well as efficient resource utilization.

Look at the [k8s official documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) for more.
:::

:::info
The **pod-template-hash** label is available starting from Kubernetes v1.27, you can find more about it in the [Kubernetes official documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)
:::

The result, by deploying this **after** [**decorating your business critical services**](/products/console/api-console/api-design/services.md#labels-configuration) with the _highAvailability: true_ label, is having 3 replicas of the services, spread across your cluster nodes.

:::warning
If you have the [Horizontal Pod Autoscaler enabled](/products/console/api-console/api-design/replicas.md) on some microservices, the value of the _static replicas_ you set will not work.
To fix that be sure to adjust the `minReplicas` value of the HPA through the Console page, otherwise some service could have just one replica &rarr; not High Availability.
:::
