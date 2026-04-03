---
id: crudservice
title: CRUD Service Sink
sidebar_label: Crudservice
---



The CRUD Service sink allows you to write data to a [Mia-Platform CRUD Service](/runtime-components/plugins/crud-service/10_overview_and_usage.md)
instance using its HTTP API.
It supports upserting data using a specified primary key, or to insert only data without overwriting them.

## Flows

There are two different flows that can be managed by the sink.

### Upsert and Delete (default)

Each record will be updated based on a unique primary key field,
defined in the configuration (`_eventId` is used as default value).

Depending on the source event, it is possible to create two different actions:

- **Upsert**: The sink will insert the data into the collection if not present, or completely replace if already present.
- **Delete**: The sink will delete the data from the collection.

Both actions will filter data based on the primary key field.

### Insert Only

In this mode, the sink will only insert data into the collection, and will not update or delete any existing data.
It is possible to enable this flow adding the `insertOnly` parameter to the configuration.

## Configuration

To configure the CRUD Service sink, you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the sink, which should be set to `crud-service`.
- `url` (*string*): The URL of the CRUD Service instance.
- `insertOnly` (*boolean*, optional): If set to `true`, the sink will only insert data into the collection,
  and will not update or delete any existing data. Default is `false`.
- `primaryKeyFieldName` (*string*, optional): The primary key field to use for upserting and deleting data.
  Default is `_eventId`.

:::caution
Since CRUD Service APIs are strictly checked you must ensure that the CRUD Service configuration is aware of the primary,
key field.

Make sure to add it in your CRUD Service configuration, otherwise the sink will not work as expected.
:::

:::tip
It is highly recommended to set an unique index on the primary key field in the CRUD Service configuration.
:::

### Example configuration

```json
{
  "type": "crud-service",
  "url": "https://crud-service/my-collection/",
  "insertOnly": false,
  "primaryKeyFieldName": "_eventId"
}
```
