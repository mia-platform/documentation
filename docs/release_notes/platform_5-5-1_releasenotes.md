## v5.5.1 (April 6,2020)

!!! Bug  
    **Microservice-gateway returns 500** if endpoints return 200 without a response body or 204 with `allowUnknownResponseContentType` to false  
    Fixed in v5.5.2

 
### Improvements

* **Design - Microservices**  
  New you go directly to your git Repository from the DevOps Console selection **"View Repository" button** in microservice detail page.  
  Pay Attention: This button is present only in microservices created from Templates.
  ![view-repository](img/view-repository.jpg)     
  At this [link](https://docs.mia-platform.eu/development_suite/api-console/api-design/services/), you can find more details about microservices management.

* **Auth0 - CMS**  
  For each environment, CMS is able to **manage separated users on Auth0Client**: in other words, "Development" users can be seen only on Development environment and "Pre Production" users can be seen only on Pre Production environment. This feature is deployed with the version v2.3.0 of Auth0Client.

* **Log & Monitoring**  
  In the detail of each Pod, the user experience beyond the buttons "Refresh Logs" and "Restart Pod" has been improved.     
      
  At this [link](https://docs.mia-platform.eu/development_suite/monitoring/monitoring/), you can find more details about Logs and Pods Monitoring.

* **Design - Microservices**  
  Restyling of the card of microservice, created from Template or from Docker Image.

### Fixed

* **Microservice Gateway 5.1.3**  
  Now Microservice Gateway is able to manage the **error created when content-type is not correct**.
