## v5.10 (July 9,2020)

### New features

* **Project Creation for admin users**        
    Now project creation section is **enabled only for `admin` users**.

### Improvements

* **API Portal**            
    **Log errors for unfilled fields** at the opening of a route have been removed.

* **API Portal**        
    Category filter in the API Portal **does not show anymore the duplicated option** `All`.

* **API Portal tags for type and required properties**        
    **New tags** to identify the `required` properties and the `type` of each property in the API Portal.

    ![apiportal-strings](img/apiportal-strings.png)

* **Deploy - History**        
    In History section of Deploy, you can now **filter for Environment**.

    ![deploy-filter](img/deploy-filter.png)

### Fixes

* **Design - Microservices**        
    Documentation integration has been added in Microservice configuration section with the addition of links to **learn more about Memory resources and CPU resources**.

    ![link-resources](img/link-resources.png)

* **Design**            
    The menu resize icon does **not overlap the menu item expansion** anymore.


### How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:

* Console Backend v3.2.0 (`nexus.mia-platform.eu/api-console/backend:3.2.0`)          

* Console Website v1.25.0 (`nexus.mia-platform.eu/api-console/website:1.25.0`)       

* Deploy Website v1.4.0 (`nexus.mia-platform.eu/console/deploy-website:1.4.0`)       
       
