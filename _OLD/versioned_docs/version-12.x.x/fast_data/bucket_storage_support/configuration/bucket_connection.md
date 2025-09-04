---
id: bucket_connection_configuration
title: Bucket Connection Configuration
sidebar_label: Bucket Connection
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

This page explains how to connect the Bucket Storage Support services to the two different kinds of supported buckets.
The guide is equivalent for all the services belonging to the Bucket Storage Support feature.

<Tabs
  defaultValue="gcp"
  groupId="bucket-storage"
  values={[
      { label: 'Connect with Google Bucket', value: 'gcp', },
      { label: 'Connect with S3 Bucket', value: 's3', },
  ]}
>
<TabItem value="gcp">

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
</TabItem>
<TabItem value="s3">
In order to connect to an S3 bucket, after setting the environment variable `BUCKET_TYPE` to `s3`, an additional configuration has to be written.
Inside the microservice, in the ConfigMaps section, a new configMap has to be created, with the mount path `/app/config`.
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

:::caution
When setting the bucket endpoint, it is important to specify the URI scheme (e.g. `https://`) before the address. Otherwise the service may fail to start with the following error:

> FD_ARC_E0003: provided S3 Cloud Storage configuration is invalid: The URI scheme of endpointOverride must not be null.
:::
</TabItem>
</Tabs>
