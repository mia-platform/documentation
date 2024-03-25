---
id: settings
title: Company Settings
sidebar_label: Company Settings
---

The **Settings** section allows you to view and define various configurations and settings related to your Company. These can include general settings, feature preview options, advanced settings and so on. 

### Rules

The **Rules** tab allows the user to customize rules defined for the Company and its Projects. Rules can pertain to different domains, such as configuration, runtime or deployment management.

#### Saving options

This rule allows users to manage the **Saving options** for all Projects in the Company: in particular, Company Owners can decide to add a confirmation constraint on the commit message inserted by users before each save in the Project Design area.  
This setting can be useful if your Company must comply with specific regulations regarding the information associated to each save of the Project configuration.

![saving options](./img/settings-saving-options.png)

:::info  
If the setting is enabled on the Company, it cannot be overridden at Project level. On the other hand, if more strict contraints are needed only on a specific Project, this setting can be enabled selectively from the [Rules tab of the Project Settings page](/console/project-configuration/project-settings.md#rules), keeping it disabled at Company level.
:::