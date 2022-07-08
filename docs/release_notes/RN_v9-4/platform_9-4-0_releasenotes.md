---
id: v9.4.0
title: Version v9.4.0 Release Notes
sidebar_label: v9.4.0
image: "img/release-note-link-preview.png"
---

_July, 7th 2022_

## Fast Data

### BREAKING CHANGES

#### Strategies Low Code handling of MongoDB queries

A bug has been fixed in how `conditions` in [ER Schema](/docs/fast_data/real_time_updater/low-code-configuration#er-schema-configuration) are converted into MongoDB queries while running strategies. Since the bug might generete still queries valid for MongoDB, even though not logically correct for user intentions, and no error was thrown, we decided to report this fix as a Breaking Change because this fix may bring to different documents to be selected (or not selected) in your Strategies, with different single views to be updated.

The conditions afflicted to the bug were the ones like this:

```json
{
    "$and": [
        "id": {
            "$eq": "ID_DISH"
        },
        ...
    ]
}
```
The value associated to the MongoDB operator was not replaced by the value of the field with that name before being executed on MongoDB.

<details>
<summary>
Click me for a deeper explanation of the bug.
</summary>

`Condition` used in Strategies Low Code did not handle correctly MongoDB queries.

```json
{
    "$and": [
        { "id": "ID_DISH" },
        ...
    ]
}
```

The query above was correctly executed as follows (supposing `ID_DISH` equals to `abc123`):
```json
{
    "$and": [
        { "id": "abc123" },
        ...
    ]
}
```

but the following query, even though semantically equivalent to the previous one, was kept instead as it is without any substitution of field value:

```json title="id must be equal to the string 'ID_DISH'"
{
    "$and": [
        "id": {
            "$eq": "ID_DISH"
        },
        ...
    ]
}
```

Since the two queries are semantically the same, now the latter is correctly converted into a query with `abc123` instead of `ID_DISH`:

```json title="id must be equal to the string 'abc123'"
{
    "$and": [
        "id": {
            "$eq": "abc123"
        },
        ...
    ]
}
```
</details>


<details>
<summary>
What do I need to do?
</summary>

**I wanted the behavior I had before the fix**

If you are using queries like the one above, and you do want to perform operation against the raw string and not the value of the field with that name (e.g. you want to check "equals to the string ID_USER"), you can use the cast operator of Low Code:

```json
{
    "$and": [
        "id": {
            "$eq": "__string__[ID_DISH]"
        },
        ...
    ]
}
```

in this way the query performed on MongoDB will actually be:

```json title="the cast string operator allow you to keep the value passed as string and prevent substitution with the field value"
{
    "$and": [
        "id": {
            "$eq": "ID_DISH"
        },
        ...
    ]
}
```

**The new behavior is actually what I already expected to happen**

Perfect! Then just update the Real-Time Updater to `v6.0.0` and enjoy the fix.

</details>

The fix above is available since `v6.0.0` of Real-Time Updater. This fix has been declared as a Breaking Change since project may encounter issues if their strategies include queries like the one above.

### New Features

### Single View configuration Low Code in a dedicated area

Single View page now contains a [dedicated tab](/docs/fast_data/reworked_doc/configuration/single_views#create-the-single-view-creator-service) where you can configure your Low Code aggregation without having to navigate to the Microservice page. The Console will help you to write your configuration thanks to a correctness check of your configuration syntax.
Link card of a Single View service to the Single View has been moved into the same page of the one above.

#### Generate Single View with a state different from PUBLIC

Since version `v5.0.0` of Single View Creator service and `v12.0.0` of the `@mia-platform-internal/single-view-creator-lib`, returning a single view with the field `__STATE__` from the [aggregation](/docs/fast_data/single_view_creator/low-code-configuration#aggregation) will update the Single View to that state.

#### Generate Single View Update message

Since version `v4.3.0` of Single View Creator service and `v11.1.1` of `@mia-platform-internal/single-view-creator-lib`, when a Single View is updated a [Kafka message](/docs/fast_data/reworked_doc/inputs_and_outputs#single-view-update) is sent to notify that.

[Single View Before After](/docs/fast_data/reworked_doc/inputs_and_outputs#single-view-before-after) message and [Single View Event](/docs/fast_data/reworked_doc/inputs_and_outputs#single-view-event) are deprecated and will be removed in future versions.

### Bug Fix

#### Import Projections from file

Due to security reasons, [import projections from a DDL file](/docs/fast_data/create_projection#import-multiple-projections-from-a-ddl-file) has now a size limit of 20 MB.

#### Default Cast function defaultCastToDate

The [default cast function](/docs/fast_data/cast_functions#cast-function-default) `defaultCastToDate` when receiving a `null` value converted it to the `epoch` value. This has been fixed, and now it will be converted to undefined as any other invalid value.

## Console

### Improvements

#### Added support for commit list for GitHub-based projects

GitHub-based Project can now view the commit list on the current branch they are working on in the Design section

## Marketplace

### Marketplace updates

- Updated Payment Gateway Manager plugin to v2.5.0. This update provides the following features and improvements:
  - enable support of recurrent payments strategy when using Gestpay (Axerve) as payment provider and credit cards or Paypal as payment methods.
    **Note**: installment payments are not executed automatically, since the plugin only instructs the provider to enable a recurrent strategy. Therefore, it is the plugin client in charge of periodically execute payments through the new payment endpoint.
  - upgraded dependencies to fix potential vulnerabilities
  - minor fixes

### Security update for the following microservices

- [api-portal](/docs/runtime_suite/api-portal/changelog) (v1.16.4)
- [swagger-aggregator](/docs/runtime_suite/swagger-aggregator/changelog) (v3.4.7)

#### Solved a potential security breach of SES Mail Service

It has been solved a potential security breach findable on versions v3.0.0 or lower, that allows a user to exfiltrate the SES API Key and Secret when the service is not correctly configured.
Thus, it is suggested to update the service to v3.1.0, or to give a check on the correctness of the pair API Key/Secret configuration.

## Backoffice - 1.0.5

### New features

#### Added support to static filters

Updated `bk-filters-manager` web component so that it supports hidden static filters, allowing to add filters that are not displayed to the user.

### Improvements

#### Crud client allows 204 response

Updated `bk-crud-client` web component so that patch response can also be a 204 no-content.

#### Pagination automatically resets

Updated `bk-pagination` web component so that it automatically resets the page number to 1 when data count and current page are inconsistent.

#### Table does not render empty column action

Updated `bk-table` web component so that it does not render the action column when this is empty.

### Bug Fix

#### Fixed lookup resolution in wizard

Fixed bug in web component `bk-form-modal`, which now correctly resolves lookups in wizard mode.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 7.1.2`.
