---
id: mcp-server
title: MCP Server
sidebar_label: MCP Server
---

# MCP Server

An **MCP Server** is a catalog resource that registers an external [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server with AI Foundry. Once registered, the tools and resources exposed by the server are automatically surfaced in the tool browser and can be attached to [Agents](./10_agent.md) like any other [Tool](./40_tool.md).

## What is the Model Context Protocol?

The **Model Context Protocol** is an open standard (developed by Anthropic) that defines a uniform interface between LLM clients and the services that supply them with context, tools, and capabilities. An MCP server exposes a well-defined API that any compliant LLM runtime can discover and call, regardless of the underlying implementation language or transport.

Key concepts in MCP:

- **Tools**: callable functions with defined input/output schemas, equivalent to function-calling definitions.
- **Resources**: structured data sources the LLM can read (files, database records, API responses).
- **Prompts**: server-managed prompt templates the client can request by name.

By integrating with MCP, AI Foundry can consume capabilities from any MCP-compliant service without per-tool integration work.

## Manifest

MCP server connections can use two transport modes: **stdio** (the server is launched as a subprocess) and **HTTP** (the server is already running and reachable via URL).

### stdio mode

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: McpServer
metadata:
  name: filesystem-mcp
  title: Filesystem MCP Server
  description: Provides read/write access to a sandboxed local filesystem.
  tags:
    - filesystem
    - local
spec:
  type: stdio
  command: npx
  args:
    - -y
    - "@modelcontextprotocol/server-filesystem"
    - /tmp/sandbox
  env:
    NODE_ENV: production
```

### HTTP mode

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: McpServer
metadata:
  name: internal-search-mcp
  title: Internal Search MCP
  description: Exposes the enterprise knowledge-base search API as MCP tools.
  tags:
    - search
    - internal
spec:
  type: http
  url: https://search.internal.example.com/mcp
  env:
    SEARCH_API_KEY_VAR: INTERNAL_SEARCH_KEY
```

## Fields reference

### `metadata`

| Field         | Required | Description                              |
| ------------- | -------- | ---------------------------------------- |
| `name`        | Yes      | Unique identifier.                       |
| `title`       | Yes      | Display name shown in the UI.            |
| `description` | Yes      | Description of what the server provides. |
| `tags`        | No       | Free-form tags for filtering.            |
| `labels`      | No       | Key/value pairs for API-level filtering. |

### `spec`

The `spec` is deliberately flexible: AI Foundry does not enforce a rigid schema on it. The fields below are the most common ones:

| Field     | Description                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | Transport mode: `stdio` or `http` (or any value supported by the underlying MCP client).                                                                 |
| `command` | For stdio mode: the executable to launch (e.g. `npx`, `python`, `./mcp-server`).                                                                         |
| `args`    | For stdio mode: an array or map of arguments passed to `command`.                                                                                        |
| `env`     | Environment variables injected into the server process or used for authentication. **Values should be environment variable names, not literal secrets.** |
| `url`     | For HTTP mode: the base URL of the running MCP server.                                                                                                   |

:::caution
As with [Model](./20_model.md) resources, never store secret values directly in `spec.env`. Store the name of the environment variable, and inject the actual value at runtime.
:::

## How MCP tools appear in AI Foundry

When an MCP Server resource is registered:

1. AI Foundry connects to the server (at startup or on demand) and discovers the tools it exposes.
2. Those tool definitions are added to the tool registry alongside manually registered Tool resources.
3. These tools become selectable in the agent creation form's tool picker.
4. At runtime, when an agent calls an MCP-sourced tool, AI Foundry routes the call to the corresponding MCP server.

## IDE and tooling integration

The detail view of an MCP Server resource provides export options for common developer tooling configurations:

- **`.claude/settings.json`**: Claude desktop app configuration block that connects to this server.
- **`.github/copilot-instructions.md`**: GitHub Copilot instructions snippet referencing this server.

These exports let developers copy a server's connection block into their local tooling without manually constructing the configuration.

## See also

- [Tool](./40_tool.md): individual tools, including those sourced from MCP servers.
- [Agent](./10_agent.md): attaches tools (including MCP tools) via `spec.tools`.
