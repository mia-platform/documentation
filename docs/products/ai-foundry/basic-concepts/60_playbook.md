---
id: playbook
title: Playbook
sidebar_label: Playbook
---

# Playbook

A **Playbook** is a catalog resource that describes a multi-step agentic workflow. It composes agents, prompts, skills, and specs into a directed graph where each node performs a discrete task and edges define the flow of control and data between them.

Playbooks move the AI platform from single-agent interactions toward **agentic pipelines**: complex, stateful workflows where the output of one agent feeds the input of the next, loops repeat until a condition is met, and parallel branches execute concurrently.

## Flow model

The core of a playbook is `spec.flow`, which contains two collections:

- **Nodes**: the steps in the workflow. Each node has a type and, for agent nodes, a reference to an Agent resource.
- **Edges**: directed connections between nodes that define execution order.

### Node types

| Type         | Description                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `agent`      | Runs an [Agent](./10_agent.md). The `ref` field names the Agent resource. Use `builtin:agent` to reference the default agent. |
| `sequential` | Executes its child nodes one after another in order.                                                                          |
| `parallel`   | Executes its child nodes concurrently and waits for all to complete.                                                          |
| `loop`       | Repeats a set of child nodes until a condition is met or `maxIterations` is reached.                                          |

## Manifest

```yaml
apiVersion: new-ai.mia-platform.eu/v1alpha1
kind: Playbook
metadata:
  name: ticket-resolution-flow
  title: Ticket Resolution Flow
  description: >
    Classifies an incoming support ticket, routes it to the appropriate specialist
    agent, and drafts a resolution reply.
  tags:
    - support
    - routing
spec:
  # Playbook-level resources shared across all nodes
  prompts:
    - ticket-summariser
  skills:
    - draft-reply
  specs:
    - support-escalation-policy

  flow:
    nodes:
      - id: classify
        label: Classify Ticket
        type: agent
        ref: classifier-agent
        position: { x: 0, y: 0 }

      - id: route
        label: Route to Specialist
        type: agent
        ref: router-agent
        position: { x: 300, y: 0 }

      - id: resolve
        label: Resolve & Reply
        type: agent
        ref: support-agent
        position: { x: 600, y: 0 }
        skills:
          - draft-reply        # Node-level override: add skill for this node only

    edges:
      - source: classify
        target: route
      - source: route
        target: resolve
```

## Fields reference

### `metadata`

| Field         | Required | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `name`        | Yes      | Unique identifier. Immutable after creation. |
| `title`       | Yes      | Display name shown in the UI.                |
| `description` | Yes      | Short description of the workflow's purpose. |
| `tags`        | No       | Free-form tags for filtering.                |
| `labels`      | No       | Key/value pairs for API-level filtering.     |

### `spec`

| Field                        | Required | Description                                                                                                                     |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `flow`                       | Yes      | Object containing `nodes` and `edges` arrays.                                                                                   |
| `flow.nodes`                 | Yes      | Array of node objects. Must contain at least one `agent` node.                                                                  |
| `flow.nodes[].id`            | Yes      | Node identifier, unique within the playbook. Used as `edge.source` and `edge.target`.                                           |
| `flow.nodes[].label`         | Yes      | Human-readable label shown in the visual builder.                                                                               |
| `flow.nodes[].type`          | Yes      | Node type: `agent`, `sequential`, `parallel`, or `loop`.                                                                        |
| `flow.nodes[].position`      | Yes      | `{ x, y }` coordinates used by the visual builder to position the node on the canvas.                                           |
| `flow.nodes[].ref`           | No       | For `agent` nodes: the `name` of the [Agent](./10_agent.md) resource to run. Use `builtin:agent` for the default runtime agent. |
| `flow.nodes[].maxIterations` | No       | For `loop` nodes: maximum number of iterations before the loop is forcibly terminated.                                          |
| `flow.nodes[].prompts`       | No       | Node-level [Prompt](./30_prompt.md) overrides (names). Merged with playbook-level `spec.prompts`.                               |
| `flow.nodes[].skills`        | No       | Node-level [Skill](./50_skill.md) overrides (names). Merged with playbook-level `spec.skills`.                                  |
| `flow.nodes[].specs`         | No       | Node-level [Spec](./80_spec.md) overrides (names). Merged with playbook-level `spec.specs`.                                     |
| `flow.edges`                 | Yes      | Array of `{ source, target }` objects. `source` and `target` must match node `id` values.                                       |
| `prompts`                    | No       | Playbook-level list of [Prompt](./30_prompt.md) resource names available to all nodes.                                          |
| `skills`                     | No       | Playbook-level list of [Skill](./50_skill.md) resource names available to all nodes.                                            |
| `specs`                      | No       | Playbook-level list of [Spec](./80_spec.md) resource names available to all nodes.                                              |

## The visual builder

The **Playbook Builder** in the AI Foundry UI provides a drag-and-drop canvas for designing and editing `spec.flow` without writing JSON:

1. **Overview step**: set name, title, and description.
2. **Agentic Flow step**: add nodes from a palette, draw edges between them, and configure node properties.
3. **Resources step**: attach playbook-level prompts, skills, and specs using multi-select pickers.

Switching to **JSON mode** replaces the visual builder with a full-spec JSON editor, which is useful for bulk edits or for copying playbooks across environments.

## Resource scoping

Resources (prompts, skills, specs) can be attached at two levels:

- **Playbook level** (`spec.prompts`, `spec.skills`, `spec.specs`): available to every node in the flow.
- **Node level** (`node.prompts`, `node.skills`, `node.specs`): available only to that specific node. Node-level lists are merged with the playbook-level lists.

This allows a common baseline (e.g. a shared style guide) while letting individual nodes use specialized resources.

## See also

- [Agent](./10_agent.md): the execution unit referenced by playbook nodes.
- [Prompt](./30_prompt.md): reusable text injected into nodes.
- [Skill](./50_skill.md): reusable capabilities attached at playbook or node level.
- [Spec](./80_spec.md): structured documents referenced by nodes.
