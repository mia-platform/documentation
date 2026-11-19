---
id: workflow
title: Agentic Workflow
sidebar_label: Agentic Workflow
---

# Agentic Workflow

An **Agentic Workflow** is a catalog resource (kind `AgenticWorkflow`) that describes a process combining agentic and non-agentic steps: playbook calls, HTTP requests, Git operations, commands, conditions, delays, and human approvals. It runs on the AI Foundry workflow engine and can be started by hand, on a schedule, or by a webhook.

Agents, playbooks, and agentic workflows build on each other:

- An [Agent](/products/ai-foundry/basic-concepts/20_agent.md) answers a single request with its model, tools, and skills.
- A [Playbook](/products/ai-foundry/basic-concepts/21_playbook.md) orchestrates several agents *inside a conversation*, where the model decides hand-offs at run time.
- An **agentic workflow** orchestrates work *outside a conversation*. Its steps follow a graph you define, runs are durable (they survive service restarts and can wait for days), and agents are reached through playbook steps.

## Agentic Workflow reference

Besides the common metadata of every catalog resource (**Title**, **Name**, **Description**, and **Tags**), an agentic workflow has the following spec fields.

| Field                | Type   | Required | Description |
| -------------------- | ------ | -------- | ----------- |
| `start`              | string | Yes      | Id of the step a run begins at. |
| `steps`              | array  | Yes      | The steps of the graph. See [Steps](#steps). |
| `description`        | string | No       | What the workflow does, shown in the list and on the canvas. |
| `inputs`             | array  | No       | Values a run receives when it starts. A trigger can supply only the inputs declared here. See [Inputs](#inputs). |
| `triggers`           | object | No       | How runs may start. See [Triggers](#triggers). |
| `workspace`          | object | No       | Ephemeral filesystem shared by all steps of a run. Required by `clone` and `command` steps. See [Workspace](#workspace). |

### Inputs

| Field         | Type    | Required | Description |
| ------------- | ------- | -------- | ----------- |
| `name`        | string  | Yes      | Input name, referenced as `{{ inputs.<name> }}`. Letters, digits, and underscores, not starting with a digit. |
| `type`        | string  | No       | `string` (default), `number`, `boolean`, or `object`. |
| `description` | string  | No       | Help text shown when a run is started by hand. |
| `required`    | boolean | No       | Whether the run needs a value. Defaults to `false`. |
| `default`     | any     | No       | Value used when none is supplied. |

### Triggers

| Field                        | Type    | Description |
| ---------------------------- | ------- | ----------- |
| `triggers.manual.enabled`    | boolean | Allows starting runs from the **Run** button in the AI Foundry website. Defaults to `true`. |
| `triggers.webhook.enabled`   | boolean | Allows starting runs from the public webhook endpoint. Defaults to `false`. |
| `triggers.schedule.enabled`  | boolean | Starts runs on a cron schedule. Defaults to `false`. |
| `triggers.schedule.cron`     | string  | Standard five-field cron expression. |
| `triggers.schedule.timezone` | string  | Time zone of the cron expression. Defaults to `UTC`. |
| `triggers.schedule.paused`   | boolean | Keeps the schedule without firing it. Defaults to `false`. |
| `triggers.schedule.inputs`   | object  | Input values every scheduled run starts with. |

### Workspace

| Field        | Type    | Description |
| ------------ | ------- | ----------- |
| `runner`     | string  | Runner flavor to use. Empty means the installation's default. |
| `ttlSeconds` | integer | Maximum lifetime of the workspace, from 60 to 86400 seconds. It is a backstop that reclaims the workspace of a terminated run. |

Declaring the `workspace` block is the whole opt-in: the engine creates the workspace before the first step that needs it and releases it when the run ends, whatever the outcome. Agent steps can read, change, or run commands in it only if the agent enables the corresponding workspace permissions (see the [Agent reference](/products/ai-foundry/basic-concepts/20_agent.md#agent-reference)).

## Steps

Every step shares the following fields.

| Field            | Type   | Required | Description |
| ---------------- | ------ | -------- | ----------- |
| `id`             | string | Yes      | Step identifier, referenced by other steps and in templates. |
| `type`           | string | Yes      | `agent`, `http`, `integration`, `clone`, `command`, `condition`, `delay`, or `approval`. |
| `name`           | string | No       | Label shown on the canvas. Defaults to the id. |
| `next`           | string | No       | Step to run afterwards. When absent, the run ends. |
| `ifTrue`         | string | No       | Where a condition goes when it holds, or an approval when it is granted. |
| `ifFalse`        | string | No       | Where a condition goes when it does not hold, or an approval when it is refused. |
| `onError`        | string | No       | Where a failed step goes. When absent, a failure ends the run. |
| `timeoutSeconds` | number | No       | Step timeout. Defaults to `120`, maximum `86400`. |
| `retry`          | object | No       | Retry policy: `maximumAttempts` (default `3`), `initialIntervalSeconds` (default `1`), `backoffCoefficient` (default `2`), `maximumIntervalSeconds` (default `60`). |

Each step type adds a block named after the type.

| Type          | Canvas label           | Block fields | What it does |
| ------------- | ---------------------- | ------------ | ------------ |
| `agent`       | **Playbook**           | `playbook` (required), `prompt` (required), `name`, `shareSession` | Runs one turn of a playbook with a templated prompt. By default the playbook's root agent answers; `name` pins a specific agent of the flow. With `shareSession`, the step talks in the run's shared session, so later agent steps see what earlier ones said. The answer is available as `output.text`. |
| `http`        | **HTTP request**       | `url` (required), `method`, `apiCredential`, `headers`, `body`, `expectStatus` | Calls a REST API. With `apiCredential`, `url` is a path appended to the credential's base URL. `expectStatus` lists success statuses; empty means any 2xx. |
| `integration` | **Integration**        | `provider`, `action`, `apiCredential` (all required), `with` | Performs a built-in action on `github` or `gitlab`, such as `create-pull-request`, `create-merge-request`, or `commit-file`. `with` holds the action's inputs. |
| `clone`       | **Clone a repository** | `apiCredential`, `repo` (both required), `ref`, `path`, `depth` | Clones a repository into the run's workspace. `repo` is a path on the credential's host (for example, `group/project.git`), never a URL. `depth` defaults to `1`. |
| `command`     | **Run a command**      | `command` (required), `workdir`, `expectExit` | Runs a command line in the run's workspace. `expectExit` lists success exit codes; empty means `0` only. Requires the installation to allow commands. |
| `condition`   | **Condition**          | `left` (required), `operator`, `right` | Compares two values and follows `ifTrue` or `ifFalse`. Operators: `eq` (default), `ne`, `gt`, `gte`, `lt`, `lte`, `contains`, `exists`, `truthy`. |
| `approval`    | **Approval**           | `message`, `timeoutSeconds`, `onTimeout` | Pauses the run until someone approves or refuses it, then follows `ifTrue` or `ifFalse`. `timeoutSeconds` defaults to one day; `onTimeout` is `fail` (default), `approve`, or `reject`. |
| `delay`       | **Delay**              | `seconds` (required) | Waits for a durable timer, up to one year. |

:::note
`clone` and `command` steps are valid only in a workflow that declares a `workspace`. The runner is sealed before the first command, so no credential is available to code from a cloned repository: clone first, then build.
:::

### Templating

Step fields can reference the run with `{{ ... }}` placeholders:

- `{{ inputs.<name> }}`: a workflow input.
- `{{ steps.<id>.output.<field> }}`: the output of an earlier step, for example `{{ steps.triage.output.text }}`.
- `{{ run.workflowId }}`: the id of the current run.

Templating is substitution only: there are no expressions or filters. A placeholder that fills an entire field keeps its type, so a number in a JSON body stays a number.

## Example

The following workflow asks a playbook to triage a ticket, waits for a person to approve the result, and posts it to an external API.

```json
{
  "description": "Triage a support ticket and publish the answer after review",
  "inputs": [
    { "name": "ticket", "type": "string", "required": true }
  ],
  "triggers": {
    "manual": { "enabled": true },
    "webhook": { "enabled": true }
  },
  "start": "triage",
  "steps": [
    {
      "id": "triage",
      "type": "agent",
      "agent": {
        "playbook": "customer-support",
        "prompt": "Triage this ticket and draft a reply: {{ inputs.ticket }}"
      },
      "timeoutSeconds": 300,
      "next": "review"
    },
    {
      "id": "review",
      "type": "approval",
      "approval": { "message": "Publish the drafted reply?", "onTimeout": "reject" },
      "ifTrue": "publish"
    },
    {
      "id": "publish",
      "type": "http",
      "http": {
        "method": "POST",
        "apiCredential": "helpdesk-api",
        "url": "/replies",
        "body": { "text": "{{ steps.triage.output.text }}", "run": "{{ run.workflowId }}" }
      },
      "retry": { "maximumAttempts": 5 }
    }
  ]
}
```

## Designing a workflow

You create an agentic workflow from **Agentic Workflows** in the **Orchestration** section, using a three-step wizard:

1. **Overview**: **Title**, **Name**, **Description**, and tags.
2. **Workflow**: a visual canvas where you add steps, configure them, and connect their success, true/false, and error branches.
3. **Settings**: the workflow inputs, the shared workspace (**Give runs a shared workspace**, **Runner**, **Reclaim after (seconds)**), and the triggers (**Run button in this website**, **REST webhook**, **Schedule** with **Cron** and **Time zone**).

Every save is validated by the workflow engine, including the integration provider and action names.

## Running a workflow

- **Manual**: the **Run** button on the workflow page prompts for the declared inputs.
- **Schedule**: runs start from the cron expression with the configured inputs. You can pause and resume the schedule from the **Schedules** tab.
- **Webhook**: external systems start a run with `POST /api/workflow-webhooks/{organization}/{tenant}/{name}`, signing the raw request body with an HMAC secret in the `X-Hub-Signature-256: sha256=<signature>` header, the same scheme GitHub webhooks use. From the **Webhook** tab you create the secret and rotate it; after a rotation the previous secret stops working. Only declared inputs are passed to the run; anything else in the request is dropped.

Runs are durable. A run keeps executing the workflow version it started with, even if the workflow is edited while it runs. A run is stopped after 500 step executions, which protects against endless loops in the graph.

## Monitoring runs

The workflow detail page has the **Overview**, **Workflow**, **Executions**, **Schedules**, and **Webhook** tabs. Opening a run shows when it started and finished, its trigger, who started it, its workspace, and the **Input**, **Steps**, and **Result** tabs. The step timeline shows each step's status, duration, retries, errors, and output. From the run page you can **Cancel** the run; a step already in progress finishes first.

When a run reaches an approval step, the run page shows the approval message with an optional note and **Approve** and **Refuse** buttons. Runs waiting for an approval are also highlighted on the home page. The **Workflow Runs** page in the observability section lists runs across all workflows.

Access is governed by dedicated permissions to read, write, and trigger workflows, so you can let someone start runs without letting them edit the workflow.

## See also

- [Playbook](/products/ai-foundry/basic-concepts/21_playbook.md): the conversational flows that agent steps run.
- [Agent](/products/ai-foundry/basic-concepts/20_agent.md): the execution unit behind every playbook, including its workspace permissions.
- [AI Foundry Overview](/products/ai-foundry/overview.md#agentic-workflows): a summary of agentic workflows and API Credentials.
