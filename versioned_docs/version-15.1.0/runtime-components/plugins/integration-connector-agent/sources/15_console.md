---
id: console
title: Mia-Platform Console
sidebar_label: Console
---



The Console source supports taking events from Console using the Console Webhook.

## Webhook Integration

The Console source integrates with webhooks by exposing an endpoint at `/console/webhook`.
When a webhook event is received, the following steps are performed:

1. **Validation**: The request is validated using the secret passed by the Webhook.
1. **Event Handling**: The event type is extracted from the payload and the corresponding event is sent to the pipeline.
From the event type, it is also determined which operation to use: `Write` or `Delete` operations are supported by the sinks.

### Service Configuration

The following configuration options are supported by the Console source:

- **type** (*string*): The type of the source, in this case `console`
- **authentication** (*object*) *optional*: The authentication configuration
  - **secret** ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The secret used to validate incoming webhook requests
- **webhookPath** (*string*) *optional*: The path where webhook events are received. Defaults to `/console/webhook`.

#### Example

```json
{
  "type": "console",
  "authentication": {
    "secret": {
      "fromEnv": "CONSOLE_WEBHOOK_SECRET"
    }
  },
  "webhookPath": "/webhook"
}
```

### How to Configure Console Webhook

To configure a webhook in Console, follow the steps described in [the documentation](/products/console/company-configuration/webhooks.md#add-a-webhook).

For the fields, you should set:

- **Target URL**: the URL where the Webhook will send the events. For the Console integration, the URL should be
  `http://<your-agent-host>[/optional-base-path]/console/webhook`;
- **Secret**: the secret used to validate incoming webhook requests. This secret should be the same
  as the one set in the authentication configuration.

## Supported Events

The Console source supports the following webhook events:

| Event                 | Event Type                 | Operation |
|-----------------------|----------------------------|-----------|
| Project Created       | `project_created`          | Write     |
| Service Created       | `service_created`          | Write     |
| Configuration Saved   | `configuration_saved`      | Write     |
| Tag Created           | `tag_created`              | Write     |

The operation used by the sink, which supports the upsert of the data, will determine if
the event should be inserted/updated or deleted.

:::info
The **event ID** used in the webhook payload is extracted from the fields described in the table above for each event type.
:::

### Events

On [this page](/products/console/company-configuration/events.mdx),
the events are listed with payload examples and the JSON schema.
