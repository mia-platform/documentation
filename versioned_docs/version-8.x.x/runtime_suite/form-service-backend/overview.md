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

- `GET /visualizer/schemas/{id}`: it returns a configured form that will be shown in the Form Visualizer;
- `POST /visualizer/forms`: it saves the submitted data of a user that filled a form shown in the Form Visualizer;
- `GET /visualizer/forms/{id}`: it returns a submitted form by ID, enabling the review of data provided by the end user;
- `PUT /visualizer/forms/{id}`: it updates a submitted form by ID;
- `GET /visualizer/assignments/{assignmentId}/schema-id`: (`from version 1.2.0`) it returns a form ID given a [form assignment](form_assignments_configuration) ID.

These endpoints are defined in the **Form Service Backend** and are called by the **Form Service Frontend** plugin (regardless being integrated in micro-lc or Headless CMS). Discover more about the frontend integration [here](../form-service-frontend/configuration#integration-with-micro-lc-and-headless-cms).

## Further details

Follow the pages below to know more about the _Form Service Backend_:

- [_Form Service Backend_ configuration](configuration)
