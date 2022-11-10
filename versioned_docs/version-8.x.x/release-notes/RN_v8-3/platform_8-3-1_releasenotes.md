---
id: v8.3.1
title: Version 8.3.1 Release Notes
sidebar_label: v8.3.1
image: "img/release-note-link-preview.png"
---

_December 13, 2021_

## Console

### Security fix

#### Fix for log4j vulnerabilities

Updated export-service to 1.0.2 to fix vulnerabilities linked to log4j version <2.15.0.

### Bug Fix

#### Inneffective smart deploy for new services

Resolved a bug in annotation management for newly created services that prevented Smart Deploy from operating correctly and causing a service restart on each deploy.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.6.3`.
