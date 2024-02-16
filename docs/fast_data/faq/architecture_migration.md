---
id: architecture_migration
title: Architecture migration
sidebar_label: Architecture migration
---

The [standard architecture](/fast_data/architecture.md#standard-architecture) of the Fast Data is composed of two main services, the [Real-Time Updater](/fast_data/realtime_updater.md) and the [Single View Creator](/fast_data/single_view_creator.md). 
The new [event-driven architecture](/fast_data/architecture.md#event-driven-architecture) instead is composed by two new additions that replace the Real-Time Updater: the [Projection Storer](/fast_data/realtime_updater.md) and the [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md).

## What's the purpose of the Projection Storer?

The Projection storer is a partial replacement for the RTU since it processes events coming from CDC systems and updates the Projection on the System of Record of choice. It is a "partial" replacement because it does not execute [Strategies](/fast_data/configuration/strategies.md) anymore, which means it won't create Projection Changes records.

## Who executes the strategies now?

The strategy execution is now done by the Single View Trigger Generator.
To know exactly how to include it in your already existing Fast Data project check out this [step by step](/fast_data/single_view_trigger_generator.md#migration-guide-for-adopting-single-view-trigger-generator) section.
Furthermore, the Single View Trigger Generator introduces a whole new approach on the [Projection Changes](/fast_data/configuration/realtime_updater/index.md#projection-changes) which used to be stored only on MongoDB. The SVTG gives you the option of sending the Projection Changes through Apache Kafka with a whole new format called Single View Trigger. To know more check out the [comparison between the two](/fast_data/single_view_trigger_generator.md).

## How can I migrate my current architecture to the event-driven one?

The first step is to replace the Real-Time updater with the Projection Storer, you can follow step by step [this guide](/fast_data/configuration/projection_storer.md#migration-guide) and use our migration utility that allows you to convert you current configuration into one the Projection Storer understands.

Once the PS is ready, you have to set up the Single View Trigger service. Then again you can follow [this short guide](/fast_data/single_view_trigger_generator.md#migration-guide-for-adopting-single-view-trigger-generator) to migrate everthing easily.
