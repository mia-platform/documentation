---
id: secrets_resolution
title: Fast Data Secrets Resolution
sidebar_label: Secrets Resolution
---

Fast Data services may have secrets inside their Config Maps. Secrets can be injected as:

- plain text;
- reference to an environment variable;
- reference to a file, either its full content or the internal key of a `.ini` file.

## Plain Text

The field is set to a string, loaded from the Config Map itself.

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

:::caution
The value of the variable __must__ be encoded in `base64` format.
:::

## File Reference

The field is populated by the content of [a file mounted inside the microservice](/development_suite/api-console/api-design/services.md#configmaps).

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

### .ini Key

If the chosen file is a `.ini` file with key-value pair values, it's possible to specify a key that needs to be interpolated.

```json
{
  "some-entry": {
    // ...
    "some-secret-field": {
      "url": {
        "type": "file",
        "path": "/path/to/file.ini",
        "key": "<KEY NAME>"
      }
    }
  }
}
```