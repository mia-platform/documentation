---
id: layout
title: The layout of a standard Back-Kit page
sidebar_label: Page layout
---

Although Back-Kit aims to be as agnostic as possible when it comes to custom configurations, a recommended layout might save lots of configuration-related headaches and comes in handy as both an example benchmark and best practice reference. The **recommended** (see a [minimal configuration example](#single-page-configuration)) Back-Kit page layout shall thus have at least:

1. a [bootstrap](#bootstrap-aka-initial-state-injection) manager, whenever some sort of initial state needs to be injected
2. a [data schema](#data-schema), whenever the page has a data source like a database collection/table
3. a collection of [web components](#components), including the bootstrap manager

Back-Kit uses the [crud-client](components/clients.md#crud-client) component as **bootstrap manager of choice**. This is
fairly standard on a web application that needs a data source and consequent data retrieval pretty much at the beginning
of its state lifecycle.

:::info
Bootstrap shall be used by any web component taking initial state from the page URL.
:::

Data schema is a JSON-schema, directly plugged into the configuration, describing how to **fetch data**, which **projection** use, whether **sorting** is needed, how to **render data** on CRUD operations (within forms, drawers, delete buttons and so on). Data Schema can be used by web components that support it as a tag property.

## Bootstrap (a.k.a. initial state injection)

When a configuration is rendered, some initial state may be encoded into the page URL. Bootstrap refers thus to the process of reading the URL and distributing state to components that need it and then start the web application. This behavior allows landing on a page with a given customized setup on top of the configuration. Roughly, configuration overrides web components defaults while bootstrapping customizes a page instance.

Most common initial states provide initial pagination, components to be focused, text to be inserted on inputs. Some components might require bootstrap, but it is not a mandatory feature for components to have.

Bootstrapping a page entails three main phases:

1. components read the URL parsing properties related to their initial state. Components then evolves without changing properties becoming React-alike [controlled components](https://reactjs.org/docs/forms.html#controlled-components)
2. components modify their internal state and, if needed, emit an event
3. a single component, the bootstrap manager, typically the [crud-client](components/clients.md#crud-client), is then tasked with awaiting events triggered by applying the initial state. Such component must have a debounce time after which it ends bootstrapping whether it received bootstrap events.

Bootstrapping from a client makes sense since most of the time the side effect first task of a frontend page is loading data
from a source. Initial state may  or may not refine such data retrieval applying filters or pagination. After initial state
is shared data can be collected.

## Data Schema

A web application that employs Back-Kit web components is very likely to model a data collection and/or enrich it with lookups
from other collections. A fairly standard use case would be a page rendering a table whose content is given by a MongoDB collection.

Components **must be aware of an existing data schema** which instructs on what to show in the webpage and how to show it.

:::caution
Back-Kit components pass the data schema to components via the tag property `dataSchema`.
:::

A data schema is thus encoded as a [JSON-schema](https://json-schema.org/specification.html) with several extensions to keep track of what rendering components might need.

The outer structure requires a data schema to be an `object`, containing an `object` of `properties` that could in return be
marked as `required`

```json
{
  "type": "object",
  "properties": {
    "_id": {
      ...
    },
    "__STATE__": {
      ...
    },
    ...
    "ingredients": {

    }
  },
  "required": ["_id", "__STATE__"]
}
```

This layout more or less matches a collection/table schema.
The `required` property list only those entries/properties that **must** be defined whenever there is an attempt to create
a new item on the collection represented by the schema.

:::caution
Remind that `CRUD services` might implement automatic creation strategies on items properties, like unique ID automatic generation and non-null default values. It might be dangerous to let those values be set by a user. They instead can be marked [hidden](#visualization-options).
:::

:::caution
Since `crud-service` implements its own patch strategy for the `__STATE__` param (i.e. posts on the collection row), data schema config must exclude unintended patches on that field.
To do so a generic configuration might include in data schema `__STATE__` property the option

```json
{
  "__STATE__": {
    ...,
    "formOptions": {
      "hiddenOnSelect": true
    }
  }
}
```

:::

A property needs specifications about formatting and viewing

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "uri",
      "order": 2,
      ...
    },
    "__STATE__": {
      "type": "string",
      "enum": ["PUBLIC", "DRAFT", "TRASH"],
      "order": 0,
      "label": {
        "en": "Item State",
        "it": "Stato dell'articolo",
        "zh": "????????????",
        ...
      },
      "formOptions": {
        ...
      },
      "visualizationOptions": {
        ...
      },
      "lookupOptions": {
        ...
      }
    },
    ...
  },
  ...
}
```

A `label` is either a `string` or a [LocalizedString](concepts.md#localization-and-i18n) and provides a label for a given property.

An `order` is number that allow to customize the order in which items are rendered by data visualization components.

A `type` is a [JSON-schema version 7 type](https://json-schema.org/understanding-json-schema/reference/type.html).

On top of types, extra information can be passed to better understand how a property needs to be shown, i.e. a `string` could be a `password` or a `date`, an `object` could be a plain JavaScript `object` or maybe a `file`. To achieve that, components refer to the `format` key which is not mandatory and when absent triggers defaulting behavior on the type specified by `type`.

| type | formats |
|------|---------|
| `string` | `date`, `date-time`, `time`, `email`, `uri`, `regex`, `password`, `text-area`, `lookup`, `editor` |
| `number` | -      |
| `integer` | - |
| `object` | `file` | `localized-text`
| `array`  | `multilookup` |
| `boolean` | - |
| `form-addon` | `link`, `title`, `subtitle` |
| `null` | - |

The `format` may be picked by components to provide better UI rendering choices on a given `type`. [bk-table](components/data-visualization.md#table) and [bk-form-drawer](components/data-manipulation.md#form-drawer) use extensively formats.

When `type` is set to `string`, the extra key `enum` is available to specify available text entries.

When `type` is set to `string`, the extra key `dateOptions` is available and holds a `displayFormat` property which allows
customization of date visualization format. Back-Kit components handles dates and timestamps using [dayjs](https://day.js.org/)
library and its [parsing/formatting syntax](https://day.js.org/docs/en/parse/string-format).

When `type` is set to `object` and format is `localized-text`, table expects a localized object and will render the closest language key, i.e. on language `en-US` it will render either `en-US` if available or `en` as a fallback.

In order to avoid replication of settings within the same configuration, data schema also carries some component-specific visualization options and/or might require extra data to be fetched.

### Visualization Options

Visualization options concern any web component that is going to render a given dataset represented by the current data schema.

```json
"__STATE__": {
  "type": "string",
  "enum": ["PUBLIC", "DRAFT"],
  ...
  "visualizationOptions": {
    "hidden": false,
    "iconMap": {
      "PUBLIC": {
        "shape": "roundedSquare",
        "color": "#52C41A"
      },
      "DRAFT": {
        "shape": "roundedSquare",
        "color": "#CDCDCE"
      }
    }
  }
  ...
}
```

| `visualizationOptions` option | type | description |
|--------|---------|-------------|
|`hidden`|  `boolean` | whether the property is shown within the form component |
|`iconMap`| `object` | defines a map of basic shaped icons to be shown with the item and where the key is the item value |

| `iconMap` option | values | description |
|--------|---------|-------------|
| `shape` | `square`, `roundedSquare` | shape of the icon |
| `color` | hex color | icon color |

### Form Options

Data visualization and `CRUD` operations might also need a UI component to simplify user interactions with the fetched dataset.
This component is often in charge of editing, creating, duplicating, deleting collection items or perform any subset of these
actions. Extra options to be specified for user interaction with the dataset should be configured in `formOptions`

```json
{
  ...
  "__STATE__": {
    ...
    "formOptions": {
      "disabled": false,
      "hidden": false,
      "placeholder": "Editable state",
      "readOnly": false
    }
}
```

|options | default | description |
|--------|---------|-------------|
|`disabled`| `undefined`| |
|`hidden`| `undefined` | whether the property is shown within the form component |
|`placeholder`|`undefined`| |
|`readOnly`|`undefined`| whether the property can be edited |

### Lookups

Often a dataset has external references. A list of dishes might refer to ingredients picked from its own collection or to a single recipe from a list of recipes. When looking up to other collection a `lookup` refer to a single value that is used instead of the placeholder in the main collection. Whenever a property looks up for an array of values, like dishes with ingredients, it is referred to as `multilookup`.

To be able to fetch data to fill up lookup entries a specific set of options must be included into the data schema.

According to the principle that **a web component does one thing**, a web application willing to resolve lookups must include a client that takes care of that. Back-Kit provides a [crud-lookup-client](components/clients.md#lookup-client) which will set up fetching routes according to data schema `lookupOptions`.

```json
{
  ...
  "recipe": {
    "type": "string",
    "format": "lookup",
    ...
    "lookupOptions": {
      "lookupDataSource": "recipes",
      "lookupFields": ["name"],
      "lookupDelimiter": " - ",
      "lookupValue": "_id"
    }
  },
  "ingredients": {
    "type": "array",
    "format": "multilookup",
    ...
    "lookupOptions": {
      "lookupDataSource": "ingredients",
      "lookupFields": ["_id", "name"],
      "lookupValue": "_id",
      "lookupQueries": [...]
    }
  }
  ...
```

The main collection has a `recipe` item but holds only its `_id`. Thus resolving the lookup means to look into a collection
name as stated in `lookupDataSource`, use the item value the main collection holds as `lookupValue`.

:::caution

`lookupValue` MUST refer to a property indexed as key of your `DataSchama` configuration. Also its type must be expressed. If you don't want to render it in tables or forms you might use the following configuration

```json
{
  ...
  "useMeInLookupButDoNotShow": {
    "type": "array",
    "visualizationOptions": {
      "hidden": true
    },
    "formOptions": {
      "hidden": true
    },
    "filtersOptions": {
      "hidden": true
    }
  }
}
```

:::

From recipes, items
needed are listed in `lookupFields` and rendered as a string delimited by `lookupDelimiter`.

| `lookupOptions` properties | description |
|----------------------------|-------------|
| `lookupDataSource` | lookup destination collection |
| `lookupValue` | the item used to resolve the lookup onto the destination collection and held on the main collection |
| `lookupFields` | fields to be retrieved on the destination collection |
| `lookupDelimiter` | a string with a delimiter to join values when multiple `lookupFields` are specified |
| `lookupQueries` | an array of [filters](concepts.md#filters) on lookup data |
| `lookupAddTrailingSlash` | a boolean which determines whether or not to add a trailing `/` to `lookupDataSource` to generate the url for querying data (`true` if not specified) |
| `lookupDeps` | an array of [dependencies](#dependent-lookups), used to specify dependencies from other fields of the form |

:::caution

`multilookup` must be of type `array` whereas `lookup` of type `string`

:::

#### Dependent lookups

It is furthermore possible to have the available options of a lookup/multilookup field dependending on other fields in the form.

```json
{
  ...
  "minPopulation": {
    "type": "number",
    ...
  },
  "provId": {
    "type": "string",
    "format": "lookup",
    ...
    "lookupOptions": {
      "lookupDataSource": "provinces",
      "lookupFields": ["name"],
      "lookupValue": "_id",
      "lookupDeps": [
        {
          "dependency": "minPopulation",
          "template": "{\"population\": {\"$gt\": {{current.minPopulation}}}}"
        }
      ]
    }
  },
  "cityIds": {
    "type": "array",
    "format": "multilookup",
    ...
    "lookupOptions": {
      "lookupDataSource": "cities",
      "lookupFields": ["name"],
      "lookupValue": "_id",
      "lookupDeps": [
        {
          "dependency": "provId",
          "currentCollectionProperty": "provinceId"
        }
      ]
    }
  }
  ...
```

The options of dependent lookup/multilookup fields are fetched with a query parametric to other fields in the form. To set out such query, `lookupDeps` should include at least one object with a `dependency` key, specifying which field, upon update, triggers the query, as well as either a template of the query itself - in `template`, or a field of the lookup collection in `currentCollectionProperty`. If the latter, a default template will be automatically created, corresponding to a query filtering entries so that `currentCollectionProperty` is equal or included in the value of the `dependency` field.

For instance,

```json
{
  "dependency": "provId",
  "currentCollectionProperty": "provinceId"
}
```

is equivalent to:

```json
{
  "dependency": "provId",
  "template": "{\"{{currentCollectionProperty}}\": {\"$in\": {{current.provId}}}}"
}
```

in case `provId` is an `array` field, or

```json
{
  "dependency": "provId",
  "template": "{\"{{currentCollectionProperty}}\": {\"$in\": [{{current.provId}}]}}"
}
```

otherwise.

:::caution
In `template`, it is necessary to use the key-word `current` before the name of the referenced field, as in: `current.fieldName`.
:::

:::caution
It is not possible to have a field be dependent on a Form Addon.
:::

:::info
In case both `currentCollectionProperty` and `template` are specified, `currentCollectionProperty` is ignored.
:::

:::info
If multiple dependencies are specified for the same lookup field, these are considered to be in a OR-clause when filtering the selectable values.
:::

In the example above, both lookups `provId` and and `cityIds` are dependent from other fields in the form. Namely:

- `provId` has a dependency towards the property `minPopulation`. The options for `provId` are all filtered by the query specified in the `template` property: all listed provinces will have a greater population than the one specified in `minPopulation`.

- `cityIds` depends on the field `provId`. In particular, only cities with the field `provinceId` equal to the value of the field `provId` from the form will be available.

Updating a field specified in the `dependency` option of a lookup/multilookup triggers:

1) queries are performed as specified in `lookupDeps` to fetch new options
2) current values of dependent fields that are not compatible with the new state of the form according to their `lookupDeps` are removed
3) options of dependent fields are updated
4) if step 2 caused the value to change, these operations are propagated to all fields that depend on the updated lookup/multilookup. In the example above, if updating `minPopulation` causes `provId`'s value to change, these 4 steps will also be performed for `cityId`.

:::info
The prop `allowAutoDisableDeps` in [bk-from-drawer](components/data-manipulation.md#form-drawer) and [bk-from-modal](components/data-manipulation.md#form-modal) allows to control whether or not a dependent lookup/multilookup with no options should be automatically disabled. The field is automatically re-enabled as soon as updating a controlling field causes options to be availbale.
:::

:::info
The prop `allowLiveSearchCache` in [bk-crud-lookup-client](components/clients.md#lookup-client) allows to cache queries performed for fetching new options.
:::

:::info
If a controlling field is on focus, new options for dependent fields are not fetched until the corresponding on-blur event happens. This is particularly useful in case of cyclic dependencies with multilookup fields, as it prevents available options to be removed while the user is still operating on the field.
:::

| `LookupDeps` properties | description |
|----------------------------|-------------|
| `dependency` | property name of the controlling field from the form |
| `currentCollectionProperty` | item from the lookup destination collection to utilize when retrieving the selectable options |
| `template` | query to utilize when retrieving the selectable options |

#### Multilookup styling

Due to the length of its content, a multilookup cell is often shown as a placeholder. However, if internal content is meant to be shown in-place, it is possible to `join` its values array and print it as a string.

Single values are `.toString()`-ed while a join delimiter must be specified. In your `dataSchema`, add to the multilookup column the props:

```json
{
  "visualizationOptions": {
    ...
    "joinDelimiter": "<delimiter>"
  }
}
```

where `<delimiter>` is the string to use for join. An empty string is allowed.

### Form Links

Altogether with `type` and `properties`, at the highest level of the data schema, there is an extra key that allow listing
external references or href.

```json
{
  "type": "object",
  "properties": { ... },
  "required": [ ... ],
  "formLinks": [
    {
      "href": "/hrefPage",
      "formOptions": {
        "hiddenOnUpdate": true
      }
    },
    {
      "href": "https://www.google.com",
      "target": "_blank",
      "label": {
        "it": "Cerca su Google",
        "en": "Search on Google"
      },
      "icon": "fas fa-link",
      "query": {
        "user": "{{name}}-{{surname}}"
      },
      "formOptions": {
        "hiddenOnInsert": true
      }
    }
  ]
}
```

The `formLinks` key takes an array of objects that represents a [Link](concepts.md#links). The handlebar parser would interpret properties as data schema properties. Referring to the example above, either `name` or `surname` are `properties` of the schema or the parser interprets them as empty strings.

Instructions can be specified as `formOptions` on to whether showing such links into forms components via the `hidden` key. The [bk-from-drawer](components/data-manipulation.md#form-drawer) has also different opening-states, namely *insert* and *update*, hence specific hidden properties `hiddenOnInsert` and `hiddenOnUpdate` can be specified to properly tune link visualization when Back-Kit default form is used.

### Excluding properties from free search

Properties in data schema can be excluded from regex queries generated by free-text search setting the first-level
property `excludeFromSearch` to `true`.

Note that some properties are automatically excluded, namely:

- `_id`, `updatedAt`, `createdAt`, and `__STATE__` CRUD properties
- properties of type `form-addon`
- properties of format `date`, `time`, `date-time`, `lookup`, `multilookup`, `file`

### Nested dataschemas

For fields of type `array` or `object` that do not have a specific format, it is possible to include a nested data schema as a property. There is no limit to how many levels of nesting can be achieved this way.

```json
{
  "parent": {
    "type": "object",
    "dataSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "formOptions": {
            "hiddenOnUpdate": true
          },
        },
        ...
      }
    }
  },
  "children": {
    "type": "array",
    "formOptions": {
      "readOnly": true
    },
    "dataSchema": {
      "type": "object",
      "properties": {
        ...
        "toys": {
          "type": "array",
          "dataSchema": {
            "type": "object",
            "properties": {
              ...
            }
          }
        }
      }
    }
  }
}
```

By default, in a [bk-table](components/data-visualization.md#table) component with a nested data schema, it is possible to navigate the rendered table by clicking on any of the cells corresponding to nested objects/arrays. Doing so, the table uses the nested data schema to know how to interpret the data inside the clicked cell, and re-renders the table to display it.
In the same way, by default, the label of object/array fields inside the form of a [bk-form-drawer](components/data-manipulation.md#form-drawer) or [bk-form-modal](components/data-manipulation.md#form-modal) is clickable, if a data schema is specified for them. Doing so has the same effect as clicking on the corresponding cell in the table.

:::info
For all three of `bk-table`, `bk-form-drawer`, `bk-form-modal`, it is possible to set `allowNavigation` property to false and disables this behavior.
:::

`bk-table`, `bk-form-drawer` and `bk-form-modal` keep track at all times of all the nested objects/arrays that were entered. This allows editing the currently displayed object/array in three ways (unless declared read-only in configuration):

- via [bk-add-new-button](components/buttons.md#add-new) if inside a nested array
- via `bk-form-drawer` or `bk-form-modal`, selecting a table row
- via `bk-table`'s delete row action, which is displayed by default during navigation

Nested data schemas support the same options that can be specified for a top level data schema. For instance, in the example above, the field `name` is hidden in `bk-form-drawer` for the `parent` object because of the option `hiddenOnUpdate`.

When entering a read only object/array:

- `bk-add-new-button` is disabled
- `bk-form-drawer`, `bk-form-modal` are opened in read only mode
- `bk-table`'s delete row action is not displayed
This is also true for all object and arrays that are nested inside a read only field, even though it might not be explicitly specified in the data schema.
For instance, in the example above, the array `children` is specified to be read only, therefore the array `toys` will also be treated as read only.

:::caution
A [bk-breadcrumbs](components/data-visualization.md#breadcrumbs) component should always be included in the single page application when navigation is enabled.
:::

:::info
`bk-add-new-button` is disabled when `bk-table` renders objects, unless this is undefined. Then, it will be possible to add one element.
:::

In case of [display-data](events/events.md#display-data) events or [change-query](events/events.md#change-query) events with empty payload, the `bk-breadcrumbs` component tries to restore the navigation path with the new data. In case of failure, the page navigates back to the top level of the data schema.

:::info
All `change-query` events with non-empty payload cause to navigate back to the top level of the data schema. However, behaviors of [bk-pagination](components/data-querying.md#pagination) and `bk-table`'s column sorting are overridden in nested objects, so these features are still available.
:::

:::caution
At the moment, lookup resolution is not supported in nested objects/arrays.
:::

:::caution
During navigation [bk-add-filter-button](components/buttons.md#filter-new) and [search-bar](components/data-querying.md#search-bar) are disabled, and [bk-tabs](components/data-querying.md#tabs) are hidden.
:::

## Components

Back-Kit provides the following classes of components:

- [Adapters](components/adapters.md):
  - [State Adapter](components/adapters.md#state-adapter)
- [Buttons](components/buttons.md):
  - [Add Filter](components/buttons.md#add-filter)
  - [Add New](components/buttons.md#add-new)
  - [Refresh Button](components/buttons.md#refresh-button)
  - [Navigation Back Arrow](components/buttons.md#navigation-back-arrow)
- [Data Visualization](components/data-visualization.md):
  - [Calendar](components/data-visualization.md#calendar)
  - [Table](components/data-visualization.md#table)
  - [Breadcrumbs](components/data-visualization.md#breadcrumbs)
- [Clients](components/clients.md):
  - [CRUD Client](components/clients.md#crud-client)
  - [Lookup Client](components/clients.md#lookup-client)
  - [File Client](components/clients.md#file-client)
  - [File Manager](components/clients.md#file-manager)
  - [Export](components/clients.md#export)
- [Data Manipulation](components/data-manipulation.md):
  - [File Picker Drawer](components/data-manipulation.md#file-picker-drawer)
  - [Footer](components/data-manipulation.md#footer)
  - [Form Drawer](components/data-manipulation.md#form-drawer)
  - [Form Modal](components/data-manipulation.md#form-modal)
- [Data Querying](components/data-querying.md):
  - [Filter Drawer](components/data-querying.md#filter-drawer)
  - [Filters Manager](components/data-querying.md#filters-manager)
  - [Pagination](components/data-querying.md#pagination)
  - [Search Bar](components/data-querying.md#search-bar)
  - [Tabs](components/data-querying.md#tabs)
- [Misc](components/misc.md):
  - [Confirmation Modal](components/misc.md#confirmation-modal)
  - [Microlc Theme Manager](components/misc.md#microlc-theme-manager)
  - [Notifications](components/misc.md#notifications)
  - [Template](components/misc.md#template)
- [Typography](components/typography.md):
  - [Title](components/typography.md#title)

## Single Page Configuration

Once the data schema is set and the components to use are chosen, a full single page configuration can be writer. Such configuration contains two parts

1. `$ref`: referenced objects. To avoid repeating the same prop, like `dataSchema`, on multiple elements.
2. `content`: the intended web page content in terms of HTML tags, either standard HTML5 or custom web components

A minimal configuration that undergoes bootstrap procedure can be achieved, being `/v2/customers` the endpoint of a valid [Mia-Platform CRUD Service](https://docs.mia-platform.eu/docs/runtime_suite/crud-service/overview_and_usage), with the following configuration:

```json
{
  "$ref": {
    "dataSchema": { 
      "type": "object",
      "properties": {
        "_id": {
          "type": "string"
        }
      }
    }
  },
  "content": {
    "type": "element",
    "tag": "crud-client",
    "config": {
      "basePath": "/v2/customers",
      "schema": {
        "$ref": "dataSchema"
      },
    }
  }
}
```

After a standard bootstrap time, the page will send a `GET` requests for `_id`'s on the `customers` collection, a `GET` requests for dataset count, and will emit a [display-data](events/events.md#display-data) event. This ends the page bootstrap.
