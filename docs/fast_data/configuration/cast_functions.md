---
id: cast_functions
title: Cast Functions Configuration
sidebar_label: Cast Functions
---

In this document we guide you through the configuration of [Cast Functions](/fast_data/the_basics.md#cast-function) directly in the Console.

## Default Cast Functions

The Console provides your project with a set of default cast functions ready to use, so that you can start to create your projection without writing any line of code to cast your data in the correct format.

To see the implementation of the default cast functions:

1. Go to the Design Area
2. Go to the Projections Section
3. Go to the Cast Function tab
4. In the `Default cast functions` card, hover the zoom icon


![Default cast functions implementation](../img/fastdata-default-castfunction-zoom.png)

If you need more control over the casting of your data, you can also create your custom cast functions.

:::caution
If the value to cast is invalid (e.g. a character as input of a cast to `defaultCastToInteger`), all default cast functions return undefined or null, based on the cases. These fallback values are saved as `NULL` in MongoDB.  
Be aware of that if your fields are not `nullable`, in these cases you should define your own Custom Cast Functions with the fallback you need.
:::

## Create a Custom Cast Function

To define your own custom cast functions click on the *Create* button above the `Custom cast functions` table. This will open a drawer where you can define the property of your own cast function.

| Name          | Type        | Required | Description                                                                                         |
|---------------|-------------|----------|-----------------------------------------------------------------------------------------------------|
| Name          | String      | &check;     | Name of the cast function. No spaces or special characters                                          |
| Returned Type | Select      | &check;     | The type of the value that has to be returned                                                       |
| Expression    | JS Function | -    | The javascript implementation of the cast function. It needs to be an exported function as default. |

### Let's see an example

Name: `castToIntBase10`
Returned Type: `Number`
Expression:

```javascript
module.exports = function (valueToCast, fieldName, logger) {
  return parseInt(valueToCast, 10)
}
```

As you can see in the example above, the cast function accepts three arguments:

- **valueToCast**: it is the value as it's received from the data source
- **fieldName**: the name of the field associated with the value (e.g.: *restaurantName*)
- **logger**: the logger you can use to log in your function (an instance of the [Pino logger](https://github.com/pinojs/pino)).

To know the technical limitation you have in your cast function, [read here](#technical-limitation)

## How and when are the Default Cast Functions updated?

By default, your project is provided with a set of default cast functions you can see in the `Default cast functions` table.

What happens when the Console changes the default cast function?

Let’s analyze each case in the next sections:

- ### The implementation of a default cast Function is changed, but the name `castFunctionId` is unchanged.

  In this case, nothing will change in your configuration. You will continue to use the same implementation you had before.

- ### A new default cast function is added

  In this case, the new cast function will be added to your configuration.

  ![Fast Data new default castFunction](../img/fastdata-new-default-castfunction.png)

  If a new default cast function is added on the Console, it will be available in the Cast Function tab of the Projections section when you visit the Design area (even if it is not yet stored on your git provider in your `fastdata-config.json`). When you save the configuration it will be stored in the configuration file.

- ### A default cast function is deleted

  In this case, although a default cast function has been deleted from which Console generates, it will still be available in your configuration (e.g.: Console removes `defaultCastUnitTimestampToISOString`).
  Let's see an example:

  - Default cast functions as seen in *your* project

  ![Fast Data with deleted default cast function](../img/fastdata-delete-castfunction-all.png)

  - Default cast functions generated for *new* projects

  ![Fast Data without deleted default castFunction](../img/fastdata-delete-castfunction-without-deleted.png)

  As you can see, in your project you are still able to use all the default cast functions, although `defaultCastUnitTimestampToISOString`, in our example, is no longer supported.
  If you create a new project, this default cast function will not be provided instead.

## Technical limitation

In your custom cast functions you can import only the node modules present in the following list:

- [lodash.get](https://github.com/lodash/lodash/tree/4.4.2-npm-packages/lodash.get)
- [mongodb](https://github.com/mongodb/mongo/tree/r3.6.0)
- [ramda](https://github.com/ramda/ramda/tree/v0.27.1)
