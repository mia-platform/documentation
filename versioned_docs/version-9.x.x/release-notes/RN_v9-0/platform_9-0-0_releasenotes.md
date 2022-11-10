---
id: v9.0.0
title: Version v9.0.0 Release Notes
sidebar_label: v9.0.0
image: "img/release-note-link-preview.png"
---

_April 28, 2022_

## Console

### Breaking Changes

With Mia-Platform Console v9 the support to automatic migration of Core Services to Custom Microservices has been dropped. In fact, until Mia-Platform v8.x if your project had a `api-console-config.json` with version lower than `0.41.0`, Core Services where automatically migrated to appear among your microservices based on the ones enabled in your `enabledServices` field of your project.    
This means that if you had a `api-gateway: true` in your project with old `api-console-config.json`, when you opened the Console the configuration would be automatically upgraded to make the `api-gateway` appear among your services. 

With Mia-Platform Console v9 this will no longer happen, the affected `enabledServices` are:   
- [`crud-service`](/docs/runtime_suite/crud-service/overview_and_usage)
- [`swagger-aggregator`](/docs/runtime_suite/swagger-aggregator/overview)
- [`api-portal`](/docs/runtime_suite/api-portal/overview)
- [`microservice-gateway`](/docs/runtime_suite/microservice-gateway/overview)
- [`authorization-service`](/docs/runtime_suite/authorization-service/overview)
- [`api-gateway`](/docs/runtime_suite/api-gateway/overview)

:::note
All of these services are available in the [Marketplace](/docs/marketplace/overview_marketplace).
:::

This means that is also no longer supported project creation from [Project Templates](/docs/development_suite/set-up-infrastructure/create-project#create-a-template) with `api-console-config.json` version lower than `0.41.0`. If you are using project templates at such version, please update them before upgrading to `Mia-Platform Console v9`.  

### New features

#### Mia-Platform PaaS Console with unique login

Mia-Platform Console PaaS now is connected with the unique Mia-Platform login with SSO. 
Now, with the same credential, users have access to all the resources connected to your project: Console, Kubernetes, Gitlab, Kibana, Grafana and much more!

#### Renaming Tenant into Company

From Console v9, the commonly known Tenant has been renamed to Company.

#### User management and Roles assignment

User management has been integrated into the Console and allows assigning users an entire set of roles. Each role aims at regulating a series of capabilities, providing or not access to Console features thanks to specific permissions (i.e. access to `projects/companies/environments`, repository creation, deploy triggering, etc.). To know more about these permissions and how to assign roles to Console users [check out the user management documentation](../../development_suite/api-console/user-management).

User management is available only on users with enough privileges (Company Owners and Project Administrators) and can be done in two new sections that have been added within each Company and each Project.
In these sections it will be possible to add users, modify permissions and have a look at the users who have access to your Project and their capabilities.

![](../../development_suite/img/user-management/company_admin_portal.png)

#### Create proxy from Marketplace

It is now possible to create proxies from the Marketplace; more proxies will be added soon.

#### Search Public Variables

In the Public Variables section you can now search for Public Variable name in the table.

#### Cross Project Proxy through Kubernetes Service enabled on all projects

Cross Project Proxy through Kubernetes Service, introduced as a preview feature in the v7.8.1, are now stable and released officially. 
Cross Project Proxy through Nginx has been removed and automatically converted to the new one. 

#### Public Variables enabled on all Console installations

Public Variables section, previously released under a feature toggle on On-Premise installations, is now enabled permanently. 

### Bug Fix

#### Multi-log feature in Runtime Area

A bug of the tooltip on hover which displays information about the maximum number of selectable containers for the multi-log feature has been fixed.


## Fast Data

### Single View Creator Plugin & Low Code for On-Premise

Single View Creator Plugin and Single View Creator Low Code are now available out-of-the-box also for On-Premise installations.

### Bug Fix

- Low Code: \_\_string\_\_ constant now accepts any character and no more only lower-case characters. This fix is available since v5.3.3 of Real-Time Updater.


## Marketplace

### CRUD Service v5.2.2

A regression introduced in version v5.1.0 has been resolved. Now all the endpoints of a collection are correctly exposed.

### API Portal v1.16.2

With this new version, a bug of the service that caused problems with multi-part forms has been fixed.


## Backoffice v1.0.0

### New features

#### Analytics in iFrame

It is now possible to integrate analytics in the back office, using iFrames.

#### PDF visualization in browser

It is now possible to open and visualize PDF files in browser, without the need of downloading them.

### Improvements

#### Objects visualization

It is now possible to choose, from configuration, how to visualize objects. You can set a label that will be shown in the table.

#### Lookups in nested objects

Now lookups are supported in nested objects.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 6.0.0`.
