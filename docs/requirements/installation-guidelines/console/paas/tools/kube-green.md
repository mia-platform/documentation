---
id: kube-green
title:  Kube-Green
sidebar_label: Kube-green
---
In the cloud era, managing resource utilization is essential to contain the costs and limit energy consumption. 
kube-green is a Kubernetes operator that allows to shut down environments or specific resources in order to optimize resource utilization, limiting energy waste. kube-green comes preinstalled in the Mia-Platform PaaS, and it is immediately available for configuration.

But how does Kube-green succeed in managing correctly Kubernetes resources to limit energy waste?

- It sets the selected Deployments *replicas* to 0
- It stops the selected Cronjobs by changing their status as *suspended*
- It allows to stop those resources at a set time and wake them up when needed

Thanks to these automatism, you can limit the up-time of resources and environments that are not needed 24/7, such as development or test environment.

## kube-green configuration

If your project is hosted on the PaaS, kube-green is ready to be configured. Every option of the operator is managed by the CRD SleepInfo.
Below you can find a complete example of *Sleepinfo* resource.

```yaml
apiVersion: kube-green.com/v1alpha1
kind: SleepInfo
metadata:
  name: working-hours
spec:
  weekdays: "1-5"
  sleepAt: "20:00"
  wakeUpAt: "08:00"
  timeZone: "Europe/Rome"
  suspendCronJobs: true
  excludeRef:
    - apiVersion: "apps/v1"
      kind: Deployment
      name: api-gateway
```

The SleepInfo spec contains:

- **weekdays**: day of the week. * is every day, 1 is monday, 1-5 is from monday to friday
- **sleepAt**: time in hours and minutes (HH:mm) when namespace will go to sleep. Valid values are, for example, 19:00or *:* for every minute and every hour. Resources sleep will be deployments (setting replicas value to 0) and, if suspendCronjobs option is set to true, cron jobs will be suspended.
- **wakeUpAt** (optional): time in hours and minutes (HH:mm) when namespace should be restored to the initial state (before sleep). Valid values are, for example, 19:00or *:* for every minute and every hour. If wake up value is not set, pod in namespace will not be restored. So, you will need to deploy the initial namespace configuration to restore it.
- **timeZone** (optional): time zone in IANA specification. For example for italian hour, set Europe/Rome.
- **suspendCronJobs** (optional): if set to true, cronjobs will be suspended.
- **excludeRef** (optional): an array of object containing the resource to exclude from sleep. It contains:
    - **apiVersion**: version of the resource. Now it is supported "apps/v1" and "batch/v1"
    - **kind**: the kind of resource. Now it is supported "Deployment" and "CronJob"
    - **name**: the name of the resource

You can find more examples and tutorial in the Kube-green documentation [[1]](https://kube-green.dev/docs/getting-started/)

## Utilize kube-green in your project

You can deploy kube-green resources (SleepInfo CRDs') with two different scopes in your project:

- Deploy in every Environment
- Deploy in a specific Environment

### Deploy in every Environment

'deploying in every Environment' means that the resources that you have created to manage kube-green will be deployed singularly in every Environment/Namespace of your project.
To achieve this result, you need to identify if your project template uses default Kubernetes resource or Kustomize structure, and then save the resources in the correct path.
- **Base project:** The resources need to be saved in the path `configuration/<resource.yaml>`
- **Kustomize project:** The resources need to be saved in the path `configuration/<resource.yaml>`

### Deploy in a specific Environment

When deploying kube-green configurations in a specific environments, the resource-managing features of kube-green will be applied only to the Deployments and CronJobs running in that environment.

Depending which template you are using:
- **Base project:** The resources need to be saved in the path `configuration/<environmentId>/<resource.yaml>` 
- **Kustomize project:** The resources need to be saved in the path `overlays/<environmentId>/<resource.yaml>`

Where *environmentId* is a variable identified with the parameter *envId* configured on the console. 
