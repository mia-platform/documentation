---
id: optional_features
title: Optional features
sidebar_label: Optional features
---

Mia-Platform Console offers some optional features which are disabled by default and can be enabled as needed.

Optional features can be enabled using **feature toggles** by a Console Super User.

Features have one or multiple scopes, which are indicative of the Console resource type or the user interested by that feature. Available scope types are: Console, Company, Project, Environment, and User.

*Console* scope means that a feature is valid for the whole Console instance; all the other scopes require to provide a scope ID.

Available features are visible from the *Features* section of the CMS.

To enable a feature, navigate to the *Feature Activations* section of the CMS, which shows a table. Each entry in the table in *PUBLIC* state represents an active feature.

Click "Add new" and enter the feature ID, the scope type, and the scope ID (leave this last field empty in case of Console scope type). The just added feature activation will be in *PUBLIC* state by default and immediately enabled.

### Google Analytics Tracking

Google Analytics Tracking can be enabled activating the feature toggle `ENABLE_GOOGLE_TAG_MANAGER`, with *Console* scope.

When the feature is enabled in the Console, users are presented with a banner asking them to express a preference on whether or not to enable Google Analytics tracking. By default, tracking remains disabled.

Hence, this feature is activated on a per-user basis.

Once a preference has been expressed, the banner will be hidden, but the user can change this preference at any time from the [User Preferences section](../development_suite/user-settings/user-preferences.md).

Google Analytics helps Mia-Platform improving the Console, by understanding how users interact with the platform.
