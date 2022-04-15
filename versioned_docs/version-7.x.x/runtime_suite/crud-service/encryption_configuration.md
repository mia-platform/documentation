---
id: encryption_configuration
title: Encryption configuration
sidebar_label: Encryption configuration
---
:::note
You must use this configuration only if you want to use Client Side Field Level Encryption (CSFLE) provided by MongoDB.
:::

Starting with version `4.4.0`, the `crud-service` has introduced the support for the [Client Side Field Level Encryption (**CSFLE**)](https://docs.mongodb.com/manual/core/security-client-side-encryption/).

:::warning
Be careful, CSFLE is a Mongo Enterprise feature, and requires at least MongoDB version 4.2.
:::

With CSFLE, the CRUD Service can encrypt fields in documents before transmitting the data to Mongo: this allows to store on database already encrypted data and can be used to obfuscate sensible data.

:::caution
CSFLE must not be used to store passwords.
:::

The keys and the data are stored in different collections and can even be stored in different databases: only with access to the correct encryption keys it's possible to decrypt and read the protected data.  

For some data types (`Number`, `String`, `Date` and `ObjectId`) it is also possible to guarantee their searchability even if encrypted.
:::caution
Deleting an encryption key renders all data encrypted using that key permanently unreadable, as it won't be possible to decrypt them anymore.
:::


## Configuration
In order to guarantee a correct data encryption, it is necessary to configure a Key Management Service.
Currently, we support two Key Management Service (KMS): `Local` and `[Google Cloud Key Management](https://cloud.google.com/security-key-management)` (available from Google Cloud Platform).

To configure the CRUD Service in order to enable CSFLE it is necessary to add some environment variables to the configuration.
To add the environment variables, please refer to [the dedicated section](../../development_suite/set-up-infrastructure/env-var.md).

### Configure CSFLE with the Google Cloud Platform (GCP)

:::note
Keep in mind that a KMS provided by GCP has additional costs. 
Take a look at the [official documentation](https://cloud.google.com/kms/pricing) to find out the cost and the related billing logic.
:::

In order to configure the encryption using the Google KMS, you need the 
[KMS service account json configuration](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) 
and the [KMS endpoint](https://cloud.google.com/kms/docs/reference/rest#rest-resource:-v1.projects.locations.keyrings.cryptokeys).  

Here is an example of the KMS service account json configuration content:
```json
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
}
```

And here is an example of the KMS endpoint:
`projects/{project_id}/locations/{location}/keyRings/{keyRingName}/cryptoKeys/{keyName}`

With these configurations at hand, you can now configure the environment variables for the CRUD Service:

* **KMS_PROVIDER** (*enum: `gcp`*): the Key Management Service will be hosted by Google Cloud Platform.
* **KMS_GCP_EMAIL**: service account e-mail of the KMS.  
It corresponds to the `client_email` in the KMS service account json configuration.
* **KMS_GCP_PROJECT_ID**: GCP project id in which is configured the KMS.  
It corresponds to the `project_id` in the KMS service account json configuration
* **KMS_GCP_LOCATION**: Location in which the KMS is running.  
It corresponds to the `location` in the KMS endpoint.

Example: if the endpoint is `projects/:projectId/locations/:location/keyRings/:keyRing/cryptoKeys/:cryptoKey`, you must enter as the value of the variable `:location`.
* **KMS_GCP_KEY_RING**: GCP keyring used by the KMS.  
It corresponds to the `keyRingName` in the KMS endpoint.

Example: if the endpoint is `projects/:projectId/locations/:location/keyRings/:keyRing/cryptoKeys/:cryptoKey`, you must enter as the value of the variable `:keyRing`.
* **KMS_GCP_KEY_NAME**: GCP key name.  
It corresponds to the `keyName` in the KMS endpoint.

Example: if the endpoint is `projects/:projectId/locations/:location/keyRings/:keyRing/cryptoKeys/:cryptoKey`, you must enter as the value of the variable `:cryptoKey`
* **KMS_GCP_PRIVATE_KEY_PATH**: Path in which is stored the private key, on the console you **must** mount it as `ConfigMap`.  
The content of this private key corresponds to the **formatted** `private_key` in the KMS service account json configuration.
* **KEY_VAULT_NAMESPACE**: where the key used for the collection encryption will be stored. **The required format is `{databaseName}.{collectionName}`**.

Example: if the database name is `qqq` and the collection name is `www`, you must enter as the value of the variable `qqq.www`.

:::warning
If in the `KEY_VAULT_NAMESPACE` you choose to store the encryption keys in a different database, be sure to have the rights to create it.
:::

### Configure CSFLE with Local Key
In order to configure the encryption using the Local KMS it's necessary to add these new variables:

:::caution
**The `local` KMS is not recommended for production.**
:::

* **KMS_PROVIDER** (*enum: `local`*): the key is managed using a local master key.
* **LOCAL_MASTER_KEY_PATH**: Path in which is stored the master key, on the console you **must** mount it as `ConfigMap`. To generate it, please read [the following guide](#local-master-key-generation).
* **KEY_VAULT_NAMESPACE**: where the key used for the collection encryption will be stored. **The required format is `{databaseName}.{collectionName}`**.

:::warning
If in the `KEY_VAULT_NAMESPACE` you choose to store the encryption keys in a different database, be sure to have the rights to create it.
:::

#### Local master key generation
The local master key must have the exact size of 96 bytes.

You can generate it randomly with a `NodeJS` script or with a shell command.

Alternatively, you can create your own string of length 96 characters.

#### How to generate a local master key using NodeJS
```js
const fs = require('fs')
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateString(length) {
  let result = ''
  const charactersLength = characters.length
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

try {
  fs.writeFileSync('YOUR_KEY_PATH', generateString(96))
} catch (err) {
  console.error(err)
}
```

#### How to generate a local master key using Shell Command
```shell
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 96 | head -n 1 > YOUR_KEY_PATH
```

## Migration and change of the configurations

:::note
If you decide to enable or disable the encryption from already existing field, you must manage manually the encryption or decryption of its values in order to keep your application correctly up and running.
:::

We suggest activating the encryption only for new fields.

## Nested objects
Is possible to encrypt not only plain field, but also objects and its content;
however, doing this we have some limitations:

- objects are encryptable but not searchable while encrypted
- to encrypt an object, all its properties must **not** be encrypted

### Activate object encryption
In order to activate the object encryption, you **must** insert the `encryption` object in your JSON schema, at same level of the `properties` or `type` key.

For example, if you have the following schema:

```json
{
  "type": "object",
  "properties": {
    "testProperty": {
      "type": "string"
    }
  }
}
```

And you want to activate the encryption for the **entire object** (that is **not** searchable), you **must** add:
```json
"encryption": {"enabled": true, "searchable": false}
```

So your final schema will be:

```json
{
  "type": "object",
  "properties": {
    "testProperty": {
      "type": "string"
    }
  },
  "encryption": {"enabled": true, "searchable": false}
}
```

While if you want to activate the encryption only for the property `testProperty`, and **make it searchable**, you **must** add:
```json
"encryption": {"enabled": true, "searchable": true}
```

inside the property definition.

So your final schema will be:

```json
{
  "type": "object",
  "properties": {
    "testProperty": {
      "type": "string",
      "encryption": {"enabled": true, "searchable": true}
    }
  }
}
```
