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

Once a projections has been modified and some Projections Changes has been created the Single Views must be updated or deleted, to do so you have to create and configure the Single View Creator. [Click here](configure_single_view_creator) to see how to do this.

## Link projections to the Single View

To create the Projections Changes, which are used by the Single View Creator, you should correctly configure the projection from the `Advanced` section of the `Design` area in Console and correctly create the `changes` function.

In the `Advanced` section, open `fast-data` from menù and open the `projections.json` file.
Here, you should write a configuration object:

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
    },
    "projectionsChangesCollectionName": "my-custom-projections-changes-collection-name"
}
```

which contains the following properties:

* *SYSTEM ID*: id of the system, as configured in Console;
* *PROJECTION NAME*: name of the projection, as configured in Console;
* *SINGLE VIEW NAME*: name of the desired single view;
* *FUNCTION NAME*: function name which should be used. The function name should be the file name which contains the export of the main function. See below to know how to create the file for the strategies.

:::info
By default, the Projections Changes collection name is `fast-data-collections-changes` and it is unique for all the System of Records. If you want to change the collection name, you could set it in `projectionsChangesCollectionName` field and it will be overriden for all Systems of Records.
:::

### Strategies

The strategies function creation are in the repository of the project configuration on git.

Firstly, clone the repository. Click on the git provider icon in the right side of the header (near to the documentation icon and user image) and clone the repository.

To create the strategies files, create a folder `fast-data-files`.

In this folder, create a folder named with the `strategies/SYSTEM ID` (replacing *SYSTEM ID* with the system id set in Console) and inside this folder you can add all the files you need to create the strategies for the specified System of Record.

The function should be:

```js
module.exports = (logger, databaseName) => async(document, mongoClient) => {
  // Write here your business logic
}
```

and returns an array of object containing the keys of the single view to update.

#### How can I write tests?

We believe that all the files of a program must be tested. To allow you to do it, you can add the `package.json` in the `fast-data-files` folder with the test scripts with your preferred test runner.

Remember that all the files in `tests` or `test` folder and files with filename ending with `.test.js` or files with suffix not `.js` will not bring to create the strategies files.

For example, in this folder

```txt
configurations/
  |-- package.json
  |-- changes/
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

In the `fast-data-files`, you can import only the node modules present in the following list:

* lodash.get
* mongodb
* ramda

and it is used the node version 12.

## How to consume the Single View

You can expose the Single View through the crud-service without write any code, or you can always create a custom service to access to MongoDB if you have special needs.

You could [check here](/docs/development_suite/api-console/api-design/endpoints) how to expose an endpoint of the CRUD service outside your project through the Console.

[Click here](/docs/runtime_suite/crud-service/overview_and_usage) if you want the usage documentation for the CRUD.
