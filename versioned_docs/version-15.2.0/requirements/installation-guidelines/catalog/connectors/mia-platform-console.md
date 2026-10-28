---
id: mia-platform-console
title: Mia-Platform Console Connector
sidebar_label: Mia-Platform Console
---

# Mia-Platform Console Connector

The Mia-Platform Console connector ingests data from a Mia-Platform Console instance into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the Console APIs and exits.
- **Run** — push-based: exposes a webhook endpoint that receives events from the Console.

## Commands

```sh
ibdm sync console --include-internal-mappings=all
ibdm run  console --include-internal-mappings=all
```

The commands use every internal mapping of the source. To select only some of them, or to add mappings of your own, see [Mappings](/requirements/installation-guidelines/catalog/connectors/00_overview.md#mappings).

## Configuration

### Webhook server (run mode)

| Variable | Description |
| :------- | :---------- |
| `HTTP_HOST` | Host the server binds to. |
| `HTTP_PORT` | Port the server binds to. |
| `CONSOLE_WEBHOOK_PATH` | Path where webhooks are received. Defaults to `/console/webhook`. |
| `CONSOLE_WEBHOOK_SECRET` | Shared secret used to validate the `X-Mia-Signature` header on inbound webhooks. |

### Console API (sync mode)

| Variable | Description |
| :------- | :---------- |
| `CONSOLE_ENDPOINT` | Base API URL of the Console (required). Must include the API path prefix, e.g. `https://console.example.com/api`. |

#### Authentication: Client Credentials

| Variable | Description |
| :------- | :---------- |
| `CONSOLE_CLIENT_ID` | Client ID issued by the Console. |
| `CONSOLE_CLIENT_SECRET` | Client Secret issued by the Console. |
| `CONSOLE_AUTH_ENDPOINT` | Optional override of the token endpoint. Defaults to `<CONSOLE_ENDPOINT>/m2m/oauth/token`. |

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `project` | ✅ | ✅ |
| `revision` | ✅ | ✅ |
| `service` | ✅ | ✅ |
| `custom-resource` | ✅ | ✅ |
| `cluster` | ✅ | — |
| `clusterProjectRelationship` | ✅ | — |

`project` carries Console project metadata. `revision` represents a named revision of a project. `service` represents a single microservice within a project's default-branch revision — only services of type `custom` and not marked as `advanced` are emitted. `custom-resource` represents a custom resource within a project's default-branch revision — only services of type `custom-resource` are emitted. `cluster` represents a Kubernetes cluster registered in the Console, fetched through the tenant/cluster APIs; the `linkedProjects` field is stripped from the payload. `clusterProjectRelationship` emits one relationship entry per project listed in a cluster's `linkedProjects`, carrying both the project and the cluster data as template values.

`service.dockerImage` is normalized so it always carries an explicit tag: if the image reference has no tag and no `@digest`, `ibdm` appends `:latest` before emitting the item.

### Webhook events

`project` webhook updates are a direct pass-through of the Console's `project_*` event payload. `revision`, `service` and `custom-resource` updates, however, are not driven by dedicated events — they are triggered by the Console's `configuration_*` events, and on receipt `ibdm` calls back into the Console API (fetching the full project and the full configuration) to rebuild the `revision`, `service` and `custom-resource` items, rather than using the webhook payload directly.

The operation (upsert vs delete) is inferred from the event name itself: any event name ending in `deleted` or `removed` (case-insensitive) is treated as a delete; every other event is an upsert. There is no separate `action` field as in some other connectors' webhook payloads.

## Internal mappings

`ibdm mappings list console` prints the internal mappings of this source, and the [Internal Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/reference/20_internal-mappings.md#console) reference lists the Item Type each one writes.

| Internal mapping | Sync | Webhook | Its relationships point at |
| :--------------- | :--- | :------ | :------------------------- |
| `projects` | ✅ | ✅ on project and configuration events | — |
| `revisions` | ✅ every revision of every project | ✅ on configuration events | `projects` |
| `services` | ✅ default-branch revision only | ✅ on configuration events of the default branch | `projects`, `revisions`, and the `dockerimages` of the [Nexus connector](/requirements/installation-guidelines/catalog/connectors/nexus.md) |
| `custom-resources` | ✅ default-branch revision only | ✅ on configuration events of the default branch | `projects`, `revisions` |
| `clusters` | ✅ | — | — |
| `cluster-project-relationships` | ✅ | — | `clusters`, `projects` |

The sync walks the projects, their revisions and configurations as soon as one of `projects`, `revisions`, `services` or `custom-resources` is selected, and the clusters of every tenant when `clusters` or `cluster-project-relationships` is selected. Clusters and their relationships are only produced by `ibdm sync console`, and configuration events are only handled when `revisions`, `services` or `custom-resources` is selected.

A relationship can point at an item that nothing creates: selecting `services` without `projects` and `revisions` creates relationships towards project and revision items that do not exist, and the relationships towards Docker images only resolve when the Nexus connector publishes them. The Catalog accepts such relationships without error.

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
