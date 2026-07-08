---
id: azure
title: Azure Connector
sidebar_label: Azure
---

# Microsoft Azure Connector

The Microsoft Azure connector ingests cloud resources from an Azure subscription into the Catalog. It runs through the [`ibdm`](/products/catalog/connectors/10_overview.md) binary in one of two modes:

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
| `AZURE_STORAGE_BLOB_CONTAINER_NAME` | Run mode | Blob container name inside the Storage Account. Always required in Run mode — unlike the EventHub name, a Storage Account connection string cannot embed the container name, so this variable is needed regardless of which storage auth method you use. |

Using the `*_CONNECTION_STRING` variables is the preferred approach: it lets you grant the source the least privileges needed to access the REST APIs.

## Authentication

The source uses the [`DefaultAzureCredential` chain](https://learn.microsoft.com/en-gb/azure/developer/go/sdk/authentication/credential-chains#defaultazurecredential-overview), so you can pick the login method that best fits your deployment (managed identity, service principal via environment variables, Azure CLI, …). The principal must have read permissions on the resources you intend to import. When `*_CONNECTION_STRING` is not used, the same chain authenticates against EventHub and the Storage Account.

## Setting up Run mode

Run mode does not connect to Azure directly for change notifications — it consumes CloudEvents-wrapped Azure Event Grid **system events** relayed through EventHub:

1. Create an [Event Grid system topic](https://learn.microsoft.com/en-us/azure/event-grid/system-topics) subscribed to your Azure subscription's resource events.
2. Add an event subscription on that topic with EventHub as the endpoint, filtered to (at least) the `Microsoft.Resources.ResourceWriteSuccess` and `Microsoft.Resources.ResourceDeleteSuccess` event types — these are the only two event types `ibdm` acts on; anything else is ignored.
3. Point `AZURE_EVENT_HUB_*` at that EventHub, as described above.

On a `ResourceWriteSuccess` event, `ibdm` re-fetches the resource via the ARM `GetByID` API (using the `apiVersion` extra for that type) and emits an upsert; on `ResourceDeleteSuccess` it emits a delete. The resource type and ID are parsed from the CloudEvent's `Subject` field.

Each resource type declared in the mapping file must also declare an `apiVersion` extra (the [Azure Resource Manager](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types) API version used to re-fetch that resource on a change event). A type without an `apiVersion` extra is silently skipped when a matching event arrives.

## See also

- [Connectors Overview](/products/catalog/connectors/10_overview.md)
- [Google Cloud Connector](/products/catalog/connectors/google-cloud.md) — sibling source for GCP.
