---
id: configure_single_view_creator
title: Single View Creator
sidebar_label: Configure Single View Creator
---

## Microservice initialization

Each Single View needs a dedicated Microservice. This service will listen on the **Projections changes** that affect the Single View and consequently updates its data. This service is the `Single View Creator`.

To start configuring your own Single View Creator, you have three options:

* Start from the *Single View Creator Template*
* Start from the *Single View Creator Plugin*
* Start from the *Single View Creator - Low Code Plugin*

In this page, we discuss how to configure the Template and the Low Code plugin, while you can find more information about the configuration of the simple Plugin at this [link](../runtime_suite/single-view-creator/configuration).

## Single View Creator Template

### Initialize the service

The service starts in `index.js` file.
First of all, the template uses the [Custom Plugin Lib](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/plugin_baas_4) to instantiate a service.
Inside its callback, the `single-view-creator-lib`  is initialized to deal with the complexity of the Fast Data components.

```js
const singleViewCreator = getSingleViewCreator(log, config, customMetrics)

await singleViewCreator.initEnvironment() // connect Mongo, Kafka and create the patient instance
service.decorate('patient', singleViewCreator.k8sPatient)
```

Where `config` is an object whose fields represent the [Microservice environment variables](../development_suite/api-console/api-design/services.md#environment-variable-configuration).

Some environment variables will be pre-compiled when you create the service from template, others won't, but they will still have a placeholder as value. Replace it with the correct value.

Here some tips:

- `TYPE`: should be the name of the single view which your single view creator is responsible for
- `SINGLE_VIEWS_COLLECTION`: should be the name of the single view which your single view creator is responsible for
- `PROJECTIONS_CHANGES_COLLECTION`: if you have set a custom projection change collection name from advanced, then set its name. Otherwise it is `fd-pc-SYSTEM_ID` where `SYSTEM_ID` is the id of the System of Records this single view creator is responsible for.
- `SINGLE_VIEWS_PORTFOLIO_ORIGIN`: should be equals to the `SYSTEM_ID` you have set in `PROJECTIONS_CHANGES_COLLECTION`
- `SINGLE_VIEWS_ERRORS_COLLECTION`: it is the name of a MongoDB Crud you want to use as collection for single view errors.
- `KAFKA_BA_TOPIC`: topic where to send the `before-after`, which is the single view document before and after a change
- `SEND_BA_TO_KAFKA`: true if you want to send to Kafka the `before-after` information about the update changes of the single view
- `KAFKA_SVC_EVENTS_TOPIC`: topic used to queue Single View Creator state changes (e.g. single view creation)
- `UPSERT_STRATEGIES`: (v3.1.0 or higher of the template) If it is set to "replace", the whole Single View document will be replaced with the new one. If it is set to "update", the existing one will be updated with the new one, but fields not present in the latter will be kept. Default is "replace".

If you do not want to use Kafka in the Single View Creator, you can just not set the environment variable *KAFKA_CLIENT_ID* or *KAFKA_BROKERS_LIST*. If one of them is missing, Kafka will not be configured by the service (requires *single-view-creator-lib* v9.1.0 or higher)


Now, we start the single-view-creator:

```js
const resolvedOnStop = singleViewCreator.startCustom({
  strategy: aggregatorBuilder(projectionsDB),
  mapper,
  validator,
  singleViewKeyGetter: singleViewKey,
  upsertSingleView: upsertFnSv(),
  deleteSingleView: deleteSV(),
})
```

- `strategy` is the function that performs the aggregation over the projections
- `mapper` is the function that takes as input the raw aggregation result and maps the data to the final Single View
- `validator` is the validation function which determines if the Single View is valid (and thus inserted or updated in Mongo) or not (and thus deleted)
- `singleViewKeyGetter` is the function that, given the projections changes identifier, returns the data used as selector to find the single view document on mongo to update or delete
- `upsertFnSv` is the function that updates or inserts the Single View to the Single Views collection on Mongo
- `deleteSingleView` is the function that deletes the Single View from the Single Views collection on Mongo. It's used the `deleteSV` exported by the library.

:::note
The `deleteSV` function makes a *real delete* of the document on MongoDb. So, unlike the **projections** deletion, it does *not* make a virtual delete.
:::

The value of `upsertFnSv` is based on the `UPSERT_STRATEGIES` environment variable. If its value is *update*, then the *updateOrInsertSV* function exported by the library is used, otherwise the function *replaceOrInsertSV* is used instead. The default upsert strategy is *replace*. 

:::note
In the versions of the template prior to the `v3.1.0`, the UPSERT_STRATEGIES was missing and it was used an alias function (*upsertSV*) of the *replaceOrInsertSV*.
:::



The Single View creator needs to be stopped when the process is stopping. To do that, we use the `onClose` hook:

```js
service.addHook('onClose', async() => {
  log.fatal({ type: 'END' }, 'Single View Creator is stopping...')
  await singleViewCreator.stop()

  // this is a promise resolved when the infinite loop which processes the single views ends.
  // Here we wait for the resolving of the promise. You don't need to call it.
  await resolvedOnStop
  log.fatal({ type: 'END' }, 'Single View Creator stopped')
  await mongoClient.close()
})
```

:::info
You can use the template and all the Mia-Platform libraries **only under license**.
For further information contact your Mia Platform referent
:::

:::note
This documentation refers to the `@mia-platform-internal/single-view-creator-lib` ^9.x.x.
:::

The core of your work on this service are the files inside the `src` folder.

**singleViewKey.js**: It takes as input the identifier of the projection change and returns the key object used to select the document of the Single View collection that needs to be updated. This key corresponds to the query object fed to mongodb, therefore you can return any legal mongo query.

In the example below, we expect to have the field `myId` as primary key of the Single View collection.

```js
const get = require('lodash.get')

module.exports = function singleViewKeyGenerator(logger, projectionChangeIdentifier) {
  const IDENTIFIER_KEY = 'UNIQUE_ID'
  
  // get the single view id from the identifier
  const myId = projectionChangeIdentifier[IDENTIFIER_KEY]

  return {
    myId,
  }
}
```

**pipeline.js**: It takes as input a MongoDB instance and returns a function. This function takes as input the projection change identifier and returns an array.

If it is empty, a delete operation will be executed on the single view identified by the `singleViewKeyGenerator` result.
If it is not empty, an upsert operation will be executed on the single view identified by the `singleViewKeyGenerator` result.

:::note
If the pipeline returns an array with more than one element, only the first element will be used for the upsert.
:::

```js
module.exports = (mongoDb) => {
  return async(logger, projectionChangeIdentifier) => {

    const uniqueId = projectionChangeIdentifier.UNIQUE_ID
    const MY_PROJECTION = 'projection-name'

    // retrieve data from all projections you need for your single view
    const projectionCollection = mongoDb.collection(MY_PROJECTION)
    const projectionDataById = await projectionCollection.findOne({
        UNIQUE_ID: uniqueId,
        __STATE__: 'PUBLIC'
    })

    if (!projectionDataById) {
      // it's expected to be a delete
      logger.debug({ UNIQUE_ID: uniqueId }, 'single view public data not found')
      return []
    }
    const singleViewData = projectionDataById
    logger.debug({ singleViewData }, 'single view retrieved data')

    return [
      singleViewData,
    ]
  }
}
```

**mapper.js**: It is a function that takes as argument the first element (if defined) of the result of the pipeline, and returns an object containing the value updated for the single view. The object returned should match the schema of the single view.

```js
module.exports = (logger, singleViewData) => {
  const { UNIQUE_ID, NAME } = singleViewData

  return {
    myId: UNIQUE_ID,
    name: NAME,
  }
}
```

Inside the mapper a renaming and repositioning of the fields can be applied.

:::note
We suggest to implement inside the mapper all the aggregation logic that can be reused for all the clients that will read the Single Views, they should be as generic as possible.
It is a good practice to have some calculation and aggregation logic inside Single View Creator as far as it is reusable.
If you have to apply some custom logic try to do it inside and API Adapter specific for the client.
:::

### Validate a Single View

The `startCustom` function accepts a function in the configuration object called `validator`, which is the validation function.

The validation of a Single View determines what to do with the current update. If the single  view is determined as "non-valid", the delete function will be called. Otherwise, if the result of the validation is positive, it will be updated or inserted in the Single Views collection, through the upsert function. Delete function and upsert function will be explained in the next paragraph.

For this reason, the validation procedure should not be too strict, since a Single View declared as "invalid" would not be updated or inserted to the database. Rather, the validation is a check operation to determine if the current Single View should be handled with the upsert or delete functions.

By default, in this template we set as validator a function that returns always true. So we accept all kinds of single views, but, if you need it, you can replace that function with your own custom validator.

The input fields of the validation function are the logger and the Single View, while the output is a boolean containing the result of the validation.

```js
function singleViewValidator(logger, singleView) {
  ... checks on singleView

  // returns a boolean
  return validationResult
}
```

### Customize Upsert and Delete functions

If you want, you can replace both upsert and delete functions with your own custom functions to perform those operations.

These functions represents the last step of the creation (or deletion) of a Single View, in which the Single View collection is actually modified.

In case the validation is succeeded, the upsert function will be called with the following arguments:

- `logger` is the logger
- `singleViewCollection` is the the Mongo collection object
- `singleView` is the result of the mapping operation
- `singleViewKey` is the Single View key

On the other hand, if the validation has a negative result, the delete function will be called with the same arguments, except for the `singleView`, which will not be handled by the delete function.

In both cases, some operation should be done on `singleViewCollection` in order to modify the Single View with the current `singleViewKey`, with the idea of "merging" the current result with the one already present in the database.

For example, we have a Customer Single View with a list of products the customer bought from different e-commerce and we receive an update for a new object on a specific shop, in that case we don't want to replace the list of bought products with the last one arrived but we want to push the product in the list in order to have the complete history of purchases.

For both functions, the output is composed of an object containing two fields:

- `old` which contains the old Single View
- `new` which contains the new Single View

These values will be the respectively the `before` and `after` of the message sent to the `KAFKA_BA_TOPIC` topic, that is the topic responsible for tracking any result of the Single View creator.

```js
async function upsertSingleViewFunction(
  logger,
  singleViewCollection,
  singleView,
  singleViewKey)
{
  logger.trace('Upserting Single View...')
  const oldSingleView = await singleViewCollection.findOne(singleViewKey)

  await singleViewCollection.replaceOne(
    singleViewKey,
    singleView,
    { upsert: true }
  )

  logger.trace({ isNew: Boolean(oldSingleView) }, 'Updated Single View')
  return {
    old: oldSingleView,
    new: singleView,
  }
}

async function deleteSingleViewFunction(
  logger,
  singleViewCollection,
  singleViewKey)
{
  logger.trace('Deleting Single View...')
  const oldSingleView = await singleViewCollection.findOne(singleViewKey)

  if (oldSingleView !== null) {
    try {
      await singleViewCollection.deleteOne(singleViewKey)
    } catch (ex) {
      logger.error(`Error during Single View delete: ${ex}`)
    }
  }

  logger.trace('Single view deletion procedure terminated')
  return {
    old: oldSingleView,
    new: null,
  }
}
```

### Error handling

When generating a Single View, every error that occurs is saved in MongoDb, with a format that satisfies the schema requirements of the crud service, so that you can handle those errors using the Console. The fields of the error messages when they are first created are:

- `_id`: a unique identifier of the record, automatically generated
- `portfolioOrigin`: a value concerning the origin of the error, defaults to `UNKNOWN_PORTFOLIO_ORIGIN`
- `type`: the Single View type
- `identifier`: id of the projection changes
- `errorType`: the error details
- `createdAt`: time of creation
- `creatorId`: set to `single-view-creator`
- `__STATE__`: set to `PUBLIC`
- `updaterId`: set to `single-view-creator`
- `updatedAt`: time of creation

It is highly recommended to use a TTL index to enable the automatic deletion of older messages, which can be done directly using the Console, as explained [here](../../docs/development_suite/api-console/api-design/crud_advanced.md#indexes).



## Single View Creator - Low Code Plugin

This plugin is a specialized version of the Single View Creator plugin that you can find at this [link](../runtime_suite/single-view-creator/configuration), they are both based on the same dockerImage. The main difference is that the Low Code Plugin is already configured to be used with JSON configurations instead of javascript code.

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

![visual representation of the ER schema](./img/food_delivery_ER_schema.png)

### Configuration Files

There are two main configuration files that you need to provide to the Plugin:

1. ErSchema
2. Configuration

When you add the Microservice from the Marketplace, the configMaps and the relative files will be already created, and you only need to insert the content.

#### ER Schema

The Entity-Relation Schema defines the relation between the documents of the System of Records, by means of directed links from one document to another, that can have one or more conditions. An example of a correct ER is presented next:

```json
{
  "version": "N.N.N",
  "config": {
    "SOURCE_DOCUMENT": {
      "outgoing": {
        "DESTINATION_DOCUMENT": {
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

#### Configuration

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

##### Dependencies

Dependencies have two properties:

* `type`: either `projection` or `config`
* `on`: either `_identifier` or some condition defined in the ER Schema.

If the dependency is of type `projection` and the `on` field is set to `_identifier`, then the data will be retrieved from the document with the matching identifier.
If the `on` property of a `projection` dependency is set to another string, then it is checked against the condition in the ER Schema that has the same name.

If the dependency is of type `config` it will not have an `on` field, and instead the whole configuration will be defined in the JSON file, using the same structure as the one in `SV_CONFIG`.

##### Mapping

Each entry in the mapping has the following syntax:

```json
"singleViewFieldName": "value"
```

Where value can be one of:

* **projection field**: when it is a field taken from a projection listed in the dependency, expressed with dot notation `"newField": "DOCUMENT_NAME.field"`
* **configuration**: when a field is an object corresponding to a resolved config dependency, expressed with the dependency name `"newField": "CONFIG_NAME"`
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


##### Join Dependency

When you want to map a single view field to an array of value as usual happens in 1:N relations, you can use a config dependency with a `joinDependency` field. This means when the config will be calculated, the `joinDependency` will be computed first, retrieving a list of all the matching documents, then for each of those elements the configuration mapping will be applied, resulting in an array of elements, each having the same layout as the one specified in the config mapping.

#### Example

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

##### pr_registry

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

##### pr_allergens_registry

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

##### pr_allergens

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

##### Update logic

Now, if the eggs description changes, we want the single view to update.
When the single view creator is notified of the change, it will be provided the `USER_ID` of the user that needs changes, in this case `1`.
With that data, it will resolve the `pr_registry` dependency and map all the relative fields.
After that, it will need to resolve the `ALLERGENS` dependency. To do that, it will read the `joinDependency`, and it being `pr_allergens_registry` will look at the `on` property of the dependency named `pr_allergens_registry`, which is `reg_to_aller_reg`.
It will then get all the `allergens_registry` entries matching the condition (which is the one with `ID_USER` equal to `1`, the id of the single view to update).
At this point, we have two documents: eggs, and fish. For each of those documents, the mapping will be applied, and the resulting single view will have its `allergens` field mapped to an array containing those two values.

### Environment variables

After you have finished writing your configuration files, the Single View Creator is almost ready to be used, but first you need to assign a value to the environment variables. You can find information about them [here](../runtime_suite/single-view-creator/configuration), as they the simple Single View Creator Plugin is based on the same dockerImage of the Low Code one.
