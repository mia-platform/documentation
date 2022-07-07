---
id: low-code-configuration
title: Single View Creator Low Code configuration
sidebar_label: Low Code configuration
---

This plugin is a specialized version of the Single View Creator plugin that you can find at this [link](../../runtime_suite/single-view-creator/configuration), they are both based on the same dockerImage. The main difference is that the Low Code Plugin is already configured to be used with JSON configurations instead of javascript code.

Low Code Single View Creator is available since version `3.3.0`

Throughout this section, we will make examples based on the `food-delivery` use case, in particular to the `sv_customer` single view. A complete ER schema is presented below, but you should only need the relevant parts presented in the paragraphs where they are mentioned.

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
                "id_restaurant": "id_restaurant"
              }
            }
          }
        },
        "pr_orders_dishes": {
          "conditions": {
            "dish_to_order_dish": {
              "condition": {
                "ID_DISH": "id_dish"
              }
            }
          }
        },
        "pr_reviews": {
          "conditions": {
            "dish_to_rev": {
              "condition": {
                "ID_DISH": "id_dish"
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
                "ID_ORDER": "ID_ORDER"
              }
            }
          }
        },
        "pr_dishes": {
          "conditions": {
            "order_dish_to_dish": {
              "condition": {
                "id_dish": "ID_DISH"
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
                "ID_ORDER": "ID_ORDER"
              },
              "oneToMany": true
            }
          }
        },
        "pr_registry": {
          "conditions": {
            "order_to_reg": {
              "condition": {
                "ID_USER": "ID_USER"
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
                "id_restaurant": "id_restaurant"
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
                "id_allergen": "ID_ALLERGEN"
              }
            },
          }
        },
        "pr_registry": {
          "conditions": {
            "aller_reg_to_reg": {
              "condition": {
                "ID_USER": "ID_USER"
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
                "ID_ALLERGEN": "id_allergen"
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
                "ID_USER": "ID_USER"
              },
              "oneToMany": true
            }
          }
        },
        "pr_reviews": {
          "conditions": {
            "reg_to_rev": {
              "condition": {
                "ID_USER": "ID_USER"
              },
              "oneToMany": true
            }
          }
        },
        "pr_allergens_registry": {
          "conditions": {
            "reg_to_aller_reg": {
              "condition": {
                "ID_USER": "ID_USER"
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
                "ID_USER": "ID_USER"
              }
            }
          }
        },
        "pr_dishes": {
          "conditions": {
            "rev_to_dish": {
              "condition": {
                "id_dish": "ID_DISH"
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

![visual representation of the ER schema](../img/food_delivery_ER_schema.png)

## Configuration Files

There are three main configuration files that you need to provide to the Plugin:

1. Configuration
2. ErSchema
3. Aggregation

When you add the Microservice from the Marketplace, the configMaps and the relative files will be already created, and you only need to insert the content.

### Configuration

The configuration contains the `singleViewKey.json` file. The input of this configuration is the projection changes identifier and the output is the query to be applied on the Single View. 

To use the configuration, a mapping between the identifier field and the single view field is needed.
An example:

```json
{
  "version": "1.0.0",
   "config": {"sv_id": "ID_USER"}
}
```

where:

- `sv_id` is the name of the single view's key 
- `ID_USER` is the field's name inside the identifier

### ER Schema

The Entity-Relation Schema defines the relation between the collections of the System of Records, by means of directed links from one collection to another, that can have one or more conditions. An example of a correct ER is presented next:

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

Let us take an example from the `food-delivery` use case.

```json
{
  ....,
  "pr_reviews": {
    "outgoing": {
      "pr_registry": {
        "conditions": {
          "rev_to_reg": {
            "condition": {
              "ID_USER": "ID_USER"
            }
          }
        }
      },
      "pr_dishes": {
        "conditions": {
          "rev_to_dish": {
            "condition": {
              "id_dish": "ID_DISH"
            }
          }
        }
      }
    }
  }
```

This means the `pr_reviews` projection is connected to:

* `pr_registry` through the `rev_to_reg` condition, which means the documents are linked if the registry `ID_USER` field is the same as the reviews `ID_USER` field;
* `pr_dishes` through the `rev_to_dish` condition, which means the documents are linked if the dish `id_dish` field is the same as the reviews `ID_DISH` field;

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

Some more complex condition is showcased next:

```json
...
"CONSTANT_CONDITION": {
  "condition": {
    "DESTINATION_FIELD_NAME": "__constant__[CONSTANT_VALUE]"
  }
},
"MONGO_OPERATOR_CONDITION": {
  "condition": {
    "$or": [
      {
        "DESTINATION_FIELD_NAME_2": "SOURCE_FIELD_NAME_2"
      },
      {
        "DESTINATION_FIELD_NAME_3": "__constant__[ANOTHER_CONSTANT_VALUE]"
      }
    ]
  }
}
...
```

### Aggregation

Once you have the ER schema set up, you are ready to describe how to build your single view.

The `configuration` indicates what are the dependencies of the single view and how to map them to its fields.

An example of a minimal configuration is as follows:

```json
{
  "version": "1.0.0",
  "config": {
    "SV_CONFIG": {
      "dependencies": {
        "DOCUMENT_NAME": {
          "type": "projection",
          "on": "_identifier"
        }
      },
      "mapping": {
        "newField": "DOCUMENT_NAME.field"
      }
    }
  }
}
```

The `SV_CONFIG` field is mandatory, as it is the starting point of the configuration of the Single View.

#### Dependencies

Dependencies have two properties:

* `type`: either `projection` or `config`
* `on`: either `_identifier` or some condition defined in the ER Schema.

If the dependency is of type `projection` and the `on` field is set to `_identifier`, then the data will be retrieved from the document with the matching identifier.
If the `on` property of a `projection` dependency is set to another string, then it is checked against the condition in the ER Schema that has the same name.

If the dependency is of type `config` it will not have an `on` field, and instead the whole configuration will be defined in the JSON file, using the same structure as the one in `SV_CONFIG`.

#### Mapping

Each entry in the mapping has the following syntax:

```json
"singleViewFieldName": "value"
```

Where value can be one of:

* **projection field**: when it is a field taken from a projection listed in the dependency, expressed with dot notation `"newField": "DOCUMENT_NAME.field"`
* **configuration**: when a field is an object corresponding to a resolved config dependency, expressed with the dependency name `"newField": "CONFIG_NAME"`
* **constant**: when using the constant syntax already seen in the ER diagram, e.g. `__string__[hello]`, `__integer__[42]`, `__boolean__[true]`
* **function result**: when using a custom function to compute the value of the single view field, expressed with this syntax: `"fromFileField": "__fromFile__[fileName]"`

For functions, the specified file must be added in a configmap with the correct name, and must contain a default exported function, which will be used to compute the value of the field.

The following parameters will be passed to each function:

* **logger**: the logger instance used by the service,
* **db**: the instance of mongoDB used by the service,
* **dependenciesMap**: a Map containing all the dependencies already loaded in the service memory.

Let's see an example of custom function.

```js

async function myOwnCustomLogic (value) {
  // some custom logic
}

module.exports = async function(logger, clientMongo, dependenciesMap) {

    // access the order already got from the dependenciesMap
    const order = dependenciesMap.get("pr_orders")
    
    const fiscalCode = await clientMongo.collection('users').findOne({userId: order.id}).fiscalCode
    const result = await myOwnCustomLogic(fiscalCode)
    return {
      surname: result.surname,
      code: result.code
    }
}
```

The dependenciesMap offers a `get` method to access the dependencies already solved using the name of the dependency itself.

If the dependency you require is a projection, the value returned will be the document of the projection, otherwise if it's a config will be the array of document resulting from the configuration.

If the dependencies has not been resolved, for example due to a reference which failed because of a missing document, the value will be falsy in case of projections and an empty array in case of config.

:::warning
You are supposed to access the dependenciesMap **only** in read-only mode.
Write access to the dependenciesMap are **not** officially supported and could be removed at any time.
:::

#### Join Dependency

When you want to map a single view field to an array of value as usual happens in 1:N relations, you can use a config dependency with a `joinDependency` field. This means when the config will be calculated, the `joinDependency` will be computed first, retrieving a list of all the matching documents, then for each of those elements the configuration mapping will be applied, resulting in an array of elements, each having the same layout as the one specified in the config mapping.

#### Advanced options

Basic options are simple and meant for streamlined use cases, however, sometimes the need for more complex logic in the creation of the single view arises, and in those scenarios you can take advantage of our advanced options, starting from Aggregation configuration version `1.1.0` and Single View Creator service version `v3.6.0`
We introduce these options by showing the use case they solve.

##### Using the same Projection as a Dependency multiple times under different conditions

When listing dependencies, it is mandatory that each dependency has a different name, as its name is used to identify it. When it comes to config, this is not a problem, as you can name a config dependency as you wish, but it is different when we need to deal with projections.

For example, how would we describe a single view of users that need to have their partner as a field? For this case we must have two references:

- a reference to the **users** that is based on their identifier to get the core of the single view 
- a reference to a **user**, that is based on some condition linked to the marriage

For this example, we will consider the following ER Schema

```json
{
   "version":"1.0.0",
   "config":{
      "PEOPLE":{
         "outgoing":{
            "MARRIAGE":{
               "conditions":{
                  "PEOPLE_TO_MARRIAGE":{
                     "condition":{
                        "a":"id"
                     }
                  }
               }
            }
         }
      },
      "MARRIAGE":{
         "outgoing":{
            "PEOPLE":{
               "conditions":{
                  "MARRIAGE_a_TO_PEOPLE":{
                     "condition":{
                        "id":"a"
                     }
                  },
                  "MARRIAGE_b_TO_PEOPLE":{
                     "condition":{
                        "id":"b"
                     }
                  }
               }
            }
         }
      }
   }
}
```

If we tried to solve the problem without advanced options, we would write a **wrong** configuration like the following:

:::warning
The configuration below is incorrect, and presented only to clearly show the need and flexibility of aliases. Do not use this kind of configuration.
:::

```json
{
   "version":"1.1.0",
   "config":{
      "SV_CONFIG":{
         "dependencies":{
            "PEOPLE":{
               "type":"projection",
               "on":"_identifier"
            },
            "MARRIAGE":{
               "type":"projection",
               "on":"PEOPLE_TO_MARRIAGE"
            },
            "PEOPLE":{
               "type":"projection",
               "on":"MARRIAGE_b_TO_PEOPLE"
            }
         },
         "mapping":{
            "name":"PEOPLE.name",
            "marriedWith":"PEOPLE.name"
         }
      }
   }
}
```

This is incorrect, because there is ambiguity about which `PEOPLE` dependency to use in the mapping.

You can solve this problem using the `aliasOf` option, which allows using a different name for a dependency of type `projection`. When using `aliasOf: 'PROJECTION_NAME'`, the named dependency is linked to that projection.

Now that the `aliasOf` option is clear, we can have a look at the following configuration, which solves the problem in the example:

```json
{
   "version":"1.1.0",
   "config":{
      "SV_CONFIG":{
         "dependencies":{
            "PEOPLE":{
               "type":"projection",
               "on":"_identifier"
            },
            "MARRIAGE":{
               "type":"projection",
               "on":"PEOPLE_TO_MARRIAGE"
            },
            "PARTNER":{
               "type":"projection",
               "aliasOf":"PEOPLE",
               "on":"MARRIAGE_b_TO_PEOPLE"
            }
         },
         "mapping":{
            "name":"PEOPLE.name",
            "marriedWith":"PARTNER.name"
         }
      }
   }
}
```

As you can see, we used the same projection two times, under different conditions: the first time we matched the record based on its identifier (`PEOPLE` dependency, without alias), the second time we matched the record based on the `MARRIAGE_b_TO_PEOPLE` condition (`PARTNER` dependency, with alias).

You can reference a dependency under alias also in another dependency, with the `useAlias` option. Since `CHILD_TO_MOTHER` refers to the ER-Schema, which uses only the projections name and not the dependencies name, you need to use `useAlias` to specify which is the specific dependency that refers to the projection of the relation you want to use.
If we needed to use the `PARTNER` dependency as a base for another dependency (for example, if we are looking for the mother in law), a valid configuration would be:

```json
...
"PARTNER":{
  "type":"projection",
  "aliasOf":"PEOPLE",
  "on":"MARRIAGE_b_TO_PEOPLE"
},
"MOTHER_IN_LAW":{
  "type":"projection",
  "useAlias":"PARTNER",
  "on":"CHILD_TO_MOTHER",
  "aliasOf":"PEOPLE"
}
...
```

Note that we used `aliasOf` inside the `MOTHER_IN_LAW` dependency as well because we wanted to keep on using the same base projection, but it is not mandatory, as long as you are using another projection that is not declared elsewhere in the dependencies.

##### Changing the query that finds the Projection based on their identifier

Sometimes, when writing a dependency of a projection that is matched on its `_identifier`, we find that the identifier has more fields than we want, or has fields with different names, which makes the automatic query mapping result in no documents found.
In this scenario, you can employ the `identifierQueryMapping` option, which provides a new query mapping for the identifier of a projection, allowing you to have a custom way of matching documents based on their identifier.

In particular, there are two main cases when this could come in handy:

1. renaming fields for querying
2. reducing the number of fields to query on

:::info
Most of the time you will not face these scenarios, and most likely that will only happen if you use some advanced configuration.
:::

Renaming fields can be required when you want to achieve a high level of decoupling, so you avoid using the document identifier key, but instead you use a more explicit name, for example instead of `"id"` you might want to use `"my_single_view_id"`, because this clearly shows what this `"id"` refers to.
An identifier with that logic would be:

```json
{
  "my_single_view_id": "12345"
}
```

This would not match a document without a field named `my_single_view_id`. In that case, you could map that in the aggregation config in the following way:

```json
...
"PROJECTION_NAME": {
  "on": "_identifier",
  "identifierQueryMapping": {
    "id": "_identifier.my_single_view_id"
  }
}
...
```

Reducing the number of fields to query on will help you if you have a custom function for the generation of the projections changes, which also includes additional fields. For example, if you need to generate a single view in a different way based on a flag in the identifier. An identifier could have a value like the following:

```json
{
  "the_id": "12345",
  "special": "true"
}
```

The `"special"` field is not part of the single document we want to find, but it is used elsewhere in the single view creation. To avoid having queries that do not find any element, we can map the identifier like that:

```json
...
"PROJECTION_NAME": {
  "on": "_identifier",
  "identifierQueryMapping": {
    "the_id": "_identifier.the_id"
  }
}
...
```

:::caution
Remember that for `identifierQueryMapping` to be used, you still need to explicitly set the `on` field of the dependency to `_identifier`, otherwise it will not be considered valid.
:::

##### Using conditional expressions on dependencies definitions and mappings

Dependencies are a way to gather data that will be used in the mapping section, creating the single view, and as single views grow in complexity, you might need to use conditional expressions to use different dependencies configurations and/or change the mapped output of a single view.

If you have not had this necessity yet, this might be somewhat abstract, so we will directly dive into an example.

We have a System of Records that consists of multiple projections about jobs, one for each different job. For example, we have `DOCTOR` and `FIREFIGHTER`. If you want to create a `USER` single view which has the information coming from its job projection, you need a way to get a dependency which is either a `DOCTOR` or a `FIREFIGHTER`.
A naive solution could be just putting both projections as dependencies and using both of them in the mapping. This would cause the single view to have two different `firegither` and `doctor` fields, one of them undefined, which is clearly not ideal.

Thanks to the `_select` option, we can create a `JOB` dependency, which will use the `DOCTOR` *or* `FIREFIGHTER` projection based on the value of another field, as shown below:

```json
{
   "version":"1.1.0",
   "config":{
      "SV_CONFIG":{
         "dependencies":{
            "USER":{
               "type":"projection",
               "on":"_identifier"
            },
            "JOB_DESCRIPTION":{
               "type":"projection",
               "_select":{
                  "options":[
                     {
                        "when":{
                           "==":[
                              "USER.job",
                              "__string__[doctor]"
                           ]
                        },
                        "value":{
                           "aliasOf":"DOCTOR",
                           "on":"USER_to_DOCTOR"
                        }
                     },
                     {
                        "when":{
                           "==":[
                              "USER.job",
                              "__string__[firefighter]"
                           ]
                        },
                        "value":{
                           "aliasOf":"FIREFIGHTER",
                           "on":"User_to_FIREFIGHTER"
                        }
                     }
                  ],
                  "default":{
                     "aliasOf":"DOCTOR",
                     "on":"USER_to_DOCTOR"
                  }
               }
            }
         },
         "mapping":{
            "name":"USER.name",
            "job":{
               "type":"JOB_DESCRIPTION.type",
               "role":"JOB_DESCRIPTION.role"
            }
         }
      }
   }
}
```

As you can see, the `_select` option has a long set of rules, which we are going to break down here.

The `_select` is a way of providing one of many different configurations for a specific dependency, based on some conditions.
Each possible configuration is an object in the `options` array. If none of the `options` has a matching condition, the value in the `default` field is used.
Each option has two fields:

1. `when`: the condition that must be matched in order to use the `value`;
2. `value`: the configuration that will be used for this dependency if the `when` condition is met.

The `when` field is an object with an operator (available operators: `==`, `!=`, `>`, `<`, `>=`, `<=`) as a field key, and its relative field value is an array of operands.
For example, using the equality operator, we can write this condition:

```json
"when":{
  "==":[
    "USER.job",
    "__string__[firefighter]"
  ]
}
```

Here, the first operand is a variable which takes its value from `USER.job`, while the second operand is a constant string: `"doctor"`. This simply means that this condition will match when the `job` field of the `USER` dependency is equal to `"doctor"`.
This pattern is repeated for all other operators, as they are binary as well.

The `value` field is an object with exactly the same structure as a regular dependency, as it will be used as a dependency after the condition is met.

For **mappings**, the process of taking advantage of `_select` is very similar: each field in the mapping can be expressed as an object  with a `_select` field that follows the same rules. Just keep in mind that the `value` here is not a dependency (with fields such as `type` and `on`), but a field of a dependency (e.g. `MY_DEPENDENCY.field_name`).

##### Null value inside conditional expression

From version `3.10.0` of the Single View Creator, logic expressions now accept `null` as a value:

```json
...
"withNull": {
  "_select": {
    "options": [
      {
        "when": {
          "==": [
            "JOB.age",
            null
          ]
        },
        "value": "__string__[unknown]"
      }
    ],
    "default": "__string__[foobar]"
  }
}
...
```

##### Set resolution order of dependencies

From version `4.1.0` of the Single-View-Creator, the resolution order of dependencies can be set with the field `dependencyOrder` inside the aggregation file:

```json
{
  "version": "1.1.0",
  "config": {
    "SV_CONFIG": {
      "dependencies": {
        "PEOPLE": {
          "type": "projection",
          "on": "_identifier"
        },
        "PARTNER": {
          "type": "projection",
          "aliasOf": "PEOPLE",
          "on": "MARRIAGE_TO_PEOPLE"
        },
        "MARRIAGE": {
          "type": "projection",
          "on": "PEOPLE_TO_MARRIAGE"
        },
        "CHILDREN_CONF": {
          "type": "config"
        }
      },
      "dependencyOrder": ["PEOPLE", "MARRIAGE", "PARTNER", "CHILDREN_CONF"],
      "mapping": {
        "name": "PEOPLE.name",
        "marriedWith": "PARTNER.name",
        "children": "CHILDREN_CONF"
      }
    }
  },
  "CHILDREN_CONF": {
    ...
  }
}
```

The aggregation above will be performed in the following order:

1. Find the projection in the `PEOPLE` collection on MongoDB using `identifier` got from the Projection Change as query.
1. Find the projection in the `MARRIAGE` collection on MongoDB using the condition defined in the ER Schema as `PEOPLE_TO_MARRIAGE`
1. Find the projection in the `PEOPLE` (which is the collection to be used in the dependency `PARTNER`) using the condition defined in the ER Schema as `MARRIAGE_TO_PEOPLE` 
1. Calculate the aggregation defined in the `CHILDREN_CONF` config

*Why should I care about the order resolution of the dependencies?*

The order resolution is important for the correctness of the aggregation since each step of the aggregation may use documents of the previous steps. Hence, if the order of the dependencies resolution is not correct, the single view resulting from the aggregation will probably be wrong.

:::note
Since version `v5.0.0` of Single View Creator service returning a single view with the field `__STATE__` from the aggregation will update the Single View to that state (among the others changes).   
This means, for instance, that if you set the `__STATE__` to `DRAFT` in the `aggregation.json` the single view updated will have the __STATE__ equals to `DRAFT`. 
Previously, the `__STATE__` you returned was ignored, and the Single View would always have the __STATE__ equals to `PUBLIC`.
:::

### Example

Let's take a look at a simplified version of the `sv_customer` configuration in the `food-delivery` use case:

```json
{
  "version": "1.0.0",
  "config": {
    "SV_CONFIG": {
      "dependencies": {
        "pr_registry": {
          "type": "projection",
          "on": "_identifier"
        },
        "ALLERGENS": {
          "type": "config"
        },
        ...
      },
      "mapping": {
        "idCustomer": "pr_registry.ID_USER",
        "taxCode": "pr_registry.TAX_CODE",
        "name": "pr_registry.NAME",
        "surname": "pr_registry.SURNAME",
        "email": "pr_registry.EMAIL",
        "allergens": "ALLERGENS",
        ...
      }
    },
    "ALLERGENS": {
      "joinDependency": "pr_allergens_registry",
      "dependencies": {
        "pr_allergens_registry": {
          "type": "projection",
          "on": "reg_to_aller_reg"
        },
        "pr_allergens": {
          "type": "projection",
          "on": "aller_reg_to_aller"
        }
      },
      "mapping": {
        "id": "pr_allergens_registry.ID_ALLERGEN",
        "comments": "pr_allergens_registry.COMMENTS",
        "description": "pr_allergens.description"
      }
    },
    ...
  }
}
```

In this configuration, the user is matched with its allergies. To do so, two dependencies are used:

* `pr_registry` of type `projection`
* `ALLERGENS` of type `CONFIG`

The `pr_registry` dependency is used in the mapping to retrieve the relevant user information for the user with the matching identifier.

The `ALLERGENS` dependency is mapped to an `allergens` field, and its value is defined in the `ALLERGENS` configuration, right below the `SV_CONFIG` object. Inside this configuration, we find some `projection` dependencies based on configurations described in the ER schema.
To understand how the mapping happens, it is important to take a look at the `joinDependency` property of the configuration, which tells us that the `pr_allergens_registry` table is the one used as base for finding the other documents.

In this particular case, it means the single view creator will first find all the documents in `pr_allergens_registry` (the `joinDependency`) which match the `reg_to_aller_reg` condition. Here, it means we are finding the allergen registry entries which are related to a specific user, and we expect to possibly find more than one of these.
Afterwards, for each of the retrieved entries, the mapping will be performed. This means the mappings that have a config as right-side value will be mapped to an **array** of the resolved dependencies, if the dependency `joinDependency` field is set.

To make things more practical, let's say we have this data:

#### pr_registry

```json
{
  "ID_USER": "1",
  "TAX_CODE": "123",
  "NAME": "John",
  "SURNAME": "Doe",
  "EMAIL": "john.doe@mail.com",
},
{
  "ID_USER": "2",
  "TAX_CODE": "123",
  "NAME": "Jane",
  "SURNAME": "Doe",
  "EMAIL": "jane.doe@mail.com",
},
...
```

#### pr_allergens_registry

```json
{
    "ID_ALLERGEN": "eggs",
    "ID_USER": "1",
    "COMMENTS": "only allergic to raw eggs"
},
{
    "ID_ALLERGEN": "fish",
    "ID_USER": "1",
    "COMMENTS": "allergic to all fish"
},
...
```

#### pr_allergens

```json
{
    "id_allergen": "eggs",
    "description": "insert description"
},
{
    "id_allergen": "fish",
    "description": "insert description"
},
...
```

#### Update logic

Now, if the eggs description changes, we want the single view to update.
When the single view creator is notified of the change, it will be provided the `USER_ID` of the user that needs changes, in this case `1`.
With that data, it will resolve the `pr_registry` dependency and map all the relative fields.
After that, it will need to resolve the `ALLERGENS` dependency. To do that, it will read the `joinDependency`, and it being `pr_allergens_registry` will look at the `on` property of the dependency named `pr_allergens_registry`, which is `reg_to_aller_reg`.
It will then get all the `allergens_registry` entries matching the condition (which is the one with `ID_USER` equal to `1`, the id of the single view to update).
At this point, we have two documents: eggs, and fish. For each of those documents, the mapping will be applied, and the resulting single view will have its `allergens` field mapped to an array containing those two values.

### Read from multiple database on the same server

In order to read data from multiple database you need to leverage on custom function from the mapping configuration.  
Make sure your service user has permission to read data from the other database.  

First of all create a custom function file as configMap where you access to the database you need by selecting it via `.db('database-name')`:

```javascript
// fieldFromSecondDB.js
module.exports = async function (logger, clientMongo, dependenciesMap){
    return clientMongo.db('my-second-db-name').collection('collection').findOne();
}
```

Then you can use the custom function in the mapping configuration:

```json
{
   "version":"1.1.0",
   "config":{
      "SV_CONFIG":{
         "dependencies":{
            "PEOPLE":{
               "type":"projection",
               "on":"_identifier"
            },
            "MARRIAGE":{
               "type":"projection",
               "on":"PEOPLE_TO_MARRIAGE"
            },
            "PEOPLE":{
               "type":"projection",
               "on":"MARRIAGE_b_TO_PEOPLE"
            }
         },
         "mapping":{
            "name":"PEOPLE.name",
            "marriedWith":"PEOPLE.name",
            "fieldFromSecondDB":"__fromFile__[fieldFromSecondDB]"
         }
      }
   }
}
```

### Read from multiple database server

In order to read data from multiple database you need to leverage on custom function from the mapping configuration.  
First of all you need to create a configMap and we suggest to create at least two files: one for the database connection and the others for the custom functions.  

The connection file could be like the following:

```javascript
// secondDB.js
const { MongoClient } = require('mongodb');

const url = '{{MONGODB_URL_2}}';
const client = new MongoClient(url);

let connected = false

module.exports = async function (){
    if (!connected) {
        await client.connect();
        connected = true
    }
    return client
}
```

The above code uses the database driver and exports a function to retrive the connected client.  
This module works like a singleton, indeed the client is created once and the state, e.g. the `connected` variable, lives for the entire duration of the nodejs process (remember that `require` a module is always evaluated once by nodejs).  
Because this is a configMap, the `{{MONGODB_URL_2}}` will be interpolated at deploy time. Remember to set it up in the environment variables section.


Then in a custom function file you can retrive the connected client and use it for reading data:

```javascript
// fieldFromSecondDB.js
const getClient = require('./secondDB.js')

module.exports = async function (logger, clientMongo, dependenciesMap){
    const client = await getClient()
    return client.db().collection('collection').findOne();
}
```

Finally you can use the custom function in the mapping configuration:

```json
{
   "version":"1.1.0",
   "config":{
      "SV_CONFIG":{
         "dependencies":{
            "PEOPLE":{
               "type":"projection",
               "on":"_identifier"
            },
            "MARRIAGE":{
               "type":"projection",
               "on":"PEOPLE_TO_MARRIAGE"
            },
            "PEOPLE":{
               "type":"projection",
               "on":"MARRIAGE_b_TO_PEOPLE"
            }
         },
         "mapping":{
            "name":"PEOPLE.name",
            "marriedWith":"PEOPLE.name",
            "fieldFromSecondDB":"__fromFile__[fieldFromSecondDB]"
         }
      }
   }
}
```

## Environment variables

After you have finished writing your configuration files, the Single View Creator is almost ready to be used, but first you need to assign a value to the environment variables. You can find information about them [here](../../runtime_suite/single-view-creator/configuration), as the simple Single View Creator Plugin is based on the same docker image of the Low Code one.
