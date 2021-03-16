---
id: overview_and_usage
title: CRUD Service
sidebar_label: Overview and Usage
---
CRUD acronym stays for ***Create-Read-Update-Delete***. The CRUD Service purpose is to abstract a Data Collections allowing developers to expose CRUD APIs over the database in an easy, scalable and secure way.

It's possible to configure CRUD Service with more that one collection and to scale it horizontally. In this section you will learn how to configure, deploy and use Mia-Platform CRUD Service.

## Introduction

The CRUD Service is a microservice that exposes via Restful API a set of MongoDB Collection. CRUD Service is configured in the Console.

Via APIs it's possible to:

- read a collection and filter results;
- find elements of a collection using MongoDB query syntax;
- count number of elements in a collection;
- create a new element in a collection (also with a bulk action);
- update one or more elements of a collection;
- delete one or more elements of a collection;

The following guide will help you to get familiar with the APIs of the CRUD Service.

![API Portal](img/crud-api-portal.png)

> Remember: the API Portal visualize all API configured and exposed by CRUD.

### Conventions

We will use the following naming conventions:

- **collection**: a set of JSON documents
- **document**: an item that belong to a collection
- **property**: a field of a document
- **value**: the value of a property
- **query string**: the filter set in the url query
- **body**: the JSON data passed in a request

In the following guide we will use a collection named *Plates* that contains a list of dishes with the following properties:

- name: name of the plate
- description: description of the plates
- price: price of the plate (in euro)
- ingredients: array of string with the id of the ingredients used
- image: array of photos (a JSON object)
- position: the geocoded position of a plate

## Configure a CRUD in two minutes

In Console it's possible to configure the CRUD service. The task it's easy. The steps are:

- open Console project Design Section
- select CRUD menu
- press Create new CRUD button
- configure CRUD
- select Endpoints menu
- press Create new endpoint
- configure the endpoint selecting the CRUD created and one of its existing internal routes
- press Commit&Generate button and save the configuration in the preferred branch
- select Deploy menu
- select the environment and branch to deploy and deploy it
- in less than one minute the new endpoint that exposes the configured CRUD service is available
- select Documentation menu and open the API Portal, browse the CRUD endpoint deployed

For more details [see here](../../development_suite/api-console/api-design/crud_advanced).

 ------------------------------------------------------------

## CRUD Collection Properties

Some collection field properties are predefined, others are custom and can be configured with different data types.

All properties can be indexed to speed up the data retrieval. The indexes configuration can be set in Console/Design/CRUD section.

### Predefined Collection Properties

CRUD by default comes with a set of common properties that simplify the data management:

- **_id**: unique 24 character length hexadecimal String that identifies a document in the collection
- **creatorId**: String, id of the user who created the document
- **createdAt**: Date, date and time when the document has been created
- **updaterId**: String, id of the user who last updated the document; this information is overwritten every time the document is updated
- **updatedAt**: Date, date and time when the document has been updated; this information is overwritten every time the document is updated
- **`__STATE__`**: String, is the current state of the document, can be one of `PUBLIC`, `DRAFT`, `TRASH`, `DELETED`. The state of the document can't be set directly, but can be changed via REST API calls. Only some transformations are allowed, such as `DRAFT` -> `PUBLIC`, while others are not.  

The only editable field among the default ones is `_id` where you can change the property `type` and choose between:

- `ObjectId` (default value): corresponds to [MongoDB objectId](https://docs.mongodb.com/manual/reference/method/ObjectId/) that is the unique key to identify a document.
- `String`: id of type string that follows UUID v4 format.

#### Example of a Collection with only predefined Properties

If you create a CRUD named `empty` without any configuration in the Console you will create a schema with the predefined properties. When you POST on that CRUD you will obtain the following document.

```bash
curl --request GET \
  --url https://your-url/v2/empty/ \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

```json
{
  "__STATE__" : "PUBLIC",
  "_id" : "5e8a125eb74dbf0011444ed3",
  "createdAt" : "2020-04-05T17:16:14.175Z",
  "creatorId" : "public",
  "updatedAt" : "2020-04-05T17:16:14.175Z",
  "updaterId" : "public"
}
```

#### ```__STATE__``` management

**```__STATE__```** is a special field that allows the Mia-Platform CRUD Service to manage a simple publishing workflow. The ```__STATE__``` field can assume the following values:

##### STATE values

- **PUBLIC**: the document is visible without specifying the value of ```_st``` in the query string
- **DRAFT**: the document is in draft status, to retrieve the document you need to specify in the query string the parameter ```_st=DRAFT```
- **TRASH**: the document is *soft deleted*; you can still query this document specifying in the query string  ```_st=TRASH```. The Mia-Platform Headless CMS will visualize this element in the Trash section and it's possible to recover it.
- **DELETED**: the document is *deleted*; you can still query this document specifying in the query string  ```_st=DELETED```. The Mia-Platform Headless CMS  not visualize this element and it is possible to recover it only programmatically.

> **Note**: the query string can specify more than one status separating in with commas. Example: `_st=PUBLIC,DRAFT` return both PUBLIC and DRAFT documents.

By default, when a new item in CRUD is added via POST, the document status is DRAFT. It's possible to change this behavior in the endpoint section of the CRUD changing the default behavior to PUBLIC. This configuration is available in Console/Design/Endpoints section.

It is also possible to enable *hard delete* function to delete permanently an document from the CMS.

##### State Transitions

Only the following transitions are allowed in the publish workflow.

| Source/Destination | PUBLIC  |  DRAFT | TRASH  | DELETED  |
|--------------------|---------|--------|--------|----------|
| PUBLIC             |    -    |   OK   |   OK   |  -       |
| DRAFT              |  OK     |   -    |   OK   |  -       |
| TRASH              |  OK     | OK     |   -    |   OK     |
| DELETED            |   -     |   -    |   OK   |   -      |

To transit the STATE of an item of a CRUD you need to POST it

```json
 POST /[COLLECTION_NAME]/{_id}/state
```

for example

```bash
 curl --request POST \
  --url https://your-url/v2/empty/5e8a125eb74dbf0011444ed3/state \
  --header 'content-type: application/json' \
  --header 'client-key: client-key' \
  --data '{"stateTo":"PUBLIC"}'
```

update from DRAFT (default state) to PUBLISH the collection document `5e8a125eb74dbf0011444ed3`.

### Collection Properties Types

When a new property is added to a collection it is possible to specify the following types:

- String: UTF-8 character set
- Number
- Boolean
- GeoPoint (array of coordinates longitude, latitude)

```json
{ "position":
  [
    9.232457,
    45.443919
  ]
}
```

- Date
- Object
- Array of Strings
- Array of Numbers
- Array of Objects

For the Objects and array of Objects, you could add a JSON Schema describing the expected properties.

### Collection document Properties properties

Each property can defined as:

- **required**: the property cannot be empty
- **encrypted**: the property is encrypted at rest
- **nullable**: the property can be null

### Indexes

Any CRUD field can be indexed. In Console/Design/MongoDB CRUD the following indexes can be configured:

- **Normal**: standard [MongoDB index](https://docs.mongodb.com/manual/indexes/) which can hold references to a single field or to multiple ones.
- **Geo**: geospatial index that supports queries on a 2D plane. Follow this [link](https://docs.mongodb.com/manual/geospatial-queries/) to learn more about MongoDB geospatial queries.
- **Hash**: hashed indexes use hashes of the value of a single field in order to distribute data across multiple machines, avoiding to overload a single machine. Visit MongoDB [documentation](https://docs.mongodb.com/manual/core/index-hashed/) to learn more about this type of indexes.
- **TTL**: single field indexes whose purpose is to automatically remove documents from a collection after a specific amount of time. MongoDB TTL indexes are explained in detail [here](https://docs.mongodb.com/manual/core/index-ttl/).

For the indexes of type Normal, Geo and TTL, you can choose whether to make the index unique. A unique index ensures that all the indexed fields do not possess duplicated values. If set, the value of the indexed fields must be unique in the collection.  

For the nested objects, it is possible to add an index using the dot notation to specify the indexed field.

:::warning
Every index that is not specified in the collection definition will be **dropped** at startup, unless its name starts with `preserve_` prefix
:::

## CRUD Headers

The CRUD service accept the following header:

- ***acl_rows***: an array of mongodb queries that limits the documents that a request can return. The value of acl_rows is a stringyfied JSON, which is in AND with the query string. Example:

```json
acl_rows: JSON.stringify([{ price: { $gt: MATCHING_PRICE } }])
```

- ***acl_read_columns***: the list of properties to return in the result (projection). It is an array of strings. Example:

```json
acl_read_columns: JSON.stringify(['name', 'author', 'isbn'])
```

- ***userId***: the user identifier that do the update

Usually this is used by PRE/POST Orchestrator to manage concatenated request to CRUD.

## CRUD Security

### Expose a CRUD Service

CRUD must not be exposed directly to the Internet but always must be protected by the API Gateway or a BFF.

### API Key

If a CRUD is exposed under an [API Key](../../development_suite/api-console/api-design/api-key) you have to pass the key into the request header with the name `client-key`.

Example

```bash
curl --request GET \
  --url 'https://your-url/v2/your-crud-name/' \
  --header 'accept: */*' \
  --header 'client-key: your-client-key'
```

## CRUD Endpoints

APIs configured with Mia-Platform can be consumed with any technology that supports HTTP protocol. For tests during development we recommend one of the following tools:

- [curl](https://curl.haxx.se/)
- [insomnia](https://insomnia.rest/)
- [postman](https://www.getpostman.com/)

In the examples for brevity we will use curl. Following are the typical operations that can be done with an APIRestful CRUD created with Mia-Platform.

>*Note*: all of these examples can be tested using the API Portal of Mia-Platform. The Portal can be accessed using Console.

Let's see how to perform C-R-U-D operations.

All examples are sent to <https://your-url> Mia-Platfrom instance. We assume that the endpoints are only protected by API Key.

```json
client-key: client-key
```

If your endpoints are also protected by authentication and authorization you need to pass the access token to the curl command.

### Create

It's possible to create one or more documents in a collection. If the MongoDB collection doesn't exist CRUD creates it automatically and force the indexes configured in Console. A document can be created in three different ways:

- inserting a single JSON document
- inserting or updating one JSON document
- inserting multiple JSON documents (bulk)

The JSON document sent to CRUD is validated against the JSON schema defined in Console before the insertion.

#### Insert a single document

To create a document use *POST* request and pass, in the body of the request, the JSON representation of the new document. For example if you want to store a new document in the exposed collection `plates` you need to create a JSON like this one:

```json
{
 "name": "Spaghetti al Pomodoro",
 "description": "The classic italian dish"
}
```

and insert it in the collection using a POST request

```bash
curl --request POST \
  --url https://your-url/v2/plates/ \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'client-key: client-key' \
  --data '{"name":"Spaghetti al Pomodoro","description":"The classic italian dish"}'
```

in response, you will get a JSON object like this:

```json
{
 "_id":"5e8ae13bb74dbf0011444ed5"
}
```

where **_id** is the unique identifier of the new document inserted.

#### Insert or Update one document

If you are not sure if the document is already present in the collection, you can use the Insert or Update feature calling the endpoint upsert-one. You need to specify in query parameters all data to match eventually the existent document and in request body the JSON document you want to insert or update.

```bash
curl --request POST \
  --url 'https://your-url/v2/plates/upsert-one?name=Spaghetti%20allo%20Scoglio' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'client-key: client-key' \
  --data '{"$set":{"name":"Spaghetti allo Scoglio"}}'
```

in response you will obtain the document if already exist or a new document if is not present. The document will reflect all the updates you specified.

>**note**: if you don't specify the query string the first document of the collection is updated.

If instead of ```$set``` you use ```$setOnInsert``` values are set only if the document don't exist.

With upsert-one you can also manipulate a single document in the same instance when you insert or update it. This is really useful when you want to update the document and set a value at the same time. It follows the details.

>**note**: CRUD performs two steps with upsert-one, first search for the document and second update it or insert a new one. Be aware that this operation is not atomic.

##### Unset an item value

If you want to unset an item value when you update just use $unset. For example you want to insert a new document with Rice and unset the price.

```json
[
  {
    "_id":"5e9482ed0fb46200115f9231"
    "name":"Rice"
    "description":"The description"
    "price":"20"
    "__STATE__":"PUBLIC"
    "creatorId":"public"
    "updaterId":"public"
    "updatedAt":"2020-04-13T15:19:09.465Z"
    "createdAt":"2020-04-13T15:19:09.465Z"
  }
]
```

just call

```bash
curl --request POST \
  --url 'https://your-url/v2/plates/upsert-one?name=Rice' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'client-key: client-key' \
  --data '{"$set":{"description":"The correct description"},"$unset":{"price":true}}'
```

and the document become the following, without the price property and with the updated description.

```json
[
  {
    "_id":"5e9482ed0fb46200115f9231"
    "name":"Rice"
    "description":"The correct description"
    "__STATE__":"PUBLIC"
    "creatorId":"public"
    "updaterId":"public"
    "updatedAt":"2020-04-13T15:26:51.611Z"
    "createdAt":"2020-04-13T15:19:09.465Z"
  }
]
```

#### Insert multiple documents

The bulk insert can be performed POST on CRUD a JSON **array** of documents. For example to add three dishes to plates collection you have to POST the /bulk on the resource.

```bash
curl --request POST \
  --url https://your-url/v2/plates/bulk \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'client-key: client-key' \
  --data '[{"name":"Risotto ai funghi porcini","description":" Risotto with porcini mushrooms"},{"name":"Lasagna","description":"Stacked layers of flat pasta alternating with fillings such as ragù"},{"name":"Tiramisu","description":"Savoiardi dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese"}]'
```

```json
[
 {"_id":"5e8af37ab74dbf0011444ed6"},
 {"_id":"5e8af37ab74dbf0011444ed7"},
 {"_id":"5e8af37ab74dbf0011444ed8"}
]
```

### Read

In this section you will learn how to query a collection.

#### Get a list of documents

To list a collection, simply call the endpoint with a **GET**

```bash
curl -X GET https://your-url/v2/plates/ \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "client-key: client-key"
```

> Always end you request with a slash.  <https://your-url/plates/> is correct.  <https://your-url/plates> is wrong.

In response of this request you will get a JSON array that contains all the documents of the collection. The sorting is by insertion. The request return only documents with ```__STATE__``` equal to PUBLIC. To retrieve other documents you must to set STATE to DRAFT.

```json
[
   {
      "__STATE__" : "PUBLIC",
      "_id" : "5df78b5287393f00114e0f20",
      "createdAt" : "2019-12-16T13:49:06.759Z",
      "creatorId" : "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f",
      "description" : "The correct description",
      "image" : [],
      "ingredient" : [
         "5e8200fa2e9dde00112b6853",
         "5e81feaf2e9dde00112b684f",
         "5e81fd882e9dde00112b6849",
         "5e8202892e9dde00112b685c"
      ],
      "name" : "Salmone affumicato",
      "updatedAt" : "2020-04-13T15:26:19.819Z",
      "updaterId" : "public"
   },
   {
      "__STATE__" : "PUBLIC",
      "_id" : "5df8aff66498d30011b19e4d",
      "createdAt" : "2019-12-17T10:37:42.551Z",
      "creatorId" : "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f",
      "description" : "",
      "image" : [],
      "ingredient" : [
         "5e81fddd2e9dde00112b684c"
      ],
      "name" : "FRIED VEGGIE NOODLE",
      "price" : "10",
      "updatedAt" : "2020-03-30T14:29:31.791Z",
      "updaterId" : "auth0|5e81fb3565a28c0c5dbaa8c7"
   }
]
```

> **Note**: the maximum number of documents returned are 200. If you want more documents please use pagination. You can change this behavior setting the variable *CRUD_LIMIT_CONSTRAINT_ENABLED* to false. If you change it be aware that you can hang the service for out of memory error.

#### Get a single document by _id

To get just one document read only one element, simply pass the *_id* of the document as path param.

```bash
curl -X GET https://your-url/v2/plates/5df8aff66498d30011b19e4d \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "client-key: client-key"
```

In response to this request you get a JSON Object like the following.

```json
{
   "__STATE__" : "PUBLIC",
   "_id" : "5df8aff66498d30011b19e4d",
   "createdAt" : "2019-12-17T10:37:42.551Z",
   "creatorId" : "5c4fd1d2-c6d8-4c65-8885-0b74f0309d0f",
   "description" : "",
   "image" : [
      {
         "_id" : "5df8bb3295a2a500117fc8d2",
         "file" : "5df8bb328fa0c0000fb334e3.jpg",
         "location" : "https://your-url/files/download/5df8bb328fa0c0000fb334e3.jpg",
         "name" : "close-up-photo-of-cooked-pasta-2456435.jpg",
         "size" : 94274,
         "type" : "image/jpeg"
      }
   ],
   "ingredient" : [
      "5e81fddd2e9dde00112b684c",
      "5e81feaf2e9dde00112b684f",
      "5e81fd882e9dde00112b6849"
   ],
   "name" : "FRIED VEGGIE NOODLE",
   "price" : "10",
   "updatedAt" : "2020-03-30T14:29:31.791Z",
   "updaterId" : "auth0|5e81fb3565a28c0c5dbaa8c7"
}
```

> **Note**: the query will return only PUBLIC documents. To retrieve a DRAFT document add to query string ```&_st=DRAFT```

#### Sort

It is possible to sort the list of documents returned by a GET passing to the query string the **_s_** parameter. The value of the parameter is

```bash
[-|empty]<property name>
```

By default the sort id ascending, using - for descending. The following sort plates by names in alphabetical order.

```bash
curl --request GET \
  --url 'https://your-url/v2/plates/?_s=name' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

> For sorting with more than one property use _q

#### Paginate

By default GET returns a limited number of documents. You can use pagination to return more documents. Pagination accepts filters and sorts parameters.

To paginate you must use the following query parameters:

- **_l**: limits the number of documents returned. Minimum value 1. Maximum value 200. If you pass more that 200, the CRUD Service truncate to 200 the result unless the environment variable named *CRUD_LIMIT_CONSTRAINT_ENABLED* is set to *false*.
- **_sk**: skip the specified number of documents. Minimum value 0. Maximum value is bigint.

This is an example of request that get *two documents per page* and you ask for the *third page* (skip 4 documents).

```bash
curl --request GET \
  --url 'https://your-url/v2/plates/?_l=2&_sk=4' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

Combining _l and_sk you can paginate the request. If you want to visualize the number of pages in your UI you need also count with a request the number of documents.

#### Return a subset of properties

You can return just a some of the document properties (like GraphQL sub-selection or SQL select) using  ```_p``` parameter. You can select multiple properties separated by commas.

```bash
curl --request GET \
  --url 'https://your-url/v2/plates/?_p=name,price' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

Returns an array of documents with only the properties requested.

```json
[
   {
      "_id" : "5df8aff66498d30011b19e4d",
      "name" : "FRIED VEGGIE NOODLE",
      "price" : "10"
   },
   {
      "_id" : "5df8b8546498d30011b19e4e",
      "name" : "SPINACH CHICKEN SALAD",
      "price" : "12"
   }
]
```

> **Note**: the selection of inner object fields is not supported.

#### Combine all together

You can combine all together. For example to get the first 2 plates, sorted by name with just name and ingredients do the following request.

```bash
curl --request GET \
  --url 'https://your-url/v2/plates/?_s=name&_l=2&_sk=0&_p=name,ingredient' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

#### Filters with MongoDB Query

Documents can be filtered using mongo queries. It is possible to filter in and or in cascade quoting all of them the properties of documents. [More details on the MongoDB site for queries on a resource](Https://docs.mongodb.com/manual/tutorial/query-documents/)

For example we can look for plates that have a name that begins with V, that have price and two ingredients.

```bash
{"$and":[
    {"price":{"$exists":true}},
    {"ingredient":{"$size": 2}},
    {"name":{"$regex":"^V","$options":"i"}}
  ]
}
```

The query must be encoded and passed to _q parameter

```bash
curl --request GET \
  --url 'https://your-url/v2/plates/?_q=%7B%22%24and%22%3A%5B%20%20%20%20%20%7B%22ingredient%22%3A%7B%22%24size%22%3A%202%7D%7D%2C%20%7B%22price%22%3A%7B%22%24exists%22%3Atrue%7D%7D%2C%7B%22name%22%3A%7B%22%24regex%22%3A%22%5EV%22%2C%22%24options%22%3A%22i%22%7D%7D%20%5D%20%7D' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

You can use more MongoDB filters in query **_q**. Here is the complete list:

- $gt
- $lt
- $gte
- $lte
- $eq
- $ne
- $in
- $nin
- $all
- $exists
- $nearSphere
- $regex
- $elemMatch and $options

> **Note**: aggregate cannot be used. To use aggregate please see Mia-Platform MongoDB Reader Service.

#### Count

It may be helpful to know how many documents contains a list of documents. For this purpose it is sufficient to invoke a GET on the /count of the resource

```bash
curl -X GET https://your-url/v2/plates/count -H  "accept: application/json" -H  "content-type: application/json" -H  "client-key: client-key"
```

returns

```json
{
  "count": 3
}
```

> **Note**: filters can be applied to the count. By default only PUBLIC documents are counted.

#### Geospatial Queries

On CRUD service it's possible to filter data also for proximity using MongoDB Geospatial Queries.

To enable this feature you need to create an Position index on Console.

![Position Index](img/position-index.png)

When the index is created you can use $nearSphere. For example to search a plate near you, between 0 meters and 1200 meters from your position longitude: 9.18 and latitude: 45.46 (Milan, Italy), you can use this MongoDB query.

```json
{"position":
  {"$nearSphere":
     {"from": [9.18,45.43], "minDistance": 0, "maxDistance": 1200}
  }
}
```

to get the list of plates just encode the query and use _q.

```bash
curl --request GET \
  --url 'https://your-url/v2/plates/?_q=%20%7B%22position%22%3A%7B%22%24nearSphere%22%3A%7B%22from%22%3A%5B9.18%2C45.43%5D%2C%22minDistance%22%3A0%2C%22maxDistance%22%3A1200%7D%7D%7D' \
  --header 'accept: application/json' \
  --header 'client-key: client-key'
```

The result will be sorted from the nearest from the farthest.

### Update

You can update one or more documents in a collection. The operations of the update are made by using a **PATCH** request:

In the body of the request you can use the following operators:

- `$set`
  This operator replaces the value of the field with specified value:  
  `{ $set: { <field1>: <value1>, ... } }`

- `$unset`
  This operator unsets a particular item value:  
  `{ $unset: { <field1>: true, ... } }`

- `$inc`
  This operator increments a field by a specified value:  
  `{ $inc: {<field1>: <amount1>, <field2>: <amount2>, ...} }`

- `$mul`
  This operator multiply the value of a field by a specified number:  
  `{ $mul: { <field1>: <number1>, ... } }`

- `$currentDate`
  This operator sets the value of a field to the current date:  
  `{ $currentDate: { <field1>: true, ... } }`
:::note
The field must be of type `Date`. The format of dates it's **ISO-8601**: YYYY-MM-DDTHH:mm:ss.sssZ
:::

- `$push`
  This operator appends a specified value to an array field:  
  `{ $push: { <field1>: {<prop1>: <value1>, <prop2>: <value2>, ...}, ... } }`

:::tip
The syntax is [MongoDB Field Update Operators](https://docs.mongodb.com/manual/reference/operator/update-field/) like.
:::

#### Update a single document

To update a single document use `PATCH` passing the *_id* of the document as path param.  
In the body you have to pass a JSON with the desired operators set.

The route to call is the following:

`PATCH` `https://your-url/<CRUD collection endpoint>/{id}`

**E.g**:

```curl
curl --location --request PATCH 'your-url.mia-platform.eu/v2/books/1f11d444830aaz0011526361' \
--header 'Content-Type: application/json' \
--data-raw '{
    "$set": {
        "title": "The Caves of Steel",
        "author: "Isaac Asimov"
    },
    "$inc": {
      "qta":1
    }
}'
```

:::caution
If you want to update an [Array RawObject property](#rawobject-and-array_rawobject-with-schemas) using the [positional operators](https://docs.mongodb.com/manual/reference/operator/update/positional-all/) `.$.merge` and `.$.replace`, you have to specify the position of the element by filtering by property with the [_q query param](#filters-with-mongodb-query).  
You have to filter the field by object/value. The value of the filter must be URL encoded. If the **filter matches multiple elements will be patched only the first occurrence**.

The following example replace the element of the property `arrayOfAuthors` containing the value `{"name:"wrongName"}` with the object `{"name":"author correct name"}`. The not encoded `_q` is `arrayOfAuthors={"name":"wrongName"}`:

```curl
curl --location --request PATCH 'your-url.mia-platform.eu/v2/books/1f11d444830aaz0011526361?_q=%7B%arrayOfAuthors%22%3A%7B%22name%22%3A%2222wrongName%22%7D%7D' \
--header 'Content-Type: application/json' \
--data-raw '{
    "$set": {
        "arrayOfAuthors.$.replace":{"name":"author correct name"},
    },
}'
```

This is valid for **all types of Array field**, including arrays of numbers and strings.
:::

#### Update multiple documents

To update multiple documents you have two possibilities:

- **Update multiple documents that match a query**  
  In order to do this, you have to use a **PATCH** request, filtering by query params the documents you want to update.  
  You can filter by fields values, the [_q query param](#filters-with-mongodb-query) and [STATE](#predefined-collection-properties) using `_st` param.  
  In the body you have to pass a JSON with the desired set of operators with with the new values.

  The route to call is the following:

  `PATCH` `https://your-url/<CRUD collection endpoint>/`

  **e.g.**:

  ```curl
  curl --location --request PATCH 'url.mia-platform.eu/v2/books/?category=sci-fi&_st=PUBLIC' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "$set": {
        "discount": true
      }
  }'
  ```

- **Update multiple documents, each one with its own modifications**  
  In order to do this, you have to use a **PATCH** request with an array as the request body.
  Each element represents a document to update and it's an object with the following properties:
  - `filter`
    Contains the filter conditions for select the document. As seen above you can filter by fields values, the [_q query param](#filters-with-mongodb-query) and `_st` param.
  - `update`
    Contains the update operators with the new values.

  The route to call is the following:

  `PATCH` `https://your-url/<CRUD collection endpoint>/bulk`

  **E.g**:

  ```curl
  curl --location --request PATCH 'url.mia-platform.eu/v2/books/bulk' \
  --header 'Content-Type: application/json' \
  --data-raw '[
    {
      "filter":{"_id":"1f11d444830aaz0011526361"},
      "update": {
        "$set": {
          "discount": true
        }
      }
    },   
    {
      "filter":{_id":"2f11d514830aaz0071523223"},
      "update": {
        "$set": {
          "discount": true
        }
      }
    }

  ]'
  ```

### Delete

You can delete one or more documents in a collection.

#### Delete a single document

To delete a single document use a **DELETE** request passing the *_id* of the document as path param.  

The route to call is the following:

`DELETE` `https://your-url/<CRUD collection endpoint>/{id}`

**e.g.**:

```curl
curl --location --request DELETE 'url.mia-platform.eu/v2/books/1f11d444830aaz0011526361'
```

#### Delete multiple documents

To delete multiple document you have to use a `DELETE` request filtering by query params the documents you want to delete.  
You can filter by fields values, the [_q query param](#filters-with-mongodb-query) and [STATE](#predefined-collection-properties) using `_st` param.  

The route to call is the following:

`DELETE` `https://your-url/<CRUD collection endpoint>/`

**e.g.**:

```curl
curl --location --request DELETE 'url.mia-platform.eu/v2/books/?category=sci-fi&_st=DRAFT'
```

### RawObject and Array_RawObject with schemas

Nested properties of a field of type `RawObject` and `Array_RawObject` can be used in REST APIs with object notation or dot notation.

Example of `PATCH` with dot notation

```curl
curl --location --request PATCH 'your-url.mia-platform.eu/v2/books/111111111111111111111111' \
--header 'Content-Type: application/json' \
--data-raw '{
    "$set": {
        "metadata.somethingArrayObject.0.anotherNumber": "3",
        "metadata.somethingObject.childNumber": "9"
    }
}'
```

Example of `PATCH` with object notation

```curl
curl --location --request PATCH 'your-url.mia-platform.eu/v2/books/111111111111111111111111' \
--header 'Content-Type: application/json' \
--data-raw '{
    "$set": {
        "metadata": {
          "somethingArrayObject": [
            {"anotherNumber": "3"}
          ],
          "somethingObject": {
            "childNumber": "9"
          }
        }
    }
}'
```

The two operation above have different effect.  
*"metadata.somethingObject.childNumber": "9"* assigns "9" to the field "childNumber".  

In the "Example with object notation" you are setting a value to the field *metadata*.  
So the field *metadata* will be exactly:

```js
{
  "somethingArrayObject": [
    {"anotherNumber": "3"}
  ],
  "somethingObject": {
    "childNumber": "9"
  }
}
```

Values will be casted based on the JSON Schema.  
So, if *childNumber* is *{ "type": "number" }*, it will be casted from string *9* to number *9*.

:::note
In the `$unset` operation of nested properties it's not made a validation that the properties you are unsetting are required or not, and the unset of a required property will be an error getting the document. Be careful when you use $unset on nested properties.
:::

Fields of type `RawObject` without a schema can also be used in REST APIs (e.g. in a *$set* of a *`PATCH`*) with dot notation. The field have to be valid against the following pattern *FIELD_NAME.* where *FIELD_NAME* is the name of the field. (e.g.: `*set: { "myObject.something": "foobar"}*`).

:::note
The pattern contains `.` and not `\.`, so it's "any character" and not "dot character". It's been kept in this way for retrocompatibility reasons
:::

The operators **.$.merge** and **.$.replace** can also be used on nested arrays.

Example of **$.replace** with a **PATCH bulk**:

```json
curl --location --request PATCH 'demo.mia-platform.eu/v2/books/bulk' \
--header 'Content-Type: application/json' \
--data-raw '{
    "filter": {
              "_id": "111111111111111111111111",
              "metadata.somethingArrayOfNumbers": 3
    },
    "$set": {
        "metadata.somethingArrayOfNumbers.$.replace": 5
    }
}'
```

This will update the item of the collection *books* with *_id* equals to 111111111111111111111111 and that have an item of the array *somethingArrayOfNumbers* inside *metadata* equals to 3.
It will be set to 5 the item of *somethingArrayOfNumbers* equals to 3.  

In case of array of object can also be used to **$.merge** operators.

```json
curl --location --request PATCH 'demo.mia-platform.eu/v2/books/bulk' \
--header 'Content-Type: application/json' \
--data-raw '{
    "filter": {
              "_id": "111111111111111111111111",
              "metadata.somethingArrayObject": {"anotherNumber": 3, "somethingElse": "foo"}
    },
    "$set": {
        "metadata.somethingArrayObject.$.merge": {"anotherNumber": 5}
    }
}'
```

This will update the item of the collection *books* with *_id* equals to 111111111111111111111111 and that have an item of the array *somethingArrayObject* inside *metadata* equals to *{"anotherNumber": 3, "somethingElse": "foo"}*.
It will be set to 5 the field *anotherNumber* of the item of *somethingArrayObject* that have matched the query of the filter (so that was equals to *{"anotherNumber": 3, "somethingElse": "foo"}*)

:::warning
The values of **$.replace** and **$.merge** does not support "dot notation". So cannot be done: *"something.$.merge": {"foo.bar.lorem": 5}*
:::

### CRUD Limits

CRUD service has the following limits:

- dimension of a single item in a collection: 16 MB
- default number of returned items of a collection from a GET: 200

### Response codes of CRUD

Below is a list of return codes typical of an API request:

- **2xx (Success category)**
Success status:
  - 200 Ok The standard HTTP response representing success for GET, PUT or POST.
  - 201 Created This status code should be returned whenever the new instance is created. E.g on creating a new instance, using POST method, should always return 201 status code.
  - 204 No Content represents the request is successfully processed, but has not returned any content.
- **3xx (Redirection Category)**
  - 304 Not Modified indicates that the client has the response already in its cache. And hence there is no need to transfer the same data again.
- **4xx (Client Error Category)**
  These status codes represent that the client has raised a faulty request.
  - 400 Bad Request indicates that the request by the client was not processed, as the server could not understand what the client is asking for.
  - 401 Unauthorized indicates that the client is not allowed to access documents, and should re-request with the required credentials.
  - 403 Forbidden indicates that the request is valid and the client is authenticated, but the client is not allowed access the page or resource for any reason. E.g sometimes the authorized client is not allowed to access the directory on the server.
  - 404 Not Found indicates that the requested resource is not available now.
  - 410 Gone indicates that the requested resource is no longer available which has been intentionally moved.
- **5xx (Server Error Category)**
  - 500 Internal Server Error indicates that the request is valid, but the server is totally confused and the server is asked to serve some unexpected condition.
  - 503 Service Unavailable indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance.
