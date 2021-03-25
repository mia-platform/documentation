---
id: v7.1.x
title: Version 7.1.x Release Notes
sidebar_label: v7.1
image: "https://next.docs.mia-platform.eu/img/release-note-link-preview.png",
---

## v7.1.0

_February 19, 2021_

### New features

#### Environment variables from secrets

In the microservice detail section you can now create Environment Variables specifying which type of value has to be used between:

- **Plain Text**: a string value associated to the environment variable key, or an interpolated string.
- **From Secret**: a value that is obtained from a Kubernetes Secret. In this case, it is necessary to specify the **Secret Name** and the **Secret Key** from which this value can be retrieved.

If you want more information about adding Kubernetes secrets to a microservice visit the following [link](../development_suite/api-console/api-design/services#secrets).

For further details regarding Environment Variables from Kubernetes Secret, check out the complete [documentation](../development_suite/api-console/api-design/services#environment-variable-configuration).

### Bug fix

#### CRUD: imported fields from a file does not render in UI

Fixed a bug causing the missing rendering of CRUD fields imported from a file.

#### Microservices: incorrect environments variable conversion to number instead of string

When converting an advanced microservice to a managed microservice, environment starting with a `0` digit were getting truncated removing starting zeroes; the bug has been fixed and now they are converted as well.

#### Fast Data system topics

Topics are now managed per-system rather than globally meaning you can define different kafka topics for your configured systems. 

### Marketplace

* [mongo2kafka](../runtime_suite/mongo2kafka/configuration) has been updated to v1.1.0: `nexus.mia-platform.eu/core/mongo2kafka:1.1.0`  
A recovery strategy has been added to recover operations when trying to start consuming the MongoDB stream when a resume token returns an errors.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.3.0`.
