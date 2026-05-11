---
id: agent
title: Agent
sidebar_label: Agent
---

# Agent

An **Agent** is the central execution unit in AI Foundry. It combines a large language model (LLM) with a set of instructions, tools, and skills to produce a reusable, autonomous AI actor that can carry out a specific task — answering questions, calling external APIs, running code, or coordinating with other agents inside a [Playbook](./60_playbook.md).

In AI Foundry every agent is a catalog resource: it is versioned, queryable, and can be attached to other resources by name.

## How an agent works

At runtime the AI Foundry backend forwards a conversation to the agent's configured LLM. Along with the conversation it sends:

1. The agent's **system instruction** — a Markdown document that shapes the LLM's persona and constraints.
2. The schemas of the **tools** the agent is allowed to call.
3. Any **skills** the agent has been assigned, which it can invoke as sub-routines.

The LLM decides autonomously whether to respond directly or to call a tool/skill. If it calls a tool the platform executes it, feeds the result back into the conversation, and the LLM produces a final answer. This loop is sometimes called a **ReAct** (Reason + Act) cycle.

## Manifest

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Agent
metadata:
  name: support-agent          # RFC 1035 subdomain name, immutable after creation
  title: Support Agent         # Human-readable display name
  description: Answers customer support questions using the knowledge base.
  tags:
    - support
    - customer-facing
spec:
  model: gpt-4o                # Name of a Model resource (required)
  runtime_name: support-agent  # Unique runtime identifier (required)
  instruction: |               # System prompt, Markdown (required)
    You are a helpful support agent. Answer only questions related to our product.
    When you cannot find an answer, apologise and escalate.
  model_arguments:             # Optional: passed verbatim to the LLM provider
    temperature: 0.2
    max_tokens: 2048
  tools:                       # Optional: names of Tool resources
    - web-search
    - ticket-lookup
  skills:                      # Optional: names of Skill resources
    - summarise-thread
```

## Fields reference

### `metadata`

| Field         | Required | Description                                                                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Yes      | Unique identifier within the organization. Lowercase alphanumeric and hyphens, max 63 characters. Immutable after creation. |
| `title`       | Yes      | Display name shown in the UI.                                                                                               |
| `description` | Yes      | Short human-readable description of what the agent does.                                                                    |
| `tags`        | No       | Free-form tags for search and filtering.                                                                                    |
| `labels`      | No       | Key/value pairs for programmatic filtering via the Catalog API.                                                             |

### `spec`

| Field             | Required | Description                                                                                                 |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `model`           | Yes      | The `name` of a [Model](./20_model.md) resource that provides the LLM configuration.                        |
| `runtime_name`    | Yes      | A unique identifier used by the runtime to route requests to this agent. Typically matches `metadata.name`. |
| `instruction`     | Yes      | The system prompt sent to the LLM on every invocation. Supports Markdown.                                   |
| `model_arguments` | No       | A free-form JSON object passed through to the LLM provider (e.g. `temperature`, `max_tokens`).              |
| `tools`           | No       | List of [Tool](./40_tool.md) resource names the agent is allowed to call.                                   |
| `skills`          | No       | List of [Skill](./50_skill.md) resource names the agent can invoke.                                         |

## Designing effective agents

**Keep instructions focused.** Agents with a narrow, well-defined purpose outperform general-purpose agents. Prefer composing specialized agents in a [Playbook](./60_playbook.md) over loading a single agent with too many responsibilities.

**Constrain the tool surface.** Attach only the tools the agent actually needs. A smaller tool surface reduces the chance of the LLM making unintended calls and improves latency.

**Version your instructions.** The `instruction` field is the most impactful part of an agent. Treat it like code: review changes, test them in the [AI Playground](../overview.md#ai-playground), and maintain a changelog.

**Use `model_arguments` sparingly.** Low `temperature` values (0–0.3) are suitable for deterministic tasks like data extraction or classification. Higher values (0.7–1.0) suit creative or exploratory use cases.

## Testing an agent

The **AI Playground** provides a live chat interface where you can send messages to any registered agent and observe:

- The LLM's reasoning steps ("thinking") when available
- Tool call requests and their results
- The final response

You can toggle individual tools and skills on or off during a session to debug behaviour without modifying the agent manifest.

## See also

- [Model](./20_model.md): LLM configurations that back agents.
- [Tool](./40_tool.md): executable functions agents can call.
- [Skill](./50_skill.md): reusable capabilities that agents can invoke.
- [Playbook](./60_playbook.md): multi-step workflows that orchestrate agents.
