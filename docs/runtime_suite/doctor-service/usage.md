---
id: usage
title: Doctor Service Usage
sidebar_label: Usage
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

## Doctor service results

The _Doctor service_ has two possible results:

- `200`: OK, all services are healthy and can do their job at 100%

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

- `503`: KO, one or more services are not completely OK

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
