
# v5.5.3 (April 22,2020)

## Improvements

* **API Portal**      
  Now API Portal is **OpenAPI v3** compliant: all microservice swaggers are converted to OpenAPI v3 automatically. Moreover, APIExplorer has been integrated by adding support for *anyOf*, *oneOf*, *allOf* and *not* schemas. API-Portal service has been **updated to version 1.9.0**.

* **Home**    
  Now you can **select your favourite projects** by marking them with the new 'star' button!

  ![star-projects1](img/star-projects.png)

* **Restyling** of the following sections, introducing the card component: Replicas, API Key and CMS & Analytics.

* Improved **padding and scrolling** of cards and grids in order to enhance their correct visualization.

## Fixed

 * **Branches**    
  Changes, done from two different people on the same branch, are **no more overwritten**. This fix solves the overwrite case in which one person is modifying an advanced file and the other one is modifying a general configuration on the same branch.

 * **API Portal**   
  In the section 'Request' of each method, the message **shows the complete string**, and not only string ID. 

    ![request-string](img/request-string.png)

* **Branch Selection**     
  During the choice of the Branch, before entering the Design area, the button 'cancel' is **no more selectable with the 'Tab' key** of your keyboard.

* **Design - CRUD**     
  In the detail of each CRUD, the creation of an index with more than one field does **not comprimise anymore CRUD configuration**.

* **CMS**     
  The 'export' functionality allows you to **download all the records**: there is no more a limit to the number of records to download. Moreover, Crud service has been **updated to version 2.1.4**.

## How to update your DevOps Console?     

In case of on-premise Console, to use the previous features, you have to update:   

 * Console website @1.17.2

 * Console backend @1.17.1

 * Deploy website @1.0.9

 * Infrastructure website @1.2.0

 * Env var service @1.0.1

