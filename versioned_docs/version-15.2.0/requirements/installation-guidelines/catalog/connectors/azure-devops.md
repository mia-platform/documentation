---
id: azure-devops
title: Azure DevOps Connector
sidebar_label: Azure DevOps
---

# Microsoft Azure DevOps Connector

The Microsoft Azure DevOps connector ingests entities from an Azure DevOps organization into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the Azure DevOps REST APIs and exits.
- **Run** — push-based: exposes a webhook endpoint that receives Azure DevOps service-hook events.

## Commands

```sh
ibdm sync azure-devops --include-internal-mappings=all
ibdm run  azure-devops --include-internal-mappings=all
```

The commands use every internal mapping of the source. To select only some of them, or to add mappings of your own, see [Mappings](/requirements/installation-guidelines/catalog/connectors/00_overview.md#mappings).

## Configuration

| Variable | Required | Description |
| :------- | :------- | :---------- |
| `AZURE_DEVOPS_ORGANIZATION_URL` | Sync | URL of the Azure DevOps organization. |
| `AZURE_DEVOPS_PERSONAL_TOKEN` | Sync | Personal Access Token of a user in the organization (read scopes on the resources to ingest). |
| `AZURE_DEVOPS_WEBHOOK_PATH` | Optional | Path of the webhook handler. Defaults to `/azure-devops/webhook`. |
| `AZURE_DEVOPS_WEBHOOK_USER` | Optional | Optional username for HTTP Basic Auth on the webhook endpoint. |
| `AZURE_DEVOPS_WEBHOOK_PASSWORD` | Optional | Optional password for HTTP Basic Auth on the webhook endpoint. |

When `AZURE_DEVOPS_WEBHOOK_USER` is set, `AZURE_DEVOPS_WEBHOOK_PASSWORD` becomes required, and the same values must be configured on the Azure DevOps side when registering the webhook.

## Authentication

Requests against the Azure DevOps REST API are authenticated with the Personal Access Token in `AZURE_DEVOPS_PERSONAL_TOKEN`. The token needs read permissions on the resources you intend to access.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `gitrepository` | ✅ | ✅ |
| `team` | ✅ | — |

Subscribed webhook events:

- [`git.repo.created`](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#repository-created) → `gitrepository` upsert
- [`git.repo.renamed`](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#repository-renamed) → `gitrepository` upsert
- [`git.repo.deleted`](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#repository-deleted) → `gitrepository` delete

## Internal mappings

`ibdm mappings list azure-devops` prints the internal mappings of this source, and the [Internal Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/reference/20_internal-mappings.md#azure-devops) reference lists the Item Type each one writes.

| Internal mapping | Sync | Webhook |
| :--------------- | :--- | :------ |
| `gitrepositories` | ✅ | ✅ on the events listed in its `extra.eventNames`: `git.repo.created`, `git.repo.renamed`, `git.repo.deleted` |
| `teams` | ✅ | — it lists no `eventNames` |

The two mappings are independent, and neither creates relationships to the other. The webhook events a mapping reacts to are the ones listed in its `extra.eventNames`: an external mapping of type `gitrepository` can list its own.

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
