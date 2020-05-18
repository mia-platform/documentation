# v5.5.2 -1 Patch (April 10,2020)

!!! bug
    **Design page of DevOps Console was inaccessible cause by an update of GitLab**

    With GitLab version 12.9.2 file_path beginning with `/` failed. With this problem, the configuration files of the advanced services cannot be downloaded, so the Design area is inaccessible.

## Fixed

Remove initial `/` to `file_path` on requesting file to gitlab


# v5.5.2 (April 9, 2020)

## Improvements

* **Design - Microservices**  
  When a microservice is created using one of Mia-Platform templates or example, **the probes of that service are already compiled** and contactable by Kubernetes.

   ![view-repository](img/probes.png)

* Restyling of the following section, introducing the card component: Proxies, Create New Endpoint, API Pre/Post

## Fixed

* **Microservice Gateway Bug in v5.5.1**  
  To resolve it we have updated the following platform components:  

    * cms-backend  v2.0.1 we changed the /client-key response code from 200 to 204;
    * Microservice Gateway v5.1.5 no longer returns status code 500 if a service replies with status code 204. 
  
    !!! WARNING
        It is a breaking change for api returning 200 with an empty content-type when `allowUnknownResponseContentType` in microservice-gateway configuration is set to true.

    * auth-service v1.6.4 returns 204 on API /logout

* Fix to the menu hover with filters that did not make the text readable