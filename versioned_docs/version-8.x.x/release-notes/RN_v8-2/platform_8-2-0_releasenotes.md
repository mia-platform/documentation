---
id: v8.2.0
title: Version 8.2.0 Release Notes
sidebar_label: v8.2.0
image: "img/release-note-link-preview.png"
---

_November 5, 2021_

### New Features

#### New Project Homepage

The [project Homepage](../../development_suite/overview-dev-suite.md) has been redesigned in order to give more information about the status of your project.  

You can now see all your environments and check how are the pods of your services.  
The *KPIs* you may need is already there:

- **Pods status**: how many pods are healthy
- **CPU and RAM**: *Usage vs Request* and *Usage vs Limit*

A warning will be displayed to notify you if some service request or limit is missing, or if some pods in unhealthy.
 
You can also have quick access to the areas of your Project. Just one click and you can access the deploy area of the environment you want to release.  

You don't have to navigate all around the Console to access your project links. They are right there on the Homepage now: Project Documentation, CMS, Application, Dashboards. All of them, just one click away.

#### Pod filters as url query string

In the Monitoring Area, when a filter is selected, it is added to the url as a query string. Thanks to this, you can now share links of monitoring that keep the selected filters.

#### Support in Launcher

Added support icon in Console Launcher that redirects to [Mia-Platform support](https://makeitapp.atlassian.net/servicedesk/customer/portal/21).

#### Encryption of the default fields of a collection

It is now possible to enable encryption for the default fields *creatorId* and *updaterId* of a collection. 
Furthermore, for all the default fields it's also possible to attribute the degree of sensitivity of the data and to provide the description of its purpose in terms of GDPR.

### Bug Fix

#### Fixed save in the Visualize area

Fixed a bug that prevented saving in other areas of the console after saving in the Visualize area.

#### Environment based on url in Monitoring Area

Fixed a bug that would cause the Monitoring Area to ignore the environment possibly specified in the url. When you navigate to the Monitoring Area using a link that contains the environment in its path, the correct environment will be displayed.

#### Show error alert correctly when fails to upload CRUD fields from file

Due to a bug, the alert which explains the error was not shown.

#### Cross Project Proxy through Kubernetes Service now works correctly

The [Cross Project Proxy](../../development_suite/api-console/api-design/proxies#create-a-new-cross-projects-proxy) made through the Kubernetes Service did not work correctly due to a misconfiguration.

### Breaking Changes 

#### Cast Function identity is used as default for autogenerated fields of projections

By now, when you generate projection fields from a data sample, the identity cast function is used as default. This prevents unwanted casting, keeping the value as is.

### Marketplace Updates

#### Client Credentials 3.0.0

The support to Redis Sentinel has been added, so you can now provide multiple comma-separated list of redis hosts;
for this reason, the `REDIS_HOST` env var has been removed to be substituted with `REDIS_HOSTS`. 

We have also added two new environment variables: `REDIS_MODE` and `REDIS_MASTER_NAME` env, for further information check out the [plugin documentation](https://docs.mia-platform.eu/docs/runtime_suite/client-credentials/configuration).

#### Files Service 2.3.1

Mitigation of Cross-site Scripting and Cross-site Request Forgery attacks on download of html files.

#### Single View Creator Plugin & Template 3.1.0

Added new UPSERT_STRATEGY environment variable to be able to define whether replace or update the document when a new update of a single view occurs.

#### Authorization Service 2.2.0

Added OPTIONS method to supported methods. It is possible to add it in the configuration, or it is automatically handled with the `ALL` method keyword.

### New marketplace microservices

#### Scratch Template 

An empty template fully customizable by the user has been added into Marketplace, for more info visit this [page](https://github.com/mia-platform-marketplace/scratch-template).

#### Flow Manager Client Node.js library 1.0.0

To improve Flow Manager integration we have published a brand new library on our GitHub organization public repositories. Checkout  [flow-manager-client](https://github.com/mia-platform/flow-manager-client). Using it is as simple as: `npm i @mia-platform/flow-manager-client`.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.4.7`.
