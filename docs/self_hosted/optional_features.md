---
id: optional_features
title: Optional features
sidebar_label: Optional features
---

Mia-Platform Console offers some optional features which are disabled by default and can be enable as needed.

Optional features can be enabled using **feature toggles** by a Console Super User.

Features have one or multiple scopes, which are indicative of the area of the Conosole or the user interested by that feature. Available scopes are: Console, Company, Project, Environment, and User.

*Console* scope means that a feature is valid for the whole Console, all the other scopes require to provide a scope ID.

Available feature are visible from the *Features* section of the CMS.

To enable a feature, navigate to the *Feature Activations* section of the CMS, showing a table. Each entry in the table in *published* state represents an active feature.

Click "Add new" and enter the feature ID, the scope type, and the scope ID (leave empty for Console scope). The just added feature activation will be in *published* state by default and immediatly enabled.

### Google Analytics Tracking

Google Analytics Tracking can be enabled activating the feature toggle `ENABLE_GOOGLE_TAG_MANAGER`, with *Console* scope.

When the feature is enabled in the Console, the users see a banner asking to express a preference either they would like to enable Google Analytics Tracking or not.

Hence, this feature is activated on a per-user basis.

Google Analytics help Mia-Platform improving the Console through future updates.
