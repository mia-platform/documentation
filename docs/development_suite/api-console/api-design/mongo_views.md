---
id: mongo_views
title: Create MongoDB Views
sidebar_label: Create Views
---
## What is a MongoDB View?

> A MongoDB view is a queryable object whose contents are defined by an aggregation pipeline on other collections or views. MongoDB does not persist the view contents to disk. A view's content is computed on-demand when a client queries the view. MongoDB can require clients to have permission to query the view.   

[Source](https://www.mongodb.com/docs/manual/core/views/#views)

## Create a new View

![create view form](img/create_mongodb_view.png)

To create a new MongoDB View, you need to access the **MongoDB Views** menu from the **Data Models** section. From here, to access the creation page, simply click on the **Create new View** button.

A View requires the following fields:

- **Name** : the name by which the view will be referenced.
- **Internal Endpoint** : the endpoint that will be exposed by the [CRUD Service](/runtime_suite/crud-service/10_overview_and_usage.md) within the namespace. Only paths with the **GET** method will be exposed, as only read operations on the views are allowed.
- **Starting Collection**: it's the source from which the aggregation of the view starts. This can be a **Collection**, but also a [Projection](/fast_data/configuration/projections.md) or a [Single View](/fast_data/configuration/single_views.md).

:::info
Additional internal endpoints can be defined in the Internal Endpoints card of the View.

![Internal endpoint view](img/internal_endpoint_view.png)
:::


The data exposed by the view are obtained through a sequence of actions that process the data source's data. These actions are outlined in the *pipeline*, which can include filtering, grouping, joining, projecting, or transforming the data. Together, these actions form what is referred to as the [aggregation pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/).

### Aggregation

MongoDB will run an [aggregation pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) starting from the `source` collection.    
When you create a new view, the console will set a default pipeline which returns only `PUBLIC` documents. You can edit it through the dedicated editor.   

![Pipeline view](img/pipeline_card_view.png)

:::note
The whole aggregation pipeline is going to be performed on-demand on each request the view received.   
If you expect to perform complex aggregation with many collections involved, or several amounts of documents involved in each request, you may consider using a [**Fast Data Single View**](/fast_data/the_basics.md#single-view-sv) instead. In fact, a MongoDB View perform aggregation on reading, the Fast Data Single View perform the aggregation on writing of the source collections (called [**Projections**](/fast_data/the_basics.md#projection)) and it's so a better choice for data-intensive aggregation.
:::

:::caution
This feature is available from version `5.2.2` of [CRUD Service](/runtime_suite/crud-service/10_overview_and_usage.md). Creating a view while using a lower version of CRUD Service would make it crash at boot.
:::

Moreover, from version 11.5.0 of the Console you can also decide to enable lookups to get [Writable Views](/runtime_suite/crud-service/50_writable_views.md). To do that you have to enable the _Enable Lookup_ toggle included next to the `source` collection input.

:::caution
To enable lookup, the CRUD Service installed in the project must be of version 6.9.0 or higher, as explicitly in the Docker Image of your service. If you are using a public variable to have different versions among environments, make sure every environment have version 6.9.0 or higher.
:::

### Fields

Fields you are defining in a View are the fields you expect to have at the end of the aggregation. 
Fields types can be the same of your [collection](/development_suite/api-console/api-design/crud_advanced.md#fields),[projection](/fast_data/configuration/projections.md#projection-fields) or [single view](/fast_data/configuration/single_views.md#single-view-data-model). Nested fields are supported as well. 
Unlike MongoDB CRUD, you cannot set indexes on these views' fields instead, because they are going to use indexes of the underlying collection. To know more about it, please refer to the [official documentation](https://www.mongodb.com/docs/manual/core/views/#index-use-and-sort-operations).

### Expose through endpoints

The [CRUD Service](/runtime_suite/crud-service/10_overview_and_usage.md) will handle your data model and expose its API to the services within your project. If you need to make the API consumable from the external of your namespace, you can create an [Endpoint](/development_suite/api-console/api-design/endpoints.md) of type `MongoDB View` connected to one of the `Internal Endpoints` of your view. 

Since the internal endpoint of a MongoDB View can be used only for reading operations, the endpoint will expose only `GET` routes as well.

:::caution
When exposing data through an endpoint, it's necessary for documents to have a `__STATE__` field to facilitate accurate filtering. If the aggregation process generates objects without this field, the endpoint will consistently return an empty array as its output.

To ensure the proper functioning of endpoint exposure, it's important to carefully manage the aggregation process. This means guaranteeing the inclusion of the  `__STATE__` field. If including the field is challenging, you can ensure its presence by using the [$project](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/) object within the aggregation and explicitly setting the `__STATE__` field's value to `PUBLIC`.

```json
[
    {
        "$match": {
            "__STATE__": "PUBLIC"
        }
    },
    {
        "$project": {
            "_id": 1,
            "total_price": 1,
            "__STATE__": "PUBLIC"
        }
    }
]
```
:::

### CMS

The CMS offers a fast and intuitive way to visualize a MongoDB View's information without the need of manually sending http requests.

To see a MongoDB View's content from the CMS you will need to [create a new CMS Page](/business_suite/cms_configuration/config_cms.md#how-to-create-a-page) from the CMS section of the console. In the first step (Menu configuration) of the creation form you want to select as `Endpoint` the previously created endpoint connected to your view. Now in the second step (CMS Settings) you will notice there are two disabled options, the `Enable delete` and the `Avoid the creation of new elements`.

![Create CMS page step 2 form](img/cms-mongo-view-second-step-screenshot.png)

This is because, as we said earlier, a MongoDB View can only be used for reading operations. Consequently, the deletion and creation of elements is disabled.

Now finish the creation as you would with any other endpoint and visit the CMS portal to see the results.