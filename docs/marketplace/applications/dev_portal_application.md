---
id: dev_portal_application
title: Dev Portal Application
sidebar_label: Dev Portal Application
---
A [Dev Portal](../../dev_portal/overview.md) is the interface between a set of APIs, SDKs, or other interactive digital tools, and their various stakeholders: it can be used to understand, interact, adopt, monitor, and govern new technologies.

In order to simplify the creation of a Dev Portal an Application is available in the Marketplace that allows the user to configure it in a few clicks.

## Instantiation steps

After having selected the Dev Portal application in the Marketplace, these steps have to be followed:

### 1. Dev Portal resources configuration

Once the name to the application has been given, these are the following steps shown by the creation wizard:

* configuration of the Dev Portal Backend microservice

* configuration of the Dev Portal Frontend Plugins microservice

* configuration of the Microlc Docusaurus Template microservice

For each step, the user can decide either to configure that new specific resource, or to add an existing microservice to the application.

### 2. Dev Portal resources creation

The final step of the configuration wizard summarizes which resources will be created and which ones will be linked to the application because already existent.

Then by clicking on Create button, the Dev Portal application will be created, and you can see it on its detail page into the Applications section.

### 3. Endpoint configuration 

Once the Dev Portal application has been created, the final step consists in configuring the endpoints.
Go to `Endpoints` section, and create the following endpoints:

#### 3.1 Endpoint configuration for Dev Portal backend

1. Create a new endpoint;
2. As `Base path`, use `/api/v1/microlc`;
   :::caution
   The endpoints exposed by the `Dev Portal backend` microservice must always be reachable at `/api/v1/microlc/...`: 
   as in the microservice we defined the environment variable `SERVICE_PREFIX=/`, here `/api/v1/microlc` is enough.
   :::
3. As type, use `Microservice`;
4. Select the microservice name used for the `Dev Portal backend`;
5. Complete the creation.

#### 3.2 Endpoint configuration for Dev Portal Frontend Plugins

1. Create a new endpoint;
2. As `Base path`, use `/`;
3. As type, use `Microservice`;
4. Select the microservice name used for the `Dev Portal frontend plugins`;
5. Complete the creation.

#### 3.3 Endpoint configuration for Microlc Docusaurus Template

1. Create a new endpoint;
2. Define the `Base path` as `/docusaurus-template/`.
3. As type, use `Microservice`;
4. Select the microservice name used for `Docusaurus`;
5. Complete the creation.

#### 3.4 Endpoint configuration for Microlc Docusaurus Template

1. Create a new endpoint;
2. Define the `Base path` as `/documentation/assets`.
3. As type, use `Microservice`;
4. Select the microservice name used for `Docusaurus`;
5. Complete the creation;
6. Assign to `Rewrite Base Path` the value `/assets`.

## Final result

After these quick steps, your Dev Portal application will start working.

:::info
   For more information about its usage, visit the dedicated [Dev Portal](../../dev_portal/overview.md) section.
:::
