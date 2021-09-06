---
id: v7.9.3
title: Version 7.9.3 Release Notes
sidebar_label: v7.9.3
image: "img/release-note-link-preview.png"
---

_September 6, 2021_

### Bug fix

#### MarketplaceId API schema

Fixed "failureThreshold" field on api schema, that caused "null" value returned from the "defaultProbes" field

#### CMS Lookup filter parsing

Lookup filter query is now correctly parsed. It is now possible to perform lookup queries in the CMS by setting the lookup query filter in the  `CMS` console section.

### Service conversion from advanced

The `ports` property of the `service.yml` file is now correctly set when converting an advanced service to a simple one. Therefore, it is now possible to deploy a project with success after having converted a service from advanced.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 4.4.6`.
