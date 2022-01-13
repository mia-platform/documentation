---
id: overview
title: Form Service Frontend
sidebar_label: Overview
---
The Form Service Frontend is a Mia-Platform plugin that uses [formio.js](https://github.com/formio/formio.js) to provide a custom micro-frontend to build and visualize forms. It has two different frontends: the **Form Builder** and the **Form Visualizer**.

- The Form Builder allows users to create custom forms, that can be used for different use cases, by means of a customizable UI usable also by non-technical users.

- The Form Visualizer allows one to display forms created with the form builder. By using the form visualizer it is possible to fill forms and submit their data to a configurable endpoint.

The Form Service Frontend as a [micro-lc plugin](https://microlc.io/documentation/docs/micro-lc/plugin_configuration#qiankun-plugin) can be used with microlc itself, but it can also be integrated with the Mia Platform Headless CMS as an [iframe plugin](https://microlc.io/documentation/docs/micro-lc/plugin_configuration#iframe-plugin).

The output of the Form Builder is a JSON configuration of the form that later can be rendered with [formio.js renderer](https://github.com/formio/formio.js/wiki/Form-Renderer) or with the Form Visualizer.

The Mia-Platform Form Builder currently supports Forms and Wizards. An example of Form Builder can be found in the [formio.js demo page](https://formio.github.io/formio.js/app/builder). The image below shows a customized Form Builder (the `JSON` options are the ones found in the example provided [here](configuration#form-builder-options-parameters)).

![Form Builder UI](img/form-builder-ui-sandbox.png)

The right side of the image above also shows the created form that can be displayed in the Form Visualizer and can be filled and submitted by a user. The image below shows the form, rendered in the Form Visualizer.

![Form Visualizer UI](img/form-visualizer-ui-sandbox.png)

## How it works

The **Form Service Frontend** retrive the configuration needed from the the **Form Service Backend**. To know more about the backend service check [this guide](../form-service-backend/overview).

The frontend service exposes the following routes:

### Form Builder
- `GET /builder/create-form`: it allows the creation of a new form template;
- `GET /builder/{id}`: it shows one form template by ID and let you update it.

:::info

The `baseUrl` property equal to the URL's origin is injected in the form builder and form visualizer options (`from version 1.1.0`). This enables the usage of relative URLs in the [formio select component](https://help.form.io/userguide/forms/form-components#select) using `URL` as *Data Source Type* (useful to define the data source according to the deployed environment).

:::
  
### Form Visualizer
- `GET /visualizer/fill-form/{id}`: it allows the end user to submit data on a new form, selected by form template ID;
- `GET /visualizer/{id}`: returns the submitted data for the specified form ID;
- `GET /visualizer/print-form/{id}`: (`from version 1.1.0`) returns a printable version of submitted data for a form ID (submit button is removed from Forms and Wizards are displayed as Forms);
- `GET /visualizer/fill-assignment/{assignmentId}`: (`from version 1.2.0`) it allows the end user to submit data on a new [form assignment](form_assignments), selected by form assignment ID.

:::info

The `/visualizer/fill-form/` and `/visualizer/{id}` routes (`from version 1.1.0`) accept the `onSubmitRedirect` query parameter which is used to redirect a user to a specific URL after a new form submission or after an update. 

:::

:::info

The frontend service endpoints are as described before when the Form Service Frontend is used in micro-lc. When the frontend is used standalone or integrated with the Mia-Platform Headless CMS the base path is `/#/`. With a frontend service endpoint equal to `/form-service`, the path to create a new custom form is `/form-service/#/builder/create-form`.

:::

## Further details

Follow the pages below to know more about the _Form Service Frontend_:

- [_Form Service Frontend_ configuration](configuration)
