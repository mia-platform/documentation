## v5.9.1 (July 2,2020)

### New features

* **Design - CronJobs**        
    Now you can **create and manage custom configurations** for your CronJobs.

    ![cron-config](img/cron-config.png)

### Improvements

* **Design - Microservices**        
    In the microservice detail page, now you can **edit the tag** assigned from DevOps Console to the microservice. 
    
    ![microservice-tag](img/microservice-tag.png)

* **Marketplace**          
    The Marketplace **repositories on GitHub have been improved** with guides and tutorials for most of the template and examples. 

* **CMS - Timeline**        
    The concept of **hierarchy between checkpoints** has been introduced in the Timeline web application. You can now use the `level` property (`1` or `2`) in order to display them with different sizes.

* **Browsers**        
    DevOps Console visualization has been **aligned among different Browsers**. For the unsupported Browsers (IE), a new page is shown. To learn more about supported and unsupported browsers, please visit this [page](https://docs.mia-platform.eu/info/supported-browsers/) of Mia Platform Docs.

    ![browsers-message](img/browsers-message.png)

* **Design - Endpoint**        
    Now DevOps Console allows you to **create Endpoints with dots in the path**. 

* **Design - Endpoint**        
    With the new header and footer, Endpoint section has been aligned to CRUD, Microservices, Proxies and Cronjobs sections: the **Delete button is now at the footer of the page**.

    ![endpoint-header-footer](img/endpoint-header-footer.png)
    
### Fixes

!!! info

    Microservice Gateway has been updated to v5.2.0, which avoids unexpected restarts of the service caused by not supported content types.

* **Debug**      
    Debug section **does not show anymore the field undefined**.

### How to update your DevOps Console?

!!! warning

    In order to support multiple docker image registries, the environment variable `CUSTOM_PLUGIN_IMAGE_PULL_SECRET` has been renamed to `CUSTOM_PLUGIN_IMAGE_PULL_SECRETS` and now accepts a comma separated list of registries.

In case of on-premise Console, to use these features, you have to update:

* Deploy Service v1.1.1 (`nexus.mia-platform.eu/console/deploy-service:1.1.1`) 

* Console Backend v3.1.0 (`nexus.mia-platform.eu/api-console/backend:3.1.0`)

* Console Website v1.24.0 (`nexus.mia-platform.eu/api-console/website:1.24.0`) 

* Test Debug Website: v1.0.1 (`nexus.mia-platform.eu/console/test-debug-website:1.0.1`) 


## v5.9.0 (June 25,2020)

### New features

#### New Deploy area version

* **Compare services**        
    You can now **compare the services that you are going to deploy** with the services already deployed.

    ![deploy-service](img/deploy-service.png)

* **Experience**       
    **New deployment experience**: when you click the "Deploy" button a new modal appears to inform you about deployment progress.

    ![deploy-release](img/deploy-release.png)


#### Marketplace news

* **Marketplace**      
    The Marketplace repositories on GitHub have been improved with guides and tutorials for most of the template and examples. Moreover, the **new microservice** [Go Example](https://github.com/mia-platform-marketplace/Go-Hello-World-Microservice-Example/blob/master/README.md) is now available!

### Improvements

* **Design - Endpoints**      
    You can now define new endpoints with **dots inside the path**.

### Fixes

* **Design - Microservice**      
    The **switch from advanced to standard configuration is now allowed** also when the environment variable value contains superscripts not enclosed in quotation marks `"` or `'` (e.g. `{{nomeEnv}}`).

* **Design - Microservice**      
    When a microservice is created, the **default log parser value is correct** (default value is now `mia-json` from the list of new available parsers: `mia-json`, `mia-ngnix` and `not parsed`).

* **API Portal**      
    Fixed **rendering error** thrown when a new `number` property is added to a form.

* **API Portal**   
    Custom multipart fields are now **inserted in the request** towards the API.

!!! info

    API Portal has been updated to v1.11.2. To update your API Portal, you have to save the DevOps Console configuration and deploy.


### How to update your DevOps Console?

In case of on-premise Console, to use these features, you have to update:

* Console Backend v3.0.0 (`nexus.mia-platform.eu/api-console/backend:3.0.0`)          

* Console Frontend v1.23.0 (`nexus.mia-platform.eu/api-console/website:1.23.0`)       

* Kubernetes Service v1.4.2 (`nexus.mia-platform.eu/dev-portal/kubernetes-service:1.4.2`)    

* Deploy Website v1.3.1 (`nexus.mia-platform.eu/console/deploy-website:1.3.1`)       
       
* Deploy Service v1.1.0 (`nexus.mia-platform.eu/console/deploy-service:1.1.0`)          

