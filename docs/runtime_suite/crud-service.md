# CRUD Service

CRUD acronym stays for Create-Read-Update-Delete. The CRUD service purpose is to abstract a Data Collection allowing developers to expose CRUD APIs over the database in an easy, scalable and secure way. 

It's possible to configure CRUD Service with more that one collection and to scale it horizotally.


In this section you will learn how to configure, deploy and use Mia-Platform CRUD Service.

## Introduction

The CRUD Service is a microservice that exposes via Restful API a set of MongoDB Collection. [CRUD Service is configured in the DevOps Console (follow this link for more details)](/api-console/crud-advanced).

Via APIs it's possible to:

- read a collection and filter results;
- find elements of a collection using MongoDB query syntax;
- count number of elements in a collection;
- create a new element in a collection (also with a bulk action);
- update one or more elements of a collection;
- delete one or more elements of a collection;

The following guide will help you to get familiar with the APIs of the CRUD Service.

![API Portal](img/crud-api-portal.png)

> Remember: the API Portal visualize all API configured and esposed by CRUD.

## Configure a CRUD in two minutes

In DevOps Console it's possible to configure the CRUD service. The task it's easy. The steps are:

- open DevOps Console project Design Section
- select CRUD menu
- press Create new CRUD button
- configure CRUD
- select Endpoints menu
- press Create new enpoint
- configure the endpoint selecting the CRUD created
- press Commit&Generate button and save the configuration in the preferred branch
- select Deploy menu
- select the environment and branch to deploy and deploy it
- in less than one minute the new endpoint that exposes the confgiured CRUD service is available
- select Documentation menu and open the API Portal, browse the CRUD endpoint deplyed

 For more details [see here](/api-console/crud-advanced).

 ------------------------------------------------------------

## CRUD Collection Properties

Some collection field properties are predefined, others are custom and can be configured with different data types.

All properties can be indexed to speed up the data retrieval. The indexes configuration can be set in DevOps Console/Design/CRUD section.

### Predefined Collection Properties

CRUD by default comes with a set of common properties that simplify the data management:

- **_id**: unique ObjectId or String of the single item of the collection
- **creatorId**: String, id of the user who created the item
- **createdAt**: Date, date and time when the item has been created
- **updaterId**: String, id of the user who last updated the item; this information is overwritten every time the item is updated
- **updatedAt**: Date, date and time when the item has been updated; this information is overwritten every time the item is updated
- **`__STATE__`**: String, is the current state of the document, can be one of PUBLIC, DRAFT, TRASH, DELETED. The state of the document can't be set directly, but can be changed via REST API calls. Only some transformations are allowed, such as DRAFT -> PUBLIC, while others are not.

#### Example of a Collection with only predefined Properties

If you create a CRUD without any configuration in the DevOps Console you will create a schema with the predefined properties. When you POST on that CRUD you will obtain the following item.

```bash
curl --request GET \
  --url https://your-url/v2/empty/ \
  --header 'accept: application/json' \
  --header 'secret: secret'
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

#### ```__STATE___``` management

**```__STATE__```** is a special field that allows the Mia-Platform CRUD Service to manage a simple publishing workflow. The ```__STATE__``` field can assume the following values:

##### STATE values

- **PUBLIC**: the item is visible without specifing the value of ```_st``` in the querystring
- **DRAFT**: the item is in draft status, to retrieve the item you need to specify in the querystring the parameter ```_st=DRAFT```
- **TRASH**: the item is *soft deleted*; you can still query this item specifying in the querystring  ```_st=TRASH```. The Mia-Platform Headless CMS will visualize this element in the Trash section and it's possible to recover it.
- **DELETED**: the item is *deleted*; you can still query this item specifying in the querystring  ```_st=DELETED```. The Mia-Platform Headless CMS  not visualize this element and it is possible to recover it only programmatically.

By default, when a new itam in CRUD is added via POST, the item status is DRAFT. It's possible to change this behaviour in the endpoint section of the CRUD changing the default beahviour to PUBLIC.

It is possible to enable *hard delete* function to delete permanentely an item from the CMS.

##### State Transitions

Only the following transitions are allowed in the publish workflow. 

|  Sorce/Destination | PUBLIC  |  DRAFT | TRASH  | DELETED  |
|--------------------|---------|--------|--------|----------|
| PUBLIC             |    -    |   OK   |   OK   |          |
| DRAFT              |  OK     |   -    |   OK   |          |
| TRASH              |         | OK     |   -    |   OK     |
| DELETED            |         |        |   OK   |   -      |

To transit the STATE of an item of a CRUD you need to POST it

```json
 POST /[COLLECTION_NAME]/{_id}/state
 ```

for example

 ```bash
 curl --request POST \
  --url https://demo.cloud.mia-platform.eu/v2/empty/5e8a125eb74dbf0011444ed3/state \
  --header 'content-type: application/json' \
  --header 'secret: secret' \
  --data '{"stateTo":"PUBLIC"}'
```

update from DRAFT (default state) to PUBLISH the collection item 5e8a125eb74dbf0011444ed3.

### Collection Properties Types

When a new property is added to a collection it is possible to specify the following types:

- String: UTF-8 character set
- Number
- Boolean
- GeoPoint

```json
  {
    "type": "Point",
    "coordinates": [longitude: Double, latitude: Double]
  }
```

- Date
- Object
- Array of Strings
- Array of Numbers
- Array of Objects

### Collection Item Propoerties properties

Each property can defined as:

- **required**: the property cannot be empty
- **cryped**: the property is crypted at rest
- **nullable**: the property can be null

### Indexes

A property can be indexed. In DevOps Console/Design/CRUD it can be configured the following indexes:

- **normal**: speedup the filter on that property and the sort (desc or asc)
- **geo**: for geospatial search
- **ttl**: is a special single-field indexes that CRUD can use to automatically remove documents from a collection after a certain amount of time

The index can be unique. If set the value of the property must be unique in the collection.

## CRUD Headers

The CRUD service accept the following header:

- ***acl_rows***: an array of mongodb queries that limits the items that a request can return. The value of acl_rows is a stringified JSON, which is in AND with the querystring. Example:

```json
acl_rows: JSON.stringify([{ price: { $gt: MATCHING_PRICE } }])
```

- ***acl_read_columns***: the list of properties to return in the result. It is an array of strings. Example:

```json
acl_read_columns: JSON.stringify(['name', 'author', 'isbn'])
```

Usually this is used by PRE/POST Orchestrator to manage concatenated requestes to CRUD.

## CRUD Security

### Expose a CRUD Service

CRUD must not be exposed directly to the Internet but always must be protected by the API Gateway or a BFF.

### CRUD ACL

TODO

#### Rows ACL

TODO

#### Columns ACL

TODO

------------------------------------------------------------

## CRUD Endpoints

APIs configured with Mia-Platform can be consumed with any technology that supports HTTP protocol. For tests during development we recommend one of the following tools:

- [curl](https://curl.haxx.se/)
- [insomnia](https://insomnia.rest/)
- [postman](https://www.getpostman.com/)

In the examples for brevity we will use curl. Following are the typical operations that can be done with an APIRestful CRUD created with Mia-Platform.

*Note*: all of these examples can be tested using the API Portal of Mia-Platform. The Portal can be accessed using DevOps Console.

It follows the details about C-R-U-D operations.


///////////////////////////////////////////////////////////
CONTINUE FROM HERE 
///////////////////////////////////////////////////////////

### Create

To create a resource it is sufficient to send a *POST* request to the endpoint passing in the body the information of the
resource that you want to create.

```bash
curl -X POST https://your-url/heroes/ \
-H  "accept: application/json" \
-H  "content-type: application/json" \
-H  "secret: secret" -d "{  \"name\": \"Capitan America\",  \"powers\": [    \"agility\", \"strength\", \"speed\", \"endurance\"  ]}"
```

- ***userId***: the user identifier that do the update

Usually this is used by PRE/POST Orchestrator to manage concatenated request to CRUD.

## CRUD Security

### Expose a CRUD Service

CRUD must not be exposed directly to the Internet but always must be protected by the API Gateway or a BFF.

### Version Management

TODO v2

### API Secret

TODO

### CRUD ACL

TODO

#### Rows ACL

TODO

#### Columns ACL

TODO

------------------------------------------------------------

## CRUD Endpoints

APIs configured with Mia-Platform can be consumed with any technology that supports HTTP protocol. For tests during development we recommend one of the following tools:

- [curl](https://curl.haxx.se/)
- [insomnia](https://insomnia.rest/)
- [postman](https://www.getpostman.com/)

In the examples for brevity we will use curl. Following are the typical operations that can be done with an APIRestful CRUD created with Mia-Platform.

>*Note*: all of these examples can be tested using the API Portal of Mia-Platform. The Portal can be accessed using DevOps Console.

Let's see how to perform C-R-U-D operations.

All examples are sent to https://your-url Mia-Platfrom instance. We assume that the endpoints are only protected by API Key.

```json
secret: secret
```

If your endpoints are also protected by authentication and authorization you need to pass the access token to the curl command.

### Create

It's possible to create one or more documents in a collection. If in MongoDB the collection doesn't exist the collection is created automatically and the MongoDB indexes configured are create automatically. A document can be created in three different ways:

- inserting a single JSON document
- inserting or updating one JSON document
- inserting multiple JSON documents (bulk)

The JSON document sent to CRUD is validated against the JSON schema defined in DevOps Console before the insertion.

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
  --header 'secret: secret' \
  --data '{"name":"Spaghetti al Pomodoro","description":"The classic italian dish"}'
```

in response, you will get a JSON object like this:

```json
{
 "_id":"5e8ae13bb74dbf0011444ed5"
}
```

### Read

#### Read a list of resources

#### Insert or Update one document

If you are not sure if the document is already present in the collection, you can use the Insert or Update feature calling the endpoint upsert-one. You need to specify in query parameters all data to match eventually the existent document and in request body the JSON document you want to insert or update.

```bash
curl --request POST \
  --url 'https://your-url/v2/plates/upsert-one?name=Spaghetti%20allo%20Scoglio' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'secret: secret' \
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
  --header 'secret: secret' \
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

#### Read a single resource

#### Insert multiple documents

The bulk insert can be performed POST on CRUD a JSON **array** of documents. For example to add three dishes to plates collection you have to POST the /bulk on the resource.

```bash
curl --request POST \
  --url https://your-url/v2/plates/bulk \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'secret: secret' \
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

To read a collection, simply call the endpoint with a GET

```bash
curl -X GET https://your-url/v2/plates/ \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "secret: secret"
```

> Always end you request with a slash.  https://your-url/plates/ is correct.  https://your-url/plates is wrong.

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

To get just one document read only one element, simply pass the _id of the request

```bash
curl -X GET https://your-url/v2/plates/5df8aff66498d30011b19e4d \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "secret: secret"
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

#### Sort

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
  --header 'secret: secret'
```

> For sorting with more than one property use _q

#### Paginate

By default GET returns a limited number of documents. You can use pagination to return more documents. Pagination accepts filters and sorts parameters.

#### Paginate

- **_l**: limits the number of documents returned. Minimum value 1. Maximum value 200. If you pass more that 200, the CRUD Service truncate to 200 the result unless the environment variable named *CRUD_LIMIT_CONSTRAINT_ENABLED* is set to *false*.
- **_sk**: skip the specified number of documents. Minimum value 0. Maximum value is bigint.

This is an example of request that get *two documents per page* and you ask for the *third page* (skip 4 documents).

```bash
curl -X GET https://your-url/heroes/?{"$skip":0,"$limit":25} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```
returns the first 25 records of the list.

Combining _l and _sk you can paginate the request. If you want to visualize the number of pages in your UI you need also count with a request the number of documents.

```bash
curl -X GET https://your-url/heroes/?{"$skip":0,"$limit":25,"$sort":{"name":-1}} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

Note: you can use the *_q_* parameter in the query string instead of passing the mongo string directly url. The query bust be encoded in the URL

from

```json
{"$skip":0,"$limit":25,"$sort":{"name":-1}}
```

to

```
%7B%22%24skip%22%3A0%2C%22%24limit%22%3A25%2C%22%24sort%22%3A%7B%22name%22%3A-1%7D%7D
```

```bash
curl -X GET https://your-url/heroes/?_q=%7B%22%24skip%22%3A0%2C%22%24limit%22%3A25%2C%22%24sort%22%3A%7B%22name%22%3A-1%7D%7D \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

#### Filters with MongoDB Query

Resources can be filtered using mongo queries. It is possible to filter in and or in cascade quoting all of them the properties of resources. [More details on the MongoDB site for queries on a resource](Https://docs.mongodb.com/manual/tutorial/query-documents/)

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
curl -X GET https://your-url/heroes/?_q=%7B%22%24and%22%3A%5B%0A%20%20%20%20%7B%22gender%22%3A%22female%22%7D%2C%0A%20%20%20%20%7B%22year%22%3A%7B%22%24lt%22%3A631148400000%7D%7D%2C%0A%20%20%20%20%7B%22powers%22%3A%7B%22%24regex%22%3A%22speed%22%2C%22%24options%22%3A%22i%22%7D%7D%2C%0A%20%20%20%20%7B%22%24or%22%3A%5B%7B%22name%22%3A%7B%22%24regex%22%3A%22Marvel%22%2C%22%24options%22%3A%22i%22%7D%7D%5D%7D%0A%20%20%5D%0A%7D \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

#### Geospatial Queries

On CRUD service it's possible to filter data also for proximity using MongoDB Geospatial Queries.

To enable this feature you need to create an Position index on DevOps Console.

![Position Index](img/position-index.png)

When the index is created you can use $nearSphere. For example to search an hero near you, beetween 0 meters and 1200 meters from your position longitude: 9.18 and latitude: 45.46 (Milan, Italy), you can use this MongoDB query.

```json
{"position":
  {"$nearSphere":
     {"from": [9.18,45.43], "minDistance": 0, "maxDistance": 1200}
  }
}
```

to get the list of heroes just encode the query and use _q.

```bash
curl --request GET \
  --url 'https://your-url/heroes/?_q=%20%7B%22position%22%3A%7B%22%24nearSphere%22%3A%7B%22from%22%3A%5B9.18%2C45.43%5D%2C%22minDistance%22%3A0%2C%22maxDistance%22%3A1200%7D%7D%7D' \
  --header 'accept: application/json' \
  --header 'secret: secret'
  ```

The result will be sorted from the nearest from the farest.

#### Other Filters

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

> Aggregate cannot be used. To use aggregate please see MongoDB Reader.

#### Count

#### Other Filters

```bash
curl -X GET https://your-url/heroes/count -H  "accept: application/json" -H  "content-type: application/json" -H  "secret: secret"
```

returns

```json
{
  "count": 3
}
```

Note: filters can be applied to the count

### Update

To update a resource it is sufficient to invoke a PUT passing in the body the resource to be updated with its *id*.
For example, if I add the super power *flight* to Ms. Marvel, I have to pass in the body the id and the array with the super powers

```json
{"id":"ff447759-6a35-405d-89ed-dec38484b6c4",
"powers":["superhuman strength","speed","stamina","durability","energy projection and absorption","flight"]}
```

In return I get the updated resource

> Attention: if you want to update a Resource, send only the modified properties to the body to not overwrite
> properties modified by others.

#### Patching array items

#### Patching array items

  - Support for patching array documents. The `$set` command works properly on both primitive and `RawObject` document types, by using `array.$.replace` and `array.$.merge` as keys in the `$set` command object.
  This feature involves the following CRUD operations:
    - Patch by ID
    - Patch many
    - Patch bulk
  - `array.$.replace` Replace entirely the query-matching array document with the content passed as value.
  - `array.$.merge`   Edits only the specified fields of the query-matching array document with the content passed as value.

See below for some sample cURLs for **/PATCH** */books-endpoint/{:id}*   where ```_q={"attachments.name": "John Doe", _st: "PUBLIC"}```

**Case Merge**

```bash
curl -X PATCH "http://crud-service:3000/books-endpoint/5cf83b600000000000000000?_q=%7B%22attachments.name%22%3A%20%22John%20Doe%22%7D&_st=PUBLIC" -H "accept: application/json" -H "Content-Type: application/json" -d "{ "$set": { "attachments.$.merge": { "name": "renamed attachment" } }}"

```

**Case Replace**

```bash
curl -X PATCH "http://crud-service:3000/books-endpoint/5cf83b600000000000000000?_q=%7B%22attachments.name%22%3A%20%22John%20Doe%22%7D&_st=PUBLIC" -H "accept: application/json" -H "Content-Type: application/json" -d "{ "$set": { "attachments.$.replace": { "name": "renamed attachment", content: "Lorem ipsum dolor sit amet", "state": "attached" } }}"
```

#### Nullable function

!!! warning
    If at the time of the insert I specified a NULL field that I did not declare nullable converts it to 0 (integer) or empty string

### Delete

To delete a resource I have two options:

 - Delete it permanently with a DELETE request
 - Put it in the trash

To put it in the trash can simply set *trash* to 1 (for details see the section [Base fields of a resource] (# base))

To delete it permanently

```bash
curl -X DELETE https://your-url/heroes/ -H  "accept: application/json" -H  "content-type: application/json" -H  "secret: secret" -d "{  \"id\": \"yourid\"}"
```

#### Delete all Resources

It is possible to eliminate all the resources of a collection at a stroke. For this it is sufficient to invoke the DELETE with the endpoint /empty of the resource.

```bash
curl -X DELETE https://your-url/heroes/empty -H  "accept: application/json" -H  "content-type: application/json" -H  "secret: secret123"
```

#### JoinService

This  service provides the join feature against two models. That feature is served on /join/<type>/:from/:to/export, where:

- type: one-to-one or one-to-many or many-to-many
- from: the collection endpoint from which the join starts
- to: the collection endpoint which the join ends to

This API responses always in application/application/x-ndjson

------------------------------------------------------------

## How to use CRUD

TODO

### When use it

TODO

### When not use it

TODO

## Use CRUD in Microservices

TODO

### CRUD with Node.js

TODO

### Call with Java

TODO

### Call with Kotlin

TODO

### Call with Go

TODO

## Sync a CRUD offline

It is possible to sync a CRUD service and a device (mobile or app) after a connection lost and sync back data.

This feature will be available on Mia-Platform v6

------------------------------------------------------------

## CRUD Limits

CRUD service has the following limits:

- dimension of a single item in a collection: 16 MB
- default number of returned items of a collection from a GET: 200

## Response codes of CRUD

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
  - 401 Unauthorized indicates that the client is not allowed to access resources, and should re-request with the required credentials.
  - 403 Forbidden indicates that the request is valid and the client is authenticated, but the client is not allowed access the page or resource for any reason. E.g sometimes the authorized client is not allowed to access the directory on the server.
  - 404 Not Found indicates that the requested resource is not available now.
  - 410 Gone indicates that the requested resource is no longer available which has been intentionally moved.
- **5xx (Server Error Category)**
  - 500 Internal Server Error indicates that the request is valid, but the server is totally confused and the server is asked to serve some unexpected condition.
  - 503 Service Unavailable indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance.

## Further Readings

  TODO
