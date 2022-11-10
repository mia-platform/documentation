---
id: v8.5.1
title: Version 8.5.1 Release Notes
sidebar_label: v8.5.1
image: "img/release-note-link-preview.png"
---

_January 17, 2022_

## Console

### New features

#### RBAC supports Row filtering policies

Now, RBAC service supports the evaluation of policies that aims at generating a filtering query to be passed via header to the target service.
Here, you can know more about how to implement [Rows filtering](../../development_suite/api-console/api-design/rbac#rbac-rows-filtering) and how to write a query in Rego for permission evaluation. 

#### Supporting assignments of a policy on groups of paths and methods in Manuals Routes tab 

In Manual Routes tab, it is possible to assign a policy to groups of paths by using the _wildcard_ (e.g. `/*`) and of methods by selecting the _ALL_ option.
For more info, visit the [documentation](../../development_suite/api-console/api-design/rbac#routes-priority)

### Breaking changes

#### RBAC receives as input bindings and roles

Bindings and roles are now provided as `input` to the OPA evaluator. 
The old check on user permission is no more performed and the entire ownership is given to Rego.
Visit [RBAC Policies](../../development_suite/api-console/api-design/rbac_policies#policies-input-data) documentation to know more about configuration of a policy. 

#### New naming convention adopted for policies evaluation in RBAC section

In Console, the entire RBAC section wherein allow-permissions are evaluated, is renamed in Policies.
Moreover, in Manual Routes tab, the previously named "Allow permissions", are now changed in "Allow policies".
Consequently, even the [RBAC documentation](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/rbac) has coherently been updated.

### Improvements

#### When opened, Flow Manager visualizer displays channels and commands expanded

Now, opening a flow manager saga, users immediately see command and channels of the saga states already expanded. Then, user can collapse them by using the Collapse All button.

## Marketplace

### Marketplace updates

#### Microlc Docusaurus Template

From today, using the template, the consultation of the documentation is smarter! It is now possible to search very quickly pages or single paragraphs through the use of the search input.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.8.4`.
