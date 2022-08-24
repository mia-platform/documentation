---
id: data_querying
title: Data Querying
sidebar_label: Data Querying
---
## bk-export-modal

Modal to allow user configuration of a data export task

```html
<bk-export-modal></bk-export-modal>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|


### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|export-data/awaiting-config|prompts modal opening| - | - |

### Emits


| event | description |
|-------|-------------|
|export-data/user-config|notifies the bus of user config for next export data task|

### Bootstrap

None

## bk-filter-drawer

This is the filter drawer
![filter-drawer](../img/bk-filter-drawer.png)

```html
<bk-filter-drawer></bk-filter-drawer>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - | - |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`width`|`width`|string| - |width occupied by the component |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-form-container](../events#using-form-container)|toggles the drawer into `visible` mode only if the id payload property matches this drawer| - | - |
|[filter](../events#filter)|claims the drawer, closing concurrent ones, to enter a new filter|[using-form-container](../events#using-form-container)| - |
|[change-filter](../events#change-filter)|enters filter edit mode|[using-form-container](../events#using-form-container)| - |
|[lookup-data](../events#lookup-data)|receives lookup data| - | - |
|[loading-data](../events#loading-data)|sets the component to loading state| - | - |

### Emits


| event | description |
|-------|-------------|
|[add-filter](../events#add-filter)|when done filling the form, notices deployment of a new filter|

### Bootstrap

None

## bk-filters-manager

Manages the display, application, and modification of filters.

```html
<bk-filters-manager></bk-filters-manager>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`bootstrapOnReconnect`|`bootstrap-on-reconnect`|boolean|false|If true should restart from initial configured filters |
|`dataSchema`| - |ExtendedJSONSchema7Definition|...|dataSchema to be included if some filter must be interpreted as hidden |
|`filters`| - |Filter[]|[]|List of currently applied [filters](../core_concepts#filters) |
|`hide`|`hide`|boolean|false|Hides the rendered component |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[add-filter](../events#add-filter)|applies a new filter|[change-query](../events#change-query)| - |

### Emits


| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requires data filtering|
|[change-filter](../events#change-filter)|triggers the modification of an existing filter|

### Bootstrap

None

## bk-pagination

displays pagination navigation tools to query pages of a dataset.
It allows going back and forward and skip to first and last page. It shows the current page and total elements in a given
dataset while interacting with dynamic filters

```html
<bk-pagination></bk-pagination>
```

![pagination](../img/bk-pagination.png)

<!-- The property `buttonsOnly` can be utilized to edit the visualization of the component. If `buttonsOnly` is true, only buttons allowing to go to the 'next' and 'previous' page, as well as a page size menu, will be displayed.
By default, this modality is only enabled if the pagination reads a negative total from the [count-data](../events#count-data) event, which corresponds to the value 'on-negative-total' of `buttonsOnly`. Other possible values are true and false, which respectively always and never enable the reduced modality. -->


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`pageSize`|`page-size`|number|DEFAULT_PAGE_SIZE|number of data items per page|
|`pageSizeOptions`| - |number[]|DEFAULT_PAGE_OPTIONS|available page sizes|

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[count-data](../events#count-data)|adjusts footer counter to currently viewed dataset| - | - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step. Emits nested-navigation-state/display with slice of data to display|[nested-navigation-state/display](../events#nested-navigation-state---display)| - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps. Emits nested-navigation-state/display with slice of data to display|[nested-navigation-state/display](../events#nested-navigation-state---display)| - |

### Emits


| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requires data filtered according with the current pagination|
|[nested-navigation-state/display](../events#nested-navigation-state---display)|emits nested-navigation-state/display with slice of data to display|

### Bootstrap

None

## bk-search-bar

Allows data filtering by matching a text string

```html
<bk-search-bar></bk-search-bar>
```

![search-bar](../img/bk-search-bar.png)

Search bar allows to filter data against text using a regex. If `searchLookups` is `true`, lookups and multi-lookups that specify `excludeFromSearch` as `false` in the schema are also searched. The text value is compared against the `lookupFields` specified in the `lookupOptions` in the schema.

:::warning
Searching lookup fields could be computationally heavy. The number of searchable lookups should be kept to the needed minimum and search-bar properties such as `liveSearchItemsLimit` and `autoSearchMinInput` should be configured carefully.
:::


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`autoSearchMinInput`|`auto-search-min-input`|number|2|min length of input string before performing automatic search|
|`liveSearchItemsLimit`|`live-search-items-limit`|number|100|max items to fetch on regex live search|
|`placeholder`| - |LocalizedText|{}|placeholder of the search bar input |
|`searchDebounce`|`search-debounce`|number|0|time to wait before performing an automatic search. If 0, automatic search is disabled|
|`searchLookups`|`search-lookups`|boolean|false|whether or not to perform search on lookups. If true, `lookup-crud-client` (or any component listening to `search-lookups` and emitting `search-lookups-found`) should be included in the plugin|

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|keeps track of navigation steps| - | - |
|[search-lookups-found](../events#search-lookups-found)|includes lookup values searched against text search|[change-query](../events#change-query)| - |

### Emits


| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requires data filtered according with the typed input|
|[search-lookups](../events#search-lookups)|notifies to search lookups against a text|

### Bootstrap

None

## bk-tabs

provides a fixed set of filters rendered as tabs, possibly on top of a bk-table ![tabs](../img/bk-tabs.png)

```html
<bk-tabs></bk-tabs>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`tabs`| - |Tab[]|[]|array with tabs configuration. For configuration ease, Tabs will be provided as an array by the user and remapped on startup to better fit the react component|

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |

### Emits


| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requests filtering on dataset|

### Bootstrap

None
