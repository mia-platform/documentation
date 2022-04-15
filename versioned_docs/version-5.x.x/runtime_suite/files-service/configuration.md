---
id: configuration
title:  configuration
sidebar_label: Configuration
---
## Environment variables

* **CONFIG_FILE_PATH** (*required*): the path of the configuration file to configure connection with the online bucket for the supported services
* **CRUD_URL** (*required*): the CRUD url, comprehensive of the files collection name
* **PROJECT_HOSTNAME**: the hostname that will be saved in the database as the root of the file location
* **PATH_PREFIX**: Use a relative path as file location prefix. Incompatible with *PROJECT_HOSTNAME*
* **HEADERS_TO_PROXY**: comma separated list of the headers to proxy (the mia headers)
* **TRUSTED_PROXIES** (*required*): the string containing the trusted proxies values
* **ADDITIONAL_FUNCTION_CASTER_FILE_PATH**: the path of the file that exports the function to cast.
* **GOOGLE_APPLICATION_CREDENTIALS**: the path to access to the google storage credentials. This is *required* for GoogleStorage type.

One of *PATH_PREFIX* and *PROJECT_HOSTNAME* is required.

## Configuration file

The storage service configuration must follow this json schema: <https://git.tools.mia-platform.eu/platform/plugins/files-service/blob/master/config.jsonschema.js>

### MongoDB configuration file

```json
{
  "type": "mongodb",
  "options": {
    "url": "url-to-mongo",
    "bucketName": "my-bucket"
  }
}
```

### S3 configuration file

```json
{
  "type": "s3",
  "options": {
    "key": "s3-key",
    "secret": "my-secret",
    "bucketName": "my-bucket",
    "region": "eu-west-1"
  }
}
```

### Google Storage configuration file

```json
{
  "type": "googleStorage",
  "options": {
    "bucketName": "my-bucket"
  }
}
```

For this configuration, should be add `GOOGLE_APPLICATION_CREDENTIALS` env variable and the credential file. To obtain the configuration file, follow [this guide](https://cloud.google.com/docs/authentication/getting-started#auth-cloud-implicit-nodejs).

This file looks like

```json
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "MY PRIVATE KEY ID",
  "private_key": "MY PRIVATE KEY",
  "client_email": "storage@my-project.iam.gserviceaccount.com",
  "client_id": "my-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/storage%40my-project.iam.gserviceaccount.com"
}
```

Once obtained this file, you should not commit `private_key_id` and `private_key`.
The `private-key` is a certificate with newline code (`\n`). In order to interpolate with in deploy stage of gitlab ci, it should be saved replacing `\n` with `\\\n`.

### Caster file

An example for a custom caster file. This file add (if present in the post parameters) the *tags*, *authorId* and *ownerId* params to CRUD collection.

```js
'use strict'

module.exports = function caster(doc) {
  return {
    tags: (doc.tags || '').split(','),
    authorId: doc.authorId || undefined,
    ownerId: doc.ownerId || undefined,
  }
}

module.exports.additionalPropertiesValidator = {
  tags: { type: 'string' },
  authorId: { type: 'string' },
  ownerId: { type: 'string' },
}
```
