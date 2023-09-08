---
id: listeners
title: Create Listeners
sidebar_label: Create Listeners
---

## What is a Listener

A listener is an **entry point** for external connections directed to your cluster. Listeners are configured on your API Gateway, where they are mapped to a single port, and define rules to route incoming requests from external clients to a resource in your cluster, such as a specific microservice, exposed through endpoints.

The purpose of this page is to describe all the functionalities that you can find in the **Listeners** section of the [Design area](/development_suite/api-console/api-design/overview.md) of the Mia-Platform Console.

## Create a Listener

:::info
The listeners feature is only supported in combination with an **Envoy API Gateway**, which needs to be instantiated on your Project.
:::

In order to create a listener, go to the Listeners section and click on the **Create new listener** button. You can specify its name and port, as well as write a short description for it. Optionally, you can choose to:
- use it as a **default listener**, meaning all new endpoints will be exposed on that listener by default
- expose **all existing endpoints** on the listener