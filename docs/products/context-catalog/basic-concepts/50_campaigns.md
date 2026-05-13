---
id: campaigns
title: Campaigns
sidebar_label: Campaigns
---

# Campaigns

A **Campaign** groups one or more goals (in the form of [Rules](./30_evaluation-criteria.md)) that must be satisfied by a set of catalog items within a defined time window. Campaigns turn a snapshot evaluation into a time-bounded compliance program with a clear deadline.

A campaign declares:

- `startDate`: when the campaign period begins.
- `endDate`: the deadline by which all goals should be satisfied.
- `goals[]`: one or more evaluation criteria applied to the target item set.
- a target set of items defined as a [view](../catalog-backoffice.md#views) reference or a raw query (see [Query Language](./70_query-language.md)).

The dates define the campaign's time window for reporting and audit purposes; they do not currently drive automatic evaluations (see [Evaluation](#evaluation) below).

## Relationship with Scorecards

In practice, a campaign is most often **built from a [Scorecard](./40_scorecards.md)**: you pick an existing scorecard and either select a target level (every rule from that level downward becomes a goal of the campaign) or cherry-pick individual rules from it. The campaign is then linked to the scorecard it originated from, and the link is preserved for audit and navigation.

It is also possible to create a campaign **from scratch** by defining goals directly, without referencing a scorecard.

The mental model:

- A **scorecard** is the *standing* compliance ladder for a scope: it answers "where do we sit today?" continuously.
- A **campaign** is the *time-bounded* push to move that scope up the ladder by a deadline.

## Evaluation

A campaign is evaluated **on demand**: an operator triggers a run from the [Catalog Backoffice](../catalog-backoffice.md#evaluate-a-campaign), and every configured goal is evaluated against the target item set (the same flow used by a standalone rule run, see [Evaluation Criteria](./30_evaluation-criteria.md)). Results are stored on the `Campaign` item and exposed both via the [Catalog API](../api-interactions.md) and in the Backoffice.

There is no automatic re-evaluation when `startDate` or `endDate` is reached, nor when an item in scope changes: each refresh is initiated manually.

## Item types involved

Campaigns interact with a small number of catalog item types:

- **Rules**: deterministic conditions evaluated against a context of items, used to express the goals of a campaign.
- **Rule-runs**: evaluations of a rule against a context of items at a given moment.
- **Campaigns**: the time-bounded grouping described in this page.
- **Scorecards**: see [Scorecards](./40_scorecards.md) for the related, complementary concept.

## See also

- [Evaluation Criteria](./30_evaluation-criteria.md): how individual rules are evaluated.
- [Scorecards](./40_scorecards.md): how to express and roll up overall compliance posture.
- [Catalog Backoffice](../catalog-backoffice.md): where to monitor campaign progress in the UI.
