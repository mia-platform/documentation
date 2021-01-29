---
id: v6.5.0
title: Version 6.5.x Release Notes
sidebar_label: v6.5.x
---

## v6.5.1

_January 28, 2021_

### Bug fix

#### New branch creation

When creating a new branch, a problem during the configuration generation caused the failure of the Deployment. The bug has now been fixed.

#### TTL Index creation

Resolved a bug that prevented the commit after the creation of a [TTL index](../runtime_suite/crud-service/overview_and_usage#indexes).

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.1.2`.

## v6.5.0

_January 26, 2021_

### New features

#### Kubernetes Secrets in Microservices

Microservices can now be associated with any **Kubernetes Secret** available on your namespace.
When configured in the Console Design section, associated secrets will be automatically mounted on deployment, allowing microservices to have direct access to their private content.

Please note that additional permissions to the console service account are required in order to enable this functionality.

For further details regarding secrets in microservices check out the complete [documentation](../development_suite/api-console/api-design/services#secrets).

#### CMS Export with labels for Excel

When exporting an Excel file from a collection you can now decide whether the columns should have the id of the properties or the label you specified in the Console.

In order to use this feature make sure you [update your CMS](../business_suite/update_cms) to `v9.13.0`.

#### Pipeline link into the Deploy message

While deploying your project, click `View Pipeline` to access the pipeline overview. The link is available during the deployment and in the outcome message, to let you quickly access the status of the pipeline.

#### Kafka2Rest allows topic configuration for error messages

The new version (`v3.1.0`) of the [Kafka2Rest library](../libraries/kafka2rest) can be configured in order to send messages to a specific topic when an error occurs during processing. Each message is provided with some additional information (such as the number of attempts the processing of the same message has failed), this feature can be useful to implement the _Dead Letter Queue_ paradigm in your project.

### Bug fix

#### Service creation from marketplace template did not preserve executability

When creating a service from a marketplace template, executable files of the original repository were not kept as executables.

### Improvements

#### New navigation menus

The project sidebar and the header horizontal menu have seen a thorough review and have been re-arranged.

#### Plugin documentation in marketplace

The plugins from the Console marketplace are now linked to the official Mia-Platform documentation site. Click `View documentation` on the configuration card to access the plugin's documentation.

#### Back from where you started

From now on, when you save your work you'll be automatically redirected back to the last page you visited.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.1.1`.
