---
id: create-new-library
title:  Create a new Mia service library
sidebar_label: Create a new Mia service library
---
Can't find a specific library? You can create a new one. You will find below the suggested guidelines to develop a complete library to facilitate the creation of your microservices.  

## Features

Your library should make the creation of  Microservices easier by providing functions and structures to take advantages of Mia-Platform features.

### HTTP client

The library should include an HTTP client which exposes HTTP verbs (`get`, `post`, `patch`, etc).

Moreover, to easily perform [**CRUD**](/development_suite/api-console/api-design/crud_advanced.md) operations it should also include a specific HTTP client to make relative requests, e.g:

* `get(...)`: `GET` */collectionName*
* `getById(...)`: `GET` */collectionName/{id}*
* `create(...)`: `POST` */collectionName/bulks*
* `deleteById(...)`: `DELETE` */collectionName/{id}*
* `POST` */v2/items/bulks*
* `DELETE` */v2/items/{id}*

Calling any [**service**](/development_suite/api-console/api-design/services.md) defined on the Platform project should be an important feature for the creation of microservices. To do this, the developer who will use your library should be able to call a route with some options.

Check out the related [Mia service Node.js library documentation](https://github.com/mia-platform/custom-plugin-lib/blob/master/docs/http_client.md) for an example.

### Decorators

The library should provide methods to declare and handle the [**Console decorators**](/development_suite/api-console/api-design/decorators.md).  
It should include methods for accessing the original HTTP request and response and change them, according to the [following rules](/development_suite/api-console/api-design/decorators.md).

Check out the [Mia service Node.js library decorators documentation](https://github.com/mia-platform/custom-plugin-lib/blob/master/docs/decorators.md) for an example.

### API documentation

The library should be able to expose auto-generated documentation for each endpoint. It should exist a dedicated endpoint where show the API documentation.

Check out the [Mia service Node.js library API documentation](https://github.com/mia-platform/custom-plugin-lib/blob/master/docs/apidoc.md) for an example.

### Logging

The library should be able to generate logs in JSON format, using appropriate levels. You can follow our [guidelines for logs](/getting-started/guidelines/guidelines-for-logs.md). Coherent logging allows you to properly view logs in [*Log & monitoring* section of Console](/development_suite/overview-dev-suite.md#log-monitoring) and to use them to create custom dashboards.

Check out the [Mia service Node.js logging documentation](https://github.com/mia-platform/custom-plugin-lib/blob/master/docs/logging.md) for an example.

## Documentation

Write clear and useful documentation is as important as to write good code. This will help who is using your library to interact with Mia-Platform easily.

This section contains specific guidelines to write the documentation of your Mia service library. We assume the documentation is integrated into the repository of the library. For a complete example, you can see [Mia service Node.js library](https://github.com/mia-platform/custom-plugin-lib).

### Organization of markdown files

The `README` file must be small and provide an overview of the library and the table of contents with links to the more detailed sections, that should be written in markdown in a separate `/docs` directory.

### Contents

The documentation of libraries should answer the following questions:

1. What does it do and why should I use it?
2. How can I easily and rapidly start to use it?
3. How can I put myself into a situation where to use the library with best practices?
4. How does it interact with Mia-Platform?

A simple documentation structure to address all these questions can be the following:

1. **Getting started**
2. **Set up the local development environment**
3. **Install**  - How to install/include the library.
4. **Kickoff Example** - A little example that immediately highlights the primary features of the library, explained step to step.
5. **Configurations** - Required configuration of environment variables and other items.
6. **Examples** - More advanced examples, with the instruction to easy launch them
7. **How to** - Each feature is explained in detail in related `/docs/Feature.md` file
    * Create your service
    * Declare routes
    * Add decorators
    * Call the other services on the Platform project
    * See API documentation
    * Testing
    * Logging
