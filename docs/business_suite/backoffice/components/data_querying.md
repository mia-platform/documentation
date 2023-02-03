---
id: data_querying
title: Data Querying
sidebar_label: Data Querying
---
## bk-expanded-filters

Manages the display, application, and modification of filters.

```html
<bk-expanded-filters></bk-expanded-filters>
```

It displays a grid of filters.

The max number of columns is 4. They shrink to 3 or 2 columns depending on the window width.

:::warning
Either use `bk-filter-drawer` (with `bk-filters-manager`) or `bk-expanded-filters` because they both listen to the same event to be shown.
:::


### Configuration

Property `filtersConfig` allows to specify the filters to show. It is an array of dataschema properties and/or objects of dataschema property and operator (see add-filter event operators).

:::info
[Link](../events#add-filter) to add-filter event for the list of available operators
:::

#### Example

```json
...
  {
    "type": "element",
    "tag": "bk-expanded-filters",
    "properties": {
      "dataSchema": {
        "$ref": "dataSchema"
      },
      "filtersConfig": [
        {
          "property" :"orderedAt",
          "operator": "equal"
        },
        "dishes",
        "riderId"
      ]
    }
  }
...
```

If the operator is missing, `includesAll` operator is set by default for `multilookups` properties and `equal` operator for the others.

It is not possible to specify the same property more than once and properties with `filterOptions.hidden` set to true, are not shown even if specified.

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
| dataSchema | - | ExtendedJSONSchema7Definition| - |dataSchema to be included if some filter must be interpreted as hidden |
| filtersConfig | - | string \| ({property: string, operator: string})[] | - | lists the filters to include in the component |
| openByDefault | open-by-default | boolean | false | whether to show the component by default |
| liveSearchTimeout | live-search-timeout | number | 5000 | live-search timeout |
| liveSearchItemsLimit | live-search-items-limit | number | 10 | max items to fetch on regex live search |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[filter](../events#filter)|display/close the expanded filters component| - | - |

### Emits


| event | description |
|-------|-------------|
|[change-query](../events#change-query)| when done filling or clearing the form, applies or clear the filters |

### Bootstrap

None


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
|`editorHeight`|`editor-height`|string \| number| - | height of object/array editor |

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
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |dataSchema to be included if some filter must be interpreted as hidden |
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
|`placeholder`| - |[LocalizedText](../core_concepts#localization-and-i18n)|{}|placeholder of the search bar input |
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

### Tab Configuration

The `Tab` configuration object type is:

```typescript
type Tab {
  title: string | Record<string, string>
  filters?: ConfigurableTabFilter[]
  event?: Partial<Event>
  order?: number
  key: string
}
```

in which

- `order` is the tab order number
- `filters` is an array of filters that will be applied when the tab is opened. Read [Filters Configuration for details](#filters-configuration)
- `event` an event launched when the tab is opened


An example of configuration:

```json
  {
    "key": "pending",
    "title": {
      "en": "Pending",
      "it": "In attesa"
    },
    "filters": [
      {
        "property": "status",
        "operator": "equal",
        "value": "Pending"
      },
    ]
  },
  {
    "key": "preparing",
    "title": {
      "en": "Preparing",
      "it": "In preparazione"
    },
    "filters": [
      {
        "property": "status",
        "operator": "equal",
        "value": "Preparing"
      }
    ]
  }
```

#### Filters Configuration

The `ConfigurableTabFilter` object type is:

```typescript
type ConfigurableTabFilter {
  operator: FilterOperator // see add-filter event operator
  property: string
  value: string | number | boolean | any[] | DateOptions
}

type DateOptions = {
  value: string
  offset: number
  operation: 'add' | 'subtract'
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'millisecond'
}
```

:::info
[Link](../events#add-filter) to add-filter event for `FilterOperator` type
:::


As seen above, an example of a filter configuration could be:

```json
  ...
  "filters": [
    {
      "property": "status",
      "operator": "equal",
      "value": "Preparing"
    }
  ]
```

When filtering by a date, it is possible to use a special keyword in the value key: `$today`. If used, the value will correspond to the current date when the tab is opened. For example:

```json
  ...
  "filters": [
    {
      "property": "orderedAt",
      "operator": "less",
      "value": "$today"
    }
  ]
```

It is also possible to make a real-time data manipulation using the `DateOptions` type for the filter `value`. For example, if you want to show only the data from one week ago to today, you could configure a filter like this:

```json
  ...
  "filters": [
    {
      "property": "orderedAt",
      "operator": "greaterEqual",
      "value": {
        "value": "$today",
        "offset": 1,
        "unit": "week",
        "operation": "subtract"
      }
    }
  ]
```

In case of filter with operator `between`, `value` should be an array. `DateOptions` are still valid in this case. For instance:

```json
  ...
  "filters": [
    {
      "property": "orderedAt",
      "operator": "between",
      "value": [
        {
          "value": "$today",
          "offset": 1,
          "unit": "week",
          "operation": "subtract"
        },
        "$today"
      ]
    }
  ]
```

#### Accessing current user

It is possible to access information of the current user through handle-bar notation `{{currentUser}}`. For instance:

```json
  ...
  "filters": [
    {
      "property": "userField",
      "operator": "equal",
      "value": "{{currentUser.name}}"
    }
  ]
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
