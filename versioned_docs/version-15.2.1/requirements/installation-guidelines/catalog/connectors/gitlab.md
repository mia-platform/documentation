---
id: gitlab
title: GitLab Connector
sidebar_label: GitLab
---

# GitLab Connector

The GitLab connector ingests data from a GitLab instance into the Catalog. It runs through the [`ibdm`](/requirements/installation-guidelines/catalog/connectors/00_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the GitLab REST API and exits.
- **Run** — push-based: exposes a webhook endpoint that receives GitLab events.

Both GitLab.com and self-hosted instances are supported through `GITLAB_BASE_URL`.

## Commands

```sh
ibdm sync gitlab --include-internal-mappings=all
ibdm run  gitlab --include-internal-mappings=all
```

The commands use every internal mapping of the source. To select only some of them, or to add mappings of your own, see [Mappings](/requirements/installation-guidelines/catalog/connectors/00_overview.md#mappings).

## Configuration

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `GITLAB_TOKEN` | Yes | _(empty)_ | Personal, project, or group access token used for REST API requests. |
| `GITLAB_BASE_URL` | Yes | _(empty)_ | Base URL of the GitLab instance (e.g. `https://gitlab.com`). |
| `GITLAB_WEBHOOK_PATH` | No | `/gitlab/webhook` | HTTP path for inbound webhook events. |
| `GITLAB_WEBHOOK_TOKEN` | Run | _(empty)_ | Secret used to validate the `X-Gitlab-Token` header on inbound webhooks. If unset, `ibdm run gitlab` fails to start. |

## Authentication

The source sends `GITLAB_TOKEN` as the `PRIVATE-TOKEN` header on every request. The token must have read permissions on the projects, pipelines, and access tokens you intend to synchronize.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `project` | ✅ | ✅ |
| `pipeline` | ✅ | ✅ |
| `accesstoken` | ✅ | — |

### Sync mode

`project` is the primary resource. When a mapping of type `project` is used, such as the internal `projects`, `ibdm` iterates over all accessible projects and, for each one, optionally fetches:

- **project access tokens**, when a mapping of type `accesstoken` is also used;
- **project pipelines**, when a mapping of type `pipeline` is also used.

When a mapping of type `accesstoken` is used, `ibdm` additionally iterates over all accessible _groups_ and fetches their group-level access tokens.

Each `project` item includes a `project_languages` field containing the language usage breakdown for that project, enriched via `GET /api/v4/projects/{id}/languages`. The value is a JSON object mapping each language name to its percentage share:

```json
{ "Go": 97.50, "Makefile": 2.43, "Dockerfile": 0.07 }
```

If the languages call fails, the sync run aborts entirely for that project (and thus the whole sync) rather than emitting the item without `project_languages`.

### Webhook mode

| Event | Emits |
| :---- | :---- |
| **Pipeline Hook** | `project` + `pipeline`, only when mappings of both types are used: with `projects` or `pipelines` alone, a Pipeline Hook writes nothing |
| **Push Hook** | `project` |

Both webhook event types also populate `project_languages` on `project` items, using the same enrichment call as sync mode.

## Internal mappings

`ibdm mappings list gitlab` prints the internal mappings of this source, and the [Internal Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/reference/20_internal-mappings.md#gitlab) reference lists the Item Type each one writes.

| Internal mapping | Type | Sync | Webhook |
| :--------------- | :--- | :--- | :------ |
| `projects` | `project` | ✅ | ✅ |
| `pipelines` | `pipeline` | ✅ while the projects are walked | ✅ together with `projects` |
| `accesstokens` | `accesstoken` | ✅ | — |

Pipelines are only fetched while the projects are walked, so selecting `pipelines` alone produces nothing: select it together with `projects`, for example:

```sh
ibdm sync gitlab --include-internal-mappings=projects,pipelines
```

## See also

- [Connectors Installation Overview](/requirements/installation-guidelines/catalog/connectors/00_overview.md)
