---
id: rbac
title: Manage Permissions with RBAC
sidebar_label: RBAC Overview
---

import Mermaid from "./../../../../src/components/Mermaid";

:::caution
Release stage: **Preview**

This feature is still in an early development stage and may be subject to small bugs or breaking changes.
:::

## What is RBAC

Role Based Access Control (RBAC) is an authorization mechanism built on top of user Roles useful to decouple actions that user can perform (generally known as _permissions_) and their higher-level Role inside an information system.
RBAC allows you to define your custom permissions, group them by Roles and then assign those Roles to your users (or even groups of users).

Taking aside the security implications that adopting RBAC provides to your solution, one of the most important benefits (in comparison to a simplest ACL mechanism) is the governance capabilities it provides to your system administrators when dealing with what users using your platform may or may not be allowed to do.

Leveraging Mia-Platform already existing [authentication and authorization solutions](../../../development_suite/set-up-infrastructure/authorization-flow) RBAC is made available to your projects in the Console through a dedicated UI; all you need to do is head to the RBAC section (in the Design area) and enable it for your services.

In this page you can find further details on how RBAC works and how to properly configure it in your project.

## How to configure RBAC in your project

Inside the Design area a new section is available to manage RBAC configurations. This new section will present four different tabs:

- [**Overview**](#overview-tab): in this tab you can enable and configure the [RBAC sidecar](#rbac-service) for each service of your project;
- [**General Settings**](#general-settings-tab): in this tab you can control shared settings between all of your RBAC instances in the project (such as the version of the RBAC service or the [storage configuration](#rbac-storage))
- [**Permissions**](#permissions-tab): in this tab you can write and test your own permission policies (policies are written using the Rego language, more info [here](https://www.openpolicyagent.org/docs/latest/policy-language/);
- [**Manual Routes**](#manual-routes-tab): in this tab you can manually configure the permissions required by your service APIs (useful when your service does not expose an OpenAPI Specification)-

### Overview tab

Inside the Overview tab you can enable RBAC sidecar injection for any service that is available in your project. Moreover, since a new container will be deployed in your namespace, you can view and configure the following information:

- **Memory Request and Limit**: Memory request and Memory limit of the sidecar container
- **CPU Request and CPU Limit**: CPU request and CPU limit of the container of the sidecar

To enable RBAC sidecar injection for a specific service you have to use the **Enable RBAC** switch available in the table editing drawer. After enabling the RBAC you will be able to customize resources request and limit.

#### API Permission definition

Once you have enabled RBAC on one of your services, what you want to do is defining which permission is required by your service APIs; if your service
exposes OpenAPI 3 Specification you can use the **custom attribute** `x-permission` [described here](./rbac_api_configuration), otherwise if your service does not expose its API documentation and you don't plan to add it you can use the [Manual Routes configuration tab](#manual-routes-tab)

### General Details Tab

Inside the General Details tab you can change the RBAC sidecar service version and configure [RBAC Storage](#rbac-storage) information.

### Permissions Tab

In the **Permissions** tab can write your own permission policies that will be used by RBAC service needs to evaluate when receiving a new request.  

You will find a read-only that shows your current permissions; if you want to modify them or create new ones you can click on the button `Edit permissions` button that will open a modal with two different editor.

In the leftmost one you may write your permissions using the *Rego* language (more info [here](https://www.openpolicyagent.org/docs/latest/policy-language/)). The rightmost instead let you write tests for your permissions.

Once you had written your policies you can test them using the **Test** button.

:::info
We strongly suggest you to test your policies, you may notice that if you have written some tests you won't be able to save your changes until your tests are passed.
:::

You can find more information about [writing your own permissions here](./rbac_policies).

### Manual Routes Tab

If, for any reason, the service you wish to apply RBAC to does not expose any API documentation, or you don't have access to the codebase in order to implement
your own documentation API you can always provide a manual routes configuration to the RBAC sidecar.

In order to do so you can go to the Manual Routes configuration tab in the RBAC section and define your own routes by selecting the _Add New_ button.  
In the creation form you will be asked for a microservice name (to be chosen among the ones that you have selected RBAC sidecar injection enabled for), then you'll have to provide a verb and a path that identify the API invocation and at last the Allowed Permission that should be required for that API.

:::caution
While normally the RBAC sidecar will self-configure itself by consuming the API documentation of its target service, when you add a new manual route to the RBAC configuration for a microservice, that self-configuration functionality gets disabled, thus you're required to register all the routes that your service exposes.
:::

## Technical details

### RBAC Service

The RBAC Service is the core service that is responsible for handling permissions evaluations; it is thought to run alongside your application container (as a sidecar), to intercept traffic directed to your service and to reject unwanted/unauthorized API invocation.

<div style={{textAlign: 'center'}}>

![sidecar](img/sidecar.png)

</div>

In order to know which API should be exposed RBAC sidecar will try to fetch from the application services an OpenAPI 3 compliant specification. At this point RBAC Service will expose all your application service APIs and after performing user permission authorization decide whether the API invocation should be forwarded to the application service.

Below a sequence diagram that describes the main flow between a clients and the final custom service:

<Mermaid chart={`sequenceDiagram
title: RBAC sequence diagram for policy evaluation
participant client
participant rbac_service
participant custom_service
participant db
client ->> rbac_service: [subject, api_path]
activate rbac_service
rbac_service ->> db: get user permissions for resources
activate db
db ->> rbac_service: user permissions from bindings
deactivate db
alt user has not permissions
rbac_service ->> client: forbidden 403
else user has permissions
rbac_service ->> custom_service: api call with eventual filters
activate custom_service
custom_service ->> rbac_service: response
deactivate custom_service
rbac_service ->> client : response
deactivate rbac_service
end`}/>


### RBAC Storage

RBAC is configured by design to load Roles and Bindings from MongoDB, in order to properly configure MongoDB connection string and collection names head to the **General Settings** tab
change the values in the RBAC Storage card. These values are set by default to `{{MONGODB_URL}}`, `rbac-bindings` and `rbac-roles`; feel free to change the names to better suite your
naming conventions and standards.  

:::info
You have to provide the collection names you whish to use in your project, when you save the configuration the new collections will be created and will be visible in the **MongoDB CRUD** section.
:::

:::caution
If you whish to change the collection names in a second occasion you **must** manually delete the old ones.
:::

#### RBAC Data Models

As previously said Roles and Bindings collections are created when saving your configuration according to the ones specified in the [General Settings](#general-settings-tab), the collection data models are described here.

##### Roles

This collection contains all the roles needed in an organization with their specific permissions.

The collection fields are:

- **roleId** (string, required): the **_unique_** id of the roles
- **name** (string,required): name of the role
- **description** (string): description of the role
- **permissions** (string array, required): list of permissions ids for the role

```json
[
   {
      "roleId": "roleUniqueIdentifier",
      "name": "TL",
      "description": "company tech leader ",
      "permissions": [
         "console.project.view",
         "console.environment.deploy",
         "console.company.billing.view"
      ]
   }
]
```

##### Bindings

A Binding represents an association between a set of Subjects (or groups), a set of Roles and (optionally) a Resource.

:::note
A _Subject_ may represent a user or another application; its identifier is retrieved by the RBAC Service from the Mia-Platform standard header `miauserid`

Groups are retrieved by the RBAC Service from the Mia-Platform standard header `miausergroups`)
:::

In this collection there are stored all the bindings between a user or a groups of user and a resource with a certain role. The fields for this collections are:

- **bindingId** (string, required): **_unique_** id of the binding
- **groups** (string array): list of user group identifiers
- **subject** (string array): list of user ids
- **roles** (string array): list of role ids
- **permissions**: (strings) list of permission ids
- **resource**: (object) with properties `type` and `id`

```json
[
   {   
      "bindingId": "bindingUniqueIdentifier",
      "groups": [
         "team1"
      ],
      "subjects": [
         "bob"
      ],
      "roles": [
         "TLRoleId"
      ],
      "resource": {
         "id": "project1",
         "type": "project"
      },
   }
]
```
<br/>
