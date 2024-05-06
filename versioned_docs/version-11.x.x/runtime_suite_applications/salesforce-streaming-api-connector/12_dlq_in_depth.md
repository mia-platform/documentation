---
id: dlq_in_depth
title: Salesforce Connector DLQ Service
sidebar_label: Dlq in depth
---
## Description

This service consumes all messages from the DLQ topic defined in the Connector Service. It tries to extract the id of
the record(s) involved and queries Salesforce REST APIs to get the record itself. It then processes the response and
sends the result to the correct kafka projection topic.

Some topics might use a different naming convention than the actual record saved in the database. In such case, you can
use a yaml configuration file to specify how to map some fields to their projection counterparts. This file is optional
and any table or property not defined will be treated as if no mapping is necessary.

This service requires less configuration than the Connector Service because most of it is sent directly to the DLQ,
together with the failed message.
This also means that you need to pay attention to the way you configure the Connector Service, as errors in its yaml
configuration file will result in irrecoverable messages on the DLQ side.

## Pre-Requisites

:::caution You need to give the `operation describeconfigs` permission to your kafka user for the `cluster`
resource, otherwise the health check won't work and the service won't be stay up.:::
