---
id: realtime_updater
title: Real-Time Updater
sidebar_label: Real-Time Updater
---

The Real-Time Updater service consumes [kafka messages](https://kafka.apache.org/intro#intro_concepts_and_terms) in order to keep the fast data projection collections up to date with the connected system.

A Real-Time Updater service is automatically created when you create a new System.
After the new configuration has been saved, this service is visible as one of your services in the `Microservices` section.

## Projection Update

Two actions are necessary for the Real-Time Updater in order to correctly update its projections:

- You must define at least one custom field with the following flags set to true: **Primary Key**, **Required**.
- You must create an index using the previously defined custom field and set the flag **Unique** to true.

When a projection is updated, an event of that update can be produced on Kafka in order to notify that a specific projection has changed. This allows you to have interesting architecture reactive on events involving your projections.

## Trigger the update of a Single View

When a projection is updated, Real-Time Updater will generate an event telling that a specific Single View needs to be updated since it depends on the Projection updated. This event can be generated whether by upserting a `Projection Changes` collection or by producing a Kafka Message. A [Single View Creator](https://kafka.apache.org/intro#intro_concepts_and_terms) is expected to be consuming the event.

### Real Time Updater Configurations

To know more about Real-Time Updater service Configurations you can go [here](./configuration/realtime_updater/common.md)

When a projection is updated, Real-Time Updater will generate an event telling that a specific Single View needs to be updated since it depends on the Projection updated, by sending a Kafka Message or upserting a document in a Projection Changes collection. This event contains a reference to the identifier of the Single View document that have to be updated since it depends on the Projection updated. 

In order to get the identifier of the Single View, the Real-Time Updater performs an algorithm called `strategy` that consists of following a path that connects some projections, starting from the one updated, in order to reach the one containing the identifier of the Single View we look for.

This algorithm can be implemented using the [Real Time Updater Low Code](./configuration/realtime_updater/low_code.md). It uses json files for configuration and the environment variables are already set with correct default values.
