---
id: plugin_example
title: Plugin example
sidebar_label: Plugin example
---
This is a configuration example for a Back-Kit Web Components plugin. The configuration using Back-Kit components is usually split in two parts. First is a `schema`, stating how to interpret the data associated to the plugin; secondly, the actual components that form the plugin.

## Schema

The purpose of a [data-schema](page_layout#data-schema) is to tell components how to interpret data correctly, using the availbale configuration options. A `schema` can provide several information on how to interpret the data, but each component only utilizes the information it needs.

Follows a `schema` example that provides information on two fields, `_id` and `status`.

```json
{
  "$ref": {
    "dataSchema": {
      "type": "object",
      "properties": {
      "_id": {
        "label": "_id",
        "type": "string",
        "visualizationOptions": {
          "hidden": true
        },
        "formOptions": {
          "hidden": true
        },
        "filtersOptions": {
          "hidden": true
        }
      },
      "status": {
        "label": {
          "en": "Order status",
          "it": "Stato ordine"
        },
        "type": "string",
        "enum": [
          "Pending",
          "Preparing",
          "Delivered",
          "Aborted"
        ],
        "default": "Pending",
        "excludeFromSearch": true,
        "visualizationOptions": {
          "iconMap": {
            "Pending": {
              "shape": "roundedSquare",
              "color": "#03a9f4"
            },
            "Preparing": {
              "shape": "roundedSquare",
              "color": "#ff9800"
            },
            "Delivered": {
              "shape": "roundedSquare",
              "color": "#4caf50"
            },
            "Aborted": {
              "shape": "roundedSquare",
              "color": "#ef5350"
            }
          }
        },
        "filtersOptions": {
          "hidden": true
        }
      }
    }
  }
}
```

:::info
It is recommended to declare `dataSchema` using [JSON-Schema-7](https://json-schema.org/draft-07/json-schema-release-notes.html) syntax `$ref`, in order to declare it only once within the same *json* file.
:::

The first filed is `_id`.

```json
{
  "_id": {
    "label": "_id",
    "type": "string",
    "visualizationOptions": {
      "hidden": true
    },
    "formOptions": {
      "hidden": true
    },
    "filtersOptions": {
      "hidden": true
    }
  },
  ...
}
```

This `schema` contains several information, but not all components use all of this information.

For instance, the `label` of the field is used by components such as [bk-table](Components/data_visualization#table) or [bk-form-drawer](Components/data_manipulation#form-drawer), if they are included in the plugin and provided with this `schema`, as a print-out text for the field.

On the other hand, `filtersOptions` is ignored by `bk-table` component, but used by [bk-filter-drawer](Components/data_querying#filter-drawer). In particular, `bk-filter-drawer` knows that it should not allow the user to create [filters](core_concepts#filters) based on this field.

The second field is `status`.

```json
{
  ...
  "status": {
    "label": {
      "en": "Order status",
      "it": "Stato ordine"
    },
    "type": "string",
    "enum": [
      "Pending",
      "Preparing",
      "Delivered",
      "Aborted"
    ],
    "default": "Pending",
    "excludeFromSearch": true,
    "visualizationOptions": {
      "iconMap": {
        "Pending": {
          "shape": "roundedSquare",
          "color": "#03a9f4"
        },
        "Preparing": {
          "shape": "roundedSquare",
          "color": "#ff9800"
        },
        "Delivered": {
          "shape": "roundedSquare",
          "color": "#4caf50"
        },
        "Aborted": {
          "shape": "roundedSquare",
          "color": "#ef5350"
        }
      }
    },
    "filtersOptions": {
      "hidden": true
    }
  }
}
```

This field presents a multi-lingual `label`, specifying one value for italian and one for english. The value displayed for the label depends on the language of the browser. Back-Kit components should all support international labels.

The field is of type `string`, just like `_id`, but it only accepts a defined set of values, specified in `enum`. The `enum` option is utilized by some components, such as [bk-form-drawer](Components/data_manipulation#form-drawer) or [bk-filter-drawer](Components/data_querying#filter-drawer), so that the field can only be assigned one of the indicated values.

`visualizationOptions` describes a 1-to-1 map that associates the possible values to icons. This option is utilized by components such as [bk-table](Components/data_visualization#table) to represent the field in question with icons instead of text.

`excludeFromSearch` informs components such as the [bk-crud-client](Components/clients#crud-client) to not include this field in queries based on text search.

## Plugin content

The components of the plugin are included in the `content` section of the configuration. This section will then be parsed and converted from *json* to *html*.

It is possible to structure the plugin by nesting *json* fields, and by specifying a `type` and a `tag` fields for each of them.

For instance, the following would be a valid configuration:

```json
{
  "$ref": {
    "dataSchema": {...}
  },
  "content": {
    "type": "element",
    "tag": "div"
  }
}
```

The `type` options provides general information on what type of element is being specified in the field, while the `tag` options specifies what kind of *html* node should be created. In particular, the `tag` option allows to specify either an *html* tag or a Back-Kit web component.

A more meaningful example of `content`:

```json
{
  "type": "row",
  "attributes": {
    "style": "margin: 1vw 2vw 0vh 2vw; align-items: left;"
  },
  "content": [
    {
      "type": "column",
      "content": [
        {
          "type": "element",
          "tag": "bk-navigation-back-arrow",
          "url": "/back-kit/{{BACK_KIT_VERSION}}/lit-bk-web-components.esm.js"
        },
        {
          "type": "element",
          "tag": "bk-breadcrumbs",
          "attributes": {
            "style": "margin-left: 2%;"
          },
          "properties": {
            "dataSchema": {
              "$ref": "dataSchema"
            }
          }
        }
      ]
    },
    {
      "type": "column", 
      "attributes": {
        "style": "justify-content: space-between; margin: 1vw 2vw 0vh 2vw; align-items: center;"
      },
      "content": [
        {
          "type": "column",
          "attributes": {
            "style": "align-items: center;"
          },
          "content": [
            {
              "type": "element",
              "tag": "bk-title",
              "attributes": {
                "style": "margin: 0 1vw 0 0;"
              },
              "properties": {
                "content": {
                  "en": "Orders",
                  "it": "Ordini"
                }
              }
            },
            {
              "type": "element",
              "tag": "bk-refresh-button"
            }
          ]
        },
        {
          "type": "element",
          "tag": "bk-search-bar",
          "properties": {
            "placeholder": {
              "en": "Search...",
              "it": "Cerca..."
            }
          }
        },
        {
          "type": "column",
          "attributes": {
            "style": "align-items: center;"
          },
          "content": [
            {
              "type": "element",
              "tag": "bk-add-new-button",
              "attributes": {
                "style": "margin: 0 1vw 0 0;"
              }
            },
            {
              "type": "element",
              "tag": "bk-add-filter-button"
            }
          ]
        }
      ]
    }
  ]
}
```

The most external field

```json
{
  "type": "row",
  "attributes": {
    "style": "margin: 1vw 2vw 0vh 2vw; align-items: left;"
  },
  "content": [
    ...
  ]
}
```

informs the rendering engine that the elements specified inside `content` should be organized in a `flex: row` style, thanks to `type` option being `row`.

In particular, `type` can be one of three values, `row`, `column`, `element`. `row` and `column` indicates that the nodes in `content` should be arranged in a `flex: row` or `flex: column` style respectively. The `element` type, instead, informs that the current field should be converted into an *html* node with the specified `tag`.

The `attributes` option allows to include key-value pairs that will be added to the resulting *html* nodes. Attributes differ from properties as they are also accessible from the HTML document directly. The `attributes` options can be used to attach extra `css` styling, which is added to the pre-defined styling of the web component.

The following images illustrates how including `css` styling in the configuration impacts the final styling of the SPA.
The images show the header styling without and with the extra styling of the first `row`

```json
{
  ...
  "attributes": {
    "style": "margin: 1vw 2vw 0vh 2vw; align-items: left;"
  },
  ...
}
```

![Header without extra styling](img/no_extra_style_header.png)

![Header with extra styling](img/extra_style_header.png)

The `row` contains two fields of type `column`.

```json
{
  "type": "column",
  "content": [
    ...
  ]
},
{
  "type": "column", 
  "attributes": {
    "style": "justify-content: space-between; margin: 1vw 2vw 0vh 2vw; align-items: center;"
  },
  "content": [
    ...
  ]
}
```

These are contained in the node resulting from the first `row`, and both arrange their content in a `flex: column` style.

The first `column` includes two nodes of type `element`:

```json
{
  "type": "element",
  "tag": "bk-navigation-back-arrow",
},
{
  "type": "element",
  "tag": "bk-breadcrumbs",
  "attributes": {
    "style": "margin-left: 2%;"
  },
  "properties": {
    "dataSchema": {
      "$ref": "dataSchema"
    }
  }
}
```

Both `element`s specify as `tag` a Back-Kit web component, [bk-navigation-back-arrow](Components/buttons#navigation-back-arrow) and [bk-breadcrumbs](Components/data_visualization#bk-breadcrumbs) respectively.
For the latter, extra styling is provided, as well as a property `dataSchema`. It is possible to initialize properties of the web components using the `properties` option.
In this particular case, the `dataSchema` property is initialized using [JSON-Schema-7](https://json-schema.org/draft-07/json-schema-release-notes.html) syntax `$ref`, which allows to declare the `dataSchema` only once within the same *json* file. It is recommended to utilize this approach when passing the `schema` to web components, as it allows more concise, easier to debug and understand configurations.

## Full configuration

Following is an example of a realistic full configuration for a plugin based on Back-Kit web components. The configuration includes

- a reference to a `schema`
- information on how to render web components in the page
  - components are organized using `row` and `column` nodes as containers
  - extra styling is specified where needed
  - initial values for components props are provided

```json
{
  "$ref": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "_id": {
          "label": "_id",
          "type": "string",
          "visualizationOptions": {
            "hidden": true
          },
          "formOptions": {
            "hidden": true
          }
        },
        "__STATE__": {
          "type": "string",
          "label": "CRUD State",
          "default": "PUBLIC",
          "enum": ["PUBLIC", "DRAFT", "TRASH"],
          "visualizationOptions": {
            "hidden": true
          },
          "formOptions": {
            "hiddenOnSelect": true
          },
          "filtersOptions": {
            "hidden": true
          }
        },
        "status": {
          "label": {
            "en": "Order status",
            "it": "Stato ordine"
          },
          "type": "string",
          "enum": [
            "Pending",
            "Preparing",
            "Delivered",
            "Aborted"
          ],
          "default": "Pending",
          "excludeFromSearch": true,
          "visualizationOptions": {
            "iconMap": {
              "Pending": {
                "shape": "roundedSquare",
                "color": "#03a9f4"
              },
              "Preparing": {
                "shape": "roundedSquare",
                "color": "#ff9800"
              },
              "Delivered": {
                "shape": "roundedSquare",
                "color": "#4caf50"
              },
              "Aborted": {
                "shape": "roundedSquare",
                "color": "#ef5350"
              }
            }
          },
          "filtersOptions": {
            "hidden": true
          }
        },
        "dishes": {
          "label": {
            "it": "Piatti",
            "en": "Dishes"
          },
          "type": "array",
          "format": "multilookup",
          "visualizationOptions": {
            "joinDelimiter": "; "
          },
          "lookupOptions": {
            "lookupDataSource": "dishes",
            "lookupValue": "_id",
            "lookupFields": [
              "name"
            ]
          }
        },
        "obj": {
          "type": "object",
          "format": "localized-text",
          "label": {"en": "Notification", "it": "Notifiche"},
          "dataSchema": {
            "type": "object",
            "properties": {
              "it": {
                "type":"string"
              },
              "en": {
                "type":"string"
              }
            }
          }
        },
        "totalPrice": {
          "label": {
            "it": "Prezzo",
            "en": "Price"
          },
          "type": "number",
          "min": 0,
          "visualizationOptions": {
            "hidden": true
          }
        },
        "orderedAt": {
          "label": {
            "it": "Data di ordinazione",
            "en": "Ordered at"
          },
          "type": "string",
          "format": "date-time",
          "dateOptions": {
            "displayFormat": "DD/MM/YYYY HH:mm"
          }
        },
        "formTitle_delivery": {
          "type": "form-addon",
          "format": "title",
          "label": {
            "it": "Informazioni sulla consegna",
            "en": "Delivery information"
          }
        },
        "riderId": {
          "label": "Rider",
          "type": "string",
          "format": "lookup",
          "lookupOptions": {
            "lookupDataSource": "riders",
            "lookupValue": "_id",
            "lookupFields": [
              "name",
              "surname"
            ],
            "lookupDelimiter": " ",
            "lookupAddTrailingSlash": false
          }
        },
        "customerId": {
          "label": {
            "it": "Cliente",
            "en": "Customer"
          },
          "type": "string",
          "format": "lookup",
          "lookupOptions": {
            "lookupDataSource": "customers",
            "lookupValue": "_id",
            "lookupFields": [
              "name",
              "surname"
            ],
            "lookupDelimiter": " ",
            "lookupAddTrailingSlash": true
          }
        },
        "address": {
          "label": {
            "it": "Indirizzo",
            "en": "Address"
          },
          "type": "string",
          "format": "editor"
        },
        "link": {
          "type": "form-addon",
          "format": "link",
          "formLinkOptions": {"href": "https://www.google.com", "target": "_blank"}
        }
      },
      "required": [
        "status",
        "dishes",
        "totalPrice",
        "orderedAt",
        "customerId"
      ]
    },
    "customMessageOnAbsentLookup": {
      "en": "\u26A0 Not found",
      "it": "\u26A0 Non trovato"
    }
  },
  "content": {
    "type": "row",
    "attributes": {
      "style": "height: calc(100vh - 64px);"
    },
    "content": [
      {
        "type": "element",
        "tag": "div",
        "url": "/back-kit/{{BACK_KIT_VERSION}}/bk-web-components.esm.js"
      },
      {
        "type": "element",
        "tag": "bk-microlc-theme-manager",
        "properties": {
          "rootElementSelectors": "microlc-element-composer"
        }
      },
      {
        "type": "row",
        "attributes": {
          "style": "margin: 1vw 2vw 0vh 2vw; align-items: left;"
        },
        "content": [
          {
            "type": "column",
            "content": [
              {
                "type": "element",
                "tag": "bk-navigation-back-arrow",
              },
              {
                "type": "element",
                "tag": "bk-breadcrumbs",
                "attributes": {
                  "style": "margin-left: 2%;"
                },
                "properties": {
                  "dataSchema": {
                    "$ref": "dataSchema"
                  }
                }
              }
            ]
          },
          {
            "type": "column", 
            "attributes": {
              "style": "justify-content: space-between; margin: 1vw 2vw 0vh 2vw; align-items: center;"
            },
            "content": [
              {
                "type": "column",
                "attributes": {
                  "style": "align-items: center;"
                },
                "content": [
                  {
                    "type": "element",
                    "tag": "bk-title",
                    "attributes": {
                      "style": "margin: 0 1vw 0 0;"
                    },
                    "properties": {
                      "content": {
                        "en": "Orders",
                        "it": "Ordini"
                      }
                    }
                  },
                  {
                    "type": "element",
                    "tag": "bk-refresh-button"
                  }
                ]
              },
              {
                "type": "element",
                "tag": "bk-search-bar",
                "properties": {
                  "placeholder": {
                    "en": "Search...",
                    "it": "Cerca..."
                  }
                }
              },
              {
                "type": "column",
                "attributes": {
                  "style": "align-items: center;"
                },
                "content": [
                  {
                    "type": "element",
                    "tag": "bk-add-new-button",
                    "attributes": {
                      "style": "margin: 0 1vw 0 0;"
                    }
                  },
                  {
                    "type": "element",
                    "tag": "bk-add-filter-button"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "column",
        "attributes": {
          "style": "padding: 0 2vw; align-items: center; justify-content: space-between; border-bottom: 1px solid #CDCDCE;"
        },
        "content": [
          {
            "type": "element",
            "tag": "bk-tabs",
            "attributes": {
              "style": "margin-right: 2vw;"
            },
            "properties": {
              "tabs": [
                {
                  "key": "pending",
                  "title": {
                    "en": "Pending",
                    "it": "In attesa"
                  },
                  "filters": [
                    {
                      "property": "status",
                      "operator": "equal",
                      "value": "Pending"
                    }
                  ]
                },
                {
                  "key": "preparing",
                  "title": {
                    "en": "Preparing",
                    "it": "In preparazione"
                  },
                  "filters": [
                    {
                      "property": "status",
                      "operator": "equal",
                      "value": "Preparing"
                    }
                  ]
                },
                {
                  "key": "delivered",
                  "title": {
                    "en": "Delivered",
                    "it": "In consegna"
                  },
                  "filters": [
                    {
                      "property": "status",
                      "operator": "equal",
                      "value": "Delivered"
                    }
                  ]
                },
                {
                  "key": "aborted",
                  "title": {
                    "en": "Aborted",
                    "it": "Annullati"
                  },
                  "filters": [
                    {
                      "property": "status",
                      "operator": "equal",
                      "value": "Aborted"
                    }
                  ]
                }
              ]
            }
          },
          {
            "type": "element",
            "tag": "bk-filters-manager",
            "properties": {
              "filters": []
            }
          }
        ]
      },
      {
        "type": "row",
        "attributes": {
          "style": "flex-grow: 1; position:relative; bottom: 0;"
        },
        "content": [
          {
            "type": "row",
            "attributes": {
              "style": "background-color: #f0f2f5; padding: 2em 4em 0; flex-grow: 1; position:relative; overflow:hidden;"
            },
            "content": [
              {
                "type": "element",
                "tag": "bk-table",
                "properties": {
                  "customMessageOnAbsentLookup": {
                    "$ref": "customMessageOnAbsentLookup"
                  },
                  "dataSchema": {
                    "$ref": "dataSchema"
                  },
                  "rowActions": {
                    "kind": "cta",
                    "actions": [
                      {
                        "label": {
                          "it": "Annulla",
                          "en": "Abort"
                        },
                        "icon": "fas fa-times",
                        "kind": "httpPost",
                        "content": "/lambdas/abort",
                        "requireConfirm": {
                          "cancelText": {
                            "en": "Cancel",
                            "it": "Annulla"
                          },
                          "content": {
                            "en": "You are about to abort the selected order.",
                            "it": "Procedendo con questa operazione, annullerai l'ordine selezionato."
                          },
                          "okText": {
                            "en": "Confirm",
                            "it": "Conferma"
                          },
                          "title": {
                            "en": "Are you sure you want to abort the order?",
                            "it": "Sei sicuro di voler annullare l'ordine?"
                          }
                        },
                        "meta": {
                          "actionId": "abort-order"
                        }
                      }
                    ]
                  },
                  "initialSortDirection": "descend",
                  "initialSortProperty": "orderedAt",
                  "maxLines": 8
                }
              },
              {
                "type": "element",
                "tag": "bk-form-drawer",
                "properties": {
                  "requireConfirm": true,
                  "customMessageOnAbsentLookup": {
                    "$ref": "customMessageOnAbsentLookup"
                  },
                  "width": "560",
                  "dataSchema": {
                    "$ref": "dataSchema"
                  },
                  "customLabels": {
                    "create": {
                      "title": {
                        "en": "Add new",
                        "it": "Aggiungi nuovo"
                      },
                      "ctaLabel": {
                        "en": "Add",
                        "it": "Aggiungi"
                      }
                    },
                    "update": {
                      "title": {
                        "en": "Order detail",
                        "it": "Dettaglio ordine"
                      },
                      "ctaLabel": {
                        "en": "Save",
                        "it": "Salva"
                      }
                    }
                  }
                }
              },
              {
                "type": "element",
                "tag": "bk-filter-drawer",
                "properties": {
                  "dataSchema": {
                    "$ref": "dataSchema"
                  },
                  "width": "560"
                }
              }
            ]
          }
        ]
      },
      {
        "type": "column",
        "attributes": {
          "style": "position: sticky; justify-content: space-between; align-items: center; padding: 1.5em 4em; background-color: white; z-index: 10; bottom: 0; max-height: 5em;"
        },
        "content": [
          {
            "type": "element",
            "tag": "bk-footer",
            "properties": {
              "disableStateChange": true
            }
          },
          {
            "type": "element",
            "tag": "bk-pagination",
            "properties": {
              "pageSizeOptions": [5, 10],
              "pageSize": 5
            }
          }
        ]
      },
      {
        "type": "element",
        "tag": "bk-confirmation-modal"
      },
      {
        "type": "element",
        "tag": "bk-notifications",
        "properties": {
          "rootElementSelectors": "main.micro-lc-layout-content",
          "successEventMap": {
            "create-data": {
              "title": {
                "en": "Success",
                "it": "Successo"
              },
              "content": {
                "en": "Order successfully created",
                "it": "L'ordine è stato creato correttamente"
              },
              "type": "success"
            },
            "update-data": {
              "title": {
                "en": "Success",
                "it": "Successo"
              },
              "content": {
                "en": "Order successfully updated",
                "it": "L'ordine è stato aggiornato correttamente"
              },
              "type": "success"
            },
            "delete-data": {
              "title": {
                "en": "Success",
                "it": "Successo"
              },
              "content": {
                "en": "Order successfully deleted",
                "it": "L'ordine è stato eliminato correttamente"
              },
              "type": "success"
            },
            "abort-order": {
              "title": {
                "en": "Success",
                "it": "Successo"
              },
              "content": {
                "en": "Order successfully aborted",
                "it": "L'ordine è stato cancellato correttamente"
              },
              "type": "success"
            }
          },
          "errorEventMap": {
            "create-data": {
              "title": {
                "en": "Error",
                "it": "Errore"
              },
              "content": {
                "en": "An error occurred during order creation",
                "it": "C'è stato un errore durante la creazione dell'ordine"
              },
              "type": "error"
            },
            "update-data": {
              "title": {
                "en": "Error",
                "it": "Errore"
              },
              "content": {
                "en": "An error occurred during order update",
                "it": "C'è stato un errore durante l'aggiornamento dell'ordine"
              },
              "type": "error"
            },
            "delete-data": {
              "title": {
                "en": "Error",
                "it": "Errore"
              },
              "content": {
                "en": "An error occurred during order deletion",
                "it": "C'è stato un errore durante l'eliminazione dell'ordine"
              },
              "type": "error"
            },
            "abort-order": {
              "title": {
                "en": "Error",
                "it": "Errore"
              },
              "content": {
                "en": "An error occurred during order abort",
                "it": "C'è stato un errore durante la cancellazione dell'ordine"
              },
              "type": "error"
            }
          }
        }
      },
      {
        "type": "element",
        "tag": "bk-crud-client",
        "properties": {
          "basePath": "/v2/orders",
          "bootstrapTimeout": 2000,
          "dataSchema": {
            "$ref": "dataSchema"
          }
        }
      },
      {
        "type": "element",
        "tag": "bk-crud-lookup-client",
        "properties": {
          "basePath": "/v2",
          "dataSchema": {
            "$ref": "dataSchema"
          }
        }
      },
      {
        "type": "element",
        "tag": "bk-state-adapter"
      }
    ]
  }
}
```

:::info
The `element`

```json
{
  "type": "element",
  "tag": "div",
  "url": "/back-kit/{{BACK_KIT_VERSION}}/bk-web-components.esm.js"
}
```

should be included in the configuration file, as it triggers the import of the Back-Kit web components library.
`BACK_KIT_VERSION` indicates the utilized version of Back-Kit.
:::

![Plugin example](img/plugin_with_table.jpg)

### Data flow

Follows a possible stream of data of the plugin resulting from the previous configuration, illustrating some core concepts of how the plugin would work.

Upon loading, the [bk-crud-client](Components/clients#crud-client) component

```json
{
  "type": "element",
  "tag": "bk-crud-client",
  "properties": {
    "basePath": "/v2/orders",
    "bootstrapTimeout": 2000,
    "dataSchema": {
      "$ref": "dataSchema"
    }
  }
}
```

performs an HTTP request for fetching data. If the call is successful, the component organizes the data according to the provided `schema`, and emits a [display-data](events#display-data) event with such data in payload.

The [bk-crud-lookup-client](Components/clients#lookup-client) component

```json
{
  "type": "element",
  "tag": "bk-crud-lookup-client",
  "properties": {
    "basePath": "/v2",
    "dataSchema": {
      "$ref": "dataSchema"
    }
  }
}
```

listens to `display-data`. In conjunction with the data from the payload, it analyzes the `schema`, and particularly fields that have [lookupOptions](page_layout#lookups), and performs HTTP requests for fetching references to third collections, thus managing to solve lookups and multilookups. Then, the component emits a [lookup-data](events#lookup-data) event, containing the lookup data in payload.

The [bk-table](Components/data_visualization#table) component

```json
{
  "type": "element",
  "tag": "bk-table",
  "properties": {
    ...
    "dataSchema": {
      "$ref": "dataSchema"
    },
    ...
  }
}
```

listens to both the `display-data` and the `lookup-data` events, and renders the data in form of a table. `bk-table` has a reference to the `schema`, which allows customizations on how to display the data. For instance, the field `_id`

```json
"_id": {
  ...
  "type": "string",
  "visualizationOptions": {
    "hidden": true
  },
  ...
}
```

will not be included in the table columns, as its `visualizationOptions` have `hidden` set to true.

The user can directly interact with web components in various ways, which may trigger the emition of events and eventually result in HTTP calls, allowing CRUD operations on the data stored in backend.
In the case of `bk-table`, for instance, clicking on a row of the rendered table triggers a [selected-data](events#selected-data) event, with data from the selected row in payload. The [bk-form-drawer](Components/data_manipulation#form-drawer) component

```json
{
  "type": "element",
  "tag": "bk-form-drawer",
  "properties": {
    ...
    "dataSchema": {
      "$ref": "dataSchema"
    },
    ...
  }
}
```

listens to `selected-data` and displays the payload as a form inside a drawer. `bk-form-drawer` also has a reference to the `schema`, which allows customizations on how to display the data.

Combining the events of `bk-table` and `bk-form-drawer`, the user can display part of the data in `bk-table` inside a `bk-form-drawer` component, without any need for imperative calls between the two.

Unless specified differently in configuration, the user is able to edit the fields in the form in `bk-form-drawer` and save the changes. This triggers an [update-data](events#update-data) event, with the updated values in payload, which is listened to by `bk-crud-client`. At this point the `bk-crud-client` converts the event into a HTTP request to update the data on backend-side and makes the call. Depending on the received response, either a [success](events#success) or an [error](events#error) event is emitted.

These two events are listened to by the [bk-notifications](Components/misc#notifications) component

```json
{
  "type": "element",
  "tag": "bk-notifications",
  "properties": {
    "rootElementSelectors": "main.micro-lc-layout-content",
    "successEventMap": {
      "create-data": {
        "title": {
          "en": "Success",
          "it": "Successo"
        },
        "content": {
          "en": "Order successfully created",
          "it": "L'ordine è stato creato correttamente"
        },
        "type": "success"
      },
      "update-data": {
        "title": ...,
        "content": ...,
        "type": "success"
      },
      "delete-data": ...,
      "abort-order": ...
    },
    "errorEventMap": {...}
  }
}
```

which notifies the user of the result of the HTTP request.

This example illustrates the [typical flow of data](data_flow) in a Back-Kit application:

- client components perform business logic, handling interactions with backend resources
- events are the only mean of communication between components. When configuring a SPA, it is crucial to combine components via events
