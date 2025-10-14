---
id: overview
title: Processors
sidebar_label: Overview
---



In this section, there will be the processors available to be used to transform data
in the Integration Connector Agent.

If no processor are set in the configuration, the data will be sent to the sink as it is in input.

Each iteration of the processor will be applied to the data on the last iteration output.

The supported processors are:

- [**Filter**](/runtime_suite/integration-connector-agent/processors/15_filter.md): Filter the event based on a condition. If the event is filtered,
it will not be sent to the sink.
- [**Mapper**](/runtime_suite/integration-connector-agent/processors/20_mapper.md): Transform the data to an output event, based on the input.
