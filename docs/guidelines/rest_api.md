## REST API ##

REST is an **architectural style for distributed systems**, which allows to expose resources through one or more HTTP / HTTPS routes.

It must respect the following characteristics:

* Client-server architecture

* Stateless

* Cacheability

* Layered system

* Uniform interface

This vademecum summarizes the principles and guidelines for the design of the REST API.

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
