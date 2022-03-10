---
id: configuration
title: Real-Time Updater Configurations
sidebar_label: Configuration
---

The Real-Time Updater could be configured in two different ways:

- Manual configuration: recommended for tailored configurations. It uses custom environment variables and custom JavaScript configuration files to work
- Low Code configuration: recommended for quicker configurations. It uses json files and the environment variables are already set with correct default values.

## Manual configuration

### Environment variables

- LOG_LEVEL (__required__): defines the level of the logger  
- MONGODB_URL (__required__):  defines the mongodb url to contact  
- PROJECTIONS_DATABASE_NAME (__required__): defines the name of the projections database  
- PROJECTIONS_CHANGES_COLLECTION_NAME (__required__): defines the name of the projections changes collection  
- PROJECTIONS_CHANGES_ENABLED: defines whether you want to generate projections changes, default is **true**,
- LC39_HTTP_PORT (__required__): defines the lc39 http port
- STRATEGIES_MAX_EXEC_TIME_MS (__required__): defines the maximum time for which a strategy is executed
- KAFKA_BROKERS (__required__): defines the kafka brokers
- KAFKA_GROUP_ID (__required__): defines the kafka group id
- KAFKA_SASL_USERNAME (__required__): defines the kafka sasl username
- KAFKA_SASL_PASSWORD (__required__): defines the kafka sasl password
- LIVENESS_INTERVAL_MS (__required__) defines the liveness interval in milliseconds
- INVARIANT_TOPIC_MAP (__required__): defines an object that maps the topic to the projection
- KAFKA_USE_LATEST_DEQUEUE_STRATEGY:  defines latest dequeue strategy or not
- KAFKA_ADAPTER_FOLDER: defines the path to the kafka adapter folder
- CAST_FUNCTIONS_FOLDER: defines the path to the cast-functions folder
- MAP_TABLE_FOLDER: defines the path to the map table folder
- STRATEGIES_FOLDER: defines the path to the strategies folder
- KAFKA_SASL_MECHANISM: defines the authentication mechanism. It can be one of: `plain`, `scram-sha-256` or `scram-sha-512`. The default value is `plain`
- USE_UPSERT: defines whether to use upsert or not when performing insert and update operations. Defaults to true
- KAFKA_MESSAGE_ADAPTER: defines which Kafka message adapter to use. Its value can be one of the following: `basic`, `golden-gate`, `custom`.
- KAFKA_PROJECTION_CHANGES_FOLDER: path where has been mounted the `kafkaProjectionChanges.json` configuration (v3.4.0 or above).
- GENERATE_KAFKA_PROJECTION_CHANGES: defines whether the projection changes have to be send to Kafka too or not. Default is `false`(v3.4.0 or above).
- KAFKA_CONSUMER_MAX_WAIT_TIME: defines the maximum waiting time of Kafka Consumer for new data in batch. Default is 500 ms.
- COMMIT_MESSAGE_LOGGING_INTERVAL: specify the interval in *ms* of logging the info that messages have been committed. Default is 3000.

### Custom Projection Changes Collection

You can choose to use a collection you have already created in the CRUD section.  

In order to do that, your collection is supposed to have the following fields (apart from the default ones):

```json
[
    {"name":"type","type":"string","required":false,"nullable":false},
    {"name":"changes","type":"Array_RawObject","required":false,"nullable":false},
    {"name":"identifier","type":"RawObject","required":true,"nullable":false},
    {"name":"doneAt","type":"Date","required":false,"nullable":false}
]
```

You also need to have the following additional indexes:

Add an index with *name* `type_change_state`, *type* `normal`, *unique* `false`.  
You need to add the following index fields:

- *name* `type`, *order* `ASCENDENT`
- *name* `changes.state`, *order* `ASCENDENT`

Add another index with *name* `type_identifier`, *type* `normal`, *unique* `true`.  
You need to add the following index fields:

- *name* `type`, *order* `ASCENDENT`
- *name* `identifier`, *order* `ASCENDENT`

After that, you need to set your collection as the one to be used by the Real-Time Updater. To do so, set the name of the collection you want to use as value of the `PROJECTIONS_CHANGES_COLLECTION_NAME` environment variable of the service.

### Configuration files

The Real-Time Updater accepts the following configurations:

#### KAFKA_ADAPTER configurations

The mount path used for these configurations is: `/home/node/app/configurations/kafkaAdapterFolder`.  
This folder contains the configurations for your kafka adapters.

#### Kafka messages format

In the Fast Data architecture CDC, iPaaS, APIs and sFTP publish messages on Kafka topic to capture change events. However, these messages could be written in different formats.
The purpose of the Kafka adapter is allowing the correct reading of these messages in order to be properly consumed by the Real Time Updater.

Once you have created a System, you need to select the format of the Kafka messages sent from the system.
To do that, you must correctly configure the Kafka Message Adapter, changing the value of the Real Time Updater's KAFKA_MESSAGE_ADAPTER environment variable, which should be one of the following: `basic`, `golden-gate`, `custom`.

Another option that you should be aware of when thinking about the format of your Kafka messages is the "upsert" or "insert".
By default, the real-time-updater will perform upsert operations, but you can optionally decide to perform inserts that will fail if the document already exists, instead of updating it.

:::info
The console already provides supports for Snappy compressed messages, for further information check [Snappy compression](../setup_fast_data.md#snappy-compression)
:::

#### Basic

It's the default one.

The `timestamp` of the Kafka message has to be a stringified integer greater than zero. This integer has to be a valid timestamp.
The `key` of the Kafka message has to be a stringified object containing the primary key of the projection, if `value` also contains the primary key of the projection this field can be an empty string.
The `value` is **null** if it's a *delete* operation, otherwise it contains the data of the projection.
The `offset` is the offset of the kafka message.

Example of a delete operation

```
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: null
timestamp: '1234556789'
offset: '100'
```

Example of an upsert:

```
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: `{"NAME": 456}`
timestamp: '1234556789'
offset: '100'
```

#### Golden Gate

The `timestamp` of the Kafka message is a stringified integer greater than zero. This integer has to be a valid timestamp.  
The `offset` is the offset of the kafka message.
The `key` can have any valid Kafka `key` value.  
The `value` of the Kafka message instead needs to have the following fields:

* `op_type`: the type of operation (`I` for insert , `U` for update, `D` for delete).
* `after`: the data values after the operation execution (`null` or not set if it's a delete)
* `before`: the data values before the operation execution (`null` or not set if it's an insert)

Example of `value` for an insert operation:

```JSON
{
  'table': 'MY_TABLE',
  'op_type': 'I',
  'op_ts': '2021-02-19 16:03:27.000000',
  'current_ts': '2021-02-19T17:03:32.818003',
  'pos': '00000000650028162190',
  'after': {
    'USER_ID': 123,
    'FISCAL_CODE': 'the-fiscal-code-123',
    'COINS': 300000000,
  },
}
```

#### Custom

If you have Kafka Messages that do not match one of the formats above, you can create your own custom adapter for the messages.
To do that, you need to create a `Custom Kafka Message Adapter`, which is just a javascript function able to convert to Kafka messages as received from the real-time updater to an object with a specific structure.

:::note
You have to create the adapter function *before* setting `custom` in the advanced file and saving.
:::

This adapter is a function that accepts as arguments the kafka message and the list of primary keys of the projection, and returns an object with the following properties:

* **offset**: the offset of the kafka message
* **timestampDate**: an instance of `Date` of the timestamp of the kafka message.
* **keyObject**: an object containing the primary keys of the projection. It is used to know which projection document needs to be updated with the changes set in the value.
* **value**: the data values of the projection, or null
* **operation**: optional value that indicates the type of operation (either `I` for insert, `U` for update, or `D` for delete). It is not needed if you are using an upsert on insert logic (the default one), while it is required if you want to differentiate between insert and update messages.

If the `value` is null, the operation is supposed to be a delete.
The `keyObject` **cannot** be null.

In order to write your custom Kafka message adapter, first clone the configuration repository: click on the git provider icon in the right side of the header (near to the documentation icon and user image) to access the repository and then clone it.

Your adapter function file needs to be created below a folder named `fast-data-files`, if your project does not have it, create it.
In this folder, create a folder named as `kafka-adapters/SYSTEM ID` (replacing *SYSTEM ID* with the system id set in Console). Inside this folder create your javascript file named `kafkaMessageAdapter.js`.

For instance if you want to create an adapter for the system `my-system` you need to create the following directory tree:

```txt
/configurations
    |-- fast-data-files
        |-- kafka-adapters/
              |-- my-system/
                    |-- kafkaMessageAdapter.js
```

The file should export a simple function with the following signature:

```js
module.exports = function kafkaMessageAdapter(kafkaMessage, primaryKeys, logger) {
  const {
    value: valueAsBuffer, // type Buffer
    key: keyAsBuffer, // type Buffer
    timestamp: timestampAsString, // type string
    offset: offsetAsString, // type string
    operation: operationAsString // type string
  } = kafkaMessage

  // your adapting logic

  return {
    keyObject: keyToReturn, // type object (NOT nullable)
    value: valueToReturn, // type object (null or object)
    timestampDate: new Date(parseInt(timestampAsString)), // type Date
    offset: parseInt(offsetAsString), // type number
    operation: operationToReturn, // type string (either I, U, or D)
  }
}
```

The `kafkaMessage` argument is the kafka message as received from the `real-time-updater`.  
The fields `value` and `key` are of type *Buffer*, `offset` and `timestamp` are of type *string*.

The `primaryKeys` is an array of strings which are the primary keys of the projection whose topic is linked.

Once you have created your own custom adapter for the Kafka messages, commit and push to load your code on git.
Now you need to go on the Console and save in order to generate the configuration for your `Real Time Updater` service that uses the adapter you created.

:::note
After any changes you make on the `adapter` implementation, you need to save from the Console to update the configuration of the services.
:::

Now that you have committed and pushed your custom adapter function you can set `custom` in the advanced file and save.

```json
{
  "systems": {
    "SYSTEM ID": {
      "kafka": {
          "messageAdapter": "custom"
      }
    }
  }
}
```

### CAST_FUNCTION configurations

The mount path used for these configurations is: `/home/node/app/configurations/castFunctionsFolder`.  
In this folder you have all the generated [Cast Functions](../cast_functions) definitions.

#### STRATEGIES configuration

The default mount path used for these configuration is: `/home/node/app/configurations/strategies`.  
In this folder you have all the generated [Strategies](../single_view#strategies) which you have defined in your gitlab project inside the `fast-data-files/strategies` directory.

#### MAP_TABLE configurations

The mount path used for these configurations is: `/home/node/app/configurations/mapTableFolder`.  
Two mappings will be placed in this folder: one between cast functions and fields and another one between strategies and projections.

An example:

```json
{
    "projection-name": {
        "destination": "projection-name",
        "conversion": {
            "UNIQUE_ID": {
                "fieldName": "UNIQUE_ID",
                "cast": "__fromFile__[defaultCastToString]"
            },
            "NAME": {
                "fieldName": "NAME",
                "cast": "__fromFile__[defaultCastToString]"
            },
            "ADDRESS": {
                "fieldName": "ADDRESS",
                "cast": "__fromFile__[defaultCastToString]"
            }
        },
        "fieldsInKey": ["UNIQUE_ID"],
        "changes": {
            "sv_single_views": "__fromFile__[getIdUniqueFromSingleView]"
        }
    }
}
```

### Kafka Projection Changes configuration

Projection changes are saved on mongo, but from version v3.4.0 and above, you can send them to Kafka as well.

This feature enables you to send the projection changes to a topic kafka you want to. This is useful if you want to have an history of the projection changes thanks to the Kafka retention of messages.
You can also make your own custom logic when a projection change occurs by setting a Kafka consumer attached to the topic kafka you set.

:::info
This feature is available from the version v3.4.0 or above of the service
:::

To do that, you need to set two environment variables:

- `KAFKA_PROJECTION_CHANGES_FOLDER`: path where has been mounted the `kafkaProjectionChanges.json` configuration (v3.4.0 or above).
- `GENERATE_KAFKA_PROJECTION_CHANGES`: defines whether the projection changes have to be sent to Kafka too or not. Default is `false`(v3.4.0 or above).

You have to create a *configuration* with the same path as the one defined by the environment variable `KAFKA_PROJECTION_CHANGES_FOLDER`.
Then, you have to create a configuration file `kafkaProjectionChanges.json` inside that configuration. The configuration is a json file like the following one:

```json
{
    "MY_PROJECTION": {
        "projectionChanges": {
            "MY_SINGLE_VIEW": {
                "topic": "MY_TOPIC",
            }
        }
    }
}
```

where:

- `MY_PROJECTION` is the name of the collection whose topic has received the message from the CDC.
- `MY_SINGLE_VIEW` is the single view that have to be updated
- `MY_TOPIC` is the topic where the projection change need to be sent

Example:

```json
{
    "registry-json": {
        "projectionChanges": {
            "sv_pointofsale": {
                "topic": "my-project.development.sv-pointofsale-pc-json",
            }
        }
    },
    "another-projection": {
        "projectionChanges": {
            "sv_customer": {
                "topic": "my-project.development.sv-customer-pc-json"
            }
        }
    }
}
```

When a message about `registry-json` happens, the projection changes will be saved on mongo and it will be sent to the Kafka topic `my-project.development.sv-pointofsale-pc-json` as well.

### Tracking the changes

From the **v3.2.0** of the Real-Time Updater, inside the Projections and Projection Changes additional information about the Kafka message that triggered the Real-Time Updater are saved. This allows you to track the changes made as consequence of a Kafka message.

In particular, the following information are saved:

#### Projection changes

Into each element of the `changes` array of the projection change document are inserted the information about the message that triggered the projection change

- topic: is the topic from which the Kafka message has been consumed
- partition: is partition from which the Kafka message has been consumed
- offset: is the offset of the message
- key: is the key of the Kafka message
- timestamp: is the timestamp of the message

Example:

```json
{
    "type": "sv_pointofsale",
    "identifier": {
        "ID_USER": "123",
    },
    "changes": [{
        "state": "NEW",
        "topic": "my-topic.development.foobar-json",
        "partition": 0,
        "timestamp": "2021-11-19T16:22:07.031Z",
        "offset": "14",
        "key": {
            "ID_USER": "123",
        },
    }],
}
```

#### Projection

Into the projection is saved information about the last Kafka message that updated the projection.
These information are saved inside a field named `__internal__kafkaInfo` in order to prevent collision with others projection fields.

The information saved are:

- topic: is the topic from which the Kafka message has been consumed
- partition: is partition from which the Kafka message has been consumed
- offset: is the offset of the message
- key: is the key of the Kafka message
- timestamp: is the timestamp of the message

Example:

```json
{
    "ID_USER": "123",
    "ADDRESS": "address_1",
    "SURNAME": "ROSSI",
    "TAX_CODE": "tax_code",
    "__STATE__": "PUBLIC",
    "createdAt":  "2021-10-19T13:39:47.589Z",
    "timestamp": "2021-11-19T16:22:07.031Z",
    "updatedAt": "2021-11-19T16:22:07.052Z",
    "__internal__kafkaInfo": {
        "topic": "my-topic.development.foobar-json",
        "partition": 0,
        "timestamp": "2021-11-19T16:22:07.031Z",
        "offset": "14",
        "key": {
            "ID_USER": "123",
        },
    }
}
```

### Prevent projection to be overwritten

During a rebalancing or a massive initial load with multiple replicas of the real time updater, a batch of old messages that have not been committed yet could be read by the real time updater. In fact, Kafka ensures that messages are received, in order, at least once.

To prevent that old messages that have already updated the projection, overwrite the projection again, you can set the environment variable `FORCE_CHECK_ON_OFFSET` to `true`.

This setting is **strongly** recommended when you have both insert/update and delete operations.

:::caution
In future versions of the Real-Time Updater this feature will be turned on as default, with no chance of turning off.
At the moment, you can keep it turned off just to be able to adapt your services in case they need some fix.
:::

### Kafka group rebalancing behavior

If a Kafka group rebalancing happens after that a projection has already been updated, projection changes will be generated anyway and the Real Time updater will still try to commit though.

:::note
This behavior has been introduced from v4.0.0 and above. In previous versions instead, a rebalancing check was made after each operation, and when it happened, th service would stop without generating any projection change.
:::

## Low Code Configuration

Here, low-code specific configuration will be described. All of the previous documentation regarding generic real time updater features are still valid and applicable.

Low Code Real Time Updater is available since version `4.2.0`

### Environment variables

If the System of Records has been created using the automatic configuration, the Real-Time updater has all the environments variables already prepared.

:::info
You can quickly convert a System of Record from Manual to Low code by changing the `USE_AUTOMATIC_STRATEGIES` to true. Then, you should follow the next steps to set up you Fast Data Low Code project properly.
:::

:::warning
When you create a new configmap, remember to use the same Mount Path of your environment variables `STRATEGIES_FOLDER`, `ER_SCHEMA_FOLDER`, `PROJECTION_CHANGES_FOLDER`
:::

### Projection Changes Collection

Differently from the Manual Configuration, the projection changes configurations are described with a json file aimed to reduce the developing effort.

A single view example:

```json
{
    "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487",
    "taxCode": "tax_code",
    "name": "MARIO",
    "surname": "ROSSI",
    "email": "email_mario",
    "address": "address_1",
    "telephone": "phone_number_1000",
    "allergens": [{
        "id": "eggs",
        "comments": "this is another comment change",
        "description": "it works!!! OK"
    }]
    "__STATE__": "PUBLIC"
}

```

The data of this single view comes from 3 projections:

- `pr_registry`: which contains users personal data
- `pr_allergens`: which contains allergens details
- `pr_allergens_registry`: that is the table which describes the relationship between users and allergens

Given that `idCustomer` and `ID_USER` are the same, the single view is focused on the user. For this reason if an allergen is updated, it will be necessary to identify all the users affected by this change in order to revise the single view.

Therefore, we know that if `pr_allergens` changes, the path to update the single view is: `pr_allergens` -> `pr_allergens_registry` -> `pr_registry`.

This configuration is described with the `projectionChangesSchema.json`:

```json
{
  "version": "1.0.0",
  "config": {
    "sv_customers": {
      "paths": [
        {
          "path": [ "pr_allergens", "pr_allergens_registry", "pr_registry"],
          "identifier": {
            "ID_USER": "ID_USER"
          }
        }
      ]
    }
  }
}
```

The `version` field holds the current configuration version, which determines the syntax and semantics of the rest of the configuration. For version `1.0.0` these are the fields and their meaning, all inside the `config` field:

- `sv_customers`: it is the single view name
- `paths`: it is the path list that can update the single view
- `path`: it is the single path
- `identifier`: it defines the projection changes identifier, where `ID_USER` is the name of the field which contains the primary key in the collection `pr_registry`.

:::info
Given the `pr_allergens` → `pr_allergens_registry` → `pr_registry` path, both paths `pr_allergen_registry` → `pr_registry` and `pr_registry` are sub-paths of the first one. You can avoid the definition of the sub-paths because they will be automatically recognized.
:::

:::warning
If [automatic aggregation](../create_sv.md#link-projections-to-the-single-view) is used, the reference object key (in this case `ID_USER`) is required to have the same name as the projection changes identifier, which is the starting point of the aggregation.
Otherwise, if the automatic aggregation is not used, it is possible naming the key as preferred coherently with the `singleViewKey.js` and `mapper.js` file in the [Single View Creator](./../configure_single_view_creator).
It is possible to write the `projectionChangesSchema.json` in ConfigMaps&Secret area of the [Automatic Single view Plugin](../configure_single_view_creator.md#configuration-files).
:::

At the end of the configuration be sure to register the projection in the Strategies page of your single view:

- Go to single view page
- Click on Strategies
- Add the projection with the newly defined strategies if they do not already exist
- Click on the checkbox for the automatic strategies management

### Configuration files

For Automatic Real-Time Updater `kafka_adapter`, `map_table` and `cast_function` are configured by Mia-Platform console. However, it is fundamental defining the `erSchema.json` to describe the strategies path.

#### ER schema configuration

When creating a low code system, its service will have a link to the `er-schema` configmap. If other microservices already had this configmap they will share it with the new real time updater. If you do not make changes to default configmaps of low code real time updaters you will have all of them sharing the same Er schema.

The `erSchema.json` defines the relationship between tables and projections.

This is an example:

![visual representation of the ER schema](../img/food_delivery_ER_schema.png)

The relationships shown in the graph are described by a file called `erSchema.json` which has the following jsonSchema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": {
      "type": "string"
    },
    "config": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "outgoing": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "conditions": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "condition": {
                        "type": "object",
                        "additionalProperties": true
                      },
                      "oneToMany": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "condition"
                    ]
                  }
                }
              },
              "required": [
                "conditions"
              ]
            }
          }
        },
        "required": [
          "outgoing"
        ]
      }
    }
  },
  "required": [
    "version",
    "config"
  ]
}
```

Look at this example:

```json
{
  "version": "1.0.0",
  "config": {
    "pr_dishes": {
      "outgoing": {
        "pr_orders_dishes": {
          "conditions": {
            "dish_to_order_dish": {
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
        }
      }
    }
  }
}
```

Here `pr_orders_dishes` is connected to :

- `pr_orders` through: `{“ID_ORDER”: “ID_ORDER”}` which represents the field of the collection `pr_orders`.
- `pr_dishes` through: `{“id_dish”: “ID_DISH”}` which represents the the field of the collection `pr_orders_dishes`, where `Id_dish` and `ID_DISH` are fields of `pr_dishes` and `pr_orders_dishes` respectively.

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

- `__string__[]` which considers the value as a string.
- `__integer__[]` which considers the value as an integer.
- `__boolean__[]` which considers the value as a boolean.
- `__constant__[]` which considers the value as a string (deprecated).

:::warning
If table A is connected to table B in the ER Schema you have to describe the relationship between A -> B **and** B-> A
:::

#### Custom path of strategies

If you need to handle by hand a specific strategies you have two choice:

- you write your own strategy function. In this case you have to write the whole strategy by your own
- you can let the Low Code to handle the initial path of the strategy, and then make it execute your own custom function to handle it from here on out

To do that you have to specify in the `projectionChanges.json` that the __identifier__ will be handled "from file", which is your custom file that exports your custom function. The syntax is **__fromFile__[myCustomFunction]**.

Let's see it in the configuration file below:

```json
{
  "version": "1.0.0",
  "config": {
    "sv_users": {
      "paths": [
        {
          "path": [ "pr_products", "pr_companies", "pr_registry"],
          "identifier": {
            "ID_USER": "ID_USER"
          }
        },
        {
          "path": [ "pr_selling", "pr_clients"],
          "identifier": "__fromFile__[myCustomFunction]"
        }
      ]
    }
  }
}
```

What will happen when the second path will be cross is that the path pr_selling -> pr_clients will be passed through automatically. Once the real-time updater will have reached the projection pr_clients, it will invoke your function myCustomFunction so that you can make your own custom logic.
The custom function have to match the following signature:

```js

async function myCustomFunction (logger, mongodbInstance, document)
```

The returning value of the function have to be an array of object representing the identifiers of the strategy.

Let's see an example of custom function:

```js

async function someCustomLogin (value) {
  // some custom logic
}

module.exports = async function myCustomFunction (logger, mongodbInstance, document) {
  const query = {
    $or: [
      {
        F_C: document.FISCAL_CODE,
        IS_OK: document.AUTHORIZED
      },
      {
        F_C: document.FISCAL_CODE,
        WAITING_LIST: true
      }
    ]
  }
  const documentFound = await mongodbInstance.collection('users').findOne(query)
  const response = await someCustomLogin(documentFound)
  return [{
    name: documentFound.NAME,
    idUser: documentFound.ID_USER
  }]
}
```
