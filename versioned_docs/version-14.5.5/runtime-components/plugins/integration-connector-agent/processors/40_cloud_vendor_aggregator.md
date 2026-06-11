---
id: cloud_vendor_aggregator
title: Cloud Vendor Aggregator
sidebar_label: Cloud vendor aggregator
---



The Cloud Vendor Aggregator processor is designed to aggregate events from
various cloud vendors into a standardized asset shape.
This processor is particularly useful for organizations that need to manage and analyze assets across multiple cloud environments.

:::info
This processor is tightly coupled with the Cloud vendor-specific sources.

It's usage is recommended only if you are using the following sources:

- [Google Cloud Asset Inventory API Pub/Sub](/runtime-components/plugins/integration-connector-agent/sources/30_gcp_pubsub_asset_inventory.md)
- [AWS CloudTrail SQS](/runtime-components/plugins/integration-connector-agent/sources/50_aws_cloudtrail_sqs.md)
- [Microsoft Azure Monitor Activity Log Event Hub](/runtime-components/plugins/integration-connector-agent/sources/40_azure_activity_log_event_hub.md)

In such cases, the processor **MUST** be used as the very first processor in the pipeline
to ensure that the events are aggregated correctly before being sent to the next pipeline processors and the sink.
:::

## Processor Overview

The Processor is designed to produce a standardized asset shape that has the following structure:

| Field Name | Type | Description |
|------------|:----:|-------------|
| `name` | *string* | The name of the asset, typically derived from the cloud vendor-specific asset name. |
| `type` | *string* | The type of the asset, derived from the cloud vendor-specific asset type. |
| `provider` | *string* | The name of the cloud vendor, such as `gcp`, `aws`, or `azure`. |
| `location` | *string* | The location of the asset, such as a region or zone. |
| `tags` | *object* | A map of tags associated with the asset, where keys are tag names and values are tag values. |
| `relationships` | *array* | An array of strings representing relationships to other assets (e.g. the organization/project the resource is coming from) |
| `timestamp` | *string* | The timestamp of the generated asset, the string follows the ISO format |
| `rawData` | *string* | The event raw data from the cloud vendor, containing all the fields that were present in the original event. Note: this value is a base64 representation of the original binary data |

### Supported vendor Resources

Each vendor has currently a limited set of supported resources.

#### Google Cloud Platform (GCP)

- Bucket storage (`storage.googleapis.com/Bucket`)
- Cloud Run function (`run.googleapis.com/Service`)

#### AWS

- S3 bucket (`aws.s3`)
- Lambda function (`aws.lambda`)

#### Azure

- Storage Account (`Microsoft.Storage/storageAccounts`)
- App Function and App Service (`Microsoft.Web/sites`)
- Virtual Machine (`Microsoft.Compute/virtualMachines`)
- Disk (`Microsoft.Compute/disks`)
- Virtual Network (`Microsoft.Network/virtualNetworks`)
- Network Interface (`Microsoft.Network/networkInterfaces`)
- Network Security Group (`Microsoft.Network/networkSecurityGroups`)
- Public IP Address (`Microsoft.Network/publicIPAddresses`)

## Configuration

When configuring the Cloud Vendor Aggregator processor,
you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the processor, which should be set to `cloud-vendor-aggregator`.
- `cloudVendorName` (*string*): The name of the cloud vendor for which the events are being aggregated.
  This can be one of the following values:
  - `gcp`
  - `aws`
  - `azure`
- `authOptions` (*object*, optional): Authentication options for the cloud vendor; the fields are vendor-specific,
check out the below table for details.

:::caution
The `cloudVendorName` parameter is mandatory and must be set to the name of the cloud vendor based
on the source type you are using.
:::

### Authentication Options

#### Google Cloud Platform (GCP)

| Field Name | Type | Description |
|------------|:----:|-------------|
| `credentialsJson` | [*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource) | The content of the `credentials.json` provided by GCP, specified as a secret source. |

#### AWS

| Field Name | Type | Description |
|------------|:----:|-------------|
| `accessKeyId` | *string*   | Access Key ID from AWS. |
| `secretAccessKey` | [*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource) | Secret Access Key from AWS, specified as a secret source. |
| `sessionToken` | [*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource) | Session Token from AWS, specified as a secret source. |
| `region` | *string* (optional)   | The AWS region where the assets are located. |

#### Microsoft Azure

| Field Name | Type | Description |
|------------|:----:|-------------|
| `tenantId` | *string*   | The Azure tenant ID. |
| `clientId` | [*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource) | The Azure client ID, specified as a secret source. |
| `clientSecret` | [*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource) | The Azure client secret, specified as a secret source. |

### Example

#### Google Cloud Platform (GCP)

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

### AWS

```json
{
	"type": "cloud-vendor-aggregator",
	"cloudVendorName": "aws",
	"authOptions": {
		"accessKeyId": "your-access-key",
		"secretAccessKey": {
			"fromEnv": "AWS_SECRET_ACCESS_KEY"
		},
		"sessionToken": {
			"fromEnv": "AWS_SESSION_TOKEN"
		}
	}
}
```

### Microsoft Azure

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
