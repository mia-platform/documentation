---
id: azure-devops
title: Azure DevOps Connector
sidebar_label: Azure DevOps
---

# Microsoft Azure DevOps Connector

The Microsoft Azure DevOps connector ingests entities from an Azure DevOps organization into the Context Catalog. It runs through the [`ibdm`](/products/context-catalog/connectors/10_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the Azure DevOps REST APIs and exits.
- **Run** — push-based: exposes a webhook endpoint that receives Azure DevOps service-hook events.

## Commands

```sh
ibdm sync azure-devops --mapping-file <path to mapping file or folder>
ibdm run  azure-devops --mapping-file <path to mapping file or folder>
```

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
| `repository` | ✅ | ✅ |
| `team` | ✅ | — |

Subscribed webhook events:

- [`git.repo.created`](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#repository-created) → `repository` upsert
- [`git.repo.renamed`](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#repository-renamed) → `repository` upsert
- [`git.repo.deleted`](https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#repository-deleted) → `repository` delete

## See also

- [Connectors Overview](/products/context-catalog/connectors/10_overview.md)
