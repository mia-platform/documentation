---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to configure the Form Service with the Console you need to deploy two services, **Form Service Backend** and the the **Form Service Frontend**. Both are available in the Marketplace.

Configure the **Form Service Backend** following [this guide](../form-service-backend/configuration) before using the **Form Service Frontend**.

## Form Service Frontend Configuration

1. Create the Form Service Frontend to display the Form Builder and Visualizer UI.
To create the Form Service Frontend you can search for it in the Console Marketplace. Choose a name for the new service (e.g. `form-service-frontend`).

2. Create the endpoint for the newly created microservice, for example `/form-service`.

3. The Form Builder will call the route `GET /builder/config` exposed by the **Form Service Backend** to retrieve its configuration.

## Integration with micro-lc and Headless CMS

Once configured the endpoints of the Form Service, you can use it as a micro-lc plugin following this [guide](https://microlc.io/documentation/docs/micro-lc/plugin_configuration) or as a CMS custom frontend following this [guide](../../microfrontend-composer/previous-tools/cms/custom-frontends-integration-CMS).

Knowing the frontend endpoints described in the [overview](overview#how-it-works) can be useful during the configuration process.

### Integration with micro-lc

In order to use the Form Service Frontend integrated with micro-lc, the [core configuration plugin parameters documentation](https://microlc.io/documentation/docs/micro-lc/core_configuration#plugin-parameters) should also be consulted. As an example, with a frontend service endpoint equal to `/form-service` and a `qiankun` plugin integration `qiankun`, developers can add a Form Builder plugin using this example micro-lc `plugins` configuration:

```json
{
  ...
 "plugins": [
    {
      "id": "form-builder",
      "label": "Form Builder",
      "icon": "fas fa-file-alt",
      "order": 0,
      "integrationMode": "qiankun",
      "pluginRoute": "/builder",
      "pluginUrl": "/form-service/",
      "props": {}
    }
 ]
 ...
}
```

:::caution

`formio.js` use Font Awesome which loads related `css` using relative urls. In order to display all the `formio.js` icons in the Form Service Frontend integrated as a micro-lc plugin, you need to create an endpoint to your Form Service Frontend microservice (with base path equal to `MICRO_LC_ENDPOINT/static/media`) with the following base path rewrite `/static/media` to expose the required resources.
This endpoint (`from version 1.1.0`) must be `MICRO_LC_ENDPOINT/form-service-frontend-fonts`, remember to use "Base Path Rewrite"  `/form-service-frontend-fonts` in the console.

Note also that with `/` as micro-lc endpoint, the required endpoint must be `/static/media` and `from version 1.1.0` must be `/form-service-frontend-fonts`.

:::

### Headless CMS

To use the Form Builder and the Form Visualizer in the Headless CMS the `cmsmenu` CRUD entries for the two frontend must have specific link values. Considering the usual example of the `/form-service` endpoint for the Form Service Frontend, the link for the Form Builder must be `/form-service/#/builder` and the link for the Form Visualizer must be `/form-service/#/visualizer/fill-form`.

In addition, the `form_schemas` CRUD and *submit urls* CRUDs must be added as [CMS pages](../../microfrontend-composer/previous-tools/cms/config_cms#how-to-create-a-page) in order to access the configured form templates and submitted forms data.

Finally, to edit a form template, visualize the resulting form and access the submitted forms data, [links](../../microfrontend-composer/previous-tools/cms/conf_cms#navigation-between-collection-with-link) to the previously integrated frontends must me added.

With a Form Builder frontend added with a `cmsmenu` entry named `Form Builder` and a CMS page hooked to the `form_schemas` CRUD, the required links can be added editing the `cmsProperties.json` file in the Advanced design sections of the console adding the following property:

```json
{
 ...
 "form-schemas": {
  "properties": {
   "_id": {
    "cmsLinks": [
     {
      "targetType":"service",
      "serviceIdTarget": "FormBuilder",
      "queryStringKey":"id"
     },
     {
      "targetType":"service",
      "serviceIdTarget": "FormVisualizer",
      "queryStringKey":"formSchemaId"
     }
    ]
   }
  }
 }
 ...
}
```

For a Form Visualizer frontend integrated in the Headless CMS with a `cmsmenu` entry with name `Form Visualizer` and a CMS page hooked to the `forms` CRUD that stores submitted forms data, the required link visualize a submitted form by ID is:

```json
{
 ...
 "forms": {
  "properties": {
   "_id": {
    "cmsLinks": [
     {
      "targetType":"service",
      "serviceIdTarget": "FormVisualizer",
      "queryStringKey":"formDataId"
     }
    ]
   }
  }
 }
 ...
}
```

:::info

The *queryStringKeys* in the previous examples must match exactly the Form Service Frontend query parameters accepted for specific routes. The `/builder` route accepts the form template ID as `id` query parameter, the `/visualizer/fill-form` routes accepts the form template ID as `formSchemaId` query parameter and the `/visualizer` route accepts the submitted form ID as `formDataId`.

:::

## Advanced Configuration

Depending on the Form Service chosen integration (micro-lc or CMS) further configurations are needed in the Advanced section of the console. The config files to edit are in the `api-gateway` section. The following examples assumes that microservices names and endpoints are the one used in the previous sections of this document.

A standalone use of the Form Service requires editing the following files to ensure correct API calls from the frontend to the backend service:

- `maps-proxyUrl.before.map`:

 ```shell
 "~^(GET|POST|PUT)-/form-service/api/v1/forms(?<path>/.*|$)$" "$path";
 ```

- `maps-proxyName.before.map`:

 ```shell
 "~^(secreted|unsecreted)-(0|1)-(GET|POST|PUT)-/form-service/api/v1/forms/" "form-service-backend";
 ```

A micro-lc use of the Form Service requires editing the following files to ensure correct API calls from the frontend to the backend service:

- `maps-proxyUrl.before.map`:

 ```shell
 "~^(GET|POST|PUT)-/builder/api/v1/forms(?<path>/.*|$)$" "$path";
 "~^(GET|POST|PUT)-/visualizer/fill-form/api/v1/forms(?<path>/.*|$)$" "$path";
 "~^(GET|POST|PUT)-/visualizer/api/v1/forms(?<path>/.*|$)$" "$path";
 ```

- `maps-proxyName.before.map`:

 ```shell
 "~^(secreted|unsecreted)-(0|1)-(GET|POST|PUT)-/builder/api/v1/forms/" "form-service-backend";
 "~^(secreted|unsecreted)-(0|1)-(GET|POST|PUT)-/visualizer/fill-form/api/v1/forms/" "form-service-backend";
 "~^(secreted|unsecreted)-(0|1)-(GET|POST|PUT)-/visualizer/api/v1/forms/" "form-service-backend";
 ```

The previous example refers to `/` micro-lc endpoint, a different endpoint requires adjustments.

A CMS integration of the Form Service require editing the following files to allow correct API calls from the frontend to the backend service (first line) and to allow correct visualization of the frontend from the CMS (second line):

- `maps-proxyBackofficeUrl.before.map`:

 ```shell
 "~^(GET|POST|PUT)-/form-service/api/v1/forms(?<path>/.*|$)$" "$path";
 "~^(GET)-/form-service(?<path>.*|$)$" "$path";
 ```

- `maps-proxyBackofficeName.before.map`:

 ```shell
 "~^(secreted|unsecreted)-(0|1)-(GET|POST|PUT)-/form-service/api/v1/forms" "form-service-backend";
 "~^(secreted|unsecreted)-(0|1)-GET-/form-service" "form-service-frontend";
 ```

Further details about the API Gateway and how can be further configured based on your needs can be found [here](../../development_suite/api-console/advanced-section/api-gateway/how-to)
