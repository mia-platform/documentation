---
id: mia-platform-console
title: Mia-Platform Console Connector
sidebar_label: Mia-Platform Console
---

# Mia-Platform Console Connector

The Mia-Platform Console connector ingests data from a Mia-Platform Console instance into the Context Catalog. It runs through the [`ibdm`](./10_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the Console APIs and exits.
- **Run** — push-based: exposes a webhook endpoint that receives events from the Console.

## Commands

```sh
ibdm sync console --mapping-file <path to mapping file or folder>
ibdm run  console --mapping-file <path to mapping file or folder>
```

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
| `cluster` | ✅ | — |
| `clusterProjectRelationship` | ✅ | — |

`project` carries Console project metadata. `revision` represents a named revision of a project. `service` represents a single microservice within a project's default-branch revision — only services of type `custom` and not marked as `advanced` are emitted. `cluster` represents a Kubernetes cluster registered in the Console, fetched through the tenant/cluster APIs; the `linkedProjects` field is stripped from the payload. `clusterProjectRelationship` emits one relationship entry per project listed in a cluster's `linkedProjects`, carrying both the project and the cluster data as template values.

## See also

- [Connectors Overview](./10_overview.md)
