---
id: deploy
title: Deploy your workload
sidebar_label: Deploy your workload
---

Deploying a Project means transferring its configurations to a specific runtime environment, making it ready to be used by end-users.

:::info
Learn how to **deploy your Console projects** by reading the [dedicated documentation page](/development_suite/deploy/overview.md)
:::

The Mia-Platform Console supports two main deployment strategies: **pull-based** and **push-based**, which refer to how updates and changes are applied to target environments. The choice between these approaches depends on factors such as the nature of the application, the level of control desired and the overall deployment strategy.

### Pull-Based Deployment

**Pull-based deployment** involves the target environment autonomously fetching updates from a centralized source, typically a version control repository, when it is ready to apply the changes. The target environment "pulls" the updates on its own schedule, ensuring consistency and allowing for controlled, autonomous updates. This approach is often associated with the **GitOps philosophy**, where the desired state is defined in a Git repository, and automated tools pull and apply these changes to the target environment.

:::info
Learn more about the **GitOps deployment strategy** at the [dedicated documentation page](/development_suite/deploy/gitops-based/index.md).
:::

### Push-Based Deployment

**Push-Based Deployment** is characterized by changes being directly "pushed" or initiated by an external entity, such as a **CI/CD pipeline**. In this approach, updates are pushed to the target environment through API calls exposed on the cluster. While this strategy can provide rapid updates, it requires a more immediate connection between the source and target environments, which might expose the target to higher risk and require careful coordination.

:::info
Learn more about the **Pipeline-based deployment strategy** at the [dedicated documentation page](/development_suite/deploy/pipeline-based/index.md).
:::