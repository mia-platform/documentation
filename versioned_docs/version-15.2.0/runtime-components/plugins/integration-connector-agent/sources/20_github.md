---
id: github
title: GitHub
sidebar_label: Github
---



The GitHub source allows the integration-connector-agent to receive events from GitHub via webhooks.

## Webhook Integration

The GitHub source integrates with webhooks by exposing an endpoint at `/github/webhook` (configurable).
When a webhook event is received, the following steps are performed:

1. **Validation**: The request is validated using the secret passed by the Webhook (HMAC SHA256 signature, as per
  GitHub's requirements).
1. **Event Handling**: The event type is extracted from the `X-GitHub-Event` header and injected into the event payload
  for routing. The event is then sent to the pipeline. The operation (e.g., `Write`) is determined based on the event
  type and action.

### Service Configuration

The following configuration options are supported by the GitHub source:

- **type** (*string*): The type of the source, in this case `github`
- **authentication** (*object*) *optional*: The authentication configuration
  - **secret** ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The secret used to validate incoming webhook requests
- **webhookPath** (*string*) *optional*: The path where to receive the webhook events. Defaults to `/github/webhook`.

#### Example

```json
{
  "type": "github",
  "webhookPath": "/webhook",
  "authentication": {
    "secret": {
      "fromEnv": "GITHUB_SECRET"
    }
  }
}
```

### How to Configure GitHub

To configure a webhook in GitHub, follow the steps described in [GitHub's webhook documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks).

Set the following fields:

- **Payload URL**: The URL where the webhook will send events. For the GitHub integration, use `http://<your-agent-host>[/optional-base-path]/github/webhook`.
- **Content type**: `application/json` (recommended) or `application/x-www-form-urlencoded` (both are supported).
- **Secret**: The secret used to validate incoming webhook requests. This must match the one set in the authentication configuration.
- **Events**: Select the events you want to subscribe to (currently, only `pull_request` is supported).

## Supported Events

The GitHub source currently supports the following webhook event:

| Event         | Event Type         | Example Payload                | Operation |
|---------------|--------------------|-------------------------------|-----------|
| pull request  | `pull_request`     | [link](#pull-request-event-payload) | Write     |

:::info
The **event type** is extracted from the `X-GitHub-Event` header and injected into the payload as `eventType` for
downstream processing.
:::

The operation is used by the sink to determine if the event should be inserted/updated or deleted.

### Example Payloads

#### Pull Request Event Payload

The **event ID** used in the webhook payload is extracted from the `pull_request.id` field.

The following is an example of a `pull_request` event payload:


Pull Request Event Payload

```json
{
  "action": "opened",
  "number": 2,
  "pull_request": {
    "url": "https://api.github.com/repos/organization-name/project-name/pulls/2",
    "id": 2551578928,
    "html_url": "https://github.com/organization-name/project-name/pull/2",
    "title": "Create+test.json",
    "user": {
      "login": "johndoe",
      "id": 101523824
    },
    "body": "test+description",
    "created_at": "2025-05-29T08:53:54Z",
    ...
  },
  "repository": {
    "id": 983530734,
    "name": "project-name",
    "full_name": "organization-name/project-name"
  }
}
```



### Extending Event Support

Refer to the [GitHub webhook event types documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads)
for a full list of available events.
To add support to another event, open a pull request to [this repo](https://github.com/mia-platform/integration-connector-agent),
changing the [supported events mapping](https://github.com/mia-platform/integration-connector-agent/blob/main/internal/sources/github/events.go).
