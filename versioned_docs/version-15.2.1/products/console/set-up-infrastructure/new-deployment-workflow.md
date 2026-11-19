---
id: new-deployment-workflow
title: New Deployment Workflow
sidebar_label: New Deployment Workflow
---

The Enhanced Project Workflow introduces significant changes in the way Console configurations are saved and deployed: Kubernetes **configurations will be generated and committed** to the Git repository only **during the deployment process**.

:::caution
When deploying your configurations to the cluster, keep in mind that only the changes pushed to the repository default branch will be considered.

If you want configuration to be committed on a different branch you can change the `repository.configurationBranch` property in your Project configuration (currently available only from CMS).
:::

When Kubernetes configurations are generated, they get tailored for the specific environment you are deploying to. For this reason, [Public Variables](/products/console/api-console/api-design/public_variables.md) interpolation is now performed during configuration generation and, as such, can be skipped during the deployment pipeline. Therefore, the Public Variables feature is now available even to Projects that are not using [`mlp`](/runtime-components/tools/mlp/10_overview.md) or have a pipeline that does not support running custom code to execute variable interpolation.

The new deployment workflow also unlocks the possibility to adopt a **pull-based deployment strategy**, in which a GitOps tool can be set up to automatically align the cluster state to the latest changes pushed to the Git repository. To find out more about pull-based deployment and its advantages, visit the [GitOps deployment strategy documentation page](/products/console/deploy/gitops-based/index.md).

## Kubernetes configuration review and export

This workflow enables users to review, export and download generated configurations before these are even deployed to the cluster.  
This feature is available from the [Deploy Page](/products/console/deploy/overview.md#export-and-review-configuration-files) after selecting the revision to deploy.

![Compare and Review](../deploy/img/compare_and_review.png)