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

Existing projects can transition to Environment Based Management through the Console UI. Company Owners will receive a migration prompt upon first accessing a Project.

The migration can be executed through two methods while preserving existing revision versions:

### Automatic Migration

Prerequisites:

- All project environments must have at least one previous deployment
- Runtime environments inherit their most recent deployed revision configuration
- All revisions transfer to virtual environments

### Manual Migration

This guided process offers granular control over the final configuration:

1. Environment Configuration Selection
   - Choose initial configuration snapshots for each Project Environment
2. Revision Migration
   - Determine which revisions to convert to virtual environments

Note: Users may postpone migration by selecting 'Skip' or closing the migration dialog. The prompt will reappear the following day.
