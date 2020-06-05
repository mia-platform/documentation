# v5.8.0 (June 9,2020)

## New features

* **API Portal**       
    You can now call an Endpoint from DevOps Console **without specifying the headers**.

    ![API-portal-header](img/API-portal-header.png)

* **API Portal**      
    Now you can **download API specifications** in both OpenAPI3 3 and Swagger 2 format in Json and Yaml.


## Improvements

* **Design - CRUD**
    With the **new header and footer**, CRUD section has been aligned with Microservice and Cronjobs sections.

## Fixes

    
## How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:


Moreover, in case of on-premise Console you have to remove the following authentication services:

* `auth-service`

* `session-manager`

and add the new service `authentication-service` with its configurations.
