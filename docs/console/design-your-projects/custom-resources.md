---
id: custom-resources
title: Create Custom Resources
sidebar_label: Create Custom Resources
---

## What is a Custom Resource?

A Custom Resource allows you to define custom objects that are not part of the standard Console resources and can be used to extend the Console capabilities. It provides a way to write configurations that can be translated into different configuration-as-code elements.

## How to use the Custom Resource

With Custom Resources it is possible to:

- configure Kubernetes Custom Resources that are managed by the cluster (e.g. the Traefik `IngressRoute`);
- generate manifests for different runtimes using the [External Configuration Generator](/console/company-configuration/providers/extensions/orchestrator-generator/overview.mdx).

To learn more about possible use cases, you can read the [dedicated section](#use-cases)

## How to manage a Custom Resource in Console

It is possible to manage the Custom Resource from inside the Design section of the Console, in the dedicated area called *Custom Resources*.

### Create a Custom Resource

It is possible to create a new Custom Resource from Marketplace or from scratch.

#### Create a Custom Resource from Scratch

To create a resource from scratch, you need to provide the following information:

- **name**: the name of the Custom Resource. It will be used to generate the manifest, and cannot be changed during updates;
- **apiVersion**: the apiVersion of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the apiVersion of the Custom Resource Definition;
- **kind**: the kind of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the kind of the Custom Resource Definition.

In creation, you will see the preview of the generated manifest.

![Create from scratch](./img/custom-resources/create-from-scratch.png)

#### Create a Custom Resource from Marketplace

:::info
To allow users to add a Custom Resource to their project from marketplace, you need to apply it using `miactl` ([see here for details](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md)).
:::

To create a resource from Marketplace, you need to select the Custom Resource you want to create.

![Create from Marketplace](./img/custom-resources/create-from-marketplace.png)

The Marketplace could contain *versioned* Custom Resources. In that case, when selecting the Custom Resource to create, you will see the available versions and you will be able to select the one you prefer.

![Create from Marketplace a versioned Custom Resource](./img/custom-resources/create-from-marketplace-versioned.png)

In this case, you can only modify the *name* of the Custom Resource: the *kind* and the *apiVersion* fields are managed by the versioned marketplace item, so you cannot modify them manually, neither during the creation nor the update.

### Update a Custom Resource

Once you have created a Custom Resource, it will be possible to update it. Click on the Custom Resource you want to update in the sidebar, and you will see a YAML editor.

The Custom Resource has some supported fields, other fields will be ignored. The supported fields are:

- **apiVersion** (*required*): the apiVersion of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the apiVersion of the Custom Resource Definition;
- **kind** (*required*): the kind of the Custom Resource, it can be any string. If you are creating a Kubernetes Custom Resource, it must be the kind of the Custom Resource Definition.
- **metadata** (*required*): the metadata of the Custom Resource, it can be any object;
  - **name** (*required*): the name of the Custom Resource. It will be used to generate the manifest, and cannot be changed during updates;
  - **labels**: the labels of the Custom Resource, it can be any key/value pair;
  - **annotations**: the annotations of the Custom Resource, it can be any key/value pair;
- **spec** (*required*): the spec of the Custom Resource, it can be any object.

![Update](./img/custom-resources/update-gateway-custom-resource.png)

Custom Resources created from Marketplace items can not have the `apiVersion` and the `kind` fields modified. Attempting to do so will result in an error badge shown in the UI, and the updates on the manifest will be ignored.

Each version of the Custom Resource defines specific values for these fields.
You can select a new version by clicking on the icon at the top right corner of the badge, near the version name, and selecting the *Change version* option from the pop-up menu.
A modal window will open, where you can see the available versions of the Custom Resource and select the one you want to use.

![Change version](./img/custom-resources/change-custom-resource-version.png)

Inside the modal you can also see the `apiVersion` and the `kind` of the Custom Resource of the selected version, to give you a better idea of the configuration you are selecting.

In case you need to update the `apiVersion` and the `kind` fields manually, completely changing the configuration of the Custom Resource, you can do so by clicking the *Detach from Marketplace* button on the menu:this will detach the Custom Resource from the original Marketplace item, causing the resource to be fully editable.
However, you will not be able to use the Marketplace versioning feature anymore, and you will not be notified by any update made by the Marketplace creator of that item.

:::info
A version labelled with *N/A* refers to a Marketplace item that did not include a version when it was created.
This means that it has been created before the support of versioning in the Marketplace was implemented.

However, it does not mean that this version is not supported anymore, or that it is less secure: check out the available versions and choose the one that fits your needs. In case of further questions, please contact the Marketplace item creator.
:::

### Delete a Custom Resource

To delete a Custom Resource, you have to click on the delete button at the bottom of the page.

You need to insert the Custom Resource name and click on the delete button.

![Delete Custom Resource](./img/custom-resources/delete.png)

## How to manage a Custom Resource in the Marketplace

Users with appropriate permissions can manage the lifecycle of a Custom Resource on the Marketplace, being able to publish their own Custom Resources and update them.

Custom Resources are published to the Marketplace using the `custom-resource` type in the marketplace item schema. Versioning is supported, allowing users to make updates without overwriting previous versions of the Custom Resource.

To learn more on how to add a Custom Resource to the Marketplace, see the [Add Custom Resource to the Marketplace](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md) section.

### Template-based Custom Resource management

Certain Custom Resources available in the Marketplace are built using templates. The custom resource item in the Marketplace defines a `generator` field that specifies the template and base folder for generated files. Templates are stored as strings and interpolated at deployment time.

:::info
The `apiVersion` field must be set to `custom-generator.console.mia-platform.eu/v1` to dynamically generate the resource from the Marketplace.
:::

After creating the resource, the user can proceed with its deployment. The template outlines the configuration files that will be generated during deployment, when the template is populated with user-provided values, and the resulting files are stored in a dedicated folder as defined in the Marketplace item specification.

## Use cases

The following examples showcase how users can leverage Custom Resources in different scenarios.

### Traefik IngressRoute

In this use case, the user manages Kubernetes Ingress routing for Traefik. They can either copy an existing Traefik IngressRoute Custom Resource Definition (CRD) directly into the editor in Console, or create a new one from scratch. This approach provides users with fine-tuned control over how Ingress routes are configured.

Alternatively, users can opt to create the resource from the Marketplace. This version offers simplified management of key configuration fields, such as the host and service name, making the process more accessible for users who may not need the full flexibility of direct CRD management.

This use case is ideal for users who require granular control over routing rules and protocols, or for those who prefer a simplified way to handle basic Ingress configurations.

### kube-green SleepInfo

This use case involves using [kube-green](https://kube-green.dev/) to automate sleep schedules for Kubernetes clusters in order to optimize resource usage. Like the Traefik IngressRoute use case, users can manage the SleepInfo CRD directly within the Console. This resource can be used to define when a cluster should "sleep", reducing its resource usage, during non-peak hours.

However, unlike the previous example, this resource is typically activated only in non-production environments, such as development or staging, to prevent disruptions in production-critical services.

This use case is particularly beneficial for organizations that want to reduce the CO2 footprint of their clusters and optimize resource costs in environments that don't require constant uptime.

### AWS Lambda

AWS Lambda functions can be managed in different ways, depending on the user’s needs. One option allows users to create a Kubernetes custom resource for Lambda directly from the Marketplace. The Lambda function is managed by an operator within the Kubernetes cluster, and users can write the Lambda code directly from the Console.

Another option is for the user to create a custom resource from the Marketplace that generates a code repository for the Lambda function. In this case, users can develop the Lambda code separately and then package it into a Docker image.

A third approach is to manage AWS Lambda functions via CloudFormation. This method is ideal for users who prefer working with AWS-native tools and infrastructure-as-code patterns.

These three options provide different levels of flexibility for users who require integration with AWS infrastructure.

## Future Improvements

In the future, we plan to add more features to the Resources, such as:

- see the Custom Resources runtime inside the Runtime Section of the Console;
- manage Custom Resource with a specific dynamically generated UI.
