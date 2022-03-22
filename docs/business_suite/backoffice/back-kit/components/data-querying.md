---
id: data-querying
title: Data Querying
sidebar_level: Data Querying
---



## Filter Drawer

This is the filter drawer

```html
<bk-filter-drawer></bk-filter-drawer>
```

![filter-drawer](../img/components/bk-filter-drawer.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`dataSchema`| - |DataSchema| - | - | - | - |
|`liveSearchItemsLimit`|`live-search-items-limit`|number| - | - |10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number| - | - |5000|live-search timeout|
|`width`|`width`|string| - | - | - |width occupied by the component|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-form-container](../events/events.md#using-form-container)|toggles the drawer into `visible` mode only if the id payload property matches this drawer| - | - |
|[filter](../events/events.md#filter)|claims the drawer, closing concurrent ones, to enter a new filter|[using-form-container](../events/events.md#using-form-container)| - |
|[change-filter](../events/events.md#change-filter)|enters filter edit mode|[using-form-container](../events/events.md#using-form-container)| - |
|[lookup-data](../events/events.md#lookup-data)|receives lookup data| - | - |
|[loading-data](../events/events.md#loading-data)|sets the component to loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[using-form-container](../events/events.md#using-form-container)|notifies the drawer is used by this component|
|[add-filter](../events/events.md#add-filter)|when done filling the form, notices deployment of a new filter|

### Bootstrap

This component does not use bootstrap.

## Filters Manager

Manages the display, application, and modification of filters.

```html
<bk-filters-manager></bk-filters-manager>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`filters`| - |Filter[]| - | - |[]|List of currently applied [filters](../concepts.md#filters)|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[add-filter](../events/events.md#add-filter)|applies a new filter|[change-query](../events/events.md#change-query)| - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data filtering|
|[change-filter](../events/events.md#change-filter)|triggers the modification of an existing filter|

### Bootstrap

- This component parses the URL for `filters` parameter.
- This component emits a `change-query` event if `filters` is found in the URL.

## Pagination

displays pagination navigation tools to query pages of a dataset.
It allows going back and forward and skip to first and last page. It shows the current page and total elements in a given
dataset while interacting with dynamic filters

```html
<bk-pagination></bk-pagination>
```

![pagination](../img/components/bk-pagination.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`pageSize`|`page-size`|number| - | - |DEFAULT_PAGE_SIZE|number of data items per page.|
|`pageSizeOptions`| - |number[]| - | - |DEFAULT_PAGE_OPTIONS|available page sizes|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[count-data](../events/events.md#count-data)|adjusts footer counter to currently viewed dataset| - | - |
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step. Emits nested-navigation-state/display with slice of data to display|[nested-navigation-state/display](../events/events.md#nested-navigation-state---display)| - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps. Emits nested-navigation-state/display with slice of data to display|[nested-navigation-state/display](../events/events.md#nested-navigation-state---display)| - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data filtered according with the current pagination|
|[nested-navigation-state/display](../events/events.md#nested-navigation-state---display)|emits nested-navigation-state/display with slice of data to display|

### Bootstrap

- This component parses `pageSize` and `pageNumber` URL parameters.
- This component emits a `change-query` event to notify current pagination.

## Search Bar

Allows data filtering by matching a text string

```html
<bk-search-bar></bk-search-bar>
```

![search-bar](../img/components/bk-search-bar.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`placeholder`| - |string \\| { [x: string]: string; }| - | - | - |placeholder of the search bar input|
|`searchDebounce`|`search-debounce`|number| - | - |0|time to wait before performing an automatic search|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data filtered according with the typed input|

### Bootstrap

This component does not use bootstrap.

## Tabs

provides a fixed set of filters rendered as tabs, possibly on top of a bk-table

```html
<bk-tabs></bk-tabs>
```

![tabs](../img/components/bk-tabs.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`tabs`| - |Tab[]| - | - |[]|array with tabs configuration|

- `Tab` is given by the following schema

> ```json
> {
>   "title": {
>     "type": ["string", "object"]
>   },
>   "filters": {
>     "type": "array",
>   }
> }
> ```

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requests filtering on dataset|

### Bootstrap

- This component parses `characteristic` URL parameter.
- This component emits a `change-query` event to notify current focused tab and filter.
