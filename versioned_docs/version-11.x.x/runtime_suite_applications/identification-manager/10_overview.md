---
id: overview
title: Overview
sidebar_label: Overview
---
## Introduction

The Identification Manager application allows you to build your customized identification process and connect multiple identity providers (IDP). The application enables to set up all the steps needed to implement and manage different identification processes with a single flow.

In particular, the main functionalities delivered by this application are the following:
1. define and add new custom identification processes
2. dynamically choose the identification process to use based on custom rules
3. provide an unified data schema with the information extracted from different identification services or external providers
4. support of multitenants configuration

## How it works

With the elements available in the [marketplace](../../marketplace/overview_marketplace) it is possible to define a set of different identification processes, each of them with their custom identification steps, in particular:
1. Leveraging the flexibility of the [flow manager service](../../runtime_suite/flow-manager-service/overview) you can define:
    - the `main flow` contains the common steps between all the identification processes, e.g. creation of a verifiable credential, in particular:
        - there is only one `main flow` inside the application
        - the post identification steps are customizable
        - the extracted data from the identification process are available in a standard format
    - the `sub flow` contains all the steps for a specific identification process, in particular:
        - there is no limit on the number of `sub flows` managed by the application
        - the identification steps are all customizable
        - the extracted data are both saved in the raw and standard format
        - the `sub flow` directly interact with the identification service

2. some plugins provide a ready to use integration with some identification services
3. with the identification adapter template you can speed up the implementation of your custom integration
4. the `flow manager router plugin` allows you to define custom rules to manage dynamically the communication between an external service (e.g. an identification service, backend for frontend etc...) and the proper `sub flow`
5. with the `verifiable credential generator` template you can speed up the implementation of your custom service for the generation of the verifiable credential at the end of the identification process

## Standard Data Schema

The identification data extracted during the identification process are stored in a standard data schema.
The identification services are in charge to map the data retrieved in the different identification steps to the right format. 

The standard data schema is described below:
```json5
{
    "type": "object",
    "properties": {
        "identificationMethod": { "type": "string" },
        "externalId": { "type": "string" },
        "tenantId": { "type": "string" },
        "subFlowId": { "type": "string" },
        "verifiableCredential": { "type": "string" },
        "subject": { 
            "type": "object",
            "properties": {
                "language": { "type": "string" },
                "person": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" },
                        "surname": { "type": "string" },
                        "maidenName": { "type": "string" },
                        "title": { "type": "string" },
                        "gender": { "type": "string" },
                        "birthPlace": { "type": "string" },
                        "birthDate": { "type": "string" },
                        "nationality": { "type": "string" },
                        "personalNumber": { "type": "string" }
                    }
                },
                "address": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" },
                        "streetAddress": { "type": "string" },
                        "city": { "type": "string" },
                        "postalCode": { "type": "string" },
                        "country": { "type": "string" },
                        "region": { "type": "string" }
                    }
                },
                "identityDocuments": {
                    "type": "array",
                    "items":{
                        "type": "object",
                        "properties": {
                            "country": { "type": "string" },
                            "type": { "type": "string" },
                            "number": { "type": "string" },
                            "issueDate": { "type": "string" },
                            "issuePlace": { "type": "string" },
                            "expirationDate": { "type": "string" },
                            "issuingAuthority": { "type": "string" }
                        }
                    }
                },
                "contacts": {
                    "type": "array",
                    "items":{
                        "type": "object",
                        "properties": {
                            "type": { "type": "string" },
                            "value": { "type": "string" },
                            "verified": { "type": "string" }
                        }
                    }
                }
            }
        },
        "evidences": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "evidenceId": { "type": "string" },
                    "fileName": { "type": "string" },
                    "mediaType": { "type": "string" },
                    "type": { "type": "string" },
                    "contentUri": { "type": "string" },
                    "side": { "type": "string" }
                }
            }
        },
        "additionalData": {
            "type": "object"
        }
    }
}
```
