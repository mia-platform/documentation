---
id: parallel_svc
title: Have multiple single view creator for one single view
sidebar_label: Concurrent Single View Creators
---

The [update strategy](/fast_data/configuration/single_view_creator/upsert_delete_strategies.md#update) provides a way to divide the aggregation effort of a Single View between more than one Single View Creator.

:::tip
This is specially useful when one of the computation efforts is much bigger than the other so it makes sense to dedicate a Single View Creator with more resources to deal with the workload and not block the queue for what could be faster aggregations.
:::

## Use Case

For example, we have a Single View called `sv_posts`, with a base projection called `posts` having a one to many relationship to `comments`:

```typescript [title="sv_posts"]
{
  title: string,
  comments: {text: string}[]
}
```

## Services Configuration

Linking two [services from the Single View section](/fast_data/configuration/single_view_creator/plugin.md#attaching-a-service-to-a-single-view), we can have two Single View Creators, namely `svc-1` and `svc-2` each one [configured with the `update` strategy](/fast_data/configuration/single_view_creator/plugin.md#upsert-and-delete-strategies): in this way, `svc-1` will be in charge of handling just the `title` field, while `svc-2` will compute just the `comments` array.

## Write the aggregation

The `aggregation.json` files would look like that:

```json [title="svc-1-aggregation.json"]
{
  "version": "1.3.0",
   "config": {
      "SV_CONFIG": {
         "dependencies": {
            "posts": {
               "type": "projection",
               "on": "_identifier",
            },
         },
         "mapping": {
            "title":"posts.title"
         }
      }
   }
}
```

```json [title="svc-2-aggregation.json"]
{
   "version": "1.3.0",
   "config": {
      "SV_CONFIG": {
         "dependencies": {
            "posts": {
               "type": "projection",
               "on": "_identifier"
            },
            "COMMENTS": {
               "type": "config"
            }
         },
         "mapping": {
            "comments": "COMMENTS"
         }
      },
      "COMMENTS": {
         "dependencies": {
            "comments": {
               "on": "posts_to_comments",
               "type": "projection"
            }
         },
         "joinDependency": "comments",
         "mapping": {
            "text": "comments.text"
         }
      }
   }
}
```

So, at the end we will have the first Single View Creator with the first `aggregation.json` ( `svc-1-aggregation.json` ) above and the `UPSERT_STRATEGY` set to `update`. And the second Single View Creator with the second `aggregation.json` ( `svc-2-aggregation.json` ) and the `UPSERT_STRATEGY` also set to `update`.

## Strategy definition

Once both aggregations are defined, we have to assign each projection's strategy to the corresponding single view creator. In particular

* `svc-1` has to receive projection changes from `posts` strategy;
* `svc-2` has to receive projection changes from `comments` strategy.

This can be achieved by using two different `TYPE` environment variables for the two services, for example:
* `TYPE: svc-1` will be used by micro-service `svc-1`;
* `TYPE: svc-2` will be used by micro-service `svc-2`

After defining the type, you can assign to each strategy [the type attribute in the Strategy section](/fast_data/configuration/strategies.md#strategies-type)