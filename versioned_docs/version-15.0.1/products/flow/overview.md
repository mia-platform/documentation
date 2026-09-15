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
- A **catalog of reusable AI building blocks** (agents, tools, MCP servers, skills, prompts, specs, playbooks) that pre-configure the assistant for specific tasks, teams, or domains.

## What you can do with Flow

- **Generate full-stack applications from a prompt.** Frontend, backend, database schema, authentication, tests, and documentation are produced from a single natural-language description and iterated through follow-up messages.
- **Preview the result instantly.** Each generation is rendered in a live preview inside the Canvas, so you can interact with the application as it grows.
- **Reach external systems through MCP.** The assistant can call tools exposed by GitHub, GitLab, Azure DevOps, Atlassian, Grafana, Google Drive, Mia-Platform itself, and any custom MCP server you register.
- **Deploy to Mia-Platform.** A connected Mia-Platform project becomes the target for the generated code: pushing from Flow triggers the project's CI/CD pipeline.

## The main areas of the application

| Area | What it is for |
|------|----------------|
| **Home** | Quick-start omnibar and recent conversations. |
| **Chat** | Conversational interface with the AI assistant, without the Canvas. |
| **Code** | The same conversational interface paired with the Canvas: the code editor and live preview for the project tied to the conversation. |
| **Projects** | Browse your own, starred, and shared projects, and discover projects shared by others. |
| **Connected Tools** | Authenticate to the external systems Flow can act on. |
| **Memories** | Browse, rename, and reopen past conversations. |
| **Learn** | Onboarding material and guided tutorials. |
| **Settings** | Theme, advanced options, analytics, privacy, billing, and feedback. |

Agents, tools, MCP servers, skills, prompts, and playbooks are not managed inside Flow itself: the **AI Playbook Library** link in the sidebar opens [AI Foundry](/products/ai-foundry/overview.md) in a new tab, where these building blocks are authored and organized (see [Agentic AI](/products/flow/basic-concepts/40_agentic-ai.md)).

## Where to go next

- **[Getting started](/products/flow/getting-started.md)**: sign in and open your first conversation.
- **[Connected tools](/products/flow/basic-concepts/10_connected-tools.md)**: understand how MCP integrations expose external systems to the AI.
- **[Chat](/products/flow/basic-concepts/20_chat.md)**: the conversational interface and how sessions are persisted.
- **[Code](/products/flow/basic-concepts/30_code.md)**: the Canvas, live preview, and supported frameworks.
- **[Agentic AI](/products/flow/basic-concepts/40_agentic-ai.md)**: agents, skills, playbooks, and how the assistant reasons.
