---
id: notifications
title: Notifications via messaging service
sidebar_label: Notifications
---
Starting from version v1.9.0, it is possible to send an email to the user upon form submission to confirm the successful submission.
Email sending is carried out by the messaging service (available in the marketplace).

## Configuration
To enable this functionality, you need to set the following fields in the config map.
- **isMessagingAvailable**
- **messagingOptions**

### Enabling notifications (`isMessagingAvailable`)
It's a boolean field. Default is `false`.

If set to 'true', the 'messagingOptions' field must also be present; otherwise, the configmap will not be validated.

### Configure notifications (`messagingOptions`)
This object contains the necessary fields to configure email sending through the messaging service:

- **messagingServiceName** (*required*): the name of the messaging service.
- **templatesCrudName** (*required*): The name of the CRUD collection for message templates.
- **userIdField** (*required*): The field of the users CRUD collection containing the id used in this service.

## CRUD
The CRUD collection of `form-schemas` has to updated with the following fields:

- **emailEnabled** (optional), of type *boolean*, which enables the email notification for a specific form schema. It must be set to `true` for sending the email to the user;
- **emailTemplateId**(optional) , of type *object*, which is the id of the email template;
- **emailCarbonCopies** (optional), of type *array of strings*, which is the array containing the email addresses to be set as carbon copies (CC);
- **emailBlindCarbonCopies** (optional), of type *array of strings*, which is the array containing the email addresses to be set as blind carbon copies (BCC).
- **emailSender** (optional), of type *string*, which is the email used to send the recap email.

## Usage

### Retrieving email templates - GET /templates
This service exposes an endpoint for retrieving the email templates. Such endpoint should be used by the frontend to allow the admin to set the proper template for each form.

### Sending emails on form submission - POST /visualizer/forms
When a user submits a form, an email is sent using the template specified in the `emailTemplateId` field. The recipient of the email is the user, derived from the authentication header specified by the environment variable `USERID_HEADER_KEY`. Additionally, you have the option to include other email addresses as carbon copies (CC) and blind carbon copies (BCC). These email addresses should be provided respectively in the `emailCarbonCopies` and `emailBlindCarbonCopies` fields.

### Sending emails on form update - PUT /visualizer/forms/:id
When a user updates a form, an email is sent using the template specified in the `emailTemplateId` field. The recipient of the email is the user, derived from the authentication header specified by the environment variable `USERID_HEADER_KEY`. Additionally, you have the option to include other email addresses as carbon copies (CC) and blind carbon copies (BCC). These email addresses should be provided respectively in the `emailCarbonCopies` and `emailBlindCarbonCopies` fields.

:::note
You can interpolate the data submitted via the form by employing handlebars within the email template.
:::
