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
