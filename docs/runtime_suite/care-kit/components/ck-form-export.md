---
id: ck-form-export
title: ck-export-form
sidebar_label: Ck-form-export
---
The `ck-export-form` web component is able to export in CSV format the data of the forms created through the [Form Service Frontend](../../form-service-frontend/overview) and [Form Service Backend](../../form-service-backend/overview).

## Usage

The web component consist in a form inside a modal. The form is composed of two fields, `Form Schema` and `Time Range`, both of which required. The `Form Schema` field is a select whose options are populated through a `GET` request to the endpoint specified in the `formSchemasEndpoint` property in the configuration. The `Time Range` field allows the user to select a period of time between two dates. The values of the form's fields are used to filter the forms that will be exported in the CSV file.

The submission of the form will trigger the download of the CSV file containing the export of the form schemas' data.

In order to open the `ck-export-form` in a Backoffice, a configuration is needed to configure a button to emit the custom event `export-form`. An example configuration follows: 

```
{
  "$ref": {},
  "content": {
    "attributes": {
      "style": "height: calc(100vh - 64px);"
    },
    "type": "row",
    "content": [
      {
        "type": "element",
        "tag": "bk-button",
        "properties": {
          "content": "Export",
          "clickConfig": {
            "type": "event",
            "actionConfig": {
              "label": "export-form",
              "payload": {}
            }
          }
        }
      },
      {
        "type": "element",
        "tag": "ck-export-form",
        "properties": {
          "formSchemasEndpoint": "/v2/form-schemas/",
          "formDataEnpoint": "/v2/forms-data/"
        }
      }
    ]
  }
}
```

## Properties & Attributes

| property | type | required | default | description |
|----------|------|----------|---------|-------------|
|`formSchemasEndpoint`| string | true | '' | Path to the CRUD endpoint that stores the form schemas' data. It is used to populate the `Form Schema` options in the form. |
|`formDataEndpoint`| string | true | '' | Path to the CRUD that stores the forms' data. |

## Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|export-form| Triggers the opening or the closing of the modal. | - | - |

## Emits

| event | description |
|-------|-------------|
|export-form| Custom event, triggers the opening or the closing of the modal. |
