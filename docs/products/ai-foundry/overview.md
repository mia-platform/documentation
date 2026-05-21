---
id: overview
title: AI Foundry Overview
sidebar_label: Overview
---

:::caution Beta

AI Foundry is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# AI Foundry Overview

**AI Foundry** is a web-based management and orchestration platform for building, managing, and validating AI-powered workflows. It provides a unified interface to compose and test complex agentic applications without writing code directly, targeting enterprises that need to govern and reuse AI assets across teams.

![AI Foundry Home Page](img/ai_foundry_welcome.png)

## Key Concepts

AI Foundry organizes AI assets as catalog resources, each sharing common metadata (name, title, description, tags, labels, and timestamps). The platform manages eight resource types:

| Resource           | Purpose                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Agent**          | An AI entity backed by a configured LLM, with assigned tools, skills, and system instructions.                  |
| **Model**          | An LLM configuration that wraps a model identifier and its runtime parameters.                                  |
| **Prompt**         | A reusable prompt template that agents and playbooks can reference.                                             |
| **Tool**           | An executable function or integration that an agent can invoke, including tools exposed by MCP servers.         |
| **Skill**          | A reusable capability that agents can call.                                                                     |
| **Playbook**       | A multi-step agentic workflow composed of agents, prompts, skills, and specs connected in a directed graph.     |
| **MCP Server**     | A [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes tools and resources to agents. |
| **Spec Templates** | A free-form specification document referenced by playbooks and workflows.                                       |

## Features

### AI Playground

![AI Foundry Playground](img/ai_foundry_playground.png)

The **AI Playground** provides a live chat interface for testing agents in real time. Select a playbook, configure per-agent model overrides, and chat with the configured agentic flow. The playground streams responses, visualises tool calls and "thinking" steps inline, and lets you enable or disable individual tools and skills on the fly. It also supports slash-prompt auto-completion from prompts associated to the selected playbook.

### Agent Management

Create and configure agents by selecting an LLM model, writing system instructions in Markdown, and attaching tools and skills. Tools are shown grouped by category in the picker, including tools sourced from registered MCP servers. Agents can be created through a guided form or by editing the underlying JSON spec directly.

### Playbook Builder

![AI Foundry Playbook Builder](img/ai_foundry_playbook_builder.png)

The **Playbook Builder** is a three-step wizard for designing multi-step agentic workflows:

1. **Overview**: set the playbook's name, title, and description.
2. **Agentic Flow**: a drag-and-drop canvas where agent nodes are connected with edges. In addition to regular agent nodes, you can add orchestration nodes for **sequential**, **parallel**, and **loop** (with configurable max iterations) execution patterns.
3. **Resources**: attach playbook-level prompts, skills, and spec templates using multi-select pickers. Optionally configure a **Mia Flow** integration (mode, home project template, home prompt text).

Playbooks can also be authored as raw JSON using the built-in Monaco editor.

### Model and Prompt Management

Manage LLM configurations and prompt templates as first-class catalog items. 
Prompts are authored in Markdown with a live preview pane and can be tagged for discoverability.

### Tool and Skill Discovery

Browse all tools and skills available in the system, including those exposed dynamically by registered MCP servers.
Tools and skills are attachable to agents from the catalog.

### MCP Server Integration

Register external [Model Context Protocol](https://modelcontextprotocol.io/) servers to expand the tool ecosystem available to your agents.
Each registered server is stored as a catalog resource and its tools are included in the available tools list.

## IDE and tooling integration

You can download the following AI assets to work from your workstation:

- [Agents](./basic-concepts/10_agent.md)
- [Playbooks](./basic-concepts/60_playbook.md)
- [MCP Servers](./basic-concepts/70_mcp-server.md)
- [Skills](./basic-concepts/50_skill.md)
- [Prompts](./basic-concepts/30_prompt.md)

These exports let developers work seamlessly from the cloud or locally.

## Where to go next

New to AI Foundry? Start with the Basic Concepts section:

- [Agent](./basic-concepts/10_agent.md): the autonomous AI actor at the heart of the platform.
- [Model](./basic-concepts/20_model.md): LLM configurations that back agents.
- [Prompt](./basic-concepts/30_prompt.md): reusable text templates for agents and workflows.
- [Tool](./basic-concepts/40_tool.md): executable functions agents can call.
- [Skill](./basic-concepts/50_skill.md): reusable, higher-level AI capabilities.
- [Playbook](./basic-concepts/60_playbook.md): multi-step agentic workflows.
- [MCP Server](./basic-concepts/70_mcp-server.md): Model Context Protocol server integrations.
- [Spec](./basic-concepts/80_spec.md): structured reference documents for agents and playbooks.
- [Observability](./90_observability.md): session monitoring and analytics.
