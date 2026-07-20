---
id: bitbucket
title: Bitbucket Connector
sidebar_label: Bitbucket
---

# Bitbucket Connector

The Bitbucket connector ingests data from [Bitbucket Cloud](https://bitbucket.org/) into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the Bitbucket REST API and exits.
- **Run** — push-based: exposes a webhook endpoint that receives Bitbucket events.

## Commands

```sh
ibdm sync bitbucket --mapping-file <path to mapping file or folder>
ibdm run  bitbucket --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `BITBUCKET_ACCESS_TOKEN` | One auth mode | — | Bitbucket access token for Bearer auth (workspace, project, or repository scope). |
| `BITBUCKET_API_USERNAME` | One auth mode | — | Username for HTTP Basic Authentication. |
| `BITBUCKET_API_TOKEN` | One auth mode | — | App password / access token for Basic Auth. |
| `BITBUCKET_URL` | No | `https://api.bitbucket.org` | Base URL of the Bitbucket API. |
| `BITBUCKET_HTTP_TIMEOUT` | No | `30s` | Timeout for HTTP requests (Go duration). |
| `BITBUCKET_WORKSPACE` | No | _(empty)_ | Restrict sync to a single workspace slug. When empty, `ibdm` enumerates all accessible workspaces. |
| `BITBUCKET_WEBHOOK_SECRET` | Run | _(empty)_ | HMAC secret for webhook signature validation. |
| `BITBUCKET_WEBHOOK_PATH` | No | `/bitbucket/webhook` | HTTP path for inbound webhook events. |

## Authentication

Bitbucket supports two **mutually exclusive** authentication modes. Setting both is a configuration error.

- **Bearer Token** — set `BITBUCKET_ACCESS_TOKEN`. Sent as `Authorization: Bearer <token>`.
- **Basic Auth** — set both `BITBUCKET_API_USERNAME` and `BITBUCKET_API_TOKEN`. Sent as HTTP Basic Authentication.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `repository` | ✅ | ✅ |
| `pipeline` | ✅ | — |

Subscribed webhook events:

| Event key | Produces |
| :-------- | :------- |
| `repo:push` | `repository` upsert |
| `repo:updated` | `repository` upsert |
| `pullrequest:fulfilled` | `repository` upsert |

## Setting up a Bitbucket webhook

1. In the Bitbucket repository or workspace, go to **Repository settings → Webhooks → Add webhook**.
2. Set **URL** to your public `ibdm` URL followed by `BITBUCKET_WEBHOOK_PATH` (default `/bitbucket/webhook`).
3. Set **Secret** to the value of `BITBUCKET_WEBHOOK_SECRET`. Bitbucket signs the payload as `X-Hub-Signature: sha256=<hex-hmac>`; `ibdm` rejects requests with a missing or invalid signature.
4. Under **Triggers**, select the events that match the data you want: **Repository → Push**, **Repository → Updated**, and **Pull request → Merged** (these deliver the `repo:push`, `repo:updated`, and `pullrequest:fulfilled` event keys respectively).

## See also

- [Connectors Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
