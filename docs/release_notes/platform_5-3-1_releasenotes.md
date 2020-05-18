## v5.3.1 Patch (March 11,2020)

This release is a patch that includes only frontend improvements and updates.

### Improvements    

 * **Design**
 
    In the configuration of the save page, the infobox is added.    
    
 * **Design - CRUD**
 
    CRUD property table can now be displayed in alphabetic order.    
    
 * **Design - Microservices**
 
 Change the default exposeSwagger value (from false to true) in Create Custom Microservices from template.      

### Fixed

 * **Design - Microservices**
 
    "Delete" button for microservices is not visible.     
 
 * **Design - Microservices**
 
    The change of the docker image name of a microservice, switches also the docker image name of other microservices.   


## v5.3.1 (March 4,2020)

**Remove Breaking Change n v5.3.0 - disabled the skip of the Microservice Gateway**

!!! warning
    With this release, version 5.3.0 is no more breaking since each call (with or without hooks) has to pass through the Microservice Gateway Components and, therefore, not aligned configmaps are not broken.    
    We are working as quickly as possible to make these features available without being breaking.


### Improvements

  * **Design - Endpoints**
  
    Routes with or without the final / are both accepted.  
    
  * **Design - Microservices** 
  
    Restyling of microservices section with card layout
  
  * **Design - CRUD**
  
    Restyling of add new crud section with card layout
  
  * **Design - Microservices**
  
    Repository name gets filled automatically while writing the microservice name (internal Hostname) during microservice creation
  
  * **Design - Microservices**
  
    Alert Warning is no more shown in the centre of the page


### Fixed

  * **Console homepage**
  
    The console shows only the first 25 projects.    
  
  * **Focus on the menu voice** is not correct (for example, the user is on the section CRUD, but CRUD is not the voice of the menu shown as selected)
