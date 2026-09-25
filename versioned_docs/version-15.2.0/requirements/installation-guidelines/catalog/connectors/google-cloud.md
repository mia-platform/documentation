---
id: google-cloud
title: Google Cloud Connector
sidebar_label: Google Cloud
---

# Google Cloud Connector

The Google Cloud connector ingests cloud resources from a Google Cloud Platform organization, folder, or project into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: enumerates resources via the [Cloud Asset](https://cloud.google.com/asset-inventory/docs/overview) API and exits. Only resource metadata is retrieved (the `RESOURCE` content type) — IAM policies, org policies, and other Cloud Asset content types are not synced.
- **Run** — push-based: subscribes to a Pub/Sub subscription fed by a [Cloud Asset Feed](https://cloud.google.com/asset-inventory/docs/monitoring-asset-changes). On delete events, the emitted item carries the last-known (`priorAsset`) resource snapshot, since there is no current asset to report.

## Commands

```sh
ibdm sync gcp --mapping-file <path to mapping file or folder>
ibdm run  gcp --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Description |
| :------- | :------- | :---------- |
| `GOOGLE_CLOUD_SYNC_PARENT` | Sync | Name of the organization, folder, or project containing the resources to sync. Must be one of `organizations/{org-number}`, `folders/{folder-number}`, `projects/{project-id}`, or `projects/{project-number}`. |
| `GOOGLE_CLOUD_PUBSUB_PROJECT` | Run | Project hosting the Pub/Sub subscription. |
| `GOOGLE_CLOUD_PUBSUB_SUBSCRIPTION` | Run | Name of the Pub/Sub subscription the source consumes events from. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Optional | Path to a service-account key file, used by Application Default Credentials. |

## Authentication

The source authenticates through [Application Default Credentials (ADC)](https://docs.cloud.google.com/docs/authentication/application-default-credentials). You can supply credentials in any of the standard ADC ways, including pointing `GOOGLE_APPLICATION_CREDENTIALS` at a service-account key file. The principal must have read access to the resources you intend to ingest.

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
- [Azure Connector](/requirements/installation-guidelines/catalog/connectors/azure.md) — sibling cloud source.
