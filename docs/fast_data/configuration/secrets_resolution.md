---
id: secrets_resolution
title: Fast Data Secrets Resolution
sidebar_label: Secrets Resolution
---

Fast Data services may have secrets inside their Config Maps. Secrets can be injected as:

- [plain text](#plain-text)
- reference to an [environment variable](#environment-variable)
- reference to a [file](#file-reference), either its full content or the internal key of a `.ini` file

These are the services versions that support this feature in their config maps:

| Control Plane | Projection Storer | Real Time Updater | Single View Trigger Generator | Single View Creator |
|:-------------:|:-----------------:|:-----------------:|:-----------------------------:|:-------------------:|
|    >=1.1.0    |      >=1.2.0      |         -         |            >=3.3.1            |          -          |

## Plain Text

The field is set to be a string and it is loaded directly from the Config Map itself.


```json
{
  "some-entry": {
    // ...,
    "some-secret-field": {
      "url": "{{CONNECTION_STRING}}"
    }
  }
}
```

:::danger
Remember to use [external environment variables](/console/project-configuration/manage-environment-variables/index.md), to avoid store them in plain in your Console configuration!
:::

## Environment Variable

The field is populated [by a microservice environment variable](/development_suite/api-console/api-design/services.md#environment-variable-configuration).

```json
{
  "some-entry": {
    // ...,
    "some-secret-field": {
      "url": {
        "type": "env",
        "key": "<ENVIRONMENT VARIABLE NAME>"
      }
    }
  }
}
```

:::tip
By default the value contained in the environment variable that is referenced within the secret is expected to be a plain text.
However, the secret definition allows to define the `encoding` property to `base64`, so that the value contained in the
environment variable can be written in `base64` format.

```json
{
  "some-entry": {
    // ...,
    "some-secret-field": {
      "url": {
        "type": "env",
        "key": "<ENVIRONMENT VARIABLE NAME>",
        "encoding": "base64"
      }
    }
  }
}
```

:::

## File Reference

The field is populated by the content of [a file mounted inside the microservice](/development_suite/api-console/api-design/services.md#secrets), such as file a K8s secret.

To help in creating K8s secrets it is available [`mpl`](/runtime_suite_tools/mlp/30_generate.md) tool which automate secrets creation of the ones configured in the `mlp.yaml` file that can be found within your Console Project repository.

### Full Content

```json
{
  "some-entry": {
    // ...
    "some-secret-field": {
      "url": {
        "type": "file",
        "path": "/path/to/file"
      }
    }
  }
}
```

Using the above configuration the service will load the whole file content within the configuration property (in this case `some-secret-field`).

### Single key from .ini file

Secret resolution of files supports also the `.ini` format, that is a file with key-value pair values.
Consequently, it is possible to specify which key within the selected file should be loaded in the microservice configmap's property.

```json
{
  "some-entry": {
    // ...
    "some-secret-field": {
      "url": {
        "type": "file",
        "path": "/path/to/file.ini",
        "key": "KEY_NAME"
      }
    }
  }
}
```

For example, let's consider the above configuration and the following `.ini` file:

```ini
KEY_NAME=cool-secret
OTHER_KEY=uninteresting-secret
```

which is mounted as secret in the microservice at the path `/path/to/file.ini`. As a result, the value that
the microservice will read when accessing the config property `some-secret-field` is `cool-secret` associated to `KEY_NAME` key.
