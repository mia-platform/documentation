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

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`dataSchema`| - |DataSchema| - | - | - | - |
|`width`|`width`|string| - | - | - |width occupied by the component|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-drawer](../events/events.md#using-drawer)|toggles the drawer into `visible` mode only if the id payload property matches this drawer| - | - |
|[filter](../events/events.md#filter)|claims the drawer, closing concurrent ones, to enter a new filter| - | - |
|[lookup-data](../events/events.md#lookup-data)|if lookup-data is to be expected in the dataSchema puts the drawer in loading until the lookup-data has been retrieved| - | - |
|[change-filter](../events/events.md#change-filter)|enters filter edit mode| - | - |
|[lookup-data](../events/events.md#lookup-data)|receives lookup data| - | - |

### Emits

| event | description |
|-------|-------------|
|[using-drawer](../events/events.md#using-drawer)|notifies the drawer is used by this component|
|[add-filter](../events/events.md#add-filter)|when done filling the form, notices deployment of a new filter|

### Bootstrap

None

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
- This component emits a [change-query](../events/events.md#change-query) event if `filters` is found in the URL.

## Pagination

displays pagination navigation tools to query pages of a dataset.
It allows going back and forward and skip to first and last page. It shows the current page and total elements in a given
dataset while interacting with dynamic filters

```html
<bk-pagination></bk-pagination>
```

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

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data filtered according with the current pagination|

### Bootstrap

- This component parses `pageSize` and `pageNumber` URL parameters.
- This component emits a [change-query](../events/events.md#change-query) event to notify current pagination.

## Search Bar

Allows data filtering by matching a text string

```html
<bk-search-bar></bk-search-bar>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`placeholder`| - |string \| { [x: string]: string; }| - | - | - |placeholder of the search bar input|
|`searchDebounce`|`search-debounce`|number| - | - |0|time to wait before performing an automatic search|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data filtered according with the typed input|

### Bootstrap

None

## Tabs

provides a fixed set of filters rendered as tabs, possibly on top of a [bk-table](data-visualization.md#table)

```html
<bk-tabs></bk-tabs>
```

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

This component listens to no event.

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requests filtering on dataset|

### Bootstrap

- This component parses `characteristic` URL parameter.
- This component emits a [change-query](../events/events.md#change-query) event to notify current focused tab and filter.

