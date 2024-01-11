---
id: faqs
title: Mia-Platform FAQs
sidebar_label: Mia-Platform FAQs
---

## Console

### How Can I update the Console?

If you are using **Mia-Platform PaaS** you don't have to do anything, the Console will automatically update. For **on-premise Console installations**, please contact your Mia-Platform referent to know how to use the Helm chart version indicated in the [release note](/release-notes/versions.md) of the version you want to update.

### Which browsers does Console support?

Verify it checking out the [dedicated page](/info/supported_browser.md).

## CMS

### How Can I update the CMS?

Check out this [page](/microfrontend-composer/previous-tools/cms/update_cms.md) to know how to update your CMS

## Deploy

### Can I deploy only selected microservices?

No, at the moment you can't. The entire configuration of the project will be released.

Anyway, before deploy, when you have to choose the environment, the Console will show you a **comparison between the services you want to release and those that are currently running in that environment**.  
Check out the [related section](/development_suite/deploy/overview.md#compare-services) for details.

### When a project is deployed, what is released?

The Deploy of a project will only release the configuration [set as a *Git repo path* during project creation](/console/project-configuration/create-a-project.mdx#step-2-repository).

:::tip
From Console, click on Git provider icon, at the top right part of the Console, to open the project configurations repository
:::

:::info
If you don't find what you're looking for, you can read all documentation about Deploy in the [dedicated section](/development_suite/deploy/overview.md)
:::

## Microservices Development

### How do I scale a microservice?

You can configure the **autoscaler** for your services directly by Console by [configuring Replicas](/development_suite/api-console/api-design/replicas.md). You can also do it manually [writing yourself the configuration](/development_suite/api-console/api-design/replicas.md#how-to-scale-services-manually).

### Can I remotely debug a microservice?

We do not recommend this debugging practice, instead, you should always write good **tests** for your microservices. You can also run the microservice locally.

Furthermore, [logs](/development_suite/monitoring/introduction.md) can help you to understand what your microservice is doing. The use of [logging level](/development_suite/api-console/api-design/guidelines-for-logs.md#use-the-appropriate-logging-level) allows you to distinguish debug messages that you want to have only in no production environments from those that are useful to monitor the applicative state (errors, warnings, etc).

Consider that the Console allows you to quickly [deploy your microservices in a dedicated environment](/development_suite/deploy/overview.md#select-environment), so you can try online immediately.

:::tip Example of test
The [Mia Platform Templates](/marketplace/templates/mia_templates.md) are already configured to include and run tests.
Check out the [Node.js Call CRUD Example repository](https://github.com/mia-platform-marketplace/Node.js-Call-CRUD-Example/blob/master/tests/crud.test.js) to see a real example of a test that mocks routes
:::

### Can I deploy an external microservice?

Yes, you can create a [microservice from a Docker Image](/development_suite/api-console/api-design/services.md#how-to-create-a-microservice-from-a-docker-image). The only requirement is that the **Docker Image needs to be already built and available on a registry**.

:::info
If you are using **Mia-Platform PaaS** the registries you can use are [Nexus](https://www.sonatype.com/nexus/repository-oss) and [Docker Hub](https://www.docker.com/products/docker-hub).

For **on-premise Console installations**, please contact your Mia-Platform referent to know which registries can be used
:::

### Do I have to always start coding my microservice from a template?

No, it's not mandatory. Naturally, starting from a [Mia-Platform Template](/marketplace/templates/mia_templates.md) or using [Mia-Platform Service Libraries](/libraries/mia-service-libraries.md) has **many advantages** and allows your microservice to be **compliant with all best practices**(such as testing, logging, health routes, etc).

### How do I know the id of the logged-in user?

In order to do this, you can read the Mia-Platform headers. These headers provide information about:

* **Id, group and selected properties** of the eventual logged in user
* The eventual **identified client** that made the request
* The eventual origin from the **Back-Office**.

Microservices templates, using [Mia-Platform Service Libraries](/libraries/mia-service-libraries.md), let you to **easily access to these request headers**.

### Can I create my own templates?

Yes, you can. Follow this [guideline](/marketplace/add_to_marketplace/contributing_overview.md) and [open an issue here with the Marketplace contribution template](https://github.com/mia-platform/community/issues/new?labels=marketplace&template=marketplace-contribution.md&title=Add+new+marketplace+item). We will be happy to help you!

### Is communication between microservice available with protocols others than HTTP?

No, you can only use **HTTP**.

## CRUD

### How can I change the state of a document?

You can change the state (**PUBLIC**, **DRAFT**, **TRASH** or **DELETED**) of a document by making a POST request. Check out the [CRUD Service documentation](/runtime_suite/crud-service/10_overview_and_usage.md#state-transitions) for details.

:::tip
You can visit the [Documentation Portal](/console/project-configuration/documentation-portal.md) to see the documentation of your CRUDs APIs.
:::

## Endpoints

### How can I hide an endpoint from the API Portal?

You can change the visibility of any endpoint (and its routes) in the endpoint Management section by disabling the `Show in API Portal` flag. Check out the [related section](/development_suite/api-console/api-design/endpoints.md#manage-the-visibility-of-your-endpoints) for more details.

### How can I call a proxy endpoint from my microservices?

The [proxy endpoints](/development_suite/api-console/api-design/proxy.md) are exposed on the [API gateway](/runtime_suite/api-gateway/10_overview.md) so you can call them from your microservices making an HTTP request to the API Gateway: `http://api-gateway:8080/your-endpoint`.

You can also use the [Mia-Platform Service Libraries](/libraries/mia-service-libraries.md) that help you to get a proxy towards the API Gateway.

:::tip
Checkout the [Mia service Node.js Library documentation](https://github.com/mia-platform/custom-plugin-lib/blob/master/docs/http_client.md) to know how to call the platform services with a proxy object
:::
