---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The configuration steps will let you create the Bucket Storage Support microservices to load and reload data from your bucket:
 
* [Ingestion Storer](../../fast_data/bucket_storage_support/configuration/ingestion_storer_configuration)
* [Ingestion Reloader](../../fast_data/bucket_storage_support/configuration/ingestion_reloader_configuration)

Also, the following microservices are added:

* _API Gateway_: to expose ingestion reloader endpoints
* _CRUD Service: to manage a collection for re-ingestion requests.

In addition to that, the following resources are created:

* `status-service`: a CRUD collection used by the _Ingestion Reloader_ to keep track of the requests to perform re-ingestion of the data
* _API Gateway_ endpoints to:
  * expose with the _CRUD Service_ the aforementioned collection;
  * expose the endpoints of the _Ingestion Reloader_.
* public variables such as:
  * **BUCKET_NAME**: the name of the bucket that will be used by Bucket Storage Support applications;
  * **INGESTION_RELOADER_CLIENT_ID**: the Kafka client id used by the _Ingestion Reloader_;
  * **INGESTION_STORER_CLIENT_ID**: the Kafka client id used by the _Ingestion Storer_;
  * **KAFKA_STORER_GROUP_ID**: the kafka consumer group id used by the _Ingestion Storer_ to read messages from ingestion topics;
  * **BSS_EVENTS_TOPIC**: name of the topic that will be used by the _Ingestion Storer_ to publish events related to files written into the bucket.  

## Connection Set-Up

After the application has been created, you still need to configure manually both bucket and kafka connections. You can refer to this sections:

* [Bucket Connection Configuration](../../fast_data/bucket_storage_support/configuration/bucket_connection_configuration)
* [Kafka Connection Configuration](../../fast_data/bucket_storage_support/configuration/kafka_connection_configuration)
