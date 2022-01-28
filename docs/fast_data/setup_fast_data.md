---
id: setup_fast_data
title: Fast Data Set up
sidebar_label: Set up
---

Mia-Platform Fast Data is built upon Kafka, in order to configure the Fast Data within the Console, we assume an already set up Kafka cluster.

## Kafka

Kafka is an event streaming platform used to write messages containing data received from disparate source systems and makes them available to target systems in near real time.

:::info
To correctly configure your Kafka cluster, you can visit [this site](https://eventsizer.io/).
:::

## Snappy compression

Snappy is a compression and decompression library whose aim is to offer high speed data flow while still mantaining a reasonable compression ratio. Among the various types of compression supported by Kafka for its messages, there is also Snappy.

The main advantages of Snappy are:

* Fast compression speed (around 250 MB/sec)
* Moderate CPU usage
* Stability and robustness to prevent crashing while still mantaining the same bitstream format among different versions
* Free and open source

> *Note*: For further information about Snappy, check the official [github page](https://github.com/google/snappy) of the library.

Provided that the client's **CDC** (Change Data Capture) supports Snappy compression, the console is already predisposed for it.

:::caution
Snappy, like every other compression and decompression algorithm, will always increase the delay between production and consumption of the message, hence it is not advised for strong real-time relying applications; on the other hand it is well recommended for initial loads which tend to be a lot heavier.
:::

## Create topics

You can create a topic using Kafka cli, or if you use the Confluent Cloud you can use the user interface.

### Confluent cloud

> *Note*: This documentation about Confluent Cloud has been last checked on date 5th February 2021. Some information could be outdated. Check out the official documentation of Confluent [here](https://docs.confluent.io/)

If you use a cluster in Confluent cloud, you could create topics both from UI and from CLI.

#### Use Confluent Cloud UI

First, you need to log in to [Confluent Cloud](https://confluent.cloud/login), click on environment and cluster when you want to create the topic.

If you don't have a cluster, create one following this [documentation](https://docs.confluent.io/cloud/current/clusters/create-cluster.html)

##### Create topic

On the left menu, click on `Topics` and `Add a topic` button. Insert the topic name and the number of partitions required. Here you could create with defaults or customize topic settings.

:::info
We suggest to use a topic name like `project.environment.projection-json`
:::

> *Note*: if this documentation seems outdated, follow the [official one](https://docs.confluent.io/cloud/current/client-apps/topics/manage.html#create-a-topic)

##### Create service account

On the left menu, click on `API access` and add key (if not already exists) for `Granular access`.
Here you could select an already existent service account or create a new one.

:::info
We suggest you to create a service account for each project and environment.
:::

> *Note*: if this documentation seems outdated, follow the [official one](https://docs.confluent.io/cloud/current/access-management/service-account.html#use-ccloud-service-accounts-to-produce-and-consume)

##### Create ACL rules

Once created the service account, you can set from user interface:

* *type*: set **topic** type.
* *topic name*: new or existent one.
* *pattern type*: literal or prefixed. If you want to declare an ACL for each topic you should use **literal**.
* *operation*: for each topic, you should set **READ** and **WRITE** operation.
* *permission*: could be ALLOW or DENY. You should set **ALLOW**. Once created, by default permission are to deny all others operations.

#### Use Confluent Cloud CLI

First, you should [install the Confluent Cli](https://docs.confluent.io/ccloud-cli/current/install.html).

Once installed, to create a new topic (with some custom config) run:

```sh
ccloud kafka topic create --partitions 3 --cluster CLUSTER_ID --config cleanup.policy=compact --config retention.ms=2592000000 'project.environment.projection-json';
```

You should create a service account if you have not already [following this guide](#create-service-account)

After the creation of the topic, you can associate the ACL to a service account:

```sh
ccloud kafka acl create --allow --service-account SERVICE_ACCOUNT --operation WRITE --topic 'project.environment.projection-json' --cluster CLUSTER_ID;
ccloud kafka acl create --allow --service-account SERVICE_ACCOUNT --operation READ --topic 'project.environment.projection-json' --cluster CLUSTER_ID;
```

## Set up a Kafka consumer

To set up the consumer, you should create an ACL with the `READ` operation set to consumer group id configured in the environment variables.

If you have not a service account, you could create it [following this guide](#create-service-account).

### Consumer group ACL from UI

To set up the ACL for the consumer group, from the Confluent Cloud UI you should set:

* *type*: set **Consumer group** type
* *consumer group ID*: write consumer group ID configured in environment variables
* *pattern type*: literal or prefixed. If you want to declare an ACL for each topic you should use `literal`;
* *operation*: You should set the **READ** operation;
* *permission*: could be ALLOW or DENY. You should set **ALLOW**. Once created, by default permission are to deny all others operations.

### Consumer group ACL from Confluent CLI

If you set `my-consumer-group.development` as consumer group id, you can configure from cli:

```sh
ccloud kafka acl create --allow --service-account SERVICE_ACCOUNT --operation READ --consumer-group "my-consumer-group.development" --cluster CLUSTER_ID;
```

> *Note*: if this documentation seems outdated, follow the [official one](https://docs.confluent.io/platform/current/clients/consumer.html)

## Add a CRUD Service to your project

Projections and single views created in the Console are handled by the [Crud Service](../runtime_suite/crud-service/overview_and_usage.md). Therefore, if your project does not already have a [Crud Service](../runtime_suite/crud-service/overview_and_usage.md) you should add one. Follow [this link](../runtime_suite/crud-service/configuration.md) to learn how to correctly create and configure your CRUD Service.

## Set up environment variables

When you start using Fast Data, you should set some environment variables in the `Envs` section in Console to correctly deploy your project. [Click here](../development_suite/set-up-infrastructure/env-var) to view how this section works, and how to differentiate the environment variables through environments.

The environment variables to set are shared for all the System of Source, and all these environment variables must be added if a System of Records has been created.

Here is the list:

* **LOG_LEVEL**: it should already be set as environment variables
* **FAST_DATA_PROJECTIONS_DATABASE_NAME**: name of the db where projections are saved
* **KAFKA_BROKERS**: the host of your Kafka cluster (with the port)
* **KAFKA_SASL_USERNAME**: username to log in to Kafka cluster
* **KAFKA_SASL_PASSWORD**: password to log in to Kafka cluster
* **MONGODB_URL**: the url to mongo db. It is the same used, for example, for crud service

If you need to customize **KAFKA_SASL_USERNAME** and **KAFKA_SASL_PASSWORD** for some Systems of Record, [click here](./advanced#kafka-configuration).

If you want to disable authentication to Kafka, set both **KAFKA_SASL_PASSWORD** and **KAFKA_SASL_USERNAME** to empty string.
