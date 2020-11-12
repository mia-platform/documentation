---
id: v6.2.0
title: Version 6.2.x Release Notes
sidebar_label: v6.2.x
---

## v6.2.1

_November 12,2020_  

### Bug fix 

#### CRUD  

The elimination of a field once it had been modified with the lateral drawer was not working correctly. The problem has now been fixed.

### How to update your DevOps Console

For on-premise Console installations, you have to use the [Helm chart](https://git.tools.mia-platform.eu/platform/devops/console-helm-chart) version `3.0.7`. 

## v6.2.0

_November 11,2020_  

### New Features

#### Files service now supports S3 compatible storages 

The files service **v2.1.0** supports S3 compatible storage. In this [doc](../runtime_suite/files-service/configuration.md) the Oracle Object Storage is described as example.

#### Drawer editor

A new editing mode, featuring a drawer, is now available for the CRUD tables; to use the drawer click on the pencil at the end of each row.

#### MLP now deletes old resources from cluster

During deploy, MLP will verify whether some resources have been removed from the configuration repository and deletes them from the cluster.
The feature is not yet integrated with the Console, in order to take advantage of this feature you have to manually delete files from the configuration repository.
Resources that have been manually deployed, without MLP, will not be removed from cluster.

#### New version of CMS
The v9.12.2 of CMS is now available, this version brings the following features:

- It is now possible to apply a new filter operator to check for empty values.

- Italian internationalization has been brought to collection filters. 

- When exporting data to file, it is now possible to perform the resolution of data references from other tables. The feature is enabled by default, but it is still possible to export data as they are stored in the database using the option "export data as they are on the database".

### Bug Fix  

#### Examples in the Marketplace

The following examples are now working and you can use them in DevOps console: *DotNet Template*, *Node Call Crud* and *Go Call Crud*.

#### Java Microservices

The Java Template, Java HelloWorld and Java Springboot Pre and Post decorator example have been fixed and are now working properly.

#### API Portal 'required' property signal

The `required` property of a field was not correctly signaled for objects and arrays. It is now signaled by a red asterisk, as in all the other cases.

#### CMS Item Default Status

Fixed a bug affecting the CMS that was preventing the use of the default status configured in CRUD internal endpoints. The default status is now set in the CRUD section and is now working properly.

### Improvements

#### Microservice Gateway logging redaction

The microservice gateway service logs have been improved to prevent logging sensitive information. The original request body has been 
removed from debugging log and is now available only in trace. We strongly recommend not to enable trace log level in production.

#### Console deploy website

The performances of Deploy website have been increased. Now the project to download is loaded faster.

### Library updates  

#### lc39

lc39 has been added to the Console Backend. Now it exposes the swagger schemas and status routes.   

### Core services

#### Core services upgrade

* upgrade of `crud-service` to `v3.1.2`
* upgrade of `v1-adapter` to `v3.2.1`
* upgrade of `api-portal` to `v1.13.4`

#### Mongo 4.4 and Redis 6.0 Support

All core and plugin services have been tested with success for Mongo 4.4 and Redis 6.0 support, except for the BaaS Service, which has not been tested yet.

### How to update your DevOps Console

For on-premise Console installations, you have to use the [Helm chart](https://git.tools.mia-platform.eu/platform/devops/console-helm-chart) version `3.0.6`.

