---
id: tool
title: Tool
sidebar_label: Tool
---

# Tool

A **Tool** is a catalog resource that describes a discrete, executable capability that an [Agent](./10_agent.md) can invoke during a conversation. Tools are how agents extend their abilities beyond pure language generation: they can call REST APIs, query databases, run code, search knowledge bases, or interact with any external system.

## Tools in LLM-based systems

Modern LLMs support a mechanism commonly called **function calling** (or **tool use**). The model receives a set of tool definitions alongside the conversation. Each definition contains a name, a description, and a JSON Schema for the expected parameters. When the model decides a tool should be called it emits a structured tool-call request, which the platform executes and feeds back as a new message. The model then incorporates the result into its response.

AI Foundry acts as the intermediary: it reads the list of tool names from `Agent.spec.tools`, resolves them to Tool resources, assembles their schemas into the tool-call payload, and routes execution results back to the LLM.

:::note
Tools exposed by [MCP Servers](./70_mcp-server.md) are surfaced automatically inside the tool browser and can be attached to agents the same way as manually registered tools.
:::

## Manifest

A Tool resource is intentionally lightweight. The behavioral definition (input/output schema, implementation) lives in the runtime system or in the associated MCP server. The catalog entry provides the metadata needed for discovery and governance.

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Tool
metadata:
  name: web-search             # Name referenced in Agent.spec.tools
  title: Web Search
  description: |
    Performs a web search and returns the top results.
    Input: a query string. Output: a list of result snippets with URLs.
  tags:
    - search
    - external
```

## Fields reference

### `metadata`

| Field         | Required | Description                                                                                                                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Yes      | Unique identifier. Referenced verbatim in `Agent.spec.tools`.                                                                                                               |
| `title`       | Yes      | Display name shown in the UI and in the agent tool picker.                                                                                                                  |
| `description` | Yes      | Plain-language description of what the tool does, what inputs it expects, and what it returns. This description is part of what helps the LLM decide when to call the tool. |
| `tags`        | No       | Free-form tags for filtering.                                                                                                                                               |
| `labels`      | No       | Key/value pairs for API-level filtering.                                                                                                                                    |

### `spec`

The `spec` of a Tool resource is empty. All runtime behavior is managed outside the catalog, typically in the backend service or MCP server that implements the tool. The catalog record exists purely for registration, discovery, and governance.

## Writing good tool descriptions

The `description` in `metadata` is surfaced to the LLM when the agent decides which tool to call. A clear, accurate description directly improves agent behavior:

- **State what the tool does** in the first sentence: "Searches the internal knowledge base for articles matching a query."
- **Describe the input format**: "Input: a natural-language question string."
- **Describe the output format**: "Output: up to five article snippets with titles and URLs."
- **Note limitations**: "Only covers articles published after 2023-01-01."

Avoid vague names or descriptions: the LLM uses them to reason about when a tool is appropriate.

## Attaching tools to agents

Tools are attached to an agent by listing their `name` values in `Agent.spec.tools`. The AI Foundry UI provides a multi-select dropdown populated from all registered Tool resources.

In the **AI Playground** you can toggle individual tools on or off for a live session without modifying the agent manifest. This is useful for debugging unexpected tool calls.

## Tools vs. Skills

Both tools and skills extend what an agent can do, but they operate at different levels of abstraction:

| Aspect         | Tool                             | Skill                                                          |
| -------------- | -------------------------------- | -------------------------------------------------------------- |
| Granularity    | Fine-grained, single operation   | Higher-level, multi-step capability                            |
| Implementation | External service / MCP server    | Documented in the catalog as a [Skill](./50_skill.md) manifest |
| Called by      | Agent (via LLM function-calling) | Agent or Playbook node                                         |
| Can be locked? | Yes, in the Playground           | Yes, prevents accidental invocation                            |

## See also

- [Agent](./10_agent.md): attaches tools via `spec.tools`.
- [Skill](./50_skill.md): higher-level reusable capabilities.
- [MCP Server](./70_mcp-server.md): a server that exposes multiple tools through the Model Context Protocol.
