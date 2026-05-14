---
id: model
title: Model
sidebar_label: Model
---

:::caution Beta

AI Foundry is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Model

A **Model** is a catalog resource that wraps the configuration needed to connect to a large language model (LLM) provider. It decouples the LLM choice from the agents that use it: agents reference a model by name, so swapping the underlying model (or updating API credentials) requires changing only the Model resource without touching any Agent.

## What a model encapsulates

Modern LLM deployments vary widely: a model may be hosted by a third-party provider (OpenAI, Anthropic, Mistral …), running on a self-managed instance, or exposed through a unified proxy such as [LiteLLM](https://docs.litellm.ai/). A Model resource normalizes all these cases into a single schema.

At runtime the AI Foundry backend reads the Model resource to determine:

- **Which provider** to call (`type`).
- **Where** to call it (`url`).
- **How to authenticate** (`secretVar`: the name of an environment variable holding the API key, so that secrets never enter the catalog).
- **Default parameters** to pass alongside every request (`arguments`).

## Manifest

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Model
metadata:
  name: gpt-4o                  # RFC 1035 subdomain name, immutable
  title: GPT-4o
  description: OpenAI GPT-4o via the platform proxy.
  tags:
    - openai
    - production
spec:
  type: openai                  # Required: LLM provider identifier
  url: https://api.openai.com/v1  # Optional: override the default provider URL
  secretVar: OPENAI_API_KEY     # Optional: env var containing the API key
  litellm: false                # Optional: route through LiteLLM proxy
  arguments:                    # Optional: default parameters for every request
    temperature: 0.7
    max_tokens: 4096
```

### LiteLLM example

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Model
metadata:
  name: local-llama3
  title: Llama 3 (local)
  description: Llama 3 8B served locally via Ollama, proxied through LiteLLM.
spec:
  type: ollama/llama3
  url: http://litellm-proxy.example.com/v1
  litellm: true
```

## Fields reference

### `metadata`

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Unique identifier. Must match the value used in `Agent.spec.model`. |
| `title` | Yes | Display name shown in the UI and in the agent creation form's model picker. |
| `description` | Yes | Short description of the model's capabilities or intended use. |
| `tags` | No | Free-form tags for filtering. |
| `labels` | No | Key/value pairs for API-level filtering. |

### `spec`

| Field | Required | Description |
|---|---|---|
| `type` | Yes | Provider identifier string. Common values: `openai`, `anthropic`, `azure`, `ollama/<model>`, `mistral`. Passed to the LLM client unchanged. |
| `url` | No | Base URL of the LLM API endpoint. Defaults to the provider's public endpoint when omitted. Must be a valid URL. |
| `secretVar` | No | Name of the environment variable that holds the API key. The key is never stored in the catalog; only its variable name is. |
| `litellm` | No | When `true`, requests are routed through a LiteLLM proxy, enabling a unified interface for any provider LiteLLM supports. Defaults to `false`. |
| `arguments` | No | A free-form JSON object with default parameters applied to every request (e.g. `temperature`, `max_tokens`, `top_p`). Individual agents can override these via `Agent.spec.model_arguments`. |

## Credential management

:::caution
Never store API keys in the `spec` directly. Use `secretVar` to reference an environment variable injected at deployment time.
:::

The recommended pattern is:

1. Store the API key in your platform's secret management system.
2. Expose it to the AI Foundry service as an environment variable (e.g. `OPENAI_API_KEY`).
3. Set `spec.secretVar: OPENAI_API_KEY` in the Model manifest.

## Relationship to agents

Multiple agents can reference the same Model. When an [Agent](./10_agent.md) is created, the model picker lists all available Model resources by their `title`. The agent stores the model's `name` in `spec.model`.

Agent-level `model_arguments` are **merged on top of** the model's default `arguments`. Agent-level values take precedence.

## See also

- [Agent](./10_agent.md): resources that reference a model.
