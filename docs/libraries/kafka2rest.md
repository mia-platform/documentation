---
id: kafka2rest
title:  Kafka2Rest Kotlin Library
sidebar_label: Kafka2Rest
---
This library allow to consume kafka messages and handle them making HTTP REST calls.

## Install

To include the library as a dependency of your Maven/Gradle project use the following snippets.

### install Kafka2Rest

#### Maven

```xml
<dependency>
  <groupId>eu.mia-platform</groupId>
  <artifactId>kafka2rest</artifactId>
  <version>{VERSION}</version>
</dependency>
```

#### Gradle

```java
implementation 'eu.mia-platform:kafka2rest:{VERSION}'
```

### install Kafka2Rest dependencies

You need to add [Fuel](https://github.com/kittinunf/fuel) repository to your `build.gradle` or `pom.xml`.

#### Gradle

```java
repositories {
   maven {
        name 'spring-lib-release'
        url 'https://repo.spring.io/libs-release/'
    }
    ...
}
```

## Usage

Kafka2Rest is based on **Filters** and **Processors**. You can develop your custom Filters and Processor implementing the [FilterInterface](https://git.tools.mia-platform.eu/platform/libraries/kafka2rest/blob/master/src/main/kotlin/eu/miaplatform/kafka2rest/interfaces/FilterInterface.kt) and [ProcessorInterface](https://git.tools.mia-platform.eu/platform/libraries/kafka2rest/blob/master/src/main/kotlin/eu/miaplatform/kafka2rest/interfaces/ProcessorInterface.kt) or use existent [filters](https://git.tools.mia-platform.eu/platform/libraries/kafka2rest/tree/master/src/main/kotlin/eu/miaplatform/kafka2rest/filters) and [processors](https://git.tools.mia-platform.eu/platform/libraries/kafka2rest/tree/master/src/main/kotlin/eu/miaplatform/kafka2rest/processors).

### Inizialization

First of all you need to initialize Kafka2Rest with:

* Generics `<K, V>` used in library [ConsumerRecords](https://kafka.apache.org/11/javadoc/org/apache/kafka/clients/consumer/ConsumerRecords.html).
* [Kafka Consumer](https://kafka.apache.org/20/javadoc/org/apache/kafka/clients/consumer/Consumer.html). Remember to set false "enable.auto.commit" property if you need to handle processors failures.
* A [Config](https://git.tools.mia-platform.eu/platform/libraries/kafka2rest/blob/master/src/main/kotlin/eu/miaplatform/kafka2rest/config/ConfigBuilder.kt) object.
* [Kafka Producer (Optional)](https://kafka.apache.org/20/javadoc/org/apache/kafka/clients/producer/Producer.html). This parameter must be set in order to use the `onExceptionTopic` configuration.

#### Config Parameters

|Parameter|Meaning|
|---|---|
|maxIntervalBetweenPolls|The maximum time (Duration) interval between two consecutive poll. When this timeout is exceeded the method `isRunning()` returns false.|
|topicList|The list of topic to subscribe to.|
|pollTimeout|The time (Duration) spent waiting in poll if data is not available in the buffer. If 0, returns immediately with any records that are available currently in the buffer, else returns empty. Must not be negative.|
|onExceptionTopic|(Optional) Defines a topic where messages causing unhandled processor exceptions will be stored. Kafka2Rest will enrich the message headers with two properties `retryNumber` and `errors`.|
|retriesLimit||
|sleepPeriod||

#### Code Sample

```kotlin
    val props = Properties()
    props["bootstrap.servers"] = "http://your-kafka-host:9092"
    props["group.id"] = "consumer-group-id"
    props["key.deserializer"] = StringDeserializer::class.java
    props["value.deserializer"] = StringDeserializer::class.java
    props["max.poll.interval.ms"] = Int.MAX_VALUE
    props["connections.max.idle.ms"] = Int.MAX_VALUE
    props["enable.auto.commit"] = false

    val consumer = KafkaConsumer<String, String>(props)

    val config = ConfigBuilder
        .addTopicList(listOf("topic1", "topic2"))
        .addPollTimeout(Duration.ofSeconds(10L))
        .addMaxIntervalBetweenPolls(Duration.ofMinutes(5L))
        .build()

    val kafka2rest = Kafka2Rest<String, String>(consumer, config)
```

### Messages Handling

Then you need to set the Filter And Processor couples. Filter parse kafka message and return _boolean_ .
If true the linked processor run its `process()` method and do something.

```kotlin
    kafka2rest.set(Filter1(), HTTPPostProcessor())
    kafka2rest.set(Filter1(), MyCustomProcessor())
    kafka2rest.set(Filter2(), OtherProcessor())
    // ...
```

### Start

Just start Kafka2Rest. Invonking the `start()` method Kafka2Rest will run on new thread and listen kafka topics.

```kotlin
    kafka2rest.start()
```

### Health Check

Kafka2rest offers two method to verify service and connection healthiness.

- **isRunning()** This method verifies the timeout between two consecutive poll. It returns `true` when the config `maxIntervalBetweenPolls` timeout is respected. This ensures that the consumer is polling and the processors aren't getting stuck.
- **isConnected()** This method verifies that consumer can list broker topics and it must be connected to kafka server to do this. It returns `true` when topics are more than 0.

## ProducerManager (beta)

You can also send messages to kafka host building ProducerManager and using the `sendMessage()` method.

```kotlin
    val producerManager = ProducerManager("localhost:9092")
    producerManager.sendMessage(myKafkaMessage, "topic1")
```

---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.0.0

### BREAKING CHANGES

* Removed all constructor except the primary.
* ProducerManager has been detached from Kafka2Rest controller class.

### Added

* [CAOED-147](https://makeitapp.atlassian.net/browse/CAOED-147) health methods `isRunning()` and `isConnected()`.

## 2.2.2

* [TNPT1-41](https://makeitapp.atlassian.net/browse/TNPT1-41) Avoid to continue to process messages on commit error

## 2.2.1

### Fixed

* update `close` method for graceful shut down

### 2.2.0

* [LUEE-41](https://makeitapp.atlassian.net/browse/LUEE-41) Added a commit error handler callback function to notify application of commit failures
* [CC1B-442](https://makeitapp.atlassian.net/browse/CC1B-442) Allow to pass headers in RESTController.get() and RESTController.put()
* [CC1B-441](https://makeitapp.atlassian.net/browse/CC1B-441) Allow to pass key (not required) in KafkaMessage()
* [TNPT1-29](https://makeitapp.atlassian.net/browse/TNPT1-29) Retry if processor fails

## 2.0.0

### Fixed

* [MP4-932](https://makeitapp.atlassian.net/browse/MP4-932) Make http sync

## 1.0.0

### Changed

* publish script updated into the build.gradle file

### Fixed

* offset value fixed on the _commitSync_ function
* [MP4-932](https://makeitapp.atlassian.net/browse/MP4-932) Make http sync
