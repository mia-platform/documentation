---
id: microlc_configuration
title: Microlc configuration
sidebar_label: Microlc configuration
---

:::caution
In this section we are going to define how the configuration of `microlc` differ from the standard one.

If you don't have a running instance of `microlc`, or you need a new one, 
please refer to [microlc documentation](../business_suite/microlc/setup.md) for the basic setup.
:::

### Configuration for `be-config`

For the `be-config` microservice, you must edit:
- The endpoint, that must have a `Base path` equals to `/api`;
- The `SERVICE_PREFIX` variable in the microservice, that must be equal to `/v1/microlc/`.

### Configuration for `fe-container`

For the `fe-container` microservice, you must edit only the endpoint, that must have a `Base path` equals to `/`.
