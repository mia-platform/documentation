---
id: v9.1.0
title: Version v9.1.0 Release Notes
sidebar_label: v9.1.0
image: "img/release-note-link-preview.png"
---

_May 12, 2022_

## Fast Data

### New Features

#### Single View Trigger v1.0.0

The [Single View Trigger](../../fast_data/single_view_trigger/overview.md) is now available in Beta on the Marketplace.
The service consumes Kafka messages produced by the RealTime Updater from the topic of the [Projection Updates](/docs/fast_data/real_time_updater/manual-configuration#kafka-projection-updates-configuration-1), and it runs the appropriate strategies to generate projection changes either on Mongo or Kafka.   
This service is supposed to be used together with a Real Time Updater with Projection Changes generation turned off.

#### Automatic Projection Changes collection creation in Console

When the user commits, for each system of the Console project, a Projection Changes collection is generated and visible within the MongoDB CRUD section. Moreover, the Real-Time Updater variables are adjusted to point towards the new automatically generated collection. By deleting a system and committing, the relative automatic generated collection will be deleted too. For further details regarding automatic projections changes, check out the specific [documentation](../../fast_data/create_projection#projections-changes).

#### The 'null' condition applicable in ER schema

It is possible to configure the `aggregation.json` by using the 'null' condition inside conditional expressions. For further details check out the specific [documentation](../../fast_data/single_view_creator/low_code_configuration.md#null-value-inside-conditional-expression).

### Breaking Changes

#### Naming convention on kafkaInfo field

On topics before-after, the `kafkaInfo` field is identified with `__internal__kafkaInfo`, while on topic SV.update, where it was missing, it has been added. Provided that this field is mainly for debugging purpose and it's highly discouraged to have business logic relying on it, any existing one must be adjusted to the new format of the messages.

## Console

### New features

#### Link to RBAC section tabs

Now, it is possible to give a link on a specific tab in the RBAC section. By opening the link, the user will land on that specific tab of the RBAC section.

### Bug Fix

- Fixed a bug in the RBAC section regarding the Manual Route tab that was affecting any save operation when there was a filter applied to the table.

- Editor full-screen button color has been fixed with a more visible one.

- Fixed a bug preventing committing if a user was working on a branch containing the `/` character in the name.

- Inside the Deploy section, in the deploy history table, it is possible to see only the deployments relative to the currently selected environment, if and only if the user can have access to that environment.

- Fixed a bug preventing a normal card visualization during the switch to the advanced section for a microservice.

## Marketplace

### New features

#### Default Secrets

Marketplace services and applications now can support default secrets when created.

### Updated Marketplace Components

#### API Portal v1.16.3

With this new version, a bug causing problems with the request schema model has been fixed.

#### RBAC service v 1.2.0
Added the field `permissionsOnResourceMapEnabled` to the XPermission object. If it is set at true, inside the input provided to the opa evaluator will be present a new object `PermissionsOnResourceMap`containing a set of key/value pairs in which the key is composed as `permissionId:resourceType:resourceId` and the value is always set to `true`.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 6.0.6`.
