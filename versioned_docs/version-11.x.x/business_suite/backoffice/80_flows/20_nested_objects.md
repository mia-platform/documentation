---
id: nested_objects
title: Nested Data
sidebar_label: Nested Objects
---
[crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md

[data-schema]: ../30_page_layout.md#data-schema
[schema-formats]: ../30_page_layout.md#formats
[form-options]: ../30_page_layout.md#form-options

[bk-form-modal]: ../60_components/340_form_modal.md
[bk-form-drawer]: ../60_components/330_form_drawer.md
[bk-dynamic-form-modal]: ../60_components/210_dynamic_form_modal.md
[bk-dynamic-form-drawer]: ../60_components/200_dynamic_form_drawer.md
[bk-table]: ../60_components/510_table.md
[bk-pagination]: ../60_components/460_pagination.md
[bk-breadcrumbs]: ../60_components/60_breadcrumbs.md
[bk-crud-client]: ../60_components/100_crud_client.md
[bk-add-new-button]: ../60_components/20_add_new_button.md
[bk-add-filter-button]: ../60_components/10_add_filter_button.md
[bk-tabs]: ../60_components/520_tabs.md
[bk-filter-drawer]: ../60_components/290_filter_drawer.md
[bk-filters-manager]: ../60_components/300_filters_manager.md

[table-actions]: ../60_components/510_table.md#actions

[nested-navigation-state/push]: ../70_events.md#nested-navigation-state---push
[nested-navigation-state/back]: ../70_events.md#nested-navigation-state---back
[nested-navigation-state/display]: ../70_events.md#nested-navigation-state---dispaly
[update-data]: ../70_events.md#update-data
[display-data]: ../70_events.md#display-data



Some Back-Kit components are designed to handle nested data - that is, fields of type object or array of objects that specify a [data-schema].
These components have a dedicated modality that allows the user to interact with nested data.
It is possible to request to enter or exit a nested field, allowing the user to navigate across nesting layers.

```json
{
  "parent": {
    "type": "object",
    "dataSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "lastname": {
          "type": "string"
        }
      }
    }
  },
  "children": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "dateOfBirth": {
          "type": "string",
          "format": "date"
        },
        "school": {
          "type": "string"
        },
        "toys": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "kind": {
                "type": "string",
                "enum": ["Sport", "Action Figure", "Table Game"]
              },
              "price": {
                "type": "number"
              }
            }
          }
        }
      }
    }
  }
}
```

Nested data schemas support the same options that can be specified for a top level data schema.

## Nested Fields in the Table and Forms

Fields of type object or array that have a data-schema and no specific [format][schema-formats] are handled in a specific modality by components such as the [Table][bk-table], the [Dynamic Form Drawer][bk-dynamic-form-drawer], the [Dynamic Form Modal][bk-dynamic-form-modal], the [Form Modal][bk-form-modal], the [Form Drawer][bk-form-drawer].

The Table component allows to interact with cells corresponding to nested fields by clicking on them.
Doing so, the Table uses the schema of the field to interpret the data inside the cell, and re-renders itself to display that data.

Analogously, the label of nested fields inside a Dynamic Form Drawer or Dynamic Form Modal is clickable.
Doing so has the same effect as clicking on the corresponding cell in the table.

Components like the Table, the Dynamic Form Drawer, the Dynamic Form Modal keep an internal representation of the each nested field that was requested to be visualized,
and update their properties accordingly.

From a technical point of view, clicking on a Table cell or a form label associated to nested data emits a [nested-navigation-state/push] event, which signals the request to enter the visualization of the nested data in question.

The payload of the event includes information such as:
  - the nested data
  - the object that contains the nested data
  - the id of the field with the nested data
  - the index of the entered data within the array that includes it (if the nested field is an object, 0 is used)
  - whether the entered nested data is an object or an array
  - whether of not the nested data is to be considered read-only

For instance:
  ```json
  {
    "data": [{"name": "Bruce"}, {"name": "Will"}],
    "origin": [
      {"floor": "0", "room": "100", "people": []},
      {"floor": "1", "room": "200", "people": [{"name": "Bruce"}, {"name": "Will"}]},
      {"floor": "1", "room": "201", "people": [{"name": "Robert"}]},
      ...
    ],
    "selectedKey": "people",
    "rowIndex": 1,
    "isObject": false,
    "readonly": false
  }
  ```

While form components listen to `nested-navigation-state/push` events to determine how to update their properties in order to allow the user to interact with nested data, the Table also listens to event [nested-navigation-state/display], which also includes information on what portion of the nested data should be visualized.
This is to ensure that data pagination is also applied to nested data, consistently with the "first level" dataset.
The [Pagination][bk-pagination] component emits `nested-navigation-state/display` events as a reaction to `nested-navigation-state/push` events.

:::caution
The [Pagination][bk-pagination] component should be included in the plugin in order to correctly visualize nested data with the [Table][bk-table].
:::

### Editing nested data

Nested data can be edited by [Table][bk-table] and form components.

Form components like the [Dynamic Form Drawer][bk-dynamic-form-drawer], the [Dynamic Form Modal][bk-dynamic-form-modal], the [Form Modal][bk-form-modal], the [Form Drawer][bk-form-drawer] allow to interact with nested data in the same way as "regular" data.

Upon editing or creating a new value inside a nested field, the form components require, via an [update-data] event, the nested field to be edited within the corrensponding "starting" item of the collection.

The Table allows editing nested data via [action buttons][table-actions].
By default, the Table renders an action to delete a row of data inside a nested field.
This action triggers an [update-data] event, the nested field of the "starting" collection data item is requested to be updated.

The `update-data` events are listened by components like the CRUD Client, which perform an HTTP request to a [CRUD Service][crud-service] to update the data item. If the request is successful, the CRUD Client emits a [display-data] event to propagate the newly updated data.

This would normally trigger the Table to render such data, loosing this way the nested data visualization.
To avoid this behavior, the [Breadcrumbs][bk-breadcrumbs] component should be included in the page.
It listens to the `display-data` event, and consequently emits [nested-navigation-state/push] events to restore the nested visualization with the newly updated data.

:::caution
The [Pagination][bk-pagination] and the [Breadcrumbs][bk-breadcrumbs] components should be included in the plugin configuration for the [Table][bk-table] component to work properly while editing nested fields.
:::

An example of how nested data can be edited with a form component and a Table is [available][example-editing-nested-data].

## Limitations: filtering

Nested data filtering is not currently supported by Back-Kit components.

Thus, whenever the visualization of nested data is requested via a [nested-navigation-state/push] event:
  - the [Add Filter Button][bk-add-filter-button] is disabled,
  - the [Tabs][bk-tabs] components are not rendered,
  - filtering components should not be used, like the [Filter Drawer][bk-filter-drawer] or the [Filters Manager][bk-filters-manager].

## Read-only nested data

The payload of the [nested-navigation-state/push] event includes information on whenter the entered field is to be considered as read-only.
Several Back-Kit components are designed to handle read-only nested data.

- the [Add New Button][bk-add-new-button] is disabled
- form components, like the [Dynamic Form Drawer][bk-dynamic-form-drawer], the [Dynamic Form Modal][bk-dynamic-form-modal], are opened in read-only mode
- the [Table][bk-table] default delete row action is not displayed

To specify a property to be treated as read-only, the dedicated [form option][form-options] key `readOnly` should be used.

Object and arrays that are nested inside a read-only field are also treated as read-only in the context of nested data navigation, even though they might not be explicitly specified as read-only in the [data schema][data-schema].
For instance, in the following schema, the array `children` is specified to be read-only, therefore the array `toys` will also be treated as read-only:

```json
{
  "parent": {
    "type": "object",
    "dataSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "lastname": {
          "type": "string"
        }
      }
    }
  },
  "children": {
    "type": "array",
    "formOptions": {
      "readOnly": true // "children" is read-only
    },
    "items": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "dateOfBirth": {
          "type": "string",
          "format": "date"
        },
        "school": {
          "type": "string"
        },
        "toys": { // "toys" is not specified to be read-only, but it is considered as such since it belongs to a read-only field ("children")
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "kind": {
                "type": "string",
                "enum": ["Sport", "Action Figure", "Table Game"]
              },
              "price": {
                "type": "number"
              }
            }
          }
        }
      }
    }
  }
}
```


## Examples

### Example: Entering nested data

Assuming a dataset to have items:

```json
[
  {
    "difficulty": "medium",
    "ingredients": [
      {
        "name": "Chicken",
        "calories": 500
      },
      {
        "name": "Potatoes",
        "calories": 600
      },
      {
        "name": "Olive Oil",
        "calories": 20
      }
    ]
  },
  {
    "difficulty": "easy",
    "ingredients": [
      {
        "name": "Lettuce",
        "calories": 90
      },
      {
        "name": "Olive Oil",
        "calories": 20
      }
    ]
  }
]
```

and a the following components to be included in the page:

- a [Table][bk-table]
  ```json
  {
    "tag": "bk-table",
    "properties": {
      "dataSchema": {
        "type": "object",
        "properties": {
          "difficulty": {
            "type": "string",
            "enum": ["hard", "medium", "easy"]
          },
          "ingredients": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "calories": {
                  "type": "number"
                }
              }
            }
          }
        }
      }
    }
  }
  ```

- a [Pagination][bk-pagination]
  ```json
  {
    "tag": "bk-pagination"
  }
  ```

then the rendered table can be represented by an array as:

```json
[
  ["medium", "3 Elements"],
  ["easy", "2 Elements"]
]
```

::info
By default, the Table renders array fields as a counter of the number of elements in the array.
:::

The cells of the column corresponding to the "ingredients" field are clickable.

Clicking on the first cell causes the Table to notify that the visualization of the corresponding nested data should be activated.
This corresponds to emitting a [nested-navigation-state/push] event with payload:
```json
{
  "data": [
      {"name": "Chicken","calories": 500},
      {"name": "Potatoes", "calories": 600},
      {"name": "Olive Oil", "calories": 20}
    ],
  "origin": {
    "difficulty": "medium",
    "ingredients": [
      {"name": "Chicken","calories": 500},
      {"name": "Potatoes", "calories": 600},
      {"name": "Olive Oil", "calories": 20}
    ]
  },
  "selectedKey": "ingredients",
  "rowIndex": 0,
  "isObject": false,
  "readonly": false
}
```

the Pagination component listens to `nested-navigation-state/push` events, and notifies what portion of the nested data should be visualized.
Pagination component handles pagination of nested data as well, other than that of "regular" data.
Assuming the currently selected page-size to be 25 (which is the default value), the Pagination component emits a [nested-navigation-state/display] event with payload:
```json
{
  "data": [
    {"name": "Chicken","calories": 500},
    {"name": "Potatoes", "calories": 600},
    {"name": "Olive Oil", "calories": 20}
  ],
  "from": 0,
  "to": 25,
}
```

Signaling that the first 25 elements of the specified nested data should be visualized - thus the whole data in this case.
The Table listens to the `nested-navigation-state/display` event and updates the rendered data:

```json
[
  ["Chicken","500"],
  ["Potatoes", "600"],
  ["Olive Oil", "20"]
]
```

### Example: Editing Nested Data

Assuming a dataset to have items:

```json
[
  {
    "difficulty": "medium",
    "ingredients": [
      {
        "name": "Chicken",
        "calories": 500
      },
      {
        "name": "Potatoes",
        "calories": 600
      },
      {
        "name": "Olive Oil",
        "calories": 20
      }
    ]
  },
  ...
]
```

and a the following components to be included in the page:

- a [Table][bk-table]
  ```json
  {
    "tag": "bk-table",
    "properties": {
      "dataSchema": {
        "type": "object",
        "properties": {
          "difficulty": {
            "type": "string",
            "enum": ["hard", "medium", "easy"]
          },
          "ingredients": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "calories": {
                  "type": "number"
                }
              }
            }
          }
        }
      }
    }
  }
  ```

- a [Dynamic Form Modal][bk-dynamic-form-modal] with the same data-schema as the Table
  ```json
  {
    "tag": "bk-dynamic-form-modal",
    "properties": {
      "dataSchema": {
        ...
      }
    }
  }
  ```

- a [Breadcrumbs][bk-breadcrumbs] component
  ```json
  {
    "tag": "bk-breadcrumbs",
    "properties": {
      "dataSchema": {
        ...
      }
    }
  }

- a [Pagination][bk-pagination] component
  ```json
  {
    "tag": "bk-pagination",
    "properties": {
      "dataSchema": {
        ...
      }
    }
  }

- a [CRUD Client][bk-crud-client] component
  ```json
  {
    "tag": "bk-breadcrumbs",
    "properties": {
      "dataSchema": {
        ...
      }
    }
  }


and assuming the Table to be currently rendering the "ingredients" nested field

```json
[
  ["Chicken","500"],
  ["Potatoes", "600"],
  ["Olive Oil", "20"]
]
```

then clicking on the second row opens the Dynamic Form Modal, which allows the user to edit the fields.
Assuming the field to decrease the "calories" field to 450 and submit, then the Dynamic Form Modal emits an [update-data] event with payload:

```json
{
  "ingredients": [
    {
      "name": "Chicken",
      "calories": 500
    },
    {
      "name": "Potatoes",
      "calories": 450 // <-- updated data
    },
    {
      "name": "Olive Oil",
      "calories": 20
    }
  ]
}
```

Notice how the whole "starting" field is sent as payload of the event.
The [CRUD Client][bk-crud-client] might be included in the page and perform an HTTP request to update the data item in question.

If the data is correctly updated, the CRUD Client fetches the newly updated data and propagates it through a [display-data] event.

```json
// payload of the display-data event
{
  "data": [
    {
      "difficulty": "medium",
      "ingredients": [
        {
          "name": "Chicken",
          "calories": 500
        },
        {
          "name": "Potatoes",
          "calories": 450
        },
        {
          "name": "Olive Oil",
          "calories": 20
        }
      ]
    },
    ...
  ]
}
```

The Breadcrumbs listens to the `display-data`, and consequently emits a [nested-navigation-state/push] to restore the previous visualization.
```json
// payload of the nested-navigation-state/push
{
  "data": [
      {"name": "Chicken","calories": 500},
      {"name": "Potatoes", "calories": 450},
      {"name": "Olive Oil", "calories": 20}
    ],
  ...
}
```

the Pagination component listens to this event and informs the Table on what portion of the nested data should be rendered, with a [nested-navigation-state/display] event. Assuming the current page size to be 25 (default), then the whole nested field is rendered:

```json
// payload of the nested-navigation-state/display
{
  "data": [
    {"name": "Chicken","calories": 500},
    {"name": "Potatoes", "calories": 450},
    {"name": "Olive Oil", "calories": 20}
  ],
  "from": 0,
  "to": 25,
}
```

corresponding to the Table rendering:
```json
[
  ["Chicken","500"],
  ["Potatoes", "450"],
  ["Olive Oil", "20"]
]
```

:::info
Notice how the Pagination and the Breadcrumbs components are both needed when updating nested data.
:::

By default, the Table rendered an action to delete a data row inside nested field.
Clicking the action of the first row, for instance, emits an `update-data` event with payload:

```json
{
  "ingredients": [
    {
      "name": "Potatoes",
      "calories": 450 
    },
    {
      "name": "Olive Oil",
      "calories": 20
    }
  ]
}
```

requesting to update the "ingredients" field of data item, and triggering a new cycle of events like the one described above.