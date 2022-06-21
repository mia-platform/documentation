---
id: business_continuity
title:  Business Continuity and Disaster Recovery
sidebar_label: Service continuity
---

Business continuity is Mia-Platform's ability to prevent interruptions to mission-critical services and to reestablish full function as quickly and smoothly as possible after a disaster has occurred.

By definition, Business continuity should involve two distinct areas:
- **Business continuity planning**: plan to ensure organizations overcome any interruptions and disasters as quickly as possible
- **Business continuity management**: management to ensure plans are always available so that organizations can experience the minimum possible day-to-day disruption.

Mia-Platform is proactive to design measures and procedures in order to keep its operating at its maximum capability as well as to maintain communication and accepting chances after an incident has happened. This is called *resilience* and it is one of the three key elements of business continuity. The other two are *recovery* and *contingency*. The latter one refers to those procedures which can include hardware replacement and contracting third-party vendors for assistance. Finally, the recovery is the planned strategy for post-failure procedures, so that disaster recovery is just a subset of business continuity planning. 


## Mia-Platform Business Continuity Planning

### Mia-Platform Console infrastructure overview

Since Mia-Platform Console has a stateless microservice architecture, every microservice of the platform should be:

- redundant;
- scalable;
- stateless (it does not have a different behavior linked to the order of how the calls are received, but the session is managed
at the application level).

The *microservice orchestration* is delegated to Kubernetes which allows the infrastructure to self-heal, thus whenever a failure occurs, it will restore the desired state. 

MongoDB cluster guarantees *persistence* and failover thanks to the system replication set of the database server itself. 

Access to the services via API passes through a replicated and scalable Traefik Ingress Controller to the Kubernetes Cluster Services.

Putting it all together, by definition, the likelihood of downtime of the service is rather low.

### Planned and unplanned events management

The factors which affect the Mia-Platform business continuity are both planned (i.e platform and infrastructure updates) and unplanned (i.e. down of the infrastructure, hacker attacks, natural disasters, urgent hotfix releases, platform loading time exceeding the design limits, human errors).


In order to guarantee the business continuity for applications deployed in Mia-Platform PaaS, in case of **planned events**, bear in mind the following guidelines:

  - the delivery pipeline has to be up-to-date and with no error notifications. Visit our page about [how to setup a pipeline](docs/development_suite/deploy/pipeline-configuration) for more details;
  - the microservices should be replicated at least twice (each replica on a different node). Visit our page about [how to configure replicas](docs/development_suite/api-console/api-design/replicas);
  - if there are NON-backward-compatible updates, all the applications must be successfully tested using the newer version;
  - a roll-back plan to the previous version of the application should be available in case of errors;
  - if external services (i.e. MongoDB) have a service outage, applications should be able to properly reconnect as soon as they are up and running.

Furthermore, it is up to Mia-Platform PaaS to ensure the backups are kept up to date.

On the other hand, **unplanned events** are trickier to deal with. Therefore, consider the following actions when designing your application workload in order to improve the service continuity:

- autoscaling of nodes and services to improve redundancy and availability;
- HTTP / HTTPS IP filtering blocking malicious requests;
- consistent backups for applications and data;
- support for multiregion/multizone deployments for failover

All the above guidelines are already implemented in Mia-Platform SaaS Console in order to provide the best Business Continuity as possible. On Mia-Platform PaaS, the previous guidelines can be implemented according to the agreements defined with the customer.

## Mia-Platform Disaster Recovery Planning

A clear disaster recovery pattern is critical for a cloud-native platform such as Mia-Platform. Disaster recovery involves a set of proactive decisions and procedures that enable the recovery or continuation of vital technology infrastructure and systems following a natural or human-induced disaster. The key difference between *disaster recovery* and *high availability* is that the latter one is a resiliency characteristic of a system which is implemented in place by designing it as a feature of the primary system. 

### Definitions

There are two main industry term to be defined:

- **Recovery point objective (RPO)**: A recovery point objective (RPO) is the maximum targeted period in which data (transactions) might be lost from an IT service due to a major incident.
- **Recovery time objective (RTO)**: The recovery time objective (RTO) is the targeted duration of time and a service level within which a business process must be restored after a disaster.

![rpo-rto-diagram](img/rpo-rto.png)

### Mia-Platform RPO - RTO
Mia-Platform tests its DR Plan regularly, noting any issues that come up and adjusting its plan accordingly. If you are a Mia-Platform client/partner, you can request the DR plan details to your referent. The Mia-Platform PaaS RPO value is typically between 0-6 hours, while the RTO value is typically between 0-24 hours.