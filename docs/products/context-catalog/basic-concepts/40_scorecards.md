---
id: scorecards
title: Scorecards
sidebar_label: Scorecards
---

# Scorecards

A **Scorecard** is a set of rules evaluated on a scope of catalog items, used to express the overall compliance posture of that scope. Where a single [Rule](/products/context-catalog/basic-concepts/30_evaluation-criteria.md) answers a single yes/no question, a scorecard rolls many rules together into one comprehensive view: for example a "Production-readiness" scorecard, a "Security baseline" scorecard, or an "Observability" scorecard.

## Concepts

- **Scope.** The set of catalog items the scorecard applies to. The scope is either a reference to a [View](/products/context-catalog/catalog-administration.md#views) or a raw query over the catalog (see [Query Language](/products/context-catalog/basic-concepts/70_query-language.md)).
- **Levels.** A scorecard is organized into named, ordered levels (for example *Bronze → Silver → Gold*). Each level groups a subset of the scorecard's rules.
- **Rules.** The list of rules whose results contribute to the scorecard. Each rule belongs to exactly one level and is evaluated independently per item.
- **Achieved level.** The result of a scorecard evaluation for a single item is the *highest* level whose rules are *all* satisfied by that item. An item that does not satisfy every rule of the lowest level has no achieved level (it is reported as "without level").

## Score and progress

When a scorecard is evaluated, every item in scope gets:

- a per-rule pass/fail result,
- an **achieved level** computed from those results.

From the per-item achieved level the catalog derives two aggregate indicators that are surfaced on the scorecard and on the [Catalog Administration](/products/context-catalog/catalog-administration.md):

- **Median level.** The median achieved level across all items in scope. It summarizes "where most of the fleet sits" without being skewed by a handful of outliers.
- **Progress.** The percentage of items in scope that have achieved at least the *lowest* level of the scorecard (i.e. items that have a level at all). Progress is the simplest reading of "how many things in scope are compliant *enough* to be on the ladder".

The Catalog Administration also surfaces the count of items *without level* — those that fail at least one rule of the lowest level — which is the natural starting point for remediation work.

## Where scorecards live

Scorecards are catalog items governed by an Item Type Definition under the `compliance.mia-platform.eu` group. As catalog items they:

- can be created, listed, fetched, updated, and deleted via the [Catalog API](/products/context-catalog/api-interactions.md),
- can carry labels and annotations,
- can be related to the items they target via the catalog's relationship system,
- are versioned through `resourceVersion` like any other object.

## How a scorecard is evaluated

A scorecard refresh is, internally, a fan-out of [rule evaluations](/products/context-catalog/basic-concepts/30_evaluation-criteria.md):

1. The scorecard's scope is resolved into a concrete list of items.
2. For each rule in the scorecard, a rule evaluation is triggered against that list (the same flow described in [Evaluation Criteria](/products/context-catalog/basic-concepts/30_evaluation-criteria.md)).
3. Per-rule, per-item results are aggregated into the achieved level for each item, the median level, and the progress percentage.
4. The aggregate score is persisted on the scorecard item.

Because every individual evaluation produces a `Rule-run` item, scorecards retain a full audit trail: you can drill from an aggregated score down to the rule, the items that failed it, and the moment the evaluation happened.

## Scorecards vs. Campaigns

Scorecards and [Campaigns](/products/context-catalog/basic-concepts/50_campaigns.md) both bundle multiple rules, but they answer different questions:

| Aspect | Scorecard | Campaign |
| :----- | :-------- | :------- |
| Purpose | Continuously summarize compliance posture of a scope | Drive a time-bounded compliance program toward a deadline |
| Time dimension | Standing, refreshed on demand or on schedule | Has `startDate` and `endDate` |
| Notifications | Not the primary mechanism | Sends notifications to followers at start and end |
| Output | An aggregate score over rules and items | Per-item compliance status with deadline-driven follow-up |

In practice, the two are complementary: a campaign can use a scorecard's rule set to define what "compliant" means, while a scorecard surfaces the long-term health of the same scope.

## See also

- [Evaluation Criteria](/products/context-catalog/basic-concepts/30_evaluation-criteria.md): the rule model and evaluation flow scorecards build on.
- [Campaigns](/products/context-catalog/basic-concepts/50_campaigns.md): time-bounded compliance programs.
- [Catalog Administration](/products/context-catalog/catalog-administration.md): where scorecard scores are visualized.
