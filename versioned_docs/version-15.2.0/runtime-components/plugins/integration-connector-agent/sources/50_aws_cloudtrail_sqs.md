---
id: aws_cloudtrail_sqs
title: AWS CloudTrail SQS
sidebar_label: Aws cloudtrail sqs
---



This source allows the integration connector agent to receive events from AWS CloudTrail published to SQS using Amazon EventBridge.

## AWS Setup

To use this source type, you need to configure your AWS account so that all changes of intereset tracked by CloudTrail
are published to an SQS queue.

To configure AWS, you need to:

- create a new trail in [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
- create a new [SQS queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)
  dedicated to receiving CloudTrail events
- create an [EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-setup.html) rule that maps
  the desired sources and sends them to the SQS queue

:::caution
Currently, this source only supports the following resource types:

- S3 bucket (`aws.s3`)
- Lambda function (`aws.lambda`)

:::

### Full import

This source supports a full import of all assets in the AWS project.
To trigger a full import, you can send a `POST` request to the webhook path configured in the service configuration.

## Service Configuration

When configuring the AWS CloudTrail SQS source, you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the source, which should be set to `aws-cloudtrail-sqs`.
- `queueUrl` (*string*): The URL of the SQS queue to which CloudTrail events are published.
- `region` (*string*): The AWS region where the SQS queue is located.
- `accessKeyId` (*string*): access key ID from AWS
- `secretAccessKey` ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): secret access key from AWS
- `sessionToken` ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): session token from AWS
- `webhookPath` (*string*, optional): The path for the webhook expoed to trigger a full import.
- `authentication` (*object*, options): The authentication configuration
  - **secret** ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The secret used to validate the incoming webhook requests
  - **headerName** (*string*, optional): The name of the header used to validate the incoming webhook requests.

### Example

```json
{
	"type": "aws-cloudtrail-sqs",
	"queueUrl": "https://sqs.eu-north-1.amazonaws.com/123123123123/my-sqs-queue",
	"accessKeyId": "",
	"secretAccessKey": {"fromEnv": "AWS_SQS_SECRET_ACCESS_KEY"},
	"sessionToken": {"fromEnv": "AWS_SQS_SESSION_TOKEN"},
	"webhookPath": "/åws/import"
}
```

## Supported Events

The AWS CloudTrail SQS source supports the following CloudTrail sources:

- `aws.s3`
- `aws.lambda`

For the above sources, the integration connector agent supports the following event types:

- All `Create*` events
- All `Delete*` events
- All `Update*` events
- All `Publish*` events
