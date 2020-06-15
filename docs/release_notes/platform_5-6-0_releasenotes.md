
## v5.6.1 (May 5,2020)

!!! bug
    **Error in cmsmenu**

    If you have configured 'cmsmenu' CRUD, the menu items will not be shown in CMS unless you manually add 'groups' property. The bug will be fixed in v5.7.0.

### New Features

* **Design - CRUD**    
  In the CRUD section, you can add and edit a property of an index by **selecting it from a list of available properties**.
  
  ![crud-index](img/crud-index.png)

* **CMS & Analytics**    
  In the CMS section, now it is possible to **filter by groups**, not only the pages attached to a CRUD, but also the micro frontends inserted in the Console.

* **Design - Microservice**       
  In Microservice Configuration section, you can now **manage Log Parser**: you can select which tool will be used by the platform to parse your microservice logs.


### Improvements

* **Create Project**   
  At the end of project creation, an animation will **celebrate its success**!

    ![rocket-animation](img/rocket-animation.png)

* **Alignment** of Mia Platform logo position and **restyling** of the collapsed and expanded Launcher menu on the Console.

### Fixed

* **Design - Proxies**     
  Reinstatement of the 'delete' button in the detail of each Proxy in order to allow you to **delete proxies** from DevOps Console.   

  ![proxies-delete](img/proxies-delete.png)

!!! warning

     By deleting a Proxy, you are also deleting the associated Endpoints, but not the generated configuration: you will have to manually delete it.

* **Projects**       
  **Filters applied to the projects in the Home section of DevOps Console are cleaned** when, after having selected a project, you go back to the Home section. In this way, it is clear that you have not lost some projects that are not included in the filter.
 
* If the **creation of a tag** is not successful, the error presented is complete and not cut: you will be able to understand the issue.

### How to update your DevOps Console?

In case of on-premise Console, to use the previous features, you have to update:  

* Console website @1.18.0

* Console backend @1.18.1

* Infrastructure website @1.2.2

## v5.6.0 (April 27,2020)

### Project Creation

This new feature enables you to **create a new project**, which lifecycle can be completely managed through the different areas of DevOps Console.

 With the button 'create project' in the Home section of DevOps Console, you can now **create your project in a few clicks** and in a short amount of time!

![create-project](img/create-project.png)

!!! warning

    To create a project, you need to have already set up your DevOps Console and have the following prerequisites configured:     
      - Tenant     
      - Template       

You can find more details about project creation at this [link](https://docs.mia-platform.eu/development_suite/set-up-infrastructure/create-project/) of Mia Platform Docs.
