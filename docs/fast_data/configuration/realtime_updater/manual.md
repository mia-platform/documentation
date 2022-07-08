---
id: manual
title: Real-Time Updater Manual configuration
sidebar_label: Manual
---

Manual mode for implementing strategies consists in writing by hands Javascript modules which implements the logic for running across projections to retrieve the Single View identifier.   
We recommend using manual strategies only if you need advanced and complex logic that a [Low Code](./low_code.md) would not cover.

To know how to write strategies read [here](../strategies.md#write-your-strategies)

### Strategies configuration

The default mount path used for this configuration is: `/home/node/app/configurations/strategies`.
In this folder you have all the generated [Strategies](../strategies.md) which you have defined in your GitLab project inside the `fast-data-files/strategies` directory.
