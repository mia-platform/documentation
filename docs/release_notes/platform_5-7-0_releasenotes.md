# v5.7.0 (May 12,2020)

!!! warning

    This version solves the breaking change of v5.6.1: Now CMS backend does not go in error. If you have configured 'cmsmenu' CRUD, the menu items will be shown in CMS since 'groups' property will be automatically added.

## New capabilities

* **Create and Manage Cronjobs**        
  This new section of Design area enables you to create from DevOps Console a new CronJob, a scheduled Job that will be executed periodically on a given schedule, and to manage it. [Here](https://docs.mia-platform.eu/development_suite/api-console/api-design/jobs-cronjob/) you can find more details about this new capability.

![test-cronjobs](img/test-cronjobs.png)


## New features

* **Design - Microservice**        
  This

## Improvements


* **Design**       
  **Restyling** of spaces in the Search bar in each section of Design area and the width of the input of each form.

## Fixed

* **CMS**     
  Now the 'export' functionality allows you to **download all the records**: there is no limitation to the number of records to download. Moreover, cms-site has been updated to version 9.8.1 and cms-backend to version 3.0.0.

* **CMS**     
  **Logout from CMS is fixed** and returns a feedback in case of error. Moreover, v1-adapter has been updated to version 2.4.0.

## How to update your DevOps Console?

In case of on-premise Console, to use the previous features, you have to update:  

* Console website @1.19.0

* Console backend @1.19.0

If you have a custom CMS, you have also to update it at v9.8.1.