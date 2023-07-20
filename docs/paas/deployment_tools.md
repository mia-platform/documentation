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
The blue/green strategy provided by Flagger is not a real blue/green **on Kubernetes** because Flagger does not switch the traffic from the blue to the green version; once "approved" for promotion, Flagger updated the blue version and terminates the green one &rarr; the blue version is always **the only stable one**. 
:::

Flagger allows to implement one or both (simultaneously too) the strategies above using:
* the kubernetes standard resources (deployment, services and so on);
* a *Custom Resource Definition* called `Canary`;

allowing the user to handle resources using the Mia-Platform Console and the projects configurations.

:::warning
Deleting a `Canary` resource will cause the kubernetes resources deletion too.
:::

### Blue/Green strategy

#### Lifecycle through the Mia-Platform Console

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

Updating the `my-hello-world` deployment will cause a new Blue/Green deployment start, so that the user can still handle the service lifecycle through the Mia-Platform Console.

#### Blue/Green deployment lifecycle

During a blue/green deployment, flagger will perform some operation, as reported in the following image:

![Flagger blue/green deployment lifecycle](img/flagger_bg_lifecycle.png)

1. The v1 of `my-hello-world` is up and running;
2. The user deploys the v2 of `my-hello-world` through the console:
  * flagger deploys the v2 with the `-canary` suffix;
  * the v1 is still up and running and serves the traffic to the users;
  * the conformance test step starts;
3. Flagger runs the load tests, if specified &rarr; if the failure treshold is reached, the release is aborted;
4. Flagger check metrics, if specified &rarr; if the failure treshold is reached, the release is aborted;
5. Flagger validates the SLOs;
6. Flagger promotes the new v2 version and terminates the old v1.

:::info
Blue/Green and Canary strategies can be mixed to allow some user to start using the new v2 version before the promotion (progressive traffic shifting).
:::

#### Tests automation

Flagger executes a precise tests lifecycle, as shown in the previous paragraph, and provides diffent ways to automate tests.

The main types are:
* [**metrics analysis**](https://docs.flagger.app/usage/metrics): allows to specify one or more metrics to be analyzed to promote/rollback the release. Flagger supports different metrics providers (prometheus, dynatrace, datadog and so on);
* [**webhooks**](https://docs.flagger.app/usage/webhooks): hooks of different types executed during the deploy, with different purposes.

Using the tools above Flagger allows the users to completely automate the promotion of a release, without the need of manual actions.

Despite that, is still possible to pause the deploy lifecycle in different points for manual actions using the right hooks types, as reported in the following image:

![Flagger hooks types](./img/flagger_hooks_types.png)

:::info
Flagger exposes Prometheus metrics to show statistics about releases. There are ready to use Grafana dashboards too.
:::

#### Examples

Following an example of `Canary` file that allows to deploy, in the `traibning-development` namespace, the `api-gateway` service using the Blue/Green strategy and send notification to a Google Chat channel:

```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: api-gateway
  namespace: training-development
spec:
  provider: kubernetes
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  progressDeadlineSeconds: 60
  service:
    port: 8080
    portDiscovery: true
  analysis:
    interval: 5s
    threshold: 2
    iterations: 10
    analysis:
    webhooks:
      - name: "ask for confirmation"
        type: confirm-rollout
        url: http://flagger-loadtester.training-development/gate/check
      - name: "notify"
        type: event
        url: <GOOGLE_CHAT_URL>
        metadata:
          text: "Ready for promotion"
      - name: "promote"
        type: confirm-promotion
        url: http://flagger-loadtester.training-development/gate/halt
      - name: "rollback"
        type: rollback
        url: http://flagger-loadtester.training-development/rollback/check
```

## [Argo - Argo-rollouts](https://argo-rollouts.readthedocs.io/)

Argo rollouts is a tool included into the [Argo project](https://argoproj.github.io/) that allows to use other deployment strategies:
* canary &rarr; the traffic is partially routed to the new version of the service, partially to the old one;
* blue/green &rarr; the new version is deployed (green) but the traffic still goes to the old version (blue), until the new version is "approved" for promotion. Once approved, the traffic is switched to new version of the service and the old one is shutted down.

Argo rollouts allows to implement one of the strategies above using:
* the kubernetes standard resources (deployment, services and so on);
* a *Custom Resource Definition* called `Rollout`.

:::warning
The default behaviour of Argo rollouts is to **replace the existing deployments** manifests with the `Rollouts` manifest directly, that will handle the related pods; despite that, Argo rollouts allows to refer an existing deployment.
:::

### [Rollout CRD](https://argo-rollouts.readthedocs.io/en/stable/features/specification/)

The `Rollout` CRD allows the user to handle the lifecycle of a service using one of the following approaches:
* handle the pods lifecycle by replacing the kubernetes `Deployment`;
* refer an existing kubernetes`Deployment` without replacing it.

An Argo rollouts `Rollout` CRD is very similar to a kubernetes `Deployment` to:
* specify replicas and pod template;
* specify deployment strategies different from the default ones:
  * Canary;
  * Blue/Green.

### Blue/Green strategy

#### Lifecycle through the Mia-Platform Console

