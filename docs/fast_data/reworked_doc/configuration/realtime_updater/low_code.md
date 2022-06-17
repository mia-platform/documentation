---
id: low_code
title: Real-Time Updater Low Code configuration
sidebar_label: Low Code
---

Here, low-code specific configuration will be described. All the documentation regarding generic real time updater features in the manual configuration are still valid and applicable.

Low Code Real Time Updater is available since version `4.2.0`

## Environment variables

If the System of Records has been created using the automatic configuration, the Real-Time updater has all the environments variables already prepared.

:::info
You can quickly convert a System of Record from Manual to Low code by changing the `USE_AUTOMATIC_STRATEGIES` to true. Then, you should follow the next steps to set up you Fast Data Low Code project properly.
:::

:::warning
When you create a new configmap, remember to use the same Mount Path of your environment variables `STRATEGIES_FOLDER`, `ER_SCHEMA_FOLDER`, `PROJECTION_CHANGES_FOLDER`
:::

For the Automatic Real-Time Updater the `kafka_adapter`, `map_table` and `cast_function` variables are configured by the Mia-Platform console. However, it is fundamental to define the `erSchema.json` to describe the strategies' path.

### ER schema configuration

When creating a low code system, its service will have a link to the `er-schema` configmap. If other microservices already had this configmap they will share it with the new real time updater. If you do not make changes to the default configmaps of low code real time updaters you will have all of them sharing the same Er schema.

The `erSchema.json` configmap defines the relationship between tables and projections.

[Here](../erSchema.md) you can find a deep explanation of how ER Schema configuration works.

### Projection Changes Schema

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
        "description": "this is the description"
    }]
    "__STATE__": "PUBLIC"
}

```

The data of this single view comes from 3 projections:

- `pr_registry`: which contains users personal data
- `pr_allergens`: which contains allergens details
- `pr_allergens_registry`: that is the table which describes the relationship between users and allergens

Given that `idCustomer` and `ID_USER` are the same, the single view is focused on the user. For this reason if an allergen is updated, it will be necessary to identify all the users affected by this change in order to revise the single view.

Therefore, we know that if `pr_allergens` changes, the path to update the single view is: `pr_allergens` → `pr_allergens_registry` → `pr_registry`.

This configuration is described with the `projectionChangesSchema.json`:

```json title="projectionChangesSchema.json"
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
If [automatic aggregation](../single_view_creator/low_code.md) is used, the reference object key (in this case `ID_USER`) is required to have the same name as the projection changes identifier, which is the starting point of the aggregation.
Otherwise, if the automatic aggregation is not used, it is possible naming the key as preferred coherently with the `singleViewKey.js` and `mapper.js` file in the [Single View Creator](../single_view_creator/manual.md).
It is possible to write the `projectionChangesSchema.json` in `ConfigMaps & Secret` area of the [Automatic Single view Plugin](../single_view_creator/low_code.md).
:::

At the end of the configuration be sure to register the projection in the Strategies' page of your single view:

- Go to single view page
- Click on Strategies
- Add the projection with the newly defined strategies if they do not already exist
- Click on the checkbox for the automatic strategies management

#### Custom path of strategies

If you need to manually handle specific strategies you have two choices:

- You can write your own strategy function. In this case you have to write the whole strategy on your own
- You can let the Low Code handle the initial path of the strategy, and then make it execute your own custom function to handle it from there

To do that you have to specify in the `projectionChangesSchema.json` that the **identifier** will be handled "from file", which is your custom file that exports your custom function. The syntax is `__fromFile__[myCustomFunction]`.

Let's see it in the configuration file below:

```json title="projectionChangesSchema.json"
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

What will happen when the second path will be cross is that the path pr_selling → pr_clients will be passed through automatically. Once the real-time updater will have reached the projection pr_clients, it will invoke your function myCustomFunction so that you can make your own custom logic.
The custom function has to match the following signature:

```js

async function myCustomFunction (logger, mongodbInstance, document)
```

The value returned by the function has to be an array of objects representing the identifiers of the strategy.

Let's see an example of a custom function:

```js

async function someCustomLogin (value) {
  // som"id": "fast_data/reworked_doc/configuration/erSchema",
              "type": "doc"e custom logic
}

module.exports = async function myCustomFunction (logger, mongodbInstance, document) {
  const query = { ID_USER: document.ID_USER }
  const documentFound = await mongodbInstance.collection('pr_allergens').findOne(query)
  const response = await someCustomLogin(documentFound)
  return [{
    name: documentFound.NAME,
    idUser: documentFound.ID_USER
  }]
}
```
