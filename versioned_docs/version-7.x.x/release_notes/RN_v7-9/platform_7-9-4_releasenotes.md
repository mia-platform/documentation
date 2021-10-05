---
id: v7.9.4
title: Version 7.9.4 Release Notes
sidebar_label: v7.9.4
image: "img/release-note-link-preview.png"
---

_September 16, 2021_

### Bug Fix

#### Runtime environment mismatch in Deploy area

When visiting the Deploy area, a mismatch between the environment shown in the launcher and the one that is going to be deployed could happen. Now, the environment that is going to be deployed will always match the one shown in the launcher.

#### Deploy error when enabling feature `crossProjectProxyExternalService`

Enabling the feature `crossProjectProxyExternalService`, by setting it to `true` in the CMS of any project, caused an error during the project deploy if in that project is present a `cross-project` type proxy. The lack of the port for the `cross-project` proxy caused the deploy failure.
Now, if the proxy port is not specified, the default port `80` will be set avoiding deploy failures.

#### Docker image name autosuggestion in applications' creation forms

During the configuration of an application, into the resources' creation forms the docker image name is autosuggested.

#### The repo git names are kept moving through the steps of an application

Moving through the application creation steps, the set repo git name is kept, instead of being reset to default.

### Breaking Changes

#### ImagePullSecrets rework

`imagePullSecrets` default values have changed. If the environment variable is not set, the Console no longer uses `nexus-gcloud`, instead the default is an empty array. Core services no longer have their `imagePullSecret` hard-coded based on the orchestrator type, but depend on the value of the environment variable. Custom services get their `imagePullSecrets` both from the environment variables and the `dockerImagePullSecrets` field in their configuration.

The environment variable has been renamed from `CUSTOM_PLUGIN_IMAGE_PULL_SECRET` to `IMAGE_PULL_SECRET`. If you have an on-premise Console installation, make sure to update your helm chart.

### Improvements

#### New drawer for creating the fields of a collection

In the "MongoDB CRUD", "Single View" and "Projection" sections the creation of new fields takes place via drawer.

#### Edit of the fields in the "Projections" section via drawer

Has been added the possibility to modify the individual properties of the fields table in the "Projections" section.

#### Card Redesign

A new layout for grouping content inside the app has been implemented: now cards has a clean and modern look.

### Marketplace

#### JWT token Validator plugin

The JWT Token Validator plugin is now available in the Marketplace.

#### CRUD Service updated

The CRUD Service has been updated to version `v4.3.0`!

A new query parameter `_rawp` has been added to let the user apply a raw MongoDB projections as JSON. An example is the following:
`?_rawp={"someField":1,"someOtherField":1}`.

This includes projections with fields set to `0` (e.g. `_rawp={"excludedField":0}`) or projections using some mongo operators (e.g. `_rawp={"filterResult":{$filter:{...}}}`).

The list of currently supported MongoDB operators is the following:

- `$filter`
- `$in`
- `$reduce`
- `$concatArrays`
- `$cond`

:::info
The use of aggregation operators inside a projection is supported only on MongoDB `v4.4+`.
:::

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.0.5`.

:::caution Breaking Change
ImagePullSecrets are no longer provided by default from the console, instead, they are dependant on the configuration specified in the helm chart. When upgrading, make sure you correctly set the `servicesImagePullSecrets` parameter to the pullSecrets used in your console installation. Its default value is `["nexus-gcloud"]`.

The environment variable has been renamed from `CUSTOM_PLUGIN_IMAGE_PULL_SECRET` to `IMAGE_PULL_SECRET`.
:::
