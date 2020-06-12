# v5.8.0 (June 9,2020)

## New capabilities

### Authentication process review

* **OIDC Client**    (da dire ?)
    **OIDC Client microservice is now integrated in the DevOps Console** to allow multi app and multi provider login and logout.


* **OIDC Client**    (da dire ?)
    WIth the new authentication APIs you can

## New features

### New API Portal version

* **API Portal - Endpoint call**        
    You can now call an Endpoint from DevOps Console **without specifying the headers**.

    ![API-portal-header](img/API-portal-header.png)

!!! info (nota task Ste)

    The exposed swagger is valid

upload files da mettere?

* **API Portal - Example section**        
    New section `Example` that **shows a response example** to a call with a specific route and method.

    ![APIportal-example](img/APIportal-example.png)

* **API Portal - Response Area expansion**       
    Now you can **expand the response area** over the whole width of the page with its specific button in the upper left corner. 

    ![APIportal-response-area](img/APIportal-response-area.png)

* **API Portal - Properties management improvement**        
    The **checkbox system of properties has been removed**: now you can simply write in a textbox if you want to pass the corresponding property. If you want to pass an empty value, you have to leave the property empty and check the corresponding property in the button `Properties`.

    ![APIportal-checkbox](img/APIportal-checkbox.png)

* **API Portal - Collapse and expansion management**        
    New you can **expand and collapse cards and properties through an arrow** near each copy: `Expand` and `Collapse` buttons have been removed.

    ![APIportal-collapse](img/APIportal-collapse.png)

* **API Portal - Menu**        
    API Portal menu has been moved from left to right to simplify UX.

    ![APIportal-menu](img/APIportal-menu.png)

## Improvements

* **Horizontal Launcher Menu**             
    You do not have anymore to open the hamburger menu to switch from an area to another: now the **Launcher Menu is horizontal and always visible** in each section of DevOps Console.

    ![launcher-menu](img/launcher-menu.png)

* **Design - Microservices**              
    Now, when you are creating a microservice starting from Docker Image, you can **specify the port of the host** (e.g. `host:port/project/service:tag`) without being blocked by the validation of the field.

* **Design - CRUD**        
    With the **new header and footer**, CRUD section has been aligned with Microservices, Proxies and Cronjobs sections: the `Delete` button is now at the footer of the page.

    ![delete-crud](img/delete-crud.png) 

* **Design - CRUD**      
    Now you can **increase the VerticalMenu width** in the Design area.

    ![width-menu](img/width-menu.png)

* **Design - Endpoints**       
    New **info message** that specifies that POST decorators work only if the target endpoint replies with 2XX status code.

    ![info-decorators](img/info-decorators.png)

## Fixes

* **Design - CRUD**
    **Alignment** of the `Required` checkbox position in the CRUD section.

## How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:


Moreover, in case of on-premise Console you have to remove the following authentication services:

* `auth-service`

* `session-manager`

and add the new service `authentication-service` with its configurations.
