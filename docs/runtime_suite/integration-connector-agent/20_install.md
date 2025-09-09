---
id: install
title: How to install
sidebar_label: Install
---



To deploy the service, you need to configure some environment variables and a configuration file.

## Environment Variables

The following environment variables are required to run the application.

| Variable                | Required | Default | Description              |
|-------------------------|----------|---------|--------------------------|
| LOG_LEVEL               | ❌       | info    | Log level                 |
| HTTP_PORT               | ❌       | 8080    | HTTP port                 |
| HTTP_ADDRESS            | ❌       | 0.0.0.0 | HTTP address exposed by the server  |
| SERVICE_PREFIX          | ❌       | /       | Prefix for the service endpoints (except for the status and documentation ones) |
| DELAY_SHUTDOWN_SECONDS  | ❌       | 10      | Delay in seconds before the server shutdown. This could be important to correctly enabling the graceful shutdown in Kubernetes environments |
| CONFIGURATION_PATH      |✅        |         | The path where it is the configuration file |

## Configuration

The configuration is needed to define the service behavior: the source to integrate
with, how to process the data, and the sink to store the data.

It is possible to set more than one integration. Each integration is a data pipeline
which starts from a source, passes through one or more processors, and store data in one or more sink.

To view the possible configurations for each [source](/runtime_suite/integration-connector-agent/sources/10_overview.md),
[processor](/runtime_suite/integration-connector-agent/processors/10_overview.md), and [sink](/runtime_suite/integration-connector-agent/sinks/10_overview.md), see the related documentation.

### Example Configuration

The following is an example of a configuration for integrate source `Jira` with a processor `mapper` in the `MongoDB` sink.

```json
{
  "integrations": [
    {
      "source": {
        "type": "jira",
        "authentication": {
          "secret": {
            "fromFile": "testdata/secret"
          }
        },
      },
      "pipelines": [
        {
          "processors": [
            {
              "type": "mapper",
              "outputEvent": {
                "key": "{{ issue.key }}",
                "summary": "{{ issue.fields.summary }}",
                "createdAt": "{{ issue.fields.created }}",
                "description": "{{ issue.fields.description }}"
              }
            }
          ],
          "sinks": [
            {
              "type": "mongo",
              "url": {
                "fromEnv": "TEST_LOAD_SERVICE_MONGO_URL"
              },
              "collection": "my-collection"
            }
          ]
        }
      ]
    }
  ]
}
```

### Configuration Entities

#### SecretSource

The `SecretSource` is a way to define a secret in the configuration file. It is a JSON object with the following fields:

```json
{
  "fromEnv": "ENV_NAME",
  "fromFile": "file/path"
}
```

Only one of the two fields should be defined. The `fromEnv` field is used to get the secret from an environment variable,
while the `fromFile` field is used to get the secret from a file.

If both are defined, the `fromEnv` field will be used.
