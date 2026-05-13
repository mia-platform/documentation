---
id: gitlab
title: GitLab Connector
sidebar_label: GitLab
---

# GitLab Connector

The GitLab connector ingests data from a GitLab instance into the Context Catalog. It runs through the [`ibdm`](./10_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the GitLab REST API and exits.
- **Run** — push-based: exposes a webhook endpoint that receives GitLab events.

Both GitLab.com and self-hosted instances are supported through `GITLAB_BASE_URL`.

## Commands

```sh
ibdm sync gitlab --mapping-file <path to mapping file or folder>
ibdm run  gitlab --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `GITLAB_TOKEN` | Yes | _(empty)_ | Personal, project, or group access token used for REST API requests. |
| `GITLAB_BASE_URL` | Yes | _(empty)_ | Base URL of the GitLab instance (e.g. `https://gitlab.com`). |
| `GITLAB_WEBHOOK_PATH` | No | `/gitlab/webhook` | HTTP path for inbound webhook events. |
| `GITLAB_WEBHOOK_TOKEN` | Run | _(empty)_ | Secret used to validate the `X-Gitlab-Token` header on inbound webhooks. If unset, the webhook endpoint is not registered. |

## Authentication

The source sends `GITLAB_TOKEN` as the `PRIVATE-TOKEN` header on every request. The token must have read permissions on the projects, pipelines, and access tokens you intend to synchronize.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `project` | ✅ | ✅ |
| `pipeline` | ✅ | ✅ |
| `accesstoken` | ✅ | — |

### Sync mode

`project` is the primary resource. When it appears in the mapping file, `ibdm` iterates over all accessible projects and, for each one, optionally fetches:

- **project access tokens**, when `accesstoken` is also in the mapping;
- **project pipelines**, when `pipeline` is also in the mapping.

When `accesstoken` is in the mapping, `ibdm` additionally iterates over all accessible _groups_ and fetches their group-level access tokens.

Each `project` item includes a `project_languages` field containing the language usage breakdown for that project, enriched via `GET /api/v4/projects/{id}/languages`. The value is a JSON object mapping each language name to its percentage share:

```json
{ "Go": 97.50, "Makefile": 2.43, "Dockerfile": 0.07 }
```

If the languages call fails, the project item is still emitted with an empty `project_languages` object.

### Webhook mode

| Event | Emits |
| :---- | :---- |
| **Pipeline Hook** | `project` + `pipeline` (only the data types present in the mapping) |
| **Push Hook** | `project` |

Both webhook event types also populate `project_languages` on `project` items, using the same enrichment call as sync mode.

## Example mappings

Reference mapping files live in [`docs/examples/gitlab/mappings/`](https://github.com/mia-platform/ibdm/tree/main/docs/examples/gitlab/mappings) of the `ibdm` repository:

- `projects.yaml` — map GitLab projects to Catalog items.
- `pipelines.yaml` — map pipelines to Catalog items.
- `accesstokens.yaml` — map access tokens to Catalog items.

Pass the file or the folder to `--mapping-file`:

```sh
ibdm sync gitlab --mapping-file docs/examples/gitlab/mappings/
```

## See also

- [Connectors Overview](./10_overview.md)
