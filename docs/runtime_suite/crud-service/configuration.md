---
id: configuration
title: CRUD Service Configuration
sidebar_label: Configuration
---
This service can be added to your project by visiting Mia-Platform [Marketplace](../../marketplace/overview_marketplace.md) and creating a new microservice from the **CRUD Service** plugin.

## Configure a CRUD Service to use MongoDB CRUD section

In order to start using the MongoDB CRUD section, all you have to do is adding it from the Marketplace: all the ConfigMaps and environment variables it needs will be precompiled with no need to change them.

:::info
The CRUD Service supports custom CA certs. If you want to learn more about these certificates and how to configure them in your CRUD Service visit [this page](../../development_suite/api-console/api-design/services#provide-a-ca-certificate-to-a-custom-service)
:::

### ConfigMap

The CRUD Service default configmap is mounted in `/home/node/app/collections`. You can freely choose its name during the service creation.

Furthermore, the ConfigMap is not editable, as it is fundamental for the MongoDB CRUD section to work: it is not possible to add files, edit the mountPath or delete it.

However, you will find a link that will redirect you to **MongoDB CRUD** dedicated section where you can continue to configure your project [CRUDs](../../development_suite/api-console/api-design/crud_advanced.md). By doing so, you will automatically define the collections that will be handled by the service, which means that there is no need to add any configuration files.

## Environment variables

* **MONGODB_URL** (*required*): the MongoDB connection string;
* **COLLECTION_DEFINITION_FOLDER** (*required, default `/home/node/app/collections`*): the path to the folder where all collections are defined;
* **USER_ID_HEADER_KEY** (*required*): header key used to know which user makes the request. User id is useful to add `creatorId` and `updaterId` field in collection document;
* **CRUD_LIMIT_CONSTRAINT_ENABLED**: (*default: `true`*): a boolean value to enable the query limit constraint feature. If it is enabled, the max limit of the get list APIs is 200.
* **CRUD_MAX_LIMIT**: (*default: `200`*): an integer value to configure the maximum limit of objects returned by a MongoDB query.
* **TRUSTED_PROXIES** (*default: `10.0.0.0/8,172.16.0.0/12,192.168.0.0/16`*): the string containing the trusted proxies values.
* **HTTP_PORT**: The port exposed by the service.
* **LOG_LEVEL** (*default: `info`*): level of the log. It could be trace, debug, info, warn, error, fatal.
* **EXPOSE_METRICS** (*default: `false`*): boolean that specifies if prometheus metrics should be exposed or not.
* **ALLOW_DISK_USE_IN_QUERIES**: sets the `allowDiskUse` option in the MongoDB queries, useful when working with MongoDB Views requiring heavy aggregations (added in v6.0.2, works with MongoDB >= 4.4).

:::warning
Using `ALLOW_DISK_USE_IN_QUERIES` (either with `true` or `false` values) with a MongoDB version lower than 4.4 will make all the GETs unusable, since the MongoDB cluster will raise an error for the unrecognized option `allowDiskUse`.
:::
