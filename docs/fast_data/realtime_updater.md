---
id: realtime_updater
title: Real-Time Updater
sidebar_label: Real-Time Updater
---

The Real-Time Updater service consumes [kafka messages](https://kafka.apache.org/intro#intro_concepts_and_terms) in order to keep the fast data projection collections up to date with the connected system.

A Real-Time Updater service is automatically created when you create a new System. After the new configuration has been saved, this service is visible as one of your services in the `Microservices` section.

:::info
From version `11.7.0` of the Console, the Real-Time Updater will not be automatically generated anymore but must be created beforehand in the _Microservices_ section, and after it must be attached to the System of Record containing the projections of your interest.

This new feature will also include the possibility of using multiple Real-Time Updater services to the same System of Record, with different services attached to some projections to improve scalability and performance.
:::

## Projection Update

Two actions are necessary for the Real-Time Updater in order to correctly update its projections:

- You must define at least one custom field with the following flags set to true: **Primary Key**, **Required**.
- You must create an index using the previously defined custom field and set the flag **Unique** to true.

When a change occurs in the connected System, it sends a Kafka message to the ingestion topics to trigger the change. This change is propagated to the projections. When a projection is updated, an event of that update can be produced on Kafka in order to notify that a specific projection has changed. This allows you to have interesting architecture reactive on events involving your projections.

### Real-Time Updater Configurations

To know more about Real-Time Updater service Configurations you can go [here](/fast_data/configuration/realtime_updater.md)

As previously stated, when a projection is updated, Real-Time Updater could perform one of the following operations after the update:
- it could generate an event to inform of the update of a specific projection (this update will be sent to a Kafka topic, as explained in the [Real-Time Updater Low Code](/fast_data/configuration/realtime_updater.md#kafka-projection-updates-configuration))
- it could generate an event telling that a specific Single View needs to be updated after processing the algorithm called `strategy`. This event contains a reference to the identifier of the Single View document that have to be updated.

For further information, you can refer to the [Real-Time Updater Configuration](/fast_data/configuration/realtime_updater.md) page.
