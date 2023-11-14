---
id: submit_urls
title: Submit URLs API
sidebar_label: Submit urls
---
The *submit URLs* can be either provided with the [CRUD Service](../../runtime_suite/crud-service/overview_and_usage) or with custom APIs, but it's important that they expose the following methods:

- `GET /{id}`
- `POST /`
- `PATCH /{id}`
- `DELETE /{id}`
- `GET /export` (required by version `1.7.0` or later)

:::info

You can configure the **Form Service Backend** to reach the `GET /export` endpoint on a different service than the one targeted by the submit URL by configuring an [export redirect](./20_configuration.md#export-redirects-exportredirects). 

:::

## GET /{id} route
The `GET /{id}` route returns the submitted data of a form by ID. 

### Response body schema
If the retrieve data procedure is successful, the response body must be a JSON object with the following schema: 

| Name     | Required | Description                          |
|----------|----------|--------------------------------------|
| data     | `true`   | Content of the form data             |
| isValid  | `true`   | It indicates if the form is stable   |
| hasDraft | `true`   | It indicates if the form has a draft |

:::info

Each property of the `data` object is related to a component of the form.

:::

#### Example

```json
{
  "data": {
    "property1": "value1",
    "property2": "value2",
    "...": "..."
  },
  "isValid": true,
  "hasDraft": false
}
```

## GET /export route
The `GET /export` route returns the submitted data of the forms matching the query parameters and must be compatible with the API of the endpoint of the [CRUD Service](../../runtime_suite/crud-service/overview_and_usage). Specifically, this endpoint must support filtering data using the `_q` query parameter or any form data field.

This endpoint must return a list of JSON objects in [newline delimited JSON](http://ndjson.org/) format.

## POST route
The `POST /` route saves the data of a new submitted form. 

### Request body schema
The `POST` route must receive a body containing a JSON object with the following schema:

| Name             | Required | Description                                                 |
|------------------|----------|-------------------------------------------------------------|
| formSchemaId     | `true`   | The ID of the form schema related to the provided form data |
| formAssignmentId | `false`  | The ID of the form assignment                               |
| data             | `true`   | Content of the form data                                    |
| isValid          | `true`   | It indicates if the form is stable                          |
| hasDraft         | `true`   | It indicates if the form has a draft                        |

#### Example

```json
{
  "formSchemaId": "1234",
  "data": {
    "property1": "value1",
    "property2": "value2",
    "...": "..."
  }
}
```

### Response body schema
If the save procedure is successful, the response body must be a JSON object with the following schema:

| Name | Required | Description                   |
|------|----------|-------------------------------|
| _id  | `true`   | The ID of the saved form data |

The returned `_id` will be stored by the _Form Service Backend_, and it will be used to retrieve the form data through the `GET /{id}` route.

#### Example

```json
{
  "_id": "fd215ds6s4sa5a",
}
```

## PATCH route
The `PATCH /{id}` route updates the data of a previously submitted form. 

:::info

Note that, the Form Service Backend calls the `PATCH` route with a body containing the entire form data, regardless if the properties has been modified or not by the user.

:::

### Request body schema
The `PATCH` route must receive a body containing a JSON object with the following schema:

| Name             | Required | Description                                                 |
|------------------|----------|-------------------------------------------------------------|
| formSchemaId     | `false`  | The ID of the form schema related to the provided form data |
| formAssignmentId | `false`  | The ID of the form assignment                               |
| data             | `false`  | Content of the form data                                    |
| isValid          | `false`  | It indicates if the form is stable                          |
| hasDraft         | `false`  | It indicates if the form has a draft                        |

All these properties are included into a parent object with the `$set` key.

#### Example

```json
{
  "$set": {
    "formSchemaId": "1234",
    "formAssignmentId": "abcd",
    "data": {
      "property1": "value1",
      "property2": "value2",
      "...": "..."
    }
  }
}
```

### Response body schema
If the update procedure is successful, the response body must be a JSON object with the following schema:

| Name             | Required | Description                                                 |
|------------------|----------|-------------------------------------------------------------|
| _id              | `true`   | The ID of the updated form data                             |
| formSchemaId     | `true`   | The ID of the form schema related to the provided form data |
| formAssignmentId | `false`  | The ID of the form assignment                               |
| data             | `true`   | Content of the form data                                    |
| isValid          | `true`   | It indicates if the form is stable                          |
| hasDraft         | `true`   | It indicates if the form has a draft                        |

#### Example

```json
{
  "formDataId": "fd215ds6s4sa5a",
  "formSchemaId": "1234",
  "formAssignmentId": "abcd",
  "data": {
    "property1": "value1",
    "property2": "value2",
    "...": "...",
  },
  "isValid": true,
  "hasDraft": false
}
```

## DELETE route
The `DELETE /{id}` route removes a form saved data from the form storage. It is required to allow to rollback in case of failure during the insertion in the `formSchemaMapCrud` collection.

The `DELETE` route does not have a request body. The only passed parameter is the `ID` of the form data represented by the query parameter `{id}`. There is no schema for the response body since we only provide a `204 No Content`.
