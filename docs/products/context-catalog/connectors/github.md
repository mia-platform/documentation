---
id: github
title: GitHub Connector
sidebar_label: GitHub
---

# GitHub Connector

The GitHub connector ingests data from a GitHub organization into the Context Catalog. It runs through the [`ibdm`](/products/context-catalog/connectors/10_overview.md) binary in one of two modes:

- **Sync** — pull-based: queries the [GitHub REST API](https://docs.github.com/en/rest) and exits.
- **Run** — push-based: exposes a webhook endpoint that receives GitHub organization events.

GitHub Enterprise Server is supported by overriding `GITHUB_URL`.

## Commands

```sh
ibdm sync github --mapping-file <path to mapping file or folder>
ibdm run  github --mapping-file <path to mapping file or folder>
```

## Configuration

| Variable | Required | Default | Description |
| :------- | :------- | :------ | :---------- |
| `GITHUB_TOKEN` | Yes | _(empty)_ | GitHub personal access token (classic) or fine-grained token with the required scopes. |
| `GITHUB_ORG` | Yes | _(empty)_ | GitHub organization to synchronize. |
| `GITHUB_URL` | No | `https://api.github.com` | Base URL of the GitHub API. Override for GitHub Enterprise Server (e.g. `https://github.example.com/api/v3`). |
| `GITHUB_HTTP_TIMEOUT` | No | `30s` | HTTP request timeout (Go duration). |
| `GITHUB_PAGE_SIZE` | No | `100` | Items per API page (1–100). |
| `GITHUB_WEBHOOK_SECRET` | Run | _(empty)_ | HMAC secret for webhook signature verification. |
| `GITHUB_WEBHOOK_PATH` | No | `/github/webhook` | HTTP path for inbound webhook events. |

## Authentication

- **Personal Access Token (classic):** required scopes `repo` and `read:org`.
- **Fine-grained Personal Access Token:** required permissions at organization level — *Repository → Metadata: Read-only*, *Organization → Members: Read-only*.

## Supported data types

| Type | Sync | Webhook |
| :--- | :--- | :------ |
| `repository` | ✅ | ✅ |
| `workflow_run` | ✅ | ✅ |
| `personal_access_token_request` | — | ✅ |
| `workflow_dispatch` | — | ✅ |

### Webhook actions per type

| Type | Actions → Upsert | Actions → Delete |
| :--- | :--------------- | :--------------- |
| `repository` | `created`, `edited`, `renamed`, `archived`, `unarchived`, `transferred`, `publicized`, `privatized` | `deleted` |
| `workflow_run` | `requested`, `in_progress`, `completed` | — |
| `personal_access_token_request` | `approved`, `created` | `cancelled`, `denied` |
| `workflow_dispatch` | _(all — no action field)_ | — |

### Repository languages enrichment

Whenever a `repository` item is produced (sync or webhook), `ibdm` calls `GET /repos/{owner}/{repo}/languages` and adds a `repositoryLanguages` field to the mapping context — a JSON object mapping each language to its percentage share, rounded to two decimal places:

```json
{ "Go": 97.50, "Makefile": 2.43, "Dockerfile": 0.07 }
```

If the languages call fails, the repository item is still emitted without `repositoryLanguages`.

## Setting up a GitHub webhook

1. Go to your GitHub organization's **Settings → Webhooks → Add webhook**.
2. Set **Payload URL** to your public `ibdm` URL followed by `GITHUB_WEBHOOK_PATH` (default `/github/webhook`).
3. Set **Content type** to `application/json`.
4. Set **Secret** to the value of `GITHUB_WEBHOOK_SECRET`.
5. Subscribe to the events that match the data types you want:
   - **Repositories** → `repository`
   - **Workflow runs** → `workflow_run`
   - **Personal access token requests** → `personal_access_token_request`
   - **Workflow dispatches** → `workflow_dispatch`

## See also

- [Connectors Overview](/products/context-catalog/connectors/10_overview.md)
- [GitLab Connector](/products/context-catalog/connectors/gitlab.md), [Bitbucket Connector](/products/context-catalog/connectors/bitbucket.md) — sibling source-code hosting connectors.
