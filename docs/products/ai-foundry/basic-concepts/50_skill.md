---
id: skill
title: Skill
sidebar_label: Skill
---

# Skill

A **Skill** is a catalog resource that encapsulates a reusable, higher-level AI capability. Where a [Tool](./40_tool.md) wraps a single atomic operation (call this API, run this query), a skill captures a multi-step capability along with the knowledge, templates, scripts, and assets needed to exercise it — for example "summarise a document", "classify intent", or "draft a reply in brand voice".

Skills are referenced by [Agents](./10_agent.md) and [Playbooks](./60_playbook.md). They act as a reusable building block that can be shared across multiple agents without duplicating the underlying logic.

## Anatomy of a skill

A skill bundles four optional content sections alongside its metadata:

- **`manifest`**: the primary Markdown documentation of the skill — what it does, how to invoke it, what inputs and outputs to expect.
- **`refs`**: named reference materials the skill draws on (e.g. style guides, domain glossaries, external links).
- **`assets`**: named templates or structured content the skill produces or consumes (e.g. a response template, a classification taxonomy).
- **`scripts`**: named code snippets or pseudocode that implement part of the skill logic.

## Manifest

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Skill
metadata:
  name: draft-reply
  title: Draft Reply
  description: Drafts a professional customer-facing reply to a support ticket.
  tags:
    - support
    - writing
spec:
  manifest: |
    ## Purpose
    Given a resolved support ticket, draft a polite, concise reply to the customer
    confirming the resolution and any follow-up steps required.

    ## Inputs
    - `ticket_content`: the original customer message
    - `resolution_summary`: a brief description of how the issue was resolved

    ## Output
    A single reply message ready to send, in plain text.

    ## Tone guidelines
    - Professional but warm
    - Avoid jargon
    - Do not exceed 200 words

  refs:
    brand-voice-guide: |
      Our brand voice is friendly, concise, and solution-oriented.
      Avoid passive voice. Use "we" instead of "the team".

  assets:
    reply-template: |
      Hi {{customer_name}},

      Thank you for reaching out. {{resolution_summary}}

      If you have further questions, don't hesitate to reply to this email.

      Best regards,
      {{agent_name}}

  scripts:
    word-count-check: |
      # Reject any draft exceeding 200 words
      if len(draft.split()) > 200:
          raise ValueError("Draft exceeds 200 words")
```

## Fields reference

### `metadata`

| Field         | Required | Description                                                                                                |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `name`        | Yes      | Unique identifier. Immutable after creation. Referenced in `Agent.spec.skills` and `Playbook.spec.skills`. |
| `title`       | Yes      | Display name shown in the UI.                                                                              |
| `description` | No       | Short description of what the skill enables.                                                               |
| `tags`        | No       | Free-form tags for filtering.                                                                              |
| `labels`      | No       | Key/value pairs for API-level filtering.                                                                   |

### `spec`

| Field      | Required | Description                                                                                                             |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `manifest` | Yes      | Markdown documentation of the skill. Must be non-empty. Rendered in the detail view with a source/preview toggle.       |
| `refs`     | No       | A key-value map where each key is a reference name and each value is the reference content (Markdown).                  |
| `assets`   | No       | A key-value map where each key is an asset name and each value is the asset content (templates, schemas, etc.).         |
| `scripts`  | No       | A key-value map where each key is a script name and each value is the script content (pseudocode, shell, Python, etc.). |

## Skill locking

Skills can be **locked** on a per-session basis in the [AI Playground](../overview.md#ai-playground), preventing an agent from invoking them during that session. This is useful when testing agent behaviour without a specific capability or when a skill's side effects are undesirable in a test context.

:::note
Locking a skill in the Playground does not modify the Skill resource or the Agent manifest — it only affects the live session.
:::

## Skills vs. Tools

| Aspect                    | Skill                                                       | Tool                                        |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| Abstraction level         | High — captures a multi-step, knowledge-rich capability     | Low — wraps a single external operation     |
| Implementation location   | Documented in the catalog (`manifest`, `scripts`, `assets`) | External service or MCP server              |
| Content stored in catalog | Yes (manifest, refs, assets, scripts)                       | No (`spec` is empty)                        |
| Typical use               | Writing, reasoning, classification patterns                 | API calls, database queries, code execution |

## See also

- [Agent](./10_agent.md): attaches skills via `spec.skills`.
- [Tool](./40_tool.md): fine-grained executable capabilities.
- [Playbook](./60_playbook.md): can declare skills at the playbook level or per node.
