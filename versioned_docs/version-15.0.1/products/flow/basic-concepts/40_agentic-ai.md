---
id: agentic-ai
title: Agentic AI
sidebar_label: Agentic AI
---

:::caution Beta

Flow is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Agentic AI

The assistant behind Flow is not a single prompt: it is an **agent**, with explicit instructions, a set of callable tools, and the ability to chain its own actions. Agents, skills, prompts, specs, and playbooks are authored in **[AI Foundry](/products/ai-foundry/overview.md)**: the **AI Playbook Library** link in the sidebar opens AI Foundry in a new tab, where you pick which ones to use in your conversations. This page explains the building blocks and how they fit together.

## The building blocks

Every building block listed below is an [AI Foundry](/products/ai-foundry/overview.md) catalog resource, browsed and picked from AI Foundry via the **AI Playbook Library** link:

| Type | What it is | AI Foundry reference |
|------|------------|----------------------|
| **Agents** | A model + a tool selection + system instructions. The unit that actually answers your messages. | [Agent](/products/ai-foundry/basic-concepts/10_agent.md) |
| **Tools** | A discrete, executable capability an agent can call: a REST request, a database query, or any operation exposed by an MCP Server. | [Tool](/products/ai-foundry/basic-concepts/40_tool.md) |
| **MCP Server** | An external [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) server. Its tools are discovered and become attachable to agents like any other tool. | [MCP Servers](/products/ai-foundry/basic-concepts/70_mcp-server.md) |
| **Models** | LLM models available to agents. | [Model](/products/ai-foundry/basic-concepts/20_model.md) |
| **Prompts** | Reusable system prompts that shape the agent's tone, role, or workflow. | [Prompt](/products/ai-foundry/basic-concepts/30_prompt.md) |
| **Skills** | Reusable, named operations an agent can perform. Distinct from the tools exposed by [Connectors](/products/flow/basic-concepts/10_connected-tools.md). | [Skill](/products/ai-foundry/basic-concepts/50_skill.md) |
| **Spec Templates** | SpecKit command templates: structured commands the agent can apply to a project. | [Spec Templates](/products/ai-foundry/basic-concepts/80_spec.md) |
| **AI Playbooks** | Curated bundles of all of the above, applied as a single unit. | [Playbook](/products/ai-foundry/basic-concepts/60_playbook.md) |

## Agents

An agent has several components:

- a model with advanced configurations (e.g. temperature);
- a set of instructions;
- one or more tools;
- one or more skills.

**Tools** are discrete, executable capabilities an agent can call: a REST request, a database query, or any operation exposed by an [MCP Server](/products/ai-foundry/basic-concepts/70_mcp-server.md). Flow's built-in [connectors](/products/flow/basic-concepts/10_connected-tools.md) and any custom MCP server you register are both surfaced as tools this way, so an agent's tool selection is a pick from what those MCP servers (plus any built-in tools) expose.

**Skills** are reusable, named, higher-level operations an agent can perform — coarser-grained than a single tool call, and defined in [AI Foundry](/products/ai-foundry/basic-concepts/50_skill.md) as a distinct resource from tools.

Agents are defined in [AI Foundry](/products/ai-foundry/basic-concepts/10_agent.md); from Flow you pick which agent answers your conversation.

Different agents are useful for different jobs: for example, a fast agent for quick edits and a slower reasoning agent for complex planning.

## AI Playbooks

A **Playbook** is a named bundle of every artifact above and is the unit you usually apply to a conversation. Playbooks are authored in [AI Foundry](/products/ai-foundry/basic-concepts/60_playbook.md); inside Flow you pick one as a suggested chip when starting a conversation, or apply/change one mid-conversation from the active instructions picker in the chat compose bar:

```
AI Playbook
  ├── Agents  (model + tools + instructions)
  ├── Skills  (reusable agent operations)
  ├── Specs   (SpecKit templates)
  └── Prompts (system instructions)
```

A **Spec Template** lets agents run named commands against a project. When you invoke a command in chat, Flow looks it up among the active playbook's specs and runs the matching spec against the active project.

When a playbook is activated:

1. All tools from referenced agents are merged into the active tool selection.
2. System instructions are rebuilt from the playbook's prompts.
3. The playbook is pinned to the conversation and re-applied automatically the next time you reopen it.

### Default playbooks

Under **Settings → Advanced**, you can pick a **Default Chat Playbook** and a **Default Code Playbook**. The chosen playbook is applied automatically when a new conversation starts, so you always open Flow with the right setup for your use case. This is a personal preference and only affects your account.

## Reasoning and limits

When a response includes reasoning steps, Flow collapses them by default so the conversation stays focused on what is useful to the user; you can expand them to see the model's reasoning. The number of consecutive tool calls the assistant can make within a single turn is capped (50 by default) to keep conversations responsive.

## Putting it together

A typical workflow looks like this:

1. In [AI Foundry](/products/ai-foundry/overview.md), define **Skills** for the operations agents should perform, group them into **Agents**, wrap recurring tone or workflow choices in **Prompts**, and add **Specs** for repeatable commands.
2. Bundle everything into a **Playbook**.
3. Open Flow, pick the playbook (as a suggested chip on Home, or as your default under Settings → Advanced), and start a conversation: the assistant is already configured for the use case the playbook was built for.

If you want a playbook to be applied automatically every time you open Flow, set it as your default in **Settings → Advanced**.

## See also

- [Chat](/products/flow/basic-concepts/20_chat.md): where playbooks are applied to a conversation.
- [Connected tools](/products/flow/basic-concepts/10_connected-tools.md): the external systems agents can act on.
- [Code](/products/flow/basic-concepts/30_code.md): the Canvas where agent output becomes a running project.
