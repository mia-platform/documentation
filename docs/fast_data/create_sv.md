---
id: single_view
title: Single View
sidebar_label: Single View
---

## Create the single view collection

To create and expose the single view, the first step is to [create the collection definition](/docs/development_suite/api-console/api-design/crud_advanced).

Once defined the data structure, you could create the single view.

## Create the Single View Creator service

A Single View allows to aggregate data from different sources in order to have a single collection that includes all needed entity information (e.g customers, policies, etc. ).

Once a projection has been modified and some Projections Changes have been created the Single Views must be updated or deleted, to do so you have to create and configure the Single View Creator. [Click here](configure_single_view_creator) to see how to do this.

## Link projections to the Single View

To create the Projections Changes, which are used by the Single View Creator, you must correctly configure the projection from the `Advanced` section of the `Design` area in Console and then create the `changes` function.

In the `Advanced` section, open `fast-data` from menu and open the `projections.json` file.

Here, you should write a configuration object as follows:

```json
{
  "systems": {
    "SYSTEM ID": {
      "projections": {
        "PROJECTION NAME": {
          "changes": {
            "SINGLE VIEW NAME": {
              "main": "FUNCTION NAME"
            }
          }
        }
      }
    }
  }
}
```

The advanced configuration object contains the following properties:

* *SYSTEM ID*: id of the system, as configured in Console;
* *PROJECTION NAME*: name of the projection, as configured in Console;
* *SINGLE VIEW NAME*: name of the desired single view;
* *FUNCTION NAME*: function name which should be used. The function name should correspond to the file name which exports the main function. See below to know how to create the file for the strategies.

### Strategies

When the `Single View Creator` will be configured, it will look at the changes stored in the **projections changes collection**. In order to know which specific Single View needs to be updated, based on the projections records just modified by the importer, the Single View Creator will look at the projection change `identifier`.

In order to do so, **strategies** need to be implemented. These strategies are basically the way to retrieve the unique identifiers of the single view that needs to be updated or created as consequence of the changes on the projection. The output of the strategies will be used by the `Real-Time Updater` to record a change in the proper `projection-changes` collection for each identifier.   

For instance, consider having a single view *sv_restaurants* that contains the name of the restaurants and their menu.
In our example this single view could be built with data coming from two different projections: *restaurants*, containing the basic informations about the restaurants, and *dishes* containing instead the list of the available dishes for each restaurant, linked using the `id` of the restaurant.
Supposing that the description field of a single dish for the restaurant *restaurant-id-1* is updated, you would need to update the document of the single view *restaurant* with the `id` that matches *restaurant-id-1*. To do that, you need to write a function that, starting from the updated dish, returns the identifier of the single view that needs to be updated, in this example it would be the `id` of the restaurant.

The strategies function can be created in the repository of the project configuration.

In order to write a strategy function, first clone the repository, in order to do so click on the git provider icon in the right side of the header (near to the documentation icon and user image) to access the repository and then clone it.

Strategies files needs to be created below a folder named `fast-data-files`, if your project does not have it, create it.
In this folder, create a folder named as `strategies/SYSTEM ID` (replacing *SYSTEM ID* with the system id set in Console) and inside this folder you can add all the files you need to create the strategies for the specified System of Record.

For instance if you want to create a strategy function for the system `my-system` you need to create the following directory tree:

```txt
/configurations
    |-- fast-data-files
        |-- strategies/
              |-- my-system/
```

The file should export a simple function with the following signature:

```js
module.exports = (logger, databaseName) => async(document, mongoClient) => {
  // Write here your business logic
}
```

The function must return an array of objects containing the keys of the Single View that needs to be updated.

In the simplest case the document already contains the Single View key fields, so we can extract it from the input document.
For instance if the Single View key is composed by two fields:

```js
{
  field_a,
  field_b
}
```

and the input document is:

```js
{
  field_a: 'value_a',
  field_b: 'value_b',
  field_c: 'value_c',
  field_d: 'value_d'
}
```

we can extract the identifier from the document itself and return it as an array

```js
module.exports = (logger, databaseName) => async (aDocument) => {

  const {
    field_a,
    field_b
  } = aDocument

  const singleViewIdentifier = {
    field_a,
    field_b
  }

  return [singleViewIdentifier]
}

```

In a more complex situation we could not have all the information in the incoming document, so we would need to fetch more documents to get all fields.

In this second scenario the input document could be:

```js
const {
  field_a: 'value_a',
  field_c: 'value_c',
}
```

We don't have `field_b`, so we need to fetch the table that contains `field_b` and we will do it using `field_c` as the conjunction element for the first look up and finally `field_d` to get the correct element that contains the desired `field_b`

```js
module.exports = (logger, databaseName) => async(aDocument, mongoClient) =>  => {
    const {
      field_a,
      field_c
    } = aDocument
    const projectionsDb = mongoClient.db(databaseName)

    // retrieve first document using projectionsDb and input field_c
    const firstRetrieve = await projectionsDb.collection(startingProjection).findOne({
      field_c,
    })

    const {
      field_d
    } = firstRetrieve
    // retrieve all documents that match field_d from the first retrieved document
    const results = await projectionsDb.collection(projectionWithKey).find({
      field_d,
    })

    // returns an array of identifier, one for each results
    const identifiers = results.map(({ field_b }) => {
      return {
        field_a,
        field_b,
      }
    })

    return identifiers
  }
}
```

:::caution
When the `real-time updater` deletes a projection document, it actually makes a **virtual delete** instead of real document deletion. This means that the document is actually kept in the database, but the `__STATE__` field (one of the default fields of the `Crud Service`) is set to `DELETED`.
:::

#### How can I write tests?

We believe that all the files of a program must be tested. To allow you to do it, you can add the `package.json` in the `fast-data-files` folder with the test scripts with your preferred test runner.

Remember that all the files in `tests` or `test` folder and files with filename ending with `.test.js` or files with suffix not `.js` will not bring to create the strategies files.

For example, in this folder:

```txt
configurations/
    |-- fast-data-files
        |-- package.json
        |-- strategies/
              |-- my-system/
                    |-- myFn1.js
                    |-- myFn2.js
                    |-- myFn1.test.js
                    |-- tests/
                          |-- myFn2.js
```

the file included in Real Time Updater service will be `myFn1.js` and `myFn2.js`.

:::info
Remember to write the filename equal to filename inside advanced configuration!
:::

To enable the continuous integration, you could start a pipeline checking for changes inside the `fast-data-files` folder and triggers test, lint and others useful scripts.

To know the technical limitation you have in these files, [read here](./single_view#technical-limitation)

## How to consume the Single View

You can expose the Single View through the crud-service without write any code, or you can always create a custom service to access to MongoDB if you have special needs.

You could [check here](/docs/development_suite/api-console/api-design/endpoints) how to expose an endpoint of the CRUD service outside your project through the Console.

[Click here](/docs/runtime_suite/crud-service/overview_and_usage) if you want the usage documentation for the CRUD.

## Technical limitation

In your custom files (e.g. `fast-data-files`) you can import only the node modules present in the following list:

* [lodash.get](https://github.com/lodash/lodash/tree/4.4.2-npm-packages/lodash.get)
* [mongodb](https://github.com/mongodb/mongo/tree/r3.6.0)
* [ramda](https://github.com/ramda/ramda/tree/v0.27.1)

:::caution
It is used the node version 12.
:::
