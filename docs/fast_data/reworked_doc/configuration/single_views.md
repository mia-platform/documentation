---
id: single_views
title: Single Views Configuration
sidebar_label: Single Views
---

<head>
   <meta name="robots" content="noindex, nofollow" />
</head>

In this document we guide you through the configuration of [Single Views](../the_basics.md#single-view-sv) directly in the Console.

## Create the Single View

Click on the Single Views voice of the left menu, which opens the Single View page, and click the button to create a new Single View.  

Fill the modal with the name of the Single View, that is going to be the name of the collection.

Once created, you will be redirected to the Single View detail page.  

## Single View Data Model

Single views collections are created on the *CRUD Service*, so we add all the [default fields](../../../runtime_suite/crud-service/overview_and_usage#predefined-collection-properties) and indexes required for the CRUD collections in creation.

To define the custom fields, indexes and internal endpoints of your single view collection, add them in the respective card.

![Fast Data Single View Fields](../../img/single-view-detail-fields.png)

The type fields supported are the same of the collection you can create in the [MongoDB CRUD section](../../../development_suite/api-console/api-design/crud_advanced#create-a-new-crud). To know more about indexes [click here](../../../runtime_suite/crud-service/overview_and_usage#indexes).

## Create the Single View Creator service

You need to create a **Single View Creator** to update or delete a Single View when a `Projection Changes` event occurs. More information about `Projection Changes` [here](../inputs_and_outputs.md#projection-change).

A Single View can be updated by many Single View Creator. Each Single View Creator should be linked to one System of Records through Projection Changes.

```shell
system_1
 _______________     __________________________
| projection_1 |---> |projection_change type A |  ----> single_view_creator_1  
| projection_2 |---> |_________________________|                      \ 
|______________|                                                       \update
                                                                         ________________
                                                                        | single_view_A |
                                                                        |_______________|
system_2                                                                /
 _______________     __________________________                        / update
| projection_3 |---> |projection_change type B |  ----> single_view_creator_2  
| projection_4 |---> |_________________________|
|______________|

```

To associate the Single View with the service, add a service in the `Single view creator services` card in the Single View detail page. You can attach more than one service to the Single View.

After you have attached the microservice to the Single View, a link to the microservice will appear. Click on the link to navigate to the detail page of that microservice.

![Fast Data Single View Microservice](../../img/single-view-detail-microservice.png)

:::info
In the [Marketplace](../../../marketplace/overview_marketplace), you can find a template and two plugins that can help you in configuring all the **Single View Creator** services that you need. You can find more information [here](../architecture.md#single-view-creator-svc).
:::

## Link projections to the Single View

In the detail page of the Single View, click on the `Strategies` tab.

![Fast Data Single View Strategies](../../img/single-view-detail-strategies.png)

Here it's shown a table in which you have to specify the all projections that will be read to get the data that the Single View needs (remember that a Single View is an aggregation of data from different projections).

To link a strategy to your Single View, once you entered the [`Strategies`](strategies) tab, you can click on the `Add link to strategy` button, which will let you select:

1. A System and a Projection from said system
2. Whether the strategy type is `low code` or `manual`
3. The main strategy function file name

You can link a strategy as low code only if the system it belongs to is low code as well. If you choose to link the strategy as low code, instead of its main function file name, the `__automatic__` marker will be used.

:::warning
Once you have linked some strategies to a Single View Creator in low code mode, if you try to change the Real Time Updater making it manual, you will not be allowed to save.
:::

If you choose to use manual strategies, each listed manual projection must be linked to a file without the extension `.js` which is the entry point of your **strategy function**.

Notice that the strategy file must be placed directly inside the directory with the name of the system of records, placing it inside a subfolder of this directory is not supported.

Example:

```txt
configurations/
    |-- fast-data-files
        |-- strategies/
              |-- my-system/
                    |-- myStrategyForProjection1.js
                    |-- someFunctions.js
```

Where `myStrategyForProjection1.js` is the file that exports the strategy function, and internally it uses some functions imported from the `someFunctions.js` file.

So, you have to set `myStrategyForProjection1` as **main function file** for the projection associated.

In the table, you have the option to turn a manual strategy into a low code strategy. Note that this is only possible if the system the projection belongs to is low code too.

## How to consume the Single View

You can expose the Single View through the crud-service without writing any code, or you can always create a custom service to access to MongoDB if you have special needs.

You could [check here](../../../development_suite/api-console/api-design/endpoints) how to expose an endpoint of the CRUD service outside your project through the Console.

[Click here](../../../runtime_suite/crud-service/overview_and_usage) if you want the usage documentation for the CRUD.

## How to delete a Single View

To delete a Single View just click on the `Delete` button in the Single View detail page.

:::warning
You **cannot** delete a Single View if it has any endpoint associated, you will have to delete them first.
Deleting a Single View does **not** delete the microservice associated.
:::

## Technical limitation

In your custom files (e.g. `fast-data-files`) you can import only the node modules present in the following list:

- [lodash.get](https://github.com/lodash/lodash/tree/4.4.2-npm-packages/lodash.get)
- [mongodb](https://github.com/mongodb/mongo/tree/r3.6.0)
- [ramda](https://github.com/ramda/ramda/tree/v0.27.1)

:::caution
It is used the node version 12.
:::