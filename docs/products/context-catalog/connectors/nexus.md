---
id: nexus
title: Nexus Connector
sidebar_label: Nexus
---

# Sonatype Nexus Connector

The Nexus connector ingests Docker image components from a [Sonatype Nexus Repository Manager](https://help.sonatype.com/en/automation.html#rest-api) instance into the Context Catalog. It runs through the [`ibdm`](./10_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the Nexus REST API and exits.
- **Run** — push-based: exposes a webhook endpoint that receives Nexus repository component events.

The source operates on Docker repositories only — non-Docker components are skipped in both modes.

## Commands

```sh
ibdm sync nexus --mapping-file <path to mapping file or folder>
ibdm run  nexus --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `NEXUS_URL_SCHEMA` | Yes | _(empty)_ | URL scheme of the Nexus instance (e.g. `https`). |
| `NEXUS_URL_HOST` | Yes | _(empty)_ | Hostname (and optional port) of the Nexus instance (e.g. `nexus.example.com`). No scheme, no trailing slash. |
| `NEXUS_TOKEN_NAME` | Yes | _(empty)_ | First part of a [Nexus user token](https://help.sonatype.com/en/user-tokens.html). Sent as the HTTP Basic Auth username. |
| `NEXUS_TOKEN_PASSCODE` | Yes | _(empty)_ | Second part of the user token. Sent as the HTTP Basic Auth password. |
| `NEXUS_HTTP_TIMEOUT` | No | `30s` | HTTP request timeout (Go duration). |
| `NEXUS_SPECIFIC_REPOSITORY` | No | _(empty)_ | Restrict sync to a single repository. When empty, all repositories are iterated. |
| `NEXUS_WEBHOOK_SECRET` | No | _(empty)_ | HMAC-SHA1 secret for inbound webhook signature validation. When unset, signature validation is disabled. |
| `NEXUS_WEBHOOK_PATH` | No | `/nexus/webhook` | HTTP path for inbound webhook events. |

## Authentication

`ibdm` authenticates with [Nexus user tokens](https://help.sonatype.com/en/user-tokens.html) via HTTP Basic Auth: `NEXUS_TOKEN_NAME` is sent as the username and `NEXUS_TOKEN_PASSCODE` as the password. The token must have read permissions on the repositories and components you intend to synchronize.

To create a user token, open your Nexus user profile, select **User Token**, click **Access user token**, and copy both halves.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `dockerimage` | ✅ | ✅ |

Each `dockerimage` item corresponds to a Docker component. It exposes component-level fields (`host`, `name`, `version`, `repository`, `format`, `tags`) plus an `assets` array carrying every asset of that component (accessible in mappings via `{{ .assets }}`). Components with no assets are skipped.

## Webhook events

The listener only processes events whose `X-Nexus-Webhook-Id` is `rm:repository:component`. All other events are silently ignored.

| Action | Operation | Behavior |
| :----- | :-------- | :------- |
| `CREATED` | Upsert | Fetches full component details from the REST API and emits a `dockerimage` per asset. Failures are logged and skipped. |
| `UPDATED` | Upsert | Same as `CREATED`. |
| `DELETED` | Delete | Emits a `dockerimage` delete using `host`, `name`, and `version` from the webhook payload (no API call). |

The event time recorded on each emitted item is taken from the webhook payload's `timestamp` field (RFC 3339). Events with a missing or unparsable timestamp are skipped.

### Signature validation

When `NEXUS_WEBHOOK_SECRET` is set, each request is verified against the `X-Nexus-Webhook-Signature` header (HMAC-SHA1). Requests with missing or invalid signatures are rejected. When `NEXUS_WEBHOOK_SECRET` is empty, all requests are accepted — useful for internal deployments protected at the network level.

To make Nexus sign requests, configure the **Secret Key** field when registering the webhook in the Nexus administration UI.

## Example mappings

Reference mapping files live in [`docs/examples/nexus/mappings/`](https://github.com/mia-platform/ibdm/tree/main/docs/examples/nexus/mappings) of the `ibdm` repository:

- `dockerimages.yaml` — map Docker image assets to Catalog items.

```sh
ibdm sync nexus --mapping-file docs/examples/nexus/mappings/
```

## See also

- [Connectors Overview](./10_overview.md)
