## v5.9.0 (June 25,2020)

### New features

#### New Deploy area version

* **Compare services**        
    You can now **compare the services that you are going to deploy** with the services already deployed.

    ![deploy-service](himg/deploy-service.png)

* **Experience**       
    **New deployment experience**: when you click the "Deploy" button a new modal appears to inform you about deployment progress.

    ![deploy-release](hmg/deploy-release.png)


#### Marketplace news

* **Marketplace**      
    The Marketplace repositories on GitHub have been improved with guides and tutorials for most of the template and examples. Moreover, the new microservice **Go Example** is now available!

### Improvements

* **Design - Endpoints**      
    You can now define new endpoints with **dots inside the path**.

### Fixes

* **Design - Microservice**      
    The **switch from advanced to standard configuration is now allowed** also when the environment variable value contains superscripts not enclosed in quotation marks `"` or `'` (e.g. `{{nomeEnv}}`).

 **Design - Microservice**      
    When a microservice is created, the **default log parser value is correct** (default value is actually `mia-json` from the list of new available parsers: `mia-json`, `mia-ngnix` and `not parsed`).

 **API Portal**      
    Fixed **rendering error** thrown when adding a new `number` property to a form.

 **API Portal**   
    Custom multipart fields are now **inserted in the request** towards the API.

!!! info

    API Portal has been updated to v1.11.2. To udate your API Portal, you have to save the DevOps Console configuration and deploy.


### How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:

* Console Backend v3.0.0 (`nexus.mia-platform.eu/api-console/backend:3.0.0`)          

* Console Frontend v1.23.0 (`nexus.mia-platform.eu/api-console/website:1.23.0`)       

* Kubernetes Service v1.4.2 (`nexus.mia-platform.eu/dev-portal/kubernetes-service:1.4.2`)    

* Deploy Website v1.3.1 (`nexus.mia-platform.eu/console/deploy-website:1.3.1`)       
       
* Deploy Service v1.1.0 (`nexus.mia-platform.eu/console/deploy-service:1.1.0`)          

