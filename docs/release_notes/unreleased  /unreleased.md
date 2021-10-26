---
id: vX.X.X
title: Version X.X.X Release Notes
sidebar_label: vX.X.X
image: "img/release-note-link-preview.png"
---

_Month day, year_

### New Features

#### Pod filters as url query string

In the Monitoring Area, when a filter is selected, it is added to the url as a query string. Thanks to this, you can now share links of monitoring that keep the selected filters.

### Bug Fix

#### Environment based on url in Monitoring Area

Fixed a bug that would cause the Monitoring Area to ignore the environment possibly specified in the url. When you navigate to the Monitoring Area using a link that contains the environment in its path, the correct environment will be displayed.

### Breaking Changes 

#### Client Credentials 3.0.0

The support to Redis Sentinel has been added, so you can provide multiple comma-separated redis hosts.
Consequently, the `REDIS_HOST` env has been changed in `REDIS_HOSTS`. 
Moreover, library dependencies have been updated.

### Marketplace Updates

#### Files Service 2.3.1

Mitigation of Cross-site Scripting and Cross-site Request Forgery attacks on download of html files

### New marketplace microservices

#### Scratch Template 

An empty template fully customizable by the user has been added into Marketplace, for more info visit this [page](https://github.com/mia-platform-marketplace/scratch-template)

### Improvements



### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.
