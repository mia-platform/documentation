---
id: azure_infrastructure_import
title: Azure Infrastructure Import
sidebar_label: Azure infrastructure import
---



## Use Case Overview

This use case describes how to use the Integration Connector Agent to automatically import
Microsoft Azure infrastructure resource information into a Mia-Platform CRUD Service
collection. Once imported, this data can be visualized and managed through the Microfrontend
Composer, providing a centralized view of the organization's cloud resources.

## Azure Configuration

To enable the import of Azure resources, you need to configure the following services in your Azure subscription:

### Services to Enable

1. **Azure Monitor Activity Log**: To track resource changes
1. **Azure Event Hubs**: To receive change notifications
1. **Azure Active Directory**: To configure access credentials

### Activity Log Event Hub Configuration

You need to configure Azure Monitor to send activity log events to an Event Hub:

1. Create a dedicated Event Hub namespace and hub (e.g., `azure-activity-log-hub`)
1. Configure Azure Monitor Activity Log to stream to this Event Hub
1. Ensure the service principal has the necessary permissions to access the Event Hub

For more details on configuration, refer to the [official Azure Monitor documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log).

## Integration Connector Agent Configuration

### Source Configuration

Configure the source to receive events from the Azure Monitor Activity Log Event Hub.

For more details on this source type, see the
[Azure Activity Log Event Hub](/runtime-components/plugins/integration-connector-agent/sources/40_azure_activity_log_event_hub.md) documentation.

```json
{
  "type": "azure-activity-log-eventhub",
  "eventHubNamespace": "azure-activity-log-namespace",
  "eventHubName": "azure-activity-log-hub",
  "consumerGroup": "$Default",
  "connectionString": {
    "fromEnv": "AZURE_EVENT_HUB_CONNECTION_STRING"
  }
}
```

### Processor Configuration

Use the Cloud Vendor Aggregator to standardize Azure resource data.

For more details on this processor, see the
[Cloud Vendor Aggregator](/runtime-components/plugins/integration-connector-agent/processors/40_cloud_vendor_aggregator.md) documentation.

:::note
This processor will transform Azure events into a standardized format that can be easily ingested by other processors
and the CRUD Service.

Make sure this is the very first processor in your pipeline to ensure that all Azure events are processed correctly.
:::

```json
{
  "type": "cloud-vendor-aggregator",
  "cloudVendorName": "azure",
  "authOptions": {
    "tenantId": "your-tenant-id",
    "clientId": {
      "fromEnv": "AZURE_CLIENT_ID"
    },
    "clientSecret": {
      "fromEnv": "AZURE_CLIENT_SECRET"
    }
  }
}
```

This processor will transform Azure events into a standardized format containing:

- Resource name and type
- Geographic location
- Tags and metadata
- Change timestamps
- Raw data for in-depth analysis

### Sink Configuration

Configure the sink to save data to the CRUD Service collection.

For more details on this sink type, see the [CRUD Service Sink](/runtime-components/plugins/integration-connector-agent/sinks/30_crudservice.md) documentation.

```json
{
  "type": "crud-service",
  "url": "https://crud-service/infrastructure-assets/",
  "insertOnly": false,
  "primaryKeyFieldName": "_eventId"
}
```

## CRUD Service Configuration

Ensure that the `infrastructure-assets` collection is configured in the CRUD Service with the following fields:

- `name` (string): Resource name (primary key field)
- `type` (string): Resource type
- `provider` (string): Cloud provider (always "azure")
- `location` (string): Resource location
- `tags` (object): Tags associated with the resource
- `relationships` (array): Relationships to other resources
- `timestamp` (string): Last update timestamp
- `rawData` (string): Complete resource data in base64 format

It is recommended to create a unique index on the `name` field to ensure efficient upsert operations.

## Visualization with Microfrontend Composer

Once the import flow is configured, you can
[create a Composer page](/products/microfrontend-composer/overview.md) to
display Azure infrastructure resources in an interactive table.

To create a visualization page:

1. **Collection configuration**: Ensure the collection is exposed via CRUD Service endpoints
1. **Page creation**: Use the Composer to create a new page with a table component
1. **Data source configuration**: Connect the table to the collection endpoints
1. **View customization**: Configure columns, filters, and actions as needed
