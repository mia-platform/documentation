---
id: basic-pipeline
title: Build a Basic Fast Data v2 Pipeline
sidebar_label: Basic Pipeline Tutorial
---

This tutorial guides you through building a complete end-to-end Fast Data v2 pipeline.
You will ingest change events from two heterogeneous data sources — a **MongoDB** database
(captured via Mongezium) and a **PostgreSQL** database (captured via Debezium) — aggregate
them into a unified **Single View**, and persist the result to MongoDB using Kango.

## Business Scenario

You are building a **Customer Order View** for an e-commerce platform. The data lives in
two separate systems:

- A **MongoDB** database storing `customers` documents.
- A **PostgreSQL** database storing `orders` rows, each referencing a customer via a
  `customer_id` foreign key.

The goal is to produce a real-time `customer_order_view` collection in MongoDB, where each
document represents a customer enriched with the full list of their orders.

## Architecture Overview

The pipeline follows the
[Single View Data Product Architecture](/products/fast_data_v2/architecture.md#single-view-data-product-architecture)
pattern:

```
MongoDB (customers)                    PostgreSQL (orders)
       │                                      │
  [Mongezium]                           [Debezium]
       │                                      │
 customers.raw                        orders.debezium
       │                                      │
[Stream Processor]                   [Stream Processor]
  (sp-customers)                       (sp-orders)
       │                                      │
 customers.normalized              orders.normalized
       │                                      │
       └──────────────┬───────────────────────┘
                 [Farm Data]
                      │
          customer-orders.aggregated
                      │
             [Stream Processor]
               (sp-post-proc)
                      │
          customer-orders.product
                      │
                  [Kango]
                      │
          MongoDB: customer_order_view
```

### Data Flow Steps

1. **Mongezium** captures MongoDB `customers` collection changes and publishes them to the
   `customers.raw` Kafka topic in the [Fast Data message format](/products/fast_data_v2/concepts.mdx#fast-data-message-format).
2. **Debezium** captures PostgreSQL `orders` table changes and publishes them to the
   `orders.debezium` Kafka topic in Debezium's native envelope format.
3. Two **Stream Processor** instances normalize each stream:
   - `sp-customers` validates and maps `customers.raw` → `customers.normalized`
   - `sp-orders` converts the Debezium envelope to the Fast Data message format and maps
     `orders.debezium` → `orders.normalized`
4. **Farm Data** aggregates `customers.normalized` and `orders.normalized` using a DAG that
   joins orders to customers via `orders.customer_id == customers._id`, producing the raw
   Single View onto `customer-orders.aggregated`.
5. A post-processing **Stream Processor** (`sp-post-proc`) applies final business logic,
   formats the document, and produces `customer-orders.product`.
6. **Kango** reads `customer-orders.product` and persists each document to the
   `customer_order_view` MongoDB collection.

## Prerequisites

Before starting, make sure you have:

- A running **Kafka** cluster (Kafka topics listed below must be created in advance).
- A **MongoDB** cluster in replica-set mode (required by Mongezium and Farm Data).
- A **PostgreSQL** database with the `orders` table.
- A **Debezium Kafka Connect** connector already deployed and streaming PostgreSQL changes
  to the `orders.debezium` topic.

### Required Kafka Topics

Create the following topics before deploying the services:

| Topic name                      | Purpose                                         |
|---------------------------------|-------------------------------------------------|
| `customers.raw`                 | Mongezium output — raw customer changes         |
| `orders.debezium`               | Debezium output — raw order changes             |
| `customers.normalized`          | SP output — normalized customer events          |
| `orders.normalized`             | SP output — normalized order events             |
| `farm-internal-updates`         | Farm Data internal state coordination           |
| `customer-orders.aggregated`    | Farm Data output — raw Single View              |
| `customer-orders.product`       | Post-processing SP output — final Single View   |

## Step 1 — Configure Mongezium (MongoDB CDC)

Mongezium captures changes from the `customers` collection in your MongoDB database and
forwards them to Kafka already in the Fast Data message format, so no format conversion is
needed downstream for this source.

### Configuration file: `config.json`

```json
{
  "connections": {
    "mongodb-main": {
      "type": "mongodb",
      "config": {
        "url": "mongodb://mongo-host:27017/ecommerce?replicaSet=rs0",
        "appName": "mongezium-customers"
      }
    },
    "kafka-cluster": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "kafka-broker:9092"
      }
    }
  },
  "collections": [
    {
      "topic": "customers.raw",
      "namespace": "ecommerce.customers",
      "snapshot": "initial",
      "tombstone": false
    }
  ],
  "persistence": {
    "connectionName": "mongodb-main",
    "database": "ecommerce",
    "appName": "mongezium-customers"
  },
  "stream": {
    "consumer": {
      "connectionName": "kafka-cluster"
    },
    "producer": {
      "connectionName": "kafka-cluster"
    }
  }
}
```

Key settings:
- `namespace: "ecommerce.customers"` — the MongoDB database and collection to watch.
- `snapshot: "initial"` — performs a full initial snapshot when the service starts for
  the first time, ensuring historical data is included in the pipeline.
- The resume token is stored in Kafka topic headers, so the service can safely resume
  after a restart without re-reading the full collection.

## Step 2 — Configure Stream Processors (Normalization)

Each Stream Processor reads a raw CDC stream and produces a clean, Fast Data-compliant
stream. The processing logic is a JavaScript function loaded from the `processors/javascript/index.js`
file inside the configuration folder.

### 2a — `sp-customers`: Normalize MongoDB Customer Events

Mongezium already produces Fast Data-compliant messages, so the customer Stream Processor
only needs to perform light field validation and mapping (for example, renaming `_id` to
the expected Single View key `customerId`).

#### `config.json`

```json
{
  "connections": {
    "kafka-main": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "kafka-broker:9092"
      }
    }
  },
  "consumer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "customers.raw",
    "config": {
      "group.id": "sp-customers-group",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "32840",
      "queued.min.messages": "5000"
    }
  },
  "producer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "customers.normalized",
    "partitionerSettings": "all"
  },
  "processor": {
    "type": "javascript",
    "payloadSerdeStrategy": {
      "deserialize": "json"
    }
  }
}
```

#### `processors/javascript/index.js`

```javascript
// Forwarded as-is; only enrich metadata and normalize field names.
export default function process(message) {
  const { key, payload } = message;

  // Skip tombstone events
  if (!payload) return null;

  // Map MongoDB _id (stored in key as { $oid }) to a plain string
  const customerId =
    key && key.$oid ? key.$oid : JSON.stringify(key);

  const normalizedKey = { customerId };

  const normalizedPayload = { ...payload };

  if (normalizedPayload.after) {
    normalizedPayload.after = {
      ...normalizedPayload.after,
      customerId,
    };
  }
  if (normalizedPayload.before) {
    normalizedPayload.before = {
      ...normalizedPayload.before,
      customerId,
    };
  }

  return { key: normalizedKey, payload: normalizedPayload };
}
```

### 2b — `sp-orders`: Convert Debezium Events to Fast Data Format

Debezium wraps change events in its own envelope format. This Stream Processor converts it
to the Fast Data message format expected by downstream components.

A Debezium PostgreSQL event looks like:

```json
{
  "before": { "id": 42, "customer_id": "abc123", "amount": 99.0, "status": "pending" },
  "after":  { "id": 42, "customer_id": "abc123", "amount": 99.0, "status": "shipped" },
  "op": "u",
  "source": { "db": "ecommerce", "table": "orders", "ts_ms": 1717171717000 }
}
```

The Fast Data format uses the same `op`, `before`, and `after` structure, but requires the
record identifier to be set as the Kafka message **key** (an object), and the rest in the
**payload**.

#### `config.json`

```json
{
  "connections": {
    "kafka-main": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "kafka-broker:9092"
      }
    }
  },
  "consumer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "orders.debezium",
    "config": {
      "group.id": "sp-orders-group",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "32840",
      "queued.min.messages": "5000"
    }
  },
  "producer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "orders.normalized",
    "partitionerSettings": "all"
  },
  "processor": {
    "type": "javascript",
    "payloadSerdeStrategy": {
      "deserialize": "json"
    }
  }
}
```

#### `processors/javascript/index.js`

```javascript
// Convert Debezium envelope to Fast Data message format.
export default function process(message) {
  const { payload } = message;

  // Skip tombstone events
  if (!payload) return null;

  const { op, before, after, source } = payload;

  // Map Debezium op codes — they already match the Fast Data convention:
  // 'c' (create), 'u' (update), 'd' (delete), 'r' (read / snapshot)
  const fdOp = op;

  // Use the order id as the Fast Data message key
  const recordId = (after && after.id) || (before && before.id);
  if (recordId == null) return null;

  const fdKey = { orderId: String(recordId) };

  const fdPayload = {
    op: fdOp,
    before: before ?? null,
    after: after ?? null,
    source: {
      table: source?.table,
      ts_ms: source?.ts_ms,
    },
  };

  return { key: fdKey, payload: fdPayload };
}
```

:::note
Debezium uses the same single-letter operation codes (`c`, `u`, `d`, `r`) as the Fast Data
message format. However, the identifier is embedded inside the payload rather than being the
Kafka message key. The processor above extracts `id` from the `after` (or `before`) field
and promotes it to the message key, which is required by downstream Fast Data components.
:::

## Step 3 — Configure Farm Data (Aggregation)

Farm Data reads the two normalized Kafka streams and aggregates them into a Single View using
a Directed Acyclic Graph (DAG). In this scenario:

- `customers` is the **HEAD** node (the root of the aggregation).
- `orders` is a **child** node linked to `customers` via the `customer_id` field.

### `config.json`

```json
{
  "id": "custordview",
  "connections": {
    "kafka-main": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "kafka-broker:9092"
      }
    },
    "mongodb-state": {
      "type": "mongodb",
      "config": {
        "url": "mongodb://mongo-host:27017/farm-data-state",
        "database": "farm-data-state"
      }
    }
  },
  "consumers": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "config": {
      "customers": {
        "topic": "customers.normalized",
        "commitIntervalMs": 500,
        "config": {
          "group.id": "farm-data-group",
          "client.id": "farm-data-customers",
          "auto.offset.reset": "earliest",
          "queued.min.messages": "1000",
          "queued.max.messages.kbytes": "16384"
        }
      },
      "orders": {
        "topic": "orders.normalized",
        "commitIntervalMs": 500,
        "config": {
          "group.id": "farm-data-group",
          "client.id": "farm-data-orders",
          "auto.offset.reset": "earliest",
          "queued.min.messages": "1000",
          "queued.max.messages.kbytes": "16384"
        }
      }
    }
  },
  "producer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "customer-orders.aggregated",
    "config": {
      "client.id": "farm-data-producer"
    }
  },
  "processor": {
    "graph": {
      "nodes": [
        {
          "id": "customers",
          "edges": {
            "in": [],
            "out": ["customers->orders"]
          }
        },
        {
          "id": "orders",
          "edges": {
            "in": ["customers->orders"],
            "out": []
          }
        }
      ],
      "edges": [
        {
          "id": "customers->orders",
          "filter": {
            "$eq": [
              { "foreign": ["customer_id"] },
              { "local": ["customerId"] }
            ]
          }
        }
      ]
    },
    "persistence": {
      "type": "mongodb",
      "connectionName": "mongodb-state",
      "database": "farm-data-state"
    },
    "internalUpdates": {
      "type": "kafka",
      "connectionName": "kafka-main",
      "topic": "farm-internal-updates",
      "compressionWindowMs": 250,
      "consumer": {
        "group.id": "farm-data-group",
        "client.id": "farm-data-iu-consumer"
      }
    }
  }
}
```

Key points:

- **`id: "custordview"`**: the aggregation identifier (8–16 characters). Farm Data uses it
  to name its internal MongoDB state collections (`__sink_custordview_customers` and
  `__sink_custordview_orders`).
- **`nodes`**: `customers` has no incoming edges, making it the HEAD node. `orders` is a
  child node with one incoming edge from `customers`.
- **`edges`**: the `customers->orders` edge defines the join condition:
  `orders.customer_id` must equal `customers.customerId`.
- **`internalUpdates`**: a dedicated Kafka topic that Farm Data uses internally to propagate
  partial re-aggregation triggers when a related stream event arrives out-of-order.

## Step 4 — Configure Stream Processor (Post-Processing)

After aggregation, Farm Data emits a raw Single View document that contains all aggregated
fields. The post-processing Stream Processor shapes the document into its final structure
(for example, renaming fields, computing derived values, or filtering out internal metadata).

### `config.json`

```json
{
  "connections": {
    "kafka-main": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "kafka-broker:9092"
      }
    }
  },
  "consumer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "customer-orders.aggregated",
    "config": {
      "group.id": "sp-post-proc-group",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "32840",
      "queued.min.messages": "5000"
    }
  },
  "producer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "customer-orders.product",
    "partitionerSettings": "all"
  },
  "processor": {
    "type": "javascript",
    "payloadSerdeStrategy": {
      "deserialize": "json"
    }
  }
}
```

### `processors/javascript/index.js`

```javascript
// Shape the raw aggregated Single View into the final customer_order_view document.
export default function process(message) {
  const { key, payload } = message;

  if (!payload) return null;

  const { op, after, before } = payload;

  // For delete events forward as-is so that Kango removes the record
  if (op === 'd') {
    return { key, payload };
  }

  const raw = after || before;

  // Build the final Single View document shape
  const customerId = raw.customerId;
  const customerDoc = {
    customerId,
    fullName: `${raw.firstName ?? ''} ${raw.lastName ?? ''}`.trim(),
    email: raw.email,
    orders: (raw.orders ?? []).map((order) => ({
      orderId: order.orderId,
      amount: order.amount,
      status: order.status,
      placedAt: order.created_at,
    })),
    totalOrders: (raw.orders ?? []).length,
    totalSpent: (raw.orders ?? []).reduce(
      (sum, o) => sum + (o.amount ?? 0),
      0
    ),
    updatedAt: new Date().toISOString(),
  };

  return {
    key,
    payload: {
      op,
      before: before ? customerDoc : null,
      after: after ? customerDoc : null,
    },
  };
}
```

This processor:
- Computes `totalOrders` and `totalSpent` as derived fields from the orders list.
- Normalizes the `orders` array to include only the fields relevant to the view.
- Constructs a `fullName` from `firstName` and `lastName`.

## Step 5 — Configure Kango (Persistence)

Kango reads the final `customer-orders.product` topic and upserts each document into the
`customer_order_view` MongoDB collection. The message key (`{ customerId }`) is used as the
document unique identifier.

### `config.json`

```json
{
  "connections": {
    "kafka-main": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "kafka-broker:9092"
      }
    },
    "mongodb-main": {
      "type": "mongodb",
      "config": {
        "url": "mongodb://mongo-host:27017/ecommerce",
        "appName": "kango-customer-orders"
      }
    }
  },
  "consumer": {
    "type": "kafka",
    "connectionName": "kafka-main",
    "topic": "customer-orders.product",
    "config": {
      "group.id": "kango-consumer-group",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "32840",
      "queued.min.messages": "5000"
    }
  },
  "persistence": {
    "connectionName": "mongodb-main",
    "collection": "customer_order_view",
    "maxBatchSize": 500,
    "writeIntervalMs": 1000
  },
  "settings": {
    "writeMode": "strict"
  }
}
```

Key settings:
- **`collection: "customer_order_view"`**: the MongoDB collection where Single View
  documents are persisted.
- **`writeMode: "strict"`**: ensures the persisted document exactly mirrors the `after`
  payload — any fields not present in the event are removed. Use `partial` if you need
  partial updates (merge behavior).
- **`maxBatchSize`** and **`writeIntervalMs`**: control write throughput. Kango batches
  writes for efficiency; tune these values based on your expected event rate.

## Step 6 — MongoDB Index Setup

Farm Data requires indexes on its internal state collections to function correctly.
Create a unique index on the identifier field for each collection:

```js
// Run inside MongoDB shell or mongosh

// Farm Data internal state collections
db["__sink_custordview_customers"].createIndex({ customerId: 1 }, { unique: true });
db["__sink_custordview_orders"].createIndex({ orderId: 1 }, { unique: true });

// Final Single View collection — used by Kango
db["customer_order_view"].createIndex({ customerId: 1 }, { unique: true });
```

:::tip
The [Farm Data `indexer` CLI](/products/fast_data_v2/farm_data/30_Usage.md#requirements)
can automatically generate the recommended indexes by analyzing the aggregation graph.
Run it before the first deployment to save time:

```bash
the_world_outside indexer --config /path/to/farm-data/config.json
```
:::

## Deployment Summary

The table below summarizes each service, its input topic, output topic, and key
configuration file location:

| Service             | Input topic              | Output topic                 | Config folder                    |
|---------------------|--------------------------|------------------------------|----------------------------------|
| Mongezium           | —                        | `customers.raw`              | `/config/mongezium/`             |
| Debezium            | —                        | `orders.debezium`            | (external Kafka Connect)         |
| `sp-customers`      | `customers.raw`          | `customers.normalized`       | `/config/sp-customers/`          |
| `sp-orders`         | `orders.debezium`        | `orders.normalized`          | `/config/sp-orders/`             |
| Farm Data           | `customers.normalized`,  | `customer-orders.aggregated` | `/config/farm-data/`             |
|                     | `orders.normalized`      |                              |                                  |
| `sp-post-proc`      | `customer-orders.aggregated` | `customer-orders.product` | `/config/sp-post-proc/`         |
| Kango               | `customer-orders.product`| —                            | `/config/kango/`                 |

Each service reads its `config.json` (and optionally `processors/javascript/index.js` for
Stream Processor instances) from the folder specified by its `CONFIGURATION_FOLDER`
environment variable.

## Verifying the Pipeline

Once all services are running:

1. **Insert a customer** in the MongoDB `ecommerce.customers` collection:

   ```js
   db.customers.insertOne({
     _id: ObjectId("6660000000000000000000ab"),
     firstName: "Alice",
     lastName: "Smith",
     email: "alice@example.com"
   });
   ```

2. **Insert an order** in PostgreSQL:

   ```sql
   INSERT INTO orders (id, customer_id, amount, status, created_at)
   VALUES (1001, '6660000000000000000000ab', 49.99, 'pending', NOW());
   ```

3. **Check the Single View** in MongoDB after a few seconds:

   ```js
   db.customer_order_view.findOne({ customerId: "6660000000000000000000ab" });
   ```

   Expected result:

   ```json
   {
     "customerId": "6660000000000000000000ab",
     "fullName": "Alice Smith",
     "email": "alice@example.com",
     "orders": [
       {
         "orderId": "1001",
         "amount": 49.99,
         "status": "pending",
         "placedAt": "2026-06-08T..."
       }
     ],
     "totalOrders": 1,
     "totalSpent": 49.99,
     "updatedAt": "..."
   }
   ```

## Next Steps

- Explore [Runtime Management](/products/fast_data_v2/runtime_management/overview.md) to
  learn how to monitor and control the pipeline from the Control Plane UI.
- Review the [Best Practices](/products/fast_data_v2/best_practices/overview.md) section for
  production-readiness guidelines (resource tuning, Kafka partitioning, idempotency).
- Consider adding a [Dead Letter Queue (DLQ)](/products/fast_data_v2/stream_processor/20_Configuration.mdx)
  to each Stream Processor to handle unexpected message formats without stopping the
  pipeline.
- For more advanced aggregation patterns (multiple Farm Data instances, multi-source joins),
  see the [Advanced Multi-Source Pipeline Architecture](/products/fast_data_v2/architecture.md#advanced-multi-source-pipeline-architecture).
