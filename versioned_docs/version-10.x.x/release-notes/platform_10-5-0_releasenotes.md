---
id: v10.5.0
title: Version 10.5.0 Release Notes
sidebar_label: v10.5.0
image: "img/release-note-link-preview.png"
---

_February 16, 2023_

## Console

### New Features

#### Backoffice Low Code Configuration

:::info
This feature is still in BETA, do not miss out the [official documentation](/business_suite/backoffice-configurator/overview.md) page for further information.
:::

The new Backoffice Low Code Configuration is now generally available for all Console users!
In the Console section dedicated to Backoffice, you can now configure your Backoffice pages and layouts, using a JSON configuration. This section is fitted with a fancy and fully functional preview tool that allows direct interactions with your designed front-end.

![Mia Platform Backoffice Low Code Configuration](./img/10.5/backoffice-config-low-code.png)


Don't miss all the other Backoffice improvements in the [dedicated section](#backoffice---134)!

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* A bug causing a log out when rapidly opening multiple Console tabs has been fixed
* Now, when opening a Console URL, you are correctly redirected to the specific resource even when you have to login first

## Fast Data

### New Features

#### Automatic generation of Aggregation

A basic Aggregation configuration can be automatically generated starting from an ER Schema. The file is intended to be a basic file that must be modified by the user in order to complete all the needed configurations. Check the [official documentation](/fast_data/configuration/single_view_creator/low_code.md#aggregation) for any further details.

### Improvements

#### PR update topics are now editable

The PR update topic table inside each Projection page now allows topics to be updated.

### Deprecations

Starting from this Console release the configuration of Fast Data projections from the Console _Advanced Section_ is considered deprecated.
From now onward we strongly recommend using only the Console pages dedicated to Fast Data in the design section.  
Consequently, please consider verifying whether any of your projects are using such section to define Fast Data projections and migrate
them to the supported page. 

Below is reported a screenshot of the section that is going to be deprecated:

![Mia Platform Advanced Section - Fast Data section highlighted in orange](./img/10.5/advanced_section_fast_data.jpg)

## Marketplace

### Marketplace Updates

#### CRUD Service

Our MongoDB CRUD Service is now Open Source! 

:::tip
Check out our [Blog Post](https://blog.mia-platform.eu/en/mia-platform-launches-open-source-mongodb-crud-service), the [How To guide](/how_to/crud_service/crud_oss_usage.mdx) and the [GitHub repository](https://github.com/mia-platform/crud-service). Do not forget to update the Docker image of the already existing instances of the CRUD services in the Console, putting the proper link:  ghcr.io/mia-platform/crud-service:6.3.0.
:::

#### Appointment Manager - v2.1.0

Added support for multiple reminders and a dedicated endpoint, `POST /searches/first-available-slot/`,
for searching for the first available slots.
The `GET /slots/` endpoint has also been improved to return the availability resource ID for each slot.
See the [CHANGELOG](/runtime_suite/appointment-manager/changelog.md) for more details about the new features.

#### FHIR API Service - v1.0.1

Minor vulnerability fix.

#### Form Service BE - v1.6.0

Added the autosave feature for the form assignments procedure.
Fixed a minor issue on the `isEditable` property in the `GET /forms/:id` endpoint.

#### Form Service FE - v1.6.0

Added the capability to retrieve draft and autosave form assignments.

#### Messaging Service - v1.2.0

The Messaging Service now supports template attachments.
See the [CHANGELOG](/runtime_suite/messaging-service/changelog.md) for more details about the new feature.

#### Teleconsultation Service BE - v1.3.0

Added a dedicated environment variable for the live teleconsultation feature.

#### Teleconsultation Service FE - v1.3.0

Added a button to re-enter the teleconsultation. Moreover, feedback at the end of the call is now removed.
The "Interaction to autoplay the content on the page" modal on teleconsultation start has also been removed.

#### User Manager Service - v1.3.2

Fixed an error in the `PATCH /users/:id` endpoint when the body does not contain `$set`.

#### Payment Integration Hub - v2.0.0

The latest version includes the following new features:
- Flow Manager and its saga collection to store transaction data
- Front-end to perform new payments
- Adaptive Checkout to dynamically display customized payment methods/providers based on transaction data
- Export function for transaction data
- Automatic verification of outstanding payments
- Bulk actions such as refund and invoice downloading
- Partial refund from Backoffice

For more technical details please refer to [the documentation](/runtime_suite/payment-integration-hub/overview.md).

## Backoffice - 1.3.4

### New Features

#### Form tooltip

Form components (`bk-form-modal`, `bk-form-drawer`, `bk-form-card`) support `description` field in data-schema, of type either string or internationalized text, which is rendered inside a tooltip next to field label.

#### New component `bk-auto-refresh`

New web component `bk-auto-refresh` is available, which allows for periodic automatic data-refresh. Refer to [the documentation](/business_suite/backoffice/components/misc.md#bk-auto-refresh) for more information.

#### Wildcards in `bk-url-parameters`

Component `bk-url-parameters` supports wildcards in `urlMask` property. Data matched through wildcards is included in event payload with numeric keys, and can be excluded setting property `excludeWildcards` to true.

#### `bk-card` footer supports `template`-`configMap`

`bk-card` support for dynamic configuration has been extended to `template`-`configMap` pair formalism. This allows to set dynamic configurations to the footer and its buttons, based on equality to some data in the card.

#### `bk-card` supports `visualizationOptions`

`bk-card` component makes use of `visualizationOptions` property for each field of data-schema, allowing greater freedom in terms of how the data is visualized in the body of the card.

#### `bk-button` supports `Action` interface and `clickConfig` goes deprecated

`bk-button` supports `Action`-sdk through property `action`, allowing wider range of configurable actions.

:::warning
`clickConfig` is now deprecated and will be removed in future releases in favor of `action`. Please refer to `bk-button` documentation for [migration instructions](/business_suite/backoffice/components/buttons.md#migrating-from-clickConfig-to-action).
:::

#### New component `bk-atlas-dashboard`

New web component `bk-atlas-dashboard` is available, allowing to embed dashboards from [MongoDB Atlas](https://www.mongodb.com/atlas/database).

### Bug Fix

#### Read-only form uses `editorHeight`

Form components (`bk-form-modal`, `bk-form-drawer`, `bk-form-card`) correctly support `editorHeight` property in readonly mode, allowing to set height for monaco-editor fields.

#### `bk-form-modal` nested tables renders date fields

Object/array fields which are rendered as tables in `bk-form-modal` correctly render date fields, using `dateOptions.displayFormat` in their data-schema if specified.

#### `bk-simple-list` header

`bk-simple-list` header style is aligned with `bk-card` and `bk-form-card`, extending its `label` property to also allow icon, badge, subtitle.

#### `bk-gallery` component does not render menu icon if unnecessary

`bk-gallery` component does not render menu icon if the number of actions is two or lower.

#### Lookups are resolved in initial values

Components `bk-form-card` and `bk-filter-drawer` correctly resolve lookups within initial values.


## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.3.0`.
