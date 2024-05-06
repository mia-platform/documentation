---
id: overview
title: Kafka to REST (Kafka2Rest)
sidebar_label: Overview
---
This is a microservice which enables the conversion of Kafka messages into REST HTTP requests
that are executed towards configured targets.

In particular, the service listen on configured Kafka topics and when a message arrives
it uses its key and payload to compute the endpoint path and the request body to be employed
in the POST HTTP call to the associated target server.

The service can prepare request data using a functions provided at during its configuration.
