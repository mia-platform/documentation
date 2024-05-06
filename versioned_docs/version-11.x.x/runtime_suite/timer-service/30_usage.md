---
id: usage
title: Timer Service Usage
sidebar_label: Usage
---
The _Timer Service_ is very easy to use.

It provides _REST APIs_ to interact with it, or:

- **/schedule** a new expiration event (a timer)

- **/abort** an existing expiration

Moreover, it provides a *Swagger* with the _REST APIs_ details.

## Create a timer

With this API you can schedule an expiration that, when expires, triggers a consequent action.

To schedule a new timer, the client needs to do a `POST` call to the **/schedule** API by passing a specific JSON file, or:

```json
{
  "payload": {
    "myCustomPayload": {
     "key1": "value1"
    }
  },
  "startDate": "2020-04-06T08:57:04.650Z",
  "expirationIntervalMs": 600000,
  "applicantService": "myCustomMicroservice",
  "outputMode": {
    "type": "kafka",
    "topics": [
      "topic1",
      "topic2"
    ],
    "key": "kafkaMessageKey",
    "headers": {
      "header1": "value1"
    }
  }
}
```

The result of this call will be the _expirationId_, or, the `ObjectId` of the JSON saved on the dedicated CRUD;
following an example of response:

```json
{
  "expirationId": "1234567someId"
}
```

Following the fields description:

- **payload**: an _Object_ that contains the data that will be send when the timer expires (it can be an empty JSON); just the content of the field will be send, without the _payload_ keyword; it will be:
  - *body* if the `outputMode` is of type **rest**
  - *message value* if the `outputMode` is of type **kafka**
- **startDate**: a _String_ of [datetime_format](https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times) that contains the date of start of the timer; this date will be used to calculate the_expirationDate_
- **expirationIntervalMs**: a _Number_ that contains the milliseconds to sum at the _startDate_ to calculate the _expirationDate_
- **applicantService**: a _String_ that represents the service who sets the timer
- **outputMode**: an _Object_ with the output modality; see the [dedicated section](#output-mode)

The created expiration, on the CRUD, will have two more fields added by the service, or:

- **expirationDate**: an _UTC Date_ calculated by _startDate_ and _expirationIntervalMs_
- **expirationStatus**: an Object with that represents the current status of the timer, or:
  - _id_: the id of the state, one of the following:
    - 0 &rarr; the timer is _pending_ (not expired)
    - 1 &rarr; the timer _expired_ and the consequent action was made
    - 2 &rarr; the timer is _aborted_
    - 3 &rarr; the timer is in _error_ state
  - _description_: a simple description of the state

On the CRUD, the created expiration will be like the following one (plus the CRUD fields):

```json
{
  "payload": {
    "myCustomPayload": {
     "key1": "value1"
    }
  },
  "startDate": "2020-04-06T08:57:04.650Z",
  "expirationIntervalMs": 600000,
  "applicantService": "myCustomMicroservice",
  "outputMode": {
    "type": "kafka",
    "topics": [
      "topic1",
      "topic2"
    ],
    "key": "kafkaMessageKey",
    "headers": {
      "header1": "value1"
    }
  },
  "expirationDate": "2020-04-06T09:07:04.650Z",
  "expirationStatus": {
    "id": 0,
    "description": "pending"
  }
}
```

### Output Mode

The output mode is very important because contains the type of the output that will be trigger when the timer expires.

Right now, there are just two types of outputs:

- **rest** &rarr; when the timer expires, a _REST API_ will be call
- **kafka** &rarr; when the timer expires, a kafka message will be send (**NB.** the service must have the kafka configurations to accept the kafka output mode)

For each of this output modes, there is a specific schema, or:

- **rest** schema:
  - _type_: it must be _rest_
  - _method_: the REST _Verb_ to use; now it can be one of the following: `post`, `put` or `patch`
  - _protocol_: the protocol to use; it can be one of the following: `http` or `https`
  - _hostname_: the hostname to call; e.g. `www.my-service.com`
  - _path_: the path to call; e.g. `/notify-expiration`
  - _headers_: an object with the headers (_optional_ field)

    ```json
    {
      "type": "rest",
      "method": "post",
      "protocol": "http",
      "hostname": "www.my-service.com",
      "path": "/notify-expiration",
      "headers": {
        "header1": "value1"
      }
    }
    ```

- **kafka** schema:
  - _type_: it must be _kafka_
  - _topics_: an _Array_ of strings that contains the topics list; the same message will be publish on each topic of the list
  - _key_: the kafka key to use for the message to publish
  - _headers_: an object with the headers (_optional_ field)

    ```json
    {
      "type": "kafka",
      "topics": [
        "topic1",
        "topic2"
      ],
      "key": "kafkaMessageKey",
      "headers": {
        "header1": "value1"
      }
    }
    ```

### Schedule examples

Following two examples of a _curl_ to schedule a timer with the two output modes:

- **rest**:

    ```bash
    curl --location --request POST 'http://timer-service/schedule' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "payload": {
            "myCustomPayload": {
                "key1": "value1"
            }
        },
        "startDate": "2020-04-06T08:57:04.650Z",
        "expirationIntervalMs": 600000,
        "applicantService": "myCustomMicroservice",
        "outputMode": {
            "type": "rest",
            "method": "post",
            "protocol": "http",
            "hostname": "www.my-service.com",
            "path": "/notify-expiration",
            "headers": {
                "header1": "value1"
            }
        }
    }'
    ```

- **kafka**:

    ```bash
    curl --location --request POST 'http://timer-service/schedule' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "payload": {
            "myCustomPayload": {
                "key1": "value1"
            }
        },
        "startDate": "2020-04-06T08:57:04.650Z",
        "expirationIntervalMs": 600000,
        "applicantService": "myCustomMicroservice",
        "outputMode": {
            "type": "kafka",
            "topics": [
                "topic1",
                "topic2"
            ],
            "key": "kafkaMessageKey",
            "headers": {
                "header1": "value1"
            }
        }
    }'
    ```

## Abort a timer

To abort an existing timer the client needs to do a _POST_ call to the `/abort` route, by passing the _expirationId_, returned by the `/schedule` API.

The _expirationId_ must be pass into the body of the call, like the following schema:

```json
{
  "expirationId": "1234567someId"
}
```

The happy response will be a simple `204 No Content` response.

### Abort example

Following the example of a _curl_ to abort a timer:

```bash
curl --location --request POST 'http://timer-service/abort' \
--header 'Content-Type: application/json' \
--data-raw '{
  "expirationId": "1234567someId"
}'
```

## Usage examples

Following some usage example.

### Timer that expires after 10 minutes and does a REST call

A client needs, after 10 minutes, to send the payload

```json
{
  "user": {
    "name": "John",
    "surname": "Smith"
  },
  "_id": "1234567someId",
  "orderId": "abc123def456"
}
```

using a POST call to the REST API `https://user-orders:3000/order-expired`.

This can be done by scheduling a timer by calling the POST route `timer-service/schedule` with the following body:

```json
{
  "payload": {
    "user": {
      "name": "John",
      "surname": "Smith"
    },
    "_id": "098abc765def",
    "orderId": "abc123def456"
  },
  "startDate": "2020-04-06T08:57:04.650Z",
  "expirationIntervalMs": 600000,
  "applicantService": "user-orders",
  "outputMode": {
    "type": "rest",
    "method": "post",
    "protocol": "https",
    "hostname": "user-orders",
    "port": 3000,
    "path": "/order-expired"
  }
}
```

and the result will be:

```json
{
  "expirationId": "1234567abcdef"
}
```

After 10 minutes, the indicated route `https://user-orders:3000/order-expired` will receive the payload and the timer status on the CRUD will be the following:

```json
{
  ...
  ...
  "expirationStatus": {
    "id": 1,
    "description": "expired"
  }
}
```

### Timer that expires after 10 minutes but is aborted before the expiration

Like the example above a client can schedule a timer to send a payload to a REST API after 10 minutes by calling the POST route `timer-service/schedule` with the following body:

```json
{
  "payload": {
    "user": {
      "name": "John",
      "surname": "Smith"
    },
    "_id": "098abc765def",
    "orderId": "abc123def456"
  },
  "startDate": "2020-04-06T08:57:04.650Z",
  "expirationIntervalMs": 600000,
  "applicantService": "user-orders",
  "outputMode": {
    "type": "rest",
    "method": "post",
    "protocol": "https",
    "hostname": "user-orders",
    "port": 3000,
    "path": "/order-expired"
  }
}
```

and the result will be:

```json
{
  "expirationId": "1234567abcdef"
}
```

After 5 minutes an event occurs and the client doesn't need the timer anymore, so the client should abort the timer.

To do this, the client can do a POST call to the `timer-service/abort` route with the following body:

```json
{
  "expirationId": "1234567abcdef"
}
```

and the result will be a `204 No Content`, that means the successful timer abortion.

After the abortion, the timer status on the CRUD will be:

```json
{
  ...
  ...
  "expirationStatus": {
    "id": 2,
    "description": "aborted"
  }
}
```

### Timer that expires after 5 minutes and send a payload on kafka

A client needs, after 5 minutes, to send the following payload:

```json
{
  "eventName": "timerExpired",
  "eventContent": {
    "orderId": "abc123def456"
  }
}
```

on the kafka topics `expiredOrders` and `usersOrders`, with the userId into the _headers_ and using `userId_orderId` as message key.

This can be done by scheduling a timer by calling the POST route `timer-service/schedule` with the following body:

```json
{
  "payload": {
    "eventName": "timerExpired",
    "eventContent": {
      "orderId": "abc123def456"
    }
  },
  "startDate": "2020-04-06T08:57:04.650Z",
  "expirationIntervalMs": 300000,
  "applicantService": "user-orders",
  "outputMode": {
    "type": "kafka",
    "topics": ["expiredOrders", "usersOrders"],
    "key": "098abc765def_abc123def456",
    "headers": {
      "userId": "098abc765def"
    }
  }
}
```

and the result will be:

```json
{
  "expirationId": "1234567abcdef"
}
```

After 5 minutes the timer will expire and the topics `expiredOrders` and `usersOrders` will receive a message with data indicates above.

### Timer with kafka output but error because kafka is not configured

As described into the [environment variables section](./configuration#environment-variables), the kafka configuration is optional (not all projects use kafka).

If the _Timer Service_ has not kafka configured and a client schedules a timer with kafka output by calling the POST route `timer-service/schedule` with the following body:

```json
{
  "payload": {
    "eventName": "timerExpired",
    "eventContent": {
      "orderId": "abc123def456"
    }
  },
  "startDate": "2020-04-06T08:57:04.650Z",
  "expirationIntervalMs": 300000,
  "applicantService": "user-orders",
  "outputMode": {
    "type": "kafka",
    "topics": ["expiredOrders", "usersOrders"],
    "key": "098abc765def_abc123def456",
    "headers": {
      "userId": "098abc765def"
    }
  }
}
```

the timer will expire, the service will not find the _kafka publisher_ and the timer will be set to error on CRUD:

```json
{
  ...
  ...
  "expirationStatus": {
    "id": 3,
    "description": "error"
  }
}
```

## Postman collection

You can use the following Postman collection to call the _Timer Service_ REST APIs:

```JSON
  {
    "info": {
      "_postman_id": "86e237e6-023a-4a1d-99be-e781665dfc7c",
      "name": "Timer Service",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [{
        "name": "Schedule a 5 minutes timer with kafka outputMode with headers",
        "request": {
          "method": "POST",
          "header": [],
          "body": {
            "mode": "raw",
            "raw": "{\n    \"payload\": {\n        \"eventName\": \"timerExpired\",\n        \"eventContent\": {\n            \"orderId\": \"abc123def456\"\n        }\n    },\n    \"startDate\": \"2020-04-06T08:57:04.650Z\",\n    \"expirationIntervalMs\": 300000,\n    \"applicantService\": \"user-orders\",\n    \"outputMode\": {\n        \"type\": \"kafka\",\n        \"topics\": [\n            \"expiredOrders\",\n            \"usersOrders\"\n        ],\n        \"key\": \"098abc765def_abc123def456\",\n        \"headers\": {\n            \"userId\": \"098abc765def\"\n        }\n    }\n}",
            "options": {
              "raw": {
                "language": "json"
              }
            }
          },
          "url": {
            "raw": "http://timer-service/schedule",
            "protocol": "http",
            "host": [
              "timer-service"
            ],
            "path": [
              "schedule"
            ]
          },
          "description": "API to schedule a new expiration on the timer service"
        },
        "response": []
      },
      {
        "name": "Schedule a 10 minutes timer with rest outputMode without headers",
        "request": {
          "method": "POST",
          "header": [],
          "body": {
            "mode": "raw",
            "raw": "{\n    \"payload\": {\n        \"user\": {\n            \"name\": \"John\",\n            \"surname\": \"Smith\"\n        },\n        \"_id\": \"098abc765def\",\n        \"orderId\": \"abc123def456\"\n    },\n    \"startDate\": \"2020-04-06T08:57:04.650Z\",\n    \"expirationIntervalMs\": 600000,\n    \"applicantService\": \"user-orders\",\n    \"outputMode\": {\n        \"type\": \"rest\",\n        \"method\": \"post\",\n        \"protocol\": \"https\",\n        \"hostname\": \"user-orders\",\n        \"port\": 3000,\n        \"path\": \"/order-expired\"\n    }\n}",
            "options": {
              "raw": {
                "language": "json"
              }
            }
          },
          "url": {
            "raw": "http://timer-service/schedule",
            "protocol": "http",
            "host": [
              "timer-service"
            ],
            "path": [
              "schedule"
            ]
          },
          "description": "API to schedule a new expiration on the timer service"
        },
        "response": []
      },
      {
        "name": "Abort a timer",
        "request": {
          "method": "POST",
          "header": [],
          "body": {
            "mode": "raw",
            "raw": "{\n  \"expirationId\": \"1234567someId\"\n}",
            "options": {
              "raw": {
                "language": "json"
              }
            }
          },
          "url": {
            "raw": "http://timer-service/abort",
            "protocol": "http",
            "host": [
              "timer-service"
            ],
            "path": [
              "abort"
            ]
          },
          "description": "Route to call the abort a timer"
        },
        "response": []
      }
    ],
    "protocolProfileBehavior": {}
  }
```

Obviously you must change the `baseUrl` and add your possibles custom headers/data to the calls.
