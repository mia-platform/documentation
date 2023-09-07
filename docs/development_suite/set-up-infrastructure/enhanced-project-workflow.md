---
id: enhanced-project-workflow
title: Enhanced Project Workflow
sidebar_label: Enhanced Project Workflow
---

:::caution
This is a **BETA** feature and, as such, is currently under active development. Pay attention using it.

The feature is available in **PRIVATE BETA** since Mia-Platform Console v11.6.0, if you want to enable it please contact your Mia-Platform referent.
:::

The **Enhanced Project Workflow** feature aims to provide a better developer experience when working with the Console, as well as pave the way for the adoption of previously unavailable opportunities, such as the [GitOps deployment strategy](/development_suite/deploy/gitops-based/index.md).

## Changes to the Console workflow

The following sections will highlight the changes made to the established Console workflow, regarding in particular the new management of the Project logical state, and the new deployment workflow.

### New configuration management strategy

The most relevant change in the Console behavior is that the Project logical state will not be saved on your Git repository anymore. This results in significant **performance improvement** during the main Console workflows (especially in the [Design Area](/development_suite/api-console/api-design/overview.md)), since contacting the Git provider implied a considerable overhead that has now been completely removed.

This change also means that the Console will not rely on the typical Git-based instruments anymore and will instead adopt a **new configuration management system**, while still maintaining consistency with the established workflows; to emphasize this, the following features have been renamed:
- `branches` and `tags` become **`revisions`** and **`versions`**
- the `commit history` becomes **`version history`**

To keep track of the Project evolution, user can create `versions` (similar to Git tags) that act as fixed snapshots of the configuration in a particular moment.

Developers can manage *revisions* and *versions* from the dedicated sections inside the Project Settings area. Revisions can be accessed and deleted from the revisions management page:

![Revisions management page](img/revisions-overview.png)

Versions with their description and release note can be viewed and deleted through the versions management page:

:::info
Versions can only be deleted from Project Administrators
:::

![Versions management page](img/versions-overview.png)

### New deployment workflow

Another significant change is the way Console configurations are saved and deployed: Kubernetes **configurations will be generated and committed** to the Git repository only **during the deployment process**.

:::caution
When deploying your configurations to the cluster, keep in mind that only the changes pushed to the repository default branch will be considered.

If you want configuration to be committed on a different branch you can change the `repository.configurationBranch` property in your Project configuration (currently available only from CMS).
:::

When Kubernetes configuration are generated they get tailored for the specific environment you are deploying to. For this reason [Public Variables](/development_suite/api-console/api-design/public_variables.md) interpolation is now performed during configuration generation and, as such, can be skipped during the deployment pipeline. As such [Public Variable](/development_suite/api-console/api-design/public_variables.md) feature is now available even to Project that not using [`mlp`](/runtime_suite_tools/mlp/10_overview.md) or have a pipeline that does not support running custom code to execute variable interpolation.

The new deployment workflow also unlocks the possibility to adopt a **pull-based deployment strategy**, in which a GitOps tool can be set up to automatically align the cluster state to the latest changes pushed to the Git repository. To find out more about pull-based deployment and its advantages, visit the [GitOps deployment strategy documentation page](/development_suite/deploy/gitops-based/index.md).

## Roadmap and future improvements

:::note
The following features are still in development and will be available in future releases.
:::

### Kubernetes configuration review

Before deploying the configurations to the cluster, users will be able to **review** which workload changes are going to be deployed by opening the review modal. This operation gives the developer a clear view of what is going to be released on the runtime environment, and it is especially important if the user is deploying on a production environment. 

### Kubernetes configuration export

Users will be able to **export Kubernetes configurations** with a simple click of a button.

### Better deployment pipeline management

TODO

### Improvements to Project Settings

As of today, some **Project customizations** can be performed only through the backoffice:

- The repository default branch can be changed by updating the `repository.configurationBranch` property.
- The Project deploy strategy (useful to configure whether your Project is supposed to use a Pipeline-based or GitOps-based deployment approach) can be found in the `deploy.strategy` field for the global configuration that is inherited by all environments; to add environment specific settings you can patch the `environments[_].deploy.strategy`.

In the future, these properties will be managed in the Console, inside the [Project Settings](/console/project-configuration/project-settings.md) page.

### Compare Kubernetes configuration with those running in the cluster

With this feature Users will be able to not only review the configurations but also compare the differences with what is currently running in the cluster and understand the impacts the deploy will have before performing it.

### Migration support with automatic tools

With the first release of this new Workflow existing Project will require some migration operation to be performed, with this improvement we ought to provide further assistance in the migration process to make it as easy and smooth as possible.

## Activating the feature

:::info
In order to activate the feature on a Project or Company, please open a service request and ask for the support of a Mia-Platform referent.
:::

The Enhanced Project Workflow can be activated by enabling two different feature toggles. This operation can be performed by your Mia-Platform referent, who will choose the option that most fits your needs. 

The `ENABLE_CONF_GENERATION_ON_DEPLOY` feature toggle activates the new versioning system and the generation of Kubernetes configurations at the time of deployment. It can be enabled for a single Project or for an entire Company, which means all projects in the Company, old and new ones, will adopt the new workflow.

If you already have a Company with some projects, and you do not wish to migrate them to the new approach just yet, you can choose the `ENABLE_CREATE_PROJECT_WITH_SAVE_CONFIG_ON_DEPLOY` feature toggle, to be activated on the Company. This feature toggle makes sure that all new projects in the Company will be created with the new workflow, while leaving the existing ones untouched. 

:::note
If both feature toggles are enabled, `ENABLE_CONF_GENERATION_ON_DEPLOY` will prevail.
:::

## Migrating your projects

Some essential manual adjustments are necessary to make sure your newly created and already existing projects work correctly with the Enhanced Project Workflow.

### General adjustments

The migration process for an existing Project is currently completely manual and impacts several entities, the process can be summarized with the following steps:

 - Git repository structure clean-up
 - Feature activation
 - Setup default revision and few Project Settings

#### Git repository structure clean-up

With the new Workflow we have decided to change and unify the Git repository structure; prior to this change we are supporting two different folder structures based on whether the Project is using [`kustomize`](/console/project-configuration/kustomize-your-configurations/migrate-to-kustomize.md); now we are supporting a single folder structure that contains:

- an `environments` directory, automatically generated by the Console, containing one directory for each environment, inside which all the necessary configurations are generated and stored after each push;
- a `configuration` directory, with all your global customizations to be applied to all environments, and a `kustomization.yaml` manifest if you are using [`Kustomize`](/console/project-configuration/kustomize-your-configurations/manage-a-kustomize-project);
- an `overlays` directory, containing one directory for each environment, inside which all your environment-specific patch files are stored, as well as a `kustomization.yaml` manifest if you are using [`Kustomize`](/console/project-configuration/kustomize-your-configurations/manage-a-kustomize-project).

The final repository structure should be similar to the following: 

```
├── overlays
│ ├── dev
│ │ └─── <dev custom file>
│ ├── production
│ │ └─── <prod custom file>
│ ├── other_env_id
│ │ └─── <env_id custom file>
│ └── ....
│
├── configuration
│ └─── <global custom files>
│
├── environments
│ ├── dev
│ │ └── <k8s config files>
│ ├── production
│ │ └── <k8s config files>
│ ├── other_env_id
│ │ └── <k8s config files>
│ └ .....
```

:::info
All the contents of the `environments` directory are generated from scratch each time, any additional file that is not managed by the Console will be overwritten!
:::

:::caution
If you are already working on a Project based on Kustomize, make sure that the `overlays/:env/kustomization.yml` file imports the proper resource within the `environments/:env/kustomization.yml` instead of the `configuration/kustomization.yml`. The Console, when generating the `environments/:env/kustomization.yml` will automatically import the `configuration/kustomization.yml` if present.

As such the final look of the `kustomization.yaml` within the overlays directory should look like the following example:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- ../../environments/development
```
:::

#### Feature Activation

Follow up what's explained in the [Activating the feature](#activating-the-feature) section, if you are activating the feature on a single Project proceed with enabling the `ENABLE_CONF_GENERATION_ON_DEPLOY` feature toggle on the specific Project rather than on the whole Company.

#### Projet Settings configuration

When you activate the Feature some new [Project Settings](/console/project-configuration/project-settings.md) will be available, specifically you will have to make sure the that the **default revision field** is not empty; if so you can select the revision you want to use; if you are migrating an existing Project that used to have several branches, you will see here the branches you used to work on and select the desired branch as default revision.

:::info
If no default revision is set the Console will suggest you to work with a default revision named `main`, you can find it in the Project Settings and safely use it as default if you don't have anything else to select.
:::

If you want the Project to use a [**pull-based deployment strategy**](/development_suite/deploy/gitops-based/index.md#advantages-of-pull-based-deployment), its configuration must contain the `strategy` property set to `pull` (the value for push-based deployments is `push`). Based on the selected strategy, the `runnerTool` may take different values. 

:::note
For now, the deployment strategy can only be set from the backoffice. Please ask the support of your Mia-Platform referent to change it.
:::

### Further adjustments

Here are some **points of attention** and possible modifications needed to make sure everything works properly on the Git repository:

- All the Console configuration state files that were previously saved on Git can be safely removed, this comprehends the following list of files and directories:
  - `api-console-config.json`
  - `fastdata-config.json`
  - `mia-craft-config.json`
  - `rbacManagerConfig.json`
  - `backofficeConfigurations.json`
  - `config-maps`
  - `config-extension`
  - `variables`
  - `overlays/:env/variables.env`
- If you have a pipeline file (e.g. `gitlab-ci.yml`) it may contain deployment scripts that may work based  the repository directory structure based on the previous directory structure. For this reason custom pipelines have to be updated according to the new directory structure; if your Project is using a pipeline provided by Mia-Platform templates a new template can be used, ask your Mia-Platform referent to know which one.
- If you are **deploying without Kustomize**, you may find, within the `configuration` directory, a set of directories, one for each environment of your Project. You need to create the `overlays` directory, where you have to move environment directories previously stored inside `configuration`. No actions are required for the custom files in the `configuration` directory.
- If you are **using Kustomize**, the `configuration` directory contains a `kustomization.yaml` manifest and possibly your custom files, which are already in the right spot. You can delete every other file inside the directory.

    Also, make sure that: 
    - Inside each `overlays/<environment>` directory, the `kustomization.yaml` manifest imports the corresponding manifest from the `environments/<environment>` directory, if you don't have the `environments` directory yet don't worry, it'll be created at your first deployment!
