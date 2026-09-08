---
id: aws_infrastructure_import
title: AWS Infrastructure Import
sidebar_label: AWS infrastructure import
---



## Use Case Overview

This use case describes how to use the Integration Connector Agent to automatically import
AWS infrastructure resource information into a Mia-Platform CRUD Service
collection. Once imported, this data can be visualized and managed through the Microfrontend
Composer, providing a centralized view of the organization's cloud resources.

## AWS Configuration

To enable the import of AWS resources, you need to configure the following services in your AWS account:

### Services to Enable

1. **AWS CloudTrail**: To track resource changes
1. **Amazon SQS**: To receive change notifications
1. **IAM**: To configure access credentials

### CloudTrail Configuration

You need to configure CloudTrail to send events to an SQS queue:

1. Create a dedicated SQS queue (e.g., `aws-cloudtrail-queue`)
1. Configure CloudTrail to send events to this SQS queue (e.g. via an EventBridge rule)
1. Ensure the IAM user/role has the necessary permissions to access the queue

For more details on configuration, refer to the [official AWS CloudTrail documentation](https://docs.aws.amazon.com/cloudtrail/latest/userguide/getting_started.html).

#### EventBridge Rule Configuration

```json
{
  "source": ["aws.s3", "aws.ec2", "aws.rds", "aws.lambda"]
}
```

## Integration Connector Agent Configuration

### Source Configuration

Configure the source to receive events from the AWS CloudTrail SQS queue.

For more details on this source type, see the
[AWS CloudTrail SQS](/runtime-components/plugins/integration-connector-agent/sources/50_aws_cloudtrail_sqs.md) documentation.

```json
{
  "type": "aws-cloudtrail-sqs",
  "queueUrl": "https://sqs.us-east-1.amazonaws.com/123456789012/aws-cloudtrail-queue",
  "region": "us-east-1",
  "accessKeyId": "your-access-key-id",
  "secretAccessKey": {
    "fromEnv": "AWS_SECRET_ACCESS_KEY"
  },
  "sessionToken": {
    "fromEnv": "AWS_SESSION_TOKEN"
  }
}
```

### Processor Configuration

Use the Cloud Vendor Aggregator to standardize AWS resource data.

For more details on this processor, see the
[Cloud Vendor Aggregator](/runtime-components/plugins/integration-connector-agent/processors/40_cloud_vendor_aggregator.md) documentation.

:::note
This processor will transform AWS events into a standardized format that can be easily ingested by other processors
and the CRUD Service.

Make sure this is the very first processor in your pipeline to ensure that all AWS events are processed correctly.
:::

```json
{
  "type": "cloud-vendor-aggregator",
  "cloudVendorName": "aws",
  "authOptions": {
    "accessKeyId": "your-access-key-id",
    "secretAccessKey": {
      "fromEnv": "AWS_SECRET_ACCESS_KEY"
    },
    "sessionToken": {
      "fromEnv": "AWS_SESSION_TOKEN"
    },
    "region": "us-east-1"
  }
}
```

This processor will transform AWS events into a standardized format containing:

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
- `provider` (string): Cloud provider (always "aws")
- `location` (string): Resource location
- `tags` (object): Tags associated with the resource
- `relationships` (array): Relationships to other resources
- `timestamp` (string): Last update timestamp
- `rawData` (string): Complete resource data in base64 format

It is recommended to create a unique index on the `name` field to ensure efficient upsert operations.

## Visualization with Microfrontend Composer

Once the import flow is configured, you can
[create a Composer page](/products/microfrontend-composer/overview.md) to
display AWS infrastructure resources in an interactive table.

To create a visualization page:

1. **Collection configuration**: Ensure the collection is exposed via CRUD Service endpoints
1. **Page creation**: Use the Composer to create a new page with a table component
1. **Data source configuration**: Connect the table to the collection endpoints
1. **View customization**: Configure columns, filters, and actions as needed
