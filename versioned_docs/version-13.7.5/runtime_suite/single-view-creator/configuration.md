---
id: configuration
title: Single View Creator plugin
sidebar_label: Configuration
---



This service allows you to update the Single View when a new projection change occurs.

It requires MongoDB and Kafka to be installed in your platform. The former is used to read the projections changes and update the Single View, the latest is used to notify the events happening, like a Single View creation.  

To learn more about the Single View Creator and its configuration, you can read [its documentation in the Fast Data area](/fast_data/concepts/architecture.md#single-view-creator-svc).
