---
id: advanced_name_core
title:  Advanced Section
sidebar_label: Change the name of Core Services
---
In the advanced section of the API Console it is possible to extend some features of the Mia-Platform components.
In this section you will find all the information to give more power to your platform

:::info
To change all the advanced settings, you have to access to the Console and go to the Advanced Section from the menu in the main sidebar of the Design Area.
:::

## How to change the name of core services

Action:

1. Go to **Section: api-console-config/ core-service.json**

2. Here you fill find an empty file.

If you want to change the name of a service you will need to compile a json file with the structure similar to the one shown below:

```
{
    "ag-1": {
        "type": "core",
        "name": "ag-1",
        "key": "api-gateway"
    },
    "microservice-gateway-1": {
        "type": "core",
        "name": "microservice-gateway-1",
        "key": "microservice-gateway"
    }
}
```

**type**: is the type of the services

**name**: is the name you wanna give to your service

**key**: is the real name of the service

:::warning
Watch out!
Remember to delete old services and related files: service, deployment and any config map
:::
