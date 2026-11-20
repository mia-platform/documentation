---
id: usage
title: Usage
sidebar_label: Usage
---

## Requirements

To use the application, the following requirements must be met:

- Kafka connection must have permission to read the topic declared in the configuration file;
- Kafka topic must exist on the Kafka cluster, with the appropriate number of partitions (which constrain service replicas), retention and replication factor;
- MongoDB collection must be defined on the MongoDB cluster with the necessary indexes; in particular, all the fields of the message key should belong to a unique index, which would ensure record uniqueness on the database

## Write Mode

Service supports two write modes, which modifies the behavior of insert and update action
on the database when a document already exists for such change event:

- `strict`: only fields in the `after` payload are **retained** in the stored document.
  This is the default mode;
- `partial`: fields in the `after` payload are **merged** onto the stored document;

In particular, `strict` mode ensures that after writing a record onto the database, the resulting
document corresponds to the value in the `after` payload. This means that insert operations
act as _replace_ one to ignore unknown fields, while update operations _unset_ unknown fields,
that are fields that may occur in the `before` payload, but not in the `after` one.
On the contrary, `partial` mode treats insert operations as _upserts_, while updates just
update fields found within the `after` payload.

## Messages Spec

Input Kafka messages key is compliant with the following schema:

```json
{
  "type": "object"
}
```

Input Kafka messages payload is compliant the following schema:

```json
{
  "type": "object",
  "oneOf": [
    {
      "properties": {
        "op": {
          "const": "c",
          "description": "insert"
        },
        "before": { "type": "null" },
        "after": { "type": ["object", "string"] }
      }
    },
    {
      "properties": {
        "op": {
          "const": "r",
          "description": "snapshot"
        },
        "before": { "type": "null" },
        "after": { "type": ["object", "string"] }
      }
    },
    {
      "properties": {
        "op": {
          "const": "u",
          "description": "update"
        },
        "before": { "type": ["object", "string"] },
        "after": { "type": ["object", "string"] }
      }
    },
    {
      "properties": {
        "op": {
          "const": "d",
          "description": "delete"
        },
        "before": { "type": ["object", "string"] },
        "after": { "type": "null" }
      }
    }
  ]
}
```

:::warning

Input messages **must** be compliant with [Fast Data message format](/products/fast_data_v2/concepts.mdx#fast-data-message-format).

In addition, Kango also accepts the following variants of that format:

- the `after` and `before` fields can be provided either as JSON objects or as strings
  containing a serialized JSON object (as produced, for example, by Debezium MongoDB connector);
- both message key and payload can optionally be wrapped in an envelope `{ "payload": ... }`,
  as produced by Kafka Connect converters when schemas are enabled.

:::

## Data Types

Fields of the `after` and `before` payloads (as well as the message key) are parsed as
[MongoDB Extended JSON](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/).

Plain JSON values (strings, numbers, booleans, `null`, objects and arrays) are stored as they are.
Hence, a date serialized as an ISO 8601 string is persisted as a **string**, not as a BSON `Date`.

To persist a field with a specific BSON type, the Extended JSON notation must be used:

| BSON type  | Extended JSON                             |
|------------|-------------------------------------------|
| Date       | `{ "$date": "2028-11-01T00:00:00.000Z" }` |
| ObjectId   | `{ "$oid": "65f1c0a2e4b0a1b2c3d4e5f6" }`  |
| Int64      | `{ "$numberLong": "1234567890123" }`      |
| Decimal128 | `{ "$numberDecimal": "10.99" }`           |

For example, the following payload stores `renewalDate` as a `Date` and `name` as a string:

```json
{
  "op": "c",
  "before": null,
  "after": {
    "_id": { "$oid": "65f1c0a2e4b0a1b2c3d4e5f6" },
    "name": "subscription",
    "renewalDate": { "$date": "2028-11-01T00:00:00.000Z" }
  }
}
```

:::note
Date fields with no value must be set to `null`, not to `{ "$date": null }`.
Objects whose keys match Extended JSON operators (e.g. `$date`, `$oid`) are always interpreted
as BSON types: if their value is invalid, the message cannot be parsed.
:::

:::tip
Producers written in Node.js can rely on `EJSON.stringify(message, { relaxed: true })` from the
[`bson`](https://www.npmjs.com/package/bson) package, which automatically serializes `Date` objects
using the `$date` notation.
:::
