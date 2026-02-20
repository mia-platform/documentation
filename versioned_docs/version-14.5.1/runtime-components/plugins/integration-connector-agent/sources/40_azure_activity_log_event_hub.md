---
id: azure_activity_log_event_hub
title: Microsoft Azure Monitor Activity Log Event Hub
sidebar_label: Azure activity log event hub
---



This source allows the integration connector agent to receive the Monitor Activity Log of an Azure subscription
through the Event Hub service.

## Microsoft Azure Setup

To use this source type, you need to configure your Microsoft Azure
subscription so that all the activity logs tracked in the Monitor section of your subscription are being
sent to an Event Hub.

To configure the Azure Activity Log Event Hub source, you need to:

- create an Event Hub namespace and an Event Hub inside it
- create a Storage Account and blob container
- configure the Monitor Activity Log to export the logs to the newly created Event Hub

:::tip
Find out more about how to [export activity log to Azure Event Hubs](https://learn.microsoft.com/en-gb/azure/azure-monitor/platform/activity-log?tabs=powershell#send-to-azure-event-hubs)
:::

:::caution
Currently, this source only supports the following resource types:

- Storage Account (`Microsoft.Storage/storageAccounts`)
- App Function and App Service (`Microsoft.Web/sites`)
- Virtual Machine (`Microsoft.Compute/virtualMachines`)
- Disk (`Microsoft.Compute/disks`)
- Virtual Network (`Microsoft.Network/virtualNetworks`)
- Network Interface (`Microsoft.Network/networkInterfaces`)
- Network Security Group (`Microsoft.Network/networkSecurityGroups`)
- Public IP Address (`Microsoft.Network/publicIPAddresses`)

:::

## Full Import

This source supports a full import of all assets in an Azure subscription.  
To trigger a full import, you can send a `POST` request to the webhook path configured in the service configuration.

## Service Configuration

When configuring the Azure Activity Log Event Hub source, you need to provide the following parameters in your
configuration file:

- `type` (*string*): The tyoe if the source, which should be set to ``
- `subscriptionId` (*string*): The ID of the Microsoft Azure subscription where the activity log and various resources
  are located
- `eventHubNamespace` (*string*): The Azure Event Hub namespace name
- `eventHubName` (*string*): The Event Hub name where the activity log events are exported
- `checkpointStorageAccountName` (*string*): The name of the storage account where the blob storage container is located
- `checkpointStorageContainerName` (*string*): The name of the blob storage container where the Event Hub checkpoints
  are saved
- `tenantId` (*string*): The tenant ID of the Azure Entra ID where the entity used to authenticate is located inside
  the subscription
- `clientId` ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The client ID of the entity used to authenticate
- `clientSecret` ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The client secret of the entity used to authenticate
- `webhookPath` (*string*, optional): The path for the webhook expoed to trigger a full import.
- `authentication` (*object*, options): The authentication configuration
  - **secret** ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The secret used to validate the incoming webhook requests
  - **headerName** (*string*, optional): The name of the header used to validate the incoming webhook requests.

### Example

```json
{
	"type": "azure-activity-log-event-hub",
	"subscriptionId": "00000000-0000-0000-0000-000000000000",
	"eventHubNamespace": "my-event-hub-namespace",
	"eventHubName": "my-event-hub-name",
	"checkpointStorageAccountName": "my-storage-account-name",
	"checkpointStorageContainerName": "my-storage-container-name",
	"webhookPath": "/azure/import"
}
```

## Single Authentication

In addition to these settings to allow the application to authenticate to the Microsoft Azure subscription you can set
the following environment variables instead of the equivalent source configuration:

- `AZURE_TENANT_ID`: The tenant ID of the Azure Entra ID where the entity used to authenticate is located inside
  the subscription
- `AZURE_CLIENT_ID`: The client ID of the entity used to authenticate
- `AZURE_CLIENT_SECRET`: The client secret of the entity used to authenticate

The values set in the configuration block will take precedence over the env variables.
