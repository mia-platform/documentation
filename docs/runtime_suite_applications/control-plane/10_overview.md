---
id: overview
title: Overview
sidebar_label: Overview
---

_Control Plane_ is a specialized microservice designed to manage the runtime deployment of _Fast Data_ within a Kubernetes environment. Its core functionality includes the ability to alter, store, and reset the runtime state of microservices that constitute the Mia-Platform _Fast Data_ solution.

![Control Plane Architecture](img/arch.v0.svg)

The diagram above illustrates the architecture of _Control Plane_, showcasing the interaction between its components and their roles in managing the runtime environment.
It mainly consists of two integral components:

1. **[HTTP Controller](#http-controller)**
2. **[State Adapter](#state-adapter)**

This separation of responsibilities ensures effective communication and control over the state of microservices, providing a robust and adaptable solution for runtime management within a Kubernetes environment.

### HTTP Controller

The **HTTP Controller** serves as a web server, exposing a [JSON-RPC 2.0](https://www.jsonrpc.org/specification) compliant API. This API allows clients to instruct the runtime to achieve a desired state, crucial for the smooth operation of the Mia-Platform _Fast Data_ solution.

For example, when dealing with _Fast Data_ microservices that spawn _Kafka_ consumers, a desired state could be to `pause` or subsequently `restart` the consumption of messages by these consumers on a specific _Kafka_ topic.

### State Adapter

The **State Adapter** is responsible for persisting the current runtime state of a _Fast Data_ deployment. Its workflow involves:

1. Listening to commands invoked by clients through the `JSON-RPC` interface.
2. Comparing the parameters provided in the call with the latest state available from the persistence source.
3. Patching the current persistence state with the next desired state.
4. Storing the updated state back to the persistence service.

Simultaneously, in another thread, the State Adapter polls or streams the persistence source and sends updates to the `state channel` pub/sub channel.

Streaming the currently desired state is a task completely independent of storing the desired state. This separation of concerns enhances the flexibility and efficiency of runtime management.

Using multitenant resources to publish changes and persist state, _Control Plane_ is not only suitable for controlling microservices within its deployment namespace but can also extend its control to microservices deployed in other namespaces.

### Architecture Details

_Control Plane_ is implemented in `Node.js` 20.x, utilizing multi-threading via the [Worker API](https://nodejs.org/docs/latest-v20.x/api/worker_threads.html).

The main thread runs the HTTP server, exposing:

- Control JSON-RPC interface
- Frontend endpoint
- Metrics
- Probes

The worker thread implements:

- Database client (MongoDB)
- Pub/Sub producer (Kafka)

![Internal Structure of Control Plane](img/internals.v0.svg)

:::note

For detailed configuration, refer to the specific [documentation page](./20_configuration.mdx).

:::

:::note

For a better explanation of how the runtime communication works, read the [Fast Data Runtime Management documentation](../../fast_data/runtime_management.mdx).

:::