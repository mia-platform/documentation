## Introduction
API is the acronym for *Application Programming Interface*. In recent years the RESTful API have become the main method to decouple the server part from the client side of an application software. A RESTful uses verbs HTTP protocol (GET, PUT, POST, DELETE) to manage a data model also called a resource.

In detail:

- GET: allows to read a resource or a list of resources
- POST: create a resource
- PUT: update a resource
- DELETE: delete a resource

## Guidelines
Exists good practices to design RESTFul APIs that have been consolidated over the years thanks to a rich one Open Source community. Below some good tips on API design. You can find more
details on the [Guideline of Zalando](http://zalando.github.io/restful-api-guidelines).

### The importance of designing APIs
Designing the API first and then implementing it is not against Agile principles.
On the contrary, it allows to speed up the development because it decouples the backend from the frontend and helps to parallelize developments and consequently also to incrementally release features. Initially, the UI will be interfaced with API implementations still in Draft. After a first evaluation of the API's ergonomics aside of the UI the API will evolve and the final server-side logic will be implemented.

![Approach without designing APIs with a platform](img/no-platform.png)

Approach without designing the APIs with a platform

![Approach designing APIs with a platform](img/with-platform.png)

Approach by designing APIs with a platform

In the two schemes you can see how to design an API and then agree a contract between frontend and backend. You can proceed in parallel by first providing mock data to the user interface and then, without changing the API, implement the server part. This approach has the advantage that the first versions of the API will be used and then receive feedback from who is implementing the client side of the application. Thanks to these feedbacks the APIs will be improved at a lower cost than making them change once all the server logic has been completed.

However, it is desirable to evolve the APIs as the user interface evolves. The Backend-for-Frontend pattern it is basic to make life easier at the frontend and to allow for performing and useful APIs.

### Use names to identify a resource
The first time an API is defined, we tend to think of the action that is done as if it were a service from
to call. Let's take an example, we want to make a game on super heroes and the first thing we want to do is to manage
the profile of a super hero. For example, to read all the erors we might want to write
```
/getAllHeroes
```

and then...


```
/addNewHero
/updateHero
/deleteHero
/deleteAllHeroes
/evolveHero
/evolveAllHeroes
```

... and do not finish here, there would be many end-points similar to these. All of these end-points would contain redundant actions.
As the system evolves, further endpoints would emerge and system maintenance would reach critical levels.

What's wrong with this approach?

*URLs should only contain resources (names) and not actions or verbs!*. For example the path */ addNewHero* contains
the *addNew* action and the resource called *Hero*.

So what would be the correct way?

*/ heroes* would be a good example, it does not contain actions but only the name. The next question is: how to tell the server
to perform actions on heroes? HTTP verbs come into play here.

The resources always use the *plural* and if we want to access only one resource we can pass the id in the URL.
For example:

`` `
- the GET method on path / heroes returns the list of all heroes
- the GET method on path / heroes / 100 returns the hero with id 100
- the DELETE method on path / heroes / 100 deletes the hero whose id is 100
- the POST meotod on path / heroes creates a new hero and returns the detail of the new hero created.
`` `

With this simple device the APIs are more concise and consistent!

This trick can be useful

`` `
The API describes resources, so the only place where actions should appear is in HTTP methods.
In URLs, use only the names. Instead of thinking about actions (verbs), it is often useful to think about putting a message
in a mailbox: for example, instead of putting the verb delete in the URL, consider sending a message to
delete a hero from the server-side deletion box.
`` `

In the next paragraphs we will see in detail how to design an API with Mia-Platform.

### Versioning the APIs
There are several debates on versioning or not versioning the APIs. Both approaches have pros and cons.

- Not versioning the API allows to guarantee a continuity of service to all the clients that consume them and can access the end-points without having to change the endpoints
- Versioning the API allows you to introduce break changes without impacting on existing clients.

What we recommend is

```
Versioning only the major versions that lead to changes in the breakdown of the service and reduce the number of versions
supported in production at 2: that of current and discontinued use.
```

### Base fields of a Resource {#base}

A Mia Platform resource has predefined and prevailed fields that are used for the management of the life cycle of the
given. If we create a resource without properties we will have a JSON like the following:

```
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

In detail:

- creatorId: id of the user who created the resource
- createdAt: long that expresses the date and time of creation of the resource in milliseconds since 1970
- updaterId: id of the user who last modified the resource
- updatedAt: long which expresses in milliseconds since 1970 the date and time of last update of the resource
- sync and trash: the sync and trash properties belong to every resource and are represented by numbers with a precise semantics.
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

### The data types of a resource

It is possible to specify fields of different types:

- String
- Numbers
- At your place
- DateTime
- ....
- GeoPoint, see RFC 7946: {
    "type": "Point",
    "coordinates": [longitude: Double, latitude: Double]
}

## Security of an API
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

## Consume an API
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

An example can be found on the [Mia Platform demo] website (https://preprod.baas.makeitapp.eu/swagger/).

### Creating a Resource

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

### Reading a list of resources

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
### Reading a single resource

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

### Sorting

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

### Pagination

It is possible to paginate a request by passing two parameters:
- skip: the record from which to start. The first has an index of 0
- limit: the number of records to be extracted in the query

For example:

```
curl -X GET https://your-url/heroes?{"$skip":0,"$limit":25} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```
returns the first 25 records of the list.

It is possible to compose sort and pagination.

```
curl -X GET https://your-url/heroes?{"$skip":0,"$limit":25,"$sort":{"name":-1}} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

Note: you can use the *mongoQuery* parameter in the query string instead of passing the mongo string directly url

```
curl -X GET https://your-url/heroes?mongoQuery={"$skip":0,"$limit":25,"$sort":{"name":-1}} \
-H "accept: application/json" \
-H "content-type: application/json" \
-H "secret: secret"
```

### Filters

Resources can be filtered using mongo queries. It is possible to filter in and or in cascade quoting all of them the properties of resources. [More details on the mongo site for queries on a resource](Https://docs.mongodb.com/manual/tutorial/query-documents/)

For example we can look for the super heroes of *female* sex that appeared before *1990* and that have super power *speed* or
the name has Marvel inside.

```
{"$and":[
    {"gender":"female"},
    {"year":{"$lt":631148400000}},
    {"powers":{"$regex":"speed","$options":"i"}},
    {"$or":[{"name":{"$regex":"Marvel","$options":"i"}}]}
  ]
}
```

### Updating a Resource

To update a resource it is sufficient to invoke a PUT passing in the body the resource to be updated with its *id*.
For example, if I add the super power *flight* to Ms. Marvel, I have to pass in the body the id and the array with the super powers

```
{"id":"ff447759-6a35-405d-89ed-dec38484b6c4",
"powers":["superhuman strength","speed","stamina","durability","energy projection and absorption","flight"]}
```

In return I get the updated resource

> Attenzione: se si vuole aggiornare una Risorsa inviare nel body solo le proprietà modificate per non sovrascrivere
> le proprietà modificate da altri.

### Deleting a Resource

To delete a resource I have two options:

 - Delete it permanently with a DELETE request
 - Put it in the trash

To put it in the trash can simply set *trash* to 1 (for details see the section [Base fields of a resource] (# base))

To delete it permanently

```
curl -X DELETE https://your-url/heroes/ -H  "accept: application/json" -H  "content-type: application/json" -H  "secret: secret" -d "{  \"id\": \"yourid\"}"
```

### Count of the number of resources

It may be helpful to know how many items contains a list of resources. For this purpose it is sufficient to invoke a GET on the /count of the resource

```
curl -X GET https://your-url/heroes/count -H  "accept: application/json" -H  "content-type: application/json" -H  "secret: secret"
```

returns

```
{
  "count": 3
}

```
Note: filters can be applied to the count

### Delete all Resources

It is possible to eliminate all the resources of a collection at a stroke. For this it is sufficient to invoke the DELETE with the endpoint /empty of the resource.

```
curl -X DELETE https://your-url/heroes/empty -H  "accept: application/json" -H  "content-type: application/json" -H  "secret: secret123"
```
## Document an API

The documentation of an API occurs in two ways:

- Automatically when creating a resource from the Modeller API
- By hand creating a *yaml* file in OpenAPI format called api.yaml and copying the file to the custom_plugin directory

To write a yaml file, we recommend using the online editor [https://editor.swagger.io/](https://editor.swagger.io/) or an extension of your favorite IDE.

Here is the example of api.yaml file for the *heroes* resource

``` yaml
swagger: '2.0'
info:
  description: description
  version: 1.0.0
  title: heroes
schemes:
  - http
  - https
consumes:
  - application/json
produces:
  - application/json
securityDefinitions:
  sid:
    type: apiKey
    name: sid
    in: header
paths:
  /heroes/:
    get:
      responses:
        '200':
          description: Success!
        '401':
          description: 'Unauthorized, use secret'
        '404':
          description: Resource not found
      security:
        - sid: []
      summary: Read
      description: Read and filter a resource
      parameters:
        - name: secret
          type: string
          in: header
          description: API secret
          default: secret
        - name: id
          description: Unique id
          in: query
          type: string
          required: false
          format: string
        - name: creatorId
          description: User id that has created the item
          in: query
          type: string
          required: false
          format: string
        - name: createdAt
          description: The date when the item has been created
          in: query
          type: number
          required: false
          format: number
        - name: updaterId
          description: Last user id that has modified the item
          in: query
          type: string
          required: false
          format: string
        - name: updatedAt
          description: The date when the item has been updated the last time
          in: query
          type: number
          required: false
          format: number
        - name: sync
          description: Status of the item
          in: query
          type: number
          required: false
          format: number
        - name: trash
          description: Indicate if the item is in the trash
          in: query
          type: number
          required: false
          format: number
        - name: name
          description: ''
          in: query
          type: string
          required: false
          format: string
        - name: powers
          description: ' the real type is array'
          in: query
          type: string
          required: false
        - name: skip
          in: query
          description: number of items to skip
          required: false
          type: integer
          format: int32
        - name: limit
          in: query
          description: max records to return
          required: false
          type: integer
          format: int32
        - name: mongoQuery
          description: >-
            Instead of using query string you can use a mongo query on the
            object. For example ?{id:myid}
          in: query
          type: string
          required: false
    post:
      responses:
        '200':
          description: Success!
        '401':
          description: 'Unauthorized, use secret'
        '404':
          description: Resource not found
      security:
        - sid: []
      summary: Create
      description: Create a new resource
      parameters:
        - name: secret
          type: string
          in: header
          description: API secret
          default: secret
        - name: args
          description: An object containing required fields. See datamodeller
          in: body
          required: true
          schema:
            $ref: '#/definitions/collection-schema-create'
    put:
      responses:
        '200':
          description: Success!
        '401':
          description: 'Unauthorized, use secret'
        '404':
          description: Resource not found
      security:
        - sid: []
      summary: Update
      description: Update a resource
      parameters:
        - name: secret
          type: string
          in: header
          description: API secret
          default: secret
        - name: args
          description: An object containing required fields. See datamodeller
          in: body
          required: true
          schema:
            $ref: '#/definitions/collection-schema-update'
    delete:
      responses:
        '200':
          description: Success!
        '401':
          description: 'Unauthorized, use secret'
        '404':
          description: Resource not found
      security:
        - sid: []
      summary: Delete
      description: Delete a resource
      parameters:
        - name: secret
          type: string
          in: header
          description: API secret
          default: secret
        - name: args
          description: An object containing required fields. See datamodeller
          in: body
          required: true
          schema:
            $ref: '#/definitions/collection-schema-delete'
  /heroes/count:
    get:
      summary: Count
      description: Count number of elements in collection
      responses:
        '200':
          description: Success!
        '401':
          description: 'Unauthorized, use secret'
        '404':
          description: Resource not found
      security:
        - sid: []
      parameters:
        - name: secret
          type: string
          in: header
          description: API secret
          default: secret
  /heroes/empty:
    delete:
      summary: Empty
      description: Remove all elements in the collection
      responses:
        '200':
          description: Success!
        '401':
          description: 'Unauthorized, use secret'
        '404':
          description: Resource not found
      security:
        - sid: []
      parameters:
        - name: secret
          type: string
          in: header
          description: API secret
          default: secret
definitions:
  collection-schema-read:
    type: object
    properties:
      id:
        description: Unique id
        type: string
      creatorId:
        description: User id that has created the item
        type: string
      createdAt:
        description: The date when the item has been created
        type: number
      updaterId:
        description: Last user id that has modified the item
        type: string
      updatedAt:
        description: The date when the item has been updated the last time
        type: number
      sync:
        description: Status of the item
        type: number
      trash:
        description: Indicate if the item is in the trash
        type: number
      name:
        description: ''
        type: string
      powers:
        description: ''
        type: array
  collection-schema-create:
    type: object
    properties:
      sync:
        description: Status of the item
        type: number
      trash:
        description: Indicate if the item is in the trash
        type: number
      name:
        description: ''
        type: string
      powers:
        description: ''
        type: array
  collection-schema-update:
    type: object
    properties:
      id:
        description: Unique id
        type: string
      sync:
        description: Status of the item
        type: number
      trash:
        description: Indicate if the item is in the trash
        type: number
      name:
        description: ''
        type: string
      powers:
        description: ''
        type: array
  collection-schema-delete:
    type: object
    properties:
      id:
        description: Unique id
        type: string

```

## Response codes of an API
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

##API with custom code

See the dedicated plugins section

##Events related to an API

After invoking HTTP verbs, you can invoke a nodejs script that can update other fields of the resource.
