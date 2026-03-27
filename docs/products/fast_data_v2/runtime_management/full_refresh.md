---
id: full_refresh
title: Full Refresh Management
sidebar_label: Full Refresh
---

While operating with your Fast Data infrastructure, it might happen that you need to perform a re-ingestion of all the messages previously included in the system, for example, to recover from a failure or to simply ensure that all data has been processed as expected.
This process is commonly referred to as **Full Refresh**, and it can be easily achieved by improving your pipeline using the Fast Data services to manage:

* the generation of a complete backup of all the messages in the pipeline, creating a compacted and efficient snapshot of the incoming messages
* a mechanism to trigger the re-ingestion of messages from said backup into the pipeline at any point in time (even without stopping the current flow of messages in the system)
* additional logic to effectively guard the system from introducing messages about older events that have already been processed, avoiding the risk of producing redundant data or outdated data in the output streams

## Architecture

<!-- TODO -->

## Full Refresh Management using MongoDB as Backup Store

<!-- TODO -->

## Full Refresh Management using Kafka as Backup Store

<!-- TODO -->

## Additional configurations

### Dedicate specific partitions during reingestion

<!-- TODO -->

### Sandbox logic to avoid producing outdated events in the output stream

<!-- TODO -->
