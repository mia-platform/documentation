---
id: env-based-management
title: Environment Based Management
sidebar_label: Environment Based Management
---

Environment Based Management enables enhanced projects to unify Project Revisions and Project Environments. This integration establishes Project Environments as the primary mechanism for managing both Project Configuration and Runtime operations.

## Environment Types

Environment Based Management introduces two distinct environment categories:

- **Virtual Environments**: Dedicated environments for Project configuration management
- **Runtime Environments**: Virtual environments linked to clusters that enable configuration deployment and execution in the selected runtime

## Configuration Management

### Configuration Snapshots

Both environment types maintain configuration snapshots that preserve project design elements, including: microservices, endpoints and so on.

These snapshots form a sequential chain, with each snapshot referencing its predecessor. The most recent snapshot represents the current environment configuration.

### Version Control

Users can designate specific configuration snapshots by creating named environment configuration versions. For Runtime environments, versioned configuration snapshots can be deployed to the runtime environment.

## Migration Process

When you're ready to embrace Environment Based Management for your existing projects, the transition process is straightforward and accessible through the Console UI. As a Company Owner, you'll notice a helpful migration prompt the first time you access your Project after this feature becomes available.

To ensure a smooth transition while maintaining the integrity of your existing revision versions, we offer two flexible migration methods that you can choose from based on your specific needs and preferences:

### Automatic Migration

Before proceeding with the automatic migration, there are several important prerequisites that must be met:

First, ensure that all project environments have been deployed at least once. This is essential for maintaining configuration history and ensuring a smooth transition.

Second, when migrating, runtime environments will automatically inherit the configuration from their most recently deployed revision. This preserves your current operational state.

Finally, during the migration process, all existing revisions will be converted into virtual environments, maintaining your complete configuration history and development workflow.

### Manual Migration

The manual migration process provides users with more control and flexibility over how their project configurations are transferred. Here's how it works:

During the manual migration, you'll have the opportunity to carefully select and configure various aspects of your environments. First, you'll be able to choose specific configuration snapshots for each of your Project Environments, allowing you to precisely define the starting point for each environment. Next, you'll have control over which existing revisions should be converted into virtual environments, enabling you to maintain only the most relevant historical configurations.

If you're not ready to proceed with the migration immediately, don't worry - you can either click 'Skip' or simply close the migration dialog. The system will remind you about the pending migration by showing the prompt again the next day, ensuring you won't forget about this important transition.

## Environment configuration promotion
