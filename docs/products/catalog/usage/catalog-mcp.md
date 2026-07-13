---
id: catalog-mcp
title: Catalog MCP Server
sidebar_label: Catalog MCP Server
---

# Catalog MCP Server

The Catalog MCP Server exposes the Mia-Platform Catalog to any [MCP](https://modelcontextprotocol.io/)-compatible client — Claude Desktop, Cursor, VS Code, Windsurf, and others — so you can browse, search, and edit your Catalog items and Item Type Definitions (ITDs) using natural language, without leaving your editor or chat client.

It works as a thin proxy in front of the Catalog Engine: it reads the Engine's OpenAPI specification and turns each operation into an MCP tool a client can call. There's no separate business logic to configure, point it at your Catalog Engine and the available tools follow automatically.

New to items and ITDs? See the [Catalog overview](/products/catalog/overview.md) for an introduction to those concepts before diving in here.

## Connecting to the remote MCP Server

Prerequisites:

* A Mia-Platform account with access to the Catalog.

The simplest way to get started is the hosted endpoint, no installation required:

```
https://catalog.mia-demo-re5gu6.gcp.mia-platform.eu/mcp
```

Add it to your MCP client as an HTTP server, authenticating with client id `catalog-mcp` and no client secret. Refer to your client's documentation for where this goes (e.g. VS Code's `mcp.json`, Claude Desktop's settings, Cursor's MCP settings).

## Using Docker

If you're pointing at your own Catalog Engine instance, run the server locally with Docker.

Prerequisites:

* [Docker](https://docs.docker.com/get-docker/) installed and running.
* A reachable Catalog Engine instance, and its base URL.

```bash
docker run -i --rm --name catalog-mcp-server \
  ghcr.io/mia-platform/catalog-mcp-server:latest \
  --stdio --base-url=<catalog-base-url>
```

Replace `<catalog-base-url>` with the base URL of your Catalog Engine (e.g. `http://localhost:3000`).

Below is the config for each client. They share the same structure — only the root key and the file location differ — so pick the section for the client you use and remember to substitute `<catalog-base-url>` as above.

### VS Code

```json
{
  "servers": {
    "catalog": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "ghcr.io/mia-platform/catalog-mcp-server:latest",
        "--stdio", "--base-url=<catalog-base-url>"
      ]
    }
  }
}
```

### Claude Desktop

```json
{
  "mcpServers": {
    "catalog": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "ghcr.io/mia-platform/catalog-mcp-server:latest",
        "--stdio", "--base-url=<catalog-base-url>"
      ]
    }
  }
}
```

### Cursor

Add this to your project's `.cursor/mcp.json` (or the global `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "catalog": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "ghcr.io/mia-platform/catalog-mcp-server:latest",
        "--stdio", "--base-url=<catalog-base-url>"
      ]
    }
  }
}
```

## Configuration options

The server is configured through CLI flags passed after the image name:

| Flag | Required | Default | Description |
|---|---|---|---|
| `-b, --base-url <URL>` | Yes | — | Base URL of the Catalog Engine to connect to. |
| `-s, --spec <LOCATION>` | No | `<base-url>/openapi/json` | Path or URL of the OpenAPI spec to generate tools from. |
| `--stdio` | No | `false` | Use the stdio transport instead of HTTP streaming — this is what most desktop clients expect, and what all the examples above use. |

The `LOG_LEVEL` environment variable (`trace`, `debug`, `info`, `warn`, `error`) controls log verbosity; it defaults to `info`.

## Available tools

Tools are generated from the Catalog Engine's OpenAPI spec, so they stay in sync with the API automatically. Today, they cover items and ITDs:

| Tool | What it does |
|---|---|
| `list_items` | Lists Catalog items, with pagination and query/sort support. |
| `count_items` | Counts Catalog items matching a query. |
| `get_item_by_name` | Retrieves a single item by name. |
| `upsert_item` | Creates or updates an item. |
| `delete_item_by_name` | Deletes an item by name. |
| `patch_item_custom_fields` | Updates the custom fields of an item. |
| `list_items_by_itd` | Lists the items belonging to a specific ITD. |
| `list_itds` | Lists the available Item Type Definitions. |
| `count_itds` | Counts Item Type Definitions. |
| `get_itd_by_name` | Retrieves a single ITD by name. |
| `upsert_itd` | Creates or updates an ITD. |
| `delete_itd_by_name` | Deletes an ITD by name. |

## Examples

Review these sample prompts and adjust the values in curly braces to match your Catalog. Once the server is connected, you can ask your client things like:

**Browsing items**

* "List all the items of type \{itdName\} in my Catalog."
* "How many items are there in the Catalog?"
* "Show me the item named \{itemName\}."

**Editing items**

* "Create an item named \{itemName\} of type \{itdName\} with these custom fields: \{fields\}."
* "Update the \{fieldName\} custom field of \{itemName\} to \{value\}."
* "Delete the item named \{itemName\}."

**Working with Item Type Definitions**

* "List all the Item Type Definitions available in the Catalog."
* "Show me the definition of the \{itdName\} ITD."
* "Create a new ITD named \{itdName\} with these fields: \{fields\}."