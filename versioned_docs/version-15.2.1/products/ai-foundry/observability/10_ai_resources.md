---
id: ai-resources
title: AI Resources
sidebar_label: AI Resources
---

# AI Resources

The **AI Resources** pages monitor the AI assets you publish in AI Foundry, such as [playbooks](/products/ai-foundry/basic-concepts/21_playbook.md), their agents, skills, and tools, and help you answer two questions:

- **Are my assets working well?** **Playbook Insights** turns usage data into concrete suggestions for improving a playbook, and tracks whether a change actually helped.
- **Where have my assets gone?** **Resource Downloads** records who took a copy of a resource, when, and how.

Both pages are in the **Observability** section of the AI Foundry sidebar and are available to users with observability access.

## Playbook Insights

**Playbook Insights** tells you what your usage suggests you should change, and whether it changed. Instead of asking you to read charts, it runs a set of detectors over recent activity and surfaces the findings as **signals**: for example, an agent that fails often, a tool that is slow, or usage that costs more than it should.

### Views

A toggle switches between two views:

| View             | What it shows                                                                                                                                                 | Who sees it                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **My usage**     | Signals about your own use of AI Foundry, across the playbooks you run. It always covers only your own data.                                                 | Every user with access to the page.                                                   |
| **My playbooks** | Aggregate signals about the playbooks you own, across everyone who uses them. No individual user is named.                                                  | Playbook owners, and users with the permission to manage observability.               |

Both views let you choose the time window to analyze, and compare it with the previous one to show trends.

:::info Privacy
The **My playbooks** view applies an anonymity threshold: when too few people used a playbook in the selected window, or when a single person accounts for most of its usage, the page shows no data rather than exposing individual behavior.
:::

### Working with signals

Signals are grouped by urgency, from issues to fix now to findings that are simply worth knowing. For each signal you can:

- **Take it on**, to mark that you are working on it. When the underlying measure improves, the signal is marked as fixed.
- **Mute it**, giving a reason and a duration, when it is expected or not relevant.
- Ask for an **explanation**: when the installation has a model configured for it, an LLM describes the signals in plain language and suggests next steps. Without it, the detectors' own findings are still shown.

Below the signals, breakdown tables show where the activity comes from (for example, by playbook, agent, tool, skill, or model), so you can see the context of each finding.

## Resource Downloads

**Resource Downloads** is the record of who took a copy of a resource, and when. Every time an AI asset leaves AI Foundry through one of the [Connections](/products/ai-foundry/overview.md#connections), an export event is recorded, whatever the resource type: a single playbook, a personal memory, or the whole catalog.

Exports are recorded for each distribution channel:

- **Manual download** of a bundle for a specific IDE or tool.
- **Marketplace install** of a plugin package.
- **Git clone** of the plugin marketplace repository.

The page combines summary figures with a detailed log:

- **Summary**: how many exports, resources, and people are involved, and when the last export happened, plus a per-resource summary.
- **Export log**: one row per export, with who exported what, through which channel, and when. Expanding a row shows every item the export carried, including dependencies. For example, the agents, skills, and prompts bundled with a playbook.

You can filter the log by resource type and name, and search for exports that carried a specific item. This is useful to understand the reach of a resource before changing or retiring it.

:::note
Users without the observability role see only their own exports. The observability role sees every export in the tenant.
:::

## See also

- [AI Sessions](/products/ai-foundry/observability/20_ai_sessions.md): individual conversations and workflow runs.
- [AI Providers](/products/ai-foundry/observability/30_ai_providers.md): traces and metrics from the services and clients that call models.
- [Build, run, and test playbooks](/products/ai-foundry/orchestration/10_playbooks.md): use insights to iterate on a playbook.
