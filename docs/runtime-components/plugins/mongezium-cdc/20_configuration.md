---
id: configuration
title: Configuration
sidebar_label: Configuration
---



In order to configure the service, a set of environment variables are adopted for
describing basic service needs, alongside a main configuration file.

## Environment Variables

| Variable             | Description                                                                                   | Default                |
|----------------------|-----------------------------------------------------------------------------------------------|------------------------|
| LOG_LEVEL            | the maximum log level to emit. Accepted levels are  `trace`\|`debug`\|`info`\|`warn`\|`error` | `info`                 |
| HTTP_PORT            | the HTTP port on which kubernetes status routes and metrics are exposed                       | `3000`                 |
| CONFIGURATION_FOLDER | the filepath to the folder under which configuration file is located                          | `<HOME>/.df/mongezium` |

## Configuration File

The application needs a configuration file, named `config.json`, having the following structure with values using the [secret_rs syntax](https://docs.rs/secret_rs/0.4.1/secret_rs/index.html):

```json
{
    "persistence": {
        "url": "<secret-rs value>",
        "dbName": "<optional database name to connect. if not defined, the connection string must contain the db name.>"
    },
    "stream": {
        "consumer": {
            // <string, secret_rs value> pair of properties that appear in the [librdkafka](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md) used by consumer
          // NOTE: bootstrap.servers MUST be set to the same value of the producer's one
            ...
        },
        "producer": {
            // <string, secret_rs value> pair of properties that appear in the [librdkafka](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md) used by producer
            // NOTE: bootstrap.servers MUST be set to the same value of the consumer's one
            ...
        }
    },
    "collections": [
        {
            "topic": "<topic-name>",
            "namespace": "<db-name>.<collection-name>",
            "snapshot": "when_needed|initial" // tells when to perform snapshots when no messages are found on a topic or a resume token used by the change is not found. 
        }
    ]
}
```
