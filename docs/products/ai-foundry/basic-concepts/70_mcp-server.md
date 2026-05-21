---
id: mcp-server
title: MCP Server
sidebar_label: MCP Server
---

:::caution Beta

AI Foundry is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# MCP Server

An **MCP Server** is a catalog resource that registers an external [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server with AI Foundry.

Once created, the tools and resources exposed by the server can be discovered and then added to the Catalog tools.
From that moment you can attach the MCP Server tools to [Agents](./10_agent.md) like any other [Tool](./40_tool.md).

![AI Foundry MCP Servers](../img/ai_foundry_mcpservers.png)

## MCP Server reference

| Field                  | Required | Description                                                                                                                                   |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Title`                | Yes      | Display name shown in the UI.                                                                                                                 |
| `Name`                 | Yes      | Unique identifier.                                                                                                                            |
| `Description`          | Yes      | Description of what the server provides.                                                                                                      |
| `URL`                  | Yes      | The endpoint URL of the MCP server.                                                                                                           |
| `Transport Type`       | Yes      | Transport protocol used to communicate with the MCP server.                                                                                   |
| `Auth Type`            | No       | Authentication method used when connecting to this MCP server.                                                                                |
| `Tool Name Prefix`     | No       | A string prepended to all tool names exposed by this server (regex: `^[a-zA-Z_]*$`). Useful to avoid name collisions across multiple servers. |
| `Expose MCP Resources` | No       | Whether to expose MCP resources in addition to tools.                                                                                         |
| `Require Confirmation` | No       | Whether tool invocations require explicit user confirmation before execution.                                                                 |

### Authentication

The `Auth Type` field configures how AI Foundry authenticates against the MCP server. Five schemes are supported:

| `Auth Type`                   | Additional fields        | Description                                                                                 |
| ----------------------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| `None`                        | -                        | No authentication.                                                                          |
| `Bearer token`                | `Bearer Token`           | HTTP `Authorization: Bearer <token>`. Store the token in an env var and reference its name. |
| `Basic (username / password)` | `Username`, `Password`   | HTTP Basic authentication.                                                                  |
| `API Key (custom header)`     | `API Key`, `Header Name` | Custom header authentication. Defaults to `X-API-Key` if `header Name` is omitted.          |
| `OAuth2 (access token)`       | `Access Token`           | OAuth 2 access token sent as a Bearer header.                                               |

:::caution
Never store secret values (tokens, passwords) directly in the Catalog. Reference the name of an environment variable that holds the actual secret value and inject it at deployment time.
:::

## How MCP tools appear in AI Foundry

When an MCP Server resource is registered:

1. AI Foundry connects to the server (at startup or on demand) and discovers the tools it exposes.
2. Those tool definitions are added to the tool registry alongside manually registered Tool resources.
3. These tools become selectable in the agent creation form's tool picker.
4. At runtime, when an agent calls an MCP-sourced tool, AI Foundry routes the call to the corresponding MCP server.

## See also

- [Tool](./40_tool.md): individual tools, including those sourced from MCP servers.
- [Agent](./10_agent.md): attaches tools (including MCP tools).
