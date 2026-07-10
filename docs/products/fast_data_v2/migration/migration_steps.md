---
id: migration_steps
title: Migration Steps
sidebar_label: Migration Steps
---

This page describes the generic procedure to migrate a Fast Data v1 project to v2. The steps apply regardless of the number of Systems of Record or Single Views in the project.

For a concrete application of these steps, see the [Worked Example](/products/fast_data_v2/migration/worked_example).

:::info Prerequisites
- You are familiar with [Fast Data v2 concepts](/products/fast_data_v2/concepts.mdx) and workloads
- You have access to your v1 project's `fastdata-config.json` and `api-console-config.json` (or equivalent Fast Data project export)
- You have admin access to your Kafka cluster to create new topics
:::

---

## Step 1 — Inventory the v1 Pipeline

Before writing any v2 configuration, produce a complete inventory of your current pipeline:

**From the Projection Storer / Real-Time Updater configurations, collect:**

| Item | Where to find it |
|---|---|
| List of Systems of Record | `settings.systemOfRecords` in each PS `config.json` |
| List of Projections per SoR | `projections` keys in each PS `config.json` |
| Primary keys per Projection | `primaryKeys` array per projection |
| Cast functions per field | `fieldsMapping[field].castFunction` per projection |
| Ingestion topic per Projection | `topics.ingestion.name` per projection |
| Source adapter type | `settings.dataSourceAdapter.type` (e.g., `debezium`, `golden-gate`) |

**From the Single View Creator configurations, collect:**

| Item | Where to find it |
|---|---|
| List of Single Views | `TYPE` env var or collection name in SVC |
| Single View root Projection | Root node in `erSchema.json` (the HEAD) |
| Join relationships | `erSchema.json` `outgoing` entries |
| **Projections used by this Single View** | All nodes reachable from the HEAD in `erSchema.json` via `outgoing` edges — this is the exact perimeter of the Farm Data DAG for this SV |
| Field mapping logic | `aggregation.json` (Low Code) or custom SVC code |
| Single View identifier field | `singleViewKey.json` |

:::tip ER Schema may be shared across multiple Single Views
In many v1 projects, a single `erSchema.json` describes all entity relationships globally, even when different SVCs use only a subset of those entities. As you inventory each Single View, explicitly map which projections it actually uses — not all projections in the ER schema. This subset is what goes into the corresponding Farm Data DAG. Projections present in the ER schema but not reachable from a given SV's HEAD node are **irrelevant** to that Farm Data instance.
:::

**Produce a summary table** like this for each Projection. This table is your working reference for the rest of the migration: each row corresponds to one Stream Processor + Kango pair to create in Steps 3–4, and the columns map directly to fields in `config.json` and `index.js`.

| SoR | Projection | PK fields | Ingestion topic | Cast functions (non-string) | Source adapter |
|---|---|---|---|---|---|
| `users` | `pr_customer` | `ID_USER` | `fd.users.pr-customer.ingestion` | — | debezium |
| `orders` | `pr_orders` | `ID_ORDER` | `fd.orders.pr-orders.ingestion` | `DATE→date`, `AMOUNT→float` | debezium |

:::note Cast functions column
In v1, every field declares a `castFunction` in `fieldsMapping`. The vast majority use `castToString`, which is the default and requires no explicit call in v2 — string values pass through unchanged via the `{ ...r }` spread in `transformFields`.

This column lists **only** the fields that need a non-string conversion (date, float, integer, boolean…), because those are the only ones that require an explicit cast call in `transformFields`. The notation `FIELD→type` maps directly to a cast helper: `DATE→date` becomes `castToDate(r.DATE)`, `AMOUNT→float` becomes `castToFloat(r.AMOUNT)`.
:::

:::tip Stream Processors and projection collections are not always required
Before designing your v2 topology, evaluate how much of the v1 infrastructure is actually necessary. Depending on the format of your ingestion events, two types of simplification are possible — and they can significantly reduce the number of topics, services, and infrastructure cost.

**Scenario A — Skip Stream Processors for some or all projections**

If ingestion topics already emit events in Fast Data v2 Message Format (no Debezium type unwrapping needed) and field-level casts are not required upstream — or can be safely deferred to the post-aggregation SP without affecting Farm Data's join conditions — you can skip the Stream Processor for those projections. Farm Data can consume the ingestion topic directly, without any intermediate `.pre` topic. This applies per-projection: you may end up with an SP only for a subset of projections, while the rest flow directly into Farm Data.

**Scenario B — Skip projection MongoDB collections (and their Kango services)**

In v1, every projection had to be persisted to MongoDB by the PS/RTU so the SVC could perform joins. In v2, Farm Data manages aggregation state internally. It is worth evaluating whether the intermediate MongoDB projection collections and their corresponding Kango services (Step 4) are still required, or whether Farm Data can build and maintain its state directly from the event stream. If they are not needed, you can remove an entire layer of services and topics from the pipeline.

**Key prerequisite for both scenarios:** Farm Data's join conditions operate on the raw values in the incoming events. If ingestion events contain Debezium-wrapped fields (e.g., `{ "string": "12345" }`) or any other format that Farm Data's graph engine cannot evaluate natively, normalization must happen upstream in a Stream Processor before events reach Farm Data.
:::

---

## Step 2 — Plan the v2 Topic Topology

For each Projection, you will need a new Kafka topic for the **Stream Processor output** — the projection event after normalization and type casting have already been applied, before it is persisted to MongoDB:

```
<namespace>.<projection-name>.pre
```

For each Single View, you will need three topics:

```
<namespace>.<single-view-name>.aggregated        # Farm Data output
<namespace>.<single-view-name>.internal-updates  # Farm Data internal state
<namespace>.<single-view-name>.product           # final output (only if post-aggregation SP is used)
```

Create these topics on your Kafka cluster **before deploying any v2 service**.

:::note Ingestion topics are unchanged
The CDC ingestion topics (already in use by v1 PS/RTU) do not change. Stream Processors will simply replace the v1 consumers on the same topics.
:::

---

## Step 3 — Create Stream Processors (one per Projection)

For each Projection in your inventory, create a new service of type **Stream Processor**.

### `config.json` template

```json
{
  "connections": {
    "kafka": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "{{KAFKA_BROKERS}}",
        "security.protocol": "SASL_SSL",
        "sasl.mechanism": "SCRAM-SHA-256",
        "sasl.username": "{{KAFKA_SASL_USERNAME}}",
        "sasl.password": "{{KAFKA_SASL_PASSWORD}}"
      }
    }
  },
  "consumer": {
    "type": "kafka",
    "topic": "<ingestion-topic>",
    "connectionName": "kafka",
    "config": {
      "client.id": "sp-<projection-name>-consumer",
      "group.id": "cg.sp.<projection-name>.pre",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "20480",
      "queued.min.messages": "2500"
    }
  },
  "producer": {
    "type": "kafka",
    "topic": "<namespace>.<projection-name>.pre",
    "connectionName": "kafka",
    "config": {
      "client.id": "sp-<projection-name>-producer",
      "compression.type": "snappy"
    }
  },
  "processor": {
    "type": "javascript"
  }
}
```

### `index.js` base template (debezium source adapter)

All projections sharing the same source adapter can share this base template. Only the `transformFields` function needs to be customized per projection.

```javascript
export default function process({ key, payload }) {
  // Tombstone message (hard delete)
  if (!payload) {
    return [
      { key, payload: { op: 'd', before: null, after: null } },
      { key, payload: null }
    ]
  }

  const op = mapDebeziumOp(payload.op)
  const after = payload.after ? transformFields(payload.after) : null
  const before = payload.before ?? null

  return [{
    key,
    payload: {
      op,
      before,
      after,
      source: payload.source ?? null,
      ts_ms: payload.ts_ms ?? Date.now()
    }
  }]
}

function mapDebeziumOp(op) {
  // Map debezium operation codes to Fast Data Message Format operations
  const map = { c: 'c', r: 'r', u: 'u', d: 'd', i: 'c' }
  return map[op?.toLowerCase()] ?? 'r'
}

/**
 * Apply cast functions and unwrap debezium type descriptors.
 * Customize this function for each projection.
 */
function transformFields(record) {
  const r = stripDebeziumTypes(record)
  return r
  // Example with type casts:
  // return { ...r, DATE_FIELD: castToDate(r.DATE_FIELD), AMOUNT: castToFloat(r.AMOUNT) }
}

// ── Debezium type unwrapping ─────────────────────────────────
function stripDebeziumTypes(record) {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, unwrap(v)])
  )
}

function unwrap(v) {
  if (v === null || v === undefined) return v
  if (typeof v === 'object' && !Array.isArray(v)) {
    const entries = Object.entries(v)
    if (entries.length === 1) return entries[0][1]
  }
  return v
}

// ── Cast helpers (mirror v1 cast functions) ─────────────────
function castToString(v)  { return v == null ? v : String(v) }
function castToInteger(v) { if (v == null) return v; const n = parseInt(v, 10); return isNaN(n) ? null : n }
function castToFloat(v)   { if (v == null) return v; const n = parseFloat(v); return isNaN(n) ? null : n }
function castToDate(v)    {
  if (v == null) return v
  const d = new Date(typeof v === 'number' ? v : v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}
```

:::tip Reusing custom cast functions from v1
If your v1 project had custom cast functions (non-default ones defined in your `fastdata-config.json`), their JavaScript body can be copied directly into `index.js` as named helper functions and called from `transformFields`.
:::

---

## Step 4 — Create Kango for Projected Tables (one per Projection)

For each Projection, create a **Kango** service that persists the normalized stream to MongoDB.

### `config.json` template

```json
{
  "connections": {
    "kafka": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "{{KAFKA_BROKERS}}",
        "security.protocol": "SASL_SSL",
        "sasl.mechanism": "SCRAM-SHA-256",
        "sasl.username": "{{KAFKA_SASL_USERNAME}}",
        "sasl.password": "{{KAFKA_SASL_PASSWORD}}"
      }
    },
    "mongo": {
      "type": "mongodb",
      "config": { "url": "{{MONGODB_URL}}" }
    }
  },
  "consumer": {
    "type": "kafka",
    "topic": "<namespace>.<projection-name>.pre",
    "connectionName": "kafka",
    "config": {
      "client.id": "ka-<projection-name>-consumer",
      "group.id": "cg.ka.<projection-name>",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "32840",
      "queued.min.messages": "5000"
    }
  },
  "persistence": {
    "connectionName": "mongo",
    "database": "{{MONGODB_NAME}}",
    "collection": "<mongodb-collection-name>",
    "primaryKey": ["<pk-field-1>", "<pk-field-2>"]
  }
}
```

| Config field | Value |
|---|---|
| `topic` | `<namespace>.<projection-name>.pre` (output of the corresponding SP) |
| `collection` | Same collection name used by v1 (no rename needed) |
| `primaryKey` | Fields from `primaryKeys` in the v1 PS config |

---

## Step 5 — Convert ER Schema to Farm Data Graph

:::warning One ER Schema → one Farm Data graph **per Single View**, not a global conversion
In a v1 project, a single `erSchema.json` may describe N entities shared across multiple SVCs. Do **not** convert the entire schema into a single Farm Data graph.

Each Farm Data instance manages exactly **one** Single View. Its `processor.graph` must include only the projections that contribute to that specific SV — the HEAD node and all nodes reachable from it via the join edges used by that SV.

Including projections that are not needed by the Single View causes Farm Data to subscribe to unnecessary Kafka topics, maintain irrelevant internal state, and waste resources.
:::

For each Single View that has an ER Schema, apply the conversion rules described in [Component Mapping — ER Schema → Farm Data Graph](/products/fast_data_v2/migration/component_mapping#er-schema--farm-data-graph).

The resulting graph is used in the Farm Data `config.json`.

**To identify the HEAD node:** it is the projection whose primary key equals the Single View identifier (from `singleViewKey.json`). In the ER Schema, it is typically the projection with the most `oneToMany: true` outgoing relationships and no `oneToMany: false` references pointing to an external projection.

---

## Step 6 — Create Farm Data (one per Single View)

For each Single View, create a **Farm Data** service.

### `config.json` template

```json
{
  "id": "<single-view-name>",
  "connections": {
    "kafka": {
      "type": "kafka",
      "config": {
        "bootstrap.servers": "{{KAFKA_BROKERS}}",
        "security.protocol": "SASL_SSL",
        "sasl.mechanism": "SCRAM-SHA-256",
        "sasl.username": "{{KAFKA_SASL_USERNAME}}",
        "sasl.password": "{{KAFKA_SASL_PASSWORD}}"
      }
    },
    "mongo": {
      "type": "mongodb",
      "config": { "url": "{{MONGODB_URL}}" }
    }
  },
  "consumers": {
    "type": "kafka",
    "config": {
      "<projection-1>": {
        "topic": "<namespace>.<projection-1>.pre",
        "connectionName": "kafka",
        "group.id": "cg.fd.<single-view-name>",
        "client.id": "fd-<single-view-name>-head",
        "auto.offset.reset": "earliest",
        "queued.max.messages.kbytes": "8192",
        "queued.min.messages": "500"
      },
      "<projection-2>": {
        "topic": "<namespace>.<projection-2>.pre",
        "connectionName": "kafka",
        "group.id": "cg.fd.<single-view-name>",
        "auto.offset.reset": "earliest",
        "queued.max.messages.kbytes": "8192",
        "queued.min.messages": "500"
      }
    }
  },
  "producer": {
    "connectionName": "kafka",
    "topic": "<namespace>.<single-view-name>.aggregated",
    "config": { "client.id": "fd-<single-view-name>-producer" }
  },
  "internalUpdates": {
    "type": "kafka",
    "topic": "<namespace>.<single-view-name>.internal-updates",
    "connectionName": "kafka"
  },
  "processor": {
    "graph": {
      "nodes": [ /* ... generated from ER Schema in Step 5 ... */ ],
      "edges": [ /* ... generated from ER Schema in Step 5 ... */ ]
    },
    "persistence": {
      "connectionName": "mongo",
      "database": "{{MONGODB_NAME}}"
    }
  }
}
```

:::note Consumer group.id
All consumers within the same Farm Data instance for a given Single View share the **same `group.id`**. Farm Data manages per-topic offsets internally. Use a unique group ID per Farm Data service (i.e., per Single View).
:::

---

## Step 7 — Create Post-Aggregation Stream Processor (optional)

:::info
**When migrating from v1, this step is almost always required.** Existing applications consume the Single View schema defined in `aggregation.json` — changing that schema would break every downstream consumer. Skipping this step is only realistic for greenfield v2 projects where the Single View schema can be designed from scratch around the raw Farm Data output.
:::

If the v1 Single View Creator performed field renaming or nested object construction (via `aggregation.json`), create an additional Stream Processor that reads from the `.aggregated` topic and remaps fields to reproduce the original Single View schema.

Refer to [Component Mapping — Aggregation Logic](/products/fast_data_v2/migration/component_mapping#aggregation-logic-svc--post-aggregation-sp) for the conversion approach.

:::note When can you skip this step?
Only if all downstream consumers (CRUD Service, APIs) can be updated to work directly with the raw Farm Data output — a structure where fields are UPPERCASE and nested by projection name (e.g., `after.pr_customer.NAME` instead of `after.name`). In that case, configure Kango to read directly from the `.aggregated` topic.
:::

---

## Step 8 — Create Kango for Single Views

Create a **Kango** service that persists the final Single View stream to MongoDB.

Use the same template as in [Step 4](#step-4--create-kango-for-projected-tables-one-per-projection), with these specifics:

| Config field | Value |
|---|---|
| `topic` | `<namespace>.<single-view>.product` (or `.aggregated` if no post-aggregation SP) |
| `collection` | Same Single View collection name used in v1 |
| `primaryKey` | The Single View identifier field (from `singleViewKey.json` in v1) |

---

## Step 9 — Upgrade Control Plane

Replace `fast-data-control-plane-operator` with the v2 Control Plane (Piper):

1. **Remove** the `fast-data-control-plane-operator` service
2. **Add** `control-plane` service (image: `nexus.mia-platform.eu/data-fabric/piper:latest-mongodb`)
3. **Add** `control-plane-frontend` service (image: `nexus.mia-platform.eu/data-fabric/piper-frontend:latest`)
4. **Add endpoints**: `/` → `control-plane-frontend`, `/api` → `control-plane`
5. **Configure** env vars: `MONGODB_URL`, `MONGODB_DATABASE_NAME`
6. **Remove** `CONTROL_PLANE_CONFIG_PATH`, `CONTROL_PLANE_BINDINGS_PATH` env vars and all related ConfigMaps from every service

See the [Control Plane Application Configuration](/products/fast_data_v2/runtime_management/application_configuration) documentation for the full Control Plane v2 configuration.

---

## Step 10 — Incremental Deploy and Validation

Operate v1 and v2 in parallel until validation is complete.

### Dealing with Initial Load

Before validating the migrated pipeline, ensure you have handled the initial load correctly. Refer to the [Initial Load & Full Refresh Operations](/products/fast_data_v2/best_practices/initial_load_full_refresh) best practices for the recommended approach.

### Recommended order

1. **Deploy SP + Kango for one projection** (start with the root/HEAD projection of your main Single View)
2. **Verify** the MongoDB collection is populated correctly — compare document count and a sample document against the v1 collection
3. **Deploy SP + Kango for remaining projections** of the same SoR
4. **Proceed to the next SoR**
5. **Deploy Farm Data + Kango for the Single View** once all input projections are validated
6. **Compare** `sv_<name>` v2 against v1 — count, sample documents, and field structure
7. **Deploy Control Plane v2**
8. **Decommission v1 services** (see Step 11)

:::warning Do not decommission v1 services until validation is complete
v1 PS/RTU and v2 SP+Kango can coexist on the same Kafka ingestion topic using different consumer group IDs. This allows you to run them in parallel and compare outputs before cutting over.
:::

---

## Step 11 — Decommission v1 Services

After full validation, remove the following v1 components:

**Services to delete:**
- All `*-realtime-updater` and `*-projection-storer` services
- All `*-single-view-trigger-generator` services
- All `*-single-view-creator` services
- `fast-data-control-plane-operator`

**ConfigMaps to delete:**
- `*-configuration/config.json` (PS/RTU configs)
- `fast-data-ps-cast-functions/`
- `*-erschema/erSchema.json`
- `*-aggregation/aggregation.json`
- `*-configuration/singleViewKey.json`
- `event-store-config/`
- `*-projection-changes-schema/`
- `*-kafka-projection-updates/`
- `control-plane-config/`
- `*-bindings/bindings.json`
- `operator-configuration/`

**Kafka topics to delete (optional, after retention period):**
- All `*-pr-update` topics
- All `*-svtg-trigger` topics

---

## Migration Checklist

### Pre-migration
- [ ] Produce full inventory (SoRs, Projections, Single Views, ER Schemas, cast functions)
- [ ] Verify CDC ingestion topics are accessible from the new deployment namespace
- [ ] Take a MongoDB snapshot (backup) of all projection and Single View collections
- [ ] Create all new Kafka topics (e.g. `.pre`, `.aggregated`, `.internal-updates`, `.product`)

### Per Projection
- [ ] Create Stream Processor `config.json` (consumer = ingestion topic, producer = `.pre` topic)
- [ ] Write `index.js` with source adapter normalization and field casts
- [ ] Deploy Stream Processor service
- [ ] Create Kango `config.json` (consumer = `.pre` topic, persistence = MongoDB collection)
- [ ] Deploy Kango service
- [ ] Validate: document count and sample comparison with v1 projection collection

### Per Single View
- [ ] Convert ER Schema to Farm Data graph
- [ ] Create Farm Data `config.json` with all projection consumers and the graph
- [ ] Deploy Farm Data service
- [ ] If needed: create and deploy post-aggregation Stream Processor
- [ ] Create Kango `config.json` for Single View output
- [ ] Deploy Kango service
- [ ] Validate: document count and structure comparison with v1 Single View collection

### Control Plane v2
- [ ] Deploy `control-plane` and `control-plane-frontend` services
- [ ] Add `/` and `/api` endpoints
- [ ] Verify Control Plane UI is accessible and shows the pipeline

### Decommission
- [ ] Remove all v1 Fast Data services
- [ ] Delete obsolete ConfigMaps
- [ ] Remove deprecated environment variables
- [ ] (Optional) Delete obsolete Kafka topics
