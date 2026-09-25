---
id: build-workflows
title: Build, run, and test agentic workflows
sidebar_label: Agentic Workflows
---

# Build, run, and test agentic workflows

This guide shows you how to design an [Agentic Workflow](/products/ai-foundry/basic-concepts/22_workflow.md), build it in the workflow wizard, start it by hand, on a schedule, or from a webhook, and test and monitor its runs until it is ready for production.

It covers the tasks only. For the full list of spec fields, step blocks, and trigger options, see the [Agentic Workflow](/products/ai-foundry/basic-concepts/22_workflow.md) reference.

## Prerequisites

- You know the basic AI Foundry concepts: [Agent](/products/ai-foundry/basic-concepts/20_agent.md), [Playbook](/products/ai-foundry/basic-concepts/21_playbook.md), and [Agentic Workflow](/products/ai-foundry/basic-concepts/22_workflow.md).
- The playbooks your workflow calls already exist, are enabled, and have been tested. See [Build, run, and test playbooks](/products/ai-foundry/orchestration/10_playbooks.md).
- For steps that call external systems, an administrator has created the [API Credentials](/products/ai-foundry/administration/20_api-security.md) you need.
- You have the permissions described in [Permissions](#permissions).

## Design the workflow

### Choose between a playbook and a workflow

| Use                | When |
| ------------------ | ---- |
| A playbook         | The work happens in a conversation, and the model decides at run time which agent does what. |
| An agentic workflow | The work runs outside a conversation: it starts from a schedule or an external system, must wait for a person, mixes agents with HTTP calls, Git operations, or commands, or must follow the same path every time. |

A workflow does not replace a playbook: its **Playbook** steps run one turn of a playbook each. Design and test the playbook first, then call it from the workflow.

### Model the process as a graph

A workflow is a graph, not a list. Before you open the wizard, sketch the process:

1. Pick the **start** step, the one every run begins at.
2. Connect each step to its successor with `next`. A step without a successor ends the run.
3. For a **Condition**, draw `ifTrue` and `ifFalse`. At least one of the two is required.
4. For an **Approval**, `ifTrue` is where the run goes when someone approves, and `ifFalse` where it goes when someone refuses. A refusal with no `ifFalse` ends the run successfully: a person answering "no" is the workflow working as designed.
5. For any step that can fail (Playbook, HTTP request, Integration, Clone a repository, Run a command), decide whether a failure ends the run or follows an `onError` branch, for example to notify a channel.

The graph may contain cycles, for example a step that loops back to retry a check. A run is stopped after 500 step executions, so every cycle needs an exit.

### Declare typed inputs

Declare every value a run needs as an input, with a `type` (`string`, `number`, `boolean`, or `object`), a `description` for the person filling in the Run form, and either `required: true` or a `default`.

Inputs are an allowlist: whatever a trigger sends that is not declared is dropped before it reaches a step. A required input with no value and no default makes the run fail to start. See [Inputs](/products/ai-foundry/basic-concepts/22_workflow.md#inputs) for the field reference.

### Pass data between steps

Step fields are templated with `{{ ... }}` placeholders:

- `{{ inputs.issueNumber }}` reads an input.
- `{{ steps.<id>.output.<field> }}` reads the output of an earlier step. Nested fields and list indexes are separated by dots, for example `{{ steps.fetch.output.body.items.0.id }}`.
- `{{ steps.<id>.error }}` reads the error message of an earlier step that failed, which is useful in a step on an `onError` branch.
- `{{ run.workflowId }}` reads the id of the current run.

Templating is substitution only. A placeholder that names something absent resolves to an empty value instead of failing the run, and a placeholder that fills an entire field keeps its type. See [Templating](/products/ai-foundry/basic-concepts/22_workflow.md#templating).

Each step type exposes the following output fields:

| Step                   | Output fields |
| ---------------------- | ------------- |
| **Playbook**           | `text` (the agent's answer), `agent`, `sessionId` |
| **HTTP request**       | `status`, `headers`, `body`, `json` (`true` when the body was parsed as JSON) |
| **Integration**        | `status`, `headers`, `body`, `json`, `method`, `path`, plus the outputs the action declares, for example `number` and `url` for `github/create-pull-request` |
| **Clone a repository** | `path`, `commit`, `ref`, `sealed` |
| **Run a command**      | `exitCode`, `stdout`, `stderr`, `timedOut`, `durationMs`, `truncated` |
| **Condition**          | `result`, `left`, `right` |
| **Approval**           | `approved`, `note`, `actor`; on a timeout, `approved` and `reason` |

You can address fields of an HTTP response body only when the response is JSON (`json` is `true`). Bodies that are too long are truncated and are never parsed as JSON.

### Choose the step types

| You need to                                           | Use |
| ----------------------------------------------------- | --- |
| Ask an agent to reason, draft, classify, or review   | **Playbook** (`agent`). By default the playbook's root agent answers. Turn on **Share the session with other agent steps** only when a later agent step must see what an earlier one said. |
| Call GitHub or GitLab                                 | **Integration**. It knows the endpoint, the body shape, and the fields worth reading back, and it percent-encodes every value placed in the path. |
| Call any other REST API                               | **HTTP request**. Name an API Credential so that the secret stays out of the spec; the URL then becomes a path under the credential's base URL. |
| Work on repository files, build, or test              | **Clone a repository** followed by **Run a command**, in a workflow that declares a workspace. |
| Branch on a value                                     | **Condition**. |
| Wait for a person                                     | **Approval**. |
| Wait for a fixed time                                 | **Delay**, up to one year. |

The built-in integration actions are:

- **GitHub**: `get-file`, `get-file-info`, `get-branch`, `create-branch`, `commit-file`, `create-pull-request`, `list-pull-requests`, `comment-on-pull-request`, `merge-pull-request`, `create-tag`, `create-release`, `latest-release`.
- **GitLab**: `get-file`, `create-branch`, `commit-file`, `create-merge-request`, `list-merge-requests`, `comment-on-merge-request`, `merge-merge-request`, `create-tag`, `create-release`, `latest-release`.

The step drawer lists each action's inputs under **What to send** and its outputs under **What this step produces**.

### Make agent output usable by later steps

A Playbook step exposes the agent's answer as plain text in `output.text`: the text of all the agent's messages in the turn, joined together. The engine does not parse it as JSON, so you cannot address fields inside it.

To branch on what an agent decided:

1. In the agent's instructions (or in the step's **Prompt**), ask for a fixed marker in the answer, for example a line `VERDICT: ACTIONABLE` or `VERDICT: NEEDS-INFO`.
2. Add a **Condition** with **Value** `{{ steps.<id>.output.text }}`, the `contains` comparison, and the marker as **Compared with**. The comparison is case-sensitive.

To use the whole answer, pass `{{ steps.<id>.output.text }}` into a later field, such as the body of a commit, a pull request description, or an HTTP request body.

### Plan timeouts, retries, and idempotency

- **Timeout (seconds)** bounds a single attempt, not the sum of the retries. The default is 120 seconds, which is often too short for an agent that calls tools: raise it for Playbook steps.
- **Attempts** (`retry.maximumAttempts`) defaults to 3. Transport errors, `429`, and `5xx` responses are retried with exponential backoff; `4xx` responses are not, because they would fail the same way every time. The other backoff fields are available in JSON mode. Condition, Delay, and Approval steps are never retried.
- **Retries repeat side effects.** A retry is a second request, and after a timed-out attempt the engine cannot know whether the first one arrived. For an action that creates something, such as opening a pull request, set **Attempts** to `1` and draw an `onError` branch instead. The step drawer warns you when an integration action is not safe to repeat.
- **Every trigger starts a new run.** A webhook caller that retries a delivery starts a second run, so design steps that tolerate running twice, for example by checking with `list-pull-requests` before opening a new one.

### Add human approval

Put an **Approval** step before any action you want a person to review. Set:

- **What is being asked**: the question shown on the run page. You can use templates, for example to include the pull request title.
- **Give up after (seconds)**: how long to wait. The default is one day.
- **If nobody answers**: **Fail the run** (default), **Treat as approved**, or **Treat as refused**. With **Treat as refused**, the run follows `ifFalse` if present, otherwise `next`.

Place steps that need a workspace *after* long approvals when you can: the workspace is created at the first step that needs it, and its lifetime counts from that moment.

### Secure the workflow

- **API Credentials**: never put secrets in headers or bodies, which are visible to everyone who can read the workflow. Name an API Credential instead. With a credential, the host comes from the credential's base URL and the step can only choose the path, so a workflow editor cannot send the credential elsewhere. The credential name itself cannot be templated.
- **Network**: HTTP request URLs that resolve to private, loopback, or link-local addresses are refused unless your installation allows them, and redirects are not followed.
- **Commands**: **Run a command** works only if the installation allows commands in workspaces. The runner is sealed before the first command, so no credential is available to code from a cloned repository: clone first, then build.
- **Webhook secret**: treat it like a password. It is shown only once, and rotating it invalidates the previous one immediately.

### Example design: triage an issue and open a pull request

The following workflow asks a triage playbook to analyze a GitHub issue. If the agent marks the issue as actionable, a person reviews the proposal, and the workflow then commits it to a new branch and opens a pull request. If opening the pull request fails, the workflow posts the error to a team chat API.

```json
{
  "description": "Triage a GitHub issue and propose a fix plan as a pull request",
  "inputs": [
    { "name": "owner", "type": "string", "required": true, "description": "Repository owner" },
    { "name": "repo", "type": "string", "required": true, "description": "Repository name" },
    { "name": "issueNumber", "type": "number", "required": true },
    { "name": "issueTitle", "type": "string", "required": true },
    { "name": "issueBody", "type": "string", "default": "" }
  ],
  "triggers": {
    "manual": { "enabled": true },
    "webhook": { "enabled": true }
  },
  "start": "triage",
  "steps": [
    {
      "id": "triage",
      "name": "Triage the issue",
      "type": "agent",
      "agent": {
        "playbook": "issue-triage",
        "prompt": "Triage issue #{{ inputs.issueNumber }}: {{ inputs.issueTitle }}\n\n{{ inputs.issueBody }}\n\nWrite a fix plan in Markdown. End with one line: VERDICT: ACTIONABLE or VERDICT: NEEDS-INFO."
      },
      "timeoutSeconds": 600,
      "next": "is-actionable"
    },
    {
      "id": "is-actionable",
      "type": "condition",
      "condition": {
        "left": "{{ steps.triage.output.text }}",
        "operator": "contains",
        "right": "VERDICT: ACTIONABLE"
      },
      "ifTrue": "review"
    },
    {
      "id": "review",
      "type": "approval",
      "approval": {
        "message": "Open a pull request with the fix plan for issue #{{ inputs.issueNumber }}?",
        "timeoutSeconds": 172800,
        "onTimeout": "reject"
      },
      "ifTrue": "read-main"
    },
    {
      "id": "read-main",
      "type": "integration",
      "integration": {
        "provider": "github",
        "action": "get-branch",
        "apiCredential": "github-bot",
        "with": { "owner": "{{ inputs.owner }}", "repo": "{{ inputs.repo }}", "branch": "main" }
      },
      "next": "create-branch"
    },
    {
      "id": "create-branch",
      "type": "integration",
      "integration": {
        "provider": "github",
        "action": "create-branch",
        "apiCredential": "github-bot",
        "with": {
          "owner": "{{ inputs.owner }}",
          "repo": "{{ inputs.repo }}",
          "branch": "triage/issue-{{ inputs.issueNumber }}",
          "sha": "{{ steps.read-main.output.sha }}"
        }
      },
      "retry": { "maximumAttempts": 1 },
      "onError": "notify-failure",
      "next": "commit-plan"
    },
    {
      "id": "commit-plan",
      "type": "integration",
      "integration": {
        "provider": "github",
        "action": "commit-file",
        "apiCredential": "github-bot",
        "with": {
          "owner": "{{ inputs.owner }}",
          "repo": "{{ inputs.repo }}",
          "branch": "triage/issue-{{ inputs.issueNumber }}",
          "filePath": "docs/triage/issue-{{ inputs.issueNumber }}.md",
          "message": "docs: fix plan for issue #{{ inputs.issueNumber }}",
          "content": "{{ steps.triage.output.text }}"
        }
      },
      "onError": "notify-failure",
      "next": "open-pr"
    },
    {
      "id": "open-pr",
      "type": "integration",
      "integration": {
        "provider": "github",
        "action": "create-pull-request",
        "apiCredential": "github-bot",
        "with": {
          "owner": "{{ inputs.owner }}",
          "repo": "{{ inputs.repo }}",
          "head": "triage/issue-{{ inputs.issueNumber }}",
          "base": "main",
          "title": "Fix plan for #{{ inputs.issueNumber }}: {{ inputs.issueTitle }}",
          "description": "Approved by {{ steps.review.output.actor }}. Note: {{ steps.review.output.note }}",
          "draft": true
        }
      },
      "retry": { "maximumAttempts": 1 },
      "onError": "notify-failure"
    },
    {
      "id": "notify-failure",
      "type": "http",
      "http": {
        "method": "POST",
        "apiCredential": "team-chat",
        "url": "/messages",
        "body": { "text": "Workflow run {{ run.workflowId }} failed: {{ steps.create-branch.error }} {{ steps.commit-plan.error }} {{ steps.open-pr.error }}" }
      }
    }
  ]
}
```

In this example:

- `issue-triage` is a playbook, and `github-bot` and `team-chat` are API Credentials of your tenant. Replace them with your own.
- `create-branch` and `open-pr` run once (`maximumAttempts: 1`) because repeating them would create duplicates; `commit-plan` keeps the default retries because replacing a file is safe to repeat.
- A run for an issue that needs more information ends after the condition, and a refused or unanswered approval ends the run without changes.
- The run result is the output of the last successful step: the pull request `number` and `url` when everything succeeds.

### Example: build and test in a workspace

To work on the files of a repository, declare a `workspace` and chain a clone, a command, and an agent step. Every agent step of a workflow with a workspace receives it, but it can read or change files only if the agent enables the workspace permissions (see the [Agent reference](/products/ai-foundry/basic-concepts/20_agent.md#agent-reference)).

```json
{
  "workspace": { "runner": "node", "ttlSeconds": 3600 },
  "start": "checkout",
  "steps": [
    {
      "id": "checkout",
      "type": "clone",
      "clone": { "apiCredential": "gitlab-bot", "repo": "acme/shop.git", "ref": "main" },
      "next": "test"
    },
    {
      "id": "test",
      "type": "command",
      "command": { "command": "npm ci && npm test", "workdir": "{{ steps.checkout.output.path }}" },
      "timeoutSeconds": 900,
      "retry": { "maximumAttempts": 1 },
      "onError": "explain"
    },
    {
      "id": "explain",
      "type": "agent",
      "agent": {
        "playbook": "ci-helper",
        "prompt": "The tests failed with exit code {{ steps.test.output.exitCode }}. Explain the failure:\n\n{{ steps.test.output.stderr }}"
      },
      "timeoutSeconds": 600
    }
  ]
}
```

The available runner names depend on your installation: the **Runner** field of the wizard lists them. A failed command still exposes its output, so the step on the `onError` branch can read `stdout` and `stderr`.

## Build the workflow in the wizard

Open **Agentic Workflows** in the **Orchestration** section and create a workflow. The wizard has three steps.

1. **Overview**
   - **Title**, **Name**, **Description**, and tags. The **Name** is derived from the title, allows lowercase letters, digits, and hyphens, and cannot be changed after creation: it is the name the triggers and the webhook URL use.
2. **Workflow**
   - Click **Add step** and pick **HTTP request**, **Playbook**, **Integration**, **Clone a repository**, **Run a command**, **Condition**, **Approval**, or **Delay**.
   - Draw an edge from the **Start** node to the first step.
   - Drag from a node's handles to connect steps: the green handle is the "yes" branch (`ifTrue`), the red one the "no" branch (`ifFalse`), and the one on the right is where a failure goes (`onError`).
   - Click a node to configure it in the side drawer: its **Id** (the name templates use, as in `{{ steps.<id>.output }}`), **Name**, the fields of its type, and, under **Execution**, **Timeout (seconds)** and **Attempts**.
   - Click **Check** to validate the graph at any time.
3. **Settings**
   - **Inputs**: click **Add input** and set **Name**, **Type**, **Required**, **Description**, and **Default**.
   - **Workspace**: turn on **Give runs a shared workspace**, then choose the **Runner** and **Reclaim after (seconds)**, between 60 and 86400.
   - **Triggers**: **Run button in this website**, **REST webhook**, and **Schedule**, with **Cron**, **Time zone**, and the **Inputs for scheduled runs**.

Click **Create workflow** (or **Save changes** when editing) to save.

### Edit the JSON directly

The **Workflow** and **Settings** steps have a **Form**/**JSON** toggle. In JSON mode on the **Workflow** step you edit `start` and `steps`; node positions are optional, and steps written in JSON are laid out on the canvas for you. JSON mode is the fastest way to paste a workflow, copy one between environments, or set fields the form does not show, such as the full `retry` policy. You cannot move to another step while the JSON is invalid.

### How validation works

The wizard sends the spec to the workflow engine for validation when you click **Check**, when you leave the **Workflow** step with **Next**, and when you save. The engine checks, among others:

- that every edge points to an existing step, step ids are unique, and `start` is one of the steps;
- that every step has the block matching its type, and no other block;
- that Playbook steps name a playbook, and that steps naming an API Credential use a path, not an absolute URL;
- that `clone` and `command` steps are in a workflow with a workspace;
- that the cron expression of an enabled schedule is valid;
- that integration providers and actions exist and that every required action input is filled.

The first problem appears as an error message in the form `<field>: <message>`, for example `steps.4.integration.with.title: 'title' is required by 'github/create-pull-request'`, and the wizard stays where it is. Steps that no edge reaches produce a warning that names them, but do not block you. If the engine cannot be reached, the wizard warns you and still lets you save.

## Run the workflow

### Permissions

| Permission          | Lets you |
| ------------------- | -------- |
| `workflows:read`    | View runs, schedules, and the **Workflow Runs** board. |
| `workflows:trigger` | Start runs, cancel them, answer approvals, and pause or resume a schedule, without editing the workflow. |
| `workflows:write`   | Everything `workflows:trigger` allows. |

Creating and editing the workflow definition, applying a schedule, and managing the webhook secret require permission to edit the workflow item.

### Run it by hand

1. Open the workflow and click **Run**. The button is disabled when **Run button in this website** is off.
2. Fill in the declared inputs. Booleans are switches, numbers are numeric fields, and `object` inputs take JSON.
3. Click **Start**. The run starts in the background and you are taken to its page.

### Run it on a schedule

1. In **Settings**, turn on **Schedule**, write a five-field **Cron** expression (for example `0 7 * * 1-5`), and choose the **Time zone**. The schedule follows the zone's daylight saving time.
2. Under **Inputs for scheduled runs**, give a value to every required input without a default: a scheduled run has nobody to fill in the Run form, and the engine refuses a schedule that cannot supply a required input.
3. Save. The schedule is applied to the engine on save; if that fails, the save warns you with "Saved, but the schedule could not be applied".
4. From the **Schedules** tab of the workflow, check **Cron**, **Next run**, **Last run**, and **State**, and pause or resume the schedule.

If the previous scheduled run is still running when the next one is due, the new firing is skipped.

### Run it from a webhook

1. In **Settings**, turn on **REST webhook** and save.
2. Open the **Webhook** tab of the workflow, copy the **URL**, and click **Create secret**. Copy the secret: it is shown only once.
3. Configure the calling system to send a JSON object whose keys are the workflow inputs, signed with the secret.

The request body *is* the inputs, with no envelope. The signature is the hex-encoded HMAC-SHA256 of the raw body, sent as `X-Hub-Signature-256: sha256=<signature>`, the scheme GitHub webhooks use:

```bash
WEBHOOK_URL='https://<ai-foundry-host>/api/workflow-webhooks/<organization>/<tenant>/issue-triage'
BODY='{"owner":"acme","repo":"shop","issueNumber":42,"issueTitle":"Checkout fails on Safari"}'
SIGNATURE="sha256=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | awk '{print $NF}')"

curl -X POST "$WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  --data-raw "$BODY"
```

The endpoint answers `202 Accepted` with the `workflowId`, `runId`, and `workflow` of the new run, without waiting for it to finish. Sign exactly the bytes you send: reformatting the JSON after signing breaks the signature.

To rotate the secret, click **Rotate secret** and confirm: the previous secret stops working immediately, so update the caller right away. **Delete** removes the secret, and the webhook then refuses every call until you create a new one.

## Test and monitor runs

### Validate and run with test inputs

1. Click **Check** on the **Workflow** step and fix every problem and unreachable step.
2. For the first runs, point the workflow at test resources: a sandbox repository, a test API Credential, a test channel. Inputs make this easy, because you can pass a test repository to a manual run without editing the workflow.
3. Keep a manual trigger on while you test, even for a workflow meant to run on a schedule or webhook, so you can start runs with inputs you control.
4. Add an **Approval** step before irreversible actions while you test. You can remove it once the workflow is trusted.

### Read the run page

The run page refreshes on its own while the run is in progress. It shows:

- **Started**, **Finished**, **Trigger** (manual, schedule, or webhook), **Started by**, and, when the workflow declares one, the **Workspace**.
- **Input**: the inputs the run received, after defaults were applied and undeclared keys were dropped.
- **Steps**: the timeline, with each step's status, type, duration, number of attempts when it was retried, error message, and output. Agent answers are shown under **Answer**; you can switch an output between **Preview** and **Data**.
- **Result**: the output of the last successful step.

A step reached more than once, in a cycle, shows its latest execution.

If the page shows **The step-by-step timeline is unavailable**, no workflow worker answered. The status, timings, and result still come from the run history; contact your administrator if it persists.

### Approve, refuse, or cancel

- When the run reaches an **Approval** step, the step shows the question, an optional note, and the **Approve** and **Refuse** buttons. The decision, the note, and who decided are recorded in the step output and shown as **Decided by**. Runs waiting for an approval are also highlighted on the home page.
- To stop a running run, click **Cancel** and confirm. A step already in progress finishes first, and the timeline records where the run stopped.

### Watch all runs

The **Workflow Runs** page in the **Observability** section is a live board of runs across all workflows, in three columns: **Running**, **Waiting** (stopped on an approval), and **Done**. Filter it by workflow, pause **Live** refresh, and open any card to reach its run page. The **Executions** tab of a workflow lists the runs of that workflow only.

### Debug a failed step

1. Open the run and expand the failed step: its error message is the innermost cause, for example the HTTP status and response of the called API.
2. Check the **Input** tab: an empty field in a later step often comes from a placeholder that named a missing input or field, which resolves to an empty value.
3. For a failed command, read `stdout` and `stderr` in the step output.
4. For a Playbook step, trace the agent turn in [Platform Sessions](/products/ai-foundry/observability/20_ai_sessions.md#platform-sessions): filter by the playbook and by **User ID**. A manual run is attributed to the person who started it; scheduled and webhook runs are attributed to `workflow:<workflow-name>`. The session id starts with `wf-` followed by the run id. For latency and errors across services, use [AI Traces](/products/ai-foundry/observability/30_ai_providers.md#ai-traces).
5. Fix the workflow and start a new run. A run always executes the definition it started with.

### Understand versioning

- A run keeps executing the workflow definition it started with, even if you edit the workflow while it runs or waits for an approval.
- A scheduled run executes the definition the schedule was last applied with. If the **Schedules** tab shows **The schedule running in the engine is not the one this workflow describes.**, click **Apply**.
- A run stops after 500 step executions, which protects against cycles without an exit.

### Pre-production checklist

- [ ] **Check** reports the workflow as valid with all steps reachable from **Start**.
- [ ] Every required input has a clear description; scheduled runs have values for all of them.
- [ ] Every Playbook step names an enabled, tested playbook and has a timeout long enough for its tools.
- [ ] Agent answers used by a condition contain a fixed marker, and both branches have been tested.
- [ ] Steps that create resources run once (`Attempts` set to `1`) and have an `onError` branch.
- [ ] No secret is written in a header or body; every external call uses an API Credential.
- [ ] Approvals have a sensible **Give up after (seconds)** and **If nobody answers** policy.
- [ ] The workspace TTL covers the time between the first workspace step and the end of the run.
- [ ] The webhook secret is stored in the calling system's secret manager, and the team knows how to rotate it.
- [ ] Test runs have been run end to end with test resources, including a refused approval and a failing step.

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| Starting a run fails with `Input '<name>' is required` | A required input has no value and no default. | Supply the input, or give it a default. For schedules, fill in **Inputs for scheduled runs**. |
| Starting a run fails because a playbook `does not exist in this tenant`, `is disabled`, or `carries no agent` | A Playbook step names a missing or disabled playbook, or one with an empty flow. | Fix or enable the playbook, or point the step at another one. |
| A step fails with `no API credential named '<name>' is visible to this tenant` | The API Credential does not exist in your tenant. | Create the credential, or fix the name in the step. |
| An HTTP request step fails with `Refusing to connect to a non-public or unresolvable address.` | The URL resolves to a private or unknown address. | Use a public address, or ask your administrator whether private addresses can be allowed. |
| A condition always takes the "no" branch | The value is missing, is not a number for `gt`/`lt` comparisons, or does not match exactly (`contains` is case-sensitive). | Check the step output in the run page and fix the placeholder or the marker. |
| A pull request or other resource was created twice | The step was retried after a timeout. | Set **Attempts** to `1` for non-repeatable actions and add an `onError` branch. |
| A run fails with `this run executed 500 steps without finishing` | The graph has a cycle with no exit. | Add a condition that leaves the cycle. |
| A webhook call answers `401` | The `X-Hub-Signature-256` header is missing, or it was computed with another secret or on different bytes. | Sign the exact raw body with the current secret. |
| A webhook call answers `409` | The **REST webhook** trigger is off, or no secret has been created. | Turn on the trigger and create a secret in the **Webhook** tab. |
| A webhook call answers `400` | The body is not a JSON object, or a required input is missing. | Send a JSON object with all required inputs. |

## Related resources

- [Agentic Workflow](/products/ai-foundry/basic-concepts/22_workflow.md): the reference for spec fields, steps, triggers, and templating.
- [Build, run, and test playbooks](/products/ai-foundry/orchestration/10_playbooks.md): design the playbooks that Playbook steps call.
- [Agent](/products/ai-foundry/basic-concepts/20_agent.md): agent configuration, including workspace permissions.
- [AI Sessions](/products/ai-foundry/observability/20_ai_sessions.md) and [AI Providers](/products/ai-foundry/observability/30_ai_providers.md): trace agent steps and follow workflow runs.
- [AI Foundry Overview](/products/ai-foundry/overview.md#agentic-workflows): a summary of agentic workflows and API Credentials.
