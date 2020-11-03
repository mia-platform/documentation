---
id: autoscaling
title:  Autoscaling of services
sidebar_label: Autoscaling Pods
---
The autoscaling of the services released on the platform both on PaaS and on premise is entrusted to the resource of
Kubernetes called [Horizontal Pod Autoscaler][hpa].
This resource uses the metrics collected by Kubernetes itself to evaluate the need for instantiation
new pods to divide the work up to a maximum set.

The resources that are taken into consideration are the use of cpu and memory. If one of these values ​​exceeds one
threshold expressed as a percentage then the system will create a new instance of the pod to divide the load that will come
deleted after a period of time when all available instances remain below the set threshold.
This percentage is calculated with this expression:

```
replicheDesiderate = ceil[replicheCorrenti * ( valoreMetricaCorrente / valoreMetricaDesisderato )]
```

The value of the desired metric for the service in question will be taken from the value set in the block
`request` contained in`resources` of the `Deployment` of Kubernetes.

[hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

HPA's files will be generated only for the production environments (`isProduction: true`).  
In order to be able to use HPA you need to set the environment variable `ENABLE_HPA` to `true` for the production environments.
