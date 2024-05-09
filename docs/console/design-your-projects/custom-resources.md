---
id: custom-resources
title: Create Custom Resources
sidebar_label: Create Custom Resources
---

## What is a Custom Resource

A Custom Resource allows you to define custom objects that are not part of the standard Console supported resources.

For example, it is possible to:

- manage some Kubernetes Custom Resource managed by the cluster, e.g. the Traefik `IngressRoute`;
- with [External Configuration Generator](/docs/console/company-configuration/providers/extensions/orchestrator-generator/overview.mdx), generate templates for the other orchestrators.

## How to manage a Custom Resource

It is possible to manage the Custom Resource from inside the Design section of the Console.

### Create a Custom Resource

It is possible to create a new Custom Resource from Marketplace or from scratch.

#### Create a Custom Resource from Marketplace

To create a resource from Marketplace, you need to select the Custom Resource you want to create.

At the moment, the only supported Custom Resources to create are the ones inside the private Company marketplace.  
To allow the user to create a Custom Resource from marketplace, you need to apply it using `miactl`.

#### Create a Custom Resource from Scratch

To create a resource from scratch, you need to provide the following information:

- **name**: the name of the Custom Resource. It will be used to generate the manifest, and cannot be changed during updates;
- **apiVersion**: the apiVersion of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the apiVersion of the Custom Resource Definition;
- **kind**: the kind of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the kind of the Custom Resource Definition.

In creation, you will see the preview of the generated manifest.

![Create from scratch](./img/custom-resources/create-from-scratch.png)

### Update a Custom Resource

Once created a Custom Resource, it is possible to update it. Click on the Custom Resource you want to update in the sidebar, and you will see a YAML editor.

The Custom Resource has some supported fields, other fields will be ignored. The supported fields are:

- **apiVersion** (*required*): the apiVersion of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the apiVersion of the Custom Resource Definition;
- **kind** (*required*): the kind of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the kind of the Custom Resource Definition.
- **metadata** (*required*): the metadata of the Custom Resource, it can be any object;
  - **name** (*required*): the name of the Custom Resource. It will be used to generate the manifest, and cannot be changed during updates;
  - **labels**: the labels of the Custom Resource, it can be any key/value pair;
  - **annotations**: the annotations of the Custom Resource, it can be any key/value pair;
- **spec** (*required*): the spec of the Custom Resource, it can be any object.

![Update](./img/custom-resources/update-gateway-custom-resource.png)

### Delete a Custom Resource

To delete a Custom Resource, you need to click on the delete button in the detail page of the Custom Resource you want to delete.

You need to insert the Custom Resource name and click on the delete button.

![Delete Custom Resource](./img/custom-resources/delete.png)

## Publish a Custom Resource inside the Marketplace

It is possible to add the Custom Resource inside the Company Marketplace using [miactl](/docs/marketplace/add_to_marketplace/manage_marketplace_items.md).

An example of Custom Resource, for example for the `Traefik IngressRoute`, can be visible here:

```yaml
name: 'Traefik IngressRoute'
description: The configuration of the IngressRoute resource for Traefik
type: custom-resource
categoryId: kubernetes-custom-resource
documentation:
  type: externalLink
  url: 'https://docs.mia-platform.eu/docs/infrastructure/paas/tools/traefik#expose-an-endpoint'
resources:
  name: "default"
  meta:
    apiVersion: traefik.io/v1alpha1
    kind: IngressRoute
  labels:
    - name: app.kubernetes.io/instance
      value: "ingress-controller"
  spec:
    entryPoints:
      - "websecure"
    routes:
      - match: Host(`{{PROJECT_HOST}}`)
        kind: Rule
        services:
        - name: "api-gateway"
          port: 8080
itemId: traefik-ingressroute
imageUrl: <IMAGE_URL>
supportedByImageUrl: <SUPPORTED_BY_IMAGE_URL>
supportedBy: <YOUR_COMPANY_NAME>
tenantId: <YOUR_COMPANY_ID>
```

And remember to save it in a file (e.g. ingressroute.yaml) replace the placeholders with the correct values:

- `<IMAGE_URL>`: the URL of the image that represents the Custom Resource;
- `<SUPPORTED_BY_IMAGE_URL>`: the URL of the image that represents the company that supports the Custom Resource;
- `<YOUR_COMPANY_NAME>`: the name of the company that supports the Custom Resource;
- `<YOUR_COMPANY_ID>`: the ID of the company that in which you are creating the Custom Resource.

Once the configuration are ready, you can use miactl to add the Custom Resource to the Company Marketplace (remember to set the correct company id):

```bash
miactl marketplace apply --file-path ./path-to-file-folder --company-id <YOUR_COMPANY_ID>
```

## Future Improvements

In the future, we plan to add more features to the Resources, such as:

- the ability to add a custom template to be interpolated to generate the manifest;
- see the Custom Resources runtime inside the Runtime Section of the Console;
- manage Custom Resource with a specific dynamically generated UI.
