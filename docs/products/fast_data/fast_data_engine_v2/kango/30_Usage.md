---
id: usage
title: Usage
sidebar_label: Usage
---

### Requirements

To use the application, the following requirements must be met:

- Kafka connection must have permission to read the topic declared in the configuration file;
- Kafka topic must exist on the Kafka cluster, with the appropriate number of partitions (which constrain service replicas), retention and replication factor;
- MongoDB collection must be defined on the MongoDB cluster with the necessary indexes; in particular, all the fields of the message key should belong to a unique index, which would ensure record uniqueness on the database

### Write Mode

Service supports two write modes, which modifies the behavior of insert and update action
on the database when a document already exists for such change event:

- `strict`: only fields in the `after` payload are **retained** in the stored document.
This is the default mode;
- `partial`: fields in the `after` payload are **merged** onto the stored document;

In particular, `strict` mode ensures that after writing a record onto the database, the resulting
document corresponds to the value in the `after` payload. This means that insert operations
act as _replace_ one to ignore unknown fields, while update operations _unset_ unknown fields,
that are fields that may occur in the `before` payload, but not in the `after` one.
On the contrary, `partial` mode treat insert operations as _upserts_, while updates just
update fields found within the `after` payload.

### Messages Spec

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
        "after": { "type": "object" }
      }
    },
    {
      "properties": {
        "op": {
          "const": "r",
          "description": "snapshot"
        },
        "before": { "type": "null" },
        "after": { "type": "object" }
      }
    },
    {
      "properties": {
        "op": {
          "const": "u",
          "description": "update"
        },
        "before": { "type": "object" },
        "after": { "type": "object" }
      }
    },
    {
      "properties": {
        "op": {
          "const": "d",
          "description": "delete"
        },
        "before": { "type": "object" },
        "after": { "type": "null" }
      }
    }
  ]
}
```

:::warning

Input messages **must** be compliant with [Fast Data message format](/products/fast_data/fast_data_engine_v2/concepts.mdx#fast-data-message-format).

:::

