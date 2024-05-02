---
id: registration
title: Register Extensions
sidebar_label: Register Extensions
---
# Register Extensions

A new extension always needs to be registered on the Console before it can be activated. The registered extension will thus fall under the domain of its own Company, which is why registration and management of registered extensions can only be done by the Company Owner.

## How to register my extension?

If you want to register a new extension, you will need to have already chosen the Company that will own it and ensure that you have the role of Company Owner on that Company. Once this is done, registration can be done via API, and we recommend using the API Portal to craft requests.

The route to contact is `PUT /api/extensibility/tenants/{tenantId}/extensions`, which you can find under the tags `Companies` or `Extensibility`.

![registration example](./images/registrationExample.png)

As can be seen from the example image, registering an extension requires providing some necessary information for proper rendering in the Console.

**Path Params**
- `tenantId`: insert the tenant ID of the Company that will own the new extension

**Body Params**
- `name`: provide the name of your extension
- `contexts`: declare in which contexts the extension can be activated. The selectable values at the moment are Company and Project.
- `description`: provide a brief description of the extension
- `entry`: indicate the URL where the iframe will be fetched
- `extensionType`: select the type of extension. For now, only the iframe type is supported
- `permissions`: indicate which permissions users will need to have to see the extension once activated (further details in the [next section](#how-to-restrict-the-extension-usage))
- `routes`: provide the menu items that should appear on the sidebar once the extension is activated
<!-- TODO: We should explain that we can only put one menu item per extension and multiple extensions need to be created to put more than one in different locations -->

### How to restrict the extension usage?

Registered extensions can also hold an array of `permissions` used to check if a user can see the active extension in the Console or not. In particular, the user must have **at least one of the required permissions in the array**, and the permissions that can be registered on an extension are those of the Console listed in the table of the [Identity and access management page](../../development_suite/identity-and-access-management/console-levels-and-permission-management.md#identity-capabilities-inside-console).

### How to configure correctly the extension menu item?

![registration example main route](./images/registrationExampleMainRoute.png)

![registration example category route](./images/registrationExampleCategoryRoute.png)

The routes represent the menu items that will be added to the sidebar and allow us to access the extension. These routes must specify a precise location, and each location will also correspond to menu groups to which the routes can be attached. Additionally, on a location, it is also possible to register routes of type `category` that add new menu groups and use them to attach new menu items.

A route, therefore, requires providing the following information:
- `id`: assign a unique id that can be used for applying overrides with activation or for attaching menu items if the route's renderType is `category`
- `locationId`: choose a location to place your route (see the [supported locations](./locations.md))
- `renderType`: select `category` if you want to insert a new menu group; otherwise, leave it empty to add a menu item
- `parentId`: insert the route `id` of a menu group where you want to attach the menu item (you can find existing parentIds corresponding to the [supported locations](./locations.md)) or add a route of type `category` and use its `id`. You can omit this information if the route is of type `category`.
- `destinationPath`: indicate the destination suffix to which you will be redirected when clicking the menu item, and it will compose the URL where the iframe will be mounted; in fact, the final URL will be composed of 3 parts `<locationPath>/extensions/<extensionId><destinationPath>`. You can omit this information if the route is of type `category`.
- `icon`: select an icon to use on the new menu item and report it within the `name` field. You can find the icons at this [link](https://react-icons.github.io/react-icons/search/) and only Ant, Feather, and Phosphor icons are supported. You can omit this information if the route is of type `category`.
- `labelIntl`: insert the label to be used on the menu item or menu group and report it in an object {"en": string, "it": string} so that the text is also internationalized.
- `featureToggles`: TBD
- `order`: TBD
- `matchExactMountPath`: TBD
<!-- TODO: Should be added some mentions about the order of menu items? -->
<!-- TODO: Explain that the route id is required and it is needed for advanced customization (redirect to overrides page) -->

#### Register Backoffice Extension Example

The following example shows how to register the Backoffice as a Project extension. To reproduce it, you will need to configure the Backoffice and expose it in such a way that it can be used as an iframe. The preliminary steps to follow are as follows:

1. Create a project made reachable externally (see this [guide](../project-configuration/create-a-project.mdx) to do so)
2. Add the application `Microfrontend Composer Toolkit` following this [guide](../../microfrontend-composer/tutorials/basics#setup-the-microservices)
3. Ensure that the response from the back office endpoint allows embedding within an iframe (see `Iframe embedding options` on this [link](../../development_suite/api-console/api-design/endpoints.md#manage-advanced-endpoint-parameters) for more info)

Once this is done, you can proceed with the extension registration:

**Path Params**
```json
{
  "tenantId": "my-tenant-id"
}
```

**Body Params**
```json
{
  "contexts": ["project"],
  "description": "Extension to integrate back office on Console",
  "entry": "https://<my-domain>/mfe-application/home",
  "extensionType": "iframe",
  "name": "Integrated Backoffice",
  "routes": [
    {
      "destinationPath": "/backoffice",
      "icon": {
        "name": "PiProjectorScreenChartLight"
      },
      "id": "backoffice-route",
      "labelIntl": {
        "en": "Integrated Backoffice",
        "it": "Backoffice integrato"
      },
      "locationId": "project",
      "parentId": "my-menu-group"
    },
    {
      "destinationPath": "/something-ignored", // This is required but ignored if renderType is category 
      "id": "my-menu-group",
      "labelIntl": {
        "en": "My Menu Group",
        "it": "Il mio gruppo menu"
      },
      "locationId": "project",
      "renderType": "category"
    }
  ]
}
```

**Response on success**
```json
{
    "extensionId":"my-extension-id"
}
```

The extension ID will be required to check the extension with the remaining APIs and can be retrieved using a specific API listed below.

## Get registered Extensions

The route `GET /api/extensibility/

tenants/{tenantId}/extensions` allows you to query all registered extensions under a specific Company and can be easily accessed on the API Portal under the tags `Companies` or `Extensibility`, ensuring you have the role of Company Owner on the requested Company.

![retrieve extensions example](./images/retrieveExtensionsExample.png)

### Get Registered Backoffice Extension Example

**Path Params**
```json
{
  "tenantId": "my-tenant-id"
}
```

**Response**
```json
[
  {
    "extensionId":"my-extension-id",
    "name":"Integrated Backoffice",
    "description":"Extension to integrate back office on Console"
  }
]
```

## Edit registered Extension

The route `PUT /api/extensibility/tenants/{tenantId}/extensions` can be used to modify an already registered extension simply by specifying the `extensionId` and providing all the information to apply, including those that should remain unchanged. This route can also be contacted with the API Portal under the tags `Companies` or `Extensibility`, ensuring you have the role of Company Owner on the requested Company.

![edit registered extension](./images/editRegisteredExtension.png)

#### Edit Backoffice Extension Example

In this example, we modify the Backoffice extension registered [here](#register-backoffice-extension-example), changing the label of its menu item:

**Path Params**
```json
{
  "tenantId": "my-tenant-id"
}
```

**Body Params**
```json
{
  "contexts": ["project"],
  "extensionId": "my-extension-id",
  "description": "Extension to integrate back office on Console",
  "entry": "https://<my-domain>/mfe-application/home",
  "extensionType": "iframe",
  "name": "Integrated Backoffice",
  "routes": [
    {
      "destinationPath": "/backoffice",
      "icon": {
        "name": "PiProjectorScreenChartLight"
      },
      "id": "backoffice-route",
      "labelIntl": {
        "en": "Integrated Backoffice Edited",
        "it": "Backoffice integrato Modificato"
      },
      "locationId": "project",
      "parentId": "my-menu-group"
    },
    {
      "destinationPath": "/something-ignored", // This is required but ignored if renderType is category 
      "id": "my-menu-group",
      "labelIntl": {
        "en": "My Menu Group",
        "it": "Il mio gruppo menu"
      },
      "locationId": "project",
      "renderType": "category"
    },
  ]
}
```

**Response on success**: 204 No Content

## Remove registered Extension

The route `DELETE /api/extensibility/tenants/{tenantId}/extensions/{extensionId}` can be used to remove an already registered extension. It can be contacted via the API Portal under the tags `Companies` or `Extensibility`, ensuring you have the role of Company Owner on the requested Company.

:::info
Deleting an extension automatically deactivates it from all contexts where it was active.
:::

![delete registered extension](./images/deleteRegisteredExtension.png)

#### Remove Backoffice Extension Example

If you want to remove the Backoffice extension registered [here](#register-backoffice-extension-example), simply specify the `tenantId` on which it was registered and its `extensionId`:

**Path Params**
```json
{
  "tenantId": "my-tenant-id",
  "extensionId": "my-extension-id"
}
```

**Response on success**: 204 No Content