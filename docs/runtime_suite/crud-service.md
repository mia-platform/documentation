### CRUD Service ###

The CRUD Service is a microservice that serves to expose an HTTP API to perform CRUD operations (Create, Read, Update, Delete) on mongodb collections.
It is configured at startup through the definition of collections (one or more), to provide a consistent HTTP interface and to perform the validation of operations before executing them on the database.

The definition of a collection involves indicating the list and the type of fields and optionally specifying indexes.

![](img/crud.PNG)
