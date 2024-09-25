---
id: extension-activation
title: Activate Extensions
sidebar_label: Activate Extensions
---

# Activate Extensions

An extension registered on a Company can be activated to be used in the Console. Activation can occur in contexts defined by the extension and can only be done if you have the role of Company Owner on the Company on which the extension is registered.

The activation can be done using the API `POST /api/extensibility/tenants/{tenantId}/extensions/{extensionId}/activation` that can be accessed via miactl `extensions activate` command or via the API Portal under the tags `Companies` or `Extensibility`.

**Path Params**
- `tenantId`: insert the tenant ID of the Company on which the extension to activate is registered
- `extensionId`: insert the extension ID of the extension to activate

**Body Params**
- `contextType`: you can specify one of the contexts `company` or `project` on which the extension allows the activation (see `contexts` on this [link](/console/console-extensibility/registration.md#how-to-register-my-extension))
- `contextId`: insert the ID of the Company or Project depending on the type of context specified
- `overrides`: array of routes registered on the extension that you want to modify only for this activation (see the [section](#overrides) below)

**Response on success**
- `activationId`: the activation identifier to manage the created extension activation

:::tip
**[See the example in the tutorial page](/console/tutorials/create-extension.md#3-activate-the-extension)**
:::

:::info
Activation at the Project level can only be done on a project within the same Company on which the extension is registered.
:::

## Overrides

Overrides allow us to visually modify the routes within a registered extension, applying these alterations only for a specific activation. Activations lacking overrides display the extension's menu item as originally registered using [this API](/console/console-extensibility/registration.md#how-to-register-my-extension), while with overrides there might be visual distinctions such as a different icon or label.

:::info
Using overrides allows you to modify one or more routes within the registered extension, including those marked as `category` routes. When applying an override to a route, only the specified alterations will take effect, leaving all other properties unchanged. Therefore, aside from the `routeId`, the remaining properties are optional.
:::

**Override properties**
- `routeId`(_required_): specifies the id of the registered extension's route to which the changes are applied
- `order`
- `icon`
- `labelIntl` 

The properties that can be modified by the override coincide with the properties of the routes registered with the extension already explained [here](/console/console-extensibility/registration.md#how-to-configure-correctly-the-extension-menu-item)

:::info
The activation overrides could not be applied using miactl 
:::

# Deactivate an extension

An extension activation can be terminated at any point using the API `DELETE /api/extensibility/tenants/{tenantId}/extensions/{extensionId}/{contextType}/{contextId}/activation`. This functionality is accessible through the miactl `extensions deactivate` command or via the API Portal under the tags `Companies` or `Extensibility`. Please note that the Company Owner role within the respective Company where the extension is activated is required for this action.

**Path Params**
- `tenantId`: insert the tenant ID of the Company on which the extension to deactivate is registered
- `extensionId`: insert the extension ID of the extension to deactivate
- `contextType`: insert the type of context on which the extension is active
- `contextId`: insert the ID of the Company or the Project depending on the specified context type on which the extension is active

**Response on success**
```
204 No Content
```

:::tip
**[See the example in the tutorial page](/console/tutorials/create-extension.md#5-deactivate-the-backoffice-extension)**
:::
