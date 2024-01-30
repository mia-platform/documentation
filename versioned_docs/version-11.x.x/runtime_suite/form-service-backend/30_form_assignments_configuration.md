---
id: form_assignments_configuration
title: Form assignments configuration
sidebar_label: Form assignments configuration
---
If you want to use the [Form assignments](../../runtime_suite/form-service-frontend/form_assignments) feature of the **Form Service Frontend**, version `1.2.0` (or above) of the **Form Service Backend** is required.

## Form Service Backend Configuration

The [Form Service Configuration](./20_configuration.md) JSON object now has additional properties.

| Name                    | Type       | Required | Default | Documentation                                                         | Description                                                                                           |
|-------------------------|------------|----------|---------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **formAssignmentsCrud** | `Object`   | No       | -       | [form assignments CRUD parameters](#form-assignments-crud-parameters) | Contains details about the CRUD that is used to store the form template and the users assigned to it. |
| **userGroups**          | `Object[]` | No       | -       | [user groups parameters](#user-groups-parameters)                     | The user groups that can be chosen in `Submitted forms viewers` field of the Form Builder.            |

:::info

Leaving the Form Service Configurations without the `formAssignmentsCrud` property turns off the **Form assignments** feature. This also ensures backwards compatibility with previous configurations.

:::

### Form assignments CRUD parameters

This section defines the details of the CRUD responsible for storing the reletionship between a form template customized with the Form Builder and the users that will submit data.

The properties of the `formAssignmentsCrud` object are the following:

- **name**
  - *type*: string;
  - *required*: `true`;
  - *description*: the name of the form assignments CRUD endpoint (i.e. `/form-assignments`).

- **formIdPropName**
  - *type*: string;
  - *required*: `true`;
  - *description*: the name of the property that stores the ID of the form template for a form assignment (i.e. `formTemplateId` or `formSchemaId`).

- **manualAssignmentsPropName**
  - *type*: string;
  - *required*: `true`;
  - *description*: the name of the property that stores user IDs array. The form defined in the `formIdPropName` is assigned to the users contained in this array. These users will be able to submit data with the `/visualizer/fill-assignment/{assignmentId}` route of the [Form Service Frontend](../../runtime_suite/form-service-frontend/overview).

:::info

The [Mia-Backoffice](../../business_suite/backoffice/overview) can be used to update this array and assign a form template to specific users.

:::

- **automaticAssignmentsPropName**
  - *type*: string;
  - *required*: `false`;
  - *description*: the name of the property that store an additional user IDs array. The users contained in this array will also be able to submit data for a specific assignment.

:::info

This array is designed to store IDs computed from another assignment property. For instance, it can be used to assign a questionnaire to users of a specific cluster (such as users in the same company or department). You can use a [PRE decorator](../../development_suite/api-console/api-design/plugin_baas_4#pre-and-post-decorators) to manipulate a `POST` or a `PATCH` of an assignment and update the `automaticAssignments` array accordingly.

:::

Here an example:

```json
  "formAssignmentsCrud": {
    "name": "/form-assignments",
    "formIdPropName": "formTemplateId",
    "manualAssignmentsPropName": "customerIds",
    "automaticAssignmentsPropName": "automaticUserIds"
  }
```

### User groups parameters

This config object specifies the different user groups that your application supports (for example `admins`, `accountant` and `users`), and enables a user to configure a form template allowing only specific user groups to view submitted data.

An array of *user groups* objects must be defined with the following properties:

- **group**: an unique group identifier;
- **label**: a mandatory label that will be displayed in the Form Builder as select entry.

Here an example:

```json
  "userGroups": [
    {
      "group": "admin",
      "label": "Administrator"
    },
    {
      "id": "accounting",
      "label": "Accountant"
    }
  ]
```

:::caution

The Form Service doesn't provide any authentication or authorization system nor user management systems. Further information can be found [here](../../console/project-configuration/authorization-flow).

:::

To see how user groups are rendered in the Form Builder UI check the [Form Service Frontend assignments](../../runtime_suite/form-service-frontend/form_assignments) documentation.

## CRUDs update

To support the **Form Assignments** you need to update the **form_schemas** CRUD and create a new one named for example **form_assignments** to link a form template to specific users.

### form_schemas

This CRUD described in this service [configuration](./20_configuration.md/#create-required-cruds) must be updated with additional properties:

- **isEditable**, of type *boolean*, which defines if a form submission can be updated by the user who submitted it in the first place;
- **isPrivate**, of type *boolean*, which specifies if a form template can be displayed to every user, or instead it needs to be assigned to enable the form access;
- **enabledUserGroups**, of type *array of string*, which stores the user groups that will have 'view only' access of the submitted data.

### form_assignments

This CRUD enables the assignment of a form template to specific users. We recommend to [create a CRUD](../../development_suite/api-console/api-design/crud_advanced) named `form_assignments`.

The required properties (specified in the [form assignments CRUD parameters](#form-assignments-crud-parameters) section) of the CRUD can be imported downloading this <a download target="_blank" href="/docs_files_to_download/form-service-backend/form_assignments_crud_fields.json">example json file</a>.

You also need to expose a new endpoint `/form-assignments` following [this guide](../../development_suite/api-console/api-design/endpoints). You can use a different name paying attention to change the *formAssignmentsCrud* parameter accordingly. The type of this endpoint is `CRUD`.

## Form assignments ACL

The **Form Visualizer** endpoints described in the [service overview](./10_overview.md) have been updated to enforce the following ACLs:

- a user can access a private (`isPrivate` is true) form template only when assigned or has a group contained in the **form_schemas** *enabledUserGroups* array;
- a user can update form submission only if the form template is editable (`isEditable` is true).

Additional information can be found in the [Form assignments](../../runtime_suite/form-service-frontend/form_assignments) documentation of the **Form Service Frontend**.
