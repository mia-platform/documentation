---
id: configuration
title: Configuration
sidebar_label: Configuration
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

In order to configure the Teleconsultation Service with the console you need to deploy two services: the Teleconsultation Service Backend and the Teleconsultation Service Frontend. Both are available in the marketplace.

Configure the Teleconsultation Service Backend following [this guide][teleconsultation-service-be] before using the Teleconsultation Service Frontend.

## Endpoint configuration

In order to make the route accessible to the page where the teleconsultation will take place, you need to create an additional **endpoint** to expose that route.

Example:
1. Custom **endpoint** to expose teleconsultation-service-fe: `/telecons-fe`

[teleconsultation-service-be]: ../teleconsultation-service-backend/overview
