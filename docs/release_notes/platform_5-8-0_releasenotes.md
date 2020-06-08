# v5.8.0 (June 9,2020)

## New features

* **API Portal**        
    You can now call an Endpoint from DevOps Console **without specifying the headers**.

    ![API-portal-header](img/API-portal-header.png)

* **API Portal**        
    New section `Example` that **shows a response example** to a call with a specific route and method.

    ![APIportal-example]()

* **API Portal**       
    Now you can **expand and collapse the response area** with its specific button in the upper left corner. 

    ![APIportal-response-area]()

* **API Portal**        
    If you want to pass an empty value, you have to leave the property empty and check the corresponding property in the button `Properties`: checkbox system has been removed.

    ![APIportal-checkbox]()

## Improvements

* **API Portal**        
    API Portal menu has been moved from left to right.

    ![APIportal-menu]()

* **Design - CRUD**
    With the **new header and footer**, CRUD section has been aligned with Microservice and Cronjobs sections.

## Fixes

    
## How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:


Moreover, in case of on-premise Console you have to remove the following authentication services:

* `auth-service`

* `session-manager`

and add the new service `authentication-service` with its configurations.
