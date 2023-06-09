---
id: form_visualizer_styling_configuration
title: Form visualizer styling
sidebar_label: Form visualizer styling configuration
---
The [Form visualizer styling](../../runtime_suite/form-service-frontend/form_assignments) feature of the **Form Service Frontend** let you add custom *stylesheets* and *fonts* to form templates. It requires version `1.3.0` (or above) of the **Form Service Backend** because `GET /visualizer/schemas/:id` and `GET /visualizer/forms/:id` routes have been updated to return the graphical assets associated to a form template alongside to its configuration.

## Form Service Backend Configuration

The [Form Service Configuration](./20_configuration.md) JSON object now has the following additional property:

- **1. formStyleAssetsCrud**
  - *type*: string;
  - *required*: `false`;
  - *description*: the CRUD endpoint used to store graphical assets that will be used to style the form visualizer interface.

See the [form style assets CRUD](#form-style-assets-crud) section for details on how the Form Service Frontend can use multiple **form style assets** such as *style sheets*  or *fonts* to customize the form visualizer's UI.

Here's an example:

```json
{
  ...
  "formStyleAssetsCrud": "/form-style-assets"
  ...
}
  
```

## Form style assets CRUD

This section defines the details of the CRUD that stores the style assets that can be associated to one or more form templates. The form service supports only `.css` and `fonts` files. Depending on the kind of resource `.css` or `.fonts`, a resource can be provided with an `url` or a `file` stored using the [Files Service](../../runtime_suite/files-service/configuration).

The properties of this [CRUD](../../runtime_suite/crud-service/overview_and_usage) (in addition to the default ones) are:

- **name**
  - *type*: string;
  - *required*: `true`;
  - *description*: an user friendly name of your asset.

- **assetId**
  - *type*: string;
  - *required*: `true`;
  - *description*: an unique string id to identify your asset.

- **priority**
  - *type*: number;
  - *required*: `false`;
  - *description*: defines a priority in which the assets of a form template will be added in the form visualizer page.

:::info

Resources with higher priority than others will be loaded first in the form visualizer web page. Resources with no priority value will be loaded in the end.

:::

- **resourceType**
  - *type*: string;
  - *required*: `true`;
  - *description*: the kind of the asset, can be only `css` or `font`.

- **inputType**
  - *type*: string;
  - *required*: `true`;
  - *description*: the type of storage where the asset is saved, can be only `url` or `file`.

- **file**
  - *type*: object;
  - *required*: `true` with `inputType` equal to `file`, `false` otherwise;
  - *description*: contains the [information of a file](../../runtime_suite/files-service/configuration) uploaded using the `File Service`. The form visualizer will use the url contained in the `location` property of this object to load the required asset when needed.

- **url**
  - *type*: string;
  - *required*: `true` with `inputType` equal to `url`, `false` otherwise;
  - *description*: the url of an external asset that the form visualizer will load.

The form service frontend supports only:

- `.css`: both `files` and `urls`;
- `.ttf .otf .woff .woff2`: upload only as files (it's always possible to add fonts directly in an uploaded `.css` file).

- **fontFamily**
  - *type*: string;
  - *required*: `true` with `resourceType` equal to `font`, `false` otherwise;
  - *description*: the [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) of the uploaded font.

- **fontFormat**
  - *type*: string;
  - *required*: `true` with `resourceType` equal to `font`, `false` otherwise;
  - *description*: the [@font-face src format](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) of the uploaded font. The supported values are: `truetype`, `openformat`, `woff` and `woff2`.

:::warning

We recommend checking the output of styled form templates on the form visualizer to confirm their full functionality. Note that using global styles selectors in the loaded stylesheets may lead to unexpected changes in styles of components out of the scope of the form-service microfrontend application.

As an example, applying in your css stylesheet a global rule for modifying the font family in use, will modify the native font family used in the backoffice aside menu component.

```css
* {
  font-family: custom-font-family, sans-serif;
}
```

For this reason, we recommend scoping your custom styles rules through the selection of only those elements contained in the form visualizer page:

```css
#form-visualizer-page * {
  font-family: custom-font-family, sans-serif;
}
```

:::

The required properties of this CRUD can be imported downloading this <a download target="_blank" href="/docs_files_to_download/form-service-backend/form_style_assets_crud_fields.json">example json file</a>.

You also need to expose a new endpoint using the same name defined in the configuration's **formStyleAssetsCrud** property following [this guide](../../development_suite/api-console/api-design/endpoints). A **formStyleAssetsCrud** value equal to `/form-style-assets` will require an endpoint with **Base path** equal to `/form-style-assets`.

:::info

The [Mia-Backoffice](../../business_suite/backoffice/overview) can be used to manage the different style assets. In case you require supporting files, you will need to configure a [Files Service](../../runtime_suite/files-service/configuration) instance in your project and update the Mia-Backoffice configuration to use it's [File Manager](../../business_suite/backoffice/components/clients#file-manager) client.

:::

## CRUDs update

To support the **Form visualizer styling** you need to update the **form_schemas** CRUD in order to optionally add **style assets** to a form template.

### form_schemas

The CRUD collection described in the service [configuration](configuration/#create-required-cruds) section must be updated with an additional property:

- **styleAssetIds**, of type *array of string*, which stores the `assetIds` of the **styles assets** stored in the **form style assets** CRUD.
