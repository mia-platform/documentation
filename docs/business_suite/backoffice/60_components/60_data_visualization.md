---
id: data_visualization
title: Data Visualization
sidebar_label: Data Visualization
---
## bk-atlas-dashboard

read-only dashboard from MongoDB Atlas.
```html
<bk-atlas-dashboard></bk-atlas-dashboard>
```

The `bk-atlas-dashboard` is an embedding of a dashboard from MongoDB Atlas which displays data (or filtered data when alongside a filtering component).

![dashboard](../img/bk-atlas-dashboard.png)

:::info
To embed an authenticated dashboard it's mandatory to use a custom microservice for the authentication. For instance, service `atlas-dashboard-authentication` is available in [marketplace](../../../marketplace/overview_marketplace).
`apiKey` and `authEndpoint` properties enable you to expose an endpoint to that service.
:::

## Known Issues

It could happen that the component keeps resizing. This is due to some scaling problem of the embedded Mongo Atlas `<iframe>`.
This is a known issue of Mongo Atlas, which can beb temporarily fixed adding some padding to the component:

```json
  {
    "tag": "bk-atlas-dashboard",
    "properties": {
      ...
    },
    "attributes": {
      "style": "padding: 0.5px"
    }
  }
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`apiKey`|`apiKey`|string| &check; | - | - |apikey to call the authentication route from a trusted entity. Leave empty if not set|
|`authEndpoint`|`authEndpoint`|string| &check; | - | - |endpoint for the dashboard authentication|
|`background`|`background`|string| &check; | - |'transparent'|background color of the dashboard. Possible values are color hex code, CSS color name or 'transparent'|
|`baseUrl`|`base-url`|string| - | &check; | - |base URL of the embedded dashboard|
|`dashboardId`|`dashboard-id`|string| - | &check; | - |dashboard id of the embedded dashboard|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - | &check; | - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection|


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[change-query](../events#change-query)|apply the change-query filter to its dashboard| - | - |

## bk-calendar

Renders a calendar to manage appointments.
![calendar](../img/bk-calendar.png)

```html
<bk-calendar></bk-calendar>
```
### Views

There are three types of view: day, week and month. Month is the view set as default but it is possible to change it with the `view` property.


:::warning
`bk-calendar` requires `bk-filters-manager` component to be included in the page, as it makes use of [add-filter](../70_events.md#add-filter) event for data pre-filtering.
Filters on `startDate` and `endDate` properties can be hidden setting `filterOptions.hidden` to true in the `dataSchema` of the `bk-filters-manager`. For instance:

```json
  {
    "type": "element",
    "tag": "bk-filters-manager",
    "properties": {
      "filters": [],
      "dataSchema": {
        ...
        "startDate": {
          ...
          "filtersOptions": {
            "hidden": true
          }
        },
        "endDate": {
          ...
          "filtersOptions": {
            "hidden": true
          }
        },
        ...
      }
    }
    ...
  }
```
:::


:::info
For `bk-calendar` to correctly display appointments, these must have the following fields non null:

| property | description |
|----------|-------------|
|`startDate`| start date of the appointment |
|`endDate`| end date of the appointment |
|`title`| title of the appointment |
:::

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`additionalCreatePayload`| - |{ [x: string]: any; }| - | - |{}|data that should be passed in the payload of a new event alongside `startDate` and `endDate`|
|`date`| - |Date| - | - |new Date()|current date of the calendar|
|`height`|`height`|string| - | - | - |css-height the calendar should occupy in the page as described here: [https://developer.mozilla.org/en-US/docs/Web/CSS/height]|
|`view`| - |"agenda" \| "day" \| "month" \| "week" \| "work_week"| - | - |'month'|current view of the calendar. Possible values are `month`, `week`, or `day`|
|`filtersName`| - |{start: [LocalizedString](../40_core_concepts.md#localization-and-i18n), end: [LocalizedString](../40_core_concepts.md#localization-and-i18n)}| - | - | {start: "bk-calendar-start-date-filter", end: "bk-calendar-end-date-filter"} |names of default date filters|
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

## bk-breadcrumbs

represents current nesting path and allows to go back at any navigation level.

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

### Roles

A `bk-card` has roles which define a color code

1. `default` - white background and no border
2. `info` - white background, grey border and grey font color
3. `success` - white background, primary-color border and primary-color font color
4. `error` - red background, red border and red main title.

### Layout

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
    buttons?: CardButton | CardButton[]
    buttonsLayout?: 'horizontal' | 'vertical'
  }
}

export type TaggableCustom = {
  value: string
  tag: string
  properties: Record<string, any>
  data: Record<string, any>
}
```

#### Header

Header supports:

1. title (h1)
2. subtitle (h2)
3. badge
4. icon

Each one of them is optional and the layout is left-float icon + title + badge and a second line with the subtitle

![header-example](../img/card-header.png)

Title, subtitle and badge can be internationalized using [LocalizedText](../40_core_concepts.md#localization-and-i18n) which is either a string or an object with language support:

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

#### Footer

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

but more often we will use back-kit [bk-button](./20_buttons.md#bk-button) customizable button as shown in the `error`-role card above. That button was achieved as

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

Multiple buttons can be specified, and support two layouts: `horizontal` and `vertical` (default), which can be controlled with footer property `buttonsLayout`.
```json
{
  "role": "info",
  "cardSchema": {
    "footer": {
      "buttonsLayout": "horizontal",
      "buttons": [
        {
          "tag": "bk-button",
          "content": {
            "it": "Scarica PDF autorizzazione",
            "en": "Download authorization PDF"
          },
          "iconId": "DownloadOutlined",
          "type": "link"
        },
        {
          "tag": "bk-button",
          "content": {
            "it": "Fai un'altra richiesta",
            "en": "Make a new request"
          }
        }
      ]
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

Footer supports [dynamic configurations](../40_core_concepts.md#dynamic-configuration) via [handlebars notation](https://handlebarsjs.com/guide/expressions.html). The content of the card can be utilized inside handlebars via the keyword 'data'. For instance:

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
It is possible to replace handlebars with an object instead of a string value using the keyword [rawObject](../40_core_concepts.md#rawobject):

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

This footer will have a button that emits a `selected-data` event, having an object payload equal to the card content.

If is furthermore possible to provide dynamic configurations via a [template-configMap pair](../40_core_concepts.md#template---configmap) pair. In such cases, the resulting value is taken from the configMap using template as key (or `$default`, if the template does not match any configMap key).

For instance, assuming the same example parameters as the previous example, the following configuration:
```json
{
  "cardSchema": {
    ...
    "footer": {
      "buttons": {
        "tag": "bk-button",
        "disabled": {
          "template": "{{data.status}}",
          "configMap": {
            "active": false,
            "$deafult": true
          }
        },
        ...
      }
    }
  }
}
```

will resolve to:

```json
{
  "cardSchema": {
    ...
    "footer": {
      "buttons": {
        "tag": "bk-button",
        "disabled": false,
        ...
      }
    }
  }
}
```

for cards having `status` field set to "active" in its data, and:

```json
{
  "cardSchema": {
    ...
    "footer": {
      "buttons": {
        "tag": "bk-button",
        "disabled": true,
        ...
      }
    }
  }
}
```
for cards having `status` set to anything but "active".


:::info
A `template`-`configMap` pair can be applied to keys at the first level of the `footer` object, and to keys at the first level of `footer.buttons`.
For instance, the following is NOT a valid configuration:
```json
{
  "cardSchema": {
    ...
    "footer": {
      "buttons": {
        "tag": "bk-button",
        "clickConfig": {
          "type": "event",
          "actionConfig": {
            "label": {
              "template": "{{data.status}}",
              "configMap": {
                "active": "selected-data",
                "$deafult": "add-new"
              }
            },
            "payload": {}
          }
        },
        ...
      }
    }
  }
}
```
since `template`-`configMap` pair is not applied to a first-level key of `buttons`. An analogous and correct configuration in this case would be:
```json
{
  "cardSchema": {
    ...
    "footer": {
      "buttons": {
        "tag": "bk-button",
        "configMap": {
          "template": "{{data.status}}",
          "configMap": {
            "active": {
              "type": "event",
              "actionConfig": {
                "label": "selected-data",
                "payload": {}
              }
            },
            "$default": {
              "type": "event",
              "actionConfig": {
                "label": "add-new",
                "payload": {}
              }
            }
          }
        }
        ...
      }
    }
  }
}
```
:::

#### Main

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
}
```

[visualizationOptions](../30_page_layout.md#visualization-options) are interpreted by `bk-card`. In particular, custom components can be mounted using a `tag`-`properties` pair in place of fields. For instance, the following is a valid configuration:
```json
{
  "type": "element",
  "tag": "bk-card",
  "properties": {
    "cardSchema": {
      "main": {
        "dataSchema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "visualizationOptions": {
                "tag": "div",
                "properties": {
                  "textContent": "The name is: {{args.[0]}}"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

which will mount a `div` component in place of the field `name`.
`args.[0]` refers to the value of the corresponding field (in this case, `name`). `args.[1]` is also available, referencing the full data of the card.
Helper [rawObject](../40_core_concepts.md#rawobject) is also available, analogously to [buttons](#footer).

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`arraySource`| - | { [x: string]: { [y: string]: string \| TaggableCustom }[] } |{}|property to inject the array-like source from an external source not linked with the `eventBus`. This is overridden by the `display-data` event |
|`cardSchema`| - |CardSchema|{}|schema that describes the card layout, role and type/style |
|`containerStyle`| - |CSSProperties| - |React-like CSS properties to decorate card container |
|`customMessageOnAbsentDatum`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |when datum reaches the card but it doesn't have value but some was expected, the displayed string can be overridden with a custom message |
|`customMessageOnAbsentLookup`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |when using a CRUD-client-like source, it helps displaying a custom message on lookup that couldn't be resolved |
|`objectSource`| - | { [y: string]: string \| TaggableCustom } |{}|property to inject the object-like source from an external source not linked with the `eventBus` This is overridden by the `display-data` event |
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
The `label` field can be a string or a [LocalizedText](../40_core_concepts.md#localization-and-i18n) object. If no label is specified for a value, the value will be displayed as a label.  
Field `color` can be specified using an Hex color code. If the specified color is not a valid Hex color code, the primary color will be used.

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`value`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)|{}|status value. |
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

## bk-gallery

```html
<bk-gallery></bk-gallery>
```

![bk-gallery](../img/bk-gallery.png)

Allows to visualize image files within an adaptive grid, as well as other data.

Each item in the grid is composed of:
- readonly data (title, subtitle, thumbanil, preview)
- actions (buttons, action menu, clickable image)

### Appearance

#### Gallery Items
Gallery items are placed into a grid, which adapts to the screen size.

Each gallery item can be configured in size using properties `itemHeight` and `itemWidth`, controlling height and width respectively.

If `itemHeight` is not specified, items adapt their height to their content.

Property `itemWidth` supports both numeric values (will be interpreted as pixels) or "small", "medium", "large".
It represents the attempted width of each gallery item, but may vary slightly due to the adaptive nature of the grid.

`gutter` property can be used to control the spacing around each gallery item.

#### Preview Modal

Unless property `disableExpand` is set to false, `preview` image of an item can be visualized inside a modal.
The modal can be configured in size using `modalWidth` and `modalHeight`, and a title can be specified with `modalTitle` (if not specified, the item title is used).

### Data

Each gallery item allows to visualize an image (thumbanil), a preview within a modal (preview) and two types of text (title and subTitle).

The properties that control this options are:
- `thumbnailSource`
- `previewSource`
- `titleSource`
- `subTitleSource`

Upon listening to a [display-data](../events#display-data) event, the Gallery component uses these properties to render one item per data row.

#### XPath

`titleSource`, `subTitleSource`, `thumbnailSource` and `previewSource` properties are of type `XPath`.

```typescript
type XPath = string | {
  path?: string
  default?: LocalizedText
}
```

An XPath represents the path to apply to the data source, in javascript notation, to extract the desired data.
For instance, with data equal to
```json
[
  {
    "objField": {
      "arrField": [
        "test"
      ],
      "stringField": "foo"
    },
    "document": "some/path.jpg"
  }
]
```
a gallery configured with the following properties:
```json
{
  "titleSource": "objField.arrField.[0]",
  "subTitleSource": "objField.stringField",
  "thumbnailSource": "document"
}
```
will consist of a single item with
  - title equal to "test"
  - subTitle equal to "foo"
  - thumbnail equal to "some/path.jpg"
  - preview equal to "some/path.jpg" (since `previewSource` is not specified, preview is set to be the same as thumbnail)

XPath `default` key can be utilized to provide a default value in case the path is not resolved. For instance, the same input data with a gallery configured like
```json
{
  "titleSource": "objField.arrField.[0]",
  "subTitleSource": "objField.stringField",
  "thumbnailSource": "document",
  "previewSource": {
    "path": "objField.preview",
    "default": "default/file.jpg"
  }
}
```
results is a single item with
  - title equal to "test"
  - subTitle equal to "foo"
  - thumbnail equal to "some/path.jpg"
  - preview equal to "default/file.jpg"


`thumbnailSource` and `previewSource` also allow to specify a `template` field, which is used to interpolate the extracted value within a string. For instance, assuming the same data as the previous examples as input, the configuration
```json
{
  "thumbnailSource": {
    "path": "document",
    "default": "default/file.jpg",
    "template": "full/{{file}}"
  }
}
```
results in a single item having thumbnail equal to "full/some/path.jpg". The keyword `file` is used to identify the data extracted using `path`.
:::caution
In case `path` is unresolved, `default` is utilized and it is **not** interpolated inside `template`.
For instance, assuming the same input data and configuration
```json
{
    "thumbnailSource": {
    "path": "unk",
    "default": "default/file.jpg",
    "template": "full/{{file}}"
  }
}
```
the resulting `thumbanil` is "default/file.jpg" and not "full/default/file.jpg
:::


### Actions

`onImageClick`, `onTitleClick`, `onSubTitleClick` and `actions` properties allow to add [actions](../50_actions.md) to the `bk-gallery`.

Properties `onImageClick`, `onTitleClick`, `onSubTitleClick` are of type [Action](../50_actions.md), while property `actions` is of type
```typescript
type GalleryAction = {
  iconId?: string,
  content?: string,
  danger?: boolean,
  action: Action
}
```

The first two actions are rendered as buttons, (for which an iconId is required). The rest of the actions are rendered within an action menu.

Each action in the Gallery component has access to the following input data:
```typescript
{
  thumbnail: ..., // source for thumbnail image of the item
  preview: ..., // source for preview image of the item
  title: ..., // title of the item
  subTitle: ..., // subtitle of the item
  ... // all data fields of gallery item
}
```
which allows for dynamic configurations through [handlebars syntax](https://handlebarsjs.com/guide/expressions.html).

For instance, the following is a valid configuration for `actions`:
```json
{
  ...
  "actions": [
    {
      "iconId": "fas fa-users",
      "action": {
        "type": "http",
        "config": {
          "url": "/url",
          "method": "POST",
          "body": {
            "field1": "{{thumbnail}}",
            "field2": "{{name}}"
          }
        }
      }
    }
  ]
}
```

This action executes a POST call to the endpoint `/url`. The body will be resolved using the thumbnail of the gallery item, and the field `name` of its data.

It is possible to use the whole item data as input using key `context`:
```json
{
  "iconId": "fas fa-users",
  "action": {
    "type": "http",
    "config": {
      "url": "/url",
      "method": "POST",
      "body": "{{rawObject context}}"
    }
  }
}
```
[`rawObject`](../40_core_concepts.md#rawobject) is a custom helper signaling that `context` should not be stringified.

:::info
Keyword `context` does not include the values of `thumbnail`, `preview`, `title`, `subTitle`.
:::

### Checkbox

Each item can be selected through a checkbox, unless `disableSelection` property is set to true. Selecting an item emits a [selected-data-bulk](../events#selected-data-bulk) event with all selected items, allowing integration with components such as `bk-footer` or `bk-bulk-actions`.

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
| `thumbnailSource` | - | TemplateXPath | - | source path to thumbnail image |
| `previewSource` | - | TemplateXPath | - | source path to preview image (if not specified, `thumbnailSource` is used) |
| `titleSource` | - | XPath | - | source path to title text |
| `subTitleSource` | - | XPath | - | source path to subtitle text |
| `disableSelection` | `disable-selection` | boolean | false | whether to disable the possibility to select gallery items |
| `actions` | - | GalleryAction \| GalleryAction[] | - | available actions per gallery item |
| `onImageClick` | - | [Action](../50_actions.md) | - | action to execute on image click |
| `onTitleClick` | - | [Action](../50_actions.md) | - | action to execute on title click |
| `onSubTitleClick` | - | [Action](../50_actions.md) | - | action to execute on subtitle click |
| `disableExpand` | `disable-expand` | boolean | false | whether to disable the possibility of viewing the image inside a modal (preview) |
| `modalWidth` | `modal-width` | number \| string | - | width of the preview modal |
| `modalHeight` | `modal-height` | number \| string | - | height of the preview modal |
| `modalTitle` | `modal-title` | string | - | title of the preview modal (if not specified, the item title is used) |
| `gutter` | `gutter` | number | 20 | gutter of gallery items (vertical and horizontal spacing among gallery items) |
| `primaryKey` | `primary-key` | string | "_id" | key used for indexing gallery items |
| `itemHeight` | `item-height` | number \| string | - | height of gallery items. If not specified, items adapt to their content |
| `itemWidth` | `item-width` | number \| "small" \| "medium" \| "large" | "medium" | attempted width of gallery items |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
| [displayData](../events#displayData) | receives data to display | - | - |


### Emits

| event | action | emits | on error |
|-------|--------|-------|----------|
|[selected-data-bulk](../events#selected-data-bulk)|notifies about a change in the items selected through checkboxes|

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

`bk-simple-list` is used to display a list of simple elements (strings, numbers, ...) or even lookups. The set to display is chosen through the `datasourceKey`, which should match with one of the entries in the `dataSchema` of the page.

![bk-simple-list](../img/bk-simple-list.png)

Example of configuration: 
```json
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
With this configuration, the field `items` of the dataSchema will be displayed.

The list of elements to display is passed to the component using the `display-data` event, which contains the data in its payload. If the datasourceKey refers to a lookup field, it listens to `lookup-data` event which contains the solved lookups.

### Title

List title is configurable via the property `label`, which can be a string, [LocalizedText](../40_core_concepts.md#localization-and-i18n), or an `HeaderProps` object with the following fields:

| property | type | description |
|----------|------|-------------|
| title | string \| [LocalizedText](../40_core_concepts.md#localization-and-i18n) | title of the list (h1) |
| subtitle | string \| [LocalizedText](../40_core_concepts.md#localization-and-i18n) | subtitle (h2) displayed below the title |
| badge | string \| [LocalizedText](../40_core_concepts.md#localization-and-i18n) | badge displayed right of the title |
| icon | string | icon displayed left of the title |


For instance, the following is valid configuration for `label` property:
```json
{
  "label": {
    "icon": "fas fa-building",
    "title": {"en": "Conversation", "it": "Conversazione"},
    "badge": {"en": "Awaiting", "it": "In Attesa"},
    "subtitle": {"en": "This is a conversation", "it": "Questa è una conversazione"}
  }
}
```

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`datasourceKey`|`datasource-key`|string|''|the object key that will be used to pick the data to show. |
|`customMessageOnAbsentLookup`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |override lookup value in case lookup is not resolved due to lack of data |
|`label`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n) \| [HeaderProps](#title) |{}|header of the list. |
|`loading`|`loading`|boolean|true| sets list on loading at DOM connection |
|`height`|`height`|string \| number|-| max height of the body of the list before. Overflowing data is accessible through vertical scrolling. |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|`display-data`|retrieved data to display| - | - |
|`loading-data`|choose when to show the list spinner| - | - |

### Emits

This component emits no event.

### Bootstrap

None

## bk-table

```html
<bk-table></bk-table>
```

![table](../img/bk-table.png)
Displays a dataset in rows and columns according to a given [data schema](../30_page_layout.md#data-schema).

### Object and Array rendering

While rendering an array or an object from a compliant `DataSchema` (either `array` or `object` key type), multiple options are available

#### Object

1. `(unspecified)` when no extra `DataSchema` key is explicitly set the object renders either as `{...}` or `{}` depending on whether there are keys or not.
2. `dataSchema: <data-schema>` triggers nested visualization of objects
3. `format: "localized-text"` when object must be interpreted as an `i18n` string. `bk-table` will render the proper language key according with browser settings.
4. `visualizationOptions: {template: "<template>"}` interpolates an handlebars template using the current cell context. Hence if datum is given by

```json
{
  "key1": "value1",
  "key2": "value2"
}
```

#### Array

1. `(unspecified)` when no extra `DataSchema` key is explicitly set visualization informs about the number of elements contained within the array.
2. `dataSchema: <data-schema>` triggers nested visualization of objects
3. `visualizationOptions: {joinDelimiter: "<join-delimiter>"}` joins array element using the given delimiter as argument of `Array.prototype.join`
4. `visualizationOptions: {template: "<template>"}` interpolates an handlebars template using the current cell context. Hence if datum is given by

```json
["john", "doe"]
```

and template is `"{{[0]}} {{[1]}}"` then the table will render `john doe`. `template` has precedence over `joinDelimiter`.

### Web Component into BkTable

It is possible to insert a generic WebComponet as cell defining into the dataSchema a property object with type `custom`, and then defining all the WebComponent properties into the field `visualizationOptions`. Following an example:

```json
{
  "$ref": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "object": {
          "type": "custom",
          "label": "MyWebComponent",
          "visualizationOptions": {
            "tag": "my-button",
            "properties": {
              "content": "Click Me!"
            }
          }
        }
      }
    }
  }
}
```

In this case, we are creating the WebComponent identified by the tag `my-button` and giving to him all the keys into the object `properties` as attributes.

This is the same as doing `<my-button content="Click Me!" />`.

#### Dynamic properties interpolation

Each cell receives the following parameters when is rendered:

* `args`: an array with the cell arguments:

  - value: containing the value relative to dataSchema.  
  - record: an object containing the row content.
  - index: a number with the cell index into the table.

* `currentUser`: an object with the logged user's data.  
* `eventBus`: an object containing the eventBus instance.  
* `headers`: an object containing the headers.  

All the above parameters can be [dynamically interpolated](../40_core_concepts.md#dynamic-configuration) into the WebComponent properties through [handlebars](https://handlebarsjs.com/).

Following an example of interpolation.  

Given the following schema:
```json
"object": {
  "type": "custom",
  "label": "MyWebComponent",
  "visualizationOptions": {
    "tag": "bk-button",
    "properties": {
      "content": "{{currentUser.name}}",
      "stopPropagationOnClick": false,
      "clickConfig": {
        "type": "http",
        "actionConfig": {
          "method": "POST",
          "url": "/path?{{args.[1].id}}={{args.[1]}}",
          "body": "{{headers}}",
          "config": {
            "headers": "{{rawObject headers}}"
          }
        }
      }
    }
  }
}
```

And these (simplified) parameters: 

* **args**: 
```json
[
  "Column Name",
  {"id": "row-id"},
  4
]
```  

* **currentUser**: 
```json
{
  "name": "Bob"
}
```

* **headers**: 
```json
{
  "content-type": "application/json"
}
```

The `properties` object is interpolated with render parameters and the output configuration will be:

```json
"object": {
  "type": "custom",
  "label": "MyWebComponent",
  "visualizationOptions": {
    "tag": "bk-button",
    "properties": {
      "content": "Bob",
      "stopPropagationOnClick": false,
      "clickConfig": {
        "type": "http",
        "actionConfig": {
          "method": "POST",
          "url": "/path?row-id=4",
          "body": "[object Object]",
          "config": {
            "headers": {
              "content-type": "application/json"
            }
          }
        }
      }
    }
  }
}
```

By default, the handlebars interpolation cast everything to string. The [`rawObject`](../40_core_concepts.md#rawobject) key references to a custom handlebars supporter that parse the value to interpolate as an object instead of a string. In the above example the body of HTTP call is interpolated as the string "[object Object]" but the headers are interpolated with the real object.

If is also possible to provide a `template`-`configMap` pair instead of a value for a property. In such cases, the value of the property is taken from the configMap using template as key (or `$default`, if the template does not match any configMap key).

For instance, assuming the same example parameters as the previous example, the following configuration:
```json
"object": {
  "type": "custom",
  "label": "MyWebComponent",
  "visualizationOptions": {
    "tag": "bk-button",
    "properties": {
      "content": "Abort order",
      "disabled": {
        "template": "{{currentUser.name}}",
        "configMap": {
          "Bob": true,
          "Pierre": true,
          "$default": false
        }
      },
      ...
    }
  }
}
```

will be resolved to:
```json
"object": {
  "type": "custom",
  "label": "MyWebComponent",
  "visualizationOptions": {
    "tag": "bk-button",
    "properties": {
      "content": "Abort order",
      "disabled": true,
      ...
    }
  }
}
```

##### Example - disable button if a cell is empty

The following example showcases how a [`bk-button`](./20_buttons.md#bk-button) can be mounted inside a table cell, and disabled based on whether or not the cell value is specified. The configuration leverages the [`rawObjectOrEmptyStr`](../40_core_concepts.md#rawobjectoremptystr) custom helper, as well as the [`template`-`configMap`](../40_core_concepts.md#template---configmap) interface.

```json
{
  "tag": "bk-table",
  "properties": {
    ...
    "customActions": [
      {
        "tag": "bk-button",
        "properties": {
          ...
          "disabled": {
            "template": "{{rawObjectOrEmptyStr args.[0]}}",
            "configMap": {
              "": true,
              "$default": false
            }
          }
        }
      }
    ]
  }
}
```

### displayedDataPath

Property `displayedDataPath` enables to display a nested array of an element of the received data. It consists of the path to the desired object where the first key is `data`.

:::info
`dataschema` has to be the nested schema
:::

#### Example

In this example, `bk-table` will display the array of `commonCombos` of the first element received.

```json
{
  ...
  "properties": {
    "displayedDataPath": "data.[0].commonCombos",
    "dataSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "price": {
          "type": "number"
        }
      }
    }
  }
  ...
}
```

### Fix columns

It is possible to fix columns from left and/or from right using the property `fixedColumns`: it takes either a number that represents the number of columns to fix from left or an object with `left` and/or `right` key and a number as value. The value represents the number of columns to fix from left/right.

#### Example 1 and 2

With both configurations, the first column from left is fixed.

```json
  ...
  "properties": {
    "fixedColumns": {
      "left": 1
    }
  }
```

```json
  ...
  "properties": {
    "fixedColumns": 1
  }
```

#### Example 3

With this configuration, the first two columns from left and the first column from right (so the last one excluded the `actions` column) are fixed.

```json
  ...
  "properties": {
    "fixedColumns": {
      "left": 2,
      "right": 1
    }
  }
```

### Highlighted rows

It is possible to use property `highlightedRows` to map a color (expressed as a CSS-valid color string) to a
[mongo-like query](../40_core_concepts.md#inline-queries).
The background of rows that match any of these queries is set to the corresponding color.

`highlightedRows` should be expressed as an array of 2-element tuples, with first value being the color and the second one representing the query.

```typescript
type QueryStyleRule = {
  color: ColorInput
  query: Query
}
```
Where:
  - `ColorInput` can be expressed as the CSS valid string representation of a color (for instance, `#f2e8e2` or `rgb(230, 155, 114)`), or an object such as `{r: 230, g: 155, b: 114}`.
  Broadly speaking, `color` key supports all types supported as input by [TinyColor](https://github.com/bgrins/TinyColor) library
  - `Query` is the object representation of a mongo-like query

Rows are highlighted with the color of the first matching query, thus rows that match multiple queries will be highlighted with the first color.

Queries support [dynamic values](../40_core_concepts.md#dynamic-configuration) through [handlebars notation](https://handlebarsjs.com/guide/expressions.html).
`bk-table` provides inline queries with context:
  - `args`: an array with row arguments:
    - first element: an object containing the row content
    - second element: an object containing the row content
  - third element: a number with the cell index into the table
  - `currentUser`: an object with the logged user's data
  - `headers`: an object containing the headers

:::info
Context key `args` stores the same data in its first two arguments. This is to maintain consistency with the context that `bk-table` provides to [components mounted inside cells](#dynamic-properties-interpolation) and to [customActions](#configuring-actions-via-customactions).
:::

:::info
Input colors are converted to their RGB representation. If an alpha channel is present, a white background is assumed.
For instance, color `rgba(255, 0, 0, 0.5)` is converted to `rgb(255, 128, 128)`.
:::

#### Example

```json
{
  "highlightedRows": [
    {
      "color": "#ff0000",
      "query": {"severity": "High"}
    },
    {
      "color": "blue",
      "query": {"pets.0": {"$exists": true}}
    }
  ]
}
```

Table rows with field `severity` equal to "High" will have a red background color,
while rows with array field `pets` having at least one element will have their background color set to blue.

#### Example - dynamic queries

```json
{
  "highlightedRows": {
    {
      "color": "yellow",
      "query": {"email": "{{currentUser.email}}"}
    },
    {
      "color": "green",
      "query": {"payed": {"$gte": "{{rawObject args.[1].owed}}"}}
    }
  }
}
```

Table rows with field `email` equal to the homonymous field in `currentUser` will be highlighted with a yellow color,
while rows with field `payed` larger than field `owed`, will be set to green color.

### Actions

It is possible to include an actions columns in the table, through the properties `rowActions`, `customActions`, `navigationRowActions`. Configurable buttons or generic components will be rendered inside the actions columns.

#### Configuring actions via `rowActions`

Accepts an object such as

```json
{
  "kind": "icons",
  "actions": [
    {
      "kind": "event",
      "danger": "true",
      "content": "duplicate-data",
      "label": "Duplicate Data",
      "icon": "far fa copy",
      "meta": {},
      "requireConfirm": {}
    }
  ]
}
```

Each `rowAction` is rendered as a button inside the action cell of each row of the table. Clicking such button can either emit an event or perform an POST call, in which the payload/body is set to an object representation of the corresponding row.


| property | type | values | description |
|----------|------|---------|------------|
| `kind` | string | `icons`, `cta` | how to display the action triggers |
| `actions` | array | - | list of available actions |


##### DataActions

| property | type | values | description |
|-----------------------|------|---------|-------------|
| `kind` | string | `httpPost`, `event` | when `event` fires an event in the `eventBus`, otherwise performs a `POST` request with the content of the row as body |
| `danger` | boolean | `true`, `false`, `undefined` | set danger mode on action |
| `content` | string | any | when `event` it must be the label of a [registered event](../70_events.md), otherwise the `POST` request destination href |
| `label` | string| any | a label to render with the row action button |
| `icon` | string | any | [Fontawesome fas or far icon](https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular,solid&m=free) |
| `meta` | object | any | the event `meta` when `kind` is `event` |
| `requireConfirm` | object or boolean | any | The customizable properties of the modal that will be prompted or `true` for default Modal |

##### RequireConfirm object

| property | type | values | description |
|----------|------|--------|-------------|
| `cancelText` | [localizedText](../40_core_concepts.md#localization-and-i18n) | any | Cancel button label |
| `content` | [localizedText](../40_core_concepts.md#localization-and-i18n) | any | Text content of the modal. It supports interpolation via Handlebars using the current row values with resolved lookups (e.g., 'Hello {{name}}') |
| `okText` | [localizedText](../40_core_concepts.md#localization-and-i18n) | any | Confirm button label |
| `title` | [localizedText](../40_core_concepts.md#localization-and-i18n) | any | Title of the modal. It supports interpolation via Handlebars using the current row values with resolved lookups (e.g., 'Hello {{name}}') |

#### Configuring actions via `customActions`
`customActions` allows to mount generic components inside the table actions column.
Accepts an array such as

```json
{
  "customActions": [{
    "tag": "bk-button",
    "properties": {
      "content": "Cancel order",
      "disabled": {
        "template": "{{args.[1].orderStatus}}",
        "configMap": {
          "Delivered": true,
          "Cancelled": true,
          "$default": false
        }
      },
      "action": {
        "type": "http",
        "config": {
          "url": "the/url",
          "method": "POST",
          "body": "{{rawObject args.[1]}}"
        }
      }
    }
  }]
}
```

`customActions` shape is either and `array` of `tag`-`properties` pairs or an `array` of custom actions with schema:

```json
{
  "type": "array",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "tag": "string",
        "properties": {
          "type": "object"
        }
      }
    },
    {
      "type": "object",
      "properties": {
        "keys": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "customActions": {
          "type": "object",
          "properties": {
            "tag": "string",
            "properties": {
              "type": "object"
            }
          }
        }
      }
    }
  ]
}
```

In the first case, each element of the array is a `tag`-`properties` pair, respectively representing the html tag of the component to mount and its properties.
| property | type | values | description |
|-----------------------|------|---------|-------------|
| `tag` | string | any | custom component to mount |
| `properties` | {[key: string]: any} | any | properties injected into the component |

It is often useful mounting [bk-button](./20_buttons.md#bk-button)s inside the actions columns of the table because of its flexibility.

`properties` field allows [dynamic interpolation](../40_core_concepts.md#dynamic-configuration), analogously to the case of mounting custom components using `visualizationOptions`, [explained above](#dynamic-properties-interpolation).

Nested navigation do not preserve `customActions`. To configure `customActions` in nested navigation mode the second type of `customActions` allowed by the JSON schema above is helpful.

Consider the following setup:

```json
{
  "customActions": [
    {
      "keys": [],
      "customActions": [
        {
          "tag": "bk-button",
          "properties": {
            "content": "Cancel order",
          }
        }
      ]
    },
    {
      "keys": ["level-1", "level-2"],
      "customActions": [
        {
          "tag": "bk-button",
          "properties": {
            "content": "Refresh",
          }
        }
      ]
    }
  ]
}
```

The action with button `Cancel order` will appear on the home of the nested setup. All other nesting level will have no `customAction` but the `level-2` reached from `level-1` which will instead display a button with label `Refresh`.

#### Configuring actions via `navigationRowActions`

`rowActions` are removed from the actions columns when the table is rendering [nested data](../30_page_layout.md#nested-dataschemas). `navigationRowActions` allows to specify actions available when the table is displaying nested data.

As of now, these only allow to display the data inside a form or to delete the data inside a table row. `customActions` should be utilized in order to configure extra actions in nested views.
`navigationRowActions` is an object of `NavigationDataActions`, which is an object such as

```json
  {
    "kind": "icons",
    "actions": [{
      "danger": true,
      "requireConfirm": true,
      "type": "delete",
      "disableInReadonly": true,
      "icon": "far fa-trash-can"
    }]
  }
```

| property | type | values | description |
|-----------------------|------|---------|-------------|
| `kind` | string | `cta`, `icons` | whether to display the action in form of text or icon. |
| `actions` | array of actions | any | describes the behavior of each. |

##### Action object

| property | type | values | description |
|----------|------|--------|-------------|
| `requireConfirm` | booelan | true \| false | Whether or not to require confirm. |
| `danger` | boolean | true \| false | set danger mode on action |
| `type` | string | "delete" \| "detail" | if `delete`, the row is deleted from the nested object (and `update-data` event is emitted). If `detail`, a `selected-data` event is emitted with the data from the row.|
| `disableInReadonly` | boolean | any | Whether or not to disable the action for read-only nested objects. |
| `icon` | string \| undefined | font awesome icon string | The icon for the button. It is **optional**.


`navigationRowAction` defaults to:
```json
  {
    "kind": "icons",
    "actions": [{
      "requireConfirm": true,
      "type": "delete",
      "disableInReadonly": true
    }]
  }
```

which will alllow rows to be deleted when the displayed data is not read-only.


### Browse on row click

The property `browseOnRowSelect` allows to navigate to a specified link when a table row is clicked.
`browseOnRowSelect` accepts an object such as

```json
  {
    "href": "destination/url",
    "target": "_self",
    "query": {
      "id": "{{data._id}}"
    },
    "navigationType": "push"
  }
```

| property | type | values | description |
|-----------------------|------|---------|-------------|
| `href` | string | any | link reference. Only relative links are accepted. |
| `target` | string | any | where to open the href. Defaults to "_self" |
| `query` | {[key: string]: any} | any | query parameters |
| `navigationType` | string | `push`, `replace`, `href` | method used for navigation if target is "_self" |

##### Navigation types

`navigationType` values are mapped to navigation methods as follows:
| value | method |
| ---------- | ----------------- |
| `push` | `window.history.push` |
| `replace` | `window.history.replace` |
| `href` | `window.location.replace` |

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`allowNavigation`|`allow-navigation`|boolean|true|when `true`, it is possible to navigate to nested objects and arrays if a dataSchema is specified|
|`browseOnRowSelect`| - |[ClickPayload](#browse-on-row-click)| - |if set, a click on a row will navigate you to another location |
|`customActions`| - |[CustomAction](#configuring-actions-via-customactions)[]| - |list of custom components, rendered in the action column |
|`customMessageOnAbsentLookup`| - |[LocalizedText](../40_core_concepts.md#localization-and-i18n)| - |override lookup value in case lookup is not resolved due to lack of data |
|`dataSchema`| - |[ExtendedJSONSchema7Definition](../30_page_layout.md#data-schema)| - |[data schema](../30_page_layout.md#data-schema) describing the fields of the collection to display |
|`disableRowClick`|`disable-row-click`|boolean|false|when `true`, a click on a row does not trigger an event|
|`disableRowSelection`|`disable-row-selection`|boolean|false|when `true`, checkbox in the first column will not be displayed|
|`disableRowSelectionChange`|`disable-row-selection-change`|boolean|false|when `true`, selecting a row through the checkbox in the first column does not trigger an event|
|`initialSortDirection`| - |"descend" \| "ascend"| - |initial sorting direction to use when component bootstraps |
|`initialSortProperty`|`initial-sort-property`|string| - |Initial property to sort on when component bootstraps |
|`loadingOnStart`|`loading-on-start`|boolean|true|whether the table should be in loading state on connection|
|`maxLines`|`max-lines`|number| - |force lines that will be displayed together |
|`navigationRowActions`| - |[NavigationDataActions](#configuring-actions-via-navigationrowactions)| {"kind": "icons", "actions": [{ "requireConfirm": true, "type": "delete", "disableInReadonly": true}]} |actions in nested objects.|
|`openFileInViewerRegex`| - |string \| string[] \| {[regex: string]: "view" \| "download"}| - |regex expressions, matched against file values. If one matches, the corresponding cell is clickable and the file opens inside a viewer (default) or is downloaded. |
|`resizableColumns`|`resizable-columns`|boolean|false|whether the table columns can be resized. When `true`, columns can be resized from the table header|
|`rowActions`| - |[DataActions](#configuring-actions-via-rowactions)| - |list of actions to render per row |
|`showArrayPopover`|`show-array-popover`|boolean|false|whether to display a popup on mouse-over on array cells, showing their value. Not available for arrays of objects or arrays of arrays.|
|`fixedColumns`| - | number \| {'left': number; 'right': number} | - |either the number of columns to fix from left or an object containing how many columns to fix from left and/or right|
|`displayedDataPath`| - | string | - | specify an object path as datasource for displayed data |
|`highlightedRows`| - | [QueryStyleRule](#highlighted-rows) \| [QueryStyleRule](#highlighted-rows)[] | - | highlights rows matched by a mongo-like queries |

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

### Bootstrap

None
