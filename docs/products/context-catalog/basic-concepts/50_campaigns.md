---
id: campaigns
title: Campaigns
sidebar_label: Campaigns
---

# Campaigns

A **Campaign** groups one or more [Rules](./30_evaluation-criteria.md) that must be satisfied by a set of catalog items within a defined time window. Campaigns are the way the Compliance Manager turns a snapshot evaluation into a continuous, time-bounded compliance program.

A campaign declares:

- `startDate`: when the campaign period begins.
- `endDate`: the deadline by which all rules should be satisfied.
- `rules[]`: one or more rule definitions applied to the target item set.
- a target set of items (typically defined by a query over the catalog).

## Lifecycle

A campaign has three phases: **initial evaluation** at `startDate`, **incremental re-evaluation** as items change, and a **final evaluation + notification** at `endDate`.

```text
      startDate                                             endDate
          │                                                    │
          ▼                                                    ▼
  ┌───────────────┐     item updated      ┌────────────────────────────┐
  │ Initial eval  │ ──────────────────►   │  Incremental re-evaluation │ ──► Final eval + notification
  │ (all rules)   │  (change listener)    │  (only changed items)      │
  └───────┬───────┘                       └────────────────────────────┘
          │
          │ non-compliant items found
          ▼
  notify followers of
  non-compliant items
  (mail-notification-service)
```

### Detailed flow

1. **Campaign start.** When `startDate` is reached, the Compliance Manager evaluates every configured rule against the target item set (the same flow used by a standalone rule run, see [Evaluation Criteria](./30_evaluation-criteria.md)). Results are stored on the `Campaign` item.
2. **Notification.** After the initial evaluation, the Compliance Manager sends an email notification (via the mail-notification-service) to every user who is a **follower** of an item that does not satisfy at least one rule.
3. **Incremental re-evaluation.** The Compliance Manager listens for item-change events on the database. Every time a tracked item is updated, the Compliance Manager re-evaluates the relevant rules for that item and updates the campaign results accordingly.
4. **Campaign end.** When `endDate` is reached, the Compliance Manager performs a final full evaluation of all rules against the complete item set and sends a new notification to followers of any item that is still non-compliant.

## Item types involved

Campaigns interact with a small number of catalog item types:

- **Rules**: deterministic conditions evaluated against a context of items.
- **Rule-runs**: evaluations of a rule against a context of items at a given moment.
- **Campaigns**: the time-bounded grouping described in this page.
- **Scorecards**: see [Scorecards](./40_scorecards.md) for the related, complementary concept.

## How a campaign relates to followers

A *follower* is a user (or system account) interested in updates about a given item. Followers are notified by the mail-notification-service when their item:

- fails one or more rules during the campaign's initial evaluation, or
- is still non-compliant at the campaign's end.

Followers are not notified for every incremental re-evaluation, only at the start and end of a campaign, to keep the signal-to-noise ratio reasonable.

## See also

- [Evaluation Criteria](./30_evaluation-criteria.md): how individual rules are evaluated.
- [Scorecards](./40_scorecards.md): how to express and roll up overall compliance posture.
- [Catalog Backoffice](../catalog-backoffice.md): where to monitor campaign progress in the UI.
