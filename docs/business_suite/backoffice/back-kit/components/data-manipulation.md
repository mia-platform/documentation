---
id: data-manipulation
title: Data Manipulation
sidebar_level: Data Manipulation
---



## File Picker Drawer

drawer containing a drag-and-drop area to handle file uploads/downloads

```html
<bk-file-picker-drawer></bk-file-picker-drawer>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`mask`|`mask`|boolean| - | - | - |whether to mask or not the drawer|
|`visible`|`visible`|boolean| - | - |false|drawer open or closed state|
|`width`|`width`|number| - | - |500|width occupied by the component|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-drawer](../events/events.md#using-drawer)|toggles the drawer into `visible` mode only if the id payload property matches this drawer| - | - |
|[loading-data](../events/events.md#loading-data)|allows disabling callToAction| - | - |
|[link-file-to-record](../events/events.md#link-file-to-record)|launches the upload of a file from selected ones| - | - |

### Emits

| event | description |
|-------|-------------|
|[using-drawer](../events/events.md#using-drawer)|notifies the drawer is used by this component|
|[update-data-with-file](../events/events.md#update-data-with-file)|updates data by uploading a new file and patching the dataset with its storage location metadata|
|[update-data](../events/events.md#update-data)|unlinks file on file delete|

### Bootstrap

None

## Footer

element counter set as page footer
and callToActions buttons acting on a selected dataset subset

```html
<bk-footer></bk-footer>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`disableStateChange`|`disable-state-change`|boolean| - | - |false|toggles state change facilities|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[count-data](../events/events.md#count-data)|adjusts footer counter to currently viewed dataset| - | - |
|[selected-data-bulk](../events/events.md#select-data-bulk)|prepares callToAction on a given dataset subset| - | - |

### Emits

This component emits no event.

### Bootstrap

None

## Form Drawer

Drawer containing a Form to edit or create items described by the `dataSchema`, once data is submitted for creation or update, drawer is put in loading state

```html
<bk-form-drawer></bk-form-drawer>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`customLabels`| - |BkFormDrawerLocale| - | - | - |custom localized texts shown as title and CTA button label|
|`dataCustomActions`| - |DataActionConfigWithHidden[]| - | - |[]|list of actions to render per row|
|`dataSchema`| - |DataSchema| - | - | - |[data schema](../layout.md#data-schema) describing the fields of the collection to filter|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |
|`width`|`width`|number| - | - |500|with of the drawer in pixels|

- `BkFormDrawerLocale` is an object with the following shape
>
> ```json
>{
>  create: {
>     TITLE: {it: '...', en: '...'},
>     CTA_LABEL: {it: '...', en: '...'}
>  },
>  update: {
>     TITLE: {it: '...', en: '...'},
>     CTA_LABEL: {it: '...', en: '...'}
>  },
>  unsavedChangesContent: {
>    it: '...',
>    en: '...'
>  }
>}
> ```
>
> | property | type | values | description |
> |----------|------|---------|-------------|
> | `create` | `DrawerLabels` | any | set of `DrawerLabels to be applied when the drawer is opened by an add-new event` |
> | `update` | `DrawerLabels` | any |  set of `DrawerLabels to be applied when the drawer is opened by a selected-data event` |
> | `unsavedChangesContent` | [localizedText](../concepts.md#localization-and-i18n) | any |  Confirmation modal content |
>
> #### DrawerLabels
> is an object with the following representation
>
> ```json
>     TITLE: {it: '...', en: '...'},
>     CTA_LABEL: {it: '...', en: '...'}
>```
>
> | property | type | values | description |
> |----------|------|---------|-------------|
> | `TITLE` | [localizedText](../concepts.md#localization-and-i18n) | any | title label to be applied in the heading of the drawer |
> | `CTA_LABEL` | [localizedText](../concepts.md#localization-and-i18n) | any | call to action label to be applied at the `submit` button at the bottom of the drawer |
- `DataActions['actions']` is an array of
>
> ```json
> {
>  "kind": "event",
>  "content": "duplicate-data",
>  "label": "Duplicate Data",
>  "icon": "far fa copy",
>  "meta": {}
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
|[using-drawer](../events/events.md#using-drawer)|toggles the drawer into `visible` mode only if the id payload property matches this drawer| - | - |
|[lookup-data](../events/events.md#lookup-data)|receives lookup data to be used to edit the items| - | - |
|[add-new](../events/events.md#add-new)|opens the drawer to create a new item, eventually applying default fields from data schema or data provided in the payload of the event| - | - |
|[selected-data](../events/events.md#selected-data)|opens the drawer to edit a selected item, applying filling in its fields from the data provided in the payload of the event| - | - |
|[success](../events/events.md#success)|closes the drawer if the success event meta has the `transactionId` emitted by the drawer and `triggeredBy` a `create-data` or `update-data`| - | - |
|[error](../events/events.md#error)|avoids closing the drawer and removes the loading state if the error event meta has the `transactionId` emitted by the drawer and `triggeredBy` a `create-data` or `update-data`| - | - |

### Emits

| event | description |
|-------|-------------|
|[using-drawer](../events/events.md#using-drawer)|notifies the drawer is used by this component|
|[create-data](../events/events.md#create-data)|sends the inserted data, as well as default or hidden fields for creation to the client, meta includes a unique transactionId|
|[update-data](../events/events.md#update-data)|sends the edited fields of the item for update, always includes `_id` and `__STATE__` necessary for the CRUD operations, meta includes a unique transactionId|

### Bootstrap

None

