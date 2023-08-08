---
id: data_manipulation
title: Data Manipulation
sidebar_label: Data Manipulation
---
## bk-file-picker-drawer

drawer containing a drag-and-drop area to handle file uploads/downloads.

```html
<bk-file-picker-drawer></bk-file-picker-drawer>
```

`bk-file-picker-drawer` listens for the [link-file-to-record](../70_events.md#link-file-to-record) event, which enables the editing of a file object/array within the payload using the specified property name in the event's meta.

When a new file is uploaded, the [standard file management](../40_core_concepts.md#file-management) is initiated through an [upload-file](../70_events.md#upload-file) event.

Files are expected to respect [Mia Files Service](../../../runtime_suite/files-service/configuration) interface, that is:
```json
{
  "_id": {
    "type": "string"
  },
  "name": {
    "type": "string"
  },
  "file": {
    "type": "string"
  },
  "size": {
    "type": "number"
  },
  "location": {
    "type": "string"
  }
}
```

For instance, a `link-file-to-record` event with the following payload and meta: 

```json
{
  "payload": {
    "name": "Joe",
    "surename": "Smith",
    "image": {
      "_id": "file-id",
      "name": "fileName.jpg",
      "file": "file.jpg",
      "size": 3992,
      "location": "/v2/files/download/file.jpg"
    },
    ...
  },
  "meta": {
    "property": "image"
  }
}
```

will spawn the `bk-file-picker-drawer` component which will allow to interact with the file in the "image" field.


### Array of files

To utilize `bk-file-picker-drawer` with an array of files, it is necessary to include the `dataSchema` property in the configuration. Otherwise, the component will only handle one file at a time.

```json
...
{
  "tag": "bk-file-picker-drawer",
  "properties": {
    "dataSchema": {
      "documents": {
        "type": "array",
        "format": "file"
      },
      ...
    }
  }
},
...
```

### Metadata

File fields may themselves have a `dataSchema` or `items` property.

In the case of an edited file field having such properties, the `bk-file-picker-drawer` not only includes the drag-and-drop area but also provides an area to edit the metadata associated with the file field: for file fields of type object, a form is displayed, while for file fields of type array, an accordion of forms is presented.

Only fields of type string are supported for metadata.

```json
{
  "image": {
    "type": "object",
    "format": "file",
    "dataSchema": {
      "type": "object",
      "properties": {
        "ownerId": {
          "type": "string"
        }
      }
    }
  }
}
```
```json
{
  "images": {
    "type": "array",
    "format": "file",
    "items": {
      "type": "object",
      "properties": {
        "ownerId": {
          "type": "string"
        }
      }
    }
  }
}
```


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to manipulate |
|`mask`|`mask`|boolean|true|whether to mask or not the drawer |
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`width`|`width`|number|500|width occupied by the component |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events#loading-data)|allows disabling callToAction| - | - |
|[link-file-to-record](../events#link-file-to-record)|launches the upload of a file from selected ones| - | - |

### Emits


| event | description |
|-------|-------------|
|[update-data-with-file](../events#update-data-with-file)|updates data by uploading a new file and patching the dataset with its storage location metadata|
|[update-data](../events#update-data)|unlinks file on file delete|

### Bootstrap

None


## bk-file-picker-modal

modal containing a drag-and-drop area to handle file uploads/downloads.

```html
<bk-file-picker-modal></bk-file-picker-modal>
```

`bk-file-picker-modal` listens for the [link-file-to-record](../70_events.md#link-file-to-record) event, which enables the editing of a file object/array within the payload using the specified property name in the event's meta.

When a new file is uploaded, the [standard file management](../40_core_concepts.md#file-management) is initiated through an [upload-file](../70_events.md#upload-file) event.

Files are expected to respect [Mia Files Service](../../../runtime_suite/files-service/configuration) interface, that is:
```json
{
  "_id": {
    "type": "string"
  },
  "name": {
    "type": "string"
  },
  "file": {
    "type": "string"
  },
  "size": {
    "type": "number"
  },
  "location": {
    "type": "string"
  }
}
```

For instance, a `link-file-to-record` event with the following payload and meta: 

```json
{
  "payload": {
    "name": "Joe",
    "surename": "Smith",
    "image": {
      "_id": "file-id",
      "name": "fileName.jpg",
      "file": "file.jpg",
      "size": 3992,
      "location": "/v2/files/download/file.jpg"
    },
    ...
  },
  "meta": {
    "property": "image"
  }
}
```

will spawn the `bk-file-picker-modal` component which will allow to interact with the file in the "image" field.


### Array of files

To utilize `bk-file-picker-modal` with an array of files, it is necessary to include the `dataSchema` property in the configuration. Otherwise, the component will only handle one file at a time.

```json
...
{
  "tag": "bk-file-picker-modal",
  "properties": {
    "dataSchema": {
      "documents": {
        "type": "array",
        "format": "file"
      },
      ...
    }
  }
},
...
```

### Metadata

File fields may themselves have a `dataSchema` or `items` property.

In the case of an edited file field having such properties, the `bk-file-picker-modal` not only includes the drag-and-drop area but also provides an area to edit the metadata associated with the file field: for file fields of type object, a form is displayed, while for file fields of type array, an accordion of forms is presented.

Only fields of type string are supported for metadata.

```json
{
  "image": {
    "type": "object",
    "format": "file",
    "dataSchema": {
      "type": "object",
      "properties": {
        "ownerId": {
          "type": "string"
        }
      }
    }
  }
}
```
```json
{
  "images": {
    "type": "array",
    "format": "file",
    "items": {
      "type": "object",
      "properties": {
        "ownerId": {
          "type": "string"
        }
      }
    }
  }
}
```

### Reusing Uploaded Files

To enable the reusability of already uploaded files, follow these steps:
  
  - Set the `previewUploadedFiles` property to true in the configuration of the `bk-file-picker-modal` component.
    Note: This feature requires [Mia Files Service](../../../runtime_suite/files-service/configuration) version 2.7.0 or higher.
  
  - When the modal is opened, the files from the bucket will be loaded.
    These files will be displayed to the user as a preview inside the modal and can be selected using checkboxes.
  
  - If [metadata](#metadata-1) is available for the files, it can be accessed through a drawer within the modal.
    The metadata will be presented based on the `data-schema` specified for the corresponding file field being updated. Keep in mind that some data may not be visible depending on the data-schema.



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to manipulate |
|`mask`|`mask`|boolean|true|whether to mask or not the modal |
|`rootElementSelector`|`root-element-selector`|string| - | root element to append the modal to |
|`width`|`width`|number\|string|70vw|width occupied by the component |
|`height`|`height`|number\|string|60vh|height occupied by the component |
|`previewUploadedFiles`|`preview-uploaded-files`|boolean|false| allows to preview and select previously uploaded files |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events#loading-data)|allows disabling callToAction| - | - |
|[link-file-to-record](../events#link-file-to-record)|launches the upload of a file from selected ones| - | - |
|[fetched-files](../events#fetched-files)|receives files to display as preview|-|-|

### Emits


| event | description |
|-------|-------------|
|[update-data-with-file](../events#update-data-with-file)|updates data by uploading a new file and patching the dataset with its storage location metadata|
|[update-data](../events#update-data)|unlinks file on file delete|
|[fetch-files](../events#fetch-files)|requests files to be fetched for preview|-|-|

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
|`allowNavigation`| - |boolean \| "show-editor"|true|when `true`, object and arrays are displayed as a clickable label which allows to navigate to nested objects and arrays, if a dataSchema is specified; when `show-editor`, the navigation is allowed and the object/array fields are displayed in a json editor.; when `false`, the navigation is not allowed, and the object/array fields are displayed in a json editor. |
|`allowObjectAsTable`|`allow-object-as-table`|boolean|false| allows to visualize objects and arrays without specific format as a read-only table |
|`customMessageOnAbsentLookup`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to manipulate |
|`extraEndpoint`|`extra-endpoint`|string| - |when specified, it is possible to perform a POST request to an external collection specified by the endpoint |
|`formId`|`form-id`|string| - |id of the form. This property should only be set programmatically. |
|`formKindIfDisplayData`| - |"add" \| "edit"| - |data management strategy when setting initial values from displayData: add or edit (default). |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`onFieldsChange`| - |Function| - | - |
|`onLoading`| - |Function| - | - |
|`onWizardStepAttempted`| - |Function| - | - |
|`openingEvent`| - |OpeningEvent \| OpeningEvent[]|[]|what opening event to listen to. If includes 'insert', `add-new` events will be listened to, if includes 'select', `selected-data` events will be listened to. |
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
![form-card](../img/bk-form-card.png)

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`customLabels`| - |[FormCardLocale](#custom-labels)| - |custom localized texts shown as CTA buttons labels. Analogous to `bk-form-modal` and `bk-form-drawer`.|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to filter |
|`enableSubmitOnFormUntouched`|`enable-submit-on-form-untouched`|boolean|false|boolean to enable footer call-to-action even if no field within the form has been touched |
|`formKind`| - |"add" \| "edit"|"edit"|data management strategy when setting initial values from displayData: add or edit (default) |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |
|`editorHeight`|`editor-height`|string \| number| - | height of object/array editor |
| `header`| - | Pick<CardSchema, 'header'>| - | card header |

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


`bk-form-drawer` is used to display a Drawer containing a Form to edit or create items described by the `dataSchema`.

The Drawer can be opened in two different modes:

- *insert*, by listening the `add-new` event
- *edit*, by listening the `selected-data` event

### Drawer modes

#### Insert

Example of configuration for form-drawer component in insert/edit mode:

```json
{
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

:::info
If the `description` field is specified in a dataschema property, a info icon is shown next to the form field label and a tooltip with the description appears when the mouse is over the icon.
:::

#### Edit

The `selected-data` event opens the drawer in edit mode with possible initial values specified in the payload of the event. In this case, the action button of the Form perform an update of an existing field. If the form contains files, the component emits a `updateDataWithFile` event where payload contains all the data of the form. If no file is specified, a `updateData` event is used. In both cases, a `transactionId` is used inside the meta field of the event to handle possible errors.  

### After submission

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


### Custom labels

Custom labels can be specified as [LocalizedText](../40_core_concepts.md#localization-and-i18n) as modal title, CTA button label, require confirm message.
Such labels can be scoped based on whether the form is in [edit](#edit-1) or [create](#insert-1) mode.



```json
{
  "tag": "bk-form-drawer",
  "properties": {
    ...
    "customLabels": {
      "create": {
        "title": {
          "en": "Add new order",
          "it": "Aggiungi nuovo ordine"
        },
        "ctaLabel": {
          "en": "Submit",
          "it": "Submit Order"
        },
        "unsavedChangesContent": {
          "it": "Chiudendo ora si perderà l'ordine non salvate, procedere?",
          "en": "Closing now will discard new order, do you want to continue?"
        },
        "saveChangesContent": {
          "it": "Verrà creato un nuovo ordine, procedere?",
          "en": "A new order will be created, continue?"
        }
      },
      "update": {
        "title": {
          "en": "Order detail",
          "it": "Dettaglio ordine"
        },
        "ctaLabel": {
          "en": "Update Order",
          "it": "Salva Ordine"
        },
        "unsavedChangesContent": {
          "it": "Chiudendo ora si perderanno tutte le modifiche non salvate all'ordine, procedere?",
          "en": "Closing now will discard changes to the order, do you want to continue?"
        },
        "saveChangesContent": {
          "it": "Verrà creato un nuovo ordine, procedere?",
          "en": "A new order will be created, continue?"
        }
      }
    }
  }
}
```

Not all keys need to be specified, as `customLabels` is merged with default labels. For instance, the following is a valid configuration of `customLabels`:
```json
{
  "tag": "bk-form-drawer",
  "properties": {
    ...
    "customLabels": {
      "create": {
        "title": {
          "en": "Add new order",
          "it": "Aggiungi nuovo ordine"
        }
      },
      "update": {
        "title": {
          "en": "Order detail",
          "it": "Dettaglio ordine"
        }
      }
    }
  }
}
```

### File fields with meta-data

Fields that are of type `object` or `array`, have the format `file`, and include a `dataSchema` or `items` property are displayed within the form.
In this scenario, `dataSchema` and `items` properties are used to determine the shape of the metadata associated with the file.

These fields are rendered with a link plus a button that triggers components [bk-file-picker-modal](#bk-file-picker-modal) or [bk-file-picker-drawer](#bk-file-picker-drawer) to spawn, if included in the plugin configuration. Clicking on these buttons opens up the respective components, enabling interaction with the uploaded files and allowing for the modification of their metadata.

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`allowNavigation`| - |boolean \| "show-editor"|true|when `true`, object and arrays are displayed as a clickable label which allows to navigate to nested objects and arrays, if a dataSchema is specified; when `show-editor`, the navigation is allowed and the object/array fields are displayed in a json editor.; when `false`, the navigation is not allowed, and the object/array fields are displayed in a json editor. |
|`customLabels`| - |[LocalizedLabels](#custom-labels)| - |custom localized texts shown as title and CTA button label|
|`customMessageOnAbsentLookup`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataCustomActions`| - |DrawerDataActionConfig[]|[]|list of actions to render per row|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to filter |
|`enableSubmitOnFormUntouched`|`enable-submit-on-form-untouched`|boolean|false|boolean to enable footer call-to-action even if no field within the form has been touched |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |
|`requireConfirm`| - |boolean \| [RequireConfirmOpts](#2-object-of-type-requireconfirmopts) \| [RequireConfirmForm](#3-object-of-type-requireconfirmform) |false|whether or not the drawer should request confirmation before closing and/or before saving.|
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`width`| - |string \| number|500|with of the drawer |
|`editorHeight`|`editor-height`|string \| number| - | height of object/array editor |

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

```html
<bk-form-modal></bk-form-modal>
```

![form-modal](../img/bk-form-modal.png)

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

:::info
If the `description` field is specified in a dataschema property, a info icon is shown next to the form field label and a tooltip with the description appears when the mouse is over the icon.
:::

#### Edit

The `selected-data` event opens the modal in edit mode with possible initial values specified in the payload of the event. In this case, the action button of the Form perform an update of an existing field. If the form contains files, the component emits a `updateDataWithFile` event where payload contains all the data of the form. If no file is specified, a `updateData` event is used. In both cases, a `transactionId` is used inside the meta field of the event to handle possible errors.  

#### External

Example of configuration for form-modal component in external mode:

```json
{
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

The `add-new-external` event opens the modal in external mode with possible initial values specified in the payload of the event. In this case, the action button of the Form perform a HTTP POST to the endpoint specified in the `extraEndpoint` property. If the form contains files, the component  performs a HTTP POST using as body a multipart object that contains all the data of the form, including files. If no file is specified, the HTTP POST uses as body a JSON object.

If the HTTP request is completed successfully, the component emits a `success` event, instead, in case of errors, it emits a `error` event. Either way, a `triggeredBy` field is injected into the meta of the event with value `bk-form-modal-extra-endpoint`. Components such as [bk-notifications](./70_misc.md#triggering-notifications) leverage `triggeredBy` for displaying push notifications.

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


### Nested objects

By default, objects and arrays are displayed in `bk-form-modal` as JSONs inside an [editor](https://microsoft.github.io/monaco-editor/).
This is not true for objects and arrays of specific [formats](../30_page_layout.md#data-schema) such as `file` or `multilookup`, and for objects / arrays for which a data-schema is defined.

In particular, properties `allowObjectAsTable` and `allowNavigation` control how object and array fields with a provided data-schema (and no specific `format`) are rendered inside the modal.
- `allowObjectAsTable` controls whether or not the nested fields should be rendered as an editor, a read-only table, or both.
- `allowNavigation` allows to emit a [nested-navigation-state/push](../events#nested-navigation-state---push) event by clicking on the field label. Refer to [this](../page_layout#nested-dataschemas) for further details on nested objects navigation.

By default, setting `allowNavigation` to true disables editor visualization for nested fields. The following table explains how the two properties interact:

| `allowObjectAsTable` | `allowNavigation` | end result |
| -------------------- | ----------------- | ---------- |
| true | true | Table visualization only, label can be clicked |
| true | "show-editor" | Table + editor, label can be clicked |
| true | false | Table + editor, label cannot be clicked |
| false | true | No table nor editor, label can be clicked (default configuration) |
| false | "show-editor" | Editor visualization only, label can be clicked |
| false | false | Editor visualization only, label cannot be clicked |

By default, `allowObjectAsTable` is false, `allowNavigation` is true.

:::info
When `allowObjectAsTable` is true, the resulting table supports a subset of the features supported by [bk-table](./60_data_visualization.md#bk-table).
Some of the limitations with respect to `bk-table` include:
  - lookups are not resolved
  - row selection is disabled
  - row click is disabled
:::

### Custom labels

Custom labels can be specified as [LocalizedText](../40_core_concepts.md#localization-and-i18n) as modal title, CTA button label, require confirm message.
Such labels can be scoped based on whether the form is in [edit](#edit-1) or [create](#insert-1) mode.



```json
{
  "tag": "bk-form-modal",
  "properties": {
    ...
    "customLabels": {
      "create": {
        "title": {
          "en": "Add new order",
          "it": "Aggiungi nuovo ordine"
        },
        "ctaLabel": {
          "en": "Submit",
          "it": "Submit Order"
        },
        "unsavedChangesContent": {
          "it": "Chiudendo ora si perderà l'ordine non salvate, procedere?",
          "en": "Closing now will discard new order, do you want to continue?"
        },
        "saveChangesContent": {
          "it": "Verrà creato un nuovo ordine, procedere?",
          "en": "A new order will be created, continue?"
        }
      },
      "update": {
        "title": {
          "en": "Order detail",
          "it": "Dettaglio ordine"
        },
        "ctaLabel": {
          "en": "Update Order",
          "it": "Salva Ordine"
        },
        "unsavedChangesContent": {
          "it": "Chiudendo ora si perderanno tutte le modifiche non salvate all'ordine, procedere?",
          "en": "Closing now will discard changes to the order, do you want to continue?"
        },
        "saveChangesContent": {
          "it": "Verrà creato un nuovo ordine, procedere?",
          "en": "A new order will be created, continue?"
        }
      }
    }
  }
}
```

Not all keys need to be specified, as `customLabels` is merged with default labels. For instance, the following is a valid configuration of `customLabels`:
```json
{
  "tag": "bk-form-modal",
  "properties": {
    ...
    "customLabels": {
      "create": {
        "title": {
          "en": "Add new order",
          "it": "Aggiungi nuovo ordine"
        }
      },
      "update": {
        "title": {
          "en": "Order detail",
          "it": "Dettaglio ordine"
        }
      }
    }
  }
}
```

### File fields with meta-data

Fields that are of type `object` or `array`, have the format `file`, and include a `dataSchema` or `items` property are displayed within the form.
In this scenario, `dataSchema` and `items` properties are used to determine the shape of the metadata associated with the file.

These fields are rendered with a link plus a button that triggers components [bk-file-picker-modal](#bk-file-picker-modal) or [bk-file-picker-drawer](#bk-file-picker-drawer) to spawn, if included in the plugin configuration. Clicking on these buttons opens up the respective components, enabling interaction with the uploaded files and allowing for the modification of their metadata.


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`afterFinishEvents`| - |ConfigurableEvents| - |events or state push to concatenate after successful finish action has been performed |
|`allowAutoDisableDeps`|`allow-auto-disable-deps`|boolean|false|if true, dependent lookup and multilookup select fields are automatically disabled in case of no options |
|`allowNavigation`| - |boolean \| "show-editor"|true|when `true`, object and arrays are displayed as a clickable label which allows to navigate to nested objects and arrays, if a dataSchema is specified; when `show-editor`, the navigation is allowed and the object/array fields are displayed in a json editor.; when `false`, the navigation is not allowed, and the object/array fields are displayed in a json editor. |
|`allowObjectAsTable`|`allow-object-as-table`|boolean|false|allows to visualize objects and arrays without specific format and a dataschema in both a editor and read-only table|
|`customLabels`| - |[LocalizedLabels](#custom-labels-1)| - |custom localized texts shown as title and CTA button label|
|`customMessageOnAbsentLookup`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataSchema`| - |[ExtendedJSONSchema7Definition](../30_page_layout.md#data-schema)| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to filter |
|`extraEndpoint`|`extra-endpoint`|string| - |when specified, it is possible to perform a POST request to an external collection specified by the endpoint |
|`height`|`height`|string|'60vh'|height of the modal |
|`liveSearchItemsLimit`|`live-search-items-limit`|number|10|max items to fetch on regex live search|
|`liveSearchTimeout`|`live-search-timeout`|number|5000|live-search timeout|
|`readonlyOnView`|`readonly-on-view`|boolean|false|upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit |
|`requireConfirm`| - |boolean \| [RequireConfirmOpts](#2-object-of-type-requireconfirmopts-1) \| [RequireConfirmForm](#3-object-of-type-requireconfirmform-1) |false|whether or not the drawer should request confirmation before closing and/or before saving.|
|`rootElementSelector`|`root-element-selector`|string|'#microlc-element-composer'|root element to append the modal to |
|`width`|`width`|string|'90vw'|with of the modal |
|`wizard`| - |boolean \| [WizardStepSchema](#wizard)[]| - |array of options for setting up a wizard. If true, a default wizard is utilized.|
|`editorHeight`|`editor-height`|string \| number| - | height of object/array editor |

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
