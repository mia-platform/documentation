---
id: deployment-tools
title:  Deployment tools
sidebar_label: Deployment tools
---

# Deployment tools

Kubernetes offers, by design, two deployment strategies:

* Recreate &rarr; terminates the pod and, once terminated, scales up the new one;
* Rolling Update (the default one) &rarr; the new pod is scaled up and, when ready and healthy, the old one is terminated;

look at the [official documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy) for more information.

Sometimes the user needs other deployment strategies, not supported by design using Kubernetes.
For this reason we analyzed some tool to fulfil this need:

* [Flux - Flagger](https://flagger.app/);
* [Argo - Argo-rollouts](https://argo-rollouts.readthedocs.io/).

:::warning
The tools above are not fully integrated into the Mia-Platform Console. The user can handle resources through the console and the projects configurations, but not through the Mia-Platform Console UI with a no-code approach.
:::

## Flux - Flagger

Flagger is a OSS tool developed by [Flux](https://fluxcd.io/).

Flagger allows the user to implement two other deployment strategies:
* canary &rarr; the traffic is partially routed to the new version of the service, partially to the old one;
* blue/green &rarr; the new version is deployed (green) but the traffic still goes to the old version (blue), until the new version is "approved" for promotion. Once approved, the traffic is switched to new version of the service and the old one is shutted down.

:::warning
The blue/green strategy provided by Flagger is not a real blue/green because Flagger does not switch the traffic from the blue to the green version; once "approved" for promotion, Flagger updated the blue version and terminates the green one &rarr; the blue version is always **the only stable one**. 
:::

Flagger allows to implement one or both (simultaneously too) the strategies above using:
* the kubernetes standard resources (deployment, services and so on);
* a *Custom Resource Definition* called `Canary`;

allowing the user to handle resources using the Mia-Platform Console and the projects configurations.

:::warning
Deleting a `Canary` resource will cause the kubernetes resources deletion too.
:::

### Blue/Green strategy

#### Lifecycle

Creating, on the Mia-Platform Console, a service called `my-hello-world`, the console will automatically generate:
* a k8s Deployment manifest for `my-hello-world`;
* a k8s Service manifest for `my-hello-world`.

The `Canary` file is to be manually created inside the project configuration repository, the location is based on you [project structure](https://docs.mia-platform.eu/docs/development_suite/set-up-infrastructure/create-project).

Once the `Canary` CRD is created, deploying the project will cause:
* the creation of the k8s resources **created automatically by the console**;
* the creation of the Canary resource **created manually by the user**;

and Flagger will automatically:
* create a new k8s deployment `my-hello-world-primary`, equals to the `my-hello-world` one;
* create a new k8s service `my-hello-world-primary` that points to the deployment above;
* edit the `my-hello-world` service, adding the `-primary` suffix on the match label selector;
* create a new k8s service `my-hello-world-primary` that will be used for the blue/green release;
* scale down the `my-hello-world` deployment, because is replaced by the `-primary` one, handled by Flagger.

Updating the `my-hello-world` deployment will cause a new Blue/Green deployment start, so that the user can still edit the service lifecycle through the Mia-Platform Console.


## Argo - Argo-rollouts

TODO