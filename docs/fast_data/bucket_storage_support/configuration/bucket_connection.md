---
id: bucket_connection_configuration
title: Bucket Connection Configuration
sidebar_label: Bucket Connection
---

This page explains how to connect the Bucket Storage Support services to the two different kinds of supported buckets.
The guide is equivalent for all the services belonging to the Bucket Storage Support feature.

## Connect with S3 bucket

In order to connect to an S3 bucket, after setting the environment variable `BUCKET_TYPE` to `s3`, an additional configuration has to be written.
Inside the microservice, in the config maps section, a new configMap has to be created, with the mount path `/app/config`.
Inside the new config map, a new file has to be added, named `application.yaml`.
The file will contain the credentials for interacting with the bucket, with the following structure:

```yaml
bss:
  bucket:
    s3-key-id: {{S3_KEY_ID}}
    s3-key: {{S3_KEY}}
    region: {{S3_REGION}}
    endpoint: {{S3_ENDPOINT}}
```

## Connect with Google bucket

In order to connect to a Google bucket, after setting the environment variable `BUCKET_TYPE` to `google`, a [secret will have to be created](/development_suite/api-console/api-design/services.md#secrets),
containing the credentials of the service account necessary for connecting to the Google bucket.
Once done, the environment variable `GOOGLE_APPLICATION_CREDENTIALS` has to be set with the same value of the mount path defined in the secret.
The document must be a `json` file, with the following structure

```json
{
  "type": "<type>",
  "project_id": "<projectId>",
  "private_key_id": "<privateKeyId>",
  "private_key": "<privateKey>",
  "client_email": "<clientEmail>",
  "client_id": "<clientId>",
  "auth_uri": "<authUri>",
  "token_uri": "<tokenUri>",
  "auth_provider_x509_cert_url": "<authProviderCertUri>",
  "client_x509_cert_url": "<clientCertUrl>"
}
```