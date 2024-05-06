---
id: integration_bucket_storage_support
title: Integration
sidebar_label: Integration
---

In this page it is described how the Bucket Storage Support feature can be integrated with other systems,
which means how services and resources should be connected and deployed.

In case of any further doubts on how to actually release this new feature in your system, please consider reading the [deployment guidelines](/fast_data/bucket_storage_support/deployment_guidelines.md).

## Prerequisites

Bucket Storage Support services can be deployed independently of each other depending on the needed use case and they can
interoperate with other plugins as long as their interfaces are being followed.

In addition, to deploy them it is necessary to set up the following resources:

- a message streaming platform, from which messages can be consumed and published. Currently only Apache Kafka is supported
- a Bucket Storage where messages can be saved, with the permissions to read and write files on it.
Currently, the supported resources are [Google Cloud Storage bucket](https://cloud.google.com/storage/docs/buckets)
and any [Buckets compatible with the AWS S3 protocol](https://aws.amazon.com/s3/)

## Integration with Fast Data

It is possible to easily integrate Bucket Storage Support feature with the Fast Data, considering it already satisfy
most of the requirements. Below are two possible solutions of introducing the feature, which can be chosen depending on business needs.

### Parallel Architecture

![Bucket Storage Support parallel architecture](../img/bss_parallel_architecture.svg)

The advantage of this architecture is the fact that current Fast Data system is not impacted at all (in case it is not necessary to pre-fill the bucket with existing data),
since the same messages would be consumed by two independent components. In addition, no further point of failure is introduced in the Fast Data flow.

In order to correctly integrate the plugins with the Fast Data in a parallel way, these steps have to be followed:

* Create _reingestion_ topics
* Configure and deploy the services of the Bucket Storage Support ([Ingestion Storer](/fast_data/bucket_storage_support/configuration/ingestion_storer.md) and
  [Ingestion Reloader](/fast_data/bucket_storage_support/configuration/ingestion_reloader.md))
* Perform an Initial Load procedure of the System of Records, in order to align the messages written on the bucket with all the projections already stored
  on the database

:::note
Parallel architecture requires configuring a subsequent Real-Time Updater which shares the same configuration of the standard data flow,
whereas it reads different ingestion topics (the reingestion ones). This service can deployed alongside the whole Bucket Storage Support
configuration with its replicas set to zero (no actual pod is created on Kubernetes).  
Whenever it is necessary to perform a re-ingestion operation it would then be sufficient to scale up the service's replicas.
:::

For more details, please refer to the Bucket Storage Support [deployment guidelines](/fast_data/bucket_storage_support/deployment_guidelines.md).

### Sequential Architecture

![Bucket Storage Support sequential architecture](../img/bss_sequential_architecture.svg)

The advantage of this architecture regards the fact the messages are provided to Fast Data only after they have been written to the bucket, creating an order
between data stored on the bucket and the one saved on the database.
This architecture is recommended for systems where the requirement of retaining produced messages for a very long time is a way stronger than the need of processing data in near real-time. 

In order to correctly integrate the plugins with the Fast Data in a sequential manner, these steps have to be followed:

* Create post-ingestion topics
* Configure and deploy the services of the Bucket Storage Support ([Ingestion Storer](/fast_data/bucket_storage_support/configuration/ingestion_storer.md) and
  [Ingestion Reloader](/fast_data/bucket_storage_support/configuration/ingestion_reloader.md))
* Configure the Real-Time Updater to the read from the newer post-ingestion topics that have been created in the step above
* Perform an Initial Load procedure of the System of Records, in order to align the messages written on the bucket with all the projections already stored
on the database

For more details, please refer to the Bucket Storage Support [deployment guidelines](/fast_data/bucket_storage_support/deployment_guidelines.md).

## Integration with other systems

Similarly to how it happens with Fast Data, to integrate the Bucket Storage Support it is sufficient to define the needed resources
and connected all the different pieces together. In fact, Ingestion Storer can actually be connected to any set of topics and write
to the bucket independently of whether Ingestion Reloader is available.

Other custom services can be plugged into the system, potentially leveraging the messages emitted from the different services,
to satisfy customer needs. 
