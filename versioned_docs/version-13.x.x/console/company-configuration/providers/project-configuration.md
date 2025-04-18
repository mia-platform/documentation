---
id: project-configuration
title: Associate Providers to Projects
sidebar_label: Associate Providers to Projects
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you haven't specified a default provider on a certain capability, or you wish to overwrite the default provider configurations on a specific Project within the company, you will need to manually associate the provider with the Project you want to use it for.

To do this, you can use the CMS: navigate through the `Projects` section, select the desired Project, and edit the document by following the guidelines below, which specify what information to include depending on the provider type and capability.

### Edit a Git Provider

:::warning
Data migration from the old to the new provider is not managed. If you want to replace the Git Provider you will have to manually migrate your repository.
:::

To change the Git Provider of a Project, simply edit the `providerId` field within the `Repository` object by entering the `providerId` you want to use instead of the previous one (obtainable by moving to the `Providers` section of the CMS and taking the `providerId` of the referenced document).

In this case there is no difference in configuration depending on the provider type, so for each of the supported providers an example configuration of the `Repository` object could be as follows.

##### Example Configuration

  ```json
  {
    "providerId": "my-provider"
  }
  ```

### Edit Secret Manager

:::warning
Data migration from the old to the new provider is not managed. If you want to replace the Secret Manager you will have to manually migrate your secret variables.
:::

To change the Secret Manager of a Project, you need to edit the `Environments variables` object by replacing the values of the following fields:

* **providerId**: the unique identifier of the provider (obtainable by moving to the `Providers` section of the CMS and taking the `providerId` of the referenced document);
* **type** (*required*): one of the supported provider types. Refer to the list of [supported providers](/console/company-configuration/providers/overview.md).

In addition, you may need to include the following information, depending on the provider type:

<Tabs>
<TabItem value="gitlab" label="GitLab">

* **baseUrl**: the base path from which the variables will be read.
    If not specified, variables will be read from the first parent group of the Configurations Project in GitLab.
    As an example, if your GitLab Project is saved in **`https://git.tools.mia-platform.eu/mia-platform/Test/configurations`**, the environment variables will be written in the **`mia-platform/Test`** group.

* **storage**: additional settings related to the storage of environment variables within the GitLab installation.

  It is composed of the following properties:

  * **path**: specifies the exact location for reading variables, starting from the _baseUrl_.
  * **type**: the level of granularity with which variables are managed within the GitLab installation.
    It determines the scope within which variables will be available to the pipelines.

    Either one of the following:
    * `groups`: variables will be managed at the group level;
    * `projects`: variables will be managed at the Project level.


  #### Example Configurations

  ```json
  {
    "providerId": "my-gitlab",
    "type": "gitlab",
    "baseUrl": "https://my-gitlab-host",
    "storage": {
      "type": "projects",
      "path": "clients/mia-platform/configurations"
    }
  }
  ```

</TabItem>
<TabItem value="vault" label="Vault">

The example configuration for Vault:

```json
{
  "providerId": "my-vault",
  "type": "vault"
}
```

</TabItem>
</Tabs>

In addition, it is also possible to change the Secret Manager of a specific environment within the Project.
To do this, you need to modify the `environmentsVariables` object within the referenced environment in the `Environments` object
(from the CMS: `Environments` > *environment object* > `environmentsVariables`). The fields to be edited are the same as described above.

:::caution
You can change the Secret Manager within individual environments, but the provider type used must be the same
(for example, if you use Vault as a Secret Manager on all environments, you can go and replace the Secret Manager of one of them with another instance of Vault, but not with an instance of GitLab).
:::

### Edit CI/CD Tool

To change the CI/CD Tool of a Project, you need to edit the `Pipelines` object by replacing the values of the following fields:

* **providerId**: the unique identifier of the provider (obtainable by moving to the `Providers` section of the CMS and taking the `providerId` of the referenced document);
* **type** (*required*): one of the supported provider types. Refer to the table at the top of this page for the complete list of [supported providers](/console/company-configuration/providers/overview.md).

In addition, you may need to include the following information, depending on the provider type:

<Tabs>
<TabItem value="gitlab" label="GitLab">

#### Example Configuration

```json
{
  "providerId": "my-gitlab",
  "type": "gitlab-ci"
}
```
</TabItem>
<TabItem value="github" label="GitHub">

#### Example Configuration

```json
{
  "providerId": "my-github",
  "type": "github-actions"
}
```
</TabItem>
<TabItem value="azure-devops" label="Azure DevOps">

- **azurePipelineId**: a unique identifier that can be used to reference and identify a pipeline.

Learn more on how to retrieve the ID of a pipeline on the Azure DevOps [pipelines documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines).

#### Example Configuration

```json
{
  "providerId": "my-azure",
  "type": "azure-pipelines",
  "azurePipelineId": "{PIPELINE_ID}"
}
```

</TabItem>
<TabItem value="jenkins" label="Jenkins">

- **options**: an object containing the `view` property.

  In Jenkins, pipeline views allow you to visualize and monitor your pipelines and their status in a more organized and user-friendly way, making it easier to track their progress and health.

  The `view` configuration includes the following fields: 

  - **name**: the name of the visualization step where Jenkins pipelines are shown.

#### Example Configuration

```json
{
  "providerId": "my-jenkins",
  "type": "jenkins",
  "options": {
    "view": { "name": "my-view" }
  }
}
```

</TabItem>
</Tabs>

In addition, it is also possible to change the CI/CD Tool of a specific environment within the Project.
To do this, you need to modify the `deploy` object within the referenced environment in the `environments` object
(from the CMS: `Environments` > *environment object* > `deploy`). The fields to be edited are the same as described above.
