---
id: component_mapping
title: Component Mapping v1 → v2
sidebar_label: Component Mapping
---

This page provides a detailed mapping of every Fast Data v1 artifact to its v2 equivalent, along with conversion rules for the most common configuration elements.

## Services

| v1 Service | v2 Replacement | Conversion Type |
|---|---|---|
| **Real-Time Updater** (RTU) | **Stream Processor** + **Kango** | Semi-automatic |
| **Projection Storer** (PS) | **Stream Processor** + **Kango** | Semi-automatic — PS is already closer to the v2 model |
| **Single View Trigger Generator** (SVTG) | Absorbed into **Farm Data** | Eliminated as standalone service |
| **Single View Creator** (SVC) — Low Code / automatic | **Farm Data** + **Kango** | Semi-automatic |
| **Single View Creator** (SVC) — custom template | **Farm Data** + post-aggregation **Stream Processor** + **Kango** | Manual — custom JS logic must be adapted |
| **Control Plane Operator** (gRPC) | **Control Plane** (Piper, REST/MongoDB) + **Control Plane Frontend** | Upgrade — different config model |

## ConfigMaps

| v1 ConfigMap | v2 Equivalent | Notes |
|---|---|---|
| `<service>-configuration/config.json` (PS/RTU) | Stream Processor `config.json` | Topic names, group IDs, connection details |
| `fast-data-ps-cast-functions/` | Stream Processor `index.js` | Cast function JS bodies are reusable |
| `customers-erschema/erSchema.json` | Farm Data `config.json` → `processor.graph` | Algorithmic conversion — see [ER Schema → Farm Data Graph](#er-schema--farm-data-graph) |
| `customers-aggregation/aggregation.json` | Post-aggregation Stream Processor `index.js` | Manual conversion — see [Aggregation Logic](#aggregation-logic-svc--post-aggregation-sp) |
| `customers-configuration/singleViewKey.json` | Farm Data consumer key (`head` node in graph) | The projection with no incoming edges is the root |
| `event-store-config/eventStoreConfig.json` | Removed — Farm Data handles this internally | Not needed |
| `projectionChangesSchema.json` | Removed | Farm Data graph replaces this routing logic — including any [Strategies](/products/fast_data/configuration/strategies.md) referenced via `__fromFile__`, whose "which Single View does this change affect" logic is now implicit in the graph topology |
| `kafkaProjectionUpdates.json` | Removed | pr-update topics are no longer generated — review for custom [Strategies](/products/fast_data/configuration/strategies.md) (`MANUAL_STRATEGIES_FOLDER`) before deleting, especially the `type`-based routing used for [parallel SVC](/products/fast_data/faq/parallel_svc.md), which has no direct v2 equivalent |
| `control-plane-config/config.json` (gRPC settings) | Removed | Control Plane v2 uses a different connection model |
| `operator-configuration/configuration.json` | Removed | Control Plane v2 does not use the operator pattern |

## Kafka Topics

| v1 Topic | v2 Equivalent | Notes |
|---|---|---|
| `<ingestion-topic>` (CDC input) | **Unchanged** | Stream Processors consume the same ingestion topics |
| `<pr-update-topic>` (Projection Changes) | **Eliminated** | Not generated or consumed in v2 |
| `<svtg-trigger-topic>` (SV trigger) | **Eliminated** | Farm Data manages its own internal state |
| *(none)* | `<projection>.pre` | New: output of Stream Processor, input to Kango and Farm Data. This event is already normalized but not yet stored to MongoDB. Functionally analogous to the old `pr-update-topic`, but produced *before* storage ("pre-persistence") rather than after |
| *(none)* | `<single-view>.aggregated` | New: raw aggregation output from Farm Data |
| *(none)* | `<single-view>.internal-updates` | New: Farm Data internal coordination topic |
| *(none)* | `<single-view>.product` | New: output of post-aggregation SP, input to Kango |

### Recommended Topic Naming Convention

These suffixes (`.pre`, `.aggregated`, `.internal-updates`, `.product`) are **naming conventions**, not enforced by the product. You can use any topic name as long as the `config.json` of each service is configured consistently.

```
<namespace>.<projection>.pre            # normalized event, pre-persistence
<namespace>.<single-view>.aggregated    # raw Farm Data output
<namespace>.<single-view>.internal-updates
<namespace>.<single-view>.product       # final Single View (after optional post-processing)
```

## Environment Variables

### Retained (no change needed)

| v1 Env Var | Used in v2 |
|---|---|
| `KAFKA_BROKERS` | All services |
| `KAFKA_SASL_USERNAME`, `KAFKA_SASL_PASSWORD` | All services |
| `MONGODB_URL`, `MONGODB_NAME` | Kango, Farm Data |
| `FAST_DATA_PR_*_INGESTION_TOPIC` | Stream Processor consumer topics (unchanged) |
| `LOG_LEVEL` | All services |

:::tip Consider upgrading Kafka/MongoDB credentials to file-based secret resolution
"Retained" here means the same **variable interpolation** pattern (`{{KAFKA_BROKERS}}`, etc.) keeps working in v2 unchanged — it does not mean it's the best option available. Since every Kafka/Mongo connection block in Stream Processor, Kango, and Farm Data is being rewritten anyway during migration, it's a natural point to switch these credentials to [file-based secret resolution](/products/fast_data_v2/secrets_resolution.md#file-reference) instead, reading them from a mounted Console Secret rather than a plain-text environment variable.
:::

### Deprecated

:::tip Reduced configuration complexity in v2
One of the practical benefits of Fast Data v2 is a significantly smaller environment variable footprint.  
In v1, every service required its own set of client IDs, group IDs, and topic references — resulting in dozens of env vars spread across the project.  
In v2, all Kafka connection parameters (client IDs, group IDs, topic names) live in each service's `config.json` ConfigMap, and the env vars are reduced to a small shared set (`KAFKA_BROKERS`, `KAFKA_SASL_*`, `MONGODB_URL`, etc.).  
This reduces configuration time and the risk of misconfiguration.
:::

| v1 Env Var | Reason |
|---|---|
| `FAST_DATA_KAFKA_*_PS_CLIENT_ID/GROUP_ID` | Moved into Stream Processor `config.json` |
| `FAST_DATA_KAFKA_*_SVC_CLIENT_ID/GROUP_ID` | Moved into Farm Data `config.json` |
| `FAST_DATA_KAFKA_*_SVTG_CLIENT_ID/GROUP_ID` | SVTG is eliminated |
| `FAST_DATA_KAFKA_SV_*_TRIGGER_TOPIC` | Farm Data manages triggers internally |
| `FAST_DATA_PR_*_PR_UPDATE_TOPIC` | pr-update topics are eliminated |
| `CONTROL_PLANE_URL` | Control Plane v2 does not use an operator URL |
| `CONTROL_PLANE_CONFIG_PATH`, `CONTROL_PLANE_BINDINGS_PATH` | Removed from all services |

## Endpoints

Console [endpoints](/products/console/handbooks/endpoints.mdx) of type **Fast Data Projection** or **Fast Data Single View** hook a route directly to a v1 Projection or Single View. Neither endpoint type applies to v2: Projected Tables and Single Views are just MongoDB collections written by Kango, so they are exposed the same way any other collection is.

| v1 Endpoint type | v2 Equivalent |
|---|---|
| **Fast Data Projection** | `custom` endpoint routed to `crud-service`, using the same `basePath` |
| **Fast Data Single View** | `custom` endpoint routed to `crud-service`, using the same `basePath` |

**Conversion:** for each endpoint of one of these two types, set `type` to `custom`, `service` to `crud-service`, `port` to `80`, and `pathRewrite` to the endpoint's previous internal path. The public-facing `basePath` does not need to change.

---

## Conversion Rules

### Cast Functions → Stream Processor

In v1, cast functions were registered globally and applied field-by-field in the PS/RTU configuration (`fieldsMapping`). In v2, the same transformation logic lives in the Stream Processor's `index.js` sandbox.

**v1 — `fieldsMapping` excerpt (PS `config.json`):**

```json
"pr_orders": {
  "fieldsMapping": {
    "ID_ORDER": { "targetField": "ID_ORDER", "castFunction": "castToString" },
    "DATE":     { "targetField": "DATE",     "castFunction": "castToDate" },
    "STARS":    { "targetField": "STARS",    "castFunction": "castToInteger" }
  }
}
```

**v2 — `transformFields()` in Stream Processor `index.js`:**

```javascript
function transformFields(record) {
  const r = stripDebeziumTypes(record) // unwrap debezium type wrappers
  return {
    ...r,
    DATE:  castToDate(r.DATE),
    STARS: castToInteger(r.STARS),
    // all other fields are already strings — no explicit cast needed
  }
}

function castToString(v)  { return v == null ? v : String(v) }
function castToInteger(v) { if (v == null) return v; const n = parseInt(v, 10); return isNaN(n) ? null : n }
function castToFloat(v)   { if (v == null) return v; const n = parseFloat(v); return isNaN(n) ? null : n }
function castToDate(v)    {
  if (v == null) return v
  const d = new Date(typeof v === 'number' ? v : v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}
```

Custom cast functions defined in v1 can be ported verbatim as named JS functions within `index.js`.

:::tip Debezium type unwrapping
When Debezium captures a database change event, it serializes field values in **Kafka Connect schema format**: each value is wrapped in a single-key object where the key is the type descriptor.

For example, a record coming from Debezium looks like this on the `.ingestion` topic:

```json
{
  "ID_ORDER":    { "string":  "12345" },
  "DATE":        { "string":  "2023-01-15T10:00:00Z" },
  "TOTAL_PRICE": { "float64": 29.99 },
  "IS_ACTIVE":   { "boolean": true }
}
```

Before applying any cast function, the Stream Processor must unwrap these type wrappers to get plain values. The `stripDebeziumTypes` helper does exactly that — it is called inside `transformFields` before any cast is applied:

```javascript
// Place these helpers at the bottom of index.js
function stripDebeziumTypes(record) {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, unwrap(v)])
  )
}

function unwrap(v) {
  if (v === null || v === undefined) return v
  // if it's a single-key object { "<type>": <value> }, extract the value
  if (typeof v === 'object' && !Array.isArray(v)) {
    const entries = Object.entries(v)
    if (entries.length === 1) return entries[0][1]
  }
  return v  // already a plain value
}
```

After `stripDebeziumTypes`, the record becomes:

```json
{
  "ID_ORDER":    "12345",
  "DATE":        "2023-01-15T10:00:00Z",
  "TOTAL_PRICE": 29.99,
  "IS_ACTIVE":   true
}
```

Only use `stripDebeziumTypes` if the source adapter is `debezium`. Other adapters (e.g., `golden-gate`) may already produce plain field values.
:::

---

### ER Schema → Farm Data Graph

The v1 ER Schema (`erSchema.json`) defines relationships between projections using `outgoing` edges with `conditions` and `oneToMany` flags. These map directly to a Farm Data `graph` configuration.

#### Conversion Rules

| v1 ER Schema concept | v2 Farm Data Graph |
|---|---|
| Each key in `config` | A node in `nodes[]` |
| `outgoing` relationship | A directed edge in `edges[]` |
| `condition: { "FIELD_A": "FIELD_B" }` | `filter.$eq: [{ "foreign": ["FIELD_A"] }, { "local": ["FIELD_B"] }]` |
| Multiple condition pairs | `filter.$and: [...]` with one `$eq` per pair |
| Projection with no incoming edges | **HEAD node** (root of the aggregation, `edges.in: []`) |
| `oneToMany: true` | The relationship is 1:N — the current projection is the parent |
| `oneToMany: false` | The relationship is 1:1 or N:1 — the current projection is the child |

#### Example

**v1 ER Schema (`erSchema.json`):**

```json
{
  "config": {
    "pr_customer": {
      "outgoing": {
        "pr_orders": {
          "conditions": {
            "pr_customer__to__pr_orders_0": {
              "condition": { "ID_USER": "ID_USER" },
              "oneToMany": true
            }
          }
        },
        "pr_reviews": {
          "conditions": {
            "pr_customer__to__pr_reviews_0": {
              "condition": { "ID_USER": "ID_USER" },
              "oneToMany": true
            }
          }
        }
      }
    },
    "pr_orders": {
      "outgoing": {
        "pr_customer": {
          "conditions": {
            "pr_orders__to__pr_customer_0": {
              "condition": { "ID_USER": "ID_USER" },
              "oneToMany": false
            }
          }
        }
      }
    }
  }
}
```

**v2 Farm Data Graph (derived algorithmically):**

```json
{
  "nodes": [
    {
      "id": "pr_customer",
      "edges": { "in": [], "out": ["pr_customer->pr_orders", "pr_customer->pr_reviews"] }
    },
    {
      "id": "pr_orders",
      "edges": { "in": ["pr_customer->pr_orders"], "out": [] }
    },
    {
      "id": "pr_reviews",
      "edges": { "in": ["pr_customer->pr_reviews"], "out": [] }
    }
  ],
  "edges": [
    {
      "id": "pr_customer->pr_orders",
      "filter": { "$eq": [{ "foreign": ["ID_USER"] }, { "local": ["ID_USER"] }] }
    },
    {
      "id": "pr_customer->pr_reviews",
      "filter": { "$eq": [{ "foreign": ["ID_USER"] }, { "local": ["ID_USER"] }] }
    }
  ]
}
```

:::note Head node identification
The HEAD node (aggregation root) is the projection that appears as the source of `oneToMany: true` relationships and has **no incoming edges** from other projections when the full graph is built. Practically, it is the projection whose primary key is used as the Single View identifier. In v1, this is also the projection referenced as root in `projectionChangesSchema.json`.
:::

#### Farm Data fed by another Single View

The conversion rules above assume every node in the graph is a raw Projection. In more advanced v1 setups, a Single View can instead depend on **another Single View's already-aggregated output** — for example, a `sv_customers` view that embeds data produced by an independent `sv_region` pipeline. This is a common real-world pattern, not an edge case: it shows up whenever one business entity's Single View is defined partly in terms of another entity's Single View, rather than only in terms of raw Systems of Record.

Farm Data itself does not distinguish between the two cases — a `consumers.config` entry is just "a Kafka topic to join in", regardless of what produced it. What changes is which topic that node's consumer subscribes to:

| Node identified in the ER Schema / `erSchema.json` | Consumer `topic` in the Farm Data `config.json` |
|---|---|
| A raw Projection | `<namespace>.<projection-name>.pre` (Stream Processor output) |
| Another Single View, with a post-aggregation SP | `<namespace>.<other-single-view-name>.product` |
| Another Single View, without a post-aggregation SP | `<namespace>.<other-single-view-name>.aggregated` |

To tell the two apart while inventorying a Single View's dependencies, check the node's name against your list of **Single Views**, not only against your list of Projections. Since this introduces a dependency between two Single Views' pipelines, the one being depended upon must be deployed and validated first — see the [deployment ordering note in Migration Steps](/products/fast_data_v2/migration/migration_steps#step-10--incremental-deploy-and-validation).

---

### Aggregation Logic (SVC → Post-aggregation SP)

In v1, the `aggregation.json` ConfigMap defined field mappings and join dependencies for the Single View Creator (the "Low Code" / "automatic" mode). Farm Data v2 produces a **raw aggregated message** where each projection's fields are grouped by projection name. To reproduce the same Single View schema consumed by downstream applications (e.g., CRUD Service), a post-aggregation Stream Processor applies the field remapping.

**v1 `aggregation.json` excerpt:**

```json
{
  "version": "1.3.0",
  "config": {
    "SV_CONFIG": {
      "dependencies": {
        "pr_customer": { "type": "projection" }
      },
      "mapping": {
        "idCustomer": "pr_customer.ID_USER",
        "name":       "pr_customer.NAME",
        "orders":     "PR_CUSTOMER_TO_PR_ORDERS"
      }
    },
    "PR_CUSTOMER_TO_PR_ORDERS": {
      "joinDependency": "pr_orders",
      "dependencies": {
        "pr_orders": { "on": "pr_customer__to__pr_orders_0", "type": "projection" }
      },
      "mapping": {
        "id":        "pr_orders.ID_ORDER",
        "orderDate": "pr_orders.DATE"
      }
    }
  }
}
```

**v2 post-aggregation Stream Processor `index.js` equivalent:**

```javascript
export default function process({ key, payload }) {
  if (!payload) return [{ key, payload: null }]
  if (payload.op === 'd') return [{ key, payload }]

  const after = payload.after
  if (!after) return []

  const pr_customer = after.pr_customer ?? {}

  const sv = {
    idCustomer: pr_customer.ID_USER,
    name:       pr_customer.NAME,
    orders: (after.pr_orders ?? []).map(o => ({
      id:        o.ID_ORDER,
      orderDate: o.DATE,
    })),
  }

  return [{ key, payload: { ...payload, after: sv } }]
}
```

:::tip When is the post-aggregation SP optional?
The post-aggregation SP can technically be skipped if downstream consumers (CRUD Service, APIs) are designed to work directly with the raw Farm Data output — a structure where fields are in UPPERCASE and nested by projection name (e.g., `after.pr_customer.NAME` instead of `after.name`).

**In practice, when migrating from v1, the post-aggregation SP is almost always required.** Existing applications are built against the Single View schema defined in `aggregation.json`, and changing that schema would break every consumer. Skipping the SP is only realistic for greenfield v2 projects where the SV schema can be designed around the raw Farm Data format from the start.
:::

#### Beyond the basic example: patterns found in real `aggregation.json` files

The example above shows one dependency per join block, cleanly nested. Non-trivial v1 projects frequently use three other patterns — all still convertible, but not by directly copying the shape of the basic example.

**Multiple dependencies in one join block.** A join block's `dependencies` map isn't always limited to the single projection referenced by its own `joinDependency`; it can list several. In that case, treat every dependency in the block as its own node reachable from the anchor projection, and add a corresponding graph edge for each — not just for the one matching `joinDependency`.

```json
"SUBSCRIPTIONS": {
  "joinDependency": "pr_subscriptions",
  "dependencies": {
    "pr_subscriptions": { "type": "projection", "on": "cust_to_subs" },
    "pr_addresses":     { "type": "projection", "on": "subs_to_addr" }
  },
  "mapping": { "id": "pr_subscriptions.ID" }
}
```
Here `pr_addresses` also needs a graph edge from the anchor projection, even though only `pr_subscriptions` is named as the `joinDependency` and referenced in `mapping`.

**Sibling dependencies referenced by dot-notation, without their own join block.** A `mapping` field can reference a dependency declared directly alongside the anchor (e.g., another entry under the same `SV_CONFIG.dependencies` map) using plain `depName.field` notation, with no nested join block of its own:

```json
"SV_CONFIG": {
  "dependencies": {
    "pr_customer": { "type": "projection", "on": "_identifier" },
    "pr_orders":   { "type": "projection", "on": "pr_customer__to__pr_orders_0" }
  },
  "mapping": {
    "idCustomer":  "pr_customer.ID_USER",
    "lastOrderId": "pr_orders.ID_ORDER"
  }
}
```
`pr_orders` here is a full sibling dependency of `pr_customer`, not a nested field of it — it still needs its own graph edge using the join condition named in its `on` value, resolved the same way as any other `outgoing` relationship in the ER Schema.

**`aliasOf`.** A dependency can alias another projection under a different local name within one join block:

```json
"PENDING_ORDER": {
  "joinDependency": "PENDING_ORDER_ALIAS",
  "dependencies": {
    "PENDING_ORDER_ALIAS": { "type": "projection", "on": "cust_to_pending", "aliasOf": "pr_orders" }
  },
  "mapping": { "id": "PENDING_ORDER_ALIAS.ID" }
}
```
The graph node to create is the **real, aliased projection** (`pr_orders` here), not the alias name (`PENDING_ORDER_ALIAS`). This pattern typically shows up when a Single View needs to join the same projection twice under different conditions (e.g., a customer's "last order" and "pending order") — Farm Data graphs don't support joining the same projection twice under one node, so each aliased use needs to be modeled and reviewed by hand rather than mechanically converted.

---

## Control Plane v1 → v2

:::note Cross-namespace scope change
In v1, a single Control Plane frontend instance could monitor and control Fast Data services **across all namespaces** in a cluster. In v2, the `control-plane-frontend` is **namespace-scoped**: each namespace requires its own Control Plane instance. Cross-namespace management is planned for a future v2 release.
:::

| v1 | v2 |
|---|---|
| `fast-data-control-plane-operator` service | `control-plane` service (Piper backend) |
| Frontend — cross-namespace management | `control-plane-frontend` service (namespace-scoped) |
| gRPC-based state/feedback | REST API, MongoDB-backed |
| `control-plane-config` ConfigMap on each service | No per-service ConfigMap — services register themselves |
| `bindings.json` per service | Removed |

**Remove from all v2 services:**
- Env vars: `CONTROL_PLANE_CONFIG_PATH`, `CONTROL_PLANE_BINDINGS_PATH`
- ConfigMaps: `control-plane-config`, `fast-data-*-bindings`

For the `controlPlane` block to add to each Fast Data workload's `config.json` (Stream Processor, Farm Data, Kango), see [Workloads Configuration](../runtime_management/application_configuration#workloads-configuration).
