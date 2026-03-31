---
id: requirements
title: Booking Module requirements
sidebar_label: Requirements
---



## Secrets

Secrets must be manually defined in an mlp.yaml file inside the project repository in order to interpolate their values in the environment variables. You can download the file <a download target="_blank" href="/docs_files_to_download/booking-module/mlp.yaml">here</a>.

This is the list of *Secrets* that must be manually configured:

- **BANDYER_API_SECRET_KEY**, API Secret Key to use in order to communicate with Kaleyra's APIs;
- **BANDYER_APP_ID**, App id of Kaleyra's APIs;
- **BANDYER_BASE_URL**, Name of the Kaleyra API endpoint;
- **MONGODB_URL**, necessary to connect the CRUD Service to MongoDB.

## Service request for network policies

Open a Service Request and ask for specialist support to add these policies:

- allow ingress and egress from the `booking-module` to the `user-auth-module`
- allow egress from `booking-module` to the `notification-module`
- allow ingress from `booking-module` to the `patient-monitoring-portal`

## Namespaces configuration in the CMS

Add the following namespaces in the related CMS section. They are required to correctly communicate with other modules deployed in different projects.

```json
[
  {
    "value": "{{USER_MANAGER_MODULE_NAMESPACE}}",
    "label": "User Manager Module"
  },
  {
    "value": "{{NOTIFICATION_MODULE_NAMESPACE}}",
    "label": "Notification Module"
  }
]
```
