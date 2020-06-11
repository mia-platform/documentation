# v5.8.0 (June 9,2020)

## New features

* **API Portal**        
    You can now call an Endpoint from DevOps Console **without specifying the headers**.

    ![API-portal-header](img/API-portal-header.png)

!!! info (nota task Ste)

    The exposed swagger is valid

* **API Portal - Example**        
    New section `Example` that **shows a response example** to a call with a specific route and method.

    ![APIportal-example](img/APIportal-example.png)

* **API Portal - Response area expansion**       
    Now you can **expand and collapse the response area** with its specific button in the upper left corner. 

    ![APIportal-response-area](img/APIportal-response-area.png)

* **API Portal**        
    If you want to pass an empty value, you have to leave the property empty and check the corresponding property in the button `Properties`: **checkbox system has been removed**.

    ![APIportal-checkbox](img/APIportal-checkbox.png)

## Improvements

* **Horizontal Launcher Menu**        
    You do not have anymore to open the launcher to switch from an area to another: now the **Launcher Menu is horizontal and always visible** in each area of DevOps Console.

* **API Portal - Collapse**        
    New management of **expansion and collapse of cards and properties through an arrow** near each copy.

    ![APIportal-collapse](img/APIportal-collapse.png)

* **API Portal - Menu**        
    API Portal menu has been moved from left to right.

    ![APIportal-menu](img/APIportal-menu.png)

* **Design - CRUD**
    With the **new header and footer**, CRUD section has been aligned with Microservice and Cronjobs sections.

* **Design - CRUD**
    Now you can **increase the VerticalMenu width** in the Design area.

## Fixes

* **Design - CRUD**
    **Alignment** of the `Required` checkbox position in the CRUD section.

## How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:


Moreover, in case of on-premise Console you have to remove the following authentication services:

* `auth-service`

* `session-manager`

and add the new service `authentication-service` with its configurations.
