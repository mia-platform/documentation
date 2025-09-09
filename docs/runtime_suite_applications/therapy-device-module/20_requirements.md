---
id: requirements
title: Therapy and Device Module requirements
sidebar_label: Requirements
---



## Secrets

This is the list of *Secrets* that must be manually configured:

 - **MONGODB_URL**, necessary to connect the CRUD Service to MongoDB.

## Service request for network policies

Open a Service Request and ask for specialist support to add these policies:

- allow ingress from `therapy-device-module` to the `patient-monitoring-portal`
- allow ingress and egress from `therapy-device-module` to the `user-auth-module`
- allow egress from `therapy-device-module` to the `notification-module`

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
    "label": "User Manager Module"
  }
]
```
