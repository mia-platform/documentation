
# v5.3.0 (February 25,2020)

## UN-RELEASED Improve Performance for request without Hook

!!! warning
    This version is breaking if in the Advanced Section you have configured your custom configmaps not keeping proxyName and proxyUrl aligned (this problem has been fixed with the version 5.4.0).  

    An Example:    
    If the file `maps-proxyName.before.map`and the file `maps-proxyUrl.before.map` does not have the same route configured you cannot update the console.


We have improved the performance of the calls that do not have hooks by not passing them through the [Microservice Gateway Components](/runtime_suite/microservice-gateway/).
Now only routes that have configured hooks will pass through the Microservice Gateway. All others routes will only pass through the API Gateway and then go direct to the microservice.

## CMS - Configure your landing Page

Implemented landingPage management from cmsConfiguration object, now CMS can be configured to land on a specific service or collection.

[Read here how to configure it - Available from CMS v9.8.0](/business_suite/conf_cms/#set-up-git-to-have-the-cms-config-extensions)

## Improvements

  * **CMS(v9.8.0)**: Added configuration to hide the Dashboard page
  * **CMS(v9.8.0)**: Allow to set a custom label for Service section.

## Fixed

* **CMS (v9.8.0)**: If I try to delete a user from CMS, I get 404
* **CMS (v9.8.0)**: In the CMS the modify all does not open the correct modal
* **DevOps Console**: If the session has expired DevOps Console no longer redirects at login
* **DevOps Console**: The user, on clicking on an area close to a checkbox, must not enable or disable it
