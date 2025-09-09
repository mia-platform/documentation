---
id: overview
title: Booking Module overview
sidebar_label: Overview
---



The **Booking Module** provides developers with a pre-made but extensible solution to handle appointments and teleconsultations.

This software component built with a microservice architecture allows to schedule appointments and to create teleconsultation rooms. It exposes a synchronous HTTP REST API. The internal communication between different microservices is implemented with synchronous HTTP REST interfaces.

The module is packaged as a Mia-Platform Application, enabling developers to configure everything in just a few steps and have all the services up and running.

This is the list of the installed microservices:

- [Appointment Manager][appointment-manager]
- [Teleconsultation Service Backend][teleconsultation-service-be]
- [Teleconsultation Service Frontend][teleconsultation-service-fe]
- [CRUD Service][mia-crud-service]
- [API Gateway][mia-api-gateway]

[appointment-manager]: /runtime_suite/appointment-manager/10_overview.md
[teleconsultation-service-be]: /runtime_suite/teleconsultation-service-backend/10_overview.md
[teleconsultation-service-fe]: /runtime_suite/teleconsultation-service-frontend/10_overview.md
[mia-crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[mia-api-gateway]: /runtime_suite/api-gateway/10_overview.md
