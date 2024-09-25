---
id: custom-resources
title: Create Custom Resources
sidebar_label: Create Custom Resources
---
## How to use the Custom Resources

A Custom Resource allows you to define custom objects that are not part of the standard Console supported resources.

For example, it is possible to:

- configure Kubernetes Custom Resource that are managed by the cluster (e.g. the Traefik `IngressRoute`);
- generate manifests for different runtimes using the [External Configuration Generator](/console/company-configuration/providers/extensions/orchestrator-generator/overview.mdx).

## How to manage a Custom Resource

It is possible to manage the Custom Resource from inside the Design section of the Console.

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

To create a resource from Marketplace, you need to select the Custom Resource you want to create.

At the moment, the only supported Custom Resources to create are the ones inside the [Company Marketplace](/marketplace/add_to_marketplace/create_your_company_marketplace.md).
To allow the user to create a Custom Resource from marketplace, you need to apply it using `miactl` ([see here for details](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md)).

![Create from Marketplace](./img/custom-resources/create-from-marketplace.png)

Marketplace could contain *versioned* Custom Resources. In that case, when selecting the Custom Resource to create, you will see the available versions and you can also choose which version you prefer to use.

![Create from Marketplace a versioned Custom Resource](./img/custom-resources/create-from-marketplace-versioned.png)

In this case, you can only modify the *name* of the Custom Resource: the *Kind* and the *apiVersion* are managed by the versioned marketplace item, and you cannot modify them manually, either during the creation or the update.

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

If the Custom Resource comes from a versioned Marketplace item, you cannot modify the *apiVersion* and the *kind* fields. Attempts to do so will result in an error badge shown in the UI, and the updates on the manifest will be ignored.

To update these fields, you can select a new version, by clicking on the icon at the top right corner of the badge, near the version name, and selecting the *Change version* option from the pop-up menu. By doing so, a modal window will open to show you all the available versions of the Custom Resource, and you can select the one you want to use.

![Change version](./img/custom-resources/change-custom-resource-version.png)

Inside the modal you can also see the *apiVersion* and the *kind* of the Custom Resource selected, to give you a better idea of what version you are selecting.

In case you need to update the *apiVersion* and the *kind* fields manually, completely changing the configuration of the Custom Resource, you can do so by clicking the *Detach from Marketplace* button on the menu: this will detach the Custom Resource from the original Marketplace item, causing the resource to be fully editable. However, you will not be able to use the Marketplace versioning feature anymore, and you will not be notified by any update made by the Marketplace creator of that item.

### Delete a Custom Resource

To delete a Custom Resource, you have to click on the delete button at the bottom of the page.

You need to insert the Custom Resource name and click on the delete button.

![Delete Custom Resource](./img/custom-resources/delete.png)

## Future Improvements

In the future, we plan to add more features to the Resources, such as:

- the ability to add a custom template to be interpolated to generate the manifest;
- see the Custom Resources runtime inside the Runtime Section of the Console;
- manage Custom Resource with a specific dynamically generated UI.
