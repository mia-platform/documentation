---
id: requirements
title: Notification Module requirements
sidebar_label: Requirements
---



## Secrets

All the communication channels are active by default, and each of them requires some secrets and environment variables to be defined.

Secrets must be manually defined in an mlp.yaml file inside the project repository in order to interpolate their values in the environment variables. You can download the file <a download target="_blank" href="/docs_files_to_download/notification-module/mlp.yaml">here</a>.

This is the list of *Secrets* that must be manually configured:

 - **KALEYRA_API_KEY**, `sms`, `voice` and `whatsapp` channels;
 - **KALEYRA_BASE_URL**, `sms`, `voice` and `whatsapp` channels;
 - **KALEYRA_SID**, `sms`, `voice` and `whatsapp` channels;
 - **SES_KEY**, `mail` channel;
 - **SES_REGION**, `mail` channel;
 - **SES_SECRET**, `mail` channel;
 - **FIREBASE_CREDENTIALS**, `push` channel;
 - **EMAIL_SENDER**, `mail` channel;
 - **SMS_SENDER**, `sms` channel;
 - **VOICE_SENDER**, `voice` channel;
 - **WHATSAPP_SENDER**, `whatsapp` channel;
 - **MONGODB_URL**, necessary to connect the CRUD Service to MongoDB.

Please refer to the [Notification Manager][mia-notification-manager-env-var] documentation for additional details about the communication channels configuration.

## Service request for network policies

Define the network policies necessary to allow traffic between the User Manager Module namespace and other projects namespaces. Open a Service Request and ask for specialist support to add these policies:

- allow ingress and egress traffic between `notification-module-{{ENV}}` and `user-auth-module-{{ENV}}`;
- allow ingress and egress traffic between `notification-module-{{ENV}}` and `patient-monitoring-potal-{{ENV}}`.

## Namespaces configuration in the CMS

Add the following namespaces in the related CMS section. They are required to correctly communicate with other modules deployed in different projects.

```json
[
  {
    "value": "{{USER_MANAGER_MODULE_NAMESPACE}}",
    "label": "User Manager Module"
  }
]
```

[mia-crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[mia-notification-manager]: /runtime_suite/notification-manager-service/20_configuration.md#channels-configuration
[mia-notification-manager-env-var]: /runtime_suite/notification-manager-service/20_configuration.md#environment-variables
[mia-sms-service]: /runtime_suite/sms-service/10_overview.md
[mia-mail-service]: /runtime_suite/ses-mail-notification-service/configuration.md
[mia-files-service]: /runtime_suite/files-service/configuration.mdx
[mia-timer-service]: /runtime_suite/timer-service/20_configuration.md
[mia-mlp]: https://github.com/mia-platform/mlp
[mlp-secrets-example]: https://github.com/mia-platform/mlp/blob/main/examples/example-cm-secret-config.yaml
