---
id: tutorial
title: AI Foundry Tutorial
sidebar_label: Tutorial
---

:::caution Beta

AI Foundry is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Customer Support Playbook

This tutorial walks you through the complete workflow for assembling a multi-step agentic pipeline in AI Foundry. You will create every resource from scratch — a **Model**, a **Skill**, a **Spec Template**, an **Agent**, and finally a **Playbook** — and then validate the result in the **AI Playground**.

## What you will build

A two-agent customer support pipeline:

1. **Triage Agent** — reads the incoming customer message and classifies its intent and urgency.
2. **Response Agent** — uses the classification produced by the Triage Agent to draft a polished reply following your company tone-of-voice guidelines.

The two agents are connected sequentially inside a Playbook and share a common Skill (tone-of-voice guidelines) and a Spec Template (the reply format specification).

## Prerequisites

- Access to an AI Foundry instance.
- A Google Cloud project with Vertex AI enabled and credentials configured (Google Vertex AI is used in the examples below, but any supported provider works).

## Step 1: Create a Model

A **Model** stores the LLM provider configuration that agents will reference. You only need to do this once per provider/model combination.

1. Open AI Foundry and go to `Integration` > `Models` in the left navigation menu.
2. Click **New Model**.
3. Fill in the form:

   | Field              | Example value                                                     |
   | ------------------ | ----------------------------------------------------------------- |
   | **Title**          | Claude Haiku 4.5                                                  |
   | **Name**           | `claude-haiku-4-5`                                                |
   | **Description**    | Claude Haiku 4.5 via Google Vertex AI                             |
   | **Type**           | `vertex_ai/claude-haiku-4-5`                                      |
   | **Provider**       | `vertex_ai`                                                       |
   | **Supports Tools** | ✔ enabled                                                         |
   | **LiteLLM**        | ✔ enabled                                                         |
   | **Arguments**      | `{"max_output_tokens": 8192, "vertex_location": "europe-west1" }` |

4. Click **OK**.

The model now appears in the **Models** list and is selectable when creating an Agent.

## Step 2: Create a Skill

A **Skill** is a reusable capability bundle. Here you will create a skill that codifies your company's tone-of-voice rules so that any agent can follow them without duplicating the guidelines.

1. Go to `Integration` > `Skills` in the left navigation.
2. Click **New Skill**.
3. Fill in the form:

   | Field           | Value                          |
   | --------------- | ------------------------------ |
   | **Title**       | Customer Support            |
   | **Name**        | `customer-support`          |
   | **Description** | Writing guidelines for all customer-facing communications |

4. In the **Manifest** editor, write the skill documentation. For example:

   ```markdown
   # Customer Support

   ## Principles
   - Be warm, concise, and helpful.
   - Use plain language; avoid jargon.
   - Always acknowledge the customer's problem before proposing a solution.
   - Sign off with "The Support Team".

   ## Anti-patterns
   - Never use passive-aggressive language.
   - Never start a sentence with "Actually".
   - Avoid overly formal phrases like "Dear Sir/Madam".
   ```

5. Optionally add an **Asset** named `example-reply` with a sample response to reinforce the guidelines:

   ```markdown
   Hi Jane,

   Thanks for reaching out! I understand you're having trouble resetting your password — let me help you sort that out right away.

   [resolution steps here]

   Let us know if you need anything else.

   The Support Team
   ```

6. Click **Create Skill**.

## Step 3: Create a Spec Template

A **Spec Template** supplies a structured document that agents can reference during execution. Here you will define the schema that the Response Agent must use when drafting a reply.

1. Go to `Content` > `Spec Templates` in the left navigation.
2. Click **New Spec Template**.
3. Fill in the form:

   | Field           | Value                                   |
   | --------------- | --------------------------------------- |
   | **Title**       | Customer Reply Format                   |
   | **Name**        | `customer-reply-format`                 |
   | **Description** | Output format specification for customer replies |
   | **Command**     | `/spec.specify`                         |

4. In the **Template** editor, write the reply schema:

   ```markdown
   # Customer Reply Format

   Every reply MUST follow this structure:

   1. **Greeting** — Address the customer by first name if known.
   2. **Acknowledgement** — One sentence recognising the issue.
   3. **Resolution** — Clear, numbered steps or a direct answer.
   4. **Next steps** — What the customer should do if the problem persists.
   5. **Sign-off** — "The Support Team".

   Maximum length: 200 words.
   ```

5. Click **Create Spec Template**.

## Step 4: Create the Agents

You need two agents for this pipeline. Create them one at a time.

### 4a — Triage Agent

1. Go to `Orchestration` > `Agents` and click **New Agent**.
2. Fill in the form:

   | Field            | Value                                                           |
   | ---------------- | --------------------------------------------------------------- |
   | **Title**        | Customer Triage Agent                                           |
   | **Name**         | `customer-triage-agent`                                         |
   | **Runtime Name** | `customer-triage-agent`                                         |
   | **Description**  | Classifies the intent and urgency of incoming customer messages |
   | **Model**        | `Claude Haiku 4.5` (the model created in Step 1)                |

3. Write the **Instruction** (system prompt):

   ```markdown
   You are a customer support triage specialist.
   Given a customer message, respond with a JSON object containing:
   - "intent": one of ["billing", "technical", "account", "other"]
   - "urgency": one of ["low", "medium", "high"]
   - "summary": a one-sentence summary of the customer's request

   Respond with the JSON object only. Do not include any other text.
   ```

4. Leave **Tools** empty (this agent does not need external tools).
5. Leave **Skills** empty (classification is self-contained).
6. Click **Create Agent**.

### 4b — Response Agent

1. Click **New Agent** again.
2. Fill in the form:

   | Field            | Value                                                      |
   | ---------------- | ---------------------------------------------------------- |
   | **Title**        | Customer Response Agent                                    |
   | **Name**         | `customer-response-agent`                                  |
   | **Runtime Name** | `customer-response-agent`                                  |
   | **Description**  | Drafts a customer reply based on the triage classification |
   | **Model**        | `Claude Haiku 4.5`                                         |

3. Write the **Instruction**:

   ```markdown
   You are a customer support writer.
   You receive a JSON triage result from the previous step in the pipeline.
   Using the intent, urgency, and summary fields, draft a reply to the customer
   following the Customer Reply Format spec and the Customer Support guidelines.
   ```

4. Under **Skills**, select `Customer Support`.
5. Click **Create Agent**.

## Step 5: Create the Playbook

Now you will wire the two agents together into a sequential pipeline using the **Playbook Builder**.

1. Go to `Orchestration` > `Playbooks` and click **New Playbook**.
2. The builder opens on the **Overview** step:

   | Field            | Value                                                  |
   | ---------------- | ------------------------------------------------------ |
   | **Title**        | Customer Support Pipeline                              |
   | **Name**         | `customer-support-pipeline`                            |
   | **Description**  | Triages a customer message and drafts a polished reply |

3. Click **Next** to proceed to the **Agentic Flow** step.

4. On the canvas:
   - Drag the **`Customer Triage Agent`** node from the palette onto the canvas.
   - Drag the **`Customer Response Agent`** node below it.
   - Draw an **edge** from `Customer Triage Agent` to `Customer Response Agent` to establish the sequential flow.

   The canvas should now show two connected agent nodes.

5. Click **Next** to proceed to the **Resources** step.

6. Attach playbook-level resources:
   - **Skills**: select `Customer Support`
   - **Spec Templates**: select `Customer Reply Format`

   These resources are now available to all agents in the playbook.

7. Click **Create Playbook**.

Your playbook is ready. It now appears in the **Playbooks** list.

## Step 6: Test in the AI Playground

1. Go to `Playground` in the left navigation.
2. Select the **Customer Support Pipeline** playbook from the dropdown.
3. In the chat input, type a sample customer message:

   ```
   Hi, I was charged twice for my subscription this month and I can't log in to check my invoice. Please help!
   ```

4. Send the message and observe the streamed output:
   - The **Customer Triage Agent** produces a JSON classification.
   - The **Customer Response Agent** receives that classification and produces a formatted reply.

## Summary

You have completed the full resource creation cycle in AI Foundry:

| Step | Resource created                        | Purpose                                         |
| ---- | --------------------------------------- | ----------------------------------------------- |
| 1    | Model (`Claude Haiku 4.5`)              | LLM provider configuration shared across agents |
| 2    | Skill (`Customer Support`)              | Reusable tone-of-voice guidelines               |
| 3    | Spec Template (`Customer Reply Format`) | Structured output format for replies            |
| 4    | Agents (triage, response)               | The two execution units of the pipeline         |
| 5    | Playbook                                | Sequential orchestration of the two agents      |
| 6    | AI Playground                           | Live validation of the end-to-end workflow      |

## Next steps

- Explore [Prompts](./basic-concepts/30_prompt.md) to extract the agent instructions into versioned, reusable templates.
- Add a **parallel** orchestration node to run independent agents concurrently.
- Register an [MCP Server](./basic-concepts/70_mcp-server.md) to give agents access to live data sources such as your ticketing system.
