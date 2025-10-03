---
id: configuration
title: User Manager Module configuration
sidebar_label: Configuration
---



## Patient Monitoring Portal

The User Manager Module capabilities can be tested with the exposed HTTP REST API interface or using the *Doctors and Patients Monitoring Portal*, which is a Web Application currently under development. Please contact the Mia-Care team to have access to this portal. 

## Namespaces configuration in the CMS

Add the following namespaces in the related CMS section. They are required to correctly communicate with other modules deployed in different projects.

```json
[
  {
    "value": "{{NOTIFICATION_MODULE_NAMESPACE}}",
    "label": "Notification Module"
  },
  {
    "value": "{{THERAPY_DEVICE_MODULE_NAMESPACE}}",
    "label": "Therapy Device Module"
  },
  {
    "value": "{{EHR_MODULE_NAMESPACE}}",
    "label": "EHR Module"
  },
  {
    "value": "{{BOOKING_MODULE_NAMESPACE}}",
    "label": "Booking Module"
  },
  {
    "value": "{{PATIENT_MONITORING_PORTAL_NAMESPACE}}",
    "label": "Patient Monitoring Portal"
  }
]
```

## Proxies

Define one `cross-project` proxy for each “internal project” of the **Health Composable Platform** that uses the **User Manager Module** as an *Edge Gateway* to communicate outside the cluster. Create all the cross-project proxies in the table:


| Name                              | Host                              | Namespace                             | Port |
| --------------------------------- | --------------------------------- | ------------------------------------- | ---- |
| patient-monitoring-portal-proxy   | api-gateway                       | `PATIENT_MONITORING_PORTAL_NAMESPACE` | 8080 |
| therapy-device-module-proxy       | api-gateway                       | `THERAPY_DEVICE_MODULE_NAMESPACE`     | 8080 |
| notification-module-proxy         | api-gateway                       | `NOTIFICATION_MODULE_NAMESPACE`       | 8080 |
| ehr-module-proxy                  | api-gateway                       | `EHR_MODULE_NAMESPACE`                | 8080 |
| booking-module-proxy              | api-gateway                       | `BOOKING_MODULE_NAMESPACE`            | 8080 |
| teleconsultation-service-fe-proxy | teleconsultation-service-frontend | `EHR_MODULE_NAMESPACE`                | 80   |
| teleconsultation-service-be-proxy | teleconsultation-service-backend  | `EHR_MODULE_NAMESPACE`                | 80   |
| form-service-be-proxy             | form-service-backend              | `EHR_MODULE_NAMESPACE`                | 80   |
| form-service-fe-proxy             | form-service-frontend             | `EHR_MODULE_NAMESPACE`                | 80   |


## Endpoints

Add the necessary `endpoints` for the **cross-project proxies**:

| Base path                | Type                | Microservice                      | Rewrite base path | Security                    |
| ------------------------ | ------------------- | --------------------------------- | ----------------- | --------------------------- |
| `/therapy-device-module` | Cross Project Proxy | therapy-device-module-proxy       | `/`               |                             |
| `/`                      | Cross Project Proxy | patient-monitoring-portal-proxy   | `/`               | [x] Authentication required |
| `/notification-module`   | Cross Project Proxy | notification-module-proxy         | `/`               |                             |
| `/ehr-module`            | Cross Project Proxy | ehr-module-proxy                  | `/`               |                             |
| `/booking-module`        | Cross Project Proxy | booking-module-proxy              | `/`               |                             |
| `/telecons-fe`           | Cross Project Proxy | teleconsultation-service-fe-proxy | `/`               |                             |
| `/api/v1/telecons-be`    | Cross Project Proxy | teleconsultation-service-be-proxy | `/`               |                             |
| `/form-service`          | Cross Project Proxy | form-service-fe-proxy             | `/`               |                             |
| `/api/v1/forms`          | Cross Project Proxy | form-service-be-proxy             | `/`               |                             |

## Microservices documentation

For additional details about the **User Manager Module** configuration, please refer to the documentation of its microservices building blocks:

- [User Manager Service][mia-user-manager-service];
- [Auth0 Client][mia-auth0-client];
- [Oauth login site][oauth-login-site]
- [Authorization Service][mia-authorization-service];
- [API Gateway][mia-api-gateway];
- [CRUD Service][mia-crud-service].

[mia-user-manager-service]: /runtime-components/plugins/user-manager-service/10_overview.md
[mia-auth0-client]: /runtime-components/plugins/auth0-client/10_overview.md
[mia-authorization-service]: /runtime-components/plugins/authorization-service/10_overview.md
[mia-api-gateway]: /runtime-components/plugins/api-gateway/10_overview.md
[mia-crud-service]: /runtime-components/plugins/crud-service/10_overview_and_usage.md
[mia-crud-service-csfle]: /runtime-components/plugins/crud-service/30_encryption_configuration.md
[oauth-login-site]: /runtime-components/applications/secure-api-gateway/10_overview.md#oauth-login-site
