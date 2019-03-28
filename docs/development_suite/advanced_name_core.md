# Advanced Section

In the advanced section of the API Console it is possible to extend some features of the Mia-Platform components.
In this section you will find all the information to give more power to your platform

## How to change the name of core services
Action:
1. Access the API console and go to the advanced section

2. Go to **Section: api-console-config/ core-service.json**

3. Here you fill find an empty file.

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

!!!warning
