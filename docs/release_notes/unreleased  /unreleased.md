---
id: v8.2.1
title: Version 8.2.1 Release Notes
sidebar_label: v8.2.1
image: "img/release-note-link-preview.png"
---

_November 11, 2021_

### Bug Fix

#### Disabling enableProjectOverview Feature Toggle

A bug that prevented the usage of the Design area when enableProjectOverview Feature Toggle was disabled has been fixed.

### Marketplace Updates

#### CRUD Service 5.0.1

A bug has been resolved to prevent an uncontrolled amount of warning due to a framework functionality misuse. The bug wasn't causing any kind of denial of service.

Some dependencies have also been updated.

#### Auth0 Client v3.2.2

Implemented API to serve OpenAPI 3 documentation on `/documentation/json'.

This update is available on the Marketplace component, but it is not available on the one managed by the Console.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.5.1`.
