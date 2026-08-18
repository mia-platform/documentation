---
id: worked_example
title: "Worked Example: Food Delivery Pipeline"
sidebar_label: Worked Example
---

This page applies the [Migration Steps](/products/fast_data_v2/migration/migration_steps) to a concrete Food Delivery project, making the generic procedure tangible with real service names, topic names, and configuration files.

## v1 Inventory

### Systems of Record and Projections

| System | Projection | Primary Key | Non-string Cast Fields |
|---|---|---|---|
| `management` | `pr_orders` | `ID_ORDER` | `DATE` → date |
| `management` | `pr_orders_dishes` | `ID_ORDER, ID_DISH` | — |
| `management` | `pr_reviews` | `ID_REVIEW` | `STARS` → integer |
| `menu` | `pr_restaurants` | `ID_RESTAURANT` | — |
| `menu` | `pr_dishes` | `ID_DISH` | `PRICE` → float |
| `menu` | `pr_allergens` | `ID_ALLERGEN` | — |
| `users` | `pr_customer` | `ID_USER` | — |
| `users` | `pr_food_preferencies` | `ID_FOOD_PREFERENCE` | — |
| `users` | `pr_allergens_customer` | `ID_ALLERGEN, ID_USER` | — |
| `users` | `pr_food_preferencies_customer` | `ID_FOOD_PREFERENCE, ID_USER` | — |

Source adapter: **debezium** for all three Projection Storers.

### Single View

| Single View | Root Projection | Output fields |
|---|---|---|
| `sv_customers` | `pr_customer` (PK: `ID_USER` → `idCustomer`) | `idCustomer, taxCode, name, surname, email, address, telephone, allergens[], reviews[], orders[{dishes[]}], foodPreferencies[]` |

### ER Schema relationships (`customers-erschema`)

```
pr_customer  ──(1:N, ID_USER)──▶  pr_orders
                                    └──(1:N, ID_ORDER)──▶  pr_orders_dishes
                                                               └──(1:1, ID_DISH)──▶  pr_dishes
                                                                                          └──(1:1, ID_RESTAURANT)──▶  pr_restaurants
             ──(1:N, ID_USER)──▶  pr_allergens_customer
                                    └──(1:1, ID_ALLERGEN)──▶  pr_allergens
             ──(1:N, ID_USER)──▶  pr_reviews
             ──(1:N, ID_USER)──▶  pr_food_preferencies_customer
                                    └──(1:1, ID_FOOD_PREFERENCE)──▶  pr_food_preferencies
```

### v1 Services

| Service | Image | Role |
|---|---|---|
| `management-projection-storer` | `projection-storer:1.3.5` | Ingests management SoR |
| `menu-projection-storer` | `projection-storer:1.3.5` | Ingests menu SoR |
| `users-projection-storer` | `projection-storer:1.3.5` | Ingests users SoR |
| `single-view-trigger-generator` | `single-view-trigger-generator-plugin:3.3.3` | Triggers `sv_customers` aggregation |
| `customers-single-view-creator` | `single-view-creator-plugin:6.7.1` | Aggregates and writes `sv_customers` |
| `fast-data-control-plane-operator` | `control-plane-operator:0.1.1` | gRPC Control Plane |

---

## Step 1 — Topic Plan (v2)

### New `.pre` topics

| Topic | Fed by |
|---|---|
| `fd.pr-orders.pre` | `sp-management-pr-orders` |
| `fd.pr-orders-dishes.pre` | `sp-management-pr-orders-dishes` |
| `fd.pr-reviews.pre` | `sp-management-pr-reviews` |
| `fd.pr-restaurants.pre` | `sp-menu-pr-restaurants` |
| `fd.pr-dishes.pre` | `sp-menu-pr-dishes` |
| `fd.pr-allergens.pre` | `sp-menu-pr-allergens` |
| `fd.pr-customer.pre` | `sp-users-pr-customer` |
| `fd.pr-food-preferencies.pre` | `sp-users-pr-food-preferencies` |
| `fd.pr-allergens-customer.pre` | `sp-users-pr-allergens-customer` |
| `fd.pr-food-preferencies-customer.pre` | `sp-users-pr-food-preferencies-customer` |

### Single View topics

| Topic | Purpose |
|---|---|
| `fd.sv-customers.aggregated` | Farm Data output |
| `fd.sv-customers.internal-updates` | Farm Data internal coordination |
| `fd.sv-customers.product` | Post-aggregation SP output → Kango input |

---

## Step 2 — Stream Processors

One SP per projection. All three SoRs use debezium, so all SPs share the same `index.js` base, with only `transformFields` varying.

### `config.json` (example: `sp-management-pr-orders`)

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
    "topic": "{{FAST_DATA_PR_ORDERS_INGESTION_TOPIC}}",
    "connectionName": "kafka",
    "config": {
      "client.id": "sp-pr-orders-consumer",
      "group.id": "cg.sp.pr-orders.pre",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "20480",
      "queued.min.messages": "2500"
    }
  },
  "producer": {
    "type": "kafka",
    "topic": "fd.pr-orders.pre",
    "connectionName": "kafka",
    "config": {
      "client.id": "sp-pr-orders-producer",
      "compression.type": "snappy"
    }
  },
  "processor": { "type": "javascript" }
}
```

For the other 9 SPs, replace `topic` (consumer) and `topic` (producer) accordingly:

| Service | Consumer topic | Producer topic | `group.id` |
|---|---|---|---|
| `sp-management-pr-orders` | `{{FAST_DATA_PR_ORDERS_INGESTION_TOPIC}}` | `fd.pr-orders.pre` | `cg.sp.pr-orders.pre` |
| `sp-management-pr-orders-dishes` | `{{FAST_DATA_PR_ORDERS_DISHES_INGESTION_TOPIC}}` | `fd.pr-orders-dishes.pre` | `cg.sp.pr-orders-dishes.pre` |
| `sp-management-pr-reviews` | `{{FAST_DATA_PR_REVIEWS_INGESTION_TOPIC}}` | `fd.pr-reviews.pre` | `cg.sp.pr-reviews.pre` |
| `sp-menu-pr-restaurants` | `{{FAST_DATA_PR_RESTAURANTS_INGESTION_TOPIC}}` | `fd.pr-restaurants.pre` | `cg.sp.pr-restaurants.pre` |
| `sp-menu-pr-dishes` | `{{FAST_DATA_PR_DISHES_INGESTION_TOPIC}}` | `fd.pr-dishes.pre` | `cg.sp.pr-dishes.pre` |
| `sp-menu-pr-allergens` | `{{FAST_DATA_PR_ALLERGENS_INGESTION_TOPIC}}` | `fd.pr-allergens.pre` | `cg.sp.pr-allergens.pre` |
| `sp-users-pr-customer` | `{{FAST_DATA_PR_CUSTOMER_INGESTION_TOPIC}}` | `fd.pr-customer.pre` | `cg.sp.pr-customer.pre` |
| `sp-users-pr-food-preferencies` | `{{FAST_DATA_PR_FOOD_PREFERENCIES_INGESTION_TOPIC}}` | `fd.pr-food-preferencies.pre` | `cg.sp.pr-food-preferencies.pre` |
| `sp-users-pr-allergens-customer` | `{{FAST_DATA_PR_ALLERGENS_CUSTOMER_INGESTION_TOPIC}}` | `fd.pr-allergens-customer.pre` | `cg.sp.pr-allergens-customer.pre` |
| `sp-users-pr-food-preferencies-customer` | `{{FAST_DATA_PR_FOOD_PREFERENCIES_CUSTOMER_INGESTION_TOPIC}}` | `fd.pr-food-preferencies-customer.pre` | `cg.sp.pr-food-preferencies-customer.pre` |

### `index.js` — projection-specific `transformFields`

Most projections only use `castToString` (no change needed after debezium unwrapping). Three require explicit casts:

**`pr_orders` — `DATE` field:**

```javascript
function transformFields(record) {
  const r = stripDebeziumTypes(record)
  return { ...r, DATE: castToDate(r.DATE) }
}
```

**`pr_reviews` — `STARS` field:**

```javascript
function transformFields(record) {
  const r = stripDebeziumTypes(record)
  return { ...r, STARS: castToInteger(r.STARS) }
}
```

**`pr_dishes` — `PRICE` field:**

```javascript
function transformFields(record) {
  const r = stripDebeziumTypes(record)
  return { ...r, PRICE: castToFloat(r.PRICE) }
}
```

---

## Step 3 — Kango for Projected Tables

| Service | Input topic | MongoDB collection | Primary key |
|---|---|---|---|
| `ka-pr-orders` | `fd.pr-orders.pre` | `pr_orders` | `["ID_ORDER"]` |
| `ka-pr-orders-dishes` | `fd.pr-orders-dishes.pre` | `pr_orders_dishes` | `["ID_ORDER", "ID_DISH"]` |
| `ka-pr-reviews` | `fd.pr-reviews.pre` | `pr_reviews` | `["ID_REVIEW"]` |
| `ka-pr-restaurants` | `fd.pr-restaurants.pre` | `pr_restaurants` | `["ID_RESTAURANT"]` |
| `ka-pr-dishes` | `fd.pr-dishes.pre` | `pr_dishes` | `["ID_DISH"]` |
| `ka-pr-allergens` | `fd.pr-allergens.pre` | `pr_allergens` | `["ID_ALLERGEN"]` |
| `ka-pr-customer` | `fd.pr-customer.pre` | `pr_customer` | `["ID_USER"]` |
| `ka-pr-food-preferencies` | `fd.pr-food-preferencies.pre` | `pr_food_preferencies` | `["ID_FOOD_PREFERENCE"]` |
| `ka-pr-allergens-customer` | `fd.pr-allergens-customer.pre` | `pr_allergens_customer` | `["ID_ALLERGEN", "ID_USER"]` |
| `ka-pr-food-preferencies-customer` | `fd.pr-food-preferencies-customer.pre` | `pr_food_preferencies_customer` | `["ID_FOOD_PREFERENCE", "ID_USER"]` |

---

## Step 4 — Farm Data (`fd-sv-customers`)

### Aggregation graph (converted from `customers-erschema`)

```json
{
  "nodes": [
    {
      "id": "pr_customer",
      "edges": {
        "in": [],
        "out": [
          "pr_customer->pr_orders",
          "pr_customer->pr_allergens_customer",
          "pr_customer->pr_reviews",
          "pr_customer->pr_food_preferencies_customer"
        ]
      }
    },
    {
      "id": "pr_orders",
      "edges": { "in": ["pr_customer->pr_orders"], "out": ["pr_orders->pr_orders_dishes"] }
    },
    {
      "id": "pr_orders_dishes",
      "edges": { "in": ["pr_orders->pr_orders_dishes"], "out": ["pr_orders_dishes->pr_dishes"] }
    },
    {
      "id": "pr_dishes",
      "edges": { "in": ["pr_orders_dishes->pr_dishes"], "out": ["pr_dishes->pr_restaurants"] }
    },
    {
      "id": "pr_restaurants",
      "edges": { "in": ["pr_dishes->pr_restaurants"], "out": [] }
    },
    {
      "id": "pr_reviews",
      "edges": { "in": ["pr_customer->pr_reviews"], "out": [] }
    },
    {
      "id": "pr_allergens_customer",
      "edges": { "in": ["pr_customer->pr_allergens_customer"], "out": ["pr_allergens_customer->pr_allergens"] }
    },
    {
      "id": "pr_allergens",
      "edges": { "in": ["pr_allergens_customer->pr_allergens"], "out": [] }
    },
    {
      "id": "pr_food_preferencies_customer",
      "edges": { "in": ["pr_customer->pr_food_preferencies_customer"], "out": ["pr_food_preferencies_customer->pr_food_preferencies"] }
    },
    {
      "id": "pr_food_preferencies",
      "edges": { "in": ["pr_food_preferencies_customer->pr_food_preferencies"], "out": [] }
    }
  ],
  "edges": [
    { "id": "pr_customer->pr_orders",                        "filter": { "$eq": [{ "foreign": ["ID_USER"] },             { "local": ["ID_USER"] }] } },
    { "id": "pr_customer->pr_allergens_customer",            "filter": { "$eq": [{ "foreign": ["ID_USER"] },             { "local": ["ID_USER"] }] } },
    { "id": "pr_customer->pr_reviews",                       "filter": { "$eq": [{ "foreign": ["ID_USER"] },             { "local": ["ID_USER"] }] } },
    { "id": "pr_customer->pr_food_preferencies_customer",    "filter": { "$eq": [{ "foreign": ["ID_USER"] },             { "local": ["ID_USER"] }] } },
    { "id": "pr_orders->pr_orders_dishes",                   "filter": { "$eq": [{ "foreign": ["ID_ORDER"] },            { "local": ["ID_ORDER"] }] } },
    { "id": "pr_orders_dishes->pr_dishes",                   "filter": { "$eq": [{ "foreign": ["ID_DISH"] },             { "local": ["ID_DISH"] }] } },
    { "id": "pr_dishes->pr_restaurants",                     "filter": { "$eq": [{ "foreign": ["ID_RESTAURANT"] },       { "local": ["ID_RESTAURANT"] }] } },
    { "id": "pr_allergens_customer->pr_allergens",           "filter": { "$eq": [{ "foreign": ["ID_ALLERGEN"] },         { "local": ["ID_ALLERGEN"] }] } },
    { "id": "pr_food_preferencies_customer->pr_food_preferencies", "filter": { "$eq": [{ "foreign": ["ID_FOOD_PREFERENCE"] }, { "local": ["ID_FOOD_PREFERENCE"] }] } }
  ]
}
```

### `config.json` for `fd-sv-customers`

```json
{
  "id": "sv-customers",
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
      "pr_customer":                     { "topic": "fd.pr-customer.pre",                     "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "client.id": "fd-sv-customers-head", "auto.offset.reset": "earliest", "queued.max.messages.kbytes": "8192", "queued.min.messages": "500" },
      "pr_orders":                       { "topic": "fd.pr-orders.pre",                       "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest", "queued.max.messages.kbytes": "8192", "queued.min.messages": "500" },
      "pr_orders_dishes":                { "topic": "fd.pr-orders-dishes.pre",                "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_dishes":                       { "topic": "fd.pr-dishes.pre",                       "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_restaurants":                  { "topic": "fd.pr-restaurants.pre",                  "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_reviews":                      { "topic": "fd.pr-reviews.pre",                      "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_allergens_customer":           { "topic": "fd.pr-allergens-customer.pre",           "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_allergens":                    { "topic": "fd.pr-allergens.pre",                    "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_food_preferencies_customer":   { "topic": "fd.pr-food-preferencies-customer.pre",   "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" },
      "pr_food_preferencies":            { "topic": "fd.pr-food-preferencies.pre",            "connectionName": "kafka", "group.id": "cg.fd.sv-customers", "auto.offset.reset": "earliest" }
    }
  },
  "producer": {
    "connectionName": "kafka",
    "topic": "fd.sv-customers.aggregated",
    "config": { "client.id": "fd-sv-customers-producer" }
  },
  "internalUpdates": {
    "type": "kafka",
    "topic": "fd.sv-customers.internal-updates",
    "connectionName": "kafka"
  },
  "processor": {
    "graph": { "<<insert graph from above>>": true },
    "persistence": {
      "connectionName": "mongo",
      "database": "{{MONGODB_NAME}}"
    }
  }
}
```

---

## Step 5 — Post-aggregation Stream Processor (`sp-sv-customers-map`)

The v1 `aggregation.json` mapped raw projection fields to a camelCase Single View schema. The following SP reproduces this mapping.

### `index.js`

```javascript
export default function process({ key, payload }) {
  if (!payload) return [{ key, payload: null }]
  if (payload.op === 'd') return [{ key, payload }]

  const after = payload.after
  if (!after) return []

  const customer = after.pr_customer ?? {}

  const orders = (after.pr_orders ?? []).map(order => ({
    id:          order.ID_ORDER,
    orderDate:   order.DATE,
    totalPrice:  order.TOTAL_PRICE,
    paymentType: order.PAYMENT_TYPE,
    orderStatus: order.ORDER_STATUS,
    dishes: (order.pr_orders_dishes ?? []).map(od => ({
      id:          od.ID_DISH,
      description: od.pr_dishes?.DESCRIPTION ?? null,
      price:       od.pr_dishes?.PRICE ?? null,
    })),
  }))

  const allergens = (after.pr_allergens_customer ?? []).map(ac => ({
    id:          ac.ID_ALLERGEN,
    comments:    ac.COMMENTS,
    description: ac.pr_allergens?.DESCRIPTION ?? null,
  }))

  const reviews = (after.pr_reviews ?? []).map(r => ({
    id:    r.ID_REVIEW,
    text:  r.TEXT,
    stars: r.STARS,
  }))

  const foodPreferencies = (after.pr_food_preferencies_customer ?? []).map(fpc => ({
    id:          fpc.ID_FOOD_PREFERENCE,
    comments:    fpc.COMMENTS,
    description: fpc.pr_food_preferencies?.DESCRIPTION ?? null,
  }))

  const sv = {
    idCustomer:      customer.ID_USER,
    taxCode:         customer.TAX_CODE,
    name:            customer.NAME,
    surname:         customer.SURNAME,
    email:           customer.EMAIL,
    address:         customer.ADDRESS,
    telephone:       customer.PHONE,
    orders,
    allergens,
    reviews,
    foodPreferencies,
  }

  return [{ key, payload: { ...payload, after: sv } }]
}
```

---

## Step 6 — Kango for Single View (`ka-sv-customers`)

```json
{
  "consumer": {
    "type": "kafka",
    "topic": "fd.sv-customers.product",
    "connectionName": "kafka",
    "config": {
      "client.id": "ka-sv-customers-consumer",
      "group.id": "cg.ka.sv-customers",
      "auto.offset.reset": "earliest",
      "queued.max.messages.kbytes": "32840",
      "queued.min.messages": "5000"
    }
  },
  "persistence": {
    "connectionName": "mongo",
    "database": "{{MONGODB_NAME}}",
    "collection": "sv_customers",
    "primaryKey": ["idCustomer"]
  }
}
```

---

## Summary of Delta

| Action | Count | Services |
|---|---|---|
| **Add** — Stream Processors | 10 | `sp-management-pr-orders`, `sp-management-pr-orders-dishes`, `sp-management-pr-reviews`, `sp-menu-pr-restaurants`, `sp-menu-pr-dishes`, `sp-menu-pr-allergens`, `sp-users-pr-customer`, `sp-users-pr-food-preferencies`, `sp-users-pr-allergens-customer`, `sp-users-pr-food-preferencies-customer` |
| **Add** — Kango (projections) | 10 | `ka-pr-orders`, `ka-pr-orders-dishes`, `ka-pr-reviews`, `ka-pr-restaurants`, `ka-pr-dishes`, `ka-pr-allergens`, `ka-pr-customer`, `ka-pr-food-preferencies`, `ka-pr-allergens-customer`, `ka-pr-food-preferencies-customer` |
| **Add** — Farm Data | 1 | `fd-sv-customers` |
| **Add** — Kango (Single View) + optional SP | 1 (+1 opt) | `ka-sv-customers`, `sp-sv-customers-map` |
| **Add** — Control Plane v2 | 2 | `control-plane`, `control-plane-frontend` |
| **Remove** | 6 | `management-projection-storer`, `menu-projection-storer`, `users-projection-storer`, `single-view-trigger-generator`, `customers-single-view-creator`, `fast-data-control-plane-operator` |
| **Unchanged** | 4+ | `api-gateway`, `api-portal`, `swagger-aggregator`, `crud-service`, all business microservices |

The net result is a reduction of 6 legacy services and the elimination of all pr-update topics, in exchange for a modular, independently scalable v2 pipeline with up to 10× better aggregation throughput.
