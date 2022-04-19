---
id: data-visualization
title: Data Visualization
sidebar_level: Data Visualization
---



## Calendar

Renders a calendar to manage appointments.

```html
<bk-calendar></bk-calendar>
```

![calendar](../img/components/bk-calendar.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`additionalCreatePayload`| - |{ [x: string]: any; }| - | - |{}|data that should be passed in the payload of a new event alongside `startDate` and `endDate`|
|`date`| - |Date| - | - |new Date()|current date of the calendar|
|`height`|`height`|string| - | - | - |css-height the calendar should occupy in the page as described here: [https://developer.mozilla.org/en-US/docs/Web/CSS/height]|
|`view`| - |"agenda" \\| "day" \| "month" \| "week" \| "work_week"| - | - |'month'|current view of the calendar. Possible values are `month`, `week`, or `day`|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[display-data](../events/events.md#display-data)|receives data to display| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data that fall ion the currently visualized month|
|[add-new](../events/events.md#add-new)|triggers the creation of a new event with the selected `start` and `end`|
|[selected-data](../events/events.md#selected-data)|notifies about the click on an event|
|[update-data](../events/events.md#update-data)|triggers the update of the `start` and `end` of an event|

### Bootstrap

- This component parse URL for `date` and `view` parameters.
- This component emits a `change-query` event.

## Table

Displays a dataset in rows and columns according to a given `data schema`.

```html
<bk-table></bk-table>
```

![table](../img/components/bk-table.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`allowNavigation`|`allow-navigation`|boolean| - | - |true|when `true`, it is possible to navigate to nested objects and arrays if a dataSchema is specified|
|`browseOnRowSelect`| - |{ href?: string; target?: string; query?: LinkQueryParams; }| - | - | - |if set, a click on a row will navigate you to another location|
|`customMessageOnAbsentLookup`| - |string \\| { [x: string]: string; }|true| - | - |override lookup value in case lookup is not resolved due to lack of data|
|`dataSchema`| - |DataSchema| - | - | - |[data schema](../layout.md#data-schema) describing the fields of the collection to display|
|`disableRowClick`|`disable-row-click`|boolean| - | - |false|when `true`, a click on a row does not trigger an event|
|`disableRowSelectionChange`|`disable-row-selection-change`|boolean| - | - |false|when `true`, selecting a row through the checkbox in the first column does not trigger an event|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |
|`initialSortDirection`| - |any| - | - | - |initial sorting direction to use when component bootstraps|
|`initialSortProperty`| - |any| - | - | - |Initial property to sort on when component bootstraps|
|`maxLines`|`max-lines`|number| - | - | - |force lines that will be displayed together|
|`navigationRowActions`| - |NavigationDataActions| - | - |DEFATULT_NAV_ACTIONS|actions in nested objects.|
|`rowActions`| - |DataActions| - | - | - |list of actions to render per row|

- `NavigationDataActions` is an object such as
>
> ```json
> {
>   "kind": "icons",
>   "actions": [{
>     "requireConfirm": true,
>     "type": "delete",
>     "disableInReadonly": true
>   }]
> }
> ```
>
> | property | type | values | description |
> |-----------------------|------|---------|-------------|
> | `kind` | `string` | `cta`, `icons` | whether to display the action in form of text or icon. |
> | `actions` | array of actions | any | describes the behavior of each. |
>
> #### action object
>
> | property | type | values | description |
> |----------|------|--------|-------------|
> | `requireConfirm` | booelan | any | Whether or not to require confirm. |
> | `type` | `string` | 'delete', 'detail' | if `delete`, the row is deleted from the nested object (and `update-data` event is emitted). If `detail`, a `selected-data` event is emitted with heh data from the row.|
> | `disableInReadonly` | boolean | any | Whether or not to disable the action for read-only nested objects. |
>
> By default:
>
> ```json
> {
>   "kind": "icons",
>   "actions": [{
>     "requireConfirm": true,
>     "type": "delete",
>     "disableInReadonly": true
>   }]
> }
> ```
>
- `DataActions` is an array of
>
> ```json
> {
>   "actions": [{
>     "kind": "event",
>     "content": "duplicate-data",
>     "label": "Duplicate Data",
>     "icon": "far fa copy",
>     "meta": {},
>     "requireConfirm": {}
>   }]
> }
> ```
>
> | property | type | values | description |
> |-----------------------|------|---------|-------------|
> | `kind`              | `string` | `httpPost`, `event` | when `event` fires an event in the `eventBus`, otherwise performs a `POST` request with the content of the row as body |
> | `content` | `string` | any | when `event` it must be the label of a [registered event](../events/events.md), otherwise the `POST` request destination href |
> | `label` | `string`| any | a label to render with the row action button |
> | `icon` | `string` | any | [Fontawesome fas or far icon](https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular,solid&m=free) |
> | `meta` | `object` | any | the event `meta` when `kind` is `event` |
> | `requireConfirm` | `object` or 'boolean' | any | The customizable properties of the modal that will be prompted or `true` for default Modal |
>
> #### requireConfirm object
> | property | type | values | description |
> |----------|------|--------|-------------|
> | `cancelText` | [localizedText](../concepts.md#localization-and-i18n) | any | Cancel button label |
> | `content` | [localizedText](../concepts.md#localization-and-i18n) | any | Text content of the modal |
> | `okText` | [localizedText](../concepts.md#localization-and-i18n) | any | Confirm button label |
> | `title` | [localizedText](../concepts.md#localization-and-i18n) | any | Title of the modal |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[lookup-data](../events/events.md#lookup-data)|receives lookup data| - | - |
|[display-data](../events/events.md#display-data)|receives data to display|[selected-data-bulk](../events/events.md#selected-data-bulk)| - |
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |
|[nested-navigation-state/display](../events/events.md#nested-navigation-state---display)|updates internal representation of the data to display in navigation| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data sorting according with the sorted property|
|[selected-data](../events/events.md#selected-data)|notifies about the click on a row|
|[selected-data-bulk](../events/events.md#selected-data-bulk)|notifies about a change in the rows selected through the checkboxes in the first column|
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|notifies to add a step in the navigation path|
|[Configurable custom events](../events/events.md#Configurable custom events)|any event configured in the `rowActions` property|

### Bootstrap

- This component parse URL for `sortDirection` and `sortProperty` parameters.
- This component emits a `change-query` event if both `sortDirection` and `sortProperty` are found in the URL.

## Breadcrumbs

represents current navigation path and allows to go back at any navigation level.

```html
<bk-breadcrumbs></bk-breadcrumbs>
```

![breadcrumbs](../img/components/bk-breadcrumbs.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |DataSchema| - |data schema describing the fields of the collection to display |
|`showHome`|`show-home`|boolean|true|toggles visualization of a `home` icon at breadcrumbs 0-level |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |
|[change-query](../events/events.md#change-query)|triggers page refresh and goes back to 0-level, unless empty payload| - | - |
|[display-data](../events/events.md#display-data)|triggers page refresh and tries to recreate navigation path with new data. If fails, goes back to 0-level| - | - |

### Emits

| event | description |
|-------|-------------|
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|notifies to go back the specified number of steps in the navigation path|

### Bootstrap

This component does not use bootstrap.
