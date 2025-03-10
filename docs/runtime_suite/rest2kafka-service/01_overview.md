---
id: overview
title: REST to Kafka (Rest2Kafka)
sidebar_label: Overview
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

This is a microservice which enables the conversion of REST HTTP requests into messages
produced on Kafka topics.

In particular, the service exposes configurable POST HTTP endpoints whose requests
payload is then extracted, validated and employed to construct a Kafka message which is
published on the topic associated to the called endpoint.

:::note
This service publish incoming requests' payload as is, so that no processing nor
transformation is applied to messages. Please consider this fact while configuring the service.
:::
