---
id: setup
title: Setup
sidebar_label: Setup
---

## Connecting to the remote Console MCP Server

:::note
Please also consider that this is available only for projects and companies in the [Mia-Platform PaaS](/infrastructure/paas/overview.md). To log in to the remote Console MCP Server in self-hosted installation, you must create a Service Account first.
:::

From version `v14.3.1` of the Mia Platform Console, it is possible to connect to the remote MCP Server from the dedicated endpoint, simplifying the configuration process and requiring only to authenticate at the server startup before to use all the tools and prompts of the official Mia-Platform Console MCP Server.

This will simplify the usage of the MCP Server in your client, by connecting to the latest stable version.

You can add it to your favourite AI Client that supports MCP servers (like VS Code, Gemini CLI, Claude Desktop and others) by creating a new configuration and using the following endpoint: `https://console.cloud.mia-platform.eu/console-mcp-server/mcp`.

## Using Docker

### Prerequisites

1. To run the server in a container, you will need to have [Docker] installed.
2. Once Docker is installed, you will also need to ensure Docker is running.
3. Pull the docker image `docker pull ghcr.io/mia-platform/console-mcp-server` at your own preferred version (or `latest` if you want to try the nightly build)
4. Login to Mia-Platform. You have two options:
  - (a) *Service Account* - [Create a Mia-Platform Service Account] with `Client Secret Basic` authorization mode (the only one supported at this time) the `Client Secret Basic` one. In that case you can access to just one company at a time.
  - (b) *User Authentication* - Assuming you have a valid Mia Platform account, you can simply omit the information about the service account and - at the MCP startup - your client will ask you to open for you a webpage where you can execute the login.
    
:::note
Authentication to the Console MCP Server via OAuth2 flow is available from the v1.2.0 of the Console MPC Server, and replaces the possibility to use the access token locally stored in [`miactl`][miactl].
:::


### VS Code

For manual installation, add the following JSON block to your MCP Server list file in VS Code.
You can do this by pressing `Ctrl + Shift + P` and typing `MCP: List Servers`, or you can create a `.vscode/mcp.json` file inside your repository.

Once you have done it, toggle Agent mode (located by the Copilot Chat text input) and the server will start.

:::note
The `mcp` key is not needed in the `.vscode/mcp.json` file.
Also note that you can change the host of the Console instance to your custom installation.
:::

This is the configuration if you are using User Authentication with OAuth2 and Dynamic Client Registration.

```json
{
    "servers": {
        "mia-platform-mcp": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "mcp-server",
                "start",
                "--stdio",
                "--host=https://console.cloud.mia-platform.eu/"
            ],
            "type": "stdio"
        }
    },
    "inputs": []
}
```

This is the configuration if you are using a predefined Service Account.

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "mia_client_id",
        "description": "Mia-Platform Client ID",
        "password": false
      },
      {
        "type": "promptString",
        "id": "mia_client_secret",
        "description": "Mia-Platform Client Secret",
        "password": true
      }
    ],
    "servers": {
      "mia-platform-console": {
        "command": "docker",
        "args": [
          "run",
          "-i",
          "--rm",
          "-e",
          "MIA_PLATFORM_CLIENT_ID",
          "-e",
          "MIA_PLATFORM_CLIENT_SECRET",
          "ghcr.io/mia-platform/console-mcp-server",
          "mcp-server",
          "start",
          "--stdio",
          "--host=https://console.cloud.mia-platform.eu"
        ],
        "env": {
          "MIA_PLATFORM_CLIENT_ID": "${input:mia_client_id}",
          "MIA_PLATFORM_CLIENT_SECRET": "${input:mia_client_secret}"
        }
      }
    }
  }
}
```

:::tip
If both the environment variables `MIA_PLATFORM_CLIENT_ID` and `MIA_PLATFORM_CLIENT_SECRET` are included, you will be asked to authenticate with your credentials. In this case, make sure you open the web page that Visual Studio Code will prompt you to open.
:::

:::tip
If you have issues to authenticate because of an `invalid_client` error, please try to remove the DCR clients registrated using the `Authentication: Remove Dynamic Authentication Providers` option from the application menu.
:::

More about using MCP server tools in [VS Code's agent mode documentation].

### Claude Desktop

```json
{
  "mcpServers": {
    "mia-platform-console": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "MIA_PLATFORM_CLIENT_ID",
        "-e",
        "MIA_PLATFORM_CLIENT_SECRET",
        "ghcr.io/mia-platform/console-mcp-server",
        "mcp-server",
        "start",
        "--stdio",
        "--host=https://console.cloud.mia-platform.eu"
      ],
      "env": {
        "MIA_PLATFORM_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "MIA_PLATFORM_CLIENT_SECRET": "<YOUR_CLIEND_SECRET>"
      }
    }
  }
}
```

### Gemini CLI

Add `mia-platform-console` in `mcpServers` in file `~/.gemini/settings.json`.

```json
{
  "mcpServers": {
    "mia-platform-console": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "MIA_PLATFORM_CLIENT_ID",
        "-e",
        "MIA_PLATFORM_CLIENT_SECRET",
        "ghcr.io/mia-platform/console-mcp-server",
        "mcp-server",
        "start",
        "--stdio",
        "--host=https://console.cloud.mia-platform.eu"
      ],
      "env": {
        "MIA_PLATFORM_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "MIA_PLATFORM_CLIENT_SECRET": "<YOUR_CLIEND_SECRET>"
      }
    }
    ...
  }
  ...
}
```

[Docker]: https://www.docker.com/
[miactl]: https://github.com/mia-platform/miactl
[VS Code's agent mode documentation]: https://code.visualstudio.com/docs/copilot/chat/mcp-servers
[Create a Mia-Platform Service Account]: https://docs.mia-platform.eu/docs/development_suite/identity-and-access-management/manage-service-accounts
