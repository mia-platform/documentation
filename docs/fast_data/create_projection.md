---
id: create_projection
title: Projection
sidebar_label: Projections
---

## Create a System of Record

To create a projection, you should create a System of Record. This is the data source which update the projections.

The creation of the System of Record requires the insert of a system ID to recognize the system.

### Projections Changes

When a projection is updated, the updater changes a collection called by default `fast-data-projections-changes` inserting the information of the document updated.

This collection will be used by the Single View Creator to know which single view need an update. It is the connection between projections and single view.

You can choose to use a collection you have already created in the CRUD section through advanced configuration.   

In order to do that, your collection is supposed to have the following fields (apart from the default ones): 
```json
[
    {"name":"type","type":"string","required":false,"nullable":false},
    {"name":"changes","type":"Array_RawObject","required":false,"nullable":false},
    {"name":"identifier","type":"RawObject","required":true,"nullable":false},
    {"name":"doneAt","type":"Date","required":false,"nullable":false}
]
```

You also need to have the following additional indexes: 

```yaml
Field: type_change_state
Type: normal
Unique: false
IndexFields:  
            - name: type
              order: ASCENDENT
            - name: changes.state
              order: ASCENDENT
```

```yaml
Field: type_identifier
Type: normal
Unique: true
IndexFields:  
            - name: type
              order: ASCENDENT
            - name: identifier
              order: ASCENDENT
```

After that, you need to set your collection as the one to be used by the Real-Time Updater. To do that, ([see here](./create_projection#link-projections-to-the-single-view)).

## Create a Projection

To create a projection on console, enter in the System of Record from which the projection is taken.
In the System of Record detail, scroll until the `Projection` card and click on the create button.
Here, you insert the name of your projection.

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
By default, since the crud-service is used, projection have the [predefined collection properties](/docs/runtime_suite/crud-service/overview_and_usage#predefined-collection-properties), even if they are not visible
in projection field table
:::

Once you click to `Create field` button, a form is prompted where you should insert the following fields (all fields are required):

* `Name`: name of the projection field;
* `Type`: once of `String`, `Number`, `Boolean` or `Date`
* `Cast function`: it shows the possible cast function to select for the specified data type;
* `Required`: set the field as required, default to false;
* `Nullable`: declare field as nullable, default to false.

### Indexes

In the card `Indexes`, you could add indexes to the collection. To learn more about crud indexes, [click here](/docs/runtime_suite/crud-service/overview_and_usage#indexes).
Differently from the link, in this section the `Geo` index is not present.

An `_id` index is created as default and it is not deletable (and not visible in the table).

### Expose projections through API

You can expose a projections through API, only with `GET` method (the data in the projections are modifiable only by the Real Time Updater service).

To expose the Fast Data projection, [create an Endpoint](/docs/development_suite/api-console/api-design/endpoints) with type `Fast Data Projection` linked to the desired projection.

:::info
It is not required for the Fast Data to work the exposed API. It is an optional behaviour if you need to have access to the data without access directly from database.
:::

## Cast Functions

Cast function are used to cast a specific input field type from an event to a defined type.
To read more about cast functions, [click here](cast_functions)
