---
id: setup
title: Setup
sidebar_label: Setup
---

## Installation

### Prerequisites

1. To run the server in a container, you will need to have [Docker] installed.
1. Once Docker is installed, you will also need to ensure Docker is running.
1. Pull the docker image `docker pull ghcr.io/mia-platform/console-mcp-server`
1. Login to Mia-Platform. You have two options:
    - (a) *User Authentication* - Use miactl authentication: if you have [`miactl`][miactl] installed you can login and
      the same session will then be used by the mcp server to authenticate. To login just type `miactl company list`,
      or any other miactl command, the browser will be opened and you can use your credentials to login. You will be
      able to access to all companies and projects that have been granted to your user.
    - (b) *Service Account* - [Create a Mia-Platform Service Account](/products/console/identity-and-access-management/manage-service-accounts.md) with `Client Secret Basic` authorization mode
      (the only one supported at this time) the `Client Secret Basic` one. In that case you can access to just one
      company at a time.

:::warning

When using miactl session, auto-refresh by the MCP Server is not currently supported,
once the session created with miactl expires you have to refresh it with miactl again.

:::

---

:::important

When using miactl session, the host you provide to the MCP Server **MUST** be the exact same as the one
you have logged in with miactl, including scheme and any possible trailing slash.

:::

### VS Code

For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by
pressing `Ctrl + Shift + P` and typing `Preferences: Open User Settings (JSON)`. Optionally, you can add it to a file
called `.vscode/mcp.json` in your workspace.

Once you have done it, toggle Agent mode (located by the Copilot Chat text input) and the server will start.

:::note

The `mcp` key is not needed in the `.vscode/mcp.json` file.  
Also note that you can change the host of the Console instance to your custom installation

:::

This is the configuration if you are using miactl (a)

```json
{
    "servers": {
        "mia-platform-mcp": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "-v",
                "~/.cache/miactl:/home/node/.cache/miactl",
                "ghcr.io/mia-platform/console-mcp-server",
                "mcp-server",
                "start",
                "--stdio",
                "--host=https://demo.console.gcp.mia-platform.eu/"
            ],
            "type": "stdio"
        }
    },
    "inputs": []
}
```

This is the configuration if you are using Service Account (b)

```json
{
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
```

> **_TIP:_** If you want to use User-based authentication with [`miactl`][miactl] you have to omit from the env object:
> 
> - `MIA_PLATFORM_CLIENT_ID`
> - `MIA_PLATFORM_CLIENT_SECRET`

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
