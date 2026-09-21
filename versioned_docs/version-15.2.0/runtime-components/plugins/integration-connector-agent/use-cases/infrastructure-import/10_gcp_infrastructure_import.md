---
id: gcp_infrastructure_import
title: Google Cloud Platform Infrastructure Import
sidebar_label: GCP infrastructure import
---



## Use Case Overview

This use case describes how to use the Integration Connector Agent to automatically import
Google Cloud Platform (GCP) infrastructure resource information into a Mia-Platform CRUD Service
collection. Once imported, this data can be visualized and managed through the Microfrontend
Composer, providing a centralized view of the organization's cloud resources.

## Google Cloud Platform Configuration

To enable the import of GCP resources, you need to configure the following services in the Google Cloud project:

### Services to Enable

1. **Cloud Asset Inventory API**: To track resource changes
1. **Pub/Sub**: To receive change notifications
1. **IAM**: To configure access credentials

### Asset Inventory Feed Configuration

You need to create a feed that sends resource changes to a Pub/Sub topic:

1. Create a dedicated Pub/Sub topic (e.g., `assets-inventory-topic`)
1. Configure an Asset Inventory API feed that publishes to this topic
1. Ensure the service account has the necessary permissions to access the topic

For more details on configuration, refer to the [official Google Cloud documentation](https://cloud.google.com/asset-inventory/docs/monitor-asset-changes).

## Integration Connector Agent Configuration

### Source Configuration

Configure the source to receive events from the Google Cloud Asset Inventory Pub/Sub topic.

For more details on this source type, see the
[Google Cloud Asset Inventory API Pub/Sub](/runtime-components/plugins/integration-connector-agent/sources/30_gcp_pubsub_asset_inventory.md) documentation.

```json
{
  "type": "gcp-inventory-pubsub",
  "projectId": "my-gcp-project-id",
  "topicName": "assets-inventory-topic",
  "subscriptionId": "ica-subscription",
  "ackDeadlineSeconds": 10,
  "webhookPath": "/gcp/import"
}
```

### Processor Configuration

Use the Cloud Vendor Aggregator to standardize GCP resource data.

For more details on this processor, see the
[Cloud Vendor Aggregator](/runtime-components/plugins/integration-connector-agent/processors/40_cloud_vendor_aggregator.md) documentation.

:::note
This processor will transform GCP events into a standardized format that can be easily ingested by other processors
and the CRUD Service.

Make sure this is the very first processor in your pipeline to ensure that all GCP events are processed correctly.
:::

```json
{
  "type": "cloud-vendor-aggregator",
  "cloudVendorName": "gcp",
  "authOptions": {
    "credentialsJson": {
      "fromEnv": "GCP_CREDENTIALS_JSON"
    }
  }
}
```

This processor will transform GCP events into a standardized format containing:

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
- `provider` (string): Cloud provider (always "gcp")
- `location` (string): Resource location
- `tags` (object): Tags associated with the resource
- `relationships` (array): Relationships to other resources
- `timestamp` (string): Last update timestamp
- `rawData` (string): Complete resource data in base64 format

It is recommended to create a unique index on the `name` field to ensure efficient upsert operations.

## Visualization with Microfrontend Composer

Once the import flow is configured, you can
[create a Composer page](/products/microfrontend-composer/overview.md) to
display GCP infrastructure resources in an interactive table.

To create a visualization page:

1. **Collection configuration**: Ensure the collection is exposed via CRUD Service endpoints
1. **Page creation**: Use the Composer to create a new page with a table component
1. **Data source configuration**: Connect the table to the collection endpoints
1. **View customization**: Configure columns, filters, and actions as needed
