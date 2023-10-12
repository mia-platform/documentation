---
id: setup
title: Setup
sidebar_label: Setup
---
## Installation

```
npm i --save @mia-platform/flow-manager-client
```

## Testing locally

#### Create a network connection

```shell
docker network create app --driver bridge
```

#### Pull the images
```shell
docker pull bitnami/zookeeper
docker pull bitnami/kafka
```

#### Run the images
```shell
docker run -d --rm --name zookeeper --network=app -e ALLOW_ANONYMOUS_LOGIN=yes -p 2180:2181 bitnami/zookeeper

docker run --rm \
  --network app \
  --name=kafka \
  -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS='PLAINTEXT://127.0.0.1:9092,INTERNAL://localhost:9093' \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP='PLAINTEXT:PLAINTEXT,INTERNAL:PLAINTEXT' \
  -e KAFKA_CFG_LISTENERS='PLAINTEXT://0.0.0.0:9092,INTERNAL://0.0.0.0:9093' \
  -e KAFKA_INTER_BROKER_LISTENER_NAME='INTERNAL' \
  -e ALLOW_PLAINTEXT_LISTENER=yes \
  -p 2181:2181 \
  -p 443:9092 \
  -p 9092:9092 \
  -p 9093:9093 \
  bitnami/kafka
```

#### Run tests

```shell
npm test
```

#### Clear docker
```shell
docker kill zookeeper
docker network rm app
```
