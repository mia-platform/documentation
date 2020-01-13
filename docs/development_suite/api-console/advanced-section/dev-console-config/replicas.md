## How to change the number of replicas

To change the number of replicas of a service you need to edit the file in the advanced Section: `core-services.json.` and add the key **replicas** and value the number of replica.

For example, to configure auth service with 5 replicas, the configuration to be provided is as follows:

```json
"auth-service": {
        "type": "core",
        "name": "auth-service",
        "key": "auth-service",
        "replicas": 5
    }
```
