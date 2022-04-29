---
id: configuration
title: Single View Trigger Configuration
sidebar_label: Configuration
---

## Environment variables

- LOG_LEVEL (**required**): defines the level of the logger  
- PROJECTION_STORAGE_MONGODB_URL (**required**): defines the mongodb URL for the projection storage database
- PROJECTION_CHANGES_MONGODB_URL (**required**): defines the mongodb URL for the projection changes database
- PROJECTIONS_DATABASE_NAME (**required**): defines the name of the projections' database  
- PROJECTIONS_CHANGES_COLLECTION_NAME (**required**): defines the name of the projections changes collection  
- LC39_HTTP_PORT (**required**): defines the lc39 HTTP port
- KAFKA_BROKERS (**required**): defines the Kafka brokers
- KAFKA_GROUP_ID (**required**): defines the Kafka group id
- KAFKA_SASL_USERNAME (**required**): defines the Kafka SASL username
- KAFKA_SASL_PASSWORD (**required**): defines the Kafka SASL password
- MAP_TABLE_FOLDER (**required**): defines the path to the map table folder
- KAFKA_PROJECTION_UPDATES_FOLDER (**required**): path to the folder that contains the file `kafkaProjectionUpdates.json`, containing configurations of the topic from where to consume projection updates 
- ER_SCHEMA_FOLDER: defines the path to the folder containing the ER-Schema
- KAFKA_SASL_MECHANISM: defines the authentication mechanism. It can be one of: `plain`, `scram-sha-256` or `scram-sha-512`. The default value is `plain`
- KAFKA_PROJECTION_CHANGES_FOLDER: path where has been mounted the `kafkaProjectionChanges.json` configuration.
- KAFKA_HEARTBEAT_INTERVAL_MS: The expected time in milliseconds between heartbeats to the consumer coordinator. Default is 3000
- STRATEGIES_FOLDER: defines the path to the strategies' folder
- USE_AUTOMATIC_STRATEGIES: defines whether to use or not automatic strategies. Default is `false`
- PROJECTIONS_CHANGES_SOURCE: defines whether the projection changes are going to be sent on Mongo or Kafka. Default is `KAFKA`. Possible values are either `MONGO` or `KAFKA`.
- CA_CERT_PATH: the path to the CA certificate, which should include the file name as well, e.g. `/home/my-ca.pem`

## Configuration files

Since this service purpose is to lighten the workload of the Real-Time Updater, it won't need any new kind of configuration file, the ones it needs are the same used in a traditional RTU. As for the environment variables, most of them are going to be the same as the RTU, except for `PROJECTIONS_CHANGES_SOURCE`, a newly introduced variable matching the one of the Single View Creator, indicating where the projection changes are going to be sent.

The required ones are:

- [MAP_TABLE](../real_time_updater/manual_configuration.md#maptable-configurations)
- [Kafka Projection Updates](../real_time_updater/manual_configuration.md#kafka-projection-updates-configuration)

If the projection changes have to be produced on Kafka, it will also need

- [Kafka Projection Changes](../real_time_updater/manual_configuration.md#kafka-projection-changes-configuration)

In case the environment variable `USE_AUTOMATIC_STRATEGIES` is set to `true`, the following configurations will be needed:

- [ER schema](../real_time_updater/low_code_configuration.md#er-schema-configuration)
- [Projection Changes Schema](../real_time_updater/low_code_configuration.md#projection-changes-schema)

Otherwise, if you need extreme customization for your project, it's suggested to adopt the manual approach for strategies configuration. To do so, the environment variable `USE_AUTOMATIC_STRATEGIES` must be set to `false`.

In this case the default mount path used for strategy configuration is: `/home/node/app/configurations/strategies`.
In this folder you have all the generated [Strategies](../single_view#strategies) which you have defined in your GitLab project inside the `fast-data-files/strategies` directory.

### CA certs

You can set your CA certs by providing a path to the certification file in the environment variable `CA_CERT_PATH`.
