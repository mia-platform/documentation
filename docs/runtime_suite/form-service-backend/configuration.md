---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to configure the Form Service with the Console you need to deploy two services, the **Form Service Frontend** and the **Form Service Backend**. Both are available in the Marketplace.

## Form Service Frontend Configuration

1. Create the Form Service Frontend to display the Form Builder and Visualizer UI.
To create the Form Service Frontend you can search for it in the Console Marketplace. Choose a name for the new service (e.g. `form-service-frontend`).

2. Create the endpoint for the newly created microservice, for example `/form-service`.

3. The Form Builder will call the route `GET /builder/config` exposed by the **Form Service Backend** to retrieve its configuration.

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
4. Update the environment variable `FORM_SERVICE_CONFIG_PATH` with the full path of the file created in the previous step.

### Form Service Configuration

The Form Service Configuration is a JSON object with six root properties.

**1. theming**
- *type*: object;
- *required*: `false`;
- *description*: contains the theming information. This property can be used to customize the Form Builder `CSS`.

See the [theming parameters](#theming-parameters) section for details.

**2. formSchemasCrud**
- *type*: string;
- *required*: `false`;
- *description*: the endpoint used by the **Form Service Backend** to perform CRUD operation with the forms created with the Form Builder (defaults to `/form-schemas`).

See the [form schemas CRUD endpoint parameter](#form-schemas-crud-endpoint-parameter) section for details.

**3. formSchemaMapCrud**
- *type*: string;
- *required*: `false`;
- *description*: the endpoint used by the **Form Service Backend** to link form data submitted with the Form Visualizer with form schemas created by the Form Builder (defaults to `/form-schema-map`).

See the [form schema map CRUD endpoint parameter](#form-schema-map-crud-endpoint-parameter) section for details.

**4. formMetadata**
- *type*: array of objects;
- *required*: `false`;
- *description*: the additional metadata to show in Form Builder and required in the CRUD that is used to save the Forms created with the Form Builder.

See the [form metadata parameters](#form-metadata-parameters) section for details on how you can add metadata to the Forms created with the Form Builder.

**5. formSubmitUrls**
- *type*: array of objects;
- *required*: `false`;
- *description*: contains the list of URLs that can be used to perform Form submission. The Form Builder will show the available URLs if the array is provided, otherwise a text field will be shown to allow user to provide the URL.

See the [form submit urls parameters](#form-submit-urls-parameters) section for details.

**6. formBuilderOptions**
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

#### Theming parameters
This part of the configuration object allows the customization of the Form Builder UI colors. At the moment the following parameters are supported:

**primaryColor**
- *type*: string;
- *required*: `false`;
- *description*: the primary color that is applied to the Form Builder items and buttons, accepted values are 3, 6, or 8 digits Hex and [CSS color keywords](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#color_keywords);
- *default*: the microlc primaryColor if the Form Builder is used as microlc plugin, otherwise the formio.js stylesheet is used.

Here an example of a *theming* object to add in Form Builder configuration `JSON`:

```json
  "theming": {
    "primaryColor": "#22f184"
  }
```

#### Form Schemas CRUD endpoint parameter

This parameter is the CRUD endpoint used in the **Form Service Backend** to perform CRUD operations on the forms created with the Form Builder. It can be any CRUD endpoint. The default value is `/form-schemas`.

The mandatory properties of the CRUD are:
- **name**, of type *string*;
- **formSubmitUrl**, of type *string*, which specifies the url that will be used for Form submission;
- **formSchema**, of type *object*, which is the property where the configured Form `JSON` will be saved.

In addition, you have to also add to your CRUD properties for the additional Form metadata, defined in [form metadata parameters](#form-metadata-parameters) section.

#### Form Schema map CRUD endpoint parameter

This CRUD endpoint is used by the **Form Service Backend** to link form data (submitted with a Form Visualizer) to their form schemas, created with the Form Builder. The default value is `/form-schema-map`.

The mandatory properties of this CRUD are:
- **formDataId**, of type *string*, the ID of the submitted form data;
- **formSchemaId**, of type *string*, the ID of the form schema saved in the `formSchemasCrud` endpoint.

#### Form Metadata parameters
This config section specifies the optional metadata of the Forms created with the Form Builder. An array of *form field* objects must be defined with the following properties:
- **name**, the name of the field;
- **type**, right now the only supported one is *string*.

Here an example of an additional *category* field:

```json
  "formMetadata": [
    {
      "name": "category",
      "type": "string"
    }
  ]
```

#### Form submit urls parameters
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
- ` GET /{id}`: to return the submitted data of a form by ID;
- ` POST /`: to save the data of a new submitted form filled by a user;
- ` PATCH /{id}`: to update a submitted form by ID;
- ` DELETE /{id}`: to delete a submitted form, it is required to allow rollback when inserts in the *formSchemaMapCrud* fail;

The `POST` must receive a body containing a JSON object with two root properties.

**1.formSchemaId**
- *type*: string;
- *required*: `true`;
- *description*: the ID of the form schema saved in the `formSchemasCrud` endpoint.

**2.data**
- *type*: object;
- *required*: `true`;
- *description*: contains the form data.

```json
{
  "formSchemaId": "1234",
  "data": {
    ...
  }
}
```

The `PATCH` must receive and the `GET` must return a body containing a JSON object containing only the `data` defined in the body of the `POST`.

A successful `POST` of a new form should return a JSON object with one root property.

**1._id**
- *type*: string;
- *required*: `true`;
- *description*: the id of the saved form's data.

```json
{
  "_id": "01234"
}
```

:::

#### Form Builder Options parameters
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

## Create required CRUDs

**form_schemas**

In order to perform CRUD operations on the forms created with the Form Service, we recommend to [create a CRUD](../../development_suite/api-console/api-design/crud_advanced) named `form_schemas`.

The required properties (specified in the [form schemas CRUD endpoint parameter](#form-schemas-crud-endpoint-parameter) section) of the CRUD can be imported downloading this <a download target="_blank" href="docs_files_to_download/form_schemas_crud_fields.json">json file</a>. If any, you need to also add the additional [form metadata parameters](#form-metadata-parameters).

You also need to expose a new endpoint `/form-schemas` following [this guide](../../development_suite/api-console/api-design/endpoints). You can use a different name paying attention to change the *formSchemasCrud* parameter accordingly.
The type of this endpoint is `CRUD`.

**form_schema_map**

This CRUD is required and used by the **Form Service Backend** to link form data (submitted by a Form Visualizer user) with forms created with the Form Builder.

The required properties (specified in the [form schema map CRUD endpoint parameter](#form-schema-map-crud-endpoint-parameter) section) of this CRUD can be imported downloading this <a download target="_blank" href="docs_files_to_download/form_schema_map_crud_fields.json">json file</a>.

If you want to use the default value of the *formSchemaMapCrud* you need to expose this CRUD with the `/form-schema-map` endpoint. Any other endpoint must be specified in the configuration `JSON`.

## Integration with microlc and Headless CMS

Once configured the endpoints of the Form Service, you can use it as a microlc plugin following this [guide](../../business_suite/microlc/plugin_configuration) or as a CMS custom frontend following this [guide](../../business_suite/custom-frontends-integration-CMS).

Knowing the frontend endpoints described in the [overview](overview#how-it-works) can be useful during the configuration process.

**Integration with microlc**

In order to use the Form Service Frontend integrated with microlc, the [core configuration plugin parameters documentation](../../business_suite/microlc/core_configuration#plugin-parameters) should also be consulted. As an example, with a frontend service endpoint equal to `/form-service` and a `qiankun` plugin integration `qiankun`, developers can add a Form Builder plugin using this example microlc `plugins` configuration:

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

`formio.js` use Font Awesome which loads related `css` using relative urls. In order to display all the `formio.js` icons in the Form Service Frontend integrated as a microlc plugin, you need to create an endpoint to your Form Service Frontend microservice (with base path equal to `MICRO_LC_ENDPOINT/static/media`) with the following base path rewrite `/static/media` to expose the required resources.

Note also that with `/` as microlc endpoint, the required endpoint must be `/static/media`.

:::

**Headless CMS**

To use the Form Builder and the Form Visualizer in the Headless CMS the `cmsmenu` CRUD entries for the two frontend must have specific link values. Considering the usual example of the `/form-service` endpoint for the Form Service Frontend, the link for the Form Builder must be `/form-service/#/builder` and the link for the Form Visualizer must be `/form-service/#/visualizer/fill-form`.

In addition, the `form_schemas` CRUD and *submit urls* CRUDs must be added as [CMS pages](../../business_suite/cms_configuration/config_cms#how-to-create-a-page) in order to access the configured form templates and submitted forms data. 

Finally, to edit a form template, visualize the resulting form and access the submitted forms data, [links](../../business_suite/cms_configuration/conf_cms#navigation-between-collection-with-link) to the previously integrated frontends must me added.

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

The *queryStringKeys* in the previous examples match exactly the Form Service Frontend query parameters accepted for specific routes. The `/builder` route accept the form template ID as `id` query parameter, the `/visualizer/fill-form` routes accept the form template ID sd `formSchemaId` query parameter and the `/visualizer` route accept the submitted form ID as `formDataId`.

:::

## Advanced Configuration

Depending on the Form Service chosen integration (microlc or CMS) further configurations are needed in the Advanced section of the console. The config files to edit are in the `api-gateway` section. The following examples assumes that microservices names and endpoints are the one used in the previous sections of this document.

A standalone use of the Form Service requires editing the following files to ensure correct API calls from the frontend to the backend service:
- `maps-proxyUrl.before.map`:
	```shell
	"~^(GET|POST|PUT)-/form-service/api/v1/forms(?<path>/.*|$)$" "$path";
	```
- `maps-proxyName.before.map`:
	```shell
	"~^(secreted|unsecreted)-(0|1)-(GET|POST|PUT)-/form-service/api/v1/forms/" "form-service-backend";
	```

A microlc use of the Form Service requires editing the following files to ensure correct API calls from the frontend to the backend service:
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

The previous example refers to `/` microlc endpoint, a different endpoint requires adjustments.

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
