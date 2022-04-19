---
id: backoffice_application
title: Backoffice Application
sidebar_label: Backoffice Application
---

In order to simplify the creation of the [Backoffice](../../business_suite/backoffice/overview.md) an Application is 
available in the Marketplace that allows the user to configure it in a few clicks.

## Instantiation steps

After having selected the Backoffice application in the Marketplace, these steps have to be followed:

### 1. Backoffice resources configuration

Once the name to the application has been given, these are the following steps shown by the creation wizard:

* configuration of the Microlc Frontend microservice

* configuration of the Backoffice Backend microservice

* configuration of the Microlc Element Composer Plugin microservice

* configuration of the Back Kit microservice

For each step, the user can decide either to configure that new specific resource, or to add an existing microservice to the application.

### 2. Backoffice resources creation

The final step of the configuration wizard summarizes which resources will be created and which ones will be linked to the 
application because already existent.

Then by clicking on Create button, the Backoffice application will be created, and you can see it on its detail page into the
Applications section.

### 3. CRUD creation

The Backoffice application is shipped with an example page, the configuration of which can be found in the `cms-page.json`
config map of the Backoffice Backend microservice. This configuration is built on a CRUD with a specific schema (outlined
in the `dataSchema` object at the beginning of the file), which needs to be created.

Go to the `CRUD` section and create a new collection named however you like with the following fields:

* `name`: String
* `surname`: String
* `email`: String (required)

You can create the fields importing this <a download target="_blank" href="/docs_files_to_download/backofficeApplicationCrud.json">JSON file</a> 
and following [this guide](../../development_suite/api-console/api-design/crud_advanced#how-to-create-the-fields-of-your-crud-by-importing-a-json).

### 4. Endpoints configuration

The next step consists in configuring the endpoints. Go to `Endpoints` section, and create the following endpoints:

#### 3.1 Endpoint configuration for Backoffice Backend

1. Create a new endpoint;
2. As `Base path`, use `/api`;
   :::caution
   The endpoints exposed by the `Backoffice Backend` microservice must always be reachable at `/api/v1/microlc/...`:
   as in the microservice we defined the environment variable `SERVICE_PREFIX=/v1/microlc/`, here `/api` is enough.
   :::
3. As type, use `Microservice`;
4. Select the microservice name used for the `Backoffice Backend`;
5. Complete the creation.

#### 3.2 Endpoint configuration for Microlc Frontend

1. Create a new endpoint;
2. As `Base path`, use `/`;
3. As type, use `Microservice`;
4. Select the microservice name used for the `Microlc Frontend`;
5. Complete the creation.

#### 3.3 Endpoint configuration for Microlc Element Composer Plugin

1. Create a new endpoint;
2. As `Base path`, use `/element-composer`;
3. As type, use `Microservice`;
4. Select the microservice name used for the `Microlc Element Composer Plugin`;
5. Complete the creation.

#### 3.4 Endpoint configuration for Back Kit

1. Create a new endpoint;
2. As `Base path`, use `/back-kit`;
3. As type, use `Microservice`;
4. Select the microservice name used for the `Back Kit`;
5. Complete the creation.

#### 3.4 Endpoint configuration for CRUD collection

1. Create a new endpoint;
2. As `Base path`, use anything you want;
3. As type, use `CRUD`;
4. Select the CRUD created in [step 3](#3-crud-creation);
5. Complete the creation.

### 5. Backoffice Backend configuration

The last step consists in hooking up the example configuration of the Backoffice Backend with the CRUD created.

1. Go to `Microservices` section and open the Backoffice Backend microservice
2. Scroll down to the `cms-page.json` config map
3. Substitute `YOUR_CRUD_NAME` with the endpoint created at [step 3.4](#34-endpoint-configuration-for-crud-collection)

## Final result

After these quick steps, your Backoffice application will start working.

:::info
For more information about its usage, visit the dedicated [Backoffice](../../business_suite/backoffice/overview.md) section.
:::
