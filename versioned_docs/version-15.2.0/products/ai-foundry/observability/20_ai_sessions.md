---
id: ai-sessions
title: AI Sessions
sidebar_label: AI Sessions
---

# AI Sessions

The **AI Sessions** pages monitor individual executions of your AI applications, one at a time. Use them when you want to know what happened in a specific conversation or run, and to spot patterns across many of them.

- **Platform Sessions** covers conversational sessions: every session opened with an agent or a [playbook](/products/ai-foundry/basic-concepts/21_playbook.md) in the suite applications, such as the AI Playground and the AI Foundry assistant.
- **Workflow Runs** covers the executions of [agentic workflows](/products/ai-foundry/basic-concepts/22_workflow.md), from those still in progress to those that finished recently.

Both pages are in the **Observability** section of the AI Foundry sidebar.

## Platform Sessions

**Platform Sessions** lists every session opened in the suite applications, with its timeline, token usage, latency, and cost, and lets you drill down to a single conversation. Sessions are recorded by the AI Foundry agent runtime itself, so this page works without any additional observability service.

### Dashboards and session list

The page is organized in tabs:

- **Overview**, **Usage**, **Latency**, and **Cost** dashboards summarize activity in the selected scope: how many sessions ran, which playbooks, agents, models, and tools they used, how long they took, and how many tokens and how much money they consumed.
- **Sessions** lists the individual sessions, with their agent, user, size, duration, and date.

The Usage, Latency, and Cost dashboards are built on the same trace data as [AI Traces](/products/ai-foundry/observability/30_ai_providers.md#ai-traces). They are available only when that trace store is deployed on your installation.

### Filters

A filter bar narrows every tab by playbook, model, user, and time range. More filters let you isolate outliers, such as unusually long, slow, or token-heavy sessions. Filters are applied when you select **Search**, and are kept in the page URL, so you can share a filtered view with a colleague.

### Session detail

Opening a session shows its full event timeline, as a list or as a graph: user and agent messages, tool calls and their results, and hand-offs between agents in multi-agent playbooks, each attributed to the agent that produced it. Token usage is shown per event when the model provider reports it. You can also leave feedback on the session.

:::info Privacy
Message content is hidden by default and shown only when you explicitly reveal it. Users without the observability role can only see their own sessions; the observability role can widen the scope to the whole tenant.
:::

## Workflow Runs

**Workflow Runs** is a live board of every agentic workflow execution in flight, and of those that finished recently. Runs are read from the workflow engine and grouped in three columns:

- **Running**: executing now.
- **Waiting**: stopped on an approval step, waiting for a person.
- **Done**: finished, whatever the outcome.

You can narrow the board to a single workflow, and turn on **Live** mode to refresh it automatically while the page is open. Each card links to the run's own page, where you can follow its step timeline, inspect inputs and results, approve or reject a waiting step, and cancel the run. See [Build, run, and test agentic workflows](/products/ai-foundry/orchestration/20_workflows.md) for details.

:::note
The Workflow Runs page is visible to users who can read agentic workflows, independently of the observability role.
:::

### From a run to its conversations

A workflow's Playbook steps open agent sessions like any other conversation, so you can inspect them in Platform Sessions. Filter by the playbook and by the user that started the run to find them.

## See also

- [AI Resources](/products/ai-foundry/observability/10_ai_resources.md): insights and distribution of the assets you publish.
- [AI Providers](/products/ai-foundry/observability/30_ai_providers.md): traces and metrics from the services and clients that call models.
- [Build, run, and test playbooks](/products/ai-foundry/orchestration/10_playbooks.md): test a playbook and debug its sessions.
