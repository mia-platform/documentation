---
id: sysdig
title: Sysdig Connector
sidebar_label: Sysdig
---

# Sysdig Connector

The **Sysdig connector** ingests security and runtime-monitoring data from a Sysdig Secure / Monitor instance into the Context Catalog, so that vulnerability findings, posture results, and runtime alerts can be correlated with the rest of your platform inventory.

## What it ingests

Typical ingested entities include:

- **Vulnerability scan results**: the catalog of CVEs detected on the container images and hosts your environments rely on, with severity and remediation status.
- **Posture / compliance findings**: the results of Sysdig's posture checks (CIS, NIST, custom policies) per scanned target.
- **Policies and policy events**: runtime policies and the alerts generated when they are violated.
- **Scanned assets**: images, hosts, and Kubernetes workloads that Sysdig has analyzed.

Each entity becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model to capture additional Sysdig fields.

## Authentication

The connector authenticates via:

- an **API token** issued by your Sysdig account, with read access to the data sources you want to ingest.

The connector also needs the regional endpoint of your Sysdig instance. Credentials are stored as secrets at the company level.

## How synchronization works

- **Initial sync.** Enumerates the configured data sources through the Sysdig API and creates a catalog item for every finding, asset, and policy discovered.
- **Incremental sync.** Reconciles the catalog with Sysdig on a schedule, applying creations, updates, and resolutions/closures.
- **Event-driven updates.** When configured with Sysdig notification channels, the connector reacts to new alerts and posture results and refreshes affected items in near real time.

## Relationships

Out of the box the connector creates relationships such as:

- *Vulnerability → Image / Workload* (affects),
- *Policy event → Workload* (originates from),
- *Posture finding → Asset* (applies to).

These relationships are particularly useful in compliance scenarios: combined with [Evaluation Criteria](../basic-concepts/30_evaluation-criteria.md), they let you express rules like "no production service may have an unresolved critical vulnerability".

## See also

- [Items](../basic-concepts/10_items.md)
- [Evaluation Criteria](../basic-concepts/30_evaluation-criteria.md)
- [API Interactions](../api-interactions.md)
