---
id: spec
title: Spec
sidebar_label: Spec
---

:::caution Beta

AI Foundry is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Spec

A **Spec** is a catalog resource that stores a structured or free-form specification document. Specs are the way to inject rich, reference-grade knowledge into a [Playbook](./60_playbook.md): think API specifications, data schemas, architecture decision records, domain dictionaries, or any other document that an agent needs to consult at runtime.

Where a [Prompt](./30_prompt.md) carries short, focused instruction text, a Spec is designed for larger, more authoritative reference material.

## When to use a Spec

Specs are appropriate when you need an agent to have access to:

- **API contracts** (OpenAPI / AsyncAPI documents, GraphQL schemas) so the agent can construct valid requests.
- **Domain glossaries** that define the precise meaning of business terms the agent must reason about.
- **Policy documents** that the agent must follow (acceptable-use policies, compliance rules, coding standards).
- **Data schemas** that describe the structure of inputs or outputs the agent processes.
- **Architecture references** used by agents that assist with software design or code generation.

## Manifest

Spec resources can be authored in two modes: a **command-driven** mode for spec templates tied to a predefined spec command, or a **free-form** mode for arbitrary reference documents.

### Command-driven spec template

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Spec
metadata:
  name: project-specification
  title: Project Specification
  description: System specification template for new projects.
  tags:
    - spec
    - template
spec:
  command: /spec.specify         # One of the predefined spec commands
  template: |
    ## Project Overview
    {{project_name}}: {{project_description}}

    ## Goals
    {{goals}}

    ## Constraints
    {{constraints}}
```

### Free-form reference document

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Spec
metadata:
  name: payments-api-contract
  title: Payments API Contract
  description: OpenAPI 3.1 specification for the internal Payments service.
  tags:
    - api
    - payments
    - openapi
spec:
  content: |
    openapi: 3.1.0
    info:
      title: Payments API
      version: 1.0.0
    paths:
      /payments:
        post:
          summary: Initiate a payment
          ...
```

A free-form policy document:

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Spec
metadata:
  name: data-retention-policy
  title: Data Retention Policy
  description: Corporate data retention and deletion rules.
  tags:
    - compliance
    - policy
spec:
  definition: |
    ## Data Retention Policy

    ### PII Data
    All personally identifiable information must be deleted within 90 days
    of a user account closure request.

    ### Logs
    Application logs are retained for 12 months. Security audit logs are
    retained for 7 years.
```

## Fields reference

### `metadata`

| Field         | Required | Description                                                                                    |
| ------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `name`        | Yes      | Unique identifier. Referenced in `Playbook.spec.specs` and `Playbook.spec.flow.nodes[].specs`. |
| `title`       | Yes      | Display name shown in the UI.                                                                  |
| `description` | Yes      | Short description of what the document covers.                                                 |
| `tags`        | No       | Free-form tags for filtering and discovery.                                                    |
| `labels`      | No       | Key/value pairs for API-level filtering.                                                       |

### `spec`

Spec resources support two authoring modes. Use `command` + `template` for predefined spec templates, or use the free-form content fields for arbitrary reference documents.

#### Command-driven fields

| Field      | Required | Description                                                                                                            |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `command`  | No       | A predefined spec command (see [Spec commands](#spec-commands) below). When set, `template` should also be populated.  |
| `template` | No       | The Markdown content of the spec template associated with `command`. Rendered with a preview/source toggle in the UI.  |

#### Free-form content fields

The runtime resolves free-form content in priority order (`content` → `definition` → `description`) and uses the first non-empty value it finds.

| Field         | Priority    | Description                                                                                                                                         |
| ------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`     | 1 (highest) | Primary content field. Recommended for most documents.                                                                                              |
| `definition`  | 2           | Alternative content field. Useful when `content` is semantically reserved for something else.                                                       |
| `description` | 3 (lowest)  | Fallback. Generally avoid using the spec-level `description` for primary content; prefer the `metadata.description` for the catalog entry summary. |

Additional arbitrary fields are allowed in `spec`, making it easy to store structured data (e.g. the full body of a YAML or JSON document) in any field name that suits the use case.

## Spec commands

When a Spec is used as a template, its `command` field selects a predefined spec operation. The following commands are supported:

| Command              | Purpose                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `/spec.constitution` | Define the system constitution and guiding principles.               |
| `/spec.specify`      | Create a detailed specification for a feature or system.             |
| `/spec.clarify`      | Clarify ambiguous requirements or resolve open questions.            |
| `/spec.plan`         | Produce a high-level plan for implementing a feature or change.      |
| `/spec.tasks`        | Break down a plan into concrete, actionable tasks.                   |
| `/spec.analyze`      | Analyze an existing system, codebase, or problem space.              |
| `/spec.checklist`    | Create a verification or review checklist.                           |
| `/spec.implement`    | Provide a step-by-step implementation guide.                         |
| `/spec.memory`       | Store persistent context or memory for the agent across sessions.    |

## Specs vs. Prompts

| Aspect       | Spec                                  | Prompt                                     |
| ------------ | ------------------------------------- | ------------------------------------------ |
| Typical size | Medium to large (full documents)      | Short to medium (focused instructions)     |
| Content type | Reference material, schemas, policies | Instructions, templates, few-shot examples |
| Authorship   | Domain experts, architects, legal     | Prompt engineers, product managers         |
| Rendering    | Markdown in the detail view           | Markdown with preview/source toggle        |

In practice the two complement each other: a playbook node might receive a Prompt that says "classify the request according to the taxonomy defined in spec X", with the Spec holding the full taxonomy document.

## See also

- [Playbook](./60_playbook.md): references specs at the playbook and node level.
- [Prompt](./30_prompt.md): shorter, instruction-oriented text resources.
