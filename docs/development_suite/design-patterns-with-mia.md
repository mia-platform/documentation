---
id: design-patterns-with-mia
title: Design patterns with Mia
sidebar_label: Design patterns with Mia
sidebar_order: 0
---

### Database per microservice

Definition: Decouple your data stores, allowing each Microservice to have its dedicated database, ensuring data autonomy and minimizing dependencies.

In Mia console it is not possible to have more than one database per project. Once you add the crud service to your project and configure it with the mongoDb url all the collections added and configured in the data models section of the console will be added to your database.

### Event Sourcing

Definition: Capture and store all changes to an application's state as a sequence of events, enabling scalable and reliable event-driven architectures.

**TODO**


### Saga

Definition: Implement a pattern for managing distributed transactions, ensuring consistency across Microservices in complex workflows.

With Mia Console it is possible to use the Flow Manager plugin.
The Flow Manager is a saga orchestrator, capable to manage complex flows structured by using the architectural pattern named **Saga Pattern**, using in particular the Command/Orchestration approach.
The Flow Manager receives a Finite State Machine through a configuration file and is capable to orchestrate the saga flow based on the received machine. With the finite state machine it can orchestrate the saga flow through the states using commands and events. For more detailed information you can find the documentation of the Flow Manager microservice in the following link: [Flow Manager](/runtime_suite/flow-manager-service/10_overview.md)

### API Gateway

Definition: Centralize and manage external access to your Microservices, simplifying client interactions and enhancing security.

With the console it is possible to use the API Gateway plugin in your project.
The microservice is responsible for routing requests to the correct service inside Kubernetes and to verify the need of authentication and orchestrate the conversation with Auth service.
For more detailed information you can find the documentation of the API Gatewat microservice in the following link: [API Gateway](/runtime_suite/api-gateway/10_overview.md)

### Backend For Frontend

Definition: Tailor backend services specifically for different frontend applications, optimizing
user experiences.

The console gives you full control in creating new microservices from templates or docker images, in this way you can add BFF microservices to add a layer between the frontend and all the backend microservices of your project.
**TODO-add more details maybe**

### Strangler

Definition: Gradually replace legacy monolithic systems with Microservices, allowing for a seamless transition while maintaining existing functionality.

**TODO**

### Circuit Breaker

Definition: Build fault tolerance into your Microservices by detecting and handling network or service failures gracefully.

**TODO**

### CQRS (Command Query Responsability Segregation)

Definition: Separate the read-and-write operations of your data, enabling better scalability and performance optimization.

Mia Console integrates this pattern in the Fast Data architecture. With Fast Data it is possible to divide the read-write operations using projections and kafka topics. In the kafka topics will arrive new messages that signalize that a new modification has been made in the source database, the fast data product then generates projection to modify a specific single view. Once the single view has been modified all the microservices that read from the single view can retrieve the updated information in real time.
For more detailed information you can find the documentation of the Fast Data product and architecture in the following link: [Fast Data](/fast_data/what_is_fast_data.md)