---
id: create_projection
title: Projection
sidebar_label: Projections
---

## Create a System of Record

To create a projection, you should create a System of Record. This is the data source which update the projections.

The creation of the System of Record requires to insert a system ID, useful to recognize the system.

### Projections Changes

When a projection is updated, the Real-Time Updater changes a collection called, by default, `fast-data-projections-changes` inserting the information of the document updated.

This collection will be used by the Single View Creator to know which single view needs an update. It is the connection between projections and single view.

You can choose to use a collection you have already created in the CRUD section through advanced configuration. To do that, [read here](./advanced#projections-changes)

## Create a Projection

To create a projection using the Console, select the System of Record from which the projection is taken.
In the System of Record detail, scroll until the `Projection` card and click on the create button.
Here, you can insert the name of your projection.

:::info
The projection name is used as MongoDB collection name.
:::

To view the details of a projection, click on the arrow button at the end of the table row.

### Kafka topics

Once in the projection detail page, there is a card with detail of `Kafka topics`.
Here, you can modify the default name of the topics per environment.
The topic name are pre-compiled with our suggestion name:

```txt
projectId.environmentId.projectionName-json
```

where `projectId`, `environmentId` and `projectionName` are filled with, respectively, the id of the console project, the id of the environment associated and the name of the projection.

### Projection fields

In the card `Fields` in projection, you can add new fields.

:::info
By default, since the Crud Service is used underneath, projections have the [predefined collection properties](/docs/runtime_suite/crud-service/overview_and_usage#predefined-collection-properties), even if they are not visible
in projection field table
:::

Once you click to `Create field` button, a form is prompted where you should insert the following fields (all fields are required):

* `Name`: name of the projection field;
* `Type`: once of `String`, `Number`, `Boolean` or `Date`
* `Cast function`: it shows the possible [Cast Function](cast_functions) to select for the specified data type;
* `Required`: set the field as required, default to false;
* `Nullable`: declare field as nullable, default to false.

### Indexes

In the card `Indexes`, you can add indexes to the collection. To learn more about crud indexes, [click here](/docs/runtime_suite/crud-service/overview_and_usage#indexes).
However, differently from Indexes that can be created on a normal CRUD, in this section the `Geo` index type is not available.

An `_id` index is created by default and it is not deletable.

### Expose projections through API

You can expose a projections through API, only with `GET` method (the data in the projections are modifiable only by the Real Time Updater service).

To expose the Fast Data projection, [create an Endpoint](/docs/development_suite/api-console/api-design/endpoints) with type `Fast Data Projection` linked to the desired projection.

:::info
It is not required for the Fast Data to work the exposed API. It is an optional behaviour if you need to have access to the data without access directly from database.
:::
