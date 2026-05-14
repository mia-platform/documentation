---
id: agentic-ai
title: Agentic AI
sidebar_label: Agentic AI
---

:::caution Beta

Flow is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Agentic AI

The assistant behind Flow is not a single prompt: it is an **agent**, with explicit instructions, a set of callable tools, and the ability to chain its own actions. Agents, skills, prompts, specs, and playbooks are authored in **[AI Foundry](../../ai-foundry/overview.md)** and surfaced inside Flow through the Catalog page, where you pick which ones to use in your conversations. This page explains the building blocks and how they fit together.

## The building blocks

Every building block listed below is a [AI Foundry](../../ai-foundry/overview.md) catalog resource. Inside Flow, the **Catalog** page is the place where you browse them and decide which ones to apply to your conversations:

| Type | What it is | AI Foundry reference |
|------|------------|----------------------|
| **Agents** | A model + a tool selection + system instructions. The unit that actually answers your messages. | [Agent](../../ai-foundry/basic-concepts/10_agent.md) |
| **Skills** | Reusable, named operations an agent can perform. Distinct from the tools exposed by [Connectors](./10_connected-tools.md). | [Skill](../../ai-foundry/basic-concepts/50_skill.md) |
| **Specs** | SpecKit command templates: structured commands the agent can apply to a project. | [Spec](../../ai-foundry/basic-concepts/80_spec.md) |
| **Prompts** | Reusable system prompts that shape the agent's tone, role, or workflow. | [Prompt](../../ai-foundry/basic-concepts/30_prompt.md) |
| **AI Playbook Library** | Curated bundles of all of the above, applied as a single unit. | [Playbook](../../ai-foundry/basic-concepts/60_playbook.md) |

## Agents

An agent has three things: a model, a set of instructions, and the tools it is allowed to use. Agents are defined in [AI Foundry](../../ai-foundry/basic-concepts/10_agent.md); from Flow you pick which agent answers your conversation.

Different agents are useful for different jobs: for example, a fast agent for quick edits and a slower reasoning agent for complex planning.

## Skills

Skills are reusable, named operations that agents can perform. They are defined in [AI Foundry](../../ai-foundry/basic-concepts/50_skill.md) and are distinct from the **tools** that come from [Connectors](./10_connected-tools.md) (which expose external systems like GitHub or Jira).

A skill bundles a piece of logic together with the prompt that tells the agent how and when to use it. Any agent that includes a skill in its configuration can invoke it during a conversation.

## SpecKit commands

**SpecKit** lets agents run named commands against a project. Each command is a Catalog item of type **Spec** that bundles a prompt template and the steps the agent should follow.

When you invoke a command in chat, Flow looks it up in the Catalog and runs the matching spec against the active project.

## AI Playbooks

A **Playbook** is a named bundle of every artifact above and is the unit you usually apply to a conversation. Playbooks are authored in [AI Foundry](../../ai-foundry/basic-concepts/60_playbook.md) and made available inside Flow through the Catalog:

```
AI Playbook
  ├── Agents  (model + tools + instructions)
  ├── Skills  (reusable agent operations)
  ├── Specs   (SpecKit templates)
  └── Prompts (system instructions)
```

When a playbook is activated:

1. All tools from referenced agents are merged into the active tool selection.
2. System instructions are rebuilt from the playbook's prompts.
3. The playbook is pinned to the conversation and re-applied automatically the next time you reopen it.

### Default playbooks

Under **Settings → Advanced**, you can pick a **Default Chat Playbook** and a **Default Code Playbook**. The chosen playbook is applied automatically when a new conversation starts, so you always open Flow with the right setup for your use case. This is a personal preference and only affects your account.

## Reasoning and limits

For heavy reasoning models, Flow hides internal chain-of-thought from the chat by default, so responses stay focused on what is useful to the user. The number of consecutive tool calls per agent turn is capped to keep conversations responsive: if a task needs more steps, the agent splits the work across multiple turns.

## Putting it together

A typical workflow looks like this:

1. In [AI Foundry](../../ai-foundry/overview.md), define **Skills** for the operations agents should perform, group them into **Agents**, wrap recurring tone or workflow choices in **Prompts**, and add **Specs** for repeatable commands.
2. Bundle everything into a **Playbook**.
3. Open Flow, pick the playbook from the Catalog, and start a conversation: the assistant is already configured for the use case the playbook was built for.

If you want a playbook to be applied automatically every time you open Flow, set it as your default in **Settings → Advanced**.

## See also

- [Chat](./20_chat.md): where playbooks are applied to a conversation.
- [Connected tools](./10_connected-tools.md): the external systems agents can act on.
- [Code](./30_code.md): the Canvas where agent output becomes a running project.
