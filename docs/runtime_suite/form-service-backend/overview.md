---
id: overview
title: Form Service
sidebar_label: Overview
---
The Form Service is a Mia-Platform plugin that uses [formio.js](https://github.com/formio/formio.js) to provide a custom micro-frontend to build and visualize forms.
It has two different frontends: the **Form Builder** and the **Form Visualizer**.

- The Form Builder allows users to create custom forms, that can be used for different use cases, by means of a customizable UI usable also by non-technical users.

- The Form Visualizer allows one to display forms created with the form builder. By using the form visualizer it is possible to fill forms and submit their data to a configurable endpoint.

The Form Service as a [microlc plugin](../../business_suite/microlc/overview#plugins) can be used with microlc itself, but it can also be integrated with the Mia Platform Headless CMS as an [iframe plugin](../../business_suite/microlc/plugin_configuration#iframe-plugin).

The output of the Form Builder is a JSON configuration of the form that later can be rendered with [formio.js renderer](https://github.com/formio/formio.js/wiki/Form-Renderer) or with the Form Visualizer.

The Mia-Platform Form Builder currently supports Forms and Wizards. An example of Form Builder can be found in the [formio.js demo page](https://formio.github.io/formio.js/app/builder). The image below shows a customized Form Builder (the `JSON` options are the ones found in the example provided [here](configuration#form-builder-options-parameters)).

![Form Builder UI](img/form-builder-ui-sandbox.png)

The right side of the image above also shows the created form that can be displayed in the Form Visualizer and can be filled and submitted by a user. The image below shows the form, rendered in the Form Visualizer.

![Form Visualizer UI](img/form-visualizer-ui-sandbox.png)

## How it works

### Form Builder Configuration

The service works with two components, the **Form Service Frontend** and the **Form Service Backend**. To configure and deploy them check [this guide](configuration).

The frontend service exposes the following APIs:

#### Form Builder
- `GET /builder/create-form`: it allows the creation of a new form template;
- `GET /builder/{id}`: it shows one form template by ID and let you update it.

:::info

The `baseUrl` property equal to the URL's origin is injected in the form builder and form visualizer options (`from Form Service Frontend v1.1.0`). This enables the usage of relative URLs in the [formio select component](https://help.form.io/userguide/forms/form-components#select) using `URL` as *Data Source Type* (useful to define the data source according to the deployed environment).

:::
  
#### Form Visualizer
- `GET /visualizer/fill-form/{id}`: it allows the end user to submit data on a new form, selected by form template ID;
- `GET /visualizer/{id}`: returns the submitted data for the specified form ID;
- `GET /visualizer/print-form/{id}`: (`from Form Service Frontend v1.1.0`) returns a printable version of submitted data for a form ID (submit button is removed from Forms and Wizards are displayed as Forms).

:::info

The `/visualizer/fill-form/` and `/visualizer/{id}` routes (`from Form Service Frontend v1.1.0`) accept the `onSubmitRedirect` query parameter which is used to redirect a user to a specific URL after a new form submission or after an update. 

:::

:::info

The frontend service endpoints are as described before when the Form Service Frontend is used in microlc. When the frontend is used standalone or integrated with the Mia-Platform Headless CMS the base path is `/#/`. With a frontend service endpoint equal to `/form-service`, the path to create a new custom form is `/form-service/#/builder/create-form`.

:::

The backend service exposes the following APIs:
- Form Builder:
  - ` GET /builder/config`: it returns the configuration needed to show the Form Builder visualizer;
  - ` POST /builder/schemas`: it allows saving the created form;
  - ` GET /builder/schemas/{id}`: it returns one form by ID;
  - ` PUT /builder/schemas/{id}`: it updates one form by ID.
- Form Visualizer:
  - ` GET /visualizer/schemas/{id}`: it returns a configured form that will be shown in the Form Visualizer;
  - ` POST /visualizer/forms`: it saves the submitted data of a user that filled a form shown in the Form Visualizer;
  - ` GET /visualizer/forms/{id}`: it returns a submitted form by ID, enabling the review of data provided by the end user;
  - ` PUT /visualizer/forms/{id}`: it updates a submitted form by ID.

These endpoints are defined in the **Form Service Backend** and are called by the **Form Service Frontend** plugin (regardless being integrated in microlc or Headless CMS).

## Further details

Follow the pages below to know more about the _Form Builder_:

- [_Form Builder_ configuration](configuration)
