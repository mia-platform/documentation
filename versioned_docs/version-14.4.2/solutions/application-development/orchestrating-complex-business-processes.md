---
id: orchestrating-complex-business-processes
title: Orchestrating Complex Business Processes with Flow Manager
sidebar_label: Orchestrating Complex Business Processes
---

### The Scenario

An e-commerce company is building a new order processing system. The process is complex and involves multiple microservices: one for checking inventory, one for processing payments, and one for arranging shipments. If any of these steps fail, the entire transaction must be rolled back to maintain data consistency.

### The Challenge

* **Distributed Transaction Management**: Coordinating actions across multiple services is hard. A simple direct communication (choreography) approach, where services call each other, would create a fragile and tightly coupled system, often called a "distributed monolith".
* **Data Consistency**: If the payment is successful but the shipment fails, how do you handle the refund? Ensuring data consistency across different databases (inventory, payments, shipments) is a major challenge.
* **Error Handling and Compensation**: The system needs robust error handling. For every action, a corresponding "compensation" action (or rollback) must be defined and triggered in case of failure. Managing this logic within each service is complex and duplicates effort.
* **Lack of Visibility**: With a choreographed approach, it's very difficult to understand the overall state of an order. Where did it fail? Why? Diagnosing and debugging problems becomes a nightmare.

### The Solution with Mia-Platform

The development team decides to implement the **Saga Pattern** using the **Flow Manager Service**, an orchestration engine available in the Mia-Platform Marketplace.

1.  **Designing the Saga as a Finite State Machine**: First, the team uses the **Flow Manager Configurator**, a no-code graphical interface in the Console, to design the entire order process as a finite state machine. They define the states:
    * `OrderCreated` (initial state)
    * `InventoryChecked`
    * `PaymentProcessed`
    * `OrderShipped` (final success state)
    * `OrderFailed` (final failure state)

2.  **Defining Commands and Events**: For each state transition, they define **commands** (actions to be performed by other services) and **events** (outcomes of those actions).
    * From `OrderCreated`, the Flow Manager sends a `CheckInventory` command.
    * The Inventory Service processes the command and responds with either an `InventoryCheckOK` or `InventoryCheckKO` event.
    * Based on the event, the Flow Manager moves the saga to the next state (`InventoryChecked` or `OrderFailed`). This logic is repeated for the payment and shipment steps.

3.  **Configuring the Communication Protocol**: The team configures the Flow Manager to communicate with the other microservices via **Kafka**. This creates a decoupled and resilient architecture. The Flow Manager publishes commands on a `commands-topic`, and listens for events on an `events-topic`.

4.  **Implementing the Microservices**: The existing microservices (Inventory, Payment, Shipment) are slightly modified to:
    * Consume commands from the Kafka topic.
    * Perform their business logic.
    * Produce the corresponding outcome event back to the events topic.
      They don't need to know anything about the overall process; they just do their job and report the result.

5.  **Persistency and Visibility**: The Flow Manager is configured to use a **CRUD** collection to persist the state of each saga instance. This means that at any time, the team can query the CRUD to know the exact state of a specific order, providing complete visibility into the process.

### The Outcome

* **Decoupled and Resilient Architecture**: The microservices are completely decoupled. The Flow Manager is the single source of truth for the process, making the system easier to understand, maintain, and evolve. If a service is temporarily down, the saga remains in its current state, and can be resumed later.
* **Guaranteed Data Consistency**: The Saga pattern ensures that the process is either completed successfully or fully rolled back. The Flow Manager handles the compensation logic (e.g., sending a `RefundPayment` command if the shipment fails), guaranteeing that the system never ends up in an inconsistent state.
* **Centralized Logic and Visibility**: The entire business process is defined and visualized in one place—the Flow Manager Configurator. This makes it easy for both technical and business stakeholders to understand and modify the flow. Debugging becomes simple, as the state of each order is persisted and auditable.
* **Accelerated Development**: The developers of the individual microservices didn't have to worry about the complexity of the overall transaction. They focused solely on their domain logic, leading to faster development and higher quality code.

The Flow Manager Service allowed the team to tame the complexity of distributed transactions, delivering a robust and reliable order processing system while maintaining a loosely coupled and scalable microservices architecture.
