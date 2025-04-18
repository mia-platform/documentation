---
id: rest2kafka
title: Rest2Kafka Kotlin Library
sidebar_label: Rest2Kafka
---
This library allows to easily configure a [Ktor][ktor] Web Server which produces kafka messages.

## Getting Started

### Install

To include the library as a dependency of your Maven/Gradle project use the following snippets.

#### Maven

```xml
<dependency>
  <groupId>eu.mia-platform</groupId>
  <artifactId>rest2kafka</artifactId>
  <version>1.0.1</version>
</dependency>
```

#### Gradle

```groovy
compile 'eu.mia-platform:rest2kafka:1.0.1'
```

### Quick Start

The following basic usage of the library allows to start a server which expose the route `POST /my-route`.  
For each incoming request, a kafka message to `TutorialTopic` will be produced.  
The value of the message will be the body of the incoming request.

```kotlin
val configurations : MutableList<Rest2KafkaOptions<out Any>> = mutableListOf(
        Rest2KafkaOptions(
            RouteOptions(
                "POST",
                "/my-route",
                Any::class
            ),
            KafkaOptions(
                "TutorialTopic"
            )
        )
    )

val rest2kafka = Rest2kafka("localhost:9092", configurations = configurations)
rest2kafka.start()
```

**N.B.** The explicit type `MutableList<Rest2KafkaOptions<out Any>>` is mandatory to initialize the Rest2Kafka class.

### Routes options

The only two mandatory route options are `path` and `method`.

By default the library does not validate the request body. To validate the request body we use [Yavi][yavi] or [JSON schema](https://json-schema.org/).

#### Yavi request body validation

In order to validate the request body, you need to provide the following route options:

- `schema`: the Kotlin class against which to validate the request body
- `validator`: the [Yavi Validator][yavi] instance containing all the desired constraints of each field of the `schema`.

```kotlin
data class MySchema(
    val myStringField: String,
    val myComplexField: ComplexField
) {
    data class ComplexField(
        val firstField: String,
        val secondField: Int
    )
}

val mySchemaValidator: Validator<MySchema> = ValidatorBuilder.of()
    .konstraint(MySchema::myStringField) {
        notNull()
        .notEmpty()
        .lessThanOrEqual(3)
    }
    .build()

val options : MutableList<Rest2KafkaOptions<out Any>> = mutableListOf(
            Rest2KafkaOptions(
                RouteOptions(
                    "POST",
                    "/my-route",
                    schema = MySchema::class,
                    validator = mySchemaValidator
                ),
                KafkaOptions(
                    "my-topic"
                )
            )
        )

val rest2kafka = Rest2kafka(SuccessfulProducer(), configurations = options)
```

For full list of available constraints please refer to [Yavi documentation][yavi].
Other examples of Validators can be found [here][validators].  
This library also provides some utilities to validate the date strings.

##### Validating Int Fields

In order to validate any Int field **it is mandatory to declare the property as nullable (Int?) in the Schema**.
Then, if that field is required, you can use the `notNull()` constraint in the validator.

#### JSON Schema validation

In order to validate the request body, you need to provide the following route options:

- `schema`: the Kotlin class against which to validate the request body.
- `jsonSchemaUrl`: the [JSON Schema specification](https://json-schema.org/specification.html) file url.

```kotlin
data class MySchema(
    val myStringField: String,
    val myComplexField: ComplexField
) {
    data class ComplexField(
        val firstField: String,
        val secondField: Int
    )
}

val configurations : MutableList<Rest2KafkaOptions<out Any>> = mutableListOf(
        Rest2KafkaOptions(
            RouteOptions(
                "POST",
                "/",
                 schema=MySchema::class,
                 jsonSchemaUrl = javaClass.getResource("/json-schema.json")
            ),
            KafkaOptions(
                "my-topic"
            )
        )
    )

    val rest2kafka = Rest2kafka("my-host", configurations = configurations)
    rest2kafka.start()
```

JSON Schema validation is executed by [Medeia Validator](https://github.com/worldturner/medeia-validator).

### Kafka options

The only mandatory kafka option is the topic.  
The other options are all the possible parameters to instantiate a Kafka [ProducerRecord][kafka-producer-record].  
Every produced record will be initialized with the given options.
The record's value is set to the body of the received request unless `value` is provided in the `KafkaOptions`.

### Response body

With the configuration above, the API `/my-route` will respond with `204 No Content`.  
Eventually, you can specify a response body as last parameter of the  `Rest2KafkaOptions`.
The response body can be either a string (Content-Type will be text/plain) or a Kotlin class (Content-Type will be application/json).
It will be the response body of every incoming request for that route.

## Advanced usage

It is possible to use the library in advanced mode to customize either the response body or the Kafka message.  
This is done by using an `Adapter`. It is an interface with only one method `adapt`. You can provide an adapter to `Rest2kafka` using an ad-hoc constructor.

```kotlin
val configurations : MutableList<Rest2KafkaOptions<out Any>> = mutableListOf(
        Rest2KafkaOptions(
            RouteOptions(
                "POST",
                "/my-route",
                Any::class
            ),
            KeyGeneratingAdapterFromBody(
                KeyGeneratingAdapter.KafkaOptions(
                    "tutorialTopic"
                )
            )
        )
    )

val rest2kafka = Rest2kafka("localhost:9092", configurations = configurations)
rest2kafka.start()
```

This method is the one that actually creates both the [ProducerRecord][kafka-producer-record] and the http response given the information about the incoming request.

As the `adapt` method is a suspend function, custom adapters can also do asynchronous operations such as http requests as it is done [here][http-adapter].

If the `adapt` method throws a BadRequestException() then the service will respond with status code specified in the exception;
If the `adapt` function throws any other exception then the service will respond 500 with the message of the exception.

Some adapters are provided by the library and described below.

### Key Generating Adapter from Body

The `KeyGeneratingAdapterFromBody` is an adapter that is initialized with some `KafkaOptions`. Its `adapt` method always generates an `AdapterResponse` having:

- As response body, an `id` that is the hash of the body of the received request
- As [ProducerRecord][kafka-producer-record], a record with:
  - `key`: the hash of the body of the received request;
  - `value`: the body of received request;
  - other `kafkaOptions`: the ones provided when the Adapter is initialized.

## Health routes

Besides the routes set in the configuration, the library exposes, by default, three health routes:

- `/-/healthz` always returns 200
- `/-/ready` always returns 200
- `/-/check-up` always return 200, unless you use the constructor with `checkUpTopic` parameter to instantiate the library.
In this case, it tries to produce a message on the Kafka topic specified in the parameter: if succeeds returns 200;
if fails returns 503.

The response body of these routes will contain both the name and the version of the service.  
Thus your project must contain a `project.properties` file like [this one][project props] where the library will read these information from.  
Remember to update the version in this file every time you tag your service.

### Customize your health routes

The `Rest2Kafka` constructor accepts a third optional parameter that can be:

- `checkUpTopic` of type string. The meaning is explained above.
- `healthRouting` an extension function of the [Routing][routing] Ktor class. This will override the default health routes.

## Logging

By default, the amount of logs of [ktor][ktor] is huge. In order to adjust the logging settings add a `logback.xml` file like [this one][logback] in the resources of your project.

---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### v1.1.0

* add possibility to customize response status code

## v1.0.3

### Added

* default /check-up route can produce a kafka message

## v1.0.2

### Fixed

* Reduce Kafka logs

## v1.0.1

### Fixed

* DefaultResponseBody can be Any and not only String

## v1.0.0

### Changed

* DefaultResponseBody and KafkaOptions are now attributes of the Adapter
* KeyGeneratingAdapter provided

## v0.2.1

### Fixed

* Preserve backward compatibility with version 0.1.2

## v0.2.0

### Changed

* Json Schema based input validation with medeia-validator-gson.
* Version script in `build.gradle` updated.
* `.gitlab-ci` uses gradlew everywhere.

## v0.1.2

### Changed

* publish script updated into the build.gradle file

[logback]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/main/resources/logback.xml
[ktor]: https://github.com/ktorio/ktor
[yavi]: https://github.com/making/yavi
[kafka-producer-record]: https://kafka.apache.org/0100/javadoc/org/apache/kafka/clients/producer/ProducerRecord.html
[default-adapter]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/main/kotlin/eu/miaplatform/rest2kafka/adapter/DefaultAdapter.kt
[http-adapter]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/test/kotlin/eu/miaplatform/rest2kafka/adapters/AdapterWithHttpRequest.kt
[test-example]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/test/kotlin/eu/miaplatform/rest2kafka/IntegrationTest.kt
[successful producer]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/main/kotlin/eu/miaplatform/rest2kafka/mocks/SuccessfulProducer.kt
[unsuccessful producer]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/main/kotlin/eu/miaplatform/rest2kafka/mocks/UnsuccessfulProducer.kt
[project props]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/-/blob/master/project.properties
[validators]: https://git.tools.mia-platform.eu/platform/libraries/rest2kafka/blob/master/src/test/kotlin/eu/miaplatform/rest2kafka/validators
[routing]: https://ktor.io/servers/features/routing.html
