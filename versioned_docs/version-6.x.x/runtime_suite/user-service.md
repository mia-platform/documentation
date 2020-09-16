---
id: user-service
title:  User Service
sidebar_label: User Service
---
User Service is responsible for managing Users on the Platform.
Allows login, registration and request of real information to a user.

Dialogue with the components: Auth, Session Manager, Email Service, Credential to ensure security and to allow numerous configurations according to customer needs.

The microservice can also be added to **user-properties** to enrich the user with all the information required for the services.

### Credential Service

Credential Service is the microservice that works with user service for user login and registration. It is in fact responsible for managing user credentials.

The microservice is also responsible for managing groups.
