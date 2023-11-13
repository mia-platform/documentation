---
id: overview
title: Overview
sidebar_label: Overview
---
## Introduction

The Scoring Manager application allows you to build your customized scoring process connecting multiple custom scoring processes and external providers. The application enables to set up all the steps needed to implement and manage different processes with a single flow. 

The main functionalities delivered are the following:
1. define and add new custom scoring processes
2. provide an unified data schema with the information extracted from different services or external providers
3. support of multitenants configuration

## How it works

With the elements available in the [marketplace](../../marketplace/overview_marketplace) it is possible to define a set of different processes, each of them with their custom steps
1. Leveraging the flexibility of the [flow manager service](../../runtime_suite/flow-manager-service/overview) you can define:
    - the `main flow` contains the common steps between all the scoring processes:
        - there is only one `main flow` inside the application
        - the extracted data are available in a standard format
    - the `sub flow` contains all the steps for a specific process:
        - there is no limit on the number of `sub flows` managed by the application
        - the scoring steps are all customizable
        - the extracted data are both saved in the raw and standard format
        - the `sub flow` directly interact with the scoring services

2. some plugins provide a ready to use integration with some scoring services
3. the `flow manager router plugin` allows you to define custom rules to manage dynamically the communication between an external service (e.g. an scoring service, backend for frontend etc...) and the proper `sub flow`
4. the `adaptive approval plugin` allows you to define custom rules to manage dynamically the approval of each process based on the computed scores

### How to start

In order to start the first flow you need to:
1. call the `POST /saga` endpoint on the `Flow Manager Router` in order to create both the main flow and the related sub flow
```jsonc

{
  "associatedEntityId": "some_unique_id",
  "metadata": {
    // Here you can put your custom data with all the information needed to identify the right sub flow
    "id": "custom_identifier",
    "tenantId": "tenant_id"
  }
}

```
2. call the `POST /event` on the `Flow Manager Service` to move forward the main flow, otherwise call the `POST /event` on the `Flow Manager Router` to move forward the sub flow. 
3. The final result will be saved on the main flow metadata by the `POST /notify` endpoint called by the related sub flow at the end of the identification process
4. Optionally you can leverage the `Adaptive Approval` service to automatically have a result of the flow based on the extracted data

## Standard Data Schema

The scoring data extracted during the process are stored in a standard data schema.
The scoring services are in charge to map the data retrieved in the different steps to the right format. 

The standard data schema is described below:
```json5
{
    "type": "object",
    "properties": {
        "process": { 
            "type": "object",
            "properties": {
                "externalId": { "type": "string" },
                "tenantId": { "type": "string" },
            }
        },
        "subFlowId": { "type": "string" },
        "input": { "type": "object" },
        "scores": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "key": { "type": "string" },
                    "value": { "type": "string" },
                    "result": { "type": "string" },
                    "timestamp": { "type": "string" },
                    "origin": { "type": "string" },
                    "metadata": { "type": "string" }
                }
            }
        },
        "evaluation": { 
            "type": "object",
            "properties": {
                "approved": { "type": "boolean" },
                "result": { "type": "string" },
            }
        },
    }
}
```
