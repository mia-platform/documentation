## Introduction
API is the acronym for *Application Programming Interface*. In recent years the RESTful API have become the main method to decouple the server part from the client side of an application software. A RESTful uses verbs HTTP protocol (GET, PUT, POST, DELETE) to manage a data model also called a resource.

In detail:

- GET: allows to read a resource or a list of resources
- POST: create a resource
- PUT: update a resource
- DELETE: delete a resource

## REST API ##

REST is an **architectural style for distributed systems**, which allows to expose resources through one or more HTTP / HTTPS routes.

It must respect the following characteristics:

* Client-server architecture

* Stateless

* Cacheability

* Layered system

* Uniform interface

This vademecum summarizes the principles and guidelines for the design of the REST API.

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


## CRUD Resource
An example of REST for the vehicle resource

**GET**

https://api.mia-platform.it/vehicles/

List of all vehicles. Filters through query parameters

**POST**

https://api.mia-platform.it/vehicles/

New vehicle entry

**PUT**

https://api.mia-platform.it/vehicles/{id}

Complete editing of the vehicle with id = {id}

**PATCH**

https://api.mia-platform.it/vehicles/{id}

Partial modification of the vehicle with id = {id}

**DELETE**

https://api.mia-platform.it/vehicles/{id}

Delete of the vehicle with id = {id}

## Nomenclature and Formatting
How to call and format routes, query parameters and model properties.

https://api.mia-platform.eu/vehicles/?city=Milan

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

```
The API describes resources, so the only place where actions should appear is in HTTP methods.
In URLs, use only the names. Instead of thinking about actions (verbs), it is often useful to think about putting a message
in a mailbox: for example, instead of putting the verb delete in the URL, consider sending a message to
delete a hero from the server-side deletion box.
```

In the next paragraphs we will see in detail how to design an API with Mia-Platform.

##Routes

* Names in English

* Names in the plural

* Names in lower case

* Separation of words by dash '-'

## Query parameters and data models
* Names in English

* Names in 'camelCase' format

!!! warning
    URLs must contain only resources (names) and not actions or verbs!



## Versioning
The versioning of the REST APIs is done by inserting the version in the path. Example: http://api.mia-platform.it/progetto/v1/api-del-progetto

### Versioning the APIs
There are several debates on versioning or not versioning the APIs. Both approaches have pros and cons.

- Not versioning the API allows to guarantee a continuity of service to all the clients that consume them and can access the end-points without having to change the endpoints
- Versioning the API allows you to introduce break changes without impacting on existing clients.

What we recommend is

```
Versioning only the major versions that lead to changes in the breakdown of the service and reduce the number of versions
supported in production at 2: that of current and discontinued use.
```

## Data Model
The data model is exchanged in the body of HTTP messages and is serialized using the JSON format(http://www.json.org/).

**GET**

https://api.mia-platform.it/vehicles/

Array of JSON Object

**POST**

https://api.mia-platform.it/vehicles/

Request: JSON Object

Response: JSON Object

**PUT**

https://api.mia-platform.it/vehicles/{id}

Request: JSON Object

Response: JSON Object

**PUT**
https://api.mia-platform.it/vehicles/bulk

Request: Array of JSON Object

Response: Array of JSON Object

**PATCH**

https://api.mia-platform.it/vehicles/{id}

Request: JSON Object

Response: JSON Object

**PATCH**

https://api.mia-platform.it/vehicles/bulk

Request: Array of JSON Object

Response: Array of JSON Object

**DELETE**

https://api.mia-platform.it/vehicles/{id}

Request: empty Body

Response: empty Body


## Answer Result
The outcome of a call is communicated via HTTP status code (RFC 2616).

**2xx**

Success, usually 200, 201 (new document created), 204 for empty body

**3xx**

Redirected

**4xx**

Application error, 400 incorrect syntax, 401 required user authentication, 403 request not allowed (possible even with authenticated user), 404 resource not found, 422 semantically incorrect.

**5xx**

Server error: in this case there is an unexpected situation, not manageable at the backend level or intentionally unmanaged.


The body contains the data model in the case of 2xx or, in other cases, a message that describes in particular the status code returned.
