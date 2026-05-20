---
id: overview
title: AI Foundry Overview
sidebar_label: Overview
---

:::caution Beta

AI Foundry is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# AI Foundry Overview

**AI Foundry** is a web-based management and orchestration platform for building, managing, and running AI-powered workflows. It provides a unified interface to compose and test complex agentic applications without writing code directly, targeting enterprises that need to govern AI assets across teams.

## Key Concepts

AI Foundry organizes AI assets as catalog resources, each sharing common metadata (name, title, description, tags, labels, and timestamps). The platform manages eight resource types:

| Resource       | Purpose                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **Agent**      | An AI entity backed by a configured LLM, with assigned tools, skills, and system instructions.                  |
| **Model**      | An LLM configuration that wraps a model identifier and its runtime parameters.                                  |
| **Prompt**     | A reusable prompt template that agents and playbooks can reference.                                             |
| **Tool**       | An executable function or integration that an agent can invoke, including tools exposed by MCP servers.         |
| **Skill**      | A reusable capability that agents can call.              |
| **Playbook**   | A multi-step agentic workflow composed of agents, prompts, and specs connected in a directed graph.             |
| **MCP Server** | A [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes tools and resources to agents. |
| **Spec**       | A free-form specification document referenced by playbooks and workflows.                                       |

## Features

### AI Playground

The **AI Playground** provides a live chat interface for testing agents in real time. Select a playbook, configure per-agent model overrides, and chat with the configured agentic flow. The playground streams responses using Server-Sent Events (SSE), visualises tool calls and "thinking" steps inline, and lets you enable or disable individual tools and skills on the fly. It also supports slash-prompt auto-completion from catalog prompts associated with the selected playbook.

### Agent Management

Create and configure agents by selecting an LLM model, writing system instructions in Markdown, and attaching tools and skills. Tools are shown grouped by category in the picker, including tools sourced from registered MCP servers. Agents can be created through a guided form or by editing the underlying JSON spec directly.

### Playbook Builder

The **Playbook Builder** is a three-step wizard for designing multi-step agentic workflows:

1. **Overview**: set the playbook's name, title, and description.
2. **Agentic Flow**: a drag-and-drop canvas where agent nodes are connected with edges. In addition to regular agent nodes, you can add orchestration nodes for **sequential**, **parallel**, and **loop** (with configurable max iterations) execution patterns.
3. **Resources**: attach playbook-level prompts, skills, and spec templates using multi-select pickers. Optionally configure a **Mia Flow** integration (mode, home project template, home prompt text).

Playbooks can also be authored as raw JSON using the built-in Monaco editor.

### Observability

The **Observability** page provides real-time monitoring of agent sessions.

The **Overview** tab shows aggregate statistics (total sessions, average response time, input/output/cached/thinking token counts) alongside charts for success rates, agent distribution, tool usage, sessions over time, and token consumption over time.

The **Sessions** tab lists all recorded sessions in a filterable, paginated table — filterable by playbook, date range, and user ID. Clicking a session opens a full event timeline showing every message, tool call, tool response, and handoff in chronological order.

### Model and Prompt Management

Manage LLM configurations and prompt templates as first-class catalog items. Model resources capture the provider, model identifier, optional endpoint URL, API key reference, capability flags (`supportsTools`, `supportsVision`), context window size, and default arguments. Prompts are authored in Markdown with a live preview pane and can be tagged for discoverability.

### Tool and Skill Discovery

Browse all tools and skills available in the system, including those exposed dynamically by registered MCP servers. Tool resources now carry a `spec` that records the tool type (`built-in` or `mcp-server`), runtime name, category, and enabled flag. Tools and skills are attachable to agents from the catalog.

### MCP Server Integration

Register external [Model Context Protocol](https://modelcontextprotocol.io/) servers to expand the tool ecosystem available to your agents. The registration form supports three transport types (**Streamable HTTP**, **SSE**, **stdio**) and five authentication schemes (**None**, **Bearer token**, **Basic**, **API Key**, **OAuth2**). Additional configuration options include a tool-name prefix, an option to expose MCP resources, and a per-tool confirmation requirement. Each registered server is stored as a catalog resource and its tools are automatically surfaced in the tool browser.

## Architecture Overview

AI Foundry is a single-page application that communicates with two backend services:

- **Catalog Engine**: stores and versions all catalog resources (agents, models, prompts, tools, skills, playbooks, MCP servers, specs). All CRUD operations are routed through `/api/catalog`.
- **Agent Development Kit (ADK)**: executes agents and streams their output back to the AI Playground using SSE.

All resources use the API version `new-ai.mia-platform.eu/v1alpha1` and are managed through a consistent REST interface on the Catalog Engine.

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
