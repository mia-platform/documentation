---
id: evaluation-criteria
title: Evaluation Criteria
sidebar_label: Evaluation Criteria
---

# Evaluation Criteria

In the Context Catalog, an **evaluation criterion** is expressed as a **Rule**: a deterministic condition evaluated against a set of catalog items. Rules are the building blocks of compliance: they answer questions like "does this service have an owner?", "is this image scanned for vulnerabilities?", or "is this resource tagged with an environment?".

This page describes how rules are modeled, how they are evaluated, and how the result is materialized in the catalog.

## Concepts

- **Rule.** A deterministic condition evaluated against a catalog item.
- **Rule-run.** The record of a single evaluation of a rule against a context of items at a given moment.
- **Policy Engine.** A stateless service that takes a rule body and a set of items, evaluates the condition for each item, and returns the per-item results.
- **Compliance Manager.** The orchestrator that owns the lifecycle of rule evaluations: it creates rule-runs, calls the policy engine, polls for results, and updates the catalog.

## Evaluation flow

Every rule evaluation follows the same four-step flow, regardless of whether the trigger is a manual request, a scheduled scan, or an item-change event from a [Campaign](./50_campaigns.md).

1. The Compliance Manager receives a rule evaluation request and creates a **Run** item in the catalog with status `pending`.
2. It calls the Policy Engine, passing the rule body and the set of target items.
3. The Compliance Manager polls the Policy Engine until the evaluation is `completed`.
4. Once complete, it updates the `Run` item with the final status (`success` or `failed`) and the per-item results.

In parallel, the **frontend polls the `Run` item** on the Catalog Engine until the status transitions out of `pending`, then renders the results.

```text
catalog-frontend          compliance-manager         policy-engine        catalog-engine
      │                          │                         │                    │
      │  POST /evaluate-rule     │                         │                    │
      │─────────────────────────►│                         │                    │
      │                          │  1. Create Run (pending)│                    │
      │                          │────────────────────────────────────────────► │
      │                          │  2. POST evaluate(rule, items)               │
      │                          │────────────────────────►│                    │
      │                          │                         │                    │
      │◄─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  (returns immediately)  │                    │
      │                          │                         │                    │
      │  GET /run/{id} (polling) │  3. GET status (polling)│                    │
      │─────────────────────────►│────────────────────────►│                    │
      │◄─ status: pending ───────│◄─ status: in_progress ──│                    │
      │                          │           …             │                    │
      │  GET /run/{id} (polling) │  GET status             │                    │
      │─────────────────────────►│────────────────────────►│                    │
      │                          │◄─ status: completed ────│                    │
      │                          │  4. Update Run (success/failed + results)    │
      │                          │────────────────────────────────────────────► │
      │◄─ status: success/failed─│                         │                    │
```

## Where rules live

Rules are themselves catalog items, governed by an Item Type Definition under the `compliance.mia-platform.eu` group:

- **Rules**: the rule definition (its body, the kinds it targets, the description shown to users).
- **Rule-runs**: the historical record of evaluations performed against a context of items.

Treating rules as catalog items means they are versioned, queryable, and referenceable like any other entity, and they can be related to the items they evaluate through the catalog's relationship system.

## Triggers

A rule evaluation can be triggered by:

- **An explicit request**: typically initiated from the [Catalog Backoffice](../catalog-backoffice.md) by an operator.
- **A campaign milestone**: at `startDate`, at `endDate`, or in incremental re-evaluations driven by item-change events. See [Campaigns](./50_campaigns.md).
- **A scorecard refresh**: when a [Scorecard](./40_scorecards.md) recomputes its score over its scope.

## Outcome

Each rule-run produces:

- a final **status** (`success` or `failed`),
- a per-item result indicating whether each item satisfies the rule,
- enough context (timestamps, the evaluated rule version, the targeted items) to reconstruct what was evaluated and when.

These results are persisted on the `Run` item and exposed both via the [Catalog API](../api-interactions.md) and through the [Catalog Backoffice](../catalog-backoffice.md).
