---
id: ai-providers
title: AI Providers
sidebar_label: AI Providers
---

# AI Providers

The **AI Providers** pages monitor the telemetry emitted by every component that calls a model on your behalf, and by the model providers behind them:

- AI Foundry's own services, such as the agent runtime.
- The **AI Gateway**, which routes every model call to the configured LLM providers.
- **External clients** running on developers' machines, such as Claude Code or GitHub Copilot Chat, once they are configured to send telemetry to AI Foundry (see [Connections](/products/ai-foundry/overview.md#connections)).

This telemetry follows the [OpenTelemetry](https://opentelemetry.io/) standard and is explored from two complementary angles:

| Page          | Question it answers                                                        | Granularity                         |
| ------------- | -------------------------------------------------------------------------- | ----------------------------------- |
| **AI Traces** | What happened in this request, and who made it?                            | Single trace, per user.             |
| **AI Metrics** | How is the system behaving overall, and how much is it costing?            | Aggregated series, per tenant.      |

Both pages are in the **Observability** section of the AI Foundry sidebar and are available to users with observability access.

## AI Traces

**AI Traces** lets you explore generative AI traces, their observations, and their latency. A trace follows a single request end to end, for example an agent turn with its model calls and tool calls, or a request issued by an IDE client, and records its timing, token usage, and cost.

### Dashboards and trace list

The page offers dashboards that summarize **latency**, **cost**, and **usage** over the selected scope, with breakdowns by dimensions such as model, playbook, agent, skill, and user, and a **Traces** tab listing the individual traces.

You can filter by the service that produced the traces, by user, and by time range. Filters are applied when you select **Search**, and are kept in the page URL.

### Trace detail

Opening a trace shows its tree of observations, from the root request down to each model and tool call, with their attributes and timing. Use it to find which step of a request was slow, failed, or consumed most tokens.

:::info Privacy
Prompts, completions, and personal fields are redacted when traces are displayed. You can reveal them with **Show sensitive data**. Revealing another user's data is recorded in the audit log.

Users without the observability role see only their own traces; the observability role can widen the scope to the whole tenant.
:::

## AI Metrics

**AI Metrics** shows throughput, latency, tokens, and cost from the metrics pipeline. Where AI Traces helps you investigate single requests, AI Metrics helps you follow trends and compare components over time.

The dashboards are organized by the source of the data, for example:

- the models and the calls made to LLM providers through the AI Gateway, where model cost is measured;
- the tools called by agents;
- the AI Foundry APIs;
- the external clients running on developers' machines.

You can filter the dashboards by agent, model, tool, and time range. When a filter does not apply to a given chart, the chart says so rather than showing misleading data.

:::note
Metrics are aggregated for your organization and tenant, and carry no user dimension: they are never scoped to a single person. To see usage and cost for a specific user, use [AI Traces](#ai-traces).

External clients appear only once they are configured to report the tenant they work for. Some detailed breakdowns, such as per-plugin or per-skill usage, also require the client to send tool details.
:::

## See also

- [AI Sessions](/products/ai-foundry/observability/20_ai_sessions.md): conversations and workflow runs, one at a time.
- [AI Resources](/products/ai-foundry/observability/10_ai_resources.md): insights and distribution of the assets you publish.
- [Model](/products/ai-foundry/basic-concepts/10_model.md): how models are served through the AI Gateway.
