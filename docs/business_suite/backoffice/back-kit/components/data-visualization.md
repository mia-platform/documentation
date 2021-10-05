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

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`date`| - |Date| - | - |new Date()|current date of the calendar|
|`view`| - |"agenda" \| "day" | "month" | "week" | "work_week"| - | - |'month'|current view of the calendar. Possible values are `month`, `week`, or `day`|

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
- This component emits a [change-query](../events/events.md#change-query) event.

## Table

Displays a dataset in rows and columns according to a given [data schema](../layout.md#data-schema).

```html
<bk-table></bk-table>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`browseOnRowSelect`| - |{ href?: string; target?: string; query?: LinkQueryParams; }| - | - | - |if set, a click on a row will navigate you to another location|
|`dataSchema`| - |DataSchema| - | - | - |[data schema](../layout.md#data-schema) describing the fields of the collection to display|
|`disableRowClick`|`disable-row-click`|boolean| - | - |false|when `true`, a click on a row does not trigger an event|
|`disableRowSelectionChange`|`disable-row-selection-change`|boolean| - | - |false|when `true`, selecting a row through the checkbox in the first column does not trigger an event|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |
|`rowActions`| - |DataActions| - | - | - |list of actions to render per row|

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
|[display-data](../events/events.md#display-data)|receives data to display|[selected-data-bulk](../events/events.md#select-data-bulk)| - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires data sorting according with the sorted property|
|[selected-data](../events/events.md#selected-data)|notifies about the click on a row|
|[selected-data-bulk](../events/events.md#select-data-bulk)|notifies about a change in the rows selected through the checkboxes in the first column|
|[selected-data-bulk](../events/events.md#select-data-bulk)|notifies about a change in the rows selected through the checkboxes in the first column|
|Configurable custom events|any event configured in the `rowActions` property|

### Bootstrap

- This component parse URL for `sortDirection` and `sortProperty` parameters.
- This component emits a [change-query](../events/events.md#change-query) event if both `sortDirection` and `sortProperty` are found in the URL.

