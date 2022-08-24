---
id: data_visualization
title: Data Visualization
sidebar_label: Data Visualization
---
## Calendar

Renders a calendar to manage appointments.
![calendar](../img/bk-calendar.png)
```html
<bk-calendar></bk-calendar>
```

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
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[display-data](../events#display-data)|receives data to display| - | - |


### Emits

| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requires data that fall ion the currently visualized month|
|[add-new](../events#add-new)|triggers the creation of a new event with the selected `start` and `end`|
|[selected-data](../events#selected-data)|notifies about the click on an event|
|[update-data](../events#update-data)|triggers the update of the `start` and `end` of an event|


### Bootstrap

- This component parse URL for `date` and `view` parameters.
- This component emits a `change-query` event.



## Table

Displays a dataset in rows and columns according to a given `data schema`.
![table](../img/bk-table.png)
```html
<bk-table></bk-table>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`allowNavigation`|`allow-navigation`|boolean| - | - |true|when `true`, it is possible to navigate to nested objects and arrays if a dataSchema is specified|
|`browseOnRowSelect`| - |ClickPayload & { navigationType?: "replace" \\| "push" \| "href"; }| - | - | - |if set, a click on a row will navigate you to another location|
|`customActions`| - |{ tag: string; properties: Record\<string, any\>; }[]| - | - | - |list of custom components, rendered in the action column|
|`customMessageOnAbsentLookup`| - |string \\| { [x: string]: string; }|true| - | - |override lookup value in case lookup is not resolved due to lack of data|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - | - | - |[data schema](../page_layout#data-schema) describing the fields of the collection to display|
|`disableRowClick`|`disable-row-click`|boolean| - | - |false|when `true`, a click on a row does not trigger an event|
|`disableRowSelection`|`disable-row-selection`|boolean| - | - |false|when `true`, checkbox in the first column will not be displayed|
|`disableRowSelectionChange`|`disable-row-selection-change`|boolean| - | - |false|when `true`, selecting a row through the checkbox in the first column does not trigger an event|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |
|`initialSortDirection`| - |any| - | - | - |initial sorting direction to use when component bootstraps|
|`initialSortProperty`| - |any| - | - | - |Initial property to sort on when component bootstraps|
|`loadingOnStart`|`loading-on-start`|boolean| - | - |true| - |
|`maxLines`|`max-lines`|number| - | - | - |force lines that will be displayed together|
|`navigationRowActions`| - |{ kind: "cta" \\| "icons"; actions: NavigationDataAction[]; }| - | - |DEFATULT_NAV_ACTIONS|actions in nested objects.|
|`openFileInViewerRegex`| - |string \\| string[] \| { [x: string]: "view" \| "download"; }|true| - | - |regex expressions that are matched against file cells. If one matches, the cell is clickable and the file opens inside a viewer (default) or is downloaded.|
|`resizableColumns`|`resizable-columns`|boolean| - | - |false|whether the table columns can be resized. When `true`, columns can be resized from the table header|
|`rowActions`| - |DataActions| - | - | - |list of actions to render per row|
- `browseOnRowSelect` accepts an object such as
>
> ```json
> {
>    "href": "destination/url",
>    "target": "_self",
>    "query": {
>      "id": "{{data._id}}"
>    },
>    "navigationType": "push"
> }
> ```
>
> | property | type | values | description |
> |-----------------------|------|---------|-------------|
> | `href` | string | any | link reference. Only relative links are accepted. |
> | `target` | string | any | where to open the href. Defaults to "_self" |
> | `query` | Record\<string, any\> | any | query parameters |
> | `navigationType` | string | `push`, `replace`, `href` | method used for navigation if target is "_self" |
>
> ### navigation types
> `navigationType` values map to navigation methods as follows:
> | value | method |
> | ----- | ------ |
> | `push` | window.history.push |
> | `replace` | window.history.replace |
> | `href` | window.location.replace |
>
- `customActions` is a list such as:
>
> ```json
> {
>   "customActions": [{
>     "tag": "bk-button",
>     "properties": {
>       "content": "Cancel order",
>       "disabled": {
>         "template": "{{args.[1].orderStatus}}",
>         "configMap": {
>           "Delivered": true,
>           "Cancelled": true,
>           "$default": false
>         }
>       },
>       "clickConfig": {
>         "type": "http",
>         "actionConfig": {
>           "url": "the/url",
>           "method": "POST",
>           "body": "{{rawObject args.[1]}}"
>         }
>       }
>     }
>   }]
> }
> ```
> | property | type | values | description |
> |-----------------------|------|---------|-------------|
> | `tag` | string | any | custom component to mount |
> | `properties` | {[key: string]: any} | any | properties injected into the component |
>
> #### Notes
>
> Dynamic values can be specified using handlebars. `args.[1]` is the object representation of the table row.
> If the value of the field should be considered as object, the handlebars helper 'rawObject' can be specified.
>
>
> If is also possible to provide a <template, configMap> pair instead of a value for a property. In such cases, the value of the property is taken from the configMap using template as key
> (or `$default`, if the template does not match any configMap key).
- `NavigationDataActions` is an object such as
>
> ```json
> {
>   "kind": "icons",
>   "actions": [{
>     "danger": true,
>     "requireConfirm": true,
>     "type": "delete",
>     "disableInReadonly": true
>   }]
> }
> ```
>
> | property | type | values | description |
> |-----------------------|------|---------|-------------|
> | `kind` | string | `cta`, `icons` | whether to display the action in form of text or icon. |
> | `actions` | array of actions | any | describes the behavior of each. |
>
> #### action object
> | property | type | values | description |
> |----------|------|--------|-------------|
> | `requireConfirm` | booelan | any | Whether or not to require confirm. |
> | `danger` | `boolean` | `true`, `false`, `undefined` | set danger mode on action |
> | `type` | `string` | 'delete', 'detail' | if `delete`, the row is deleted from the nested object (and `update-data` event is emitted). If `detail`, a `selected-data` event is emitted with the data from the row.|
> | `disableInReadonly` | boolean | any | Whether or not to disable the action for read-only nested objects. |
>
> By default:
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
- `DataActions` is an array of
>
> ```json
> {
>   "actions": [{
>     "kind": "event",
>     "danger": "true",
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
> | `kind` | `string` | `httpPost`, `event` | when `event` fires an event in the `eventBus`, otherwise performs a `POST` request with the content of the row as body |
> | `danger` | `boolean` | `true`, `false`, `undefined` | set danger mode on action |
> | `content` | string | any | when `event` it must be the label of a [registered event](../events), otherwise the `POST` request destination href |
> | `label` | string| any | a label to render with the row action button |
> | `icon` | string | any | [Fontawesome fas or far icon](https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular,solid&m=free) |
> | `meta` | object | any | the event `meta` when `kind` is `event` |
> | `requireConfirm` | `object` or 'boolean' | any | The customizable properties of the modal that will be prompted or `true` for default Modal |
>
> #### requireConfirm object
> | property | type | values | description |
> |----------|------|--------|-------------|
> | `cancelText` | [localizedText](../core_concepts#localization-and-i18n) | any | Cancel button label |
> | `content` | [localizedText](../core_concepts#localization-and-i18n) | any | Text content of the modal. It supports interpolation via Handlebars using the current row values with resolved lookups (e.g., 'Hello {{name}}') |
> | `okText` | [localizedText](../core_concepts#localization-and-i18n) | any | Confirm button label |
> | `title` | [localizedText](../core_concepts#localization-and-i18n) | any | Title of the modal. It supports interpolation via Handlebars using the current row values with resolved lookups (e.g., 'Hello {{name}}') |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[lookup-data](../events#lookup-data)|receives lookup data| - | - |
|[display-data](../events#display-data)|receives data to display|[selected-data-bulk](../events#selected-data-bulk)| - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |
|[nested-navigation-state/display](../events#nested-navigation-state---display)|updates internal representation of the data to display in navigation| - | - |


### Emits

| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requires data sorting according with the sorted property|
|[selected-data](../events#selected-data)|notifies about the click on a row|
|[selected-data-bulk](../events#selected-data-bulk)|notifies about a change in the rows selected through the checkboxes in the first column|
|[nested-navigation-state/push](../events#nested-navigation-state---push)|notifies to add a step in the navigation path|
|[nested-navigation-state/display](../events#nested-navigation-state---display)|notifies data to display (emitetd upon column sorting)|
|Configurable custom events|any event configured in the `rowActions` property|


### Bootstrap

- This component parse URL for `sortDirection` and `sortProperty` parameters.
- This component emits a `change-query` event if both `sortDirection` and `sortProperty` are found in the URL.



## bk-breadcrumbs

represents current navigation path and allows to go back at any navigation level.
```html
<bk-breadcrumbs></bk-breadcrumbs>
```
![breadcrumbs](../img/bk-breadcrumbs.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |data schema describing the fields of the collection to display |
|`showHome`|`show-home`|boolean|true|toggles visualization of a `home` icon at breadcrumbs 0-level |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |
|[change-query](../events#change-query)|triggers page refresh and goes back to 0-level, unless empty payload| - | - |
|[display-data](../events#display-data)|triggers page refresh and tries to recreate navigation path with new data. If fails, goes back to 0-level| - | - |


### Emits

| event | description |
|-------|-------------|
|[nested-navigation-state/back](../events#nested-navigation-state---back)|notifies to go back the specified number of steps in the navigation path|


### Bootstrap

None



## bk-card

read-only visualizer for objects, arrays and images.
```html
<bk-card></bk-card>
```
`bk-card` is a multi-purpose, read-only frontend webcomponent that is designed to represent
- objects
- array of objects
- images
![bk-card](../img/bk-card.png)
It is not suited for editing. That role is delegated to the `bk-form-card` component.
`bk-card` is made by blocks and is recursive, which means that cards can be embedded in cards creating, for instance, a picture gallery instead of showing a single picture.
This can be achieved by leveraging only the `bk-card` tag.


## Roles

A `bk-card` has roles which define a color code
1. `default` - white background and no border
2. `info` - white background, grey border and grey font color
3. `success` - white background, primary-color border and primary-color font color
4. `error` - red background, red border and red main title.


## Layout

A `bk-card` is made of 3 HTML5 tag
1. `header`
2. `main`
3. `footer`
if either of these keys is absent from `bk-card` configuration, it won't appear in the `bk-card` shadow DOM and it won't clutter its internal structure.
A basic card configuration looks like:
```json
{
  "role": "info",
  "cardSchema": {
    "header": {
      ...
    },
    "main": {
      ...
    },
    "footer": {
      ...
    }
  }
}
```
The simplest card layout is an informative card:
![error-card](../img/error-card.png)
which is obtained by combining header and footer. From a layout perspective we expect to have titles in the header, content in the main and actions/titles in the footer.
To configure a card, we must describe its `cardSchema`:
```typescript
export type CardSchema = {
  header?: {
    icon?: string
    title?: LocalizedText
    badge?: LocalizedText
    subtitle?: LocalizedText
  }
  main?: {
    dataSchema?: DataSchema
    cards?: CardSchema | CardSchema[]
    img?: string | URL
  }
  footer?: {
    title?: LocalizedText
    subtitle?: LocalizedText
    subsubtitle?: LocalizedText
    buttons?: BkButton | BkButton[]
  }
}
export type TaggableCustom = {
  value: string
  tag: string
  properties: Record<string, any>
  data: Record<string, any>
}
```
### Header
Header supports:
1. title (h1)
2. subtitle (h2)
3. badge
4. icon
Each one of them is optional and the layout is left-float icon + title + badge and a second line with the subtitle
![header-example](../img/card-header.png)
Title, subtitle and badge can be internationalized using `LocalizedText` which is either a string or an object with language support:
```json
{
  "cardSchema": {
    "header": {
      "icon": "fas fa-building",
      "title": {"en": "Conversation", "it": "Conversazione"},
      "badge": {"en": "Awaiting", "it": "In Attesa"},
      ...
    }
  }
}
```
::info
Available icons are [`@ant-design/icons`](https://ant.design/components/icon) or any [fontawesome public solid or regular icon](https://fontawesome.com/v5/search?m=free&s=solid%2Cregular).
:::
:::info
Icons are dynamically imported to reduce bundle size. So if you don't use you don't download it.
:::
### Footer
Footer encapsulates actions and can mount an unlimited number of buttons (or even other components). Its configuration supports
1. title
2. subtitle
3. subsubtitle
4. buttons
The former three are similar to the header properties. `buttons` key instead takes either an object or an array of objects that can contain the key `tag`.
When `tag` is not specified it defaults to HTML5 `button`. Footer will render the given tag and it will apply and other property of the corresponding configuration
object as vanilla JS property on an HTML5 tag.
A user-agent browser default button can be achieved as:
```json
{
  "children": {
    "Click me!"
  }
}
```
but more often we will use back-kit `bk-button` customizable button as shown in the `error`-role card above. That button was achieved as
```json
{
  "footer": {
    ...
    "buttons": {
      "tag": "bk-button",
      "content": {
        "it": "Scarica PDF autorizzazione",
        "en": "Download authorization PDF"
      },
      "iconId": "DownloadOutlined",
      "type": "link"
    }
  }
}
```
A card can also be composed by text-only content:
```json
{
  "role": "info",
  "cardSchema": {
    "footer": {
      "subtitle": "Text"
    }
  }
}
```
Footer supports dynamic configurations via handlebars notation. The content of the card can be utilized inside handlebars via the keyword 'data'. For instance:
```json
{
  "role": "info",
  "cardSchema": {
    ...
    "footer": {
      "subtitle": "{{data.name}}"
    }
  }
}
```
will display a card having as footer sub-title the value of the field 'name' of the displayed data.
It is possible to replace handlebars with an object instead of a string value using the keyword `rawObject`:
```json
{
  "role": "info",
  "cardSchema": {
    ...
    "footer": {
      "buttons": {
        "tag": "bk-button",
        "content": "Details",
        "clickConfig": {
          "type": "event",
          "actionConfig": {
            "label": "selected-data",
            "payload": "{{rawObject data}}"
          }
        }
      }
    }
  }
}
```
This footer will have a button that emits a `selected-data` event with payload the card content as an object.
### Main
Main is the core part of the card and the most widely customizable section. It roughly accepts configuration for 3 different modes (all of which can be combined at will in a single card).
1. `object`-mode
2. `array`-mode
3. `image`-mode
4. `recursive` mode
To describe an object we can use a back-kit `DataSchema` schema. Awaiting a `display-data` event and an optional `lookup-data` event, the first object is then visualized inside the card main
by listing those key reported within the `DataSchema`. If an item if of type `array` its `DataSchema` can be nested to represent arrays:
```json
{
  "dataSchema": {
    "type": "object",
    "properties": {
      "status": {
        "label": "Status",
        "type": "string"
      },
      "liv1": {
        "type": "array",
        "label": "First Floor",
        "dataSchema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "surname": {
              "type": "string"
            }
          }
        }
      },
      "notification": {
        "label": "Notifications",
        "type": "object",
        "format": "localized-text"
      },
      "riderId": {
        "label": "Rider",
        "type": "string",
        "format": "lookup"
      },
      "customerId": {
        "label": "Customer",
        "type": "string",
        "format": "lookup"
      }
    }
  }
}
```
in the former example we have a `status` string field, then a nested array `liv1` and lookups `riderId`, `customerId` and a composite object `notification`. This configuration
encompasses `object` and `array` mode.
`image`-mode is useful for an item which has an image cover like
```json
{
  "cardSchema": {
    "main": {
      "img": "https://source.unsplash.com/random/300x200"
    },
    "footer": {
      "subtitle": "Web cover image",
      "buttons": {
        "tag": "bk-button",
        "content": {
          "en": "Change image",
          "it": "Cambia immagine"
        },
        "type": "link",
        "clickConfig": {
          "type": "file-upload",
          "actionConfig": {
            "url": "/v2/img-upload",
            "returnEvent": "change-query"
          }
        }
      }
    }
  }
}
```
In this example an image is combined with a footer which uses `bk-button` to upload a new image via a button which is placed beneath the image. The `returnEvent` property allows you to specify an event to be thrown when the action is finished. The example requires a page refresh to display the newly uploaded image.
`recursive` is a mode that embeds cards into cards. The very same structure described here can be nested by using
```json
{
  "cardSchema": {
    "main": {
      "cards": [
        {
          "header": {...},
          "main": {...},
          ...
        },
        {
          "header": {...},
          "main": {
            "cards": [
              {
                "header": {
                  ...
                }
              }
            ]
          },
          ...
        }
      ]
    }
  }
}
```
using this trick we can for instance obtain a gallery of pictures.  
When the `cards` field is specified, it is not possible to view other information on the card.  
If you have nested cards, you can specify properties of the array type on the outermost card and access the relative elements through handlebars, accessing the `arraySource` object. Nested arrays are not currently supported, it is possible to use only one-level arrays.  
In the example configuration below we have a card that declares an array of URL, and internal cards that are responsible for displaying the images contained in the array. As shown, the internal cards are able to access the property described in the external card, which is therefore shared among all the internal cards.  
```json
{
  "type": "element",
  "tag": "bk-card",
  "properties": {
    "cardSchema": {
      "header": {
        "title": "Images"
      },
      "main": {
        "dataSchema": {
          "type": "object",
          "properties": {
            "images": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "cards": [
          {
            "cardSchema": {
              "main": {
                "img": "{{arraySource.images.[0]}}"
              },
              ...
            }
          },
          {
            "cardSchema": {
              "main": {
                "img": "{{arraySource.images.[1]}}"
              },
              ...
            }
          }
        ]
      }
    }
  }
},
```

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`arraySource`| - |Record\<string, Record\<string, string \\| TaggableCustom\>[]\>|{}|property to inject the array-like source from an external source not linked with the `eventBus`. This is overridden by the `display-data` event |
|`cardSchema`| - |CardSchema|{}|schema that describes the card layout, role and type/style |
|`containerStyle`| - |CSSProperties| - |React-like CSS properties to decorate card container |
|`customMessageOnAbsentDatum`| - |LocalizedText| - |when datum reaches the card but it doesn't have value but some was expected, the displayed string can be overridden with a custom message |
|`customMessageOnAbsentLookup`| - |LocalizedText| - |when using a CRUD-client-like source, it helps displaying a custom message on lookup that couldn't be resolved |
|`objectSource`| - |Record\<string, string \\| TaggableCustom\>|{}|property to inject the object-like source from an external source not linked with the `eventBus` This is overridden by the `display-data` event |
|`role`| - |CardRoles|'default'|card role to select color schema |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[display-data](../events#display-data)|displays the first item of the payload according to the card main dataSchema| - | - |
|[lookup-data](../events#lookup-data)|updates data with resolved lookups| - | - |


### Emits

This component emits no event.


### Bootstrap

None



## bk-chip

displays status information.
```html
<bk-chip></bk-chip>
```
`bk-chip` is used to display status information. The `value` property allows you to specify the status value. By using the `valueMap` property, you can describe how to display the status information based on the value. For each value it is possible to specify a label to display and a color to customize the Chip component.
![bk-chip](../img/bk-chip.png)
Example of configuration: 
```
{
  "type": "element",
  "tag": "bk-chip",
  "properties": {
    "value": "{{args.[0]}}",
    "valueMap": {
      "Value1": {
        "label": "Label1",
        "color": "#F00"
      },
      "Value2": {
        "label": {
          "en": "Label2En",
          "it": "Label2It"
        }
        "color": "primary"
      }
    }
  }
}
```
With this configuration, if the value is `Value1` the label `Label1` will be used and the Chip component will be shown in red (#F00).  
The `label` field can be a string or a LocalizedText object. If no label is specified for a value, the value will be displayed as a label.  
You can specify the `color` field with an Hex color code. If the specified color is not a valid Hex color code, the primary color will be used. 

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`value`| - |LocalizedText|{}|status value. |
|`valueMap`| - |Record\<string, any\>|{}|map of possible values. |


### Listens to

This component listens to no event.


### Emits

This component emits no event.


### Bootstrap

None



## bk-dynamic-title

represents a dynamic title to be displayed using the specified key of a display-data event.
```html
<bk-dynamic-title></bk-dynamic-title>
```
This component is used to display as its content one of the data retrieved from a remote source,
thanks to the `display-data` event.
As `display-data` send an array of objects, only the first entry is considered.
The content of the title, extracted from the first entry, is chosen through the `datasourceKey`, which should be present in the received payload object.

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`datasourceKey`|`datasource-key`|string|''|the object key that will be used to pick the data to show. |
|`titleStyle`|`title-style`|string| - |pre-configured style that will be applied to the text. Currently only `title` and `subtitle` are supported. |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|display-data|triggers page refresh and goes back to 0-level|change-query| - |


### Emits

This component emits no event.


### Bootstrap

None



## bk-pdf-viewer

allows to visualize files in the browser.
```html
<bk-pdf-viewer></bk-pdf-viewer>
```
![pdf-viewer](../img/bk-pdf-viewer.png)
:::note
it is recommend to limit the usage of this component to the visualization of PDF files.
:::

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[show-in-viewer](../events#show-in-viewer)|opens PDF in brawser| - | - |


### Emits

This component emits no event.


### Bootstrap

None



## bk-simple-list

represents a list of simple elements to be visualized.
```html
<bk-simple-list></bk-simple-list>
```
`bk-simple-list` is used to display a list of simple elements (strings, numbers, ...). The set to display is chosen through the `datasourceKey`, which should match with one of the entries in the `dataSchema` of the page.
A `label` can be specified to be displayed as header of the list.
![bk-simple-list](../img/bk-simple-list.png)
Example of configuration: 
```
{
  "type": "element",
  "tag": "bk-simple-list",
  "properties": {
    "datasourceKey": "items",
    "label": {
      "en": "Header",
      "it": "Titolo"
    }
  }
},
```
With this configuration, the field `items` of the dataSchema will be displayed. Each item is required to have a basic data type (string, number, ...). In case of complex data type, the `bk-list` component should be used.
The list of elements to display is passed to the component using the `display-data` event, which contains the data in its payload.

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`datasourceKey`|`datasource-key`|string|''|the object key that will be used to pick the data to show. |
|`label`| - |LocalizedText|{}|header of the list. |
|`loading`|`loading`|boolean|true|sets list on loading at DOM connection |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|`display-data`|retrieved data to display| - | - |
|`loading-data`|choose when to show the list spinner| - | - |


### Emits

This component emits no event.


### Bootstrap

None
