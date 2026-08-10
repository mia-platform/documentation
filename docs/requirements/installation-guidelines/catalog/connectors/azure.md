---
id: azure
title: Azure Connector
sidebar_label: Azure
---

# Microsoft Azure Connector

The Microsoft Azure connector ingests cloud resources from an Azure subscription into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

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

The source uses the [`DefaultAzureCredential` chain](https://learn.microsoft.com/en-gb/azure/developer/go/sdk/authentication/credential-chains#defaultazurecredential-overview), so you can setup your preferred method of login.  
This authentication will be used for reading data from the REST APIs so it will need the read permissions on the resources you want to import.
Both `sync` and `run` modes use APIs to fetch the full resource, for this reason an authentication method of choice is always needed.
When `*_CONNECTION_STRING` is not used, the same chain authenticates against EventHub and the Storage Account.

## Setting up Run mode

Run mode does not connect to Azure directly for change notifications — it consumes CloudEvents-wrapped Azure Event Grid **system events** relayed through EventHub:

1. Create an [Event Grid system topic](https://learn.microsoft.com/en-us/azure/event-grid/system-topics) subscribed to your Azure subscription's resource events.
2. Add an event subscription on that topic with EventHub as the endpoint, filtered to (at least) the `Microsoft.Resources.ResourceWriteSuccess` and `Microsoft.Resources.ResourceDeleteSuccess` event types — these are the only two event types `ibdm` acts on; anything else is ignored.
3. Point `AZURE_EVENT_HUB_*` at that EventHub, as described above.

On a `ResourceWriteSuccess` event, `ibdm` re-fetches the resource via the ARM `GetByID` API (using the `apiVersion` extra for that type) and emits an upsert; on `ResourceDeleteSuccess` it emits a delete. The resource type and ID are parsed from the CloudEvent's `Subject` field.

Each resource type declared in the mapping file must also declare an `apiVersion` extra (the [Azure Resource Manager](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types) API version used to re-fetch that resource on a change event). A type without an `apiVersion` extra is silently skipped when a matching event arrives.

## Resource identifiers

Microsoft Azure does not guarantee the letter case of the resource IDs it returns: the same resource can arrive with `resourceGroups` from the Resource Graph APIs and with `resourcegroups` from the resource provider that answers the EventHub driven read.
The provider and type segments vary in the same way.
Because the mappings hash the ID to build the Catalog identifier, every casing difference would create a duplicate item instead of updating the existing one.

To prevent that, the source normalizes every resource before handing it to the mapper:

- `id` is lowercased in full
- `type` is set to the resource type exactly as the mapping file declares it

The two values are therefore identical for Sync and Run mode, which makes `{{ .id | sha256sum }}` a stable identifier and lets a delete event target the item a previous import created.

Azure itself points in this direction: various APIs can return names with different casing, so a case-insensitive comparison is recommended in order to perform meaningful matches.
See [Naming rules and restrictions for Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules) for a more in-depth explanation.

### Consequences for the mappings and items

`id` is lowercase and could no longer match the casing shown in the Azure portal.
Use `.name` wherever available when display casing matters — its availability depends on the specific resource APIs.
The spelling Azure reported, if needed, is written to the source logs at `Debug` level whenever it differs from the normalized value.

## Resource sub-types

Some Azure resource types describe more than one thing: a `Microsoft.Web/sites` resource is an App Service site, but when its `kind` carries the `functionapp` token it is also a Function App.

For these types the source produces, out of one Azure resource, both the item of the resource itself and one or more **sub-type** items, each described by its own mapping file and related to the item of the resource it was derived from.
A sub-type is always additive: the item of the Azure resource is produced exactly as it was before, and the sub-type item is created next to it together with a relationship pointing at it.

Which Azure type produces which sub-type is hardcoded in the source, together with the check deciding whether a retrieved resource must produce it.
A sub-type can therefore never be introduced by configuration alone: it takes both a new mapping file and a change to `ibdm` itself.
In a sub-type mapping file the `type` field is an internal dispatch key rather than an Azure provider type — it is never sent to Azure, never matched against the resource type of an event, and its `apiVersion` extra is never read, because the resource is always retrieved with the `apiVersion` of its parent type.

### The sub-types shipped with ibdm

| Azure type | Sub-type mapping | Produced when |
| :--------- | :--------------- | :------------ |
| `Microsoft.Web/sites` | `websites_functionapps.yaml` — `type: functionapps` | the `kind` of the site carries the `functionapp` token |

`kind` is a comma separated list of tokens, such as `app`, `app,linux` or `functionapp,linux`, and the tokens are compared one by one: a site whose kind is `myfunctionapp` is not a Function App.
A site without a usable `kind` produces no sub-type and nothing fails.

The mapping creates a `functionapps` item and, through its `extra` section, a `dependency` relationship from that item to the `websites` item of the same site.

Both mapping files must be loaded for the sub-type to be produced:

- loading `websites.yaml` alone reproduces exactly the behaviour the source had before sub-types existed, deletion included;
- loading `websites_functionapps.yaml` alone can never produce anything, so the source logs a warning when it starts and carries on.

Sync and Run mode behave identically here, because the check runs on the payload the Azure APIs returned and is indifferent to which of them retrieved it.
To adopt a sub-type on an already imported subscription, load both mapping files and run `ibdm sync azure` once: every site that already exists gets its sub-type item and its relationship.
These are the reference links for [`mappings`](https://github.com/mia-platform/ibdm/tree/main/docs/mappings/azure) and [`docs`](https://github.com/mia-platform/ibdm/blob/main/docs/how-to/030_azure-source.md) of Azure Source in ibdm.

### Deleting a resource that has sub-types

`Microsoft.Resources.ResourceDeleteSuccess` carries only the id of the deleted resource.
Its `kind` is gone and no API can return it any more, so at deletion time the check cannot run: the source deletes the item of the resource **and the item of every sub-type its type can produce**, whether or not that resource ever produced it.

For a `Microsoft.Web/sites` resource with both mapping files loaded, three deletions reach the Catalog:

| Deleted | Why |
| :------ | :-- |
| the `websites` item | the resource itself |
| the `functionapps` item | the only sub-type configured for its type |
| the relationship of the `functionapps` item | its `deletePolicy` is `cascade` |

A deletion addressed to a sub-type item the resource never produced is inert: the Catalog publish reports no per item outcome, so nothing fails and nothing is left behind.
The identifier of a sub-type item also lives in its own namespace — `functionapps-<resource id>` for the Function Apps — so such a deletion can only ever name the sub-type item of that very resource.

Removing a sub-type mapping file is not the reverse operation: the items it already published stop being updated and stop being deleted together with their resource, so they have to be removed by hand.

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
- [Google Cloud Connector](/requirements/installation-guidelines/catalog/connectors/google-cloud.md) — sibling source for GCP.
