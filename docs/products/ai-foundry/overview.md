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
| **Skill**      | A reusable capability that agents can call; skills can be locked to prevent accidental invocation.              |
| **Playbook**   | A multi-step agentic workflow composed of agents, prompts, and specs connected in a directed graph.             |
| **MCP Server** | A [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes tools and resources to agents. |
| **Spec**       | A free-form specification document referenced by playbooks and workflows.                                       |

## Features

### AI Playground

The **AI Playground** provides a live chat interface for testing agents in real time. It streams responses from the agent using Server-Sent Events (SSE), visualizes tool calls and "thinking" steps inline, and lets you enable or disable individual tools and skills on the fly. Conversations can be exported as PDF or Markdown.

### Agent Management

Create and configure agents by selecting an LLM model, writing system instructions in Markdown, and attaching tools and skills. Agents can be created through a guided form or by editing the underlying JSON spec directly.

### Playbook Builder

The **Playbook Builder** is a visual flow editor for designing multi-step agentic workflows. Each node in the graph represents a resource (agent, prompt, or spec), and edges define the execution order and data flow between nodes. Playbooks can also be authored as raw JSON for full control.

### Model and Prompt Management

Manage LLM configurations and prompt templates as first-class catalog items. Models are referenced by agents and can carry custom runtime parameters. Prompts are rendered as Markdown and can be tagged for discoverability.

### Tool and Skill Discovery

Browse all tools and skills available in the system, including those exposed dynamically by registered MCP servers. Tools and skills are attachable to agents from the catalog.

### MCP Server Integration

Register external [Model Context Protocol](https://modelcontextprotocol.io/) servers to expand the tool ecosystem available to your agents. Each registered server is stored as a catalog resource and its tools are automatically surfaced in the tool browser.

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
