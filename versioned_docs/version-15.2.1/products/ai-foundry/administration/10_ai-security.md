---
id: ai-security
title: AI security
sidebar_label: AI security
---

# AI security

Every model call in AI Foundry goes through the **AI Gateway**, built on [LiteLLM](https://www.litellm.ai/). The AI security pages in the **Administration** section of the sidebar are where administrators decide who can reach the gateway, which models they can call, how much they can spend, and which provider credentials pay for the calls:

- **Virtual Keys**: the credentials that users and machines outside AI Foundry use to call models.
- **Teams**: groups that share model access, budgets, and rate limits.
- **LLM Credentials**: the provider keys that [Models](/products/ai-foundry/basic-concepts/10_model.md) pay their calls with.

All three are catalog resources, scoped to your tenant, and require administration permissions to manage.

## How secrets are handled

Virtual keys and LLM credentials follow the same principle: **the secret lives only in the AI Gateway**, while the catalog resource holds everything else, such as who the key is for, what it may call, and what it may spend. This way, keys and credentials can be listed, searched, owned, and audited like any other catalog resource, without the secret ever being readable again after it is saved.

As a consequence, a secret cannot be retrieved later: a virtual key is shown only once, when it is issued, and a provider credential can only be replaced, never read back.

## Virtual Keys

A **virtual key** lets a client that is not part of AI Foundry use the platform's models without holding a provider credential. Typical clients are coding assistants such as Claude Code or GitHub Copilot, and scripts or CI jobs. See [Third-party integrations](/products/ai-foundry/connections/20_third-party-integrations.md) for how to configure a tool with a virtual key.

When you issue a key, you define:

| Setting                   | Description                                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Issued to**             | Who the key is for. All costs, tokens, and traces are attributed to it, so it cannot change after the key is issued. |
| **Purpose**               | What the key is used for, for example Claude Code, VS Code, or a script. It makes the key recognizable in spend reports and traces.           |
| **Team**                  | The team the key belongs to, if any.                                                                                                           |
| **Playbook**              | Optionally, the playbook the key's usage is attributed to. This is the way to measure the cost of a playbook used from an IDE or a script. Issue one key per playbook to measure them separately. It cannot change after issue. |
| **Models**                | The models the key may call.                                                                                                                  |
| **Budget**                | A spending limit in USD, reset at every budget window.                                                                                        |
| **Rate limits**           | Maximum requests and tokens per minute.                                                                                                       |
| **Lifetime**              | How long the key is valid before it expires.                                                                                                  |

Expired keys are renewed from their own page. Treat virtual keys like passwords: never share them or commit them to a repository, and issue a separate key for each person and purpose so that usage stays attributable.

:::info
Besides the keys you issue, each tenant has its own virtual key, managed automatically, that AI Foundry uses for the conversations run by its agents.
:::

## Teams

A **team** decides once, for everyone in it, which models its virtual keys may call and how much they may spend together. For each team you can define:

- the **models** its keys may call: a key in a team can only use the models allowed by both the key and the team;
- a **budget** for the whole team, and a default **per-member budget**;
- **rate limits** in requests and tokens per minute;
- its **members**.

The team page also shows the team's spend. Suspending a team refuses every key that belongs to it, which is the quickest way to cut access for a group.

Each tenant also has a team of its own, created automatically.

## LLM Credentials

An **LLM credential** is a provider API key that [Models](/products/ai-foundry/basic-concepts/10_model.md) use to pay for their calls. A model either references an LLM credential or carries a key of its own; several models can share the same credential, so that rotating a provider key is a single change instead of one per model.

When you create an LLM credential, you choose the provider and enter its key and any provider-specific settings. You can later **rotate** the credential to replace its key; the models that use it pick up the new key automatically.

## Monitor usage and spend

Everything a virtual key, a team, or an LLM credential enables is attributed in the observability pages: see [AI Providers](/products/ai-foundry/observability/30_ai_providers.md) for traces and metrics of model calls, including those made from developers' machines.

## See also

- [Model](/products/ai-foundry/basic-concepts/10_model.md): how models are served through the AI Gateway.
- [Guardrail](/products/ai-foundry/basic-concepts/17_guardrail.md): policies applied to model traffic.
- [API security](/products/ai-foundry/administration/20_api-security.md): credentials for the external systems that workflows call.
