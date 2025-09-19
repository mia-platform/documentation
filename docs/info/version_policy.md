---
id: version_policy
title: Version policy
sidebar_label: Version policy
---

Mia-Platform version numbers consists of three, dot separated, parts: *MAJOR*.*MINOR*.*PATCH*.

- **MAJOR** is increased for significant or disruptive Mia-Platform functionalities. A major update may bring backward-incompatible changes;
- **MINOR** is increased for new functionalities and significant improvements;
- **PATCH** is increased for small improvements, bug fixes or security updates.

## Release history

This section lists all the Major versions released over time;
for self-hosted installation read the [Stable version release policy](/release-notes/stable-versions.md) to find out which version are receiving official support.

:::note
Mia-Platform guarantees **security patches** for the two preceding versions to the current Major.
:::

Release | Release Date |  End of Life Date
-------| -------|-------
v14 (current)| May 2025 | End of 2026
v13| May 2024 | End of 2025
v12| November 2023 | May 2025
v11| May 2023 | End of 2024
v10| October 2022 | May 2024
v9| April 2022 | November 2023
v8| October 2021 | May 2023
v7| February 2021 | October 2022
v6| September 2020 | April 2022
v5| January 2020| April 2022
v4| July 2018 | January 2021
v3| September 2017 | September 2020
v2| November 2016 | December 2019
v1| December 2015 | July 2018

:::tip
The current version of the Platform is visible in the Console info section.
:::

## Feature Preview and Beta

New Mia-Platform version may include features that are not yet considered stable; such features are highlighted with a special
tag denoting the current feature state.

:::info
These early access feature are generally disabled by default and can be enabled using the Feature Preview pages (depending whether the feature has impact on [specific users](/products/console/user-settings/feature-preview.md)
or whole [Projects](/products/console/project-configuration/project-settings.md#feature-preview)).
:::

The current feature state classifications are as follows:

- Beta: The minimum viable product (MVP) for the feature is complete and functional, with no undocumented breaking changes anticipated. However, due to various factors (such as insufficient validation for specific use cases), it may still be deemed unsuitable or limited for production environments, so caution is advised when using it.
- Preview: This designation typically indicates the initial iteration of a new feature. While the feature is accessible for use, it may not be fully developed and could be subject to undocumented breaking changes.
- Experimental: This label is applied to features that are in the early stages of development and undergoing significant changes.
