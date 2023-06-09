---
id: overview
title: Form Service Backend
sidebar_label: Overview
---
The Form Service Backend is a Mia-Platform plugin that acts as a BFF (Backend For Frontend) for the [Form Service Frontend](../../runtime_suite/form-service-frontend/overview).

## How it works

The **Form Service Backend** works with the **Form Service Frontend** that provides the **Form Builder** and **Form Visualizer** UI. Further information about the frontend routes are available [here](../../runtime_suite/form-service-frontend/overview#how-it-works). 

The backend service exposes the following APIs:

### Form Builder

- `GET /builder/config`: it returns the configuration needed to show the Form Builder visualizer;
- `POST /builder/schemas`: it allows saving the created form;
- `GET /builder/schemas/{id}`: it returns one form by ID;
- `PUT /builder/schemas/{id}`: it updates one form by ID.

### Form Visualizer

- `GET /visualizer/config`: it returns the configuration needed by the form visualizer;
- `GET /visualizer/schemas/{id}`: it returns a configured form that will be shown in the Form Visualizer;
- `POST /visualizer/forms`: it saves the submitted data of a user that filled a form shown in the Form Visualizer;
- `GET /visualizer/forms/{id}`: it returns a submitted form by ID, enabling the review of data provided by the end user;
- `PUT /visualizer/forms/{id}`: it updates a submitted form by ID;
- `GET /visualizer/assignments/{assignmentId}/schema-id`: (`from version 1.2.0`) it returns a form ID given a [form assignment](./30_form_assignments_configuration.md) ID;
- `DELETE /visualizer/forms/{id}`: it deletes a submitted form by ID and its draft;
- `POST /visualizer/forms/draft/{formId}`: if formId is undefined it saves a form and its draft, otherwise it  saves the draft of the form;
- `GET /visualizer/forms/export` (*version 1.7.0 or later required*): it returns a CSV containing the forms data based on a given schema and created in a given period;

These endpoints are defined in the **Form Service Backend** and are called by the **Form Service Frontend** plugin (regardless being integrated in micro-lc or Headless CMS). Discover more about the frontend integration [here](../../runtime_suite/form-service-frontend/configuration#integration-with-micro-lc-and-headless-cms).

#### Form data versioning support

From `version 1.4.0` the Form-Service Backend supports the versioning of the form data, by including the parameter `_v` to the request performed to retrieve form data. The `_v` parameter specifies the version of the form data to be retrieved. If the `ENABLE_VERSIONING` environment variable is set to `true`, the `_v` parameter is forwarded to the service in charge of retrieving the form data.

:::info

Let us suppose that the `submit_url` has been set to `http://microservice/resource`. When the Form-Service Frontend triggers a request `GET /visualizer/forms/{id}?_v=1` to the Form-Service Backend with a non-null `_v` parameter, the Form-Service Backend will trigger a request `GET http://microservice/resource/{id}?_v=1`

:::

In order to obtain form data versioning, the calls to the **Form-Service Frontend** must be done including the `_v` parameter. See [here](../../runtime_suite/form-service-frontend/configuration#form-data-versioning-support) for Form-Service Frontend usage.

#### Form draft support

From `version 1.5.0` the Form-Service Backend allows to retrieve draft data by including the parameter `_status` to the request performed to retrieve the form. If the `_status` parameter is equal to `draft` the data retrieved in the request `GET /visualizer/forms/{id}?_status=draft` is the draft, otherwise it retrives the stable form data.

Every form has two parameters: `isValid` and `hasDraft`. The first one indicates if the form has been submitted. The latter indicates if the draft of the form exists.

#### Form data CSV export

From version `1.7.0` the Form-Service Backend allows to export form data in CSV format, by calling the `GET /visualizer/forms/export` endpoint.

This endpoint accepts the following query parameters:
- `startDate` (required): filter the forms created after the given date/time;
- `endDate` (required): filter the forms created before the given date/time;
- `formSchemaId` (required): filter the forms with the given schema;
- `compatibleWithExcel` (optional, default: `false`): returns a CSV compatible with Excel (accepted values: `true` or `false`).

:::info

When opening regular CSV files with Excel, the content is parsed according to certain client localization settings, which may cause parsing issues.
To ensure compatibility with Excel, we need to export a CSV crafted for Excel, which is not suitable to be opened with other tools.
For this reason, since version `1.7.1` we provide an additional query parameter - `compatibleWithExcel` - you can use to get a CSV fully compatible with Excel. 

:::

This endpoint flatten all the form fields, using the dot character as separator, and returns a CSV where each column corresponds to a flattened JSON field. So, if we have a form looking like this:

```json
{
  "_id": "6246b2aff30214fb40d3e86d",
  "formSchemaId": "62162180544cea83e8e130e7",
  "data": {
    "name": "Mario",
    "surname": "Rossi",
  }
}
```

the resulting columns in the CSV would be, in the exact order, `_id`, `formSchemaId`, `data.name` and `data.surname`:

```csv
"_id","formSchemaId","data.name","data.surname"
"6246b2aff30214fb40d3e86d","62162180544cea83e8e130e7","Mario","Rossi"
```

:::info

If there is no form data matching the given filters, an empty CSV with headers is returned. For instance:

```csv
"_id","formSchemaId","data.name","data.surname"
```

:::

:::warning

This endpoint builds the list of CSV columns from the form schema and does not support all [form.io field types](https://docs.form.io/userguide/forms/form-components).

We provide limited support for the following field types:

- [`datagrid`](https://docs.form.io/userguide/forms/data-components#data-grid): the value is an array, which is not flattened, so a single field is returned;
- [`editgrid`](https://docs.form.io/userguide/forms/data-components#edit-grid): the value is an array, which is not flattened, so a single field is returned.

We do not support the following field types, which means that fields with any of these type will not be included in the CSV:

- all [form.io premium fields](https://docs.form.io/userguide/forms/premium-components);
- [`address`](https://docs.form.io/userguide/forms/form-components#address): the value is an arbitrary object, depending on the external service providing geolocation info;
- [`htmlelement`](https://docs.form.io/userguide/forms/layout-components#html-element): this field is used to display content on the form, it does not have an associated value;
- [`content`](https://docs.form.io/userguide/forms/layout-components#content): this field is used to display content on the form, it does not have an associated value;
- [`datamap`](https://docs.form.io/userguide/forms/data-components#data-map): the value is an object with arbitrary properties, depending on user input;
- [`tree`](https://docs.form.io/userguide/forms/data-components#tree): the value is an arbitrary object.

:::

You can configure the **Form Service Backend** to:

- perform *lookups* on certain fields and replacing an existing value - for example a user or form schema IDs - with a more human-readable value (if, for any reason, a lookup on a form field fails, the service ignores the error and simply leaves the existing value unmodified);
- configure some *redirects*, in particular when the `GET /export` endpoint and the submit URL targets different services and you want the Form Service, every time it encounters a submit URL as lookup data source, to automatically call a different endpoint to fetch lookup data, always appending `/export`); 
- add some specific *fields* as columns at the beginning of the CSV before the fields derived from the form schema (if the forms are stored in a CRUD collection, you may want to include [its predefined properties](../../runtime_suite/crud-service/overview_and_usage#predefined-collection-properties)).

Please take a look at the [Configuration section](./20_configuration.md#export-lookups-exportlookups) to understand how to configure fields, lookups and redirects.

## Further details

Follow the pages below to know more about the _Form Service Backend_:

- [_Form Service Backend_ configuration](./20_configuration.md)

:::warning

The **Form Service Backend** does not perform form validation.
Validation is only performed in the frontend if the **Form Service Frontend** plugin is used.

We recommend building you own form validation in a dedicated backend microservice.

This may change in the future.

:::
