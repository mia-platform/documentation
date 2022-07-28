---
id: v9.4.3
title: Version 9.4.3 Release Notes
sidebar_label: v9.4.3
image: "img/release-note-link-preview.png"
---

_July 28th, 2022_

## Console

### Feature removal

#### Removed support for OpenShift k8s configuration

Previously deprecated OpenShift support for K8S configuration generation has been removed since it is no longer supported.

:::note
This change only affects on-premise installations that were using the custom orchestrator configuration; you can safely remove the configuration since there is no need for it anymore.
:::

### Bug Fix

#### Deploy history author

The history of the deployments has been fixed to display the correct name of who triggered the deploy.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 7.3.0`.
