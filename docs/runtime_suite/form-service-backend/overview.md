---
id: overview
title: Form Service Backend
sidebar_label: Overview
---
The Form Service Backend is a Mia-Platform plugin that acts as a BFF (Backend For Frontend) for the [Form Service Frontend](../form-service-frontend/overview).

## How it works

The **Form Service Backend** works with the **Form Service Frontend** that provides the **Form Builder** and **Form Visualizer** UI. Further information about the frontend routes are available [here](../form-service-frontend/overview#how-it-works)  

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
- `GET /visualizer/assignments/{assignmentId}/schema-id`: (`from version 1.2.0`) it returns a form ID given a [form assignment](form_assignments_configuration) ID;
- `DELETE /visualizer/forms/{id}`: it deletes a submitted form by ID and its draft;
- `POST /visualizer/forms/draft/{formId}`: if formId is undefined it saves a form and its draft, otherwise it  saves the draft of the form;

These endpoints are defined in the **Form Service Backend** and are called by the **Form Service Frontend** plugin (regardless being integrated in micro-lc or Headless CMS). Discover more about the frontend integration [here](../form-service-frontend/configuration#integration-with-micro-lc-and-headless-cms).

#### Form data versioning support
From `version 1.5.0` the Form-Service Backend supports the versioning of the form data, by including the parameter `_v` to the request performed to retrieve form data. The `_v` parameter specifies the version of the form data to be retrieved. If the `ENABLE_VERSIONING` environment variable is set to `true`, the `_v` parameter is forwarded to the service in charge of retrieving the form data.

:::info

Let us suppose that the `submit_url` has been set to `http://microservice/resource`. When the Form-Service Frontend triggers a request `GET /visualizer/forms/{id}?_v=1` to the Form-Service Backend with a non-null `_v` parameter, the Form-Service Backend will trigger a request `GET http://microservice/resource/{id}?_v=1`

:::

In order to obtain form data versioning, the calls to the **Form-Service Frontend** must be done including the `_v` parameter. See [here](../form-service-frontend/overview#form-data-versioning-support) for Form-Service Frontend usage.

#### Form draft support


The Form-Service Backend allows to retrieve draft data by including the parameter `_status` to the request performed to retrieve the form. If the `_status` parameter is equal to `draft` the data retrieved in the request `GET /visualizer/forms/{id}?_status=draft` is the draft, otherwise it retrives the stable form data.
Every form has two parametes: `isValid` and `hasDraft`. The first one indicates if the form has been submitted. The latter indicates if the draft of the form exists.


## Further details

Follow the pages below to know more about the _Form Service Backend_:

- [_Form Service Backend_ configuration](configuration)

:::warning
The **Form Service Backend** does not perform form validation.
Validation is only performed in the frontend if the **Form Service Frontend** plugin is used.

We recommend building you own form validation in a dedicated backend microservice.

This may change in the future.
:::
