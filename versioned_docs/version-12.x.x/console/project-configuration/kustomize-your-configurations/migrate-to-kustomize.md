---
id: migrate-to-kustomize
title: Migrate to Kustomize
sidebar_label: Migrate to Kustomize
---

Kustomize is a useful tool for customizing Kubernetes resources declaratively. With Kustomize you can specify patches or new resources that can be applied to a specific runtime environment.

To migrate from a default project to a Kustomize project you need to follow these steps:

1. Since Kustomize uses a folder structure that is different from the default project's one, you need to manually move resources in the git repository.

  First of all, you need to move all of your environment folders (located at `configuration/%envId%`) to a new first-level directory called `overlays`. Then, move the `variables/%envId%.env` files into `overlays/%envId%/variables.env`.
  
  Create the file `configuration/kustomization.yaml` with the following content:
  
  ```yaml
  apiVersion: kustomize.config.k8s.io/v1beta1
  kind: Kustomization
  ```

  And the `overlays/%envId%/kustomization.yaml` files with the following content:

  ```yaml
  apiVersion: kustomize.config.k8s.io/v1beta1
  kind: Kustomization
  resources:
    - ../../configuration
  ```

  For more information on how to fill the `kustomization.yaml` files, please refer to the [official documentation](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/#kustomize-feature-list).

  In practice, you should change the structure from this one:
  
  ```plain
  .
  ├── configuration
  │   ├── %resourceName%.yaml
  │   └── %envId%
  |       └── %resourceName%.yaml
  └── variables
      └── %envId%.env
  ```
  
  To this one:
  
  ```plain
  .
  ├── configuration
  │   ├── kustomization.yaml
  │   └── %resourceName%.yaml
  └── overlays
      └── %envId%
          ├── kustomization.yaml
          ├── variables.env
          ├── %resourceName%.yaml        
          └── %patchName%.patch.yaml
  ```

2. Enable the feature from the CMS. Go to the projects page, search for the project and select it. Inside the project drawer go to the `deploy` section and add the following property: `"projectStructure": "kustomize"` to the deploy configuration JSON object.

3. Configure the deploy pipeline. Add in the deploy pipeline the command to generate the customized resources with [`mlp`](https://github.com/mia-platform/mlp):

  ```sh
  mlp hydrate "configuration" "overlays/${ENV_ID}"
  mlp kustomize "overlays/${ENV_ID}" -o "${DESTINATION_FILE}"
  ```

  This command will generate the customized resources for the provided `${ENV_ID}` environment and store them into a single file at `${DESTINATION_FILE}`. The generated file should then be provided as an argument to the `mlp deploy` command later in the pipeline.

Once you have migrated your project successfully, learn how to manage a Kustomize project [here](/console/project-configuration/kustomize-your-configurations/manage-a-kustomize-project.md).
