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
3. add and customize new flow manager services to includes new `sub flows`, in particular:
    - create a new flow manager service from the marketplace
    - edit the configuration file to define the steps of the processes
    - define a new [CRUD collection](../../development_suite/api-console/api-design/crud_advanced) to collect the data related to the new process

## Flow Manager Router

The [flow manager router](../../runtime_suite/flow-manager-router/overview) manages the communication between external services and the set of `sub flows`. The plugin comes in the application with only one default rule that holds information about the used identification process, but it is possible to add more rules in order to add more identification processes to the application. 

## Identification Provider Adapter

With the [identification provider adapter template](../../runtime_suite_templates/application-service-adapter/overview) it is possible to quickly implement a new integration for a custom identification service.

In general, the resulting microservice needs to expose an interface compatible with the [flow manager service](../../runtime_suite/flow-manager-service/overview) and provide a correct mapping of the extracted data as described in the [previous section](./10_overview.md). 

## Verifiable Credential

Usually, at the end of an identification process a document that certificate the identification is produced. It is possible to use the [verifiable credentials generator template](../../runtime_suite_templates/verifiable-credential-generator/overview) in order to speed up the implementation of your custom solution to create the verifiable credential.

## Communication Modes

The services defined in the application can communicate relying on `REST` or `KAFKA`. Switching from a mode to another is simple:
- change the `COMMUNICATION_MODE` public variable value to `REST` or `KAFKA`,
- change the `FLOW_MANAGER_CONFIG_PATH` public variable value to the path of the file holding the Flow Manager configurations with the REST/Kafka communication protocols. Default values are
  - `/sagaConfiguration/rest.json`
  - `/sagaConfiguration/kafka.json`

### Kafka Topics

Here we provide a suggestion for topic management:
- two topics for the flow manager router
- one topic for the verifiable credential
- one topic for the `main flow`
- one topic **for each** `sub flow`
