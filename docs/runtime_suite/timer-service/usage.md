# Timer Service usage

The _Timer Service_ is very easy to use.

It provides _REST APIs_ to interact with him, or:

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
  "expirationId": "1234567abcdefg"
}
```

Following the fields description:

- **payload**: an _Object_ that contains the data that will be send when the timer expires (it can be an empty JSON); just the content of the field will be send, without the _payload_ keyword; it will be:
    - *body* if the `outputMode` is of type **rest**
    - *message value* if the `outputMode` is of type **kafka**
- **startDate**: a _String_ of <a href="https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times" target="_blank">_datetime_ format</a> that contains the date of start of the timer; this date will be used to calculate the _expirationDate_
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
        },
        "expirationDate": "2020-04-06T09:07:04.650Z",
        "expirationStatus": {
            "id": 0,
            "description": "pending"
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
  "expirationId": "1234567abcdefg"
}
```

The happy response will be a simple `204 No Content` response.

### Abort example

Following the example of a _curl_ to abort a timer:

```bash
curl --location --request POST 'http://timer-service/abort' \
--header 'Content-Type: application/json' \
--data-raw '{
  "expirationId": "1234567abcdefg"
}'
```
