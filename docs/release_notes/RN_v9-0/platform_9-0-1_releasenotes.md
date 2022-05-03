---
id: v9.0.1
title: Version v9.0.1 Release Notes
sidebar_label: v9.0.1
image: "img/release-note-link-preview.png"
---

_RELEASE_DATE_

## Console

### New features

#### Reporter and Maintainer roles can be assigned on environment while developer not anymore

In order to provide a clearer understanding of Console roles and a more fluent experience, we have revised a little bit the capabilities of the following roles.

 - The Maintainer role now can be assigned to any Environment and will provide all the capabilities for the selected one.
 - The Reporter role gives only visibility of the environment to which is assigned.

:::caution
The Developer role does not give any capabilities if assigned to an environment for a user, if you assigned the Developer role to a user on a specific environment you want to switch it to Maintainer on that same environment.
:::

### Bug Fix

Fixed a bug preventing to see the content of the section in full width when working on an advanced microservice.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 6.0.1`.
