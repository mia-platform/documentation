---
id: overview
title: Flow Overview
sidebar_label: Overview
---

:::caution Beta

Flow is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Flow Overview

**Flow** is Mia-Platform's AI-driven development web application. You open it in the browser, describe what you want to build in natural language, and the assistant generates the code, runs it live in a sandboxed preview, and deploys it to a Mia-Platform project when you are ready.

Flow brings together three things developers normally juggle separately:

- A **chat-first interface** for talking to an AI assistant that understands your project and the systems you have connected.
- A **live preview** of the generated code, updated as you iterate with the assistant.
- A **catalog of reusable AI building blocks** (agents, skills, prompts, specs, playbooks) that pre-configure the assistant for specific tasks, teams, or domains.

## What you can do with Flow

- **Generate full-stack applications from a prompt.** Frontend, backend, database schema, authentication, tests, and documentation are produced from a single natural-language description and iterated through follow-up messages.
- **Preview the result instantly.** Each generation is rendered in a live preview inside the Canvas, so you can interact with the application as it grows.
- **Reach external systems through MCP.** The assistant can call tools exposed by GitHub, GitLab, Azure DevOps, Atlassian, Grafana, Google Drive, Mia-Platform itself, and any custom MCP server you register.
- **Deploy to Mia-Platform.** A connected Mia-Platform project becomes the target for the generated code: pushing from Flow triggers the project's CI/CD pipeline.
- **Reuse work across teams.** Skills, agents, prompts, specs, and playbooks are stored as catalog items that can be shared, versioned, and combined into playbooks.

## The main areas of the application

| Area | What it is for |
|------|----------------|
| **Home** | Quick-start omnibar and recent conversations. |
| **Chat** | Conversational interface with the AI assistant. |
| **Canvas** | Code editor and live preview for the project tied to a conversation. |
| **Catalog** | Manage reusable agents, skills, prompts, specs, and playbooks. |
| **Connectors** | Authenticate to the external systems Flow can act on. |
| **Memories** | Browse, rename, and reopen past conversations. |
| **Settings** | Defaults, advanced options, and preferences. |

## Where to go next

- **[Getting started](./getting-started.md)**: sign in and open your first conversation.
- **[Connected tools](./basic-concepts/10_connected-tools.md)**: understand how MCP integrations expose external systems to the AI.
- **[Chat](./basic-concepts/20_chat.md)**: the conversational interface and how sessions are persisted.
- **[Code](./basic-concepts/30_code.md)**: the Canvas, live preview, and supported frameworks.
- **[Agentic AI](./basic-concepts/40_agentic-ai.md)**: agents, skills, playbooks, and how the assistant reasons.
