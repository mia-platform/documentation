---
id: azure
title: Azure Connector
sidebar_label: Azure
---

# Microsoft Azure Connector

The Microsoft Azure connector ingests cloud resources from an Azure subscription into the Context Catalog. It runs through the [`ibdm`](/products/context-catalog/connectors/10_overview.md) binary in one of two modes:

- **Sync** — pull-based: enumerates resources via the [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/) APIs and exits.
- **Run** — push-based: subscribes to Azure subscription events through Azure EventHub and reacts in near real time.

## Commands

```sh
ibdm sync azure --mapping-file <path to mapping file or folder>
ibdm run  azure --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Description |
| :------- | :------- | :---------- |
| `AZURE_SUBSCRIPTION_ID` | Always | Azure subscription id used for all REST API calls. |
| `AZURE_EVENT_HUB_CONNECTION_STRING` | Run mode | Connection string of the EventHub that relays subscription events. |
| `AZURE_EVENT_HUB_NAMESPACE` | Run mode (alt.) | Fully qualified name of the EventHub namespace. Not needed if `AZURE_EVENT_HUB_CONNECTION_STRING` is set. |
| `AZURE_EVENT_HUB_NAME` | Run mode (alt.) | EventHub name. Not needed if `AZURE_EVENT_HUB_CONNECTION_STRING` is set. |
| `AZURE_EVENT_HUB_CONSUMER_GROUP` | Optional | Consumer group name. Defaults to `$Default`. |
| `AZURE_STORAGE_BLOB_CONNECTION_STRING` | Run mode | Connection string of an Azure Storage Account whose blob container is used as EventHub checkpoint storage. |
| `AZURE_STORAGE_BLOB_ACCOUNT_NAME` | Run mode (alt.) | Storage account name. Not needed if `AZURE_STORAGE_BLOB_CONNECTION_STRING` is set. |
| `AZURE_STORAGE_BLOB_CONTAINER_NAME` | Run mode (alt.) | Blob container name inside the Storage Account. |

Using the `*_CONNECTION_STRING` variables is the preferred approach: it lets you grant the source the least privileges needed to access the REST APIs.

## Authentication

The source uses the [`DefaultAzureCredential` chain](https://learn.microsoft.com/en-gb/azure/developer/go/sdk/authentication/credential-chains#defaultazurecredential-overview), so you can pick the login method that best fits your deployment (managed identity, service principal via environment variables, Azure CLI, …). The principal must have read permissions on the resources you intend to import. When `*_CONNECTION_STRING` is not used, the same chain authenticates against EventHub and the Storage Account.

## See also

- [Connectors Overview](/products/context-catalog/connectors/10_overview.md)
- [Google Cloud Connector](/products/context-catalog/connectors/google-cloud.md) — sibling source for GCP.
