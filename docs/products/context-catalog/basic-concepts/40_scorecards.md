---
id: scorecards
title: Scorecards
sidebar_label: Scorecards
---

# Scorecards

A **Scorecard** is a set of rules evaluated on a scope of catalog items, used to express the overall compliance posture of that scope. Where a single [Rule](./30_evaluation-criteria.md) answers a single yes/no question, a scorecard rolls many rules together into one comprehensive view: for example a "Production-readiness" scorecard, a "Security baseline" scorecard, or an "Observability" scorecard.

## Concepts

- **Scope.** The set of catalog items the scorecard applies to (typically defined by a query, for instance "all services in the `production` environment").
- **Rules.** The list of rules whose results contribute to the scorecard. Each rule is evaluated independently per item.
- **Score.** The aggregate result of evaluating every rule against every item in scope. The shape of the score (percentage, level, weighted total, …) depends on the scorecard configuration.

## Where scorecards live

Scorecards are catalog items governed by an Item Type Definition under the `compliance.mia-platform.eu` group. As catalog items they:

- can be created, listed, fetched, updated, and deleted via the [Catalog API](../api-interactions.md),
- can carry labels and annotations,
- can be related to the items they target via the catalog's relationship system,
- are versioned through `resourceVersion` like any other object.

## How a scorecard is evaluated

A scorecard refresh is, internally, a fan-out of [rule evaluations](./30_evaluation-criteria.md). The Compliance Manager:

1. Resolves the scorecard's scope into a concrete list of items.
2. For each rule in the scorecard, triggers a rule evaluation against that list (the same flow described in [Evaluation Criteria](./30_evaluation-criteria.md)).
3. Aggregates the per-rule, per-item results into the scorecard's overall score.
4. Persists the score on the scorecard item.

Because every individual evaluation produces a `Rule-run` item, scorecards retain a full audit trail: you can drill from an aggregated score down to the rule, the items that failed it, and the moment the evaluation happened.

## Scorecards vs. Campaigns

Scorecards and [Campaigns](./50_campaigns.md) both bundle multiple rules, but they answer different questions:

| Aspect | Scorecard | Campaign |
| :----- | :-------- | :------- |
| Purpose | Continuously summarize compliance posture of a scope | Drive a time-bounded compliance program toward a deadline |
| Time dimension | Standing, refreshed on demand or on schedule | Has `startDate` and `endDate` |
| Notifications | Not the primary mechanism | Sends notifications to followers at start and end |
| Output | An aggregate score over rules and items | Per-item compliance status with deadline-driven follow-up |

In practice, the two are complementary: a campaign can use a scorecard's rule set to define what "compliant" means, while a scorecard surfaces the long-term health of the same scope.

## See also

- [Evaluation Criteria](./30_evaluation-criteria.md): the rule model and evaluation flow scorecards build on.
- [Campaigns](./50_campaigns.md): time-bounded compliance programs.
- [Catalog Backoffice](../catalog-backoffice.md): where scorecard scores are visualized.
