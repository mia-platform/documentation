---
id: buttons
title: Buttons
sidebar_level: Buttons
---



Buttons are scoped by their signature event and often start event-driven processing notifying the `eventBus` about user actions.


## Add Filter

Notifies other components that a filter needs to be created. Such event could be collected by a [bk-filter-drawer](data-querying.md#filter-drawer).

```html
<bk-add-filter-button></bk-add-filter-button>
```

### Properties & Attributes

This component has no properties.

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[filter](../events/events.md#filter)|notifies the request for creating a filter|

### Bootstrap

None

## Add New

this button creates a new item

```html
<bk-add-new-button></bk-add-new-button>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`browseOnButtonClick`| - |{ href?: string; target?: string; query?: LinkQueryParams; }| - | - | - |when provided with a valid schema, overrides the button JavaScript `onclick` listener handler allowing an `href` linking|

- `LinkQueryParams` is a key-value object containing query parameters


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[add-new](../events/events.md#add-new)|notifies the request for creating a new item|

### Bootstrap

None

## Refresh Button

Allows refreshing some resource

```html
<bk-refresh-button></bk-refresh-button>
```

### Properties & Attributes

This component has no properties.

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires refresh without modifying current `CRUD` query by attaching an empty payload|

### Bootstrap

None

