---
id: no_code_overview
title: Fast Data Low Code Overview
sidebar_label: Fast Data Low Code Overview
---

The "Low Code" version of Fast Data is the new standard that leverages the power of configurations to overcome coding complexity in Fast Data setup.
This experience is based on two main fundamentals: No Code Fast Data and Low Code Fast Data

Thanks to No Code, you will have the possibility to configure your project with a few clicks.

Thanks to Low Code, you will only need to define for your Fast Data projects:

1. The relationships between the projections, in the ER Schema
2. A flow of the projection changes that should trigger specific Single Views to update
3. A declarative definition of the Single Views, based on the fields of the projections and other, more flexible solutions.

On this page, you can find an overview of which are the steps involved in a No Code workflow or Low Code one, with links to the technicalities for delving into greater detail. Before that, we want to clarify what we mean by "No Code" and "Low Code".

## What are Low Code and No Code?

With No Code we refer to the console capability to reduce the development effort using the graphic interface and automations, allowing both experienced and inexperienced users to manage a Fast Data project. Thanks to No Code you can focus on creating your Fast Data architecture while the console will support you in all the development phases, creating for your microservices and configurations.

With Low code, we mean that instead of writing javascript code to generate the strategies, projection changes and single views, you will only need to write `json` files that declaratively specify how you want your Fast Data System to be.
If you have used Fast Data before, you know that manually configuring everything can be a time-consuming end error-prone, repetitive activity. Thanks to our experience in the field, we have developed the functionality to interpret simple and human-readable `json` configurations that express most of the configurations (if not all) you will ever need.
In case the automation is not expressive enough for your use case, you can always write custom functions to close the gap, and this is why it is a "Low Code" instead of "No Code" configuration, but most of the time you will be cruising in "No Code" heaven.

## Step by step Low Code journey

The Fast Data Low Code experience has the same prerequisite as traditional Fast Data, for this reason, it is fundamental to follow the [Fast Data Setup](setup_fast_data) documentation for the proper functioning of the system.

### Creating a System of Record (No Code)

While you are creating your system of record, the console will allow you to choose between [Low Code](./real_time_updater/low-code-configuration) or [Manual](./real_time_updater/manual-configuration) configuration. By clicking on Low Code the Real Time Updater Low Code will be created, and you will be able to proceed to the configuration of your microservice.

![systemcreation](./img/systemcreation.png)

#### ER Schema definition and other Configmaps (Low Code)

The Real Time Updater Low Code needs some configurations:

- [erSchema.json](./real_time_updater/low-code-configuration#er-schema-configuration) configuration: useful to define the interconnection between projections
- The [projectionchangeschema.json](./real_time_updater/low-code-configuration#projection-changes-collection): useful to the system to know which single view needs to be updated

In both cases, it is possible to write your file inside the console and if needed, you can share them with other microservices.

### Adding a Low Code Single View Creator (Low Code)

The other fundamental component of your Fast Data Low Code project is the [Single View Creator Low Code](./single_view_creator/low_code_configuration.md).
You can create it from our Marketplace.
Also, in this case, it is needed to configure some configmaps:

- singleviewkey.json: it is fundamental to generate the query that will be applied on the single view
- erSchema.json: it needs to be the same Real Time Updater Low Code's erSchema.json of the System of Records
- aggregation.json: useful to define the aggregation and generate the single view's fields

![Singleviewlowcode](./img/singleviewlowcode.png)

#### Linking Strategies (No Code)

The Fast Data No Code experience ends with the possibility to link a [strategy](./single_view#link-projections-to-the-single-view) to your single view. To do that, you need to go in the `strategies` section of your single view and choose Low Code Strategy source in this way you allow the console to automatically manage the strategy for you.
