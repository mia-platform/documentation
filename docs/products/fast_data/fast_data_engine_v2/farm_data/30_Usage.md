---
id: usage
title: Usage
sidebar_label: Usage
---

## Requirements

To use the plugin, the following requirements must be met:

- Kafka connection must have permission to read and write the topics declared in the configuration file;
- Kafka topics must exist on the Kafka cluster, with the appropriate number of partitions (which constrain service replicas), retention and replication factor;
- MongoDB collections must be defined on the MongoDB cluster with the necessary indexes;
  to aid in the generation of them it is possible to exploit provided tools, such as
  the `indexer` command of `the_world_outside` CLI. This command connects to the
  configured persistence layer and, analyzing the aggregation graph, automatically
  generate the recommended indexes for your use case. 

## Messages Spec

In this section are shown the schemas of each input and output message components.
The service expects those messages to comply with their corresponding schema to
effectively read and transform them.

### Input Message

JSON schema of the **key**:

```json
{
    "type": "object"
}
```

JSON schema of the **payload**:

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

:::info

Tombstone events, that are events whose payload is empty (zero bytes), are ignored
when are read by the service.

:::

### Output Message

JSON schema of the **key**:

```json
{
    "type": "object"
}
```

JSON schema of the **payload**:

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

:::info

When a `DELETE` event is generated on the output stream, a corresponding tombstone event
is produced, to help Kafka cleaning up the topic.

Tombstone events, that are events whose payload is empty (zero bytes), are ignored
when are read by the service.

:::

:::note

Output messages are compliant with [Fast Data message format](/products/fast_data/fast_data_engine_v2/concepts.mdx#fast-data-message-format).

:::

## Persistence

As explained in the [Configuration page](/products/fast_data/fast_data_engine_v2/farm_data/20_Configuration.mdx), Farm Data service
processes events using a stateful model and therefore it needs to store intermediate
results on persistent storage system.  
Currently, Farm Data supports only MongoDB as external persistence system. 

### MongoDB Persistence

When using MongoDB as persistence storage, Farm Data service needs the details
for connecting to a MongoDB cluster, which allows the service to create the
needed collections and store there the intermediate aggregated documents.

In fact, the service creates on the selected database a collection for each
aggregation node (processing unit), which will store the intermediate results.  
These collections are named following the pattern below:

```text
__sink_<aggregation_id>_<aggregation_node_name>
```

where:

- `__sink` is a constant prefix to signal that the collection is used internally;
- `<aggregation_id>` is the value of configuration field `id` that identifies the
  specific aggregation process that is employing such collection.  
  Please, beware that this identifier MUST be between 8 and 16 characters and it
  should satisfy MongoDB [collection name restrictions](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Restriction-on-Collection-Names);
- `<aggregation_node_name>` is the name of a node in the aggregation graph;

To support read/write operations over `__sink` collections, each of them should have
the indexes defined:

- a **unique** index supporting the internal primary key of the record
    ```json
    {
      "__pk": 1
    }
    ```
- an index for each `value` property of the current aggregation node, which
  is employed for lookup operations by children nodes (in the aggregation graph).  
  For example:
    ```json
    {
      "value.userId": 1
    }
    ```
- an index for each `dependency.*.__pk` property of the current aggregation node, which
  is employed for lookup operations by current towards children nodes
  (in the aggregation graph).  
  For example:
    ```json
    {
      "dependency.posts.__pk": 1
    }
    ```

### Indexer CLI

To aid in the creation of `__sink` collections alongside their indexes, the
`the_world_outside` CLI is provided. It reads a Farm Data configuration file,
connects to the defined persistence storage and generate the needed collections
and their indexes. When generating indexes, it accounts also for complex filters,
so that lookup queries are correctly supported.

Secrets resolution is handled automatically. The secret just need to be reachable
from the CLI, either from an environmental variable or from a file.

The CLI can be installed using the following command:

```shell
npm install -g @mia-platform-internal/the-world-outside
```

and launched as show below:

```shell
two indexer -c <path-to-config-folder>
```

In the `-c` argument it is necessary to give the path to a directory folder which
holds the Farm Data configuration file (either named `farm-data.json` or `config.json`).

:::warning

In order to use `two` CLI it is necessary to own a Mia-Platform subscription and
have access to the private repository.

Furthermore, since the CLI directly connects to your MongoDB cluster, please ensure that
you can connect to it from your machine.

:::

## Aggregation Graph

The aggregation graph is a [Direct Acyclic Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
that describes how streams are connected among them and how they should be merged
together into a single one.  
Each node represents a stream that participates in the aggregation process, while
edges describe how events of two linked streams are merged together.

## Nodes

Each node of the graph represents a stream that it is consumed by the Farm Data system.
It contains an identifier of the node, a two list of edges identifiers, one for those that enter into node and one for those that exit from the node.  
It is important to notice that each node identifier must reference one of the entry
under the `consumers` property that can be found in the top level of the configuration
file, so that execution logic can be associated to the appropriate stream.

Furthermore, there must exist at least one node that does not have any ingoing edge.
These type of nodes are called `HEAD` and constitute the base, which are the starting
points to aggregate the different streams together.

Below is show and example of node definition, which in this case is also a `HEAD` since
only outgoing edges are associated with it:

```json
{
  "id": "users",
  "edges": {
    "in": [],
    "out": [
      "users->posts"
    ]
  }
}
```

## Edges

An edge of the graph establishes a directed link between two streams and defines the
rules for combining their records into a single stream. It owns two properties,
which are its identifier, necessary to reference it within node `edges` property,
and a filter for restricting how stream events are merged.

When no filter is provided, the cartesian product of all the streams events will be
produced. This is discouraged since it may lead to a very large number of dependencies
retrieved for a node.
Consequently, it is highly recommended to instantiate a filter for each edge,
potentially using fields that uniquely identify each record.

A filter is an expression written using an ad-hoc syntax that support different type of
operations. For more details on them, please read the dedicated [section](#filters).

In the example below, `users` stream is joined with `posts` stream, ensuring that
`posts.userId` is equal to `users.id`:

```json
 {
  "id": "users->posts",
  "filter": {
    "$eq": [
      {
        "foreign": [
          "userId"
        ]
      },
      {
        "local": [
          "id"
        ]
      }
    ]
  }
}
```

:::note

An edge identifier can get any value as long as it is unique with respect to other edges.
In the examples found in these pages, edges identifiers represent the link between two
nodes, which helps in understanding where it is employed in the graph.

:::

### Filters

A filter is composed of one or more rules that restricts how stream events are linked
between a parent stream (`local`) and the children one (`foreign`). In particular,
each rule can either match between fields of the two events, identified by a
_field path_, or between one of `local` or `foreign` field and a constant value, such as:

- `string`
- `number`
- `boolean`
- `null`
- `an array of primitive types` (when using `$in`/`$contains`/`$nin`/`$contains` operators)

In the next sections are described which operators are allowed and the semantic of a filter.

#### Logical Operations

- `$and` &rarr; both sub-filters must be valid to include the result
- `$or` &rarr; only one of the sub-filters must be valid to include the result
- `$nor` &rarr; negates the validity of the inner filter

#### Comparison Operator

- `$eq` &rarr; equal
- `$ne` &rarr; not equal
- `$gt` &rarr; greater than
- `$gte` &rarr; greater than or equal
- `$lt` &rarr; lower than
- `$lte` &rarr; lower than or equal

#### Additional Operators

- `$in` &rarr; a single value in a list of values (when array value is the `foreign` field)
- `$nin` &rarr; a single value is not in a list of values (when array value is the `foreign` field)
- `$contains` &rarr; a list of values contains a single value (when array value is the `local` field)
- `$ncontains` &rarr; a list of values does not contain a single value (when array value is the `local` field)
- `$isArray` &rarr; whether the value is an array
- `$regex` &rarr; match regular expression

#### Semantic

Knowing how to read a filter is important since it would help you in better
understanding how each node is linked with the others. Below is explained how.

Given a generic filter representation:

```json
{
  "<operator>": [
    {
      // this field belongs to the target/child node
      "foreign": <field_path>
    },
    {
      // this field belongs to the source/parent node
      "local": <field_path>
    }
  ]
}
```

The filter should be read as:

```
local.<field_path> <operator> foreign.<field_path>
```

#### Examples

The following examples depict the relationships that can be created between
two aggregation nodes, the source (parent) named `A` and the target (child)
named `B`.

**Simple**

```json
{
  "id": "A->B",
  "filter": {
    "$eq": [
      {
        "foreign": [
          "idOfA"     // this field belongs to B
        ]
      },
      {
        "local": [
          "idOfA"     // this field belongs to A
        ]
      }
    ]
  }
}
```

This filter can be read as

- `local.idOfA $eq foreign.idOfA`

**With multiple fields**

```json
{
  "id": "A->B",
  "filter": {
    "$and": [
      {
        "$eq": [
          {
            "foreign": [
              "idOfA"     // this field belongs to B
            ]
          },
          {
            "local": [
              "idOfA"     // this field belongs to A
            ]
          }
        ]
      },
      {
        "$gt": [
          {
            "foreign": [
              "fieldOfB"  // this field belongs to B
            ]
          },
          {
            "local": [
              "fieldOfA"  // this field belongs to A
            ]
          }
        ]
      }
    ]
  }
}
```

**Match against a constant value**

```json
{
  "id": "A->B",
  "filter": {
    "$and": [
      {
        "$eq": [
          {
            "foreign": [
              "idOfA"     // this field belongs to B
            ]
          },
          {
            "local": [
              "idOfA"     // this field belongs to A
            ]
          }
        ]
      },
      {
        "$ne": [
          {
            "foreign": [
              "orderStatus"  // this field belongs to B
            ]
          },
          "DELIVERED"        // constant value
        ]
      }
    ]
  }
}
```

**Match against a nested field**

```json
{
  "id": "A->B",
  "filter": {
    "$eq": [
      {
        "foreign": [
          "parentField",
          "nestedField"     // this field belongs to B
        ]
      },
      {
        "local": [
          "idOfA"     // this field belongs to A
        ]
      }
    ]
  }
}
```

## Output Modes

Farm Data supports different output modes that control how the service generates output events from HEAD aggregation units. The output mode is configured in the processor configuration and determines the format and content of messages produced to the output topic.

### Available Output Modes

#### 1. Read-Delete Mode (Default)

**Configuration**: `"read-delete"`

This is the default output mode that optimizes payload size by transforming Farm Data create/update operations into read operations.

**Characteristics**:
- The `before` field is never set in the output payload
- All create (`c`) and update (`u`) operations are transformed into read (`r`) operations
- Delete operations (`d`) maintain their original format
- Reduces output payload size compared to operation-forwarding mode

**Use Case**: Ideal for scenarios where you only need the current state of records and do not require change tracking information.

**Example Output**:
```json
{
  "op": "r",
  "before": null,
  "after": {
    "userId": "user123",
    "name": "John Doe",
    "email": "updated@example.com"
  }
}
```

#### 2. Operation-Forwarding Mode

**Configuration**: `"operation-forwarding"`

This mode preserves the original Farm Data operations occurring on HEAD units while transforming operations on internal nodes into updates.

**Characteristics**:
- HEAD unit operations (create, update, delete) are forwarded with their original operation type
- Internal node operations are produced as update operations
- Both `before` and `after` properties are set according to the original Farm Data operation
- Maintains full change tracking information

**Use Case**: Best for scenarios requiring complete audit trails and change tracking capabilities.

**Example Output for Create**:
```json
{
  "op": "c",
  "before": null,
  "after": {
    "userId": "user123",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Example Output for Update**:
```json
{
  "op": "u",
  "before": {
    "userId": "user123",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "after": {
    "userId": "user123",
    "name": "John Doe",
    "email": "updated@example.com"
  }
}
```

#### 3. Key-Only Mode

**Configuration**: `"key-only"`

This mode provides maximum payload size optimization by sending only message keys without payloads.

**Characteristics**:
- Transforms create/update operations into read operations
- Does NOT send the payload data in the message
- Output messages contain only the message key
- Payloads can be retrieved via REST API using the message key
- Achieves maximum bandwidth efficiency (payload reduced to few bytes)

**Use Case**: Perfect for high-throughput scenarios where bandwidth is critical, and consumers can retrieve full payloads on-demand via the REST API.

**Example Output**:
```json
{
  "op": "r",
  "before": null,
  "after": null
}
```

**Payload Recovery**: 
When using key-only mode, consumers can retrieve the full payload using the Farm Data REST API:

```http request
GET /heads/{node}/items/{base64_encoded_key}
```

Where `{base64_encoded_key}` is the URL-safe, non-padded base64 UTF-8 string representation of the message key.

### Configuration Example

Output mode is configured in the processor section of the configuration file:

```json
{
  "processor": {
    "graph": { ... },
    "persistence": { ... },
    "internal_updates": { ... },
    "mode": "read-delete"
  }
}
```

### Performance Considerations

| Mode                   | Payload Size | Network Usage | API Dependency | Change Tracking |
|------------------------|--------------|---------------|----------------|-----------------|
| `operation-forwarding` | Largest      | Highest       | None           | Full            |
| `read-delete`          | Medium       | Medium        | None           | Minimal         |
| `key-only`             | Smallest     | Lowest        | Required       | Minimal         |

### Choosing the Right Output Mode

- **Use `operation-forwarding`** when:
  - You need complete change tracking and audit trails
  - Downstream consumers require `before` and `after` values
  - Network bandwidth is not a constraint

- **Use `read-delete`** when:
  - You only need current state information
  - Moderate payload size optimization is desired
  - No external API dependencies are acceptable

- **Use `key-only`** when:
  - Maximum throughput and minimal network usage are critical
  - You can implement REST API calls in consumer applications
  - Bandwidth costs are a significant concern
  - Not all messages need to be processed immediately (lazy loading pattern)
