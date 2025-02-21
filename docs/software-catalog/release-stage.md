---
id: release-stage
title: Item lifecycle management
sidebar_label: Item lifecycle
---

When creating or updating an item, the user can add information to help users identifying the maturity of the item.

There are 2 fields that define the release stage of an item:

- the `comingSoon` field is boolean, setting it to true will show the *Coming Soon* label and will prevent users to use the item
- the `releaseStage` field can have the following values:
  - *preview*
  - *beta*
  - *stable* (default)
  - *deprecated* a label will shown on the item according to the value of the field, except for the *stable* stage

:::info
Setting both the `releaseStage` and the `comingSoon` fields is not permitted and would lead to inconsistencies; please set either field or none according to the item lifecycle status.
:::

Refer to the [Items Lifecycle](/marketplace/overview_marketplace.md#marketplace-items-lifecycle) section for details about each specific release stage.