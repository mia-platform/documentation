---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to configure the Form Service with the Console you need to deploy two services, **Form Service Backend** and the the **Form Service Frontend**. Both are available in the Marketplace.

## Form Service Backend Configuration

1. Create the Form Service Backend to serve the APIs needed for the correct functionality of the Form Service Frontend.
To create the Form Service Backend you can search for it in the Console Marketplace. Choose a name for the new service (e.g. `form-service-backend`).

2. Create the `/api/v1/forms` endpoint for the newly created microservice. The endpoint of this microservice must be exactly this one because the Form Service Frontend will use this path as prefix for the API calls to the Form Service Backend.

The **Form Service Backend** exposes the `GET /builder/config` endpoint used to configure the **Form Service Frontend**.
The endpoint returns the configuration in `JSON` format.

The microservice requires the `FORM_SERVICE_CONFIG_PATH` environment variable to specify the path where the `JSON` is stored. If no path is defined a default configuration will be used.
The default config has only the *formSchemasCrud* and *formSchemaMapCrud* fields with default values. See [Form Service Configuration section](#form-service-configuration) for further details about these parameters.

To configure the **Form Service Backend** service with the Console, follow these steps:

1. Create the service Form Service Backend, available as ready-to-use plugin in the Marketplace;
2. Add a [custom configuration](../../development_suite/api-console/api-design/services#custom-configuration):
   - select the configuration *Type* as ConfigMap;
   - insert the configuration *Name*;
   - specify the *Runtime Mount Path* (e.g. `/home/node/app/form-service`).
3. Add a new `JSON` file specifying its *Name* (e.g. `config.json`). The file content is the Form Service Configuration `JSON` and details about it can be found in the [Form Service Configuration section](#form-service-configuration).
4. Update the environment variable `FORM_SERVICE_CONFIG_PATH` with the full path of the file created in the previous step (e.g. `/home/node/app/form-service/config.json`).

### Form Service Configuration

The Form Service Configuration is a JSON object with the following root properties.

- **1. theming**
  - *type*: object;
  - *required*: `false`;
  - *description*: contains the theming information. This property can be used to customize the Form Builder `CSS`.

See the [theming parameters](#theming-parameters) section for details.

- **2. formSchemasCrud**
  - *type*: string;
  - *required*: `false`;
  - *description*: the endpoint used by the **Form Service Backend** to perform CRUD operation with the forms created with the Form Builder (defaults to `/form-schemas`).

See the [form schemas CRUD endpoint parameter](#form-schemas-crud-endpoint-parameter) section for details.

- **3. formSchemaMapCrud**
  - *type*: string;
  - *required*: `false`;
  - *description*: the endpoint used by the **Form Service Backend** to link form data submitted with the Form Visualizer with form schemas created by the Form Builder (defaults to `/form-schema-map`).

See the [form schema map CRUD endpoint parameter](#form-schema-map-crud-endpoint-parameter) section for details.

- **4. formMetadata**
  - *type*: array of objects;
  - *required*: `false`;
  - *description*: the additional metadata to show in Form Builder and required in the CRUD that is used to save the Forms created with the Form Builder.

See the [form metadata parameters](#form-metadata-parameters) section for details on how you can add metadata to the Forms created with the Form Builder.

- **5. formSubmitUrls**
  - *type*: array of objects;
  - *required*: `false`;
  - *description*: contains the list of URLs that can be used to perform Form submission. The Form Builder will show the available URLs if the array is provided, otherwise a text field will be shown to allow user to provide the URL.

See the [form submit urls parameters](#form-submit-urls-parameters) section for details.

- **6. formBuilderOptions**
  - *type*: object;
  - *required*: `false`;
  - *description*: this object contains the Form Builder options to customize the Form Builder interface such as the components available to the user and the fields shown in their settings.

See the [form builder options](#form-builder-options-parameters) section for details.

The `JSON` file is structured like the following example:

```json
{
  "theming": {
    "primaryColor": "#22f184"
  },
  "formSchemasCrud": "/form-schemas",
  "formSchemaMapCrud": "/form-schema-map",
  "formMetadata": [
    ...
  ],
  "formSubmitUrls": [
    ...
  ],
  "formBuilderOptions": {
    ...
  }
}
```

- **7. defaultClientType**
  - *type*: string;
  - *required*: `false`;
  - *description*: contains (from version `1.2.0`) the default client type that will be forwarded to other platform services when the client type header is not provided from the frontend service (defaults to `formService`).

#### Theming parameters

This part of the configuration object allows the customization of the Form Builder UI colors. At the moment the following parameters are supported:

- **primaryColor**
  - *type*: string;
  - *required*: `false`;
  - *description*: the primary color that is applied to the Form Builder items and buttons, accepted values are 3, 6, or 8 digits Hex and [CSS color keywords](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#color_keywords);
  - *default*: the micro-lc primaryColor if the Form Builder is used as micro-lc plugin, otherwise the formio.js stylesheet is used.

Here an example of a *theming* object to add in Form Builder configuration `JSON`:

```json
  "theming": {
    "primaryColor": "#22f184"
  }
```

### Form Schemas CRUD endpoint parameter

This parameter is the CRUD endpoint used in the **Form Service Backend** to perform CRUD operations on the forms created with the Form Builder. It can be any CRUD endpoint. The default value is `/form-schemas`.

The mandatory properties of the CRUD are:

- **name**, of type *string*;
- **formSubmitUrl**, of type *string*, which specifies the url that will be used for Form submission;
- **formSchema**, of type *object*, which is the property where the configured Form `JSON` will be saved;
- **formVisualizerOptions** , of type *object*, which is the property where the form options `JSON`, will be saved.

:::note
The `formVisualizerOptions` property allows the definition of Form.io options related to the form schema,
for instance, translation options. These options are then used by the Form Visualizer.

This feature is available from Form Service Backend v1.2.2.
:::

In addition, you have to also add to your CRUD properties for the additional Form metadata, defined in [form metadata parameters](#form-metadata-parameters) section.

### Form Schema map CRUD endpoint parameter

This CRUD endpoint is used by the **Form Service Backend** to link form data (submitted with a Form Visualizer) to their form schemas, created with the Form Builder. The default value is `/form-schema-map`.

The mandatory properties of this CRUD are:

- **formDataId**, of type *string*, the ID of the submitted form data;
- **formSchemaId**, of type *string*, the ID of the form schema saved in the `formSchemasCrud` endpoint.

In addition (`from Form Service Backend v1.1.1`), you can add the following optional property:

- **options**, of type *object*, to save an additional `JSON` of options to further customize the visualization of a submitted form in the Form Visualizer. The available options can be found in the [form.io documentation](https://help.form.io/developers/form-renderer#form-renderer-options).

The options can be updated for example updated with a [POST decorator](../../development_suite/api-console/api-design/plugin_baas_4#pre-and-post-decorators) after the submission of a new form.

:::caution

The **Form Service Backend** `PUT /visualizer/forms/:id` endpoint will reply with an error while attempting an update of a submitted form with `"readOnly": true` property in the *Form Schema map* options.

:::

### Form Metadata parameters

This config section specifies the optional metadata of the Forms created with the Form Builder. An array of *form field* objects must be defined with the following properties:

- **name**, the name of the field;
- **type**, right now the only supported one is *string*;
- **label**, the label you want to show for this field.

Here an example of an additional *category* field:

```json
  "formMetadata": [
    {
      "name": "category",
      "type": "string",
	  "label": "Category"
    }
  ]
```

### Form submit urls parameters

This config section specifies the URLs available to the user to specify where the Form data will be saved upon submission. An array of *submit url* objects must be defined with the following properties:

- **id**;
- **submitUrl** the submission URL;
- **label**: it is not mandatory, it allows to define a user friendly name that will be displayed in the Form Builder as select entry (if missing the `submitUrl` will be used).

Here an example of two endpoints:

```json
  "formSubmitUrls": [
    {
      "id": "satisfaction-survey",
      "submitUrl": "http://crud-service/satisfaction-form-submissions",
      "label": "CMS - Satisfaction surveys"
    },
    {
      "id": "screening-questionnaire",
      "submitUrl": "https://www.external-service.com/screening-form-submissions",
      "label": "App - Screening questionnaires"
    }
  ]
```

The user of the Form Builder will see a dropdown menu with the specified options. If the array is empty or the `formSubmitUrls` is not provided, a text field will be used.

:::caution

The *submit urls* can be either provided with the [CRUD Service](../crud-service/overview_and_usage) or with custom APIs, but it's important that they expose the following methods:

- `GET /{id}`: to return the submitted data of a form by ID;
- `POST /`: to save the data of a new submitted form filled by a user;
- `PATCH /{id}`: to update a submitted form by ID;
- `DELETE /{id}`: to delete a submitted form, it is required to allow rollback when inserts in the *formSchemaMapCrud* fail;

More details on the submit URLs APIs can be found at [this page](submit_urls).

:::

### Form Builder Options parameters

This part of the configuration object allows the customization of the Form Builder interface by providing the components you wish to add to the builder and customize the options available in their settings.

You can use the [formio.js examples](https://formio.github.io/formio.js/app/examples/) and [documentation](https://github.com/formio/formio.js/wiki) for more details on how you can customize the form builder. The [formio.js sandbox](https://formio.github.io/formio.js/app/sandbox) is a great tool to test the results of your Form Builder Options `JSON`.

Here you can find an example of a *formBuilderOptions* object that can be used in the sandbox mentioned above:

```json
 "formBuilderOptions": {
  "builder": {
   "basic": {
    "ignore": true
   },
   "advanced": {
    "default": false,
    "components": {
     "email": false,
     "signature": true,
     "file": true,
     "recaptcha": true,
     "resource": true
    }
   },
   "premium": {
    "default": false,
    "ignore": true,
    "components": {
     "custom": false
    }
   },
   "customBasic": {
    "title": "Basic Components",
    "default": true,
    "weight": 0,
    "components": {
     "textfield": true,
     "textarea": true,
     "email": true,
     "phoneNumber": true
    }
   },
   "custom": {
    "title": "User Fields",
    "weight": 1,
    "components": {
     "firstName": {
      "title": "First Name",
      "key": "firstName",
      "icon": "terminal",
      "schema": {
       "label": "First Name",
       "type": "textfield",
       "key": "firstName",
       "input": true
      }
     },
     "lastName": {
      "title": "Last Name",
      "key": "lastName",
      "icon": "terminal",
      "schema": {
       "label": "Last Name",
       "type": "textfield",
       "key": "lastName",
       "input": true
      }
     },
     "email": {
      "title": "Email",
      "key": "email",
      "icon": "at",
      "schema": {
       "label": "Email",
       "type": "email",
       "key": "email",
       "input": true
      }
     },
     "phoneNumber": {
      "title": "Mobile Phone",
      "key": "mobilePhone",
      "icon": "phone-square",
      "schema": {
       "label": "Mobile Phone",
       "type": "phoneNumber",
       "key": "mobilePhone",
       "input": true,
       "prefix": "IT",
       "modalEdit": true
      }
     }
    }
   }
  },
  "editForm": {
   "textfield": [
    {
     "key": "display",
     "ignore": false,
     "components": [
      {
       "key": "placeholder",
       "ignore": false
      },
      {
       "key": "tooltip",
       "ignore": true
      },
      {
       "key": "prefix",
       "ignore": true
      },
      {
       "key": "persistent",
       "ignore": true
      }
     ]
    },
    {
     "key": "api",
     "ignore": true
    },
    {
     "key": "data",
     "ignore": false,
     "components": [
      {
       "key": "multiple",
       "ignore": true
      },
      {
       "key": "persistent",
       "ignore": true
      }
     ]
    }
   ]
  },
  "i18n": {
   "it": {
    "Component": "Componente",
    "Validation": "Validazione",
    "Search field(s) ": "Ricerca campi",
    "Help": "Aiuto",
    "Label": "Etichetta",
    "Position for the label for this field.": "Posizione dell'etichetta per questo campo.",
    "Preview": "Anteprima",
    "Advanced Logic": "Logica Avanzata",
    "Actions": "Azioni",
    "Save Logic": "Salva Logica",
    "Description for this field.": "Descrizione per questo campo",
    "Input Field": "Campo d'inserimento",
    "Custom Default Value": "Valore predefinito personalizzato",
    "An instance of": "Un'istanza di",
    "The current component JSON": "Il JSON del componente attuale",
    "The following variables are available in all scripts": "Le seguenti variabili sono disponibili in tutti gli script",
    "Save": "Salva",
    "Cancel": "Annulla",
    "Remove": "Rimuovi",
    "Key": "Chiave",
    "Value": "Valore",
    "Change": "Cambia",
    "Type to search": "Digita per cercare"
   }
  }
 }
```

### Default client type parameter

From version `1.2.0` the service checks if the `CLIENTTYPE_HEADER_KEY` [environment variable](../../development_suite/api-console/api-design/services#environment-variable-configuration) is already available in the request's headers. If missing, this parameter allows the customization of the client type that will be forwarded to other platform services. The default value is `formService`.

:::caution

An [API Key](../../development_suite/api-console/api-design/api-key) with the default value (or a value of your choice) must be created and enabled in the Console in order to ensure the service's functionality.

:::

## Create required CRUDs

###  form_schemas

In order to perform CRUD operations on the forms created with the Form Service, we recommend to [create a CRUD](../../development_suite/api-console/api-design/crud_advanced) named `form_schemas`.

The required properties (specified in the [form schemas CRUD endpoint parameter](#form-schemas-crud-endpoint-parameter) section) of the CRUD can be imported downloading this <a download target="_blank" href="/docs_files_to_download/form-service-backend/form_schemas_crud_fields.json">json file</a>. If any, you need to also add the additional [form metadata parameters](#form-metadata-parameters).

You also need to expose a new endpoint `/form-schemas` following [this guide](../../development_suite/api-console/api-design/endpoints). You can use a different name paying attention to change the *formSchemasCrud* parameter accordingly.
The type of this endpoint is `CRUD`.

###  form_schema_map

This CRUD is required and used by the **Form Service Backend** to link form data (submitted by a Form Visualizer user) with forms created with the Form Builder.

The required properties (specified in the [form schema map CRUD endpoint parameter](#form-schema-map-crud-endpoint-parameter) section) of this CRUD can be imported downloading this <a download target="_blank" href="/docs_files_to_download/form-service-backend/form_schema_map_crud_fields.json">json file</a>.

If you want to use the default value of the *formSchemaMapCrud* you need to expose this CRUD with the `/form-schema-map` endpoint. Any other endpoint must be specified in the configuration `JSON`.

Once the **Form Service Backend** is configured you can continue setting up the **Form Service Frontend** following [this guide](../form-service-frontend/configuration).
