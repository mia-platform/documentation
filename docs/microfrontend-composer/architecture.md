---
id: architecture
title: Microfrontend Composer architecture
sidebar_label: Architecture
---

Given their remarkable degree of flexibility Backoffice applications are usually composed of multiple moving parts that interacts with each other and with external systems. 

The following sections are intended to give the reader a general idea of the actors involved and their connections.

## How Backoffice is served

![Architecture](img/architecture.svg)

Being composed at runtime, Mia-Platform Backoffice needs a couple of configuration files to build your frontend application. These files can be easily generated using the low-code/no-code configurator provided by the Console, and then served through a microservice called [Middleware](https://micro-lc.io/add-ons/backend/middleware) that acts both as web server and configurations provider for the Backoffice. 

The service can be easily deployed using one of two [marketplace applications](https://docs.mia-platform.eu/docs/marketplace/applications/mia_applications):
- [Backoffice](https://docs.mia-platform.eu/docs/runtime_suite_applications/backoffice/overview), which will deploy only one pod loading the needed resources from a CDN, or
- [Backoffice On Prem](https://docs.mia-platform.eu/docs/runtime_suite_applications/backoffice-on-prem/overview), which will deploy all the needed resources to avoid cross origin fetching.

## How Backoffice works at runtime

At runtime the Backoffice uses the [configuration files](#how-backoffice-is-served) to structure the desired frontend application, which in turn needs to fetch resources and create connections to populate its pages.

![Page composition](img/page-composition.svg)

In pages composed by Web Components the custom elements have to be sourced remotely, for example from a CDN or a web server. Either way, the components are used by the underlying engine (i.e., [micro-lc](https://micro-lc.io/docs)) to build the pages following the blueprints provided by configuration files. 

In turn, on the page, the components may need to communicate with a backend. While back-kit tends to centralize this functionality on _clients_ components, each component is independent in performing HTTP requests to external systems.
