---
id: campaigns
title: Campaigns
sidebar_label: Campaigns
---

# Campaigns

A **Campaign** groups one or more goals (in the form of [Rules](./30_evaluation-criteria.md)) that must be satisfied by a set of catalog items within a defined time window. Campaigns turn a snapshot evaluation into a continuous, time-bounded compliance program with a clear deadline and a notification flow.

A campaign declares:

- `startDate`: when the campaign period begins.
- `endDate`: the deadline by which all goals should be satisfied.
- `goals[]`: one or more evaluation criteria applied to the target item set.
- a target set of items defined as a [view](../catalog-backoffice.md#views) reference or a raw query (see [Query Language](./70_query-language.md)).

## Relationship with Scorecards

In practice, a campaign is most often **built from a [Scorecard](./40_scorecards.md)**: you pick an existing scorecard and either select a target level (every rule from that level downward becomes a goal of the campaign) or cherry-pick individual rules from it. The campaign is then linked to the scorecard it originated from, and the link is preserved for audit and navigation.

It is also possible to create a campaign **from scratch** by defining goals directly, without referencing a scorecard.

The mental model:

- A **scorecard** is the *standing* compliance ladder for a scope: it answers "where do we sit today?" continuously.
- A **campaign** is the *time-bounded* push to move that scope up the ladder by a deadline.

## Lifecycle

A campaign has three phases: **initial evaluation** at `startDate`, **incremental re-evaluation** as items change, and a **final evaluation + notification** at `endDate`.

```text
      startDate                                             endDate
          │                                                    │
          ▼                                                    ▼
  ┌───────────────┐     item updated      ┌────────────────────────────┐
  │ Initial eval  │ ──────────────────►   │  Incremental re-evaluation │ ──► Final eval + notification
  │ (all goals)   │   (change events)     │  (only changed items)      │
  └───────┬───────┘                       └────────────────────────────┘
          │
          │ non-compliant items found
          ▼
  notify owners and followers
  of non-compliant items
```

### Detailed flow

1. **Campaign start.** When `startDate` is reached, every configured goal is evaluated against the target item set (the same flow used by a standalone rule run, see [Evaluation Criteria](./30_evaluation-criteria.md)). Results are stored on the `Campaign` item.
2. **Notification.** After the initial evaluation, an email notification is sent to every user who owns or follows an item that does not satisfy at least one goal.
3. **Incremental re-evaluation.** Every time a tracked item is updated, the relevant goals are re-evaluated for that item and the campaign results are updated accordingly.
4. **Campaign end.** When `endDate` is reached, a final full evaluation of all goals against the complete item set is performed, and a new notification is sent to owners and followers of any item that is still non-compliant.

## Item types involved

Campaigns interact with a small number of catalog item types:

- **Rules**: deterministic conditions evaluated against a context of items, used to express the goals of a campaign.
- **Rule-runs**: evaluations of a rule against a context of items at a given moment.
- **Campaigns**: the time-bounded grouping described in this page.
- **Scorecards**: see [Scorecards](./40_scorecards.md) for the related, complementary concept.

## Owners, followers and notifications

A campaign notifies the users who care about the items in scope. Two roles matter:

- The **owner** of an item (a User or a Team — see [Items](./10_items.md#ownership-and-followers)).
- Any user who explicitly **follows** the item through a `follow.mia-platform.eu` relationship — see [Relationships](./60_relationships.md).

Owners and followers receive an email notification when their item:

- fails one or more goals during the campaign's initial evaluation, or
- is still non-compliant at the campaign's end.

To keep the signal-to-noise ratio reasonable, no notification is sent on every incremental re-evaluation: only the start and end of a campaign trigger one.

## See also

- [Evaluation Criteria](./30_evaluation-criteria.md): how individual rules are evaluated.
- [Scorecards](./40_scorecards.md): how to express and roll up overall compliance posture.
- [Catalog Backoffice](../catalog-backoffice.md): where to monitor campaign progress in the UI.
