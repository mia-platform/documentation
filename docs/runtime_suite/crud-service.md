# CRUD Service

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

## Configure a CRUD in five simples steps

///// TODO

## CRUD fields {#base}

In DevOps Console it's possible to define the fields of a CRUD service [see here](/api-console/crud-advanced). Some fields are predefined others are custom and can be configured with different data types.

All fields can be indexed to speed up the data retrieval.

### Predefined fields

The common fields of all collections managed by CRUD are the following:

- **_id**: unique ObjectId or String of the single item of the collection
- **creatorId**: String, id of the user who created the item
- **createdAt**: Date, date and time when the item has been created
- **updaterId**: String, id of the user who last updated the item; this information is overwritten every time the item is updated
- **updatedAt**: Date, date and time when the item has been updated; this information is overwritten every time the item is updated
- **`__STATE__`**: String, is the current state of the document, can be one of PUBLIC, DRAFT, TRASH, DELETED. The state of the document can't be set directly, but can be changed via REST API calls. Only some transformations are allowed, such as DRAFT -> PUBLIC, while others are not.

#### Example of a Collection Item

If you create a CRUD without any configuration in the DevOps Console you will create a schema with the predefined fields. When you POST on that CRUD you will obtain the following item.

```json
{
    "creatorId": "public",
    "createdAt": 1504601216920,
    "updaterId": "public",
    "updatedAt": 1504601216920,
    "sync": 0,
    "trash": 0,
    "id": "86c32c9f-194e-46a1-b483-a07c118ff2fc"
  }
```

#### ```__STATE___``` management



### Data types

When a new field is added it is possible to specify fields of different types:

- String
- Numbers
- At your place
- DateTime
- ....
- GeoPoint, see RFC 7946: {
    "type": "Point",
    "coordinates": [longitude: Double, latitude: Double]

It is configured at startup through the definition of collections (one or more), to provide a consistent HTTP interface and to perform the validation of operations before executing them on the database.

The definition of a collection involves indicating the list and the type of fields and optionally specifying indexes.

In detail:


  The sync property can take 3 values: 0, 1 or 2.

    - 0: the resource is in the "normal" state: visible and synchronizable unless the value of trash;
    - 1: the resource has been modified locally and must be loaded on the BaaS. This value only makes sense on the client side, it should never appear on the BaaS.
    - 2: the resource is in the "draft" state (draft). The client application can choose (by configuration) whether or not to save this resource.

    The trash property can take 4 values: 0, 1, 2, -1.

    - 0: the resource is in the "normal" state: visible and synchronizable unless the value of sync;
    - 1, 2: the resource is in the "trash" state, ie it has not been physically deleted, but it should no longer be visible (2 = not visible even to CMS);
    - -1: the resource must be permanently deleted from the BaaS. This state only makes sense on the client side, it should never appear on the BaaS.

    A small consideration on sync == 1 and trash == -1: these two values ​​have significance only on the client side and serve for the correct synchronization of the collections, in particular for the push operation. These values ​​should never appear on the BaaS, for this reason, before loading a resource with sync == 1 it is necessary to set sync = 0, while when you have trash == -1 the operation to be performed on the BaaS is the definitive cancellation of the resource.

    | sync                  | trash                 | description               | action  |
    | --------------------- |---------------------- | ------------------------- | --------|
    | 1 (client reserved)   | 0	                    | Changed by the client	    | Upload data (with sync set to 0). If no errors then update local data else re-set sync to 1 and skip.|
    | 2	                    | 0	                    | Draft	                    | Depending on client configuration: keep/delete local data.|
    | 2	                    | 1	                    | Trash (CMS visible)	    | Delete local data.|
    | 2	                    | 2	                    | Trash (CMS not visible)   | Delete local data.|
    | 1	                    | -1 (client reserved)	| Deleted by the client	    | Delete remote data then, if no errors, delete local data.|
    | 1 (client reserved)   | 1	                    | Trashed by the client	    | Upload data (with sync set to 2). If no errors then delete local data else re-set sync to 1 and skip.|
    | -                     | -                     | Undefined	                | Delete local data or just skip.|

- id: UUID generated by mongo to identify the resource


## Secure a CRUD
The APIs can be protected in two ways:
 - with Secret key
 - with ACL

In detail

```
{
       "acl": {
           "access": {
               "users": [],
               "groups": [
                   "public"
               ]
           },
           "read": {
               "users": [],
               "groups": [
                   "public"
               ],
               "secreted": false
           },
           "create": {
               "users": [],
               "groups": [
                   "users"
               ]
           },
           "update": {
               "users": [
                   "creator"
               ],
               "groups": []
           },
           "delete": {
               "users": [
                   "creator"
               ],
               "groups": []
           },
           "secreted": true,
           "enabled": false
       }
   }
```
The secret key is configured in the file

```
credentials.json
```
and must be passed into the header

## CRUD endpoints
APIs configured with Mia-Platform can be consumed with any technology that supports HTTP procurement.
For tests during development we recommend one of the following tools:

- curl: [https://curl.haxx.se] (https://curl.haxx.se/)
- insomnia: [https://insomnia.rest] (https://insomnia.rest/)
- postman: [https://www.getpostman.com] (https://www.getpostman.com/)

In the examples for brevity we will use curl. Following are the typical operations that can be done with an APIRestful CRUD created with Mia-Platform.

*Note*: all of these examples can be tested using the swagger end-point of the Mia-Platform instance. The url is

`` `
https: // your-url / swagger /
`` `

An example can be found on the [Mia Platform demo] website (https://preprod.baas.makeitapp.eu/swagger/.

### CRUD Documentation

API Portal

### Create

To create a resource it is sufficient to send a *POST* request to the endpoint passing in the body the information of the
resource that you want to create.
```
curl -X POST https://your-url/heroes/ \
-H  "accept: application/json" \
-H  "content-type: application/json" \
-H  "secret: secret" -d "{  \"name\": \"Capitan America\",  \"powers\": [    \"agility\", \"strength\", \"speed\", \"endurance\"  ]}"
```

body is

```
{
  "name": "Capitan America",
  "powers": [
    "agility", "strength", "speed", "endurance"
  ]
}
```

in response, tou will get this resource:

```
{
    "creatorId": "public",
    "createdAt": 1504601266703,
    "updaterId": "public",
    "updatedAt": 1504601266703,
    "sync": 0,
    "trash": 0,
    "name": "Capitan America",
    "powers": [
      "agility",
      "strength",
      "speed",
      "endurance"
    ],
    "id": "ef02dcaa-7a2e-4c31-a505-c2cb014d769e"
  }
```

### Read

#### Read a list of resources

To read a resource, simply call the endpoint with a GET

```
curl -X GET https://your-url/heroes/ \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "secret: secret"
```

you will get a JSON array that contains all the resources of the resource. The sorting is by insertion

```
[
  {
    "creatorId": "public",
    "createdAt": 1504601033071,
    "updaterId": "public",
    "updatedAt": 1504601033071,
    "sync": 0,
    "trash": 0,
    "name": "Ms. Marvel",
    "powers": [
      "superhuman strength",
      "speed",
      "stamina",
      "durability",
      "energy projection and absorption",
      "flight"
    ],
    "id": "ff447759-6a35-405d-89ed-dec38484b6c4"
  },
  {
    "creatorId": "public",
    "createdAt": 1504601216920,
    "updaterId": "public",
    "updatedAt": 1504601216920,
    "sync": 0,
    "trash": 0,
    "name": "Groot",
    "powers": [
      "regenerate",
      "control plants",
      "fire resistant",
      "increase mass"
    ],
    "id": "86c32c9f-194e-46a1-b483-a07c118ff2fc"
  },
  {
    "creatorId": "public",
    "createdAt": 1504601266703,
    "updaterId": "public",
    "updatedAt": 1504601266703,
    "sync": 0,
    "trash": 0,
    "name": "Capitan America",
    "powers": [
      "agility",
      "strength",
      "speed",
      "endurance"
    ],
    "id": "ef02dcaa-7a2e-4c31-a505-c2cb014d769e"
  }
]
```
#### Read a single resource

To read only one element, simply pass the id of the resource you want to read to GET.

```
curl -X GET https://your-url/heroes/ef02dcaa-7a2e-4c31-a505-c2cb014d769e  \
-H  "accept: application/json"  \
-H  "content-type: application/json" \
-H  "secret: secret123"
```

you get the resource corresponding to id *ef02dcaa-7a2e-4c31-a505-c2cb014d769e*

```
{
	"creatorId": "public",
	"createdAt": 1504601266703,
	"updaterId": "public",
	"updatedAt": 1504601266703,
	"sync": 0,
	"trash": 0,
	"name": "Capitan America",
	"powers": ["agility", "strength", "speed", "endurance"],
	"id": "ef02dcaa-7a2e-4c31-a505-c2cb014d769e"
}
```

#### Sort

It is possible to sort the list of resources returned with a GET.

To sort a list of GET resources you need to pass the *sort* parameter to the querystring followed by a list of fields of sort. The sort has the syntax of a [mongo query](https://docs.mongodb.com/manual/reference/method/cursor.sort/).

```
curl -X GET https://your-url/heroes/?{"$sort":{"name":-1}} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

In this example, the resources are sorted by name in descending order. Passing 1 in ascending order.

Note: you can use the *mongoQuery* parameter in the query string instead of passing the mongo string directly
url

```
curl -X GET https://your-url/heroes?mongoQuery={"$sort":{"name":-1}} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

#### Paginate

It is possible to paginate a request by passing two parameters:
- skip: the record from which to start. The first has an index of 0
- limit: the number of records to be extracted in the query

For example:

```bash
curl -X GET https://your-url/heroes/?{"$skip":0,"$limit":25} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```
returns the first 25 records of the list.

It is possible to compose sort and pagination.

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

For example we can look for the super heroes of *female* sex that appeared before *1990* and that have super power *speed* or
the name has Marvel inside.

```bash
{"$and":[
    {"gender":"female"},
    {"year":{"$lt":631148400000}},
    {"powers":{"$regex":"speed","$options":"i"}},
    {"$or":[{"name":{"$regex":"Marvel","$options":"i"}}]}
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

It may be helpful to know how many items contains a list of resources. For this purpose it is sufficient to invoke a GET on the /count of the resource

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

  - Support for patching array items. The `$set` command works properly on both primitive and `RawObject` item types, by using `array.$.replace` and `array.$.merge` as keys in the `$set` command object.
  This feature involves the following CRUD operations:
    - Patch by ID
    - Patch many
    - Patch bulk
  - `array.$.replace` Replace entirely the query-matching array item with the content passed as value.
  - `array.$.merge`   Edits only the specified fields of the query-matching array item with the content passed as value.

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

## Response codes of CRUD

Below is a list of return codes typical of an API request:

- 2xx (Success category)
Success status:
  - 200 Ok The standard HTTP response representing success for GET, PUT or POST.
  - 201 Created This status code should be returned whenever the new instance is created. E.g on creating a new instance, using POST method, should always return 201 status code.
  - 204 No Content represents the request is successfully processed, but has not returned any content.
- 3xx (Redirection Category)
  - 304 Not Modified indicates that the client has the response already in its cache. And hence there is no need to transfer the same data again.
- 4xx (Client Error Category)
  These status codes represent that the client has raised a faulty request.
  - 400 Bad Request indicates that the request by the client was not processed, as the server could not understand what the client is asking for.
  - 401 Unauthorized indicates that the client is not allowed to access resources, and should re-request with the required credentials.
  - 403 Forbidden indicates that the request is valid and the client is authenticated, but the client is not allowed access the page or resource for any reason. E.g sometimes the authorized client is not allowed to access the directory on the server.
  - 404 Not Found indicates that the requested resource is not available now.
  - 410 Gone indicates that the requested resource is no longer available which has been intentionally moved.
- 5xx (Server Error Category)
  - 500 Internal Server Error indicates that the request is valid, but the server is totally confused and the server is asked to serve some unexpected condition.
  - 503 Service Unavailable indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance.
