---
id: manual-download
title: Manual download
sidebar_label: Manual download
---

# Manual download

The **Manual Download** page lets you download selected AI resources as ZIP archives, laid out for the tool you use, and add them to your project. Use it when your tool does not support the [plugin marketplace](/products/ai-foundry/connections/20_third-party-integrations.md), or when you want to pick exactly which resources to bring into a repository.

The page is in the **Connections** section of the AI Foundry sidebar, and requires permission to distribute AI Foundry resources.

## What you can download

Resources are organized in tabs, one per type:

- [Playbooks](/products/ai-foundry/basic-concepts/21_playbook.md)
- [Agents](/products/ai-foundry/basic-concepts/20_agent.md)
- [Skills](/products/ai-foundry/basic-concepts/12_skill.md)
- [Prompts](/products/ai-foundry/basic-concepts/11_prompt.md)
- [MCP Servers](/products/ai-foundry/basic-concepts/14_mcp-server.md)
- [Spec Templates](/products/ai-foundry/basic-concepts/16_spec.md)
- Your personal [Memory](/products/ai-foundry/basic-concepts/15_memory.md)

**Dependencies are included automatically.** Downloading an agent also brings the skills and tools it uses; downloading a playbook brings its agents and everything they depend on. You don't need to collect them one by one.

## Download resources

1. Open the tab of the resource type you need, and select one or more resources. You can open a resource's overview to check it before downloading.
2. Choose the **format** of the tool you will use them with.
3. Select **Download**.

Each selected resource is downloaded as its own archive, except memory entries: the selected entries are downloaded together, because they share a single index file.

Every successful download is recorded in [Resource Downloads](/products/ai-foundry/observability/10_ai_resources.md#resource-downloads).

## Formats

Each format lays out the archive in the folders where the target tool expects its instructions, agents, skills, prompts, and MCP server configuration:

| Format                        | Target                                                            |
| ----------------------------- | ----------------------------------------------------------------- |
| **Claude Code**               | Claude Code project configuration.                                |
| **GitHub Copilot (VS Code)**  | GitHub Copilot in VS Code.                                        |
| **GitHub Copilot (JetBrains)**| GitHub Copilot in JetBrains IDEs.                                 |
| **Amazon Kiro**               | Amazon Kiro steering files, agents, and settings.                 |
| **Cursor**                    | Cursor.                                                           |
| **Antigravity**               | Google Antigravity.                                               |
| **Mia Platform**              | The raw catalog resource as JSON, without dependencies. |

The **Setup** tab of the page shows, for each format, where every kind of resource ends up in your project and how to extract the archive. Archives also include a provenance file that records where the resources came from.

:::caution
If your project already contains an MCP server configuration or tool settings file, extracting the archive may overwrite it. Merge the MCP server and settings files by hand instead of replacing them.
:::

## See also

- [Third-party integrations](/products/ai-foundry/connections/20_third-party-integrations.md): subscribe your tool to the catalog to receive updates automatically.
- [AI Resources](/products/ai-foundry/observability/10_ai_resources.md): see who downloaded which resource.
