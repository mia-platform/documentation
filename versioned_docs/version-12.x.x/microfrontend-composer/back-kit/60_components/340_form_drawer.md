---
id: form_drawer
title: Form Drawer
sidebar_label: Form Drawer
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

<!--
WARNING:
This file is automatically generated. Please edit the 'README' file of the corresponding component and run `yarn copy:docs`
-->


[handlebars]: https://handlebarsjs.com/guide/expressions.html

[crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[predefined-fields]: /runtime_suite/crud-service/10_overview_and_usage.md
[writable-views]: /runtime_suite/crud-service/50_writable_views.md

[data-schema]: ../30_page_layout.md#data-schema
[form-options]: ../30_page_layout.md#form-options
[helpers]: ../40_core_concepts.md#helpers
[localized-text]: ../40_core_concepts.md#localization-and-i18n
[dynamic configurations]: ../40_core_concepts.md#dynamic-configuration
[inline-queries]: ../40_core_concepts.md#inline-queries

[bk-button]: ./90_button.md
[bk-crud-client]: ./100_crud_client.md
[bk-dynamic-form-drawer]: ./200_dynamic_form_drawer.md
[bk-file-manager]: ./260_file_manager.md
[bk-confirmation-modal]: ./160_confirmation_modal.md
[bk-file-picker-modal]: ./280_file_picker_modal.md
[bk-file-picker-drawer]: ./270_file_picker_drawer.md

[add-new]: ../70_events.md#add-new
[selected-data]: ../70_events.md#selected-data
[require-confirm]: ../70_events.md#require-confirm
[create-data]: ../70_events.md#create-data
[update-data]: ../70_events.md#update-data
[create-data-with-file]: ../70_events.md#create-data-with-file
[update-data-with-file]: ../70_events.md#update-data-with-file
[success]: ../70_events.md#success
[error]: ../70_events.md#error
[nested-navigation-state/push]: ../70_events.md#nested-navigation-state---push
[nested-navigation-state/back]: ../70_events.md#nested-navigation-state---back
[nested-navigation-state/display]: ../70_events.md#nested-navigation-state---dispaly




:::caution
This component is deprecated. The [Dynamic Form Drawer][bk-dynamic-form-drawer] should be used instead.
:::

```html
<bk-form-drawer></bk-form-drawer>
```

![form-drawer](img/bk-form-drawer.png)

The Form Drawer is used to display a drawer containing a form to edit or create items described by the `dataSchema`.

## How to configure

For a basic usage of the Form Drawer, providing a data-schema to interpret the structure of the data to handle is sufficient.
Several [customizations][data-schema] can be applied to the provided data-schema that tune how the data is handled by the component.
Particularly, but not limited to, every field supports a set of [options][form-options] specific for forms.

```json
{
  "tag": "bk-form-drawer",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "_id_": {
          "type": "string",
          "formOptions": {
            "hidden": true // no input is rendered for _id field, but the Form Drawer still holds its value in the internal representation of the form values
          }
        },
        "__STATE__": {
          "type": "string",
          "default": "PUBLIC",
          "enum": [ // enum string fields are rendered as select fields
            "PUBLIC",
            "DRAFT",
            "TRASH"
          ]
        },
        "name": {
          "type": "string"
        },
        "price": {
          "type": "number"
        }
      }
    }
  }
}
```


The Form Drawer can be opened in two different modes:

- *insert*: submitting the form signals the need for an item creation. This mode is activated upon listening to an [add-new] event
- *edit*: submitting the form signals the need for an item creation. This mode is activated upon listening to an [selected-data] event


### Modes

#### Insert

When the component reacts to the [add-new] event, the drawer opens and the form initializes its fields with values specified in the payload of the event. 
In this mode, upon clicking on the submit button of the footer, the Form Drawer signals the request to push a new item to a CRUD collection, emitting the event [create-data] with payload extracted from the state of the form, particularly its values.
A component such as the [CRUD Client][bk-crud-client] could pick up on the `create-data` event.
If the form contains files, the component emits a [create-data-with-file] event, which signals the need to upload files to a file storage service on top of pushing the item to a CRUD collection.
A component like the [File Manager][bk-file-manager] could listen to this event.

A `transactionId` is added to the meta field of the emitted event to handle possible errors.

#### Edit

When the component reacts to the [selected-data] event, the drawer opens and the form initializes its fields with the values specified in the payload of the event.

By clicking on the submit button, the Form Drawer signals the request to update an item in the CRUD collection, emitting the event [update-data] with payload determined the state of the form, particularly its values
The item to update is identified by its `_id` field, which is a [predefined field][predefined-fields] of [Mia Platform's CRUD Service][crud-service] collections.
A component such as the [CRUD Client][bk-crud-client] could pick up on the `update-data` event.
If the form contains files, the component emits a [update-data-with-file] event, which signals the need to upload files to a file storage service on top of updating the item in the CRUD collection.
A component like the [File Manager][bk-file-manager] could listen to this event.

A `transactionId` is added to the meta field of the emitted event to handle possible errors.

### After submission

When done filling up the form, usually the Form Drawer requests data update or creation (via an [update-data] or [create-data] event) according to the operating [mode](#modes).
Usually an http-like client takes care of these operations.
It is often useful to perform other tasks upon successful creation or editing.
The prop `afterFinishEvents` allows to append events or `pushState` navigation instructions.
This feature can be configured by providing to `afterFinishEvents`

1. a string, which will pipe an event using its value as label
2. an array of strings, launching multiple events in the given order
3. an event,

```typescript
{
  label: string
  payload: Record<string, any>
  meta?: Record<string, any>
}
```

4. an array of events,
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

Form context can be used into the events/pushState sent after submission using [handlebars] notation.
Each event payload and both `pushState` arguments are parsed with handlebars injecting the following context

```typescript
{
  values: Record<string, any>
  response: Record<string, any>
}
```

where `values` is the form values and `response` contains an object representation of the content of the payload of the [success] event linked to the form submission request.


### Confirmation dialog on save and on close

It is possible to require confirmation before submitting the form or closing the drawer, using the `requireConfirm` property.
`requireConfirm` accepts a boolean or an object value, and defaults to `false`.

It is furthermore possible to scope confirmation request configuration depending on the triggering action, either closing the drawer or submitting the form:

```json
{
  "requireConfirm": {
    "onSave": ..., // boolean or object configuration
    "onClose": ... // boolean or object configuration
  }
}
```

#### 1. Boolean type

If `requireConfirm` is set to true, the Form Drawer, upon submission or closing, signals that confirmation for an actions is needed with event [require-confirm].
A component such as the [Confirmation Modal][bk-confirmation-modal] could react to the event.

#### 2. Object type

An object such as:
```typescript
{
  cancelText?: LocalizedText // cancel button text
  okText?: LocalizedText     // ok button text
  content?: LocalizedText    // the content text
  title?: LocalizedText      // the title text
}
```
can be provided as value to `requireConfirm`.
[LocalizedText][localized-text] is either a string or an object mapping language acronyms to strings.

```json
{
  "content": {
    "it": "Verrà creato un nuovo elemento, procedere?",
    "en": "A new element will be created, continue?"
  }
}
```

This allows to request customized labels in the confirmation dialog-box.
When structure in this way, the value for property `requireConfirm` is appended to the [require-confirm] event.
If this request is picked up by a component such as the [Confirmation Modal][bk-confirmation-modal], this prompts the user for confirmation via a pop-up dialog-box having the specified labels.


### Integrate custom labels

Custom labels can be specified as [LocalizedText][localized-text] as drawer title, CTA button label, require confirm message.
Such labels can be scoped based on whether the form is in [edit or create mode](#modes).

```json
{
  "tag": "bk-form-drawer",
  "properties": {
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

Not all keys need to be specified, as `customLabels` is merged with default labels.
For instance, the following is a valid configuration of `customLabels`:

```json
{
  "tag": "bk-form-drawer",
  "properties": {
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

Fields described in the data-schema as having the type `object` or `array` and format `file` are rendered in the form as drag-and-drop fields. These fields enable interaction with uploaded files and allow uploading new files.

However, when such fields include a `dataSchema` or `items` property, they are presented within the form as a link along with a button.

The link enables the downloading of the files present in the initial values of the form.
Clicking the button triggers the appearance of components such as [File Picker Modal][bk-file-picker-modal] or [File Picker Drawer][bk-file-picker-drawer], provided they are included in the plugin configuration.
Both the File Picker Modal and File Picker Drawer offer interaction with the uploaded files and the option to set metadata for newly uploaded files. In this context, the `dataSchema` and `items` properties define the structure of the associated file metadata.

Upon submission, the form initiates a request to push or update data within a CRUD collection and upload new files to a file storage service.
This is accomplished by emitting either a [create-data-with-file] or an [update-data-with-file] event, which can be intercepted by components like the [File Manager][bk-file-manager].


### Locale

The texts of the Form Drawer can be customized through the property `customLocale`, which accepts an object shaped like the following:

```typescript
type Locale = {
  create: {
    title: LocalizedText
    ctaLabel: LocalizedText
    unsavedChangesContent: LocalizedText
    saveChangesContent: LocalizedText
    subtitle: LocalizedText
  }
  update: {
    title: LocalizedText
    ctaLabel: LocalizedText
    unsavedChangesContent: LocalizedText
    saveChangesContent: LocalizedText
    subtitle: LocalizedText
  }
  form: {
    validationMessages:{
      default: LocalizedText,
      required: LocalizedText,
      enum: LocalizedText,
      whitespace: LocalizedText,
      date:{
        format: LocalizedText,
        parse: LocalizedText,
        invalid: LocalizedText
      },
      types:{
        string: LocalizedText,
        method: LocalizedText,
        array: LocalizedText,
        object: LocalizedText,
        number: LocalizedText,
        date: LocalizedText,
        boolean: LocalizedText,
        integer: LocalizedText,
        float: LocalizedText,
        regexp: LocalizedText,
        email: LocalizedText,
        url: LocalizedText,
        hex: LocalizedText,
        file: LocalizedText
      },
      string:{
        len: LocalizedText,
        min: LocalizedText,
        max: LocalizedText,
        range: LocalizedText
      },
      number:{
        len: LocalizedText,
        min: LocalizedText,
        max: LocalizedText,
        range: LocalizedText
      },
      array:{
        len: LocalizedText,
        min: LocalizedText,
        max: LocalizedText,
        range: LocalizedText,
        unique: LocalizedText
      },
      pattern:{
        mismatch: LocalizedText
      }
    },
    datePicker: {
      lang: {
        locale: LocalizedText,
        placeholder: LocalizedText,
        rangePlaceholder: {
          start: LocalizedText,
          stop: LocalizedText
        },
        today: LocalizedText,
        now: LocalizedText,
        backToToday: LocalizedText,
        ok: LocalizedText,
        clear: LocalizedText,
        month: LocalizedText,
        year: LocalizedText,
        timeSelect: LocalizedText,
        dateSelect: LocalizedText,
        monthSelect: LocalizedText,
        yearSelect: LocalizedText,
        decadeSelect: LocalizedText,
        monthBeforeYear: 'true' | 'false',
        previousMonth: LocalizedText,
        nextMonth: LocalizedText,
        previousYear: LocalizedText,
        nextYear: LocalizedText,
        previousDecade: LocalizedText,
        nextDecade: LocalizedText,
        previousCentury: LocalizedText,
        nextCentury: LocalizedText
      },
      timePickerLocale:{
        placeholder: LocalizedText
      }
    },
    filePicker:{
      drawerTitle: LocalizedText,
      filePickerTitle: LocalizedText,
      dragAndDropCaption: LocalizedText,
      ctaLabel: LocalizedText
    },
    objectEditor:{
      editorView: LocalizedText,
      tableView: LocalizedText
    },
    editor:{
      editorView: LocalizedText,
      rawView: LocalizedText
    },
    htmlEditor: {
      preview: LocalizedText,
      html: LocalizedText
    },
    geopoint:{
      latitude: LocalizedText,
      longitude: LocalizedText,
      phLatitude: LocalizedText,
      phLongitude: LocalizedText
    },
    element: LocalizedText,
    elements: LocalizedText,
    true: LocalizedText,
    false: LocalizedText
  }
}
```

where [LocalizedText][localized-text] is either a string or an object mapping language acronyms to strings.


## API

### Properties & Attributes


| property                      | attribute                 | type                                                                                                             | default | description                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFinishEvents`           | -                         | ConfigurableEvents                                                                                               | -       | events or state push to concatenate after successful finish action has been performed                                                                                                                                                                                                                                                                                |
| `allowAutoDisableDeps`        | `allow-auto-disable-deps` | boolean                                                                                                          | false   | if true, dependent lookup and multilookup select fields are automatically disabled in case of no options                                                                                                                                                                                                                                                             |
| `customMessageOnAbsentLookup` | -                         | [LocalizedText][localized-text]                                                                                  | -       | override lookup value in case lookup is not resolved due to lack of data                                                                                                                                                                                                                                                                                             |
| `dataCustomActions`           | -                         | DrawerDataActionConfig[]                                                                                         | []      | list of actions to render per row                                                                                                                                                                                                                                                                                                                                    |
| `liveSearchTimeout`           | `live-search-timeout`     | number                                                                                                           | 5000    | live-search timeout                                                                                                                                                                                                                                                                                                                                                  |
| `rootElementSelector`         | `root-element-selector`   | string                                                                                                           | -       | Selector to specify where the container should be appended                                                                                                                                                                                                                                                                                                           |
| `dataSchema`                  | -                         | [ExtendedJSONSchema7Definition][data-schema]                                                                     | -       | Data schema describing the fields of the collection to filter                                                                                                                                                                                                                                                                                                        |
| `readonlyOnView`              | `read-only-on-view`       | boolean                                                                                                          | false   | Upon marking this prop as true, on selecting a record, the form will be displayed as readonly, with no possibility to edit                                                                                                                                                                                                                                           |
| `editorHeight`                | `editor-height`           | string \| number                                                                                                 | -       | Height of the object/array editor field                                                                                                                                                                                                                                                                                                                              |
| `allowNavigation`             | `allow-navigation`        | boolean \| 'show-editor'                                                                                         | true    | When true, objects and arrays are displayed as a clickable label which allows navigating to nested objects and arrays if a dataSchema is specified. When 'show-editor', the navigation is allowed, and the object/array fields are displayed in a JSON editor. When false, the navigation is not allowed, and the object/array fields are displayed in a JSON editor |
| `width`                       | -                         | string \| number                                                                                                 | -       | Width of the drawer                                                                                                                                                                                                                                                                                                                                                  |
| `liveSearchItemsLimit`        | `live-search-items-limit` | number                                                                                                           | 10      | Max items to fetch on regex live search                                                                                                                                                                                                                                                                                                                              |
| `customLabels`                | -                         | [CustomLabels](#customlabels) \| {insert: CustomLabels, update: CustomLabels}                                    | -       | Custom localized texts shown as title and CTA button label                                                                                                                                                                                                                                                                                                           |
| `requireConfirm`              | -                         | boolean \| [RequireConfirmOpts](#requireconfirmopts) \| {onSave: RequireConfirmOpts, onSave: RequireConfirmOpts} | false   | Whether or not the component should request confirmation before closing and/or before saving                                                                                                                                                                                                                                                                         |


#### RequireConfirmOpts

```typescript
type RequireConfirmOpts = boolean | {
  cancelText?: LocalizedText
  okText?: LocalizedText
  content?: LocalizedText
  title?: LocalizedText
}
```

where [LocalizedText][localized-text] is either a string or an object mapping language acronyms to strings.

#### CustomLabels

```typescript
type CustomLabels = {
  title?: LocalizedText
  ctaLabel?: LocalizedText
  saveChangesContent?: LocalizedText
  unsavedChangesContent?: LocalizedText
}
```

where [LocalizedText][localized-text] is either a string or an object mapping language acronyms to strings.


### Listens to

| event                             | action                                                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [add-new]                         | opens the drawer to create a new item, potentially applying default fields from data schema or data provided in the payload of the event |
| [selected-data]                   | opens the drawer to edit a selected item, filling in its fields from the data provided in the payload of the event                       |
| [nested-navigation-state/push]    | updates internal representation of the current navigation path by adding one step                                                        |
| [nested-navigation-state/back]    | updates internal representation of the current navigation path by removing the specified number of steps                                 |
| [nested-navigation-state/display] | updates internal representation of the current navigation and closes the drawer                                                          |
| [success]                         | notifies correct data update as a result of form submission                                                                              |
| [error]                           | notifies that something went wrong during form submission                                                                                |

### Emits


| event                   | description                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| configurable event      | property `afterFinishEvents` allows to emit custom events                                                               |
| [require-confirm]       | triggered when trying to close the modal with unsaved data. `requireConfirm` property allows to customize this behavior |
| [create-data]           | requests data creation                                                                                                  |
| [update-data]           | requests data update                                                                                                    |
| [create-data-with-file] | requests data creation and file upload                                                                                  |
| [update-data-with-file] | requests data update and file upload                                                                                    |