---
id: campaigns
title: Campaigns
sidebar_label: Campaigns
---

# Campaigns

A **Campaign** groups one or more [Rules](/products/context-catalog/basic-concepts/30_evaluation-criteria.md) that must be satisfied by a set of catalog items within a defined time window. Campaigns turn a snapshot evaluation into a time-bounded compliance program with a clear deadline.

A campaign declares:

- `startTime`: when the campaign period begins.
- `endTime`: the deadline by which all rules should be satisfied.
- `rules[]`: one or more [Rules](/products/context-catalog/basic-concepts/30_evaluation-criteria.md), either **copied from a [Scorecard](/products/context-catalog/basic-concepts/40_scorecards.md)** when the campaign is built from one (once a target level is selected, that level's rules *and every level below it* are duplicated onto the campaign) or **written directly on the campaign** when it is built from scratch. Once on the campaign, the rules are independent of the source scorecard: later changes to the scorecard do not propagate.
- `scope`: a target set of items defined as a [view](/products/context-catalog/catalog-app.md#views) reference or a raw query (see [Query Language](/products/context-catalog/basic-concepts/70_query-language.md)).
- `reportFrequency` *(optional)*: `Daily`, `Weekly`, or `Monthly` — see [Evaluation](#evaluation) for how it drives scheduled re-evaluation.

The dates define the campaign's time window and also drive automatic evaluations — see [Evaluation](#evaluation) below.

## Relationship with Scorecards

In practice, a campaign is most often **built from a [Scorecard](/products/context-catalog/basic-concepts/40_scorecards.md)**: you pick an existing scorecard and select a target level — the rules from that level downward are copied onto the campaign. The campaign keeps a link to the scorecard it originated from for audit and navigation, but the copied rules evolve independently from that point on.

It is also possible to create a campaign **from scratch** by defining rules directly, without referencing a scorecard.

The mental model:

- A **scorecard** is the *standing* compliance ladder for a scope: it answers "where do we sit today?" continuously.
- A **campaign** is the *time-bounded* push to move that scope up the ladder by a deadline.

## Evaluation

Every configured rule is evaluated against the target item set (the same flow used by a standalone rule run, see [Evaluation Criteria](/products/context-catalog/basic-concepts/30_evaluation-criteria.md)). Results are stored on the `Campaign` item and exposed both via the [Catalog API](/products/context-catalog/api-interactions.md) and in the Catalog App.

A campaign is re-evaluated through three independent mechanisms:

- **On demand**: an operator triggers a run from the [Catalog App](/products/context-catalog/catalog-app.md#evaluate-a-campaign).
- **On a schedule**: evaluations are automatically triggered at `startTime`, at `endTime`, and — if `reportFrequency` is set — at every `Daily`/`Weekly`/`Monthly` interval in between.
- **On item change**: whenever any item in the catalog is created or updated, the catalog automatically checks whether that item belongs to the scope of any campaign and, if so, re-evaluates those campaigns.

## Item types involved

Campaigns interact with a small number of catalog item types:

- **[Rules](/products/context-catalog/basic-concepts/30_evaluation-criteria.md)**: deterministic conditions evaluated against a context of items; a campaign's rules are either copied from a [Scorecard](/products/context-catalog/basic-concepts/40_scorecards.md) or defined directly on the campaign.
- **[Rule-runs](/products/context-catalog/basic-concepts/30_evaluation-criteria.md#outcome)**: evaluations of a rule against a context of items at a given moment.
- **Scorecards**: see [Scorecards](/products/context-catalog/basic-concepts/40_scorecards.md) for the related, complementary concept.

## See also

- [Evaluation Criteria](/products/context-catalog/basic-concepts/30_evaluation-criteria.md): how individual rules are evaluated.
- [Scorecards](/products/context-catalog/basic-concepts/40_scorecards.md): how to express and roll up overall compliance posture.
- [Catalog App](/products/context-catalog/catalog-app.md): where to monitor campaign progress in the UI.
