---
id: configuration
title: Single View Trigger Generator plugin
sidebar_label: Configuration
---
This service executes the strategies on behalf of the Real Time Updater service. It is thought to speed up the Fast Data flow and properly separate the concerns of the current architecture.

It requires MongoDB and Kafka to be installed in your platform. MongoDB is used to execute the strategies and resolve the identifiers and Kafka is used to communicate with the Real Time Updater and the Single View Creator.

To learn more about the Single View Trigger Generator and its configuration, you can read [its documentation in the Fast Data area](../../fast_data/configuration/single_view_trigger_generator.md).
