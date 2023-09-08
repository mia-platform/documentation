---
id: listeners
title: Create Listeners
sidebar_label: Create Listeners
---

## What is a Listener

A **listener** is a component **associated with a port on your API Gateway**, tasked with routing incoming connections from external clients to a destination in your Project, such as a specific microservice.

:::caution
You can only use listeners in combination with an **Envoy API Gateway**.
:::

Listeners play a pivotal role in the orchestration of data and requests within your Project. When a connection is established with the listener, it becomes the **entry point** for data and requests into your system. The listener is equipped with a set of rules and configurations that determine how incoming data should be processed and where it should be directed.

The purpose of this page is to describe all the functionalities that you can find in the **Listeners** section of the **Design** area of [Mia-Platform Console](/development_suite/overview-dev-suite.md).

## Create a Listener

In order to create a listener, you need to activate an Envoy API Gateway on your Project. Then, go to the Listeners section and create your first listener. You can specify its name and port, and write a short description for it as well. You can also choose to:
- use it as a **default listener**, maning all new endpoints will be exposed on that listener by default
- expose **all existing endpoints** on the listener