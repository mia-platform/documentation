---
id: data_flow
title: Data flow
sidebar_label: Data flow
---
![Data flow schema](img/data_flow.jpg)

In order to correctly configure a Back-Kit application, it is important to understand how the data flows through the system.

**System to user flow**:

- all data flows originate from a backend resource
- a backend service performs CRUD operations on the resource
- the data passes through:
  - a RBAC service
  - an authentication service
  - a routing service
- the data is then converted from HTTP requests into RxJs events by client components. Each backend service has a corresponding client
- the data is rendered by frontend web-components according to a provided schema

**User to system**:

- user actions trigger RxJs events
- clients convert RxJs events into HTTP requests
- HTTP requests reach the corresponding backend service

## Events

Events are the only mean of communication available to components, no direct/imperative call is performed among components.

Events are emitted/listened to via a **communication channel** such as the `eventBus` (an instance of `rxjs ReplaySubject`).

Components interfacing with a given event, either **listen to** it or **emit** it. In the latter case, it requires the page to be aware, for instance, of a *loading* event, or that is *sending* data, whereas the former is referred to event-driven behavior where the component reacts to something that happened elsewhere.

When setting up the configuration of a single page application that utilizes web components, it is important to verify how each component interacts with the others via events.

It is possible, for instance, that a component requires other components to be included in the single page application in order to work properly under all circumstances. This is very often the case for client components, which perform crucial business logic for the rendering components to interpret data correctly.

In general, it is recommended to always configure components keeping in mind how they interact with each event, and considering which ones they emit.

Refer to [this list](Events/Events) for an overview of default events.
For [all components](Components/Buttons), it is specified how each one interacts with different events.

It is possible to specify a scope for events. For instance, the event [push-state](Events/Events#nested-navigation-state-push) has scope `nested-navigation-state`.

## Example

Multiple events can and should be combined. For instance, the component [bk-add-new-button](Components/Buttons#add-new) emits the event [add-new](Events/Events#add-new), which

```
notifies the request for creating a new item.
```

On the other hand, the component [bk-form-drawer](Components/Data_Manipulation#form-drawer) listens to the same event `add-new`. This event

```
opens the drawer to create a new item, eventually applying default fields from data schema or data provided in the payload of the event.
```

As a result of this interaction, it will be possible for the user to spawn the `bk-form-drawer` component by triggering the `add-new` event via the `bk-add-new-button`. It is crucial to understand how all communicaiton is performed via events: no imperative call happens between the two components. `bk-form-drawer` will display the same behavior no matter what component emits the `add-new` event, and `bk-add-new-button` emits the event having no knowledge of which components are listening to it.

As per documentation, the `bk-form-drawer` can trigger the following events after listening to the `add-new` event:

- [using-form-container](Events/Events#using-form-container)
- [create-data-with-file](Events/Events#create-data-with-file)
- [create-data](Events/Events#create-data)

If, for instance, the `create-data` event is triggered, the client component [bk-crud-client](Components/Clients#crud-client), which listens to it, will execute its own logic. As per documentation, the `bk-crud-client`

```
sends a `POST` to the `CRUD` service base path
```

The client is therefore converting the RxJs `create-data` event into an HTTP POST. "CRUD service base path" is a property of `bk-crud-client` which can be specified in configuration.

This example shows how the user can interact with web components in order to send requests to the backend service (via client components), as well as how components communicate **declaratively** via events with one another.
