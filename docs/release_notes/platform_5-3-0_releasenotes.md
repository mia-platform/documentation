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


## v5.3.0 (February 25,2020)

### UN-RELEASED Improve Performance for request without Hook

!!! warning
    This version is breaking if in the Advanced Section you have configured your custom configmaps not keeping proxyName and proxyUrl aligned (this problem has been fixed with the version 5.4.0).  

    An Example:    
    If the file `maps-proxyName.before.map`and the file `maps-proxyUrl.before.map` does not have the same route configured you cannot update the console.


We have improved the performance of the calls that do not have hooks by not passing them through the [Microservice Gateway Components](/runtime_suite/microservice-gateway/).
Now only routes that have configured hooks will pass through the Microservice Gateway. All others routes will only pass through the API Gateway and then go direct to the microservice.

### CMS - Configure your landing Page

Implemented landingPage management from cmsConfiguration object, now CMS can be configured to land on a specific service or collection.

[Read here how to configure it - Available from CMS v9.8.0](/business_suite/conf_cms/#set-up-git-to-have-the-cms-config-extensions)

### Improvements

  * **CMS(v9.8.0)**: Added configuration to hide the Dashboard page
  * **CMS(v9.8.0)**: Allow to set a custom label for Service section.

### Fixed

* **CMS (v9.8.0)**: If I try to delete a user from CMS, I get 404
* **CMS (v9.8.0)**: In the CMS the modify all does not open the correct modal
* **DevOps Console**: If the session has expired DevOps Console no longer redirects at login
* **DevOps Console**: The user, on clicking on an area close to a checkbox, must not enable or disable it
