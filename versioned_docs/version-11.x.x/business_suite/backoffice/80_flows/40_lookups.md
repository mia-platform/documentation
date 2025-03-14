---
id: lookups
title: Lookup fields - Working with writable views
sidebar_label: Lookups
---
[crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[writable-views]: /runtime_suite/crud-service/writable_views

[data-schema]: ../30_page_layout.md#data-schema
[visualization-options]: ../30_page_layout.md#visualization-options

[rawobject]: ../40_core_concepts.md#rawobject
[deprecated-lookups]: ../30_page_layout.md#lookups-deprecated

[bk-dynamic-form-modal]: ../60_components/210_dynamic_form_modal.md
[bk-dynamic-form-card]: ../60_components/190_dynamic_form_card.md
[bk-dynamic-form-drawer]: ../60_components/200_dynamic_form_drawer.md
[bk-form-modal]: ../60_components/340_form_modal.md
[bk-form-card]: ../60_components/320_form_card.md
[bk-form-drawer]: ../60_components/330_form_drawer.md
[bk-crud-lookup-client]: ../60_components/170_crud_lookup_client.md

[modal-modes]: ../60_components/210_dynamic_form_modal.md#modes
[modal-lookup-queries]: ../60_components/210_dynamic_form_modal.md#lookupqueries
[modal-conditional-fields]: ../60_components/210_dynamic_form_modal.md#conditional-fields
[modal-writable-views]: ../60_components/210_dynamic_form_modal.md#writable-views



[Mia-Platform CRUD Service][crud-service] allows to create [writable views][writable-views].
Views are virtual collections that encapsulate the results derived from aggregation pipelines. Their primary function revolves around presenting data obtained from one collection within the contextual framework of a main collection, which is referred to as the "source". Normally, views are read-only, but since version 6.9.0 of the `CRUD Service`, editing a view will automatically reflect changes to the original collection.

"Lookup fields" are those fields within views that reference data from a collection different to the original one.
Components such as the [Dynamic Form Modal][bk-dynamic-form-modal] are geared to [work with such fields][modal-writable-views].

Lookup fields can be configured in the [data-schema] by defining fields of type `object` or `array` and format `lookup`.
The [Dynamic Form Modal][bk-dynamic-form-modal], [Dynamic Form Drawer][bk-dynamic-form-drawer], [Dynamic Form Card][bk-dynamic-form-card] components render these as select fields, for which options are fetched using the `/lookup` route provided by `CRUD Service` views.
Each option fetched like this is expected to be an object, and should have at least a `label` field, which is used as display value inside the form, and a `value` field which is used as unique identifier for such option.

:::caution
Setting up lookup fields using the [Crud Lookup Client][bk-crud-lookup-client] in conjunction with one between [Dynamic Form Modal][bk-dynamic-form-modal] or [Dynamic Form Drawer][bk-dynamic-form-drawer] or [Dynamic Form Card][bk-dynamic-form-card] is **deprecated** since version 1.4.0 of Back-Kit components.\
Documentation on previous way of configuring lookup fields is available [here][deprecated-lookups].
:::

## Lookup fields display in the Table

[Table][bk-table] normally shows lookup array fields cells as a placeholder, holding a counter of the elements in the array.

However, if internal content is meant to be shown in-place, it is possible to `join` its values and print it as a string.

This is achieved by specifying a `joinDelimiter` key in the [visualization options][visualization-options] of the [data-schema]. An empty string is allowed.
The `label`s of the array entries are joined with the specified string in `joinDelimiter`.

```json
{
  "visualizationOptions": {
    ...
    "joinDelimiter": "<delimiter>"
  }
}
```

Lookup fields of type object are also displayed as a placeholder by default in table cells.
Property `template` in the [visualization options][visualization-options] of the [data-schema] can be used to specify a custom visualization. For instance:

```json
{
  "visualizationOptions": {
    ...
    "joinDelimiter": "{{label}}"
  }
}
```

For an example, see [below](#example-showing-lookup-fields-in-the-Table).

## Migrating to writable views from previous lookups

Starting from version 1.4.0 of Back-Kit, lookup fields should be handled through [CRUD Service][crud-service] feature of [writable views][writable-views].

In particular, the [Dynamic Form Modal][bk-dynamic-form-modal], [Drawer][bk-dynamic-form-drawer], [Card][bk-dynamic-form-card] components do not listen to events triggered by the [Crud Lookup Client][bk-crud-lookup-client], but rather fetch lookup options directly by calling the `/lookup` route, that the Crud Service makes available for writable views.

The Crud Lookup Client component is therefore deprecated, as well as:
- the [Form Modal][bk-form-modal], which should be replaced by the Dynamic Form Modal,
- the [Form Drawer][bk-form-drawer], which should be replaced by the Dynamic Form Drawer,
- the [Form Card][bk-form-card], which should be replaced by the Dynamic Form Card.

[Data-schema][data-schema] key `lookupOptions` is also deprecated, and ignored by the new form components.

The Dynamic Form Modal, Drawer, Card can be configured in a way to cover features that were previously configured using `lookupOptions`.

- `lookupQueries`

  `lookupQueries` should not be specified inside `lookupOptions` in the data-schema, but rather as a [property of the form component][modal-lookup-queries], which maps each lookup field to additional queries to append to the call to fetch options.
  
  An [example](#example-setting-up-extra-queries-to-fetch-lookup-options) is available showing how to configure the property `lookupQueries` of the Dynamic Form Modal.

- `lookupDeps`

  Property `lookupDeps` of `lookupOptions` is used to specify a dependency between a lookup field and other fields within the form.
  The Dynamic Form Modal, Drawer, Card, instead, handle [dependencies among fields][modal-conditional-fields] through properties `conditionalOptions` and `conditionalValues`.

  An [example](#example-specifying-lookup-dependencies) is available showing how to use properties `conditionalValues` and `lookupQueries` of the Dynamic Form Modal to set up lookup fields that depend on other fields of the form.


## Examples

### Example: Setting up extra queries to fetch lookup options

A Dynamic Form Modal configured like the following
```json
{
  "tag": "bk-dynamic-form-modal",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "dishes": {"type": "array", "format": "lookup"},
        ...
      }
    },
    "basePath": "/orders",
    "lookupQueries": {
      "dishes": {
        "calories": {
          "$lt": 300
        }
      }
    }
  }
}
```
fetches options for field "dishes" from `orders/lookup/dishes` with the additional condition that "calories" field of dishes collection should be lower than 300, expressed in the query parameters of the request.

Dynamic queries are also available:
```json
{
  "tag": "bk-dynamic-form-modal",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "maxCalories": {"type": "number"},
        "dishes": {"type": "array", "format": "lookup"},
        ...
      }
    },
    "basePath": "/orders",
    "lookupQueries": {
      "dishes": {
        "calories": {
          "$lt": "{{rawObject maxCalories}}" // rawObject can be used to prevent numeric values from being stringified
        }
      }
    }
  }
}
```
in this case, form field "maxCalories" is used to dynamically compute the additional query to use when fetching options for "dishes" lookup field.

:::info
In the previous example, [`rawObject` helper][rawobject] is used to avoid numeric values from being stringified
:::

### Example: Submitting writable views with a form component

The following example shows a configuration of the Dynamic Form Modal designed to interact with writable views:

```json
{
  "tag": "bk-dynamic-form-modal",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "rider": {"type": "object", "format": "lookup"}
      }
    },
    "basePath": "/orders-view",
    "omitSubmit": true,
    "actions": {
      "insert": [{
        "content": "Add order",
        "type": "primary",
        "action": {
          "type": "http",
          "config": {
            "url": "/orders-view/",
            "method": "POST",
            "body": "{{rawObject values}}"
          }
        }
      }],
      "select": [{
        "content": "Update order",
        "type": "primary",
        "action": {
          "type": "http",
          "config": {
            "url": "/orders-view/",
            "method": "PATCH",
            "body": "{{rawObject values}}"
          }
        }
      }]
    }
  }
}
```
- being "rider" an `object` field with `lookup` format, is rendered as a select field
- options for "rider" select field are dynamically fetched from `/orders-view/lookup/rider`
- the default `submitButton` is overridden by a custom button that performs a POST with the whole body of the form to "/orders-view/" endpoint if the Dynamic Form Modal is operating under [*insert* mode][modal-modes], or an analogous PATCH if under [*edit* mode][modal-modes].

:::info
In the previous example, [`rawObject` helper][rawobject] is used to avoid form values from being stringified
:::

### Example: Showing lookup fields in the Table

Specifying a `joinDelimiter` key in the [data-schema]'s [visualization options][visualization-options] of a lookup array field causes the [Table][bk-table] to show the content of the field in-place inside the corresponding cell.

A Table configured like:
```json
{
  "tag": "bk-table",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "dishes": {
          "type": "array",
          "format": "lookup"
        },
        "riders": {
          "type": "array",
          "format": "lookup",
          "visualizationOptions": {
            "joinDelimiter": ", "
          }
        },
        "customer": {
          "type": "object",
          "format": "lookup",
          "visualizationOptions": {
            "template": "{{label}}"
          }
        }
      }
    }
  }
}
```

with data like:
```json
[
  {
    "name": "Sarah",
    "dishes": [
      {"value": "id-dish-1", "label": "Omelette"},
      {"value": "id-dish-9", "label": "Veggie Burger"},
    ],
    "riders": [
      {"value": "id-rider-1", "label": "Alejandro"},
      {"value": "id-rider-2", "label": "Susanna"},
    ],
    "customer": {
      "value":"id-customer-1", "label": "Marco"
    }
  },
  {
    "name": "Bruce",
    "dishes": [
      {"value": "id-dish-7", "label": "Hamburger"},
      {"value": "id-dish-5", "label": "Coconut"},
      {"value": "id-dish-10", "label": "Cheesecake"},
    ],
    "riders": [
      {"value": "id-rider-4", "label": "Simon"}
    ],
    "customer": {
      "value":"id-customer-12", "label": "Kevin"
    }
  },
  ...
]
```

renders a table which can be represented by an array like:
```json
[
  ["Sarah", "2 Elements", "Alejandro, Susanna", "Marco"],
  ["Bruce", "3 Elements", "Simon", "Kevin"],
  ...
]
```

### Example: Specifying lookup dependencies

```json
{
  "tag": "bk-dynamic-form-modal",
  "properties": {
    "basePath": "/orders",
    "dataSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "object",
          "format": "lookup"
        },
        "city": {
          "type": "object",
          "format": "lookup"
        }
      }
    },
    "conditionalValues": [
      {
        "property": "city",
        "query": {
          "city.stateId": {
            "$eq": "state.value"
          }
        }
      }
    ],
    "lookupQueries": {
      "city": {
        "stateId": {
          "$eq": "{{state.value}}"
        }
      }
    }
  }
}
```

- `conditionalValues` property ensures that the "city" field is automatically reset any time the selected "state" field does not correspond to the "stateId" of the selected value for "city"
- `lookupQueries` properties ensures that only options having "stateId" equals to the selected value for "state" are fetched for field "city"

For instance, a valid configuration could be:

```json
{
  "state": {
    "value": "italy",
    "label": "Italy"
  },
  "city": {
    "value": "milan",
    "stateId": "italy",
    "label": "Milan"
  }
}
```

editing the "state" field triggers the "city" field to be reset. For instance:

```json
{
  "state": {
    "value": "france",
    "label": "France"
  },
  "city": {}
}
```

since `state.value` no longer equals `city.stateId`, the "city" field is reset, due to the confition expressed in `conditionalValues`.

At this point, due to the specified `lookupQueries` property, HTTP calls to fetch options for the "city" field are performed to `/orders/lookup/city` with the following query paramters:

```json
{
  "stateId": {
    "$eq": "france"
  }
}
```
which might return options like:
```json
[
  {
    "value": "paris",
    "label": "Paris",
    "stateId": "france"
  },
  {
    "value": "lione",
    "label": "Lione",
    "stateId": "france"
  },
  ...
]
```
limiting therefore the available options to be coherent with the specified condition in `conditionalValues`.

:::info
The example features the [Dynamic Form Modal][bk-dynamic-form-modal], but the [Dynamic Form Drawer][bk-dynamic-form-drawer] and the [Dynamic Form Card][bk-dynamic-form-vard] could be configured in the same way to obtain the same result.
:::

:::info
Notice that field "stateId" should be included in the values returned for the "city" field. This can be achieved through proper configuration of the aggregation pipeline that is used to build the underlying [writable view][writable-views].
Components [Dynamic Form Modal][bk-dynamic-form-modal], [Dynamic Form Drawer][bk-dynamic-form-drawer], [Dynamic Form Card][bk-dynamic-form-vard] always carry in their internal representation of the form values the whole lookup object, although only the label is displayed.
This is why, in the example, `conditionalValues` may reference the "stateId" key in the value of the "city" field.
:::
