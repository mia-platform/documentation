---
id: K8s_roles_and_permissions
title: Kubernetes cluster roles and permissions
sidebar_label: K8s cluster roles and permission
---

In this page are showed the roles and permissions of users which operates on Kubernetes clusters.

Mia-Platform provides two main different roles:

- Developer: Developer users can view the majority of the Kubernetes Resources (pods, services, deployments, events, logs etc...) and exec/port-forward into pods using Kubernetes APIs
- Admin: Admin users can also edit, delete and create most of the Kubernetes Resources using Kubernetes APIs.

:::info
For multi-tenant Kubernetes Clusters, the already mentioned permissions are restricted only to their relative namespaces.
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