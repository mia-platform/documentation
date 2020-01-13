# The status of a service

As already written in the [_Microservices vademecum_](/guidelines/microservice_vademecum/#health-routes), we care a lot about the services healthy state.

For this purpose we developed a new _core-service_, the **Doctor service**<br>![alt image](./img/computer-doctor.jpg).


## Doctor service purpose

The purpose of the doctor service is to do a complete _check_ of the services status in the project in which is deployed.

To do this, the service will call a specific route, the [`/-/check-up`](/guidelines/microservice_vademecum/#check-up-route) one.

!!! warning
    **<u>NB</u>**. the _Doctor service_ is the only one who can call the `/-/check-up` route of services.

    **<u>NEVER</u> call the `/-/check-up` route of a service from the _checkUpHandler_ of another service**, the risk is to start a `/-/check-up` calls _loop_.

## Doctor service results

The _Doctor service_ has two possible results:

- `200`: OK &rarr; all services are healthy and can do their job at 100%

    ```json
    {
      ￼"auth-service": {
      ￼ "name": "auth-validator",
      ￼ "status": "OK",
      ￼ "version": "1.2.0"
      ￼},
      ￼"a-beautiful-service": {
      ￼ "name": "a-beautiful-service",
      ￼ "status": "OK",
      ￼ "version": "0.1.7"
      ￼}
    }
    ```

- `503`: KO &rarr; one or more services are not completely OK

    ```json
    {
      "auth-service": {
        "name": "auth-validator",
        "status": "OK",
        "version": "1.2.0"
      },
      "microservice-gateway": {
        "error": {
          "type": "INVALID_STATUS_CODE",
          "statusCode": 404
        }
      },
      "mongodb-reader": {
        "error": {
            "type": "INVALID_STATUS_CODE",
            "statusCode": 404
        }
      }
    }
    ```

As can be seen from the above examples the result, regardless of the status code, will contain the `/-/check-up` response of each called service.
