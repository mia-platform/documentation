---
id: apps-plugins
title: Apps & Plugins
sidebar_label: Apps & Plugins
---

# Apps & Plugins

The **Apps & Plugins** page lists the applications, plugins, and extensions that consume AI Foundry's capabilities. Each of them is registered as an **App**: a catalog resource that represents a client of AI Foundry, for example an IDE-based coding assistant such as Claude Code.

Registering an App makes a client visible in the catalog and lets you group the [built-in tools](/products/ai-foundry/basic-concepts/13_tool.md) it provides, so you can see at a glance which capabilities belong to which application.

![AI Foundry Applications](../img/ai_foundry_apps.png)

:::note
An App describes a client application; it does not configure the connection itself. To connect a tool to your AI Foundry catalog, see [Third-party integrations](/products/ai-foundry/connections/20_third-party-integrations.md) and [Manual download](/products/ai-foundry/connections/30_manual-download.md).
:::

## App reference

An App carries only the common catalog metadata:

| Field         | Required | Description                                                                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Title`       | Yes      | Display name shown in the UI, for example "Claude Code".                                                                    |
| `Name`        | Yes      | Unique identifier, automatically derived from `Title`.                                                                      |
| `Description` | Yes      | What the application or plugin is, and how it uses AI Foundry.                                                              |
| `Tags`        | No       | Free-form, multi-value tags that make the App easier to find and filter.                                                    |

## Grouping built-in tools by App

A built-in [Tool](/products/ai-foundry/basic-concepts/13_tool.md) must declare which App it belongs to through its **Application** field. This groups built-in tools by the client application or plugin that owns them, in the same way as tools sourced from an [MCP Server](/products/ai-foundry/basic-concepts/14_mcp-server.md) are grouped by the server that exposes them. In the Tools list you can filter by Application to see every tool an App provides.

## Managing Apps

From the Apps & Plugins page you can search and filter the registered Apps, create a new one, and open an App to see its details and the built-in tools that belong to it. Viewing Apps requires permission to read catalog items; creating or editing them requires permission to write them.

## See also

- [Tool](/products/ai-foundry/basic-concepts/13_tool.md): built-in tools declare their owning App.
- [MCP Server](/products/ai-foundry/basic-concepts/14_mcp-server.md): the equivalent grouping mechanism for externally sourced tools.
- [Third-party integrations](/products/ai-foundry/connections/20_third-party-integrations.md): connect IDEs and coding assistants to your catalog.
