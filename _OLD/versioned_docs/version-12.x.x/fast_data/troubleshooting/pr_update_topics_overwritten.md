---
id: pr_update_topics_overwritten
title: PR update topics have been overwritten and messages are not sent
sidebar_label: PR update topics overwritten
---

## Problem

After updating Mia-Platform Console to `v10.2.0` PR update messages are not sent. When checking an existing projection it appears that the existing PR update topic values have been replaced.

## Cause

This can happen when an existing Real-Time Updater already contained a configuration file named `kafkaProjectionUpdates.json` inside the `/home/node/app/kafkaProjectionUpdates` folder before upgrading Mia-Platform Console to `v10.2.0`.

This version of the Console introduces an automatic generation of PR update topics, as further explained inside the [Projection page](/fast_data/configuration/projections.md#pr-update-topic).

Given that the automatic generation creates a configuration with the same name inside the same folder, it is possible that the existing configuration is overwritten, thus replacing the existing topic values with default ones.

## Solution

We suggest accessing the desired projections and manually update PR update topic values. This feature has been introduced from `v10.5.0` of Mia-Platform Console.

Another option could be creating a new configuration file, following the guide inside the [Common page](/fast_data/configuration/realtime-updater/configuration-files.md#configuration). The new configuration file should be named `kafkaProjectionUpdates.json` and should contain the desired PR update topic values for each projection. To prevent conflicts with the automatically created configuration, please insert the new configuration in a folder different from the default `/home/node/app/kafkaProjectionUpdates`. After creating the new configuration, the `KAFKA_PROJECTION_UPDATES_FOLDER` environment variable of the Real-Time updater should be updated to the new folder value.