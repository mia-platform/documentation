---
id: erSchema
title: ER Schema Configuration
sidebar_label: ER Schema
---

<head>
   <meta name="robots" content="noindex, nofollow" />
</head>

In this document we guide you through the configuration of the ER Schema, one of the configuration files required by the [Single View Creator](../architecture.md#single-view-creator-svc), [Real Time Updater](../architecture.md#real-time-updater-rtu) and [Single View Trigger](../architecture.md#single-view-trigger-svt) in a low-code situation.

## Overview

The Entity-Relation Schema defines the relation between the collections of the [System of Records](../the_basics.md#system-of-records-sor), by means of directed links from one collection to another, that can have one or more conditions

## Syntax

An example of a correct ER is presented next:

```json
{
  "version": "N.N.N",
  "config": {
    "SOURCE_COLLECTION": {
      "outgoing": {
        "DESTINATION_COLLECTION": {
          "conditions": {
            "CONDITION_NAME": {
              "condition": {
                "DESTINATION_FIELD_NAME": "SOURCE_FIELD_NAME"
              },
              "oneToMany": true
            }
          }
        }
      }
    }
  }
}
```

The `version` field holds the current configuration version, which determines the syntax and semantics of the rest of the configuration. For version `1.0.0` these are the fields and their meaning:

* The config field holds the ER schema itself, as detailed below
* The source document is one of the documents of the System of Records. The ER schema should have one different field for each document of the System.
* Each source document has an `outgoing` property that lists all of the destination documents related to the source one.
* Each destination document has a series of conditions that determine whether two documents should be matched or not.
* Each condition has a name and checks the destination fields against the source fields or some constants. Conditions can use **mongo operators** too (e.g. `$or`, `$and`, and  `$gt`).
* The `oneToMany` field of a condition specifies whether the source document can have a relation with only one document (in case of `false`) or with multiple documents (in case of `true`) of the target collection. By default, it is set to false (if the field is completely missing).

It is possible to define a constant value in order to validate the condition, for example:

```json
"pr_dishes": {
  "outgoing": {
    "pr_orders_dishes": {
      "conditions": {
        "dish_to_order_dish": {
          "condition": {
            "ID_DISH": "__string__[testID]"
          }
        }
      }
    }
  }
}

```

In this case the condition will always be verified if `“ID_DISH“` is equal to `“testID“`.
The types of constants that are supported are:

* `__string__[]` which considers the value as a string.
* `__integer__[]` which considers the value as an integer.
* `__boolean__[]` which considers the value as a boolean.
* `__constant__[]` which considers the value as a string (deprecated).

:::caution
Remember that `__constant__[]` is deprecated, and it will be removed in future versions. Use `__string__[]` instead.
:::

## Real use case example

<details><summary>food delivery ER schema configuration</summary>
<p>

```json
{
  "version": "1.0.0",
  "config": {
    "pr_dishes": {
      "outgoing": {
        "pr_restaurants": {
          "conditions": {
            "dish_to_rest": {
              "condition": {
                "dish_restaurant_id": "id_restaurant"
              }
            }
          }
        },
        "pr_orders_dishes": {
          "conditions": {
            "dish_to_order_dish": {
              "condition": {
                "dish_order_id": "id_dish"
              }
            }
          }
        },
        "pr_reviews": {
          "conditions": {
            "dish_to_rev": {
              "condition": {
                "review_dish_id": "id_dish"
              }
            }
          }
        }
      }
    },
    "pr_orders_dishes": {
      "outgoing": {
        "pr_orders": {
          "conditions": {
            "order_dish_to_order": {
              "condition": {
                "order_id": "id_order_dish"
              }
            }
          }
        },
        "pr_dishes": {
          "conditions": {
            "order_dish_to_dish": {
              "condition": {
                "id_dish": "dish_order_id"
              }
            }
          }
        }
      }
    },
    "pr_orders": {
      "outgoing": {
        "pr_orders_dishes": {
          "conditions": {
            "order_to_order_dish": {
              "condition": {
                "id_order_dish": "ID_ORDER"
              },
              "oneToMany": true
            }
          }
        },
        "pr_registry": {
          "conditions": {
            "order_to_reg": {
              "condition": {
                "ID_USER": "order_user_id"
              }
            }
          }
        }
      }
    },
    "pr_restaurants": {
      "outgoing": {
        "pr_dishes": {
          "conditions": {
            "res_to_dish": {
              "condition": {
                "id_restaurant": "dish_restaurant_id"
              }
            }
          }
        }
      }
    },
    "pr_allergens_registry": {
      "outgoing": {
        "pr_allergens": {
          "conditions": {
            "aller_reg_to_aller": {
              "condition": {
                "id_allergen": "ID_ALLERGEN_REGISTRY"
              }
            },
          }
        },
        "pr_registry": {
          "conditions": {
            "aller_reg_to_reg": {
              "condition": {
                "ID_USER": "ID_USER_REGISTRY"
              }
            }
          }
        }
      }
    },
    "pr_allergens": {
      "outgoing": {
        "pr_allergens_registry": {
          "conditions": {
            "aller_to_aller_reg": {
              "condition": {
                "ID_ALLERGEN_REGISTRY": "id_allergen"
              }
            }
          }
        }
      }
    },
    "pr_registry": {
      "outgoing": {
        "pr_orders": {
          "conditions": {
            "reg_to_order": {
              "condition": {
                "ID_USER_ORDER": "ID_USER"
              },
              "oneToMany": true
            }
          }
        },
        "pr_reviews": {
          "conditions": {
            "reg_to_rev": {
              "condition": {
                "ID_USER_REVIEW": "ID_USER"
              },
              "oneToMany": true
            }
          }
        },
        "pr_allergens_registry": {
          "conditions": {
            "reg_to_aller_reg": {
              "condition": {
                "ID_USER_REGISTRY": "ID_USER"
              },
              "oneToMany": true
            }
          }
        }
      }
    },
    "pr_reviews": {
      "outgoing": {
        "pr_registry": {
          "conditions": {
            "rev_to_reg": {
              "condition": {
                "ID_USER": "ID_USER_REVIEW"
              }
            }
          }
        },
        "pr_dishes": {
          "conditions": {
            "rev_to_dish": {
              "condition": {
                "id_dish": "review_dish_id"
              }
            }
          }
        }
      }
    }
  }
}
```
</p>
</details>

Here you can see a visual representation of the ER schema.

![visual representation of the ER schema](../../img/food_delivery_ER_schema.png)