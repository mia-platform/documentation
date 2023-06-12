---
id: low_code
title: Single View Creator Low Code configuration
sidebar_label: Low Code
---

Low Code Single View Creator is available since version `3.3.0`

Throughout this section, we will make examples based on the `food-delivery` use case and the `sv_customer` Single View. A complete ER schema can be found in the dedicated [section](/fast_data/configuration/config_maps/erSchema.md#real-use-case-example).

Here you can see a visual representation of the ER schema.

![visual representation of the ER schema](../../img/food_delivery_ER_schema.png)


## Single View Key

The configuration contains the `singleViewKey.json` file. This file creates a mapping between the Single View primary field, which is its unique id, and the identifier field of the Projection. 

An example:

```json
{
  "version": "1.0.0",
  "config": {
    "sv_id": "ID_USER"
  }
}
```

where:

- `sv_id` is the name of the Single View primary key 
- `ID_USER` is the identifier field name of the Projection

## ER Schema

For the general rules and guidelines of the ER Schema, check the [dedicated page](/fast_data/configuration/config_maps/erSchema.md).
Let's take an example from the `food-delivery` use case.

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

This means the `pr_reviews` Projection is connected to:

* `pr_registry` through the `rev_to_reg` condition, which means the documents are linked if the registry `ID_USER` field is the same as the reviews `ID_USER` field;
* `pr_dishes` through the `rev_to_dish` condition, which means the documents are linked if the dish `id_dish` field is the same as the reviews `ID_DISH` field;

### Selecting an ER Schema (version `10.6.0` and above)

From version `10.6.0` of the Console, your project might have enabled the possibility to configure ER Schemas with a No Code feature. In that case, the configuration section (where you usually would write the ER Schema) will show a drop down menu where you can select one of the ER Schemas already configured in the [_ER Schemas page_](/fast_data/configuration/config_maps/erSchema.md#use-the-no-code). 

![ER Schema selection with No Code](../../img/single-view-detail-selection-er-schema.png)

After selecting an ER Schema, the next configuration save will generate the Config Map of the ER Schema JSON taken from the one configured in the canvas. From now on, whenever the ER Schema is updated, the Config Map in the Single View Creator will be updated as well.

## Aggregation

This configuration indicates what are the dependencies of the Single View and how to map them to its fields.

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

The Aggregation Configuration can be automatically generated started from an already existing ER Schema, clicking on the dedicated button as you can see in the picture below. It is necessary to specify the base Projection from which the aggregation shall be generated. The base Projection is the Projection that contains the identifier that is used as identifier for the Single View.

<!-- TODO: Update the image -->
![automatic generation of Aggregation](../../img/aggregation-automatic-generation.png)

:::warning
The generated file will have a basic structure but it may not contain all the relationships needed or the desired structure, so please modify it to match the desired needs before using it.
:::

### Updating your aggregation with the No Code

From version `11.3.0` of the console, your project might have active the [No Code Aggregation](../config_maps/aggregation.md#use-the-no-code) to easily create and update the Aggregation for your Single View Creator Service.

The feature will be available in place of the module where to write the `aggregation.json`: selecting a _Single View_ and, after, its attached _Single View Creator_, the `Aggregation` section will include the new feature that simplifies the creation and review of the aggregation. 

The No Code Aggregation works also with existing aggregations, and the [Advanced Mode](../config_maps/aggregation.md#advanced-mode) will allow you to switch to the Code Editor to review the aggregation in its code form.

In case

## Example

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

In this particular case, it means that the Single View Creator will first find all the documents in `pr_allergens_registry` (the `joinDependency`) which match the `reg_to_aller_reg` condition. Here, it means that we are finding the allergen registry entries which are related to a specific user, and we expect to possibly find more than one of these.
Afterwards, for each of the retrieved entries, the mapping will be performed. This means that the mappings that have a config as right-side value will be mapped to an **array** of the resolved dependencies, if the dependency `joinDependency` field is set.

To make things more practical, let's say we have this data:

### pr_registry

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

### pr_allergens_registry

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

### pr_allergens

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

### Update logic

Now, if the eggs description changes, we want the Single View to update.
When the Single View Creator is notified of the change, it will be provided the `USER_ID` of the user that needs changes, in this case `1`.
With that data, it will resolve the `pr_registry` dependency and map all the relative fields.
After that, it will need to resolve the `ALLERGENS` dependency. To do that, it will read the `joinDependency`, and it being `pr_allergens_registry` it will look at the `on` property of the dependency named `pr_allergens_registry`, which is `reg_to_aller_reg`.
It will then get all the `allergens_registry` entries matching the condition (which is the one with `ID_USER` equal to `1`, the id of the Single View to update).
At this point, we have two documents: eggs, and fish. For each of those documents, the mapping will be applied, and the resulting Single View will have its `allergens` field mapped to an array containing those two values.


## Read from multiple database server

In order to read data from multiple databases you need to leverage on custom function from the mapping configuration.  
First of all you need to create a config map and we suggest to create at least two files: one for the database connection and the others for custom functions.  

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

The above code uses the database driver and exports a function to retrieve the connected client.  
This module works like a singleton, indeed the client is created once and the state, e.g. the `connected` variable, lives for the entire duration of the Node.js process (remember that `require` a module is always evaluated once by Node.js).  
Because this is a config map, the `{{MONGODB_URL_2}}` will be interpolated at deploy time. Remember to set it up in the environment variables section.


Then in a custom function file you can retrieve the connected client and use it for reading data:

```javascript
// fieldFromSecondDB.js
const getClient = require('./secondDB.js')

module.exports = async function (logger, db, dependenciesMap){
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
