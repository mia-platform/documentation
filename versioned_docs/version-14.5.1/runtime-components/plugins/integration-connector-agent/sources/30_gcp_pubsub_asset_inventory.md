---
id: gcp_pubsub_asset_inventory
title: Google Cloud Asset Inventory API Pub/Sub
sidebar_label: Gcp pubsub asset inventory
---



This source allows the integration connector agent to receive events from the Google Cloud Asset Inventory API through
the Pub/Sub service.

## Google Cloud Setup

To use this source type, you need to configure your Google Cloud project so that all changes tracked by the Asset
Inventory API are published to a Pub/Sub topic.

To configure the Google Cloud Asset Inventory API Pub/Sub source, you need to:

- enable the Google Cloud Asset Inventory API
- create a Pub/Sub topic
- configure a feed between the Google Cloud Asset Inventory API and the Pub/Sub topic

:::tip
Find out more about how to [monitor asset changes](https://cloud.google.com/asset-inventory/docs/monitor-asset-changes).
:::

:::caution
Currently, this source only supports the following resource types:

- Bucket storage (`storage.googleapis.com/Bucket`)
- Cloud Run services (`run.googleapis.com/Service`)

:::

### Full import

This source supports a full import of all assets in the Google Cloud project.
To trigger a full import, you can send a `POST` request to the webhook path configured in the service configuration.

## Service Configuration

When configuring the Google Cloud Asset Inventory API Pub/Sub source,
you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the source, which should be set to `gcp-inventory-pubsub`.
- `projectId` (*string*): The ID of the Google Cloud project where the Pub/Sub topic is located.
- `topicName` (*string*): The name of the Pub/Sub topic to which the Google Cloud Asset Inventory API publishes events.
- `subscriptionId` (*string*): The ID of the Pub/Sub subscription that the integration connector agent
will use to receive events, if the subscription does not exist it will be created by the service at boot.
- `ackDeadlineSeconds` (*integer*, optional): The acknowledgment deadline for the subscription, in seconds.
This is the time within which the integration connector agent must acknowledge the received messages.
If not specified, it defaults to 10 seconds.
- `webhookPath` (*string*, optional): The path for the webhook expoed to trigger a full import.
- `authentication` (*object*, options): The authentication configuration
  - **secret** ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The secret used to validate the incoming webhook requests
  - **headerName** (*string*, optional): The name of the header used to validate the incoming webhook requests.

### Example

```json
{
	"type": "gcp-inventory-pubsub",
	"projectId" : "my-gcp-project-id",
	"topicName" : "my-assets-inventory-topic",
	"subscriptionId" : "ica-subscription",
	"ackDeadlineSeconds" : 10,
	"webhookPath": "/gcp/import"
}
```
