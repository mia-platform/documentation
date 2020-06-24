## v5.9.0 (June 25,2020)

### New features

#### New Deploy area version

* **Compare services**        
    You can now **compare the services that you are going to deploy** with the services already deployed.

    ![deploy-compare-serv](himg/deploy-compare-serv.png)

* **Experience**       
    **New deployment experience**: when you click the "Deploy" button a new modal appears to inform you about deployment progress.

![deploy-release](hmg/deploy-release.png)


#### New Deploy area version

* **Marketplace**      
    The Marketplace experience on GitHub has been improved. Moreover, the new microservice **Go Example** is now available!

### Improvements

* **Design - Endpoints**      
    You can now create endpoints with **dots inside the name**.


### Fixes

* **Design - Microservice**      
    The **switch from advanced to standard configuration is now allowed** also in the case in which the environment variable does not contains superscripts (e.g. `{{nomeEnv}}` ).

 **Design - Microservice**      
    When a microservice is created, the **default log parser selection is on one of the new parsers**: `mia-json`, `mia-ngnix` and `not parsed`.

 **API Portal**      
    **Rendering error**, created while adding a new `integer` or `number` property, **has been removed**.

 **API Portal**   
    Custom multipart fields are now **inserted in the request**.


### How to update your DevOps Console?

