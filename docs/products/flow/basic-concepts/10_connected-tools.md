---
id: connected-tools
title: Connected tools
sidebar_label: Connected tools
---

:::caution Beta

Flow is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Connected tools

Flow's AI assistant becomes useful in real projects only when it can read from and act on the systems your team already uses. Those integrations are exposed through the **Model Context Protocol (MCP)**: every external system is wrapped as an MCP server, and the assistant picks tools from those servers when answering a request.

This page describes the connectors that ship with Flow, how authentication works inside the application, and how to add custom MCP servers.

## What is exposed

Flow connects to a set of MCP servers and makes their tools available to the assistant. Each server contributes a category of tools:

| Category | Provider | Typical actions |
|----------|----------|-----------------|
| Source control | GitHub, GitLab, Bitbucket, Azure DevOps | Repositories, branches, pull/merge requests, code search |
| Project management | Atlassian (Jira / Confluence) | Issues, sprints, wiki pages |
| Monitoring | Grafana | Dashboards, alerts, metrics |
| Cloud storage | Google Drive (read-only) | List, search, fetch file content |
| Platform | Mia-Platform Console & Data Catalog | Projects, services, lineage, catalog items |
| Web | Generic crawler | Fetch and summarise any URL |
| Shell | Sandboxed Bash executor | Run shell commands inside the Flow sandbox |

In addition to the built-in connectors, you can register any number of **custom MCP servers** from the Connectors page. Flow loads them automatically and treats their tools like any other.

## The Connectors page

The **Connectors** page is the single hub for authenticating to all external providers. Each provider shows its current state with connect/disconnect actions:

- **Git providers**: GitHub, GitLab, Azure DevOps, Bitbucket.
- **Project management**: Atlassian (Jira and Confluence share the same authorisation).
- **Monitoring**: Grafana.
- **Cloud storage**: Google Drive (read-only).
- **Data platform**: Mia-Platform Data Catalog.
- **Custom MCP servers**: any number of remote endpoints, each with its own auth mode.

Custom MCP servers support four authentication modes: `oauth`, `api_key`, `bearer`, and `none`. Once a server is added or removed, Flow refreshes the assistant's tool set on the next message you send.

## How authentication works

When you click **Connect** next to a provider, Flow drives the authentication flow with that provider. Once it completes, the corresponding tools become available to the assistant in every conversation. You can disconnect a provider at any time, and the related tools immediately stop being offered to the assistant.

## How the assistant picks tools

In a given turn, the assistant has access to the tools exposed by every MCP server it is connected to, plus Flow's built-in tools for the Canvas (file operations, project introspection, deployment).

Tools are a different concept from **skills**: skills are reusable, named operations defined in the Catalog and are described in [Agentic AI](./40_agentic-ai.md).

If your saved tool selection becomes incompatible with the current server set (for example, after a connector update), Flow falls back to a safe default and shows a notification.

## Limits and safety

- The sandbox that compiles and runs generated code is isolated and has no access to your machine.
- The Bash executor runs commands in an isolated environment.
- Every external call is authenticated as the user who is signed in, so Flow honours the same permissions those external systems enforce.

## See also

- [Chat](./20_chat.md): how tool calls surface inside a conversation.
- [Agentic AI](./40_agentic-ai.md): bundling tools and skills via agents and playbooks.
