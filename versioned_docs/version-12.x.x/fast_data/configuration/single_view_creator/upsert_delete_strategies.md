---
id: upsert_delete_strategies
title: Upsert and Delete Strategies
sidebar_label: Upsert and Delete Strategies
---

The Single View Creator provides different ways to handle the upsert and delete of Single View records through the `UPSERT_STRATEGY` and `DELETE_STRATEGY` environment variables.

Most of the times one of the pre-configured strategies will be enough, but if it isn't you can also [customize them](#custom-functions) to your specific needs.

## Upsert Strategy

The upsert strategy tells the Single View Creator what action to perform once the aggregation procedure is completed. Based on the value of `UPSERT_STRATEGY`, the system will act accordingly.

### Replace

Using `replace`, the **whole record** that matches the Single View Key will be **replaced**  the new record from the aggregation. 

:::info
If there isn't an `UPSERT_STRATEGY` explicitly defined into the micro-service, `replace` will be used as the default strategy.
:::

### Update

Using `update`, the Single View record that matches the Single View Key **won't be entirely overwritten**, so that **only** the properties computed by the aggregation will be updated.

### Custom 
If a path to a function is provided, a completed customized logic to perform the upsert of the Single View document will be performed. 

The function definition is better explained in the [section below](#custom-functions).

## Delete Strategy

The delete strategy tells the Single View Creator what action to perform once the aggregation procedure returns no value, meaning that the single view record has been deleted. 

Based on the value of `DELETE_STRATEGY`, the system will act accordingly.

### Hard Delete

Using `delete`, the Single View Creator [hard deletes](https://en.wiktionary.org/wiki/hard_deletion) the Single View record.

:::info
If there isn't a `DELETE_STRATEGY` explicitly defined into the micro-service, `delete` will be used as the default strategy. 
:::

### Soft Delete
Using `virtualDelete`, the Single View Creator [soft deletes](https://en.wiktionary.org/wiki/soft_deletion) the Single View, by setting the `__STATUS__` property to `DELETED`.

The delete operation of a Single View (either hard, soft or custom) happens when the Base Projection record gets deleted.

If you need a more complex deleting strategy we encourage you to take a look to the [Custom functions](#custom-functions) section.

## Custom functions

If you want, you can replace both upsert and delete functions with your own custom functions.

These functions represent the last step of the creation (or deletion) of a Single View, in which the Single View collection is actually modified.

In case the validation succeeds, the upsert function will be called with the following arguments:

- `logger` is the logger
- `singleViewCollection` is the Mongo collection object
- `singleView` is the result of the mapping operation
- `singleViewKey` is the Single View key

On the other hand, if the validation has a negative outcome, the delete function will be called with the same arguments, except for the `singleView`, which will not be handled by the delete function.

In both cases, some operation should be done on `singleViewCollection` in order to modify the Single View with the current `singleViewKey`, with the idea of "merging" the current result with the one already present in the database.

For example, we have a "Customer" Single View with a list of products the customer bought from different e-commerce websites, and we receive an update for a new object on a specific shop. In that case we don't want to replace the list of bought products with the last one arrived, but we want to push the product in the list in order to have the complete history of purchases.

For both functions, the output is composed of an object containing two fields:

- `old` which contains the old Single View
- `new` which contains the new Single View

These values will respectively be the `before` and the `after` of the message sent to the `KAFKA_BA_TOPIC` topic, which is the topic responsible for tracking any result of the Single View Creator. The naming convention for this topic can be found [here](/fast_data/inputs_and_outputs.md#single-view-before-after).

```js
async function upsertSingleViewFunction(
  logger,
  singleViewCollection,
  singleView,
  singleViewKey)
{
  logger.trace('Upserting Single View...')

  // Here goes your custom upsert logic
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

  // Here goes your custom delete logic
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
