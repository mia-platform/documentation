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

The field is set to a string.

:::danger
Remember to use [environment variables](/console/project-configuration/manage-environment-variables/index.md), to avoid store them in plain in your Console configuration!
:::

## Environment Variable

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

## File Reference

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