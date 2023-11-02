---
id: architecture_migration
title: Architecture migration
sidebar_label: Architecture migration
---

The current architecture of the Fast Data is composed of two main services, the [Real-Time Updater](/fast_data/realtime_updater.md) and the [Single View Creator](/fast_data/single_view_creator.md). Well that was until recently because we introduced two new additions to our core services, the [Projection Storer](/fast_data/realtime_updater.md) and the [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md).

## Projection Storer

The Projection storer

## Single View Trigger Generator

The Single View Trigger Generator is in charge of executing the [Strategies](/fast_data/configuration/strategies.md) that determine which Single View needs to be created, updated or deleted thus making it a partial replacement for the Real-Time Updater. To know exactly how to include it in your already existing Fast Data project check out this [step by step](/docs/fast_data/single_view_trigger_generator.md#migration-guide-for-adopting-single-view-trigger-generator) section. Also, the Single View Trigger Generator introduces a whole new approach on the [Projection Changes](/fast_data/configuration/realtime_updater.md#projection-changes) which used to be only stored on MongoDB, now the SVTG gives you also the option of sending the Projection Changes through Apache Kafka with a whole new format called Single View Trigger. To know more check out the [comparison between the two](/fast_data/single_view_trigger_generator.md).