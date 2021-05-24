---
id: custom-ca-certs
title:  How to add custom CA certs to core services
sidebar_label: CA certs to core services
---

In an enterprise environment, to encrypt SSL connections, there could be a set of custom certificates signed by one or more trusted certificates.
By following this guide you'll be able to provide one or more trusted certificates in PEM format in a single file for the **core** services managed by the Console.

:::info
If you want to add a custom CA certificate to a custom service you should visit [this page](../../api-design/services.md#provide-a-ca-certificate-to-a-custom-service).
:::

To configure a custom CA certificate for `cms-backend` core service, for example, you might:

1. Verify if the service you want to provide an additional certificate with supports this feature by visiting its dedicated documentation page.
2. Have the CA certificate in `pem` format, and rename the file in `additional-ca.pem`.
3. Create a Kubernetes Secret in the namespace (replace `YOUR_NAMESPACE` with your namespace name) of the project that needs it using the command:

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

4. In the Console, access to the project and enter in the design section, select the working branch and click the advanced tab.

Select the `api-console-config/core-services.json` file from the left menu.

Here, you should add:

```json
{
  "cms-backend": {
      "key": "cms-backend",
      "additionalCACerts": {
          "secretName": "additional-ca-certificates",
          "mountFilePath": "/home/node/app/tls/additional-ca.pem"
      }
  }
}
```

Once saved and generate the file adding this configuration, you should see the volume correctly mounted in the generated deployment file.

:::warning
This feature is enabled only for `cms-backend` and `v1-adapter` core services. Other core services will be enabled in the future.
:::

:::warning
This feature is enabled for all environments. If it is not required to add custom ca certs, for example for a test environment, you must add a secret with an empty `additional-ca.pem` file content.
:::
