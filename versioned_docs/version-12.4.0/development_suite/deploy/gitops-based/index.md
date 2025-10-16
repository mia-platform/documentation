---
id: gitops-based
title: GitOps deployment strategy
sidebar_label: GitOps deployment strategy
---

:::caution
This is a **BETA** feature and, as such, is currently under active development. It requires the activation of the [Enhanced Project Workflow](/development_suite/set-up-infrastructure/enhanced-project-workflow.md) in order to be used.
:::

**GitOps** is a modern approach to managing and automating the deployment of applications and infrastructure in a software development lifecycle. 
By enabling the new **Enhanced Project Workflow** on a Console project, it is possible to adopt a GitOps deployment strategy instead of the classic pipeline-based one.

## Introduction to GitOps

GitOps deployment is based on the principle of using Git repositories as the single source of truth for both application code and deployment configurations.

Popular tools that support the GitOps deployment strategy include [ArgoCD](https://argo-cd.readthedocs.io/en/stable/), [Flux](https://fluxcd.io/flux/), [Jenkins X](https://jenkins-x.io/), and more. Such tools operate by comparing the desired state of your project, as defined in the project’s Git repository, with the actual state of your Runtime resources. If there is a discrepancy, the tool may automatically take corrective actions to bring the cluster's state in line with the desired state.

**This way, it is guaranteed that the project configurations saved on the Git repository are always consistent with the project’s Runtime configurations.**

Adopting the GitOps approach facilitates the automated deployment and management of applications on Kubernetes clusters, making the deployment process more reliable, reproducible, and efficient.

## Advantages of pull-based deployment

The GitOps deployment strategy is often associated with a **pull-based approach**. In pull-based deployments, the cluster's state is automatically synchronized with the desired state stored in the Git repository.  
In fact, once the configurations are pushed to the Git repository, the deployment to the cluster will be handled automatically. This ensures that the deployed application is consistent with the latest version of the source code and configurations.

This approach stands in opposition to the [pipeline-based strategy](/development_suite/deploy/pipeline-based/index.md), in which a pipeline provider must be set up to trigger the deployment and apply the Kubernetes configurations (using tools like `kubectl` or [`mlp`](https://github.com/mia-platform/mlp)).

With pull-based deployment, you only need to update the Git repository to trigger changes. This **lowers the complexity of the deployment process**, since the cluster automatically aligns itself with the repository, reducing the need for explicit deployment commands. It also facilitates the process of rolling back to a previous version, which comes down to simply reverting the changes in the Git repository.

Another benefit is that **the cluster does not need to be accessed directly**, reducing its exposure to potential threats. In traditional deployment methods, pipelines often need direct access to the cluster to make changes. This introduces security risks, as any breach or unauthorized access to the pipeline could potentially compromise the entire cluster. In contrast, GitOps relies on the Git repository as the single source of truth. Authorized users make changes in the repository, and the GitOps tool, like ArgoCD, autonomously synchronizes the cluster with the desired state.

Moreover, in push-based deployment models, pipelines often require access to credentials to authenticate with the cluster and make changes. Storing credentials within pipelines increases the risk of inadvertent exposure or misuse. In GitOps, **credentials are typically configured within the GitOps tool** which often resides on the cluster itself and has specific authorization rules that are not shared with the pipeline code and context.

## Example GitOps tool configuration

* [ArgoCD](/development_suite/deploy/gitops-based/configure-argocd.md)
