---
id: custom-ca-certs
title:  How to add custom CA certs to core services
sidebar_label: CA certs to core services
---

In an enterprise environment, to encrypt SSL connections, there could be a set of custom certificates signed by one or more trusted certificates.
By following this guide you'll be able to provide one or more trusted certificates in PEM format in a single file for the services managed by the Console.

To configure a custom CA certs for `crud-service`, for example, you might:

1. Have the CA certificate in `pem` format, and rename the file in `additional-ca.pem`.
2. Create a Kubernetes Secret in namespace (replace `YOUR_NAMESPACE` with your namespace name) of the project needed it using the command:

```sh
kubectl -n YOUR_NAMESPACE create secret generic additional-ca-certificates --from-file=additional-ca.pem
```

This command will create a secret like the following:
```yml
apiVersion: v1
kind: Secret
metadata:
  name: additional-ca-certificates
data:
  additional-ca.pem: "base64-content"
```

The `additional-ca.pem` content is created in base64.

3. In the Console, access to the project and enter in the design section, select the working branch and click the advanced tab.
Select the `api-console-config/core-services.json` file from the left menu.

Here, you should add:

```json
{
  "crud-service": {
      "key": "crud-service",
      "additionalCACerts": {
          "secretName": "additional-ca-certificates",
          "mountFilePath": "/home/node/app/tls/additional-ca.pem"
      }
  }
}
```
Once saved and generate the file adding this configuration, you should see the volume correctly mounted in generated deployment file.

::warning
This feature is enabled only for `crud-service`, `cms-backend` and `v1-adapter`. Other services will be enabled in the future.
::

::warning
This feature is enabled for all environments. If it is not required to add custom ca certs, for example for a test environment, you must add a secret with an empty `additional-ca.pem` file content.
::
