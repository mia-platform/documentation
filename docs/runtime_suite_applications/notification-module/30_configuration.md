---
id: configuration
title: Notification Module configuration
sidebar_label: Configuration
---



## Communication channels

The active channels, the sender contacts and additional details can be configured in a json file used by the [Notification Manager][mia-notification-manager] service. This is the automatically generated file:

```json
{
  "userFields": {},
  "activeChannels": [
    "email",
    "sms",
    "whatsapp",
    "voice",
    "push"
  ],
  "sender": {
    "email": "{{EMAIL_SENDER}}",
    "sms": "{{SMS_SENDER}}",
    "voice": "{{VOICE_SENDER}}",
    "whatsappPhoneNumberId": "{{WHATSAPP_SENDER}}"
  },
  "voice": {
    "retryCount": 0,
    "speechSpeed": "medium",
    "speechLanguage": "it-IT"
  },
  "push": {
    "provider": "firebase"
  }
}
```

Different external communication providers can be configured setting the corresponding environment variables. For more details please refer to the documentation of these microservices:

- [Notification Manager][mia-notification-manager];
- [SMS Service][mia-sms-service];
- [Mail Service][mia-mail-service].


## Custom event handlers

Custom events can be defined adding custom handlers to the Notification Manager service. See the microservice documentation about [custom handlers][mia-notification-manager-custom-handler] for additional info.


## Client-side field level encryption

Client-Side Field Level Encryption (CSFLE) is a feature that enables you to encrypt data in your application before you send it over the network to MongoDB. With CSFLE enabled, no MongoDB product has access to your data in an unencrypted form.

The CRUD Service can use CSFLE as explained in the microservice [documentation][mia-crud-service-csfle].


## Patient Monitoring Portal

The Notification Module capabilities can be tested with the exposed HTTP REST API interface or using the *Doctors and Patients Monitoring Portal*, which is a GUI client currently under development. Please contact the Mia-Care team to have access to this portal. 

## Proxies

Define one `cross-project` proxy to the `USER_MANAGER_MODULE_NAMESPACE` with this specifications:

- host: `user-manager-service`;
- port: `80`.


## Endpoints

No additional endpoints are required.

## Add the messages view

:::warning

There is a bug in the views generated from the applications, so we are adding the `nm_nm_notification_messages` view manually.

:::

Create manually the `nm_nm_notification_messages` view:

- Starting collection: `nm_nm_notification`
- Import the data: <a download target="_blank" href="/docs_files_to_download/notification-module/nm_nm_notification_messages.json">messages_schema</a>
- Add the pipeline: <a download target="_blank" href="/docs_files_to_download/notification-module/notification_messages_pipeline.json">messages_pipeline</a>

## Microservices documentation

For additional details about the **Notification Module** configuration, please refer to the documentation of its microservices building blocks:

- [Notification Manager][mia-notification-manager];
- [SMS Service][mia-sms-service];
- [API Gateway][mia-api-gateway];
- [Mail Service][mia-mail-service];
- [Files Service][mia-files-service];
- [Timer Service][mia-timer-service];
- [CRUD Service][mia-crud-service].

[mia-api-gateway]: /runtime_suite/api-gateway/10_overview.md
[mia-crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[mia-crud-service-csfle]: /runtime_suite/crud-service/30_encryption_configuration.md
[mia-notification-manager]: /runtime_suite/notification-manager-service/20_configuration.md#channels-configuration
[mia-notification-manager-custom-handler]: /runtime_suite/notification-manager-service/20_configuration.md#custom-event-handlers
[mia-sms-service]: /runtime_suite/sms-service/10_overview.md
[mia-mail-service]: /runtime_suite/ses-mail-notification-service/configuration.md
[mia-files-service]: /runtime_suite/files-service/configuration.mdx
[mia-timer-service]: /runtime_suite/timer-service/20_configuration.md
[mia-api-gateway]: /runtime_suite/api-gateway/10_overview.md
