---
id: data_manipulation
title: Data Manipulation
sidebar_label: Data Manipulation
---
## bk-file-picker-drawer

drawer containing a drag-and-drop area to handle file uploads/downloads

```html
<bk-file-picker-drawer></bk-file-picker-drawer>
```

### Configuration for an array of files

To use the `bk-fie-picker-drawer` with an array of file, it is necessary to pass the dataschema as a property in the configuration, otherwise the component will handle only one file at a time.

Example of configuration
```json
  ...
  {
    "type": "element",
    "tag": "bk-file-picker-drawer",
    "properties": {
      "dataSchema": {
        "$ref": "dataSchema"
      }
    }
  },
  ...
```

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing the fields of the collection to manipulate |
|`mask`|`mask`|boolean|true|whether to mask or not the drawer |
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`width`|`width`|number|500|width occupied by the component |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-form-container](../events#using-form-container)|toggles the drawer into `visible` mode only if the id payload property matches this drawer| - | - |
|[loading-data](../events#loading-data)|allows disabling callToAction| - | - |
|[link-file-to-record](../events#link-file-to-record)|launches the upload of a file from selected ones| - | - |

### Emits


| event | description |
|-------|-------------|
|[update-data-with-file](../events#update-data-with-file)|updates data by uploading a new file and patching the dataset with its storage location metadata|
|[update-data](../events#update-data)|unlinks file on file delete|

### Bootstrap

None

## bk-footer

element counter set as page footer and callToActions buttons acting on a selected dataset subset
![footer](../img/bk-footer.png)

```html
<bk-footer></bk-footer>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`disableStateChange`|`disable-state-change`|boolean|false|toggles state change facilities |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[count-data](../events#count-data)|adjusts footer counter to currently viewed dataset| - | - |
|[selected-data-bulk](../events#selected-data-bulk)|prepares callToAction on a given dataset subset| - | - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |

### Emits

This component emits no event.

### Bootstrap

None

## bk-form

Generic form to edit or create items described by the `dataSchema`

```html
<bk-form></bk-form>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`allowNavigation`| - |boolean \\| "show-editor"|true|when `true`, object and arrays are displayed as a clickable label which allows to navigate to nested objects and arrays, if a dataSchema is specified; when `show-editor`, the navigation is allowed and the object/array fields are displayed in a json editor.; when `false`, the navigation is not allowed, and the object/array fields are displayed in a json editor. |
|`allowObjectAsTable`|`allow-object-as-table`|boolean|false|allows to visualize objects and arrays without specific format in both a text-area and read-only table |
|`customMessageOnAbsentLookup`| - |LocalizedText| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing the fields of the collection to manipulate |
|`extraEndpoint`|`extra-endpoint`|string| - |when specified, it is possible to perform a POST request to an external collection specified by the endpoint |
|`formId`|`form-id`|string| - |id of the form. This property should only be set programmatically. |
|`formKindIfDisplayData`| - |"add" \\| "edit"| - |data management strategy when setting initial values from displayData: add or edit (default). |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`onFieldsChange`| - |Function| - | - |
|`onLoading`| - |Function| - | - |
|`onWizardStepAttempted`| - |Function| - | - |
|`openingEvent`| - |OpeningEvent \\| OpeningEvent[]|[]|what opening event to listen to. If includes 'insert', `add-new` events will be listened to, if includes 'select', `selected-data` events will be listened to. |
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[add-new](../events#add-new)|configures the form to create a new element, eventually applying default fields from data schema or data provided in the payload of the event|`create-data-with-file`, `create-data`| - |
|[add-new-external](../events#add-new-external)|configures the form to create a new item on an external collection|`success`, `error`| - |
|[selected-data](../events#selected-data)|configures the form to edit a selected item, applying filling in its fields from the data provided in the payload of the event|`update-data-with-file`, `update-data`| - |
|[display-data](../events#display-data)|trigger the form to start listening for `lookup-data` events| - | - |
|[lookup-data](../events#lookup-data)|if follows a `display-data` event, builds the options to display for lookups| - |[error](../events#error)|
|[submit-form/request](../events#submit-form---request)|requests the form to submit its content| - | - |

### Emits


| event | description |
|-------|-------------|
|[create-data](../events#create-data)|sends the inserted data, as well as default or hidden fields for creation to the client, meta includes a unique transactionId|
|[update-data](../events#update-data)|sends the edited fields of the item for update, always includes `_id` and `__STATE__` necessary for the CRUD operations, meta includes a unique transactionId|
|[update-data-with-file](../events#update-data-with-file)|notifies the file-manager that files have to be uploaded and the collection has to be patched with payload data|
|[create-data-with-file](../events#create-data-with-file)|notifies the file-manager that files have to be uploaded and a new item in the collection has to be created with payload data|
|[nested-navigation-state/push](../events#nested-navigation-state---push)|notifies to add a step in the navigation path|
|[submit-form/success](../events#submit-form---success)|notifies that the form has been submitted|
|[error](../events#error)|contains http error messages when something goes wrong|
|[success](../events#success)|notifies a successful http request|

### Bootstrap

None

## bk-form-card

Card containing a Form to edit or create items described by the `dataSchema`. The component contains a generic Form component, thus it listens to and emits all the events that this does.

```html
<bk-form-card></bk-form-card>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`customLabels`| - |Partial\<FormCardLocale\>| - |custom localized texts shown as CTA buttons labels|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing the fields of the collection to filter |
|`enableSubmitOnFormUntouched`|`enable-submit-on-form-untouched`|boolean|false|boolean to enable footer call-to-action even if no field within the form has been touched |
|`formKind`| - |"add" \\| "edit"|'edit'|data management strategy when setting initial values from displayData: add or edit (default) |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |
|`editorHeight`|`editor-height`|string \\| number| - | height of object/array editor |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[display-data](../events#display-data)|trigger the initial data of the form| - | - |

### Emits


| event | description |
|-------|-------------|
|[create-data](../events#create-data)|sends the inserted data, as well as default or hidden fields for creation to the client, meta includes a unique transactionId|
|[update-data](../events#update-data)|sends the edited fields of the item for update, always includes `_id` and `__STATE__` necessary for the CRUD operations, meta includes a unique transactionId|
|[update-data-with-file](../events#update-data-with-file)|notifies the file-manager that files have to be uploaded and the collection has to be patched with payload data|
|[create-data-with-file](../events#create-data-with-file)|notifies the file-manager that files have to be uploaded and a new item in the collection has to be created with payload data|
|[error](../events#error)|contains http error messages when something goes wrong|

### Bootstrap

None

## bk-form-drawer

Drawer containing a Form to edit or create items described by the `dataSchema`, once data is submitted for creation or update, drawer is put in loading state. The component is composed of a generic Drawer component, a generic Form component, thus it listens to and emits all the events that these do.

```html
<bk-form-drawer></bk-form-drawer>
```

![form-drawer](../img/bk-form-drawer.png)

### bk-form-drawer

`bk-form-drawer` is used to display a Drawer containing a Form to edit or create items described by the `dataSchema`.

The Drawer can be opened in two different modes:

- *insert*, by listening the `add-new` event
- *edit*, by listening the `selected-data` event

### Drawer modes

#### Insert

Example of configuration for form-drawer component in insert/edit mode:

```json
{
  "type": "element",
  "tag": "bk-form-drawer",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        ...
      }
    },
    ...
}
```

When the component reacts to the `add-new` event it opens the drawer with the initial values specified in the payload of the event. By clicking on the action button of the Form you can submit the content to perform an upload of a new item. If the form contains files, the component emits a `createDataWithFile` event where payload contains all the data of the form, including files. If no file is specified, a `createData` event is used. In both cases, a `transactionId` is used inside the meta field of the event to handle possible errors.

#### Edit

The `selected-data` event opens the drawer in edit mode with possible initial values specified in the payload of the event. In this case, the action button of the Form perform an update of an existing field. If the form contains files, the component emits a `updateDataWithFile` event where payload contains all the data of the form. If no file is specified, a `updateData` event is used. In both cases, a `transactionId` is used inside the meta field of the event to handle possible errors.  

#### After submission

When done filling up this drawer form, usually `bk-form-drawer` performs an `update-data` or `create-data` according to the operation invoked to open it (either `add-new` or `select-data`). Usually an http-like client takes care of these operations.
It is often useful to perform other tasks upon successful creation or editing. The prop `afterFinishEvents` allows to append events or `pushState` navigation instructions. To configure this feature we can provide to `afterFinishEvents`

1. a string, which will pipe an event in the `EventBus` using its value as label
2. an array of strings, launching multiple events in the given order
3. an event,

```typescript
{
  label: string
  payload: Record<string, any>
  meta?: Record<string, any>
}
```

4. an array of events, which are sent to the `EventBus`.
5. a **single** `pushState` context, which is a generic object data and an optional URL to perform navigation

```typescript
{
  data: any
  url?: string
}
```

:::caution
if `data` is an object and current `window.history.state` is an object, they are merged with priority to `data`'s keys
:::

Form context can be used into the events/pushState sent after submission using `handlebars` notation. Each event payload and both `pushState` arguments are parsed with handlebars
injecting the following context

```typescript
{
  values: Record<string, any>
  response: Record<string, any>
}
```

where `values` is the form state and response contains a JS object which is the content of the `eventBusSuccess` payload linked to the form submission request (either `create-data` or `update-data`)

### Confirmation dialog on save and on close

It is possible to ask for confirmation on close and/or on save, and also customize the dialog texts.

It can be done using the `requireConfirmation` prop. It accepts three different values and it is defaulted as `false`:

#### 1. Boolean type

It can be set as `true` to open the dialog on close or as `false` otherwise.

#### 2. Object of type RequireConfirmOpts

An object such as:
```typescript
{
  cancelText?: any; // cancel button text
  okText?: any; // ok button text
  content?: any; // the content text
  title?: any; // the title text
}
```
to customize the dialog texts. They can also be localized, passing an object containing the language acronyms key and the text as value, for example:

```json
{
  "content": {
    "it": "Verrà creato un nuovo elemento, procedere?",
    "en": "A new element will be created, continue?"
  }
}
```

#### 3. Object of type RequireConfirmForm

An object such as:
```typescript
{
  onSave: boolean | RequireConfirmOpts
  onClose: boolean | RequireConfirmOpts
}
```
which is the only way to enable the confirmation dialog on save.

Both `onSave` and `onClose` must be passed in the configuration and both of them accept a `boolean` or a `RequireConfirmOpts` type with the same rules written above in points 1 and 2 of this section. 


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`allowNavigation`| - |boolean \\| "show-editor"|true|when `true`, object and arrays are displayed as a clickable label which allows to navigate to nested objects and arrays, if a dataSchema is specified; when `show-editor`, the navigation is allowed and the object/array fields are displayed in a json editor.; when `false`, the navigation is not allowed, and the object/array fields are displayed in a json editor. |
|`customLabels`| - |LocalizedLabels| - |custom localized texts shown as title and CTA button label|
|`customMessageOnAbsentLookup`| - |LocalizedText| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataCustomActions`| - |DrawerDataActionConfig[]|[]|list of actions to render per row|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing the fields of the collection to filter |
|`enableSubmitOnFormUntouched`|`enable-submit-on-form-untouched`|boolean|false|boolean to enable footer call-to-action even if no field within the form has been touched |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |
|`requireConfirm`| - |boolean \\| RequireConfirmOpts \| RequireConfirmForm|false|whether or not the drawer should request confirmation before closing and/or before saving.|
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`width`| - |string \\| number|500|with of the drawer |
|`editorHeight`|`editor-height`|string \\| number| - | height of object/array editor |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[add-new](../events#add-new)|opens the drawer to create a new item, eventually applying default fields from data schema or data provided in the payload of the event|`create-data-with-file`, `create-data`| - |
|[selected-data](../events#selected-data)|opens the drawer to edit a selected item, applying filling in its fields from the data provided in the payload of the event|`update-data-with-file`, `update-data`| - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |
|[nested-navigation-state/display](../events#nested-navigation-state---dispaly)|updates internal representation of the current navigation and closes the drawer| - | - |
|[submit-form/success](../events#submit-form---success)| - | - | - |

### Emits


| event | description |
|-------|-------------|
|[require-confirm](../events#require-confirm)|triggered when trying to close the drawer with unsaved data|
|[submit-form/request](../events#submit-form---request)|requests the form to submit its content|

### Bootstrap

None

## bk-form-modal

Modal containing a Form to edit or create items described by the `dataSchema`, once data is submitted for creation or update, modal is put in loading state. The component is composed of a generic Modal component, a generic Form component, thus it listens to and emits all the events that these do.
![form-modal](../img/bk-form-modal.png)

```html
<bk-form-modal></bk-form-modal>
```

![form-modal](../img/bk-form-modal.png)

### bk-form-modal

`bk-form-modal` is used to display a Modal containing a Form to edit or create items described by the `dataSchema`.

The Modal can be opened in three different modes:

- *insert*, by listening the `add-new` event
- *edit*, by listening the `selected-data` event
- *external*, by listening the `add-new-external` event

### Modal modes

#### Insert

Example of configuration for form-modal component in insert/edit mode:

```json
{
  "type": "element",
  "tag": "bk-form-modal",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        ...
      }
    },
    ...
}
```

When the component reacts to the `add-new` event it opens the modal with the initial values specified in the payload of the event. By clicking on the action button of the Form you can submit the content to perform an upload of a new item. If the form contains files, the component emits a `createDataWithFile` event where payload contains all the data of the form, including files. If no file is specified, a `createData` event is used. In both cases, a `transactionId` is used inside the meta field of the event to handle possible errors.

#### Edit

The `selected-data` event opens the modal in edit mode with possible initial values specified in the payload of the event. In this case, the action button of the Form perform an update of an existing field. If the form contains files, the component emits a `updateDataWithFile` event where payload contains all the data of the form. If no file is specified, a `updateData` event is used. In both cases, a `transactionId` is used inside the meta field of the event to handle possible errors.  

#### External

Example of configuration for form-modal component in external mode:

```json
{
  "type": "element",
  "tag": "bk-form-modal",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        ...
      }
    },
    "extraEndpoint": "/extra-data-post",
    ...
}
```

The `add-new-external` event opens the modal in external mode with possible initial values specified in the payload of the event. In this case, the action button of the Form perform a HTTP POST to the endpoint specified in the `extraEndpoint` property. If the form contains files, the component  performs a HTTP POST using as body a multipart object that contains all the data of the form, including files. If no file is specified, the HTTP POST uses as body a JSON object. If the HTTP request is completed successfully, the component emits a `success` event, instead, in case of errors, it emits a `error` event.  

#### After submission

When done filling up this modal form, usually `bk-form-modal` performs an `update-data` or `create-data` according to the operation invoked to open it (either `add-new` or `select-data`). Usually an http-like client takes care of these operations.
It is often useful to perform other tasks upon successful creation or editing. The prop `afterFinishEvents` allows to append events or `pushState` navigation instructions. To configure this feature we can provide to `afterFinishEvents`

1. a string, which will pipe an event in the `EventBus` using its value as label
2. an array of strings, launching multiple events in the given order
3. an event,

```typescript
{
  label: string
  payload: Record<string, any>
  meta?: Record<string, any>
}
```

4. an array of events, which are sent to the `EventBus`.
5. a **single** `pushState` context, which is a generic object data and an optional URL to perform navigation

```typescript
{
  data: any
  url?: string
}
```

:::caution
if `data` is an object and current `window.history.state` is an object, they are merged with priority to `data`'s keys
:::

Form context can be used into the events/pushState sent after submission using `handlebars` notation. Each event payload and both `pushState` arguments are parsed with handlebars
injecting the following context

```typescript
{
  values: Record<string, any>
  response: Record<string, any>
}
```

where `values` is the form state and response contains a JS object which is the content of the `eventBusSuccess` payload linked to the form submission request (either `create-data` or `update-data`)

#### Wizard

![wizard-form-modal](../img/wizard-form-modal.png)

It is possible to split data insertion into multiple steps via the `wizard` property.

:::info
Wizard representation is currently only availabe when inserting new data, not in case of update.
:::

`wizard` allows values like the following:

- `true`
- `false`
- an array of objects like:

```typescript
{
  keys: string[],
  labels: {
    wizardNext?: LocalizedText
    wizardPrevious?: LocalizedText
    wizardAddNew?: LocalizedText
    wizardSubmit?: LocalizedText
    stepperTitle?: LocalizedText
    stepperSubtitle?: LocalizedText
    accordionHeader?: LocalizedText
    accordionEmptyComponent?: LocalizedText
  }
  asForm?: boolean
}
```

Each such element maps to a step of the wizard as follows:

| property | description |
|----------|-------------|
| `keys` | fields to display in the step |
| `labels` | localized labels with the text to show |
| `asForm` | whether to visualize a single nested object as a form / nested array accordion of forms. Ignored if the step includes more than one field |

If a step meets the following requirements:

- only includes one field
- the field is of type `object` or `array` and has a property `dataSchema`
- `asForm` is set to true

Then the field will be displayed as a form in case of an `object` field, or as an accordion of forms in case of an `array` field.

![wizard-form-modal-accordion](../img/wizard-form-modal-accordion.png)

`labels` are mapped to displayed text as follows:

| key | description |
|----------|-------------|
| `wizardNext` | Button for going to next step |
| `wizardPrevious` | Button for going back to previous step |
| `wizardAddNew` | Button for adding a new element to an array, when displayed as an accordion |
| `wizardSubmit` | Button for submitting the form in the final step |
| `stepperTitle` | Title of the stepper component |
| `stepperSubtitle` | Subtitle of the stepper component |
| `accordionHeader` | Title of the accordion panel. An incremental is automatically added as panels are added to the accordion |
| `accordionEmptyComponent` | Text to display when the accordion is empty |

By default, `wizard` is false.

When set to `true`:

- the fields are automatically split so that:
  - the first group contains all fields that are not nested objects or nested arrays
  - each of the following steps contains one of the remaining fields, with `asForm` set to true
- default labels are applied.

### Confirmation dialog on save and on close

It is possible to ask for confirmation on close and/or on save, and also customize the dialog texts.

It can be done using the `requireConfirmation` prop. It accepts three different values and it is defaulted as `false`:

#### 1. Boolean type

It can be set as `true` to open the dialog on close or as `false` otherwise.

#### 2. Object of type RequireConfirmOpts

An object such as:
```typescript
{
  cancelText?: any; // cancel button text
  okText?: any; // ok button text
  content?: any; // the content text
  title?: any; // the title text
}
```
to customize the dialog texts. They can also be localized, passing an object containing the language acronyms key and the text as value, for example:

```json
{
  "content": {
    "it": "Verrà creato un nuovo elemento, procedere?",
    "en": "A new element will be created, continue?"
  }
}
```

#### 3. Object of type RequireConfirmForm

An object such as:
```typescript
{
  onSave: boolean | RequireConfirmOpts
  onClose: boolean | RequireConfirmOpts
}
```
which is the only way to enable the confirmation dialog on save.

Both `onSave` and `onClose` must be passed in the configuration and both of them accept a `boolean` or a `RequireConfirmOpts` type with the same rules written above in points 1 and 2 of this section. 


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`allowNavigation`| - |boolean \\| "show-editor"|true|when `true`, object and arrays are displayed as a clickable label which allows to navigate to nested objects and arrays, if a dataSchema is specified; when `show-editor`, the navigation is allowed and the object/array fields are displayed in a json editor.; when `false`, the navigation is not allowed, and the object/array fields are displayed in a json editor. |
|`allowObjectAsTable`|`allow-object-as-table`|boolean|false|allows to visualize objects and arrays without specific format in both a text-area and read-only table|
|`customLabels`| - |LocalizedLabels| - |custom localized texts shown as title and CTA button label|
|`customMessageOnAbsentLookup`| - |LocalizedText| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing the fields of the collection to filter |
|`extraEndpoint`|`extra-endpoint`|string| - |when specified, it is possible to perform a POST request to an external collection specified by the endpoint |
|`height`|`height`|string|'60vh'|height of the modal |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |
|`requireConfirm`| - |boolean \\| RequireConfirmOpts \| RequireConfirmForm|false|whether or not the drawer should request confirmation before closing and/or before saving.|
|`rootElementSelector`|`root-element-selector`|string|'#microlc-element-composer'|root element to append the modal to |
|`width`|`width`|string|'90vw'|with of the modal |
|`wizard`| - |boolean \\| WizardStepSchema[]| - |array of options for setting up a wizard. If true, a default wizard is utilized.|
|`editorHeight`|`editor-height`|string \\| number| - | height of object/array editor |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[add-new](../events#add-new)|opens the modal to create a new item, eventually applying default fields from data schema or data provided in the payload of the event|`create-data-with-file`, `create-data`| - |
|[add-new-external](../events#add-new-external)|opens the modal to create a new item on an external collection, eventually applying default fields from data schema or data provided in the payload of the event|`success`, `error`| - |
|[selected-data](../events#selected-data)|opens the modal to edit a selected item, applying filling in its fields from the data provided in the payload of the event|`update-data-with-file`, `update-data`| - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |
|[nested-navigation-state/display](../events#nested-navigation-state---dispaly)|updates internal representation of the current navigation and closes the modal| - | - |
|[submit-form/success](../events#submit-form---success)| - | - | - |

### Emits


| event | description |
|-------|-------------|
|[require-confirm](../events#require-confirm)|triggered when trying to close the modal with unsaved data|
|[submit-form/request](../events#submit-form---request)|requests the form to submit its content|

### Bootstrap

None
