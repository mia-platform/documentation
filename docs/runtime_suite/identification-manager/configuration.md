---
id: configuration
title: Configuration
sidebar_label: Configuration
---
## Flow Manager Service
The application includes by default two [flow manager services](../../runtime_suite/flow-manager-service/overview) with a basic configuration, one used as the `main flow` and the other one as the `sub flow`.
To complete the configuration is needed to:
1. customize the steps and the configuration file for the `main flow`
2. customize the steps and the configuration file for the `sub flow`
3. add and customize new flow manager services to includes new `sub flow`, in particular:
    - create a new flow manager service from the marketplace
    - edit the configuration file to define the steps of the processes
    - define a new [CRUD collection](../../development_suite/api-console/api-design/crud_advanced) to collect the data related to the new process

## Identification Manager Router
The `identification manager router` manage the comunication between external services and the set of `sub flow`. By default, the plugin has only a default rules that maps all the request to the `sub flow` already included in the application, but it is possible to add more rules in order to add more identification processes to the application. 

## Identification Services
With the `Identification Manager Adapter` template it is possible to quickly implements a new integration for a custom identification service.

In general, a microservice needs to expose an interface compatible with the [flow manager service](../../runtime_suite/flow-manager-service/overview) and provide a correct mapping of the extracted data as described in the [previous section](./overview.md). 

## Verifiable Credential
Usually, at the end of an identification process a document that certificate the identification is produced. It is possible to use the `verifiable credential generator` template in order to speed up the implementation of your custom solution to create the verifiable credential.
