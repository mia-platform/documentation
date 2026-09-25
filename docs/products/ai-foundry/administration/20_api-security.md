---
id: api-security
title: API security
sidebar_label: API security
---

# API security

[Agentic workflows](/products/ai-foundry/basic-concepts/22_workflow.md) often need to call external systems: a REST API, a chat service, or a Git provider such as GitHub or GitLab. **API Credentials** let them do so without ever writing the system's secret into the workflow.

An API credential describes a system a workflow step can call, and the credential it calls it with. A step only names the API credential and supplies a path; the secret itself never enters the workflow's definition. This matters because a workflow's definition is visible to everyone who can read it in the tenant and can be exported: a token written there would be disclosed as soon as it is saved.

API Credentials are managed from the **Administration** section of the AI Foundry sidebar, are scoped to your tenant, and can be used by the HTTP request, Integration, and Clone a repository steps of a workflow.

## How secrets are handled

Like the [AI security](/products/ai-foundry/administration/10_ai-security.md) credentials, an API credential lives in two places:

- the **secret** is stored in a dedicated, tenant-scoped credential store. It is written once, can never be read back by a person, and is used only by the workflow engine when it makes a request;
- the **API credential** catalog resource holds everything else, so it can be listed, searched, owned, and audited like any other resource.

Where the secret is stored is not configurable: it is derived from the API credential's tenant and name, so an edit cannot point a credential at another tenant's secret.

## API Credential reference

| Field              | Required | Description                                                                                                                                                         |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**          | Yes      | Display name, shown wherever the credential is chosen, so the author of a workflow step knows which system it is.                                                  |
| **Name**           | Yes      | Unique identifier, derived from the title. Workflow steps reference the credential by this name.                                                                    |
| **Description**    | Yes      | What the system is and what the credential is allowed to do.                                                                                                        |
| **Base URL**       | No       | Where the system answers, for example `https://api.example.com`. A step using this credential supplies only a path, which is appended to the base URL.             |
| **Authentication** | Yes      | How the secret is presented on each request (see below). It describes the shape of the credential, never the secret itself.                                       |
| **Settings**       | No       | Non-secret values a step may need, such as an account ID or a default channel. Values that look like credentials are removed before saving.                       |

### Authentication types

| Type       | How the secret is sent                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Bearer** | As an `Authorization: Bearer <secret>` header.                                                                                   |
| **Header** | In a header of your choice, optionally with a prefix, for systems that expect their own header (for example, `X-Api-Key`).      |
| **Basic**  | As HTTP Basic authentication, from a username and password.                                                                      |

For systems AI Foundry has ready-made workflow actions for, a **preset** fills in the base URL and the authentication shape the provider requires. Everything stays editable, for example to point at a self-managed instance.

## Why a base URL

Keeping the base URL in the API credential rather than in each step has two benefits:

- **Security**: the author of a workflow step cannot choose the host a credential is sent to, so a credential cannot be redirected to an arbitrary server.
- **Maintainability**: moving an integration between a sandbox and production is a single change to the API credential, instead of one per step.

## Rotate a secret

Because a secret cannot be read back, you change it by **rotating** it from the API credential's page: enter the new secret (or username and password), and every workflow that uses the credential picks it up on its next request. Nothing needs to change in the workflows themselves.

## Good practices

- Create one API credential per system and per privilege level, with the narrowest scopes the external system allows.
- Use the description to record who owns the credential on the external system and what it is allowed to do.
- Rotate secrets periodically, and immediately if you suspect they were exposed.
- Keep secrets out of workflow inputs, step bodies, and settings: always reference an API credential instead.

## See also

- [Agentic Workflow](/products/ai-foundry/basic-concepts/22_workflow.md): the steps that use API credentials.
- [Build, run, and test agentic workflows](/products/ai-foundry/orchestration/20_workflows.md): securing a workflow in practice.
- [AI security](/products/ai-foundry/administration/10_ai-security.md): virtual keys, teams, and LLM credentials.
