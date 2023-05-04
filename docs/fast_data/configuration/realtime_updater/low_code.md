---
id: low_code
title: Real-Time Updater Low Code configuration
sidebar_label: Low Code
---

Here, low-code specific configuration will be described. All the documentation regarding generic real time updater features in the manual configuration are still valid and applicable.

Low Code Real Time Updater is available since version `4.2.0`

## Environment variables

If the System of Records has been created using the automatic configuration, the Real-Time updater has all the environments variables already prepared.

:::info
You can quickly convert a System of Records from Manual to Low code by changing the `USE_AUTOMATIC_STRATEGIES` to true. Then, you should follow the next steps to set up your Fast Data Low Code project properly.
:::

:::warning
When you create a new configmap, remember to use the same Mount Path of your environment variables `STRATEGIES_FOLDER`, `ER_SCHEMA_FOLDER`, `PROJECTION_CHANGES_FOLDER`
:::

For the Automatic Real-Time Updater the `kafka_adapter`, `map_table` and `cast_function` variables are configured by the Mia-Platform console. However, it is fundamental to define the `erSchema.json` to describe the strategies' path.

### ER schema configuration

:::caution
When a new Real-Time Updater is generated, a base `erSchema.json` file is generated with the following content:
```
{ "version": "1.0.0", "config": { } }
```
This is an empty configuration: the Real-Time Updater Microservice could be deployed without pod restart, but this file must be modified according to the projections associated to this microservice to work properly.
:::  

When creating a low code system, its service will have a link to the `er-schema` configmap. If other microservices already had this configmap they will share it with the new real time updater. If you do not make changes to the default configmaps of low code real time updaters you will have all of them sharing the same Er schema. But if you need a different `er-schema` (e.g. you have created a new real time updater configured to a different system of records), then you have to unlink the `er-schema` folder and create a new configmap with its own unique identifier and create a new `erSchema.json` file in it.

The `erSchema.json` configmap defines the relationship between tables and projections.

[Here](/fast_data/configuration/config_maps/erSchema.md) you can find a deep explanation of how ER Schema configuration works.

### Projection Changes Schema

Differently from the Manual Configuration, the projection changes configurations are described with a json file aimed to reduce the developing effort.

:::caution
When a new Real-Time Updater is generated, a base `projectionChangesSchema.json` file is generated with the same content of the `erSchema.json` file. Despite this configuration will not throw any error during the deploy, the file must be customized according to the related projections.
:::

The `projectionChangesSchema.json` configmap defines the paths for the strategy to generate the projection changes identifier.

For more information please refer to the [Projection Changes Schema](/fast_data/configuration/config_maps/projection_changes_schema.md) dedicated page.
