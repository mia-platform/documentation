---
id: custom-resources-use-cases
title: Use Cases
sidebar_label: Use Cases
---

The following examples showcase how users can leverage **Infrastructure Resources** in different scenarios.

:::tip
Find out all there is to know about Infrastructure Resources in the [dedicated section](/products/console/design-your-projects/custom-resources/custom-resources.md).
:::

## Template-based Infrastructure Resources

### AWS Lambda

AWS Lambda functions can be managed in different ways, depending on the user’s needs. One option allows users to create a Custom Kubernetes Resource for Lambda directly from the Marketplace.
The Lambda function is managed by an operator within the Kubernetes cluster, and users can write the Lambda code directly from the Console.

Another option is for the user to create an Infrastructure Resource from the Marketplace that generates a code repository for the Lambda function.
In this case, users can develop the Lambda code separately and then package it into a Docker image.

A third approach is to manage AWS Lambda functions via CloudFormation. This method is ideal for users who prefer working with AWS-native tools and infrastructure-as-code patterns.

These three options provide different levels of flexibility for users who require integration with AWS infrastructure.

Here is an example of a template-based Infrastructure Resource that creates a Lambda function:

:::tip
This CR features code directly within the configuration; in real-world scenario you might want the lambda codebase
to be versioned in a Git repository
:::


AWS Lambda


```yaml
name: my-lambda-function
meta:
    kind: LambdaTemplateGenerator
    apiVersion: custom-generator.console.mia-platform.eu/v1
spec:
    targetRuntime: nodejs20.x
    zipCode: 'exports.handler = async (event) => ({ statusCode: 200, body: JSON.stringify("Hello from Lambda!") })'
    memorySize: 1024
    timeout: 60
    id: MyFunction
generator:
    type: template
    configurationBaseFolder: aws-cloudformation
    templates:
    - name: lambda
        template: |
        AWSTemplateFormatVersion: '2010-09-09'
        Resources:
            Fn%spec.id%:
            Type: AWS::Lambda::Function
            Properties:
                %#spec.role%
                Role: %spec.role%
                %/spec.role%
                %^spec.role%
                Role: arn:aws:iam::694348909644:role/lambda-role
                %/spec.role%
                FunctionName: %metadata.name%
                Handler: index.handler
                Runtime: %spec.targetRuntime%
                Code:
                %#spec.zipCode%
                ZipFile: |
                    %spec.zipCode%
                %/spec.zipCode%
                %#spec.s3Code%
                S3Bucket: %spec.s3Code.bucketName%
                S3Key: %metadata.name%.zip
                %/spec.s3Code%
                MemorySize: %spec.memorySize%
                Timeout: %spec.timeout%
            FunctionUrl%spec.id%:
            Type: AWS::Lambda::Url
            Properties:
                TargetFunctionArn: !Ref Fn%spec.id%
                AuthType: NONE
        Outputs:
            PublicUrl:
            Value: !GetAtt FunctionUrl%spec.id%.FunctionUrl
            Description: The public URL to access the Lambda function
```




### Amazon EC2

This use case is similar to the AWS Lambda example but focuses on the creation of EC2 instances.
Users can either generate a Kubernetes CRD to manage EC2 instances through an operator in the cluster or generate Terraform files to manage infrastructure outside of Kubernetes.

The first approach, using Kubernetes operators, allows users to create and manage EC2 instances directly through their Kubernetes environment.
The second approach, which involves generating Terraform files, offers a more advanced option for users needing to manage complex cloud infrastructure across multiple environments.

This flexibility allows users to choose between simple, Kubernetes-native management or more comprehensive infrastructure-as-code practices using Terraform, depending on their project needs.

### MongoDB Atlas Creation

Similarly to [Amazon EC2](#amazon-ec2), it is possible to manage MongoDB Atlas databases with Infrastructure Resources as well.
Users can manage a MongoDB Atlas database by leveraging the [Kubernetes operator](https://www.mongodb.com/products/integrations/kubernetes/atlas-kubernetes-operator),
defining essential credentials like username, password, and the database name via Infrastructure Resources in the Console.

For more advanced use cases, users can write a Infrastructure Resources that generates Terraform files,
which can be used to manage MongoDB Atlas with greater control, including configurations for scaling, backups, and security settings.

This approach provides a straightforward method for managing small-scale database setups via the Kubernetes operator,
while advanced users can opt for full Terraform-based management to integrate MongoDB with broader infrastructure.

## Custom Kubernetes-specific Resources

### Traefik IngressRoute

In this use case, the user manages Kubernetes Ingress routing for Traefik. They can either copy an existing Traefik IngressRoute Infrastructure Resource Definition (CRD) directly into the editor in Console, or create a new one from scratch. This approach provides users with fine-tuned control over how Ingress routes are configured.

Alternatively, users can opt to create the resource from the Marketplace. This version offers simplified management of key configuration fields, such as the host and service name, making the process more accessible for users who may not need the full flexibility of direct CRD management.

This use case is ideal for users who require granular control over routing rules and protocols, or for those who prefer a simplified way to handle basic Ingress configurations.

Here is an example of a Traefik IngressRoute Infrastructure Resource:


Traefik IngressRoute


```yaml
name: traefik-ingressroute
  meta:
    apiVersion: traefik.io/v1alpha1
    kind: IngressRoute
  labels:
    - name: app.kubernetes.io/instance
      value: ingress-controller
  spec:
    entryPoints:
      - websecure
    routes:
      - match: Host(`{{PROJECT_HOST}}`)
        kind: Rule
        services:
        - name: api-gateway
          port: 8080
```




### kube-green SleepInfo

This use case involves using [kube-green](https://kube-green.dev/) to automate sleep schedules for Kubernetes clusters in order to optimize resource usage. Like the Traefik IngressRoute use case, users can manage the SleepInfo CRD directly within the Console. This resource can be used to define when a cluster should "sleep", reducing its resource usage, during non-peak hours.

However, unlike the previous example, this resource is typically activated only in non-production environments, such as development or staging, to prevent disruptions in production-critical services.

This use case is particularly beneficial for organizations that want to reduce the CO2 footprint of their clusters and optimize resource costs in environments that don't require constant uptime.

Here is an example of a kube-green SleepInfo Infrastructure Resource:


kube-green SleepInfo


```yaml
name: sleepInfo
meta:
    apiVersion: kube-green.com/v1alpha1
    kind: SleepInfo
spec:
    sleepAt: "20:00"
    timeZone: Europe/Rome
    weekdays: "1-5"
```



