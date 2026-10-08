---
id: third-party-integrations
title: Third-party integrations
sidebar_label: Third-party integrations
---

# Third-party integrations

AI Foundry lets developers use the AI assets of your catalog (playbooks, agents, skills, prompts, MCP servers, and personal memory) directly from the IDEs and coding assistants they already work with. The **Connections** section of the AI Foundry sidebar has a dedicated setup page for each supported tool:

- **VS Code** (GitHub Copilot)
- **Claude Code**
- **Amazon Kiro**
- **Cursor**
- **JetBrains** IDEs (GitHub Copilot)
- **Google Antigravity**

Each page is a step-by-step guide with ready-to-copy commands and settings, already filled in with the address of your installation and your organization and tenant. This page explains the mechanisms behind those guides, so you know what each step does. Always follow the in-product page for the exact commands, since they depend on your installation and on the version of each tool.

:::info
The setup pages require permission to distribute AI Foundry resources. Select your organization and tenant in AI Foundry before you start: the repository addresses depend on them.
:::

## How the catalog reaches your tool

AI Foundry publishes your catalog as **Git repositories** that tools can subscribe to or clone. The repositories are generated from the catalog when you access them, so they always reflect the current state of your assets, and only include what you are allowed to see.

Two repository formats are available:

| Repository         | Format                                                                                                    | Contents                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Native catalog** | A plugin marketplace understood by Claude Code and VS Code.                                                | One plugin per playbook (with its agents and skills), per prompt (as a slash command), and per MCP server, plus a plugin with your personal memory. |
| **Agent Plugins**  | The open Agent Plugins format, understood by tools that support that standard. | Skills and MCP servers only.                                                                                |

Depending on what the tool supports, the setup page uses one of three approaches:

- **Plugin marketplace**: the tool subscribes to the repository and lets you browse and install individual plugins, and update them later from the tool itself. This is the most integrated option.
- **Git clone**: you clone the repository and use its files in your projects. Pull to get updates.
- **Manual download**: you download selected resources as a ZIP archive laid out for the tool. See [Manual download](/products/ai-foundry/connections/30_manual-download.md).

| Tool        | Primary approach                                     |
| ----------- | ---------------------------------------------------- |
| Claude Code | Plugin marketplace (native catalog)                  |
| VS Code     | Plugin marketplace (native catalog or Agent Plugins) |
| Amazon Kiro | Agent Plugins                                        |
| Cursor      | Git clone or manual download                         |
| JetBrains   | Git clone or manual download                         |
| Antigravity | Git clone or manual download                         |

Every clone or install is recorded in [Resource Downloads](/products/ai-foundry/observability/10_ai_resources.md#resource-downloads), so asset owners can see where their resources are used.

## Authenticate Git

The catalog repositories are protected by the same authentication as AI Foundry. Each setup page includes a **one-time Git authentication** step: you install a Git credential helper and apply the configuration shown on the page. The first time Git accesses the repository, you sign in through the browser; afterwards, the cached credentials also cover the background updates the tools perform on their own.

## Install the catalog

For tools that support a plugin marketplace, the setup page shows how to add the AI Foundry repository as a marketplace and install plugins from it. For example, in Claude Code you add the marketplace with the `/plugin marketplace add` command, browse it with `/plugin`, and install plugins at user, project, or local scope. In VS Code, you add the repository to the agent plugin marketplaces in your settings and install plugins from the chat view.

For the other tools, the page shows the `git clone` command for the repository and points you to the manual download for individual resources.

## Use AI Foundry models through the AI Gateway

Beyond assets, some tools can also send their model traffic through the **AI Gateway**, so that it is governed by the same model access and budgets as the rest of AI Foundry. To do so, you need a **virtual key** issued by an administrator (see [Administration and security](/products/ai-foundry/overview.md#administration-and-security)):

- **Claude Code** is pointed at the gateway through its base URL and authentication token settings.
- **VS Code** and **JetBrains** use the gateway as an OpenAI-compatible endpoint, with the virtual key as API key and a catalog model name as model.

Virtual keys expire; renew them from the key's page when needed, and never share them.

## Send telemetry to AI Foundry

The **Observability** tab of the Claude Code, VS Code, and JetBrains pages explains how to make the tool export its [OpenTelemetry](https://opentelemetry.io/) traces and metrics to AI Foundry. Once configured, usage, tokens, and cost from developers' machines appear in [AI Providers](/products/ai-foundry/observability/30_ai_providers.md), next to the activity of AI Foundry's own services.

The configuration also stamps the telemetry with your user, organization, and tenant, so it is attributed to the right tenant and can be found in the observability pages. Sensitive attributes are removed when the telemetry is received.

## See also

- [Manual download](/products/ai-foundry/connections/30_manual-download.md): download individual resources as ZIP archives.
- [Apps & Plugins](/products/ai-foundry/connections/10_apps-plugins.md): register the client applications that consume AI Foundry.
- [Playbook](/products/ai-foundry/basic-concepts/21_playbook.md): the unit published as a plugin.
- [Memory](/products/ai-foundry/basic-concepts/15_memory.md): the personal memory you can take into your IDE.
