---
id: mongodb
title: MongoDB Sink
sidebar_label: Mongodb
---



The MongoDB sink allows you to write data to a MongoDB instance.
It supports upserting data using a specified ID as the primary key, or to insert only data without overwriting them.

## Flows

There are two different flows that can be managed by the sink.

### Upsert and Delete (default)

Each record will be updated based on a unique ID field, which is statically the `_eventId` one.

For each kind of input event, there is a chosen event id. It is possible to see the supported event type
to which operation are mapped for each kind of event in the [source documentation](/runtime-components/plugins/integration-connector-agent/sources/10_overview.md).

Depending on the source event, it is possible to create two different actions:

- **Upsert**: The sink will insert the data into the collection if not present, or completely replace it if
it is already present. The update is based on the `_eventId` field.
- **Delete**: The sink will delete the data from the collection. The delete is based on the `_eventId` field.

[See how different events are managed](/runtime-components/plugins/integration-connector-agent/sources/10_overview.md)  in the sources documentation.

### Insert Only

In this mode, the sink will only insert data into the collection, and will not update or delete any existing data.
It is possible to enable this flow adding the `insertOnly` parameter to the configuration.

## Configuration

To configure the MongoDB sink, you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the sink, which should be set to `mongo`.
- `url` ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The MongoDB connection URL
- `collection` (*string*): The name of the MongoDB collection where data will be stored.
- `insertOnly` (*boolean*, optional): If set to `true`, the sink will only insert data into the collection,
and will not update or delete any existing data. Default is `false`.

Example configuration:

```json
{
  "type": "mongo",
  "url": {
    "fromEnv": "MONGO_URL"
  },
  "collection": "sink-target-collection"
}
```

The db will be taken from the URL.

:::info
If not present in db, the collection will be created.

It is highly recommended to set an unique index on the `_eventId` field.
:::

### Configuration with insertOnly

With this configuration, the data are only added to the target collection.

```json
{
  "type": "mongo",
  "url": {
    "fromEnv": "MONGO_URL"
  },
  "collection": "sink-target-collection",
  "insertOnly": true
}
```
