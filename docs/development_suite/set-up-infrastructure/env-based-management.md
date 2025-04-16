---
id: env-based-management
title: Environment Based Management
sidebar_label: Environment Based Management
---

The Environment Based Management is a feature available on enhanced project that aims to merge the concept of Project Revisions into Project Environments, in a way that Project Environments will be the main abstraction for both Project Configuration management and Runtime management.

## Two types of Environments

This new workflow introduces two types of Environments:

- **Virtual Environments** are environments that are used only to manage the Project configuration.
- **Runtime Environments** are virtual environments that are connected to a cluster and, when deployed, their configuration will be up and running in the selected runtime.

## Environment Configuration snapshots

Both runtime and virtual environments can hold a set of snapshots of a Project configuration, these snapshots contain all the project design elements such as microservices, endpoints, and so on.

Configuration snapshots are arranged in a linked list, where each snapshot is linked to the previous one, and the latest snapshot is the current configuration of the environment.

## Environment Configuration versioning

Users can give a name to specific environment configuration snapshots by creating an environment configuration version. Versioned runtime environments configuration snapshots can be deployed to a runtime environment.

## Migrate existing Projects to the new Environment Based Management

Existing projects can be migrated to the new Environment Based Management using the Console UI. When you first enter a Project, if you are a Company Owner, you will be prompted to migrate the project to the new Environment Based Management.

The project migration process can either be done automatically or manually.

In both cases, the existing revisions versions will be kept and available in the new Environment Based Management.

### Automatic migration

The automatic migration can only be performed if each environment of the project has been deployed at least once.

With the automatic migration, each runtime environment will inherit its latest deployed revision configuration and each revision will be migrated to a virtual environment.

### Manual migration

The manual migration is a guided process, that allows the user to have a finer control over the resulting project configuration. It consists of the following steps:

1. For each Project Environment, select a snapshot to be used as the initial configuration for the environment.
2. Select which revisions to migrate to virtual environments.

This process can be skipped by clicking the `Skip` button or closing the migration modal. When skipped, the migration will not be prompted until the following day.
