---
id: playbook
title: Playbook
sidebar_label: Playbook
---

# Playbook

A **Playbook** is a catalog resource that describes a multi-step agentic workflow. It composes agents, prompts, skills, and spec templates into a directed graph where each node performs a discrete task and edges define the flow of control and data between them.

Playbooks move the AI platform from single-agent interactions toward **agentic pipelines**: complex, stateful workflows where the output of one agent feeds the input of the next, loops repeat until a condition is met, and parallel branches execute concurrently.

![AI Foundry Playbooks](../img/ai_foundry_playbooks.png)

## Playbook reference

| Field                         | Required | Description                                                                                 |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `Title`                       | Yes      | Display name shown in the UI.                                                               |
| `Name`                        | Yes      | Unique identifier, auto-derived from Title. Lowercase letters, digits, dots, and hyphens only (must start and end with an alphanumeric character), max 63 characters. Immutable after creation. |
| `Description`                 | Yes      | Short description of the workflow's purpose.                                                |
| `Tags`                        | No       | Free-form, multi-value tags used to make the playbook easier to find and filter.             |
| `Prompts`                     | No       | Playbook-level prompts injected into every agent node in the flow.                           |
| `Skills`                      | No       | Skills available to all agents in this playbook.                                            |
| `Spec Templates`              | No       | Spec templates available to all agents in this playbook.                                    |
| `Built-in Agents (reference)` | No       | Read-only summary of built-in agent nodes (external AI agents not managed by the Catalog) placed in the Agentic Flow. Managed from the flow canvas, not from this list.               |

## Mia Flow integration

A playbook can optionally be exposed in [Mia Flow](/products/ai-foundry/overview.md). This is configured in the Overview step's Configuration section:

| Field                | Required                      | Description                                                                                     |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `Enable on Mia Flow` | No                              | Master switch. When off, none of the fields below apply and the playbook is not exposed in Mia Flow. |
| `Show on Home`       | No                              | Shown only when `Enable on Mia Flow` is on. When enabled, this playbook appears as a quick-launch button on the Mia Flow home screen. |
| `Launch Mode`        | Yes, when Mia Flow is enabled  | Shown only when `Enable on Mia Flow` is on. Default UI to open when this playbook is launched from Mia Flow: `Chat`, `Code`, or `Both`. |

## Playbook flow model

A Playbook workflow at its core comprises a set of orchestrated agents working sequentially, in parallel or loop.

You can either deploy a single built-in agent (an external AI agent not managed by the Catalog, like a model provider or third-party assistant) or a combination of agents managed by the Catalog.

## The visual builder

![AI Foundry Playbook Builder](../img/ai_foundry_playbook_builder.png)

The **Playbook Builder** in the AI Foundry UI provides a drag-and-drop canvas for designing and editing without writing JSON:

1. **Overview step**: set name, title, and description.
2. **Agentic Flow step**: add nodes from a palette, draw edges between them, and configure node properties.
3. **Resources step**: attach playbook-level prompts, skills, and specs using multi-select pickers.

Switching to **JSON mode** replaces the visual builder with a full-spec JSON editor, which is useful for bulk edits or for copying playbooks across environments.

## Resource scoping

Resources (prompts, skills, specs) can be attached at two levels:

- **Playbook level**: available to every node in the flow.
- **Node level**: available only to that specific node. Node-level lists are merged with the playbook-level lists.

This allows a common baseline (e.g. a shared style guide) while letting individual nodes use specialized resources.

## See also

- [Agent](/products/ai-foundry/basic-concepts/10_agent.md): the execution unit referenced by playbook nodes.
- [Prompt](/products/ai-foundry/basic-concepts/30_prompt.md): reusable text injected into nodes.
- [Skill](/products/ai-foundry/basic-concepts/50_skill.md): reusable capabilities attached at playbook or node level.
- [Spec Templates](/products/ai-foundry/basic-concepts/80_spec.md): structured documents referenced by nodes.
