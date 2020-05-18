# v5.5.0 (March 31,2020)

## Improvements

* **Design - Microservices**  
  During Microservice creation, **default values for GroupName are created**.  
  The initial selection of GroupName is on "Services", but, if needed, it can be changed.     
  ![group-name](img/group-name.jpg)      
  At this [link](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/), you can find more details about microservice creation from Template.

* **Design - Microservices**  
  Now you can **clone code repository directly from DevOps Console** selecting Clone button on Microservice design page. Clone supports both ssh and https.  
  Pay attention: this button is present only in microservices created from DevOps Console.    
  ![clone-button](img/clone-button.jpg)    
  At this [link](https://docs.mia-platform.eu/development_suite/api-console/api-design/services/), you can find more details about microservices management.

## Fixed

 * **Design**    
   **Titles in the Launcher** are not aligned with the titles of the Console sections. 

 * **Design - Microservices**    
   **Card and Card's titles** in Microservices Details are not aligned. 

 * **Design - CRUD/Microservices/Pre&Post**   
   During the typing of a description of a Collection, Microservice or Decorator, an error appears when a "space" is typed. The **description validators are removed**.

 * **Design - Crud/Proxies/Endpoints**   
   When the user wants to see the field's and type's detail, they seem to be disabled. **Border, cursor, color and background** of the input element are changed.
