---
id: guardrail
title: Guardrail
sidebar_label: Guardrail
---

# Guardrail

A **Guardrail** is a tenant catalog resource that enforces safety and compliance policies on the traffic between agents and models. Each guardrail is a Python function that receives the request or the response and returns one of three decisions: **allow**, **block** (with a reason), or **modify** (for example, to redact personal data).

Guardrails run on the AI Gateway, but a guardrail does nothing on its own: it applies only to the [Agents](/products/ai-foundry/basic-concepts/20_agent.md) it is explicitly attached to. This keeps each policy scoped to the agents that need it, instead of affecting every model call in the tenant.

## Guardrail reference

Besides the common metadata (`title`, `name`, `description`, and `tags`), a Guardrail has the following spec fields.

| Field        | Type             | Required | Description                                                                                                                                         |
| ------------ | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`       | string (Python)  | Yes      | Python source defining `apply_guardrail(inputs, request_data, input_type)` (or `async def`). Up to 20,000 characters, plain ASCII only.             |
| `mode`       | array of strings | Yes      | When the gateway runs the guardrail. At least one of `pre_call`, `post_call`, `during_call`, `logging_only`, `pre_mcp_call`, `during_mcp_call`.     |
| `enabled`    | boolean          | No       | Whether the guardrail runs. Defaults to `true`. Disabling it keeps the configuration without running it.                                           |
| `identifier` | string           | -        | The guardrail's identifier on the AI Gateway. Set by the platform, read-only.                                                                      |
| `tenant`     | string           | -        | The tenant that created the guardrail. Set by the platform, read-only.                                                                             |

The `name` can contain only lowercase letters, digits, and hyphens, and cannot be changed after creation.

### Modes

| Mode              | Label in the form            | When it runs                                         |
| ----------------- | ---------------------------- | ---------------------------------------------------- |
| `pre_call`        | Request                      | Before the request reaches the model.                |
| `post_call`       | Response                     | After the model responds.                            |
| `during_call`     | Parallel                     | Alongside the model call.                            |
| `logging_only`    | -                            | Only on the data that is logged.                     |
| `pre_mcp_call`    | Before MCP Tool Call         | Before an MCP tool call.                             |
| `during_mcp_call` | During MCP Tool Call         | During an MCP tool call.                             |

## Writing guardrail code

A guardrail's code defines a single function:

```python
def apply_guardrail(inputs, request_data, input_type):
    for text in inputs["texts"]:
        if regex_match(text, r"\d{3}-\d{2}-\d{4}"):
            return block("SSN detected")
    return allow()
```

- `inputs` contains the texts, images, tools, tool calls, structured messages, and model of the request or response.
- `request_data` contains the model, user, team, and metadata of the call.
- `input_type` is `"request"` or `"response"`.

The function returns `allow()`, `block(reason)`, or `modify(...)`, where `modify` accepts replacement `texts`, `images`, or `tool_calls`. Helpers are available for regular expressions, JSON parsing and validation, URLs, and text handling.

The code runs in a restricted environment: imports are not available, and the outbound HTTP primitives (`http_request`, `http_get`, `http_post`) are refused.

### Templates

The **Template** selector prefills the code editor with a starting point that you can then adapt:

- **Empty template**
- **Block SSN**
- **Redact emails**
- **Block SQL injection**
- **Validate JSON response**
- **Check URLs in response**
- **Combined PII + SQL check**

## Creating a guardrail

From the **Guardrails** page, in the **Building Blocks** section of the sidebar, select **New Guardrail**. The **Create Guardrail** form has two sections:

1. **Overview**: title, name (auto-derived from the title), description, and tags.
2. **Configuration**: one or more **Mode** values, a **Template**, the **Guardrail code (Python)** editor, and the **Enabled** switch.

The **Guardrails** list shows each guardrail's modes and its state (**enabled** or **disabled**).

## Attaching a guardrail to an agent

You attach guardrails from the agent side, using the **Guardrails** field of the agent form, which is stored in the agent's `spec.guardrails`. A guardrail that no agent references is never applied: an empty attachment means no agent, never all agents.

When an attached guardrail blocks a request, the user sees a clean error message saying that the request was blocked by a content policy attached to the agent, without the internal details of the guardrail.

:::caution
Tenant guardrails apply only to requests made through the AI Foundry agent runtime, such as the AI Playground and playbooks. Tools that call a model with their own virtual key, such as Claude Code or GitHub Copilot connected directly to the AI Gateway, are not covered.
:::

## See also

- [Agent](/products/ai-foundry/basic-concepts/20_agent.md): attaches guardrails through its `spec.guardrails` field.
- [Model](/products/ai-foundry/basic-concepts/10_model.md): the LLM configurations whose traffic guardrails inspect.
- [MCP Server](/products/ai-foundry/basic-concepts/14_mcp-server.md): the servers whose tool calls the MCP modes cover.
- [Memory](/products/ai-foundry/basic-concepts/15_memory.md): long-term recall for agents.
