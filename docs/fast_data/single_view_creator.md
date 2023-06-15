---
id: single_view_creator
title: Single View Creator
sidebar_label: Single View Creator
---

Each Single View needs a dedicated Microservice. This service will listen on the **Projections changes** that affect the Single View and consequently update its data. This service is the `Single View Creator`.

The SingleView Creator service consumes events whether as [Kafka messages](https://kafka.apache.org/intro#intro_concepts_and_terms) or from MongoDB in order to keep the Fast Data Single View collections up to date with the projections updates.

To start configuring your own Single View Creator, you have three options:

* Start from the *Single View Creator - Low Code Plugin*
* Start from the *Single View Creator Plugin*
* Start from the *Single View Creator Template*

The first option uses the Low Code configuration, the second and third options use the manual configuration. More information about the differences between Low Code and manual configurations can be found [here](/fast_data/no_code_overview.md).

### Single View Creator Configurations

To know more about Single View Creator service Configurations you can go [here](/fast_data/configuration/single_view_creator.md).

When a Single View Creator consumes events regarding a Single View to update, it needs to perform an aggregation to be able to upsert the Single View correctly. 

This aggregation can be implemented in two modes:
- **Manual**: recommended for tailored configurations. It uses custom environment variables and custom JavaScript configuration files to work
- **Low Code**: recommended for quicker configurations. It uses json files and the environment variables are already set with correct default values.
