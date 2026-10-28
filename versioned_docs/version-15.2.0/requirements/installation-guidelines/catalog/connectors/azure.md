---
id: azure
title: Azure Connector
sidebar_label: Azure
---

# Microsoft Azure Connector

The Microsoft Azure connector ingests cloud resources from an Azure subscription into the Catalog. It now also maps **Azure API Management (APIM)** instances and **Azure Notification Hub** resources (namespaces and individual hubs, linked via a relationship) into the Catalog, alongside the resource types already supported; the mapping for **Azure Function** resources has also been reworked. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: enumerates resources via the [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/) APIs and exits.
- **Run** — push-based: subscribes to Azure subscription events through Azure EventHub and reacts in near real time.

## Commands

```sh
ibdm sync azure --include-internal-mappings=all
ibdm run  azure --include-internal-mappings=all
```

The commands use every internal mapping of the source. To select only some of them, or to add mappings of your own, see [Mappings](/requirements/installation-guidelines/catalog/connectors/00_overview.md#mappings).

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

Every mapping of an Azure resource type carries an `apiVersion` extra: the [Azure Resource Manager](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types) API version used to re-fetch that resource. The internal mappings already declare it; an external mapping must declare it too, quoted as in `apiVersion: "2025-03-01"`, or its type is skipped when a matching event arrives. An external mapping declaring a different `apiVersion` from the internal mapping of its type makes the source fetch the resource once per version.

## Internal mappings

`ibdm mappings list azure` prints the internal mappings of this source, and the [Internal Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/reference/20_internal-mappings.md#azure) reference lists the Item Type each one writes.

The source ships one internal mapping per supported Azure resource type, such as `resourcegroups`, `virtualmachines`, `storageaccounts` or `websites`, plus `websites_functionapps`, which produces a Function App item for each site whose `kind` carries the `functionapp` token, related to the item of its site: it only produces items when `websites` is selected too. Each mapping is independent otherwise: the sync queries the Azure Resource Graph for the resource types of the selected mappings only, and the EventHub stream keeps the events of those types. The relationships between Notification Hubs and their namespaces resolve only when both `notificationhubs_namespaces` and `notificationhubs_notificationhubs` are selected. `managedclusters` also relates each AKS cluster to the cluster item of the [Mia-Platform Console connector](/requirements/installation-guidelines/catalog/connectors/mia-platform-console.md) whose connection URL is the FQDN of the AKS cluster. It only resolves when that connector publishes its clusters. See the [Azure source documentation](https://github.com/mia-platform/ibdm/blob/main/docs/how-to/030_azure-source.md) of `ibdm` for the details.

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
- [Google Cloud Connector](/requirements/installation-guidelines/catalog/connectors/google-cloud.md) — sibling source for GCP.
