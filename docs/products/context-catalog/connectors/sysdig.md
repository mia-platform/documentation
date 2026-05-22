---
id: sysdig
title: Sysdig Connector
sidebar_label: Sysdig
---

# Sysdig Secure Connector

The Sysdig connector ingests container-image vulnerability data from [Sysdig Secure](https://sysdig.com/) into the Context Catalog. It runs through the [`ibdm`](/products/context-catalog/connectors/10_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the [Sysdig SysQL API](https://docs.sysdig.com/en/sysdig-secure/sysql/) for all image vulnerabilities and exits.
- **Run** — push-based: exposes a webhook endpoint that receives pipeline scan failure notifications, calls the Sysdig Vulnerability API to retrieve the full result, and forwards each vulnerability to the Catalog.

## Commands

```sh
ibdm sync sysdig --mapping-file <path to mapping file or folder>
ibdm run  sysdig --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `SYSDIG_URL` | Sync | _(empty)_ | Base URL of the Sysdig Secure instance (e.g. `https://secure.sysdig.com`). |
| `SYSDIG_API_TOKEN` | Sync | _(empty)_ | API bearer token for the SysQL API. |
| `SYSDIG_HTTP_TIMEOUT` | No | `30s` | HTTP request timeout (Go duration). |
| `SYSDIG_PAGE_SIZE` | No | `1000` | Items per SysQL query page (1–1000). |
| `SYSDIG_BASE_URL` | Run | _(empty)_ | Base URL of the Sysdig Vulnerability API for the account's region (see below). |
| `SYSDIG_BEARER_TOKEN` | Run | _(empty)_ | Bearer token for the Vulnerability API. |
| `SYSDIG_WEBHOOK_URL` | No | `/sysdig/webhook` | HTTP path for inbound webhook events. |

### Region base URLs

`SYSDIG_BASE_URL` must match the region of your Sysdig account:

| Region | Base URL |
| :----- | :------- |
| US East | `https://app.sysdigcloud.com` |
| US West | `https://us2.app.sysdig.com` |
| EU | `https://eu1.app.sysdig.com` |
| AP (Australia) | `https://app.au1.sysdig.com` |

## Authentication

- **Sync** — authenticates with the SysQL API via `Authorization: Bearer <SYSDIG_API_TOKEN>`.
- **Run** — authenticates with the Vulnerability API via `Authorization: Bearer <SYSDIG_BEARER_TOKEN>` on every enrichment request.

Inbound webhooks from Sysdig carry no signature, so no shared secret is required on the listener.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `vulnerability` | ✅ | ✅ |

## Webhook events

`ibdm` processes Sysdig webhook notifications whose `event.id` **or** `event.eventData.name` is `Pipeline Failure Alerts`. All other events are silently ignored.

| Event | Produces |
| :---- | :------- |
| `Pipeline Failure Alerts` | one `vulnerability` upsert per vulnerability in the scan |

When a matching notification arrives, the source:

1. Extracts the result ID from the `event.url` field (the segment between `results/` and `/overview`).
2. Calls `GET /secure/vulnerability/v1beta1/results/{resultId}` on `SYSDIG_BASE_URL` to retrieve the full scan result.
3. Skips the result if `result.type` is not `dockerImage` or `result.policyEvaluationsResult` is not `failed`.
4. Emits one `vulnerability` upsert per vulnerability entry, with the structure:

```json
{
  "vuln": { "<full vulnerability object>": "..." },
  "img":  { "imageReference": "<pullString>" }
}
```

The event timestamp is derived from the notification's `timestamp` field (microseconds, converted to milliseconds).

## Data structure

Each `vulnerability` item — emitted by both modes — exposes the same fields in the mapping context:

- `.vuln` — full vulnerability object (name, severity, CVSS score, dates, exploitability, …).
- `.img.imageReference` — container image pull string (e.g. `registry.example.com/app:v1.0.0`).

## See also

- [Connectors Overview](/products/context-catalog/connectors/10_overview.md)
