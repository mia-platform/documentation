---
id: disaster-recovery
title:  Disaster Recovery
sidebar_label: Disaster Recovery
---
Disaster Recovery refers to the procedures to restore a situation that has compromised the correct
operation of the platform and where all the Business Continuity systems have failed with the consequent
non-availability of services.

Disaster Recovery procedures can be divided into three parts:

- systems checklist;
- maintenance and verification;
- implementation of the procedures in case of malfunctions.

## Systems checklist

In order to successfully complete the Disaster Recovery procedures in case of failures it is essential that:

- all the data of MongoDB are backed up;
- all the Mia-Platform custom configurations are under repository;
- the chain of continuous delivery and deployment are active and functioning;
- you have track of the versions of the docker images installed;
- update the deployment document with the description of the entire runtime infrastructure;
- the runtime infrastructure is generated automatically by scripts and the scripts are under repository.

## Maintenance and verification

The following actions must be carried out periodically:

- each checklist point is verified;
- the system is stressed by scheduling parts of the services in a programmed way;
- simulate, at least once every six months, a Recovery action on a test system.

## Implementation of the procedures

In case of problems, the actions to restore the platform are:

- install the reference infrastructure with automatic scripts
- install the Mia-Platform nodes to the versions that were on the systems in production
- install custom configurations
- restore MongoDB backups.

> It is recommended that all of these operations be performed by automatic scripts.
