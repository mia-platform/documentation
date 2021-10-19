---
id: v8.1.0
title: Version 8.1.0 Release Notes
sidebar_label: v8.1.0
image: "img/release-note-link-preview.png"
---

_October 20, 2021_

### New Features

#### Deploy to production warning

When the user deploys to an environment marked as production is warned before the deployment actually starts.

#### Link to repository branch

The repository link in the header now points to the selected branch of the project repository if any branch is chosen, otherwise refers to the repository homepage.

#### Favorite projects

Favorite projects are now managed with a dedicated microservice in order to make them persistent over user logouts.

#### Labels & Annotations in the microservice configuration

It's now possible to add, modify and delete custom labels and annotations associated to your microservice directly from his configuration in the Design section.

#### Service Monitor

In projects that have enabled microservice monitoring through [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator), it is now possible to configure in which path and how often the metrics produced by any of your services should be gathered thanks to the new [Metrics card](../../development_suite/api-console/api-design/microservice-monitoring.md).

#### Microservice Args

[Microservice configuration card](../../development_suite/api-console/api-design/services.md#microservice-configuration) allows you to specify which `args` should be present in the deployment file of any service through the new input form.

#### `LOG_LEVEL` as public variable

The environment variable `LOG_LEVEL` was previously created by default as a secured variable on the chosen git provider, now it has been moved to project defined variables, hence public variables.

#### Import variables from file

It is now possible to [import microservice environment variables](../../development_suite/api-console/api-design/services.md#environment-variable-configuration) directly from `.env` files

#### HTTP Proxy Manager Plugin

It is now possible to filter which headers of the original request are forwarded to the target service. More details can be found in the [plugin configuration documentation](../../runtime_suite/http-proxy-manager/configuration.md).

### Bug Fix

#### Delete modal cancellation

The delete modal, used in many different places of the console i.e. for endpoint deletion, now keeps the delete button enabled if the user cancels the ongoing operation after having correctly filled the verification input field.

#### Smart Deploy not displaying 'Deploy' on replicas change

When you change the number of replicas of a services, the Deploy Area will correctly show its status as "Deploy".

#### Footer in Design Area not always positioned at bottom

Design area pages now have footer with 'Delete' button placed correctly at the bottom of the viewport if the main content is shorter than the viewport itself.

#### Advanced Area commits

Fixed advanced area issues that no longer allowed to make more commits after the first one [see more](https://git.tools.mia-platform.eu/platform/api-console/website/-/issues/205)

### Breaking Changes

#### Authorization Service v2.1.1

Authorization Service is now available with a security patch that prevents undesired matches on similar paths, for instance when defining the `/foo` endpoint we do not want `/foo-bar` to be matched as well; prior this patch the path could be abused to map undesired or unknown endpoints.

:::caution
When updating the service pay attention if this change could impact your API.
:::

#### CRUD Service v5.0.0

This version brings Mongo breaking changes from Mongo v4.4 to v5. Specially, if you are using some query (e.g. with _q parameter) no more supported by new Mongo version or new driver version, it will return an error.
Known limitation in this version: before, it would be possible to make a count using $nearSphere operator. This operator is not permitted by mongo v4.4 and mongo v5, so in this version the count with this filter will throw.

### Improvements

#### Improved the experience of error messages when generating a service

In experiencing a service generation, the user will know if:

* he will lack permissions to access the service;
* if there are no permissions to save on the "default branch"
* if the service name or path has already been taken
* if the service archive is empty

#### New state for custom encryption

A new status has been added in the CRUD service collections table in case the user enters custom configurations to encrypt fields inserted into the Json schema.

### New marketplace microservices

The following services have been added into Marketplace:

* Backoffice application, [see more](https://docs.mia-platform.eu/docs/business_suite/backoffice/overview)
* Back Kit plugin, [see more](https://docs.mia-platform.eu/docs/business_suite/backoffice/back-kit/overview)
* Microlc Element composer plugin, [see more](https://docs.mia-platform.eu/docs/business_suite/microlc/core_plugins#microlc-element-composer)

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.3.1`.
