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
- **Policy Engine.** The stateless service that takes a rule body and a set of items, evaluates the condition for each item, and returns the per-item results.

## Rule body

The body of a rule — the condition that gets evaluated against each item — can be authored in three equivalent forms:

- **Visual builder**: a UI-driven editor that lets users compose conditions by picking a field, an operator (equals, not equals, matches, exists, …) and a value, then combining clauses with AND/OR. Best for non-technical users.
- **JSON AST**: the raw JSON representation that the visual builder produces under the hood. It is the canonical persistence format and is suited to programmatic authoring.
- **CEL**: a [Common Expression Language](https://cel.dev) expression for users who prefer a code-like authoring experience and need expressivity that goes beyond the visual builder.

The three formats are interchangeable: a rule authored visually can be inspected as JSON AST or transpiled to CEL, and vice versa.

## Evaluation flow

Every rule evaluation follows the same four-step flow, regardless of whether the trigger is a manual request, a scheduled scan, or an item-change event from a [Campaign](./50_campaigns.md).

1. A rule evaluation request is received and a **Run** item is created in the catalog with status `pending`.
2. The Policy Engine is called with the rule body and the set of target items.
3. The Policy Engine is polled until the evaluation is `completed`.
4. Once complete, the `Run` item is updated with the final status (`success` or `failed`) and the per-item results.

In parallel, the **Catalog Backoffice polls the `Run` item** until the status transitions out of `pending`, then renders the results.

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
