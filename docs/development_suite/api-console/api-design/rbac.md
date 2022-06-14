---
id: rbac
title: Manage Permissions with RBAC
sidebar_label: RBAC Overview
---

import Mermaid from "./../../../../src/components/Mermaid";

## What is RBAC

Role Based Access Control (RBAC) is an authorization mechanism built on top of user Roles useful to decouple actions that user can perform (generally known as _permissions_) and their higher-level Role inside an information system.
RBAC allows you to define your custom permissions, group them by [Roles](#roles) and then assign those Roles to your users (or even groups of users).
Therefore, enabling RBAC in Console allows you to empower the level of your [Console permission management](../../../development_suite/console-levels-and-permission-management).

Taking aside the security implications that adopting RBAC provides to your solution, one of the most important benefits (in comparison to a simplest ACL mechanism) is the governance capabilities it provides to your system administrators when dealing with what users using your platform may or may not be allowed to do.

Leveraging Mia-Platform already existing [authentication and authorization solutions](../../../development_suite/set-up-infrastructure/authorization-flow) RBAC is made available to your projects in the Console through a dedicated UI; all you need to do is head to the RBAC section (in the Design area) and enable it for your services.

In this page you can find further details on how RBAC works and how to properly configure it in your project.

## How to configure RBAC in your project

Inside the Design area a new section is available to manage RBAC configurations. This new section will present four different tabs:

- [**Overview**](#overview-tab): in this tab, you can enable and configure the [RBAC sidecar](#rbac-service) for each service of your project;
- [**General Settings**](#general-settings-tab): in this tab, you can control shared settings between all of your RBAC instances in the project (such as the version of the RBAC service or the [storage configuration](#rbac-storage));
- [**Policies**](#policies-tab): in this tab, you can write and test your own policies (policies are written using the Rego language, more info [here](https://www.openpolicyagent.org/docs/latest/policy-language/);
- [**Manual Routes**](#manual-routes-tab): in this tab, you can manually configure the policies required by your service APIs (useful when your service does not expose an OpenAPI Specification).

### Overview tab

Inside the Overview tab you can enable RBAC sidecar injection for any service that is available in your project. Moreover, since a new container will be deployed in your namespace, you can view and configure the following information:

- **Memory Request and Limit**: Memory request and Memory limit of the sidecar container
- **CPU Request and CPU Limit**: CPU request and CPU limit of the container of the sidecar

To enable RBAC sidecar injection for a specific service you have to use the **Enable RBAC** switch available in the table editing drawer. After enabling the RBAC you will be able to customize resources request and limit.

#### API Permission definition

Once you have enabled RBAC on one of your services, what you want to do is defining which policy is required by your service APIs; if your service
exposes OpenAPI 3 Specification you can use the **custom attribute** `x-permission` [described here](./rbac_api_configuration), otherwise if your service does not expose its API documentation and you don't plan to add it you can use the [Manual Routes configuration tab](#manual-routes-tab)

### General Settings Tab

Inside the General Settings tab you can change the RBAC sidecar service version and configure [RBAC Storage](#rbac-storage) information.

### Policies Tab

In the **Policies** tab you can write your own policies that will be used by RBAC service to evaluate the incoming requests.  

You will find a read-only section that shows your current policies; if you want to modify them or create new ones you can click on the `Edit policies` button that will open a modal with two different editors.

In the leftmost one you may write your policies using the *Rego* language (more info [here](https://www.openpolicyagent.org/docs/latest/policy-language/)). The rightmost instead lets you write tests for your policies.

Once you had written your policies you can test them using the **Test** button.

:::info
We strongly suggest you to test your policies, you may notice that if you have written some tests you won't be able to save your changes until your tests are passed.
:::

You can find more information about [writing your own policies here](./rbac_policies).

### Manual Routes Tab

If, for any reason, the service you wish to apply RBAC to does not expose any API documentation, or you don't have access to the codebase in order to implement
your own documentation API, you can always provide a manual routes configuration to the RBAC sidecar.

In order to do so, you can go to the Manual Routes configuration tab in the RBAC section and define your own routes by selecting the `Add New` button.  
In the creation form, you will be asked for a microservice name (to be chosen among the ones that you have selected RBAC sidecar injection enabled for), then you'll have to provide a verb and a path that identify the API invocation and at last the `Allow Policy` that should be required for that API.

:::info
It's possible to add new manual route to register a permission for a group of paths using the wildcard (e.g. "/foo/*") and also to select the method ALL to register the same permission for all http methods of the inserted path, but pay attention to the [routes priority rules](#routes-priority)
:::

During or after the creation of a manual route, you will also be able to associate to it a **Rows Filter** or a **Response Filter**, described in depth in their dedicated sections:
- [**RBAC rows filtering**](#rbac-rows-filtering)
- [**RBAC response filtering**](#rbac-response-filtering)

To activate the filters, you can use the corresponding switch and then configuring them. In particular:
- `Row Filtering` uses the `acl_rows` value as **headerName**  by default, but you can set a custom value to replace it.
- `Response Filtering` requires instead the name of the filter policy used to evaluate the response received by RBAC sidecar. 

:::caution
While normally the RBAC sidecar will self-configure itself by consuming the API documentation of its target service when you add a new manual route to the RBAC configuration for a microservice, that self-configuration functionality gets disabled, thus you're required to register all the routes that your service exposes.
:::

### Routes Priority

When there are more manual routes that match a specific URL path, the **priority rules** help to resolve the conflict:

- **Rule1**: If the manual routes paths are different, that more specific wins.
- **Rule2**: If the manual routes paths are the same, the manual route with the most specific method wins.

```
EXAMPLE

Defined Manual routes
- GET  /foo/bar permission1
- ALL  /foo/*   permission2
- POST /foo/*   permission3
- ALL  /*       permission4

Paths to resolve
- GET /foo/bar   --> permission1 (Rule1)
- GET /foo/bar/  --> permission2 (Rule2)
- POST /foo/bar/ --> permission3 (Rule2)

```

### RBAC rows filtering

It may happen that for some of your APIs you need to filter out some results based on the permissions of the requesting user. This is the case in which we talk about rows filtering.  
The RBAC service allows you to retrieve automatically a query for your DBMS coming from the evaluation of the permissions of a user. This query will be passed as a header to the requested service that should know how to handle it properly.

To let the RBAC service knows it has to perform this query generation, you need to configure it in the [api configuration](./rbac_api_configuration#x-permission-attribute) or go to [**Manual Routes** tab](#manual-routes-tab). 


The `headerName field` will be used to provide the name of the header that will contain the final query and will be passed to the requested service. If you don't specify any value for headerName, by default it will take the `acl_rows` value.

:::caution
The rows filtering, in order to correctly work, needs the definition of a permission evaluation, that has to be written and tested in the properly [Policies tab](#policies-tab) of RBAC section.
:::

#### How to write a query in rego for permission evaluation

Any RBAC policies is provided with the iterable `data.resources[_]`. This structure is used to build up the query. 
You can use it to perform any kind of comparison between it and anything you want from the input or maybe a constant value.  
We remind you that the query will be built from the field name of the resource object accessed in the permission.

:::caution
To build your query remember to use assign in the `data.resources` iterable the same properties you have defined in the data model you need to be queried.
:::

In the example below, given a valid rows filtering configuration, the `allow` policy requires that the requested resource details can be retrieved by the user and by its manager.

```rego
allow {
   input.request.method == "GET"
   resource := data.resources[_]
   resource.name == input.user
   resource.description == "this is the user description"
}

allow {
   input.request.method == "GET"
   resource := data.resources[_]
   resource.manager == input.user
   resource.name == input.path[1]
}
```

:::caution
Policy for row filtering does not support the `default` declaration. E.g. `default allow = true`. Using it will prevent any filter to be generated.
:::


Given as input to the permission evaluator

```json
[
   {
      "input": {
            "method": "GET",
            "path": ["resource", "bob"],
            "user": "alice"
         }
   }
]
```

We succeed in obtaining the following object representing a mongo query

```json
[
   {
      "$or":[
         {
            "$and":[
               {
                  "name":{
                     "$eq":"alice"
                  }
               },
               {
                  "description":{
                     "$eq":"this is the user description"
                  }
               }
            ]
         },
         {
            "$and":[
               {
                  "manager":{
                     "$eq":"alice"
                  }
               },
               {
                  "name":{
                     "$eq":"bob"
                  }
               }
            ]
         }
      ]
   }
]
```

### RBAC response filtering

For some of your APIs you may need to manipulate data, based on the permissions of the requesting user, before sending it to the final target. This is the case in which we talk about response filtering.  
Whenever this filtering is performed on the results obtained by a HTTP request, we talk about response filtering on response.
RBAC service allows you to manipulate the response body directly in a policy.  
As shown in the [RBAC policies](../api-design/rbac_policies.md#policies-input-data) section, your policies will be provided with the original response body, allowing you to manipulate it.  

After the policy is written, you need to register it in the [api configuration](./rbac_api_configuration#x-permission-attribute) or in the [**Manual Routes** section](#manual-routes-tab). 

:::caution
Response filtering is applied only if the response Content Type is `application/json`; if any other Content Type is found (based on the `Content-Type` header value), an error will be sent to the caller.

**Be careful**, the written policy must respect the syntax 

```rego
policy_name[return_value]{
   somePolicyContent==true
}
```

and must return the new value of the modified data.
:::

```rego
filter_response_example[result] {
   body := input.request.body
   result := object.remove(body, ["someField"])
}
```

## Technical details

### RBAC Service

The RBAC Service is the core service that is responsible for handling policies evaluations; it is thought to run alongside your application container (as a sidecar), to intercept traffic directed to your service and to reject unwanted/unauthorized API invocation.

<div style={{textAlign: 'center'}}>

![sidecar](img/sidecar.png)

</div>

In order to know which API should be exposed RBAC sidecar will try to fetch from the application services an OpenAPI 3 compliant specification. At this point RBAC Service will expose all your application service APIs and after performing policy evaluation decide whether the API invocation should be forwarded to the application service.

Below a sequence diagram that describes the main flow between a client and the final custom service:

<Mermaid chart={`sequenceDiagram
title: RBAC sequence diagram for policy evaluation
participant client
participant rbac_service
participant custom_service
participant db
client ->> rbac_service: [subject, api_path]
activate rbac_service
rbac_service ->> db: get user bindings and roles
activate db
db ->> rbac_service: user bindings with roles and permissions
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

:::info

**Be careful**: the value of the environment variable `LOG_LEVEL` is set by the Console with the value of the `LOG_LEVEL` environment variable of the service to which the sidecar is attached to.

:::

### RBAC Storage

RBAC is configured by design to load Roles and Bindings from MongoDB, in order to properly configure MongoDB connection string and collection names head to the **General Settings** tab
change the values in the RBAC Storage card. These values are set by default to `{{MONGODB_URL}}`, `rbac-bindings` and `rbac-roles`; feel free to change the names to better suite your
naming conventions and standards.  

:::info
You have to provide the collection names you wish to use in your project, when you save the configuration the new collections will be created and will be visible in the **MongoDB CRUD** section.
:::

:::caution
If you wish to change the collection names in a second occasion you **must** manually delete the old ones.
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
      "description": "company tech leader",
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

In this collection there are stored all the bindings between users or groups of users and a resource with a list of roles. The fields for this collections are:

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
         "resourceId": "project1",
         "resourceType": "project"
      }
   }
]
```

<br/>
