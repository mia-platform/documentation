---
id: enhanced-project-workflow
title: Enhanced Project Workflow
sidebar_label: Enhanced Project Workflow
---

The **Enhanced Project Workflow** feature aims at providing a better developer experience when working with Mia-Platform Console, as well as pave the way for the adoption of previously unavailable opportunities, such as the [GitOps deployment strategy](/products/console/deploy/gitops-based/index.md).

## Benefits of the Enhanced Workflow

The technological changes underlying this new workflow provide improvements in both *user experience* and *development of future functionalities*; as such, there are several benefits of adopting the **Enhanced Project Workflow**:

### Tailored orchestrator configurations

By generating the orchestrator objects (e.g. *Kubernetes Deployment files*) at deploy time, the **generated configuration files can now be tailored for the selected environment**. In addition, it is possible to configure an [External Orchestrator Generator](/products/console/company-configuration/providers/extensions/orchestrator-generator/overview.mdx) to customize the generation of orchestrator files on deploy. 

Generated configurations are still saved on your Git provider repository in different directories, based on the deployed environment and in the Deploy section of Console you can review the configuration before to deploy by leveraging the [review feature](/products/console/deploy/overview.md#export-and-review-configuration-files).

### GitOps Support

As mentioned, one of the most relevant features of the **Enhanced Project Workflow** is the [GitOps deployment strategy](/products/console/deploy/gitops-based/index.md) support.

This means you can leverage Mia-Platform Console and **run deployments with your favorite GitOps tool** (e.g. [ArgoCD](/products/console/deploy/gitops-based/configure-argocd.md))

### Gitless Design Configurations

The most relevant change in the Console behavior is that the Project logical state will not be saved on your Git repository anymore. This results in significant **performance improvement** during the main Console workflows (especially in the [Design Area](/products/console/api-console/api-design/overview.md)), since contacting the Git provider implied a considerable overhead that has now been completely removed. **Moving away from such an architecture** and limiting the interactions with any Git Provider only when they are truly needed (e.g. saving orchestrator configurations) **allowed us to provide a faster user experience**. 

For example, **the average time** for loading a Project configuration in the Design Area has moved **from ~4s to ~200ms**.

With the Enhanced Workflow, configuration saves made during the Design phase no longer depend on a Git Provider and are managed in the Console using different names to identify them:

- `Snapshots`: individual user saves
- `Revisions`: equivalent to branches and collect a series of snapshots
- `Versions`: equivalent to tags and are used to mark specific snapshots with a version to be released

The management of these entities can be directly controlled in the Console as explained on the corresponding [documentation page](/products/console/set-up-infrastructure/revisions-and-versions.md).

### Design advanced section featured in Merge

The [Advanced section](/products/console/api-console/advanced-section/index.md) in Design Area is featured in all stages of the workflow, and no longer needs a separate configuration management strategy. This means that you can safely use this section without worrying about duplicate commits or the inability to manage extensions during merge of configurations.

## Start using the Enhanced Workflow

The Enhanced Workflow could be activated on existing projects following the migration guide on this [link](/products/console/set-up-infrastructure/migration-and-creation-project.md#migrate-existing-projects) or also on the new projects during the [project creation process](/products/console/set-up-infrastructure/migration-and-creation-project.md#create-a-new-project-with-enhanced-workflow)
