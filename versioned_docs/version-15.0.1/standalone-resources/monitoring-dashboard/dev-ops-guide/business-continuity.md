---
id: business-continuity
title:  Business Continuity
sidebar_label: Business Continuity
---
With Business Continuity we mean all the measures to make the system and its services
available without interruptions.

In case of problems of the platform, thanks to these measures, users have no perception of problems
and the service continues to work regularly.

Business continuity is measured in down time compared to the reference time. Typically we take it as
reference year. Service continuity can be interrupted by factors that are not under control
of the Business Continuity plan, such as: data center downs, natural disasters, hacker attacks.

In these cases the Disaster Recovery plan starts working.

## Business Continuity Plan

The factors that can affect the business continuity of Mia-Platform can be:

- planned:
  - platform updates;
  - infrastructure updates;
  - release of new features;
- unplanned:
  - down of the infrastructure;
  - hacker attacks;
  - natural disasters;
  - urgent hotfix releases;
  - loading of the platform that exceeds the design limits;
  - human errors.

For scheduled events, 100% business continuity can be guaranteed, instead for unplanned ones,
it will not always be possible to guarantee continuity of service but to mitigate the effects of the interruption or to make
take over the disaster recovery plan

## Factors that allow Business Continuity

Mia-Platform has a stateless microservice architecture. This means that every microservice of the platform is:

- redundant;
- scalable;
- stateless, that is, it does not have a different behavior linked to the order of how the calls are received, but the session is managed
at the application level.

The microservice orchestration is delegated to Kubernetes which has a state monitoring management system
distributed services and therefore does not have a single point of failure.

Persistence is guaranteed by a mongodb cluster that guarantees persistence and failover thanks to the system
replication set of the database server itself.

Access to the services via API passes through redevelopable Openresty web servers that make reverse proxies on the various services
interior.

In the case of high reliability applications, the reverse proxy relies on a service registry where all
services are cataloged.

The platform can be installed both on-premise and on PaaS, even from different vendors, even simultaneously.
This ensures that the likelihood of downtime of the service is reduced further.

## Scheduled events management

### Mia-Platform

The following are the actions to guarantee business continuity in the case of events planned for Mia-Platform:

- before starting a planned event verify that:
  - backups are up to date;
  - if you release an update the pre-production tests have all passed and the configurations are all under repository;
  - the delivery pipeline is up-to-date and functioning correctly without error notifications;
  - the microservices are redundant on at least two nodes;
  - if there are NON-backward-compatible updates, all the applications that access the updating services have been successfully tested in pre-production
- if you are releasing an update or a new feature update one node at a time and test that node before propagating the change;
- in case of errors, roll back to the previous version on the node.

### Infrastructure

Actions to ensure business continuity during infrastructure upgrade depend on implementation
of the infrastructure itself. It is advisable to follow the good practices of common use for the infrastructure used.

However, we recommend the following actions:

- check that the updates have been made before in pre-production and the tests are all ok;
- where possible update a node at a time of the infrastructure so that you can do the gradual tests and be able to roll back
  if needed.

## Management of unplanned events

Unplanned events, by their nature, are more difficult to manage and require automatic actions to mitigate
the possible impacts on the continuity of the service.

Mitigation actions follow for each unplanned event

### Down the infrastructure or natural disaster

To avoid the interruption of service of Mia-Platform in case of infrastructure problems it is necessary to redundant
all platform services on different infrastructures.

This can be done by decoupling the physical and virtual infrastructure from the orchestrator.

A typical installation is to use Kubernetes in Federated Replica Set mode. There are several services on the market
to implement this configuration.

### Hacker attack or overload

In the case of DOS or DDOS, the guarantee of service continuity is offered by:

- autoscaling of nodes to absorb excess traffic
- HTTP / HTTPS filters placed upstream of Mia-Platform that block IPs that carry out too many identical and frequent requests
- drop the excess connections so as not to let other users access until users with ongoing calls have finished their call

### Urgent hotfix release

In the case of an urgent hotfix, the same measures are recommended for the release of planned updates.

### Human error

In case of error it is possible to restore the previous version if the gradual updates have been made.
In the case of a destructive error and none of the above options is able to mitigate the impacts, refer to the Disaster Recovery.
