---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The main steps needed to customize the project according to your own business logic are listed below; in addition the project contains some `TODO` comment in order to highlight the necessary steps to customize the service. 

## Environemnt Variables
The following environemnt variables are expected by the service: 
- `ROUTER_URL`: endpoint to [identification router service]()
- `MAIN_FLOW_CRUD_URL`: endpoint to main flow manager crud collection
- `SUB_FLOW_CRUD_URL`: endpoint to sub flow manager crud collection
- `TENANT_CRUD_URL`: endpoint to tenant crud crud collection
- `TENANT_CACHE_TTL_MS`: time to live for the cache define in milliseconds
- `TENANT_CACHE_MAX_SIZE`: max cache size
- `MAX_REQUEST_RETRIES`: max number of retries
- `RETRIES_DELAY_MS`: delays in millisecond between retries

## Identification Logic
In order to customize the identification logic or integrate an external identification service you can modify the following files: 
- `/src/identification.ts`: contains identification handlers and custom identification logic
- `/src/clients/identificationClient.ts`: contains the logic to perfom calls to external service
- `/src/handlers/callback.ts`: contains the logic to correctly manage callback from external service

## Identification Data
The identification data extracted can be modified before send them to main flow manager. 
In particular, a mapping function, defined in `/src/services/mainFlowDataMapping.ts`,  is applied by default in order to map the extracted data to the identification manager schema. 

In order to use this template inside the [identification manager application](../../runtime_suite/identification-manager/overview) the extracted data have to follow the schema expected by the application.
