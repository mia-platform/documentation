---
id: overview
title: EHR Module overview
sidebar_label: Overview
---



The **EHR Module** provides developers with a pre-made but extensible solution to handle appointments, teleconsultations and forms.

This software component built with a microservice architecture allows to schedule appointments, to create teleconsultation rooms and to fill in custom forms. It exposes a synchronous HTTP REST API. The internal communication between different microservices is implemented with synchronous HTTP REST interfaces.

The module is packaged as a Mia-Platform Application, enabling developers to configure everything in just a few steps and have all the services up and running.

This is the list of the installed microservices:

- [Form Service Backend][form-service-be]
- [Form Service Frontend][form-service-fe]
- [CRUD Service][mia-crud-service]
- [API Gateway][mia-api-gateway]


[form-service-be]: /runtime-components/plugins/form-service-backend/10_overview.md
[form-service-fe]: /runtime-components/plugins/form-service-frontend/10_overview.md
[mia-crud-service]: /runtime-components/plugins/crud-service/10_overview_and_usage.md
[mia-api-gateway]: /runtime-components/plugins/api-gateway/10_overview.md
