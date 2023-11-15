---
id: kafka2rest
title: Kafka2Rest Kotlin Library
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

### Initialization

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

Just start Kafka2Rest. Invoking the `start()` method Kafka2Rest will run on new thread and listen kafka topics.

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
