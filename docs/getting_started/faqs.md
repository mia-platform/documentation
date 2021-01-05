---
id: faqs
title: Mia-Plaform FAQs
sidebar_label: FAQs
---

## Console

### How Can I update the Console?

If you are using **Mia-Platform PaaS** you don't have to do anything, the Console will automatically update. For **on-premise Console installations**, please contact your Mia-Platform referent to know how to use the Helm chart version indicated in the [release note](../release_notes/release_notes) of the version you want to update.

### Which browsers does Console support?

Verify it checking out the [dedicated page](../info/supported_browser).

## CMS

### How Can I update the CMS?

Check out this [page](../business_suite/update_cms) to know how to update your CMS

## Deploy

### Can I deploy only selected microservices?

No, at the moment you can't. The entire configuration of the project will be released.

Anyway, before deploy, when you have to choose the environment, the Console will show you a **comparison between the services you want to release and those that are currently running in that environment**.  
Check out the [related section](../development_suite/deploy/deploy#compare-services) for details.

### When a project is deployed, what is released?

No, it won't. The Deploy of a project will only release the configuration [set as a *Git repo path* during project creation](../development_suite/set-up-infrastructure/create-project#step-2-repository).

:::tip
From Console, click on Git provider icon, at the top right part of the Console, to open the project configurations repository
:::

:::info
If you don't find what you're looking for, you can read all documentation about Deploy in the [dedicated section](../development_suite/deploy/deploy)
:::

## Microservices Development

### How do I scale a microservice?

You can configure the **autoscaler** for your services directly by Console by [configuring Replicas](../development_suite/api-console/api-design/replicas). You can also do it manually [writing yourself the configuration](../development_suite/api-console/api-design/replicas#how-to-scale-services-manually).

### Can I remotely debug a microservice?

We do not recommend this debugging practice, instead, you should always write good **tests** for your microservices. You can also run the microservice locally.

Furthermore, [logs](../development_suite/monitoring/monitoring/) can help you to understand what your microservice is doing. The use of [logging level](monitoring-dashboard/dev_ops_guide/log#use-the-appropriate-logging-level) allows you to distinguish debug messages that you want to have only in no production environments from those that are useful to monitor the applicative state (errors, warnings, etc).

Consider that the Console allows you to quickly [deploy your microservices in a dedicated environment](../development_suite/deploy/deploy#select-environment), so you can try online immediately.

:::tip Example of test
The [Mia Platform Templates](../marketplace/templates/mia_templates) are already configured to include and run tests.
Check out the [Node.js Call CRUD Example repository](https://github.com/mia-platform-marketplace/Node.js-Call-CRUD-Example/blob/master/tests/crud.test.js) to see a real example of a test that mocks routes
:::

### Can I deploy an external microservice?

Yes, you can create a [microservice from a Docker Image](../development_suite/api-console/api-design/services#how-to-create-a-microservice-from-a-docker-image). The only requirement is that the **Docker Image needs to be already built and available on a registry**.

:::info
If you are using **Mia-Platform PaaS** the registries you can use are [Nexus](https://www.sonatype.com/nexus/repository-oss) and [Docker Hub](https://www.docker.com/products/docker-hub).

For **on-premise Console installations**, please contact your Mia-Platform referent to know which registries can be used
:::

### Do I have to always start coding my microservice from a template?

No, it's not mandatory. Naturally, starting from a [Mia-Platform Template](../marketplace/templates/mia_templates) or using [Mia-Platform Service Libraries](../libraries/overview_service_libraries) has **many advantages** and allows your microservice to be **compliant with all best practices**(such as testing, logging, health routes, etc).

### How do I know the id of the logged-in user?

In order to do this, you can read the Mia-Platform headers. These headers provide information about:

* **Id, group and selected properties** of the eventual logged in user
* The eventual **identified client** that made the request
* The eventual origin from the **Back-Office**.

Microservices templates, using [Mia-Platform Service Libraries](../libraries/overview_service_libraries), let you to **easily access to these request headers**.

### Can I create my own templates?

Yes, you can. Follow this [guideline](../marketplace/templates/template_create) and send an email with all the details to [info@mia-platform.eu](mailto:info@mia-platform.eu).

### Is communication between microservice available with protocols others than HTTP?

No, you can only use **HTTP**.

## CRUD

### How can I change the state of a document?

You can change the state (**PUBLIC**, **DRAFT**, **TRASH** or **DELETED**) of a document by making a POST request. Check out the [CRUD Service documentation](../runtime_suite/crud-service/overview_and_usage#state-transitions) for details.

:::tip
You can visit the [API Portal](../development_suite/api-portal/api-documentations) to see the documentation of your CRUDs APIs.
:::
