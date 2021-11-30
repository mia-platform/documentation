---
id: overview_marketplace
title: The Marketplace
sidebar_label: Why take advantage of the Markeplace?
---
## Why always start from scratch

The Mia-Platform Marketplace contains several code resources to develop your microservices with Mia-Platform.

You can access the Mia-Platform Marketplace from the *Design area* of *Console*, when you are [creating a new microservice](./../development_suite/api-console/api-design/services.md#how-to-create-a-microservice-from-an-example-or-from-a-template).

You will see a set of [Plugins](../runtime_suite/mia-platform-plugins.md), [Examples](./examples/mia_examples.md), [Templates](./templates/mia_templates.md) and [Applications](./applications/mia_applications.md) powered and supported by Mia-Platform, you can choose from to easily set-up a single microservice or a bundle of microservices with predefined and tested functionalities.

You can go deeper into the code of templates and examples visiting the [Mia-Platform Marketplace Github page](https://github.com/mia-platform-marketplace).

You can start from a:

* **Plugin**: a ready-to-use Microservice.  
Check out the [Plugins section](../runtime_suite/mia-platform-plugins.md) for further information.

* **Template**: a base repository from which you can start to create a new Microservice.  
Check out the [Templates section](./templates/mia_templates.md) for further information.

* **Example**: a specific use-case, a ready-to-use model to create your microservice.  
Check out the [Examples section](./examples/mia_examples.md) for further information.

* **Docker Image Name**: an existing Docker image of a Microservice.  
Check out the [Create services section](./../development_suite/api-console/api-design/services.md#how-to-create-a-microservice-from-a-docker-image) for further information.

* **Application**: a bundle of resources including Plugins, Templates and Examples.

You can search for Microservices, filtering by type: Plugins, Templates, Examples and/or Applications.

Otherwise, you can search for them by category.

The results of your search will appear **organized by category**.

![new-examples](./../development_suite/api-console/api-design/img/Marketplace-categories.PNG)

## Marketplace component lifecycle

Each Marketplace component has a predetermined **development lifecycle**.

![lifecycle-stages](./img/component-lifecycle-final.png)

These are the expected stages along the component lifecycle:

* **Coming soon**: this label aims to inform Marketplace users about the existence of a new component whose implementation has just started (these components are not usable)

* **Preview**: first usable release, there may be bugs and they may be subject to undocumented breaking changes

* **Beta**: the implementation is completed and there cannot be any undocumented breaking changes however there could still be bugs, hence it must be used carefully

* **Stable**: the implementation is stable (bug free). Consequently, this stage represents the component period before its official release documented in the release note


