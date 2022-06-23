---
id: v9.3.0
title: Version v9.3.0 Release Notes
sidebar_label: v9.3.0
image: "img/release-note-link-preview.png"
---

_June, 23rd 2022_

## Console

#### Azure DevOps and BitBucket as Git Provider on Console

Azure DevOps and Bitbucket are now supported as console Git Providers. From today the console integrates correctly with Azure and BitBucket services so that it works correctly regardless of the provider that the user has configured and in order to meet almost all the technical needs of the market.

#### View commit history for current branch

It is now possible to view the current branch history from the branch selection popover.

#### Environment variables section

In the "Settings" area of the console, the Environment management has been divided in two pages, one presents the Environments overview and the other one allows you to manage the secreted environment variables of the project.

#### Save with cmd/ctrl + enter

A useful shortcut has been implemented in the save configuration modal allowing you to save with ctrl+enter (or cmd+enter on MacOS)

#### Jenkins Integrations

From this release the console integrates correctly with the APIs exposed by Jenkins: this includes the jobs triggering and the correct view of their log. It also improves the retrieval of the pipeline status from Jenkins.

### Bug Fix

- Resolved a bug causing multiple branches to be created when saving configuration on a new branch
- Fixed an inconsistent UI behavior of the form used to save a new configuration
- Resolved errors about documentation link visible after selection of a microservices in the marketplace without relative documentation
- Fix company endpoint overview horizontal scroll
- Fixed a bug preventing to see the deployment history on certain runtime environments
- Resolved a bug preventing to unset the number of static replicas of a microservice

### Improvements
 
- Improved the UX and UI about the button and popover of save configuration
- From the selection branch modal, user can create a new branch from an existing one by clicking on the button
- From the selection branch modal, the default branch is now identifiable with a diamond icon
- From the selection branch modal, when changing branch, user can see which one is the last used branch

## Fast Data

### Documentation

A reworked version of the Fast Data documentation is currently under construction. We are re-shaping the doc to give you more organized and complete information, and you can already have a look at it [here](../../fast_data/reworked_doc/what_is_fast_data).

In future releases, the old documentation will be removed, and this new section will replace it.

## Marketplace

### New Marketplace Components

#### Welcome to Rönd

RBAC service is now open source and we are happy to present you Rönd, find out more [here](https://github.com/rond-authz/rond) and go give it a star!

### Marketplace updates

- Updated the dependencies of Java microservices 
- Updated the node version of Node.js microservices to v16
- PDF Service v1.2.0 with `handlebars` template support


### Security update for the following microservices

## Backoffice - 1.0.4

### Improvements

 - Recursive lookup resolution for nested data structures
 - Buttons support `danger` mode
 - Buttons support external resources `DELETE` methods

### Bug Fix

 - The disabled/loading state of a custom button is not triggered when the download is native
 - Notification properly appendend on HTML tree when inside a layout container

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 7.0.2`.
