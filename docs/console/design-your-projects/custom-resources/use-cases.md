---
id: custom-resources-use-cases
title: Use Cases
sidebar_label: Use Cases
---

The following examples showcase how users can leverage **Custom Resources** in different scenarios.

:::tip
Find out all there is to know about Custom Resources in the [dedicated section](./custom-resources.md).
:::

### Traefik IngressRoute

In this use case, the user manages Kubernetes Ingress routing for Traefik. They can either copy an existing Traefik IngressRoute Custom Resource Definition (CRD) directly into the editor in Console, or create a new one from scratch. This approach provides users with fine-tuned control over how Ingress routes are configured.

Alternatively, users can opt to create the resource from the Marketplace. This version offers simplified management of key configuration fields, such as the host and service name, making the process more accessible for users who may not need the full flexibility of direct CRD management.

This use case is ideal for users who require granular control over routing rules and protocols, or for those who prefer a simplified way to handle basic Ingress configurations.

### kube-green SleepInfo

This use case involves using [kube-green](https://kube-green.dev/) to automate sleep schedules for Kubernetes clusters in order to optimize resource usage. Like the Traefik IngressRoute use case, users can manage the SleepInfo CRD directly within the Console. This resource can be used to define when a cluster should "sleep", reducing its resource usage, during non-peak hours.

However, unlike the previous example, this resource is typically activated only in non-production environments, such as development or staging, to prevent disruptions in production-critical services.

This use case is particularly beneficial for organizations that want to reduce the CO2 footprint of their clusters and optimize resource costs in environments that don't require constant uptime.

### AWS Lambda

AWS Lambda functions can be managed in different ways, depending on the user’s needs. One option allows users to create a Kubernetes custom resource for Lambda directly from the Marketplace. The Lambda function is managed by an operator within the Kubernetes cluster, and users can write the Lambda code directly from the Console.

Another option is for the user to create a custom resource from the Marketplace that generates a code repository for the Lambda function. In this case, users can develop the Lambda code separately and then package it into a Docker image.

A third approach is to manage AWS Lambda functions via CloudFormation. This method is ideal for users who prefer working with AWS-native tools and infrastructure-as-code patterns.

These three options provide different levels of flexibility for users who require integration with AWS infrastructure.

### Amazon EC2

This use case is similar to the AWS Lambda example but focuses on the creation of EC2 instances. Users can either generate a Kubernetes CRD to manage EC2 instances through an operator in the cluster or generate Terraform files to manage infrastructure outside of Kubernetes.

The first approach, using Kubernetes operators, allows users to create and manage EC2 instances directly through their Kubernetes environment. The second approach, which involves generating Terraform files, offers a more advanced option for users needing to manage complex cloud infrastructure across multiple environments.

This flexibility allows users to choose between simple, Kubernetes-native management or more comprehensive infrastructure-as-code practices using Terraform, depending on their project needs.

### MongoDB Atlas Creation

This use case involves managing MongoDB Atlas databases with Kubernetes custom resources. Users can manage a MongoDB Atlas database by leveraging a Kubernetes operator, defining essential credentials like username, password, and the database name via Custom Resources in the Console.

For more advanced use cases, users can write a custom resource that generates a Terraform file, which can be used to manage MongoDB Atlas with greater control, including configurations for scaling, backups, and security settings.

This approach provides a straightforward method for managing small-scale database setups via the Kubernetes operator, while advanced users can opt for full Terraform-based management to integrate MongoDB with broader infrastructure.
