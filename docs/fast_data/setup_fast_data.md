---
id: set_up_fast_data
title: Fast Data Set up
sidebar_label: Set up
---

Mia-Platform Fast Data is built upon Kafka, in order to configure the Fast Data within the Console, we assume an already set up Kafka cluster.

## Kafka

Kafka is an event streaming platform used to write messages containing data received from disparate source systems and makes them available to target systems in near real time.

:::info
To correctly configure your Kafka cluster, you can visit [this site](https://eventsizer.io/).
:::

## Create topics

You can create a topic using Kafka cli, or if you use the Confluent Cloud you can use the user interface.

<!-- TODO: Aggiungere ACL?
### Kafka CLI

First, you have to [download the latest Kafka release](https://www.apache.org/dyn/closer.cgi?path=/kafka/2.7.0/kafka_2.13-2.7.0.tgz) and extract it.

To create a Kafka topic named `my-project.development.projections-json` with 3 partitions on a server exposed on `localhost:9092` with some configuration options, run:

```sh
bin/kafka-topics.sh --create --topic 'my-project.development.projections-json' --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092 --config cleanup.policy=compact --config retention.ms=2592000000
```

To view which configurations you are able to set, view the [Kafka documentation](https://kafka.apache.org/documentation/#topicconfigs).

 TODO: capire come creare ACL -->

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

> *Note*: if this documentation looks not to be updated, follow the [official one](https://docs.confluent.io/cloud/current/client-apps/topics/manage.html#create-a-topic)

##### Create service account

On the left menu, click on `API access` and add key (if not already exists) for `Granular access`.
Here you could select an already existent service account or create a new one.

:::info
We suggest you to create a service account for each project and environment.
:::

> *Note*: if this documentation looks not to be updated, follow the [official one](https://docs.confluent.io/cloud/current/access-management/service-account.html#use-ccloud-service-accounts-to-produce-and-consume)

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
* *consumer group ID*: write consumer group ID configured in environent variables
* *pattern type*: literal or prefixed. If you want to declare an ACL for each topic you should use `literal`;
* *operation*: You should set the **READ** operation;
* *permission*: could be ALLOW or DENY. You should set **ALLOW**. Once created, by default permission are to deny all others operations.

### Consumer group ACL from Confluent CLI

If you set `my-consumer-group.development` as consumer group id, you can configure from cli:

```sh
ccloud kafka acl create --allow --service-account SERVICE_ACCOUNT --operation READ --consumer-group "my-consumer-group.development" --cluster CLUSTER_ID;
```

> *Note*: if this documentation looks not to be updated, follow the [official one](https://docs.confluent.io/platform/current/clients/consumer.html)

## Set up environment variables

When you start using Fast Data, you should set some environment variables in the `Envs` section in Console to correctly deploy your project. [Click here](/docs/development_suite/set-up-infrastructure/env-var) to view how this section works, and how to differentiate the environment variables through environments.

The environment variables to set are shared for all the System of Source, and all this environment variables must be added if a System of Records has been created.

Here is the list:

* **LOG_LEVEL**: it should already be set as envirnoment variables
* **FAST_DATA_PROJECTIONS_DATABASE_NAME**: name of the db where projections are saved
* **KAFKA_BROKERS**: the host of your Kafka cluster (with the port)
* **KAFKA_SASL_USERNAME**: username to log in to Kafka cluster
* **KAFKA_SASL_PASSWORD**: password to log in to Kafka cluster
* **MONGODB_URL**: the url to mongo db. It is the same used, for example, for crud service

If you need to customize **KAFKA_SASL_USERNAME** and **KAFKA_SASL_PASSWORD** for some Systems of Record, [click here](./advanced#kafka-configuration)
