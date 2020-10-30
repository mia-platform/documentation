---
id: configure_doctor_service
title:  Configure Doctor Service
sidebar_label: Configure
---
As _core service_, the Doctor Service is easily deployable on every project by using the <a href="https://console.cloud.mia-platform.eu/" target="_blank">Api Console</a>. You just need to add the service and configure it's_configuration file_; we will see how, but first a short overview of_how the service works_.

## How the service works

The _Doctor Service_ is simply based on one file, the _configurations_ file.
With the configurations file it's easy to manage all services to `check-up`.
Specifically, the _Doctor_ allows the user to do two things:

1. `check-up` all services in the configurations file by simply call the _root_ path (e.g. <http://api.foobar.it/playground/check-up>);
2. `check-up` a subgroup of services by specify the tag &rarr; all services can have a list of _tags_ (optional) and the _Doctor_ will expose a dedicated route for each tag, that will return the `check-up` of services with that tag.

:::warning
**<u>NB</u>**. all the services call by the _Doctor_ **MUST** have the `/-/check-up` route.
:::

## Steps overview

Following an overview of the steps that you have to do to integrate the _Doctor Service_ in your project:

1. Build the configurations file of the _Doctor Service_
2. Create the service using the API Console
3. Configure the _Advanced configurations_
4. **Check-up'em all**

:::note
The following example is based on a _Playground_ project.
:::

### 1. Build the _configurations_ file

As [previously said](#How-the-service-works), the _Doctor Service_ just needs a _configurations_ file that has to follow this schema:

```json
{
  type: 'array',
  items: {
    type: 'object',
    required: ['hostname'],
    properties: {
      hostname: { type: 'string' },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      options: {
        type: 'object',
        properties: {
          prefix: {
            type: 'string',
            pattern: '^(\\/.*[A-Za-z1-9])?$',
            default: '',
          },
          port: {
            type: 'number',
            default: 80,
          },
          protocol: {
            type: 'string',
            default: 'http',
            enum: ['http', 'https'],
          },
        },
        default: {},
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
}
```

As specified into the schema, the tags property is optional &rarr; a _Doctor Service_ can have all services without tags and it still works on the root path.
Additionally, it is possible to specify an `options` object in order to furtherly manage how the `/-/check-up` route is called.  
The following options can be provided:  

* `prefix`: to specify a prefix to append before `/-/check-up` route. Default is an empty string.
* `protocol`: to specify a different protocol. Only `http` or `https` can be specified. Default is `http`.
* `port`: to specify a different port. Default is 80.

In the following example we will set just one tag, the core tag, just for core services:

```json
[
  { "hostname": "auth-service", "tags": ["core"] },
  { "hostname": "cms-backend", "tags": ["core"] },
  { "hostname": "crud-service", "tags": ["core"] },
  { "hostname": "microservice-gateway", "tags": ["core"] },
  { "hostname": "swagger-aggregator", "tags": ["core"] },
  { "hostname": "v1-adapter", "tags": ["core"], "options": { "prefix": "/api/v2", "port": 8888, "protocol": "https" } },
  { "hostname": "node-service" },
  { "hostname": "angular-service" },
  { "hostname": "react-service" },
  { "hostname": "java-service" },
]

```

This way, for `swagger-aggregator` service, doctor-service will call the `/-/check-up` route at `https://auth-service:8888/api/v2/-/check-up`.  

In this way, we should have the following routes:

- **`baseUrl/check-up`** &rarr; should return the `check-up` response of all services
- **`baseUrl/check-up/core`** &rarr; should return the `check-up` response just of services with the _core_ tag

The _configurations_ file is ready, let's continue.

### 2. Doctor Service creation on the API Console

Now it's time to create the real service.

Following the steps to create the services:

1. Open the API Console and choose the project
2. Click, on the left, on _Microservices_
3. Click on the **Create a Microservice** button
4. Search for _doctor service_ and click on the Doctor Service plugin button
5. Fill the form:
   - **Name**: the name of the service (in the example is **doctor-service**)
   - **Description**: the description of the service
6. Click on the **Create** button
7. Scroll down and click on _Add a configuration_
8. Edit the environment variable *SERVICES_LIST_PATH* and set */home/node/app/config/services.json*
9. Fill the form:
   - **Configuration name**: The name of the configuration (e.g. doctor-service-config)
   - **Runtime Mount Path**: The folder path where will be created the configuration. Set to */home/node/app/config/*
10. Click on _Add file_, fill Name with *services.json* and click on *Create*
11. Insert the [previously created](#1-Build-the-configurations-file) _configurations_ file into the just created file
12. Save (_Commit and generate_ button)

### 3. Check-up'em all

Now the `/check-up` route of the project is ready to be called like this:

- `projectBaseUrl/check-up` &rarr; for a _check-up_ of all services
- `projectBaseUrl/check-up/core` &rarr; for a _check-up_ of core services only (in this example)
