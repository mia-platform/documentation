---
id: strategies
title: Strategies Configuration
sidebar_label: Strategies
---

In this document we guide you through the configuration of [Strategies](/fast_data/the_basics.md#strategies) directly in the Console.

## Write your strategy

The strategy functions can be created in the repository of the project configuration.

In order to write a strategy function, first clone the repository, in order to do so click on the git provider icon on the right side of the header (near to the documentation icon and user image) to access the repository and then clone it.

Strategy files need to be created below a folder named `fast-data-files`, if your project does not have it, create it.
In this folder, create a folder named `strategies/SYSTEM ID` (replacing *SYSTEM ID* with the system id set in Console) and inside this folder you can add all the files you need to create the strategies for the specified System of Record.

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

:::caution
If your CDC sends just the changes of the record instead of the whole record, the document you receive as argument in the strategy function is the same as the one sent by the CDC, indeed they are just the changes.
:::

In a more complex situation we could not have all the information in the incoming document, so we would need to fetch more documents to get all fields.

In this second scenario the input document could be:

```js
const {
  field_a: 'value_a',
  field_c: 'value_c',
}
```

We don't have `field_b`, so we need to fetch the table that contains `field_b`, and we will do it using `field_c` as the conjunction element for the first look up and finally `field_d` to get the correct element that contains the desired `field_b`

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
When the `real-time updater` deletes a projection document, it actually makes a **virtual delete** instead of real document deletion. This means that the document is actually kept in the database, but the `__STATE__` field (one of the default fields of the `CRUD Service`) is set to `DELETED`.
:::

### How can I write tests?

We believe that all the files of a program must be tested. To allow you to do it, you can add the `package.json` in the `fast-data-files` folder with the test scripts with your preferred test runner.

Remember that all the files in `tests` or `test` folder and files with filename ending with `.test.js` or files with suffix not `.js` will not bring to create the strategies files.

For example, in this folder:

```txt
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

The file included in Real-Time Updater service will be `myFn1.js` and `myFn2.js`.

The folder `fast-data-files` must be created at the root level of the configuration repository of your project.

To enable the continuous integration, you could start a pipeline checking for changes inside the `fast-data-files` folder and triggers test, lint and others useful scripts.

### Technical limitation

In your custom files (e.g. `fast-data-files`) you can import only the node modules present in the following list:

- [lodash.get](https://github.com/lodash/lodash/tree/4.4.2-npm-packages/lodash.get)
- [mongodb](https://mongodb.github.io/node-mongodb-native/4.15/)
- [ramda](https://ramdajs.com/docs/)


## Strategies type

:::warning
This information are valid only when using a [Real-Time Updater](/fast_data/configuration/realtime_updater.md) with **Projection Changes**.
:::

Each strategy is associated with a **type**, which usually (and by default) corresponds to the name of the Single View for which it is configured. When using a Real-Time Updater with Projection Changes, this type should match the one declared in the `TYPE` environment variable of the Single View Creator(s) associated with the Single View. The reason is that, behind the hood, the strategy type is written in the Projection Changes record by the Real-Time Updater and the Single View Creators will discern which records to process based on it.

There may be scenarios in which you want more than one Single View Creator associated with the same Single View, to process Projection Changes records with different types (as explained [here](/fast_data/faq/parallel_svc.md)): this may happen, for example, to isolate a critical flow in which one projection concurring in a Single View is updated much more often than the others, needing a dedicated set of services to ensure maximum efficiency.

To achieve this separation, one can use the **Type field** of the strategies table in the Single View details page to associate a specific type to a subset of strategies.

![Strategies table](./img/strategies-table.png)

:::caution
For the flow to work correctly, the types declared in the strategies table should match the type of at least one of the Single View Creators associated with the Single View, and viceversa.
:::