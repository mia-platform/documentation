---
id: env-based-management
title: Environment Based Management
sidebar_label: Environment Based Management
---

The Environment Based Management is a feature available on enhanced project that aims to merge the concept of Project Revisions into Project Environments, in a way that Project Environments will be the main abstraction for both Project Configuration management and Runtime management, these environments will be divided in two categories:

By default, a Project configuration for a Enhanced Project is stored into named snapshots called [revisions and versions](/development_suite/set-up-infrastructure/revisions-and-versions.md), the concept of revisions and versions is similar to the concept of [branches](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and [tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) in Git: the project configuration holds the design of a Project, including its microservices, their configuration, secreted and public variables, configmaps, exposed endpoints and other design related information. 

The Environment Based Management aims to unify the concept of Project Revision into **Project Environments** so that any of your Project Revision may be directly connected to a Kubernetes Cluster...


## How it works
Any *Project Environment* falls into one of the following two categories:

- **Virtual Environments** are environments that are used to manage the Project configuration.
- **Runtime Environments** are virtual environments that are can either deploy a workload to a runtime (eg. a Kubernetes cluster) or access to the current runtime state of a workload (eg. pods logs), or both.

...
## How to enable the feature

## How to migrate an Enhanced Project to use the feature
