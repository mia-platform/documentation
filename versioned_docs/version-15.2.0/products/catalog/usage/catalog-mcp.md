---
id: catalog-mcp
title: Catalog MCP Server
sidebar_label: Catalog MCP Server
---

The Catalog MCP Server exposes the Mia-Platform Catalog to any [MCP](https://modelcontextprotocol.io/)-compatible client — Claude Desktop, Cursor, VS Code, Windsurf, and others — so you can browse, search, and edit your Catalog items and Item Type Definitions (ITDs) using natural language, without leaving your editor or chat client.

It works as a thin proxy in front of the Catalog Engine: it reads the Engine's OpenAPI specification and turns each operation into an MCP tool a client can call. There's no separate business logic to configure, point it at your Catalog Engine and the available tools follow automatically.

New to items and ITDs? See the [Catalog overview](/products/catalog/overview.md) for an introduction to those concepts before diving in here.

## Connecting to the MCP Server

Prerequisites:

- A Mia-Platform account with access to the Catalog.

The MCP Server of a Catalog installation is available at

```plain
https://<catalog-hostname>/mcp
```

You can add it to your MCP client as an HTTP server, authenticating via browser with your Mia-Platform account.

The Catalog MPC Server **works for one single specific tenant at a time**, meaning that you need to set the tenant when registering the server on you MCP client.

:::tip
If you belong to a single tenant, you can avoid specifing it on the client, since the system will automatically infer it at every call.
:::

The tenant needs to be passed with an header (consult your client documentation for details on how to pass headers in MCP Server registrations). The header key is `x-mia-acl-context` while the value is a stringified JSON with the following fields:

```json
{
  "organization": "<the name of the organization the tenant belongs to>",
  "tenant": "<the name or the id of the tenant>"
}
```

:::tip
If you want to work with multiple tenant, register multiple instances of the MCP Server giving a different header to each of them.
:::

Each MCP client has its own way to add MCP Server, so we encourage you to check your client's documentation. It follows a couple of examples for some of the most used clients.

**Visual Studio Code.**

Add the following snippet to your `mcp.json` file:

```json
{
  "servers": {
    "mia-platform-catalog": {
      "url": "https://<catalog-hostname>/mcp",
      "type": "http",
      "headers": {
        "x-mia-acl-context": "{ \"organization\": \"<org-name>\", \"tenant\": \"<tenant-name>\" }"
      }
    }
  }
}
```

**Claude Desktop.**

Run the following CLI command:

```sh
claude mcp add \
  --transport http \
  mia-platform-catalog \
  https://<catalog-hostname>/mcp \
  --header "x-mia-acl-context: { \"organization\": \"<org-name>\", \"tenant\": \"<tenant-name>\" }"
```

## Available tools

Tools are generated from the Catalog Engine's OpenAPI spec, so they stay in sync with the API automatically. Today, they cover items and ITDs:

| Tool                       | What it does                                                 |
| -------------------------- | ------------------------------------------------------------ |
| `list_items`               | Lists Catalog items, with pagination and query/sort support. |
| `count_items`              | Counts Catalog items matching a query.                       |
| `get_item_by_name`         | Retrieves a single item by name.                             |
| `upsert_item`              | Creates or updates an item.                                  |
| `delete_item_by_name`      | Deletes an item by name.                                     |
| `patch_item_custom_fields` | Updates the custom fields of an item.                        |
| `list_items_by_itd`        | Lists the items belonging to a specific ITD.                 |
| `list_itds`                | Lists the available Item Type Definitions.                   |
| `count_itds`               | Counts Item Type Definitions.                                |
| `get_itd_by_name`          | Retrieves a single ITD by name.                              |
| `upsert_itd`               | Creates or updates an ITD.                                   |
| `delete_itd_by_name`       | Deletes an ITD by name.                                      |

## Examples

Review these sample prompts and adjust the values in curly braces to match your Catalog. Once the server is connected, you can ask your client things like:

**Browsing items.**

- "List all the items of type \{itdName\} in my Catalog."
- "How many items are there in the Catalog?"
- "Show me the item named \{itemName\}."

**Editing items.**

- "Create an item named \{itemName\} of type \{itdName\} with these custom fields: \{fields\}."
- "Update the \{fieldName\} custom field of \{itemName\} to \{value\}."
- "Delete the item named \{itemName\}."

**Working with Item Type Definitions.**

- "List all the Item Type Definitions available in the Catalog."
- "Show me the definition of the \{itdName\} ITD."
- "Create a new ITD named \{itdName\} with these fields: \{fields\}."
