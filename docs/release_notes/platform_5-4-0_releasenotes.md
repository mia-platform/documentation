
## v5.4.0 (March 23,2020)

### Transition from Microservice Gateway

This version allows to handle the transition from Microservice Gateway: in particular, it can be defined, in each endpoint, which route is going to pass through Microservice Gateway.  

You can consult [here](https://docs.mia-platform.eu/development_suite/api-console/api-design/esponi_api/)  the guidelines about this new feature.

### Manage namespaces     

Now, it is also possible to manage different namespaces, related to the environment, on the same cluster: on the project of the Console, the field namespace is renamed projectId in order to define a namespace for each environment. 

### Improvements     
 
 * **Monitoring**
 
    "Delete POD" button is replaced by "Restart POD" button which relaunches the POD.     

### Fixed    

 * **Design - Endpoints**
 
    During the sorting, it is not considered the prefix /v2 of CRUD endpoints.  


 * **Design - CMS & Analytics**
 
    In the menu of CMS properties, it is not highlighted the selected property.
 
 * **Design - CMS & Analytics**

    The v1-adapter service, by converting the property id into the property _id at each level of the object, modifies each occurrency. With this fix, the modification of id is done only at the first level, avoiding to transform other properties that are called id.    
