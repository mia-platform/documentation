---
id: v7.2.x
title: Version 7.2.x Release Notes
sidebar_label: v7.2
---

## v7.2.0

_March 03, 2021_

### New Features

#### Public Variables

The design section presents a new feature: **Public Variables**, a page where you can easily create branch level configurations with different values for each environment.  

![public-variables](img/public-variables.png)

You can have further details regarding this section on the public variables [documentation](../development_suite/api-console/api-design/public_variables.md) page.  
On Premise installations require specific changes to the deploy pipelines, please contact your technical referent to be supported for activation.

#### Real-time-updater authentication mechanism

You can now specify a custom Kafka authentication mechanism by supplying the `kafka.saslMechanism` property to your system advanced configuration in the console, check out the [documentation](../fast_data/advanced#kafka-configuration) for further information.

#### Fast Data CDC Events Management

The support for different format of Kafka messages has been implemented. You can now choose which format of Kafka message you expect to have for each system. If the format you need is not supported yet, you can create your own Kafka message adapter. Check out the [documentation](../fast_data/create_projection.md#kafka-messages-format) for configuration information.

#### Fast Data virtual delete

Now the Real-Time updater of the Fast Data make always virtual delete of the projections instead of real delete. Check out the [documentation](../fast_data/create_projection#projection-fields).

#### Generate projection fields from data sample

After the creation of a projection, you can configure its fields by importing them from a JSON or a CSV. Check the [documentation](../fast_data/create_projection.md#generate-projection-fields-from-data-sample) to learn how to use the feature.

### Bug Fix

#### Cross Project Proxy

Fixed bugs regarding the configuration of proxies of Cross Project type:

- The creation of a cross-project proxy targeting the project itself was not possible when trying to save the configuration
- The edit of the namespace caused a wrong update of the port
- When using the default namespace at creation, the value was not correctly saved.

#### Duplicated Git repository owners

For certain projects, GitLab groups were being shown twice when selecting the Git repository owner during microservice creation; the issue has been resolved.

#### Disabled commit at index creation

During the index creation, commits were disabled if no index field was specified. Indexes now require to specify at least the first field before being created.

#### Secret fields validation for environment variables

Added missing validation on secret name and secret key during the creation and edit of environment variables from secret.
These two patterns follow [Kubernetes naming convention for secrets](https://kubernetes.io/docs/concepts/configuration/secret/#overview-of-secrets).  

### UI Improvements

- You can now use tags to organize and search your MongoDB CRUD collections.
- The pop-over warning at microservice creation has been revised.
- Added specification of unit of measure for TTL index Expire property, since it is expressed in _seconds_.
- Security Management infobox has been dismissed with a direct link to the related Mia-Platform documentation page.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.4.0`.
