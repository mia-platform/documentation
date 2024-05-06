---
id: delete-an-environment
title: Delete an Environment
sidebar_label: Delete an Environment
---

After you have followed the steps needed to [remove an environment](/console/project-configuration/manage-runtime-environments/index.md#remove-an-environment) from your Console project, you are tasked with properly cleaning up your project on your Git provider from the resources and pipelines needed for the deployment on that environment.

## Cleanup the Pipeline

Following the deletion of the environment from the Console, you will need to manually clean the project CI file. The cleaning operations are to be repeated in **each** branch that was previously configured to support deployment to the specific environment.

The information entered as a result of the environment creation process should therefore be removed from the CI file: *cluster URL*, *cluster Service Account Token*, *cluster CA*, *environment variables prefix*. An example snippet of instructions to be removed, for the environment `environment-id`, is shown below:

```yaml
<environment-id>:
  variables:
    KUBE_URL: "${KUBE_CLUSTER_URL}"
    KUBE_TOKEN: "${KUBE_CLUSTER_TOKEN}"
    KUBE_CA_PEM: "${KUBE_CLUSTER_CA_PEM}"
    ENVIRONMENT_PREFIX: "<environment-variables-prefix>"

  scripts:
    - your script for deployment

  only:
    variables:
      - $ENVIRONMENT_TO_DEPLOY == "<environment-id>"
```

## Cleanup Git Provider

Once you have cleaned up the pipeline, you have to manually remove from the repository of **each** branch, folders and files that you have previously added for allowing the deployment on the deleted environment.
The files and folders to be removed vary depending on whether the project is *Plain* or *Kustomize*.

:::info What type is my project?
If you are unsure of the type of your project, you can verify this information through the CMS.
Another clue might be the presence of the `overlays` folder within the project repository, which typically indicates a Kustomize project.
:::

### Plain Project

In a plain project, the folder to be removed is a subfolder of `Configurations` that has your environment ID as name. Additionally, you have to delete the `<environment-id>.env` file inside the `variables` folder (this action will result in the deletion of the public environment variables associated with the environment).

### Kustomize Project

In a Kustomize project, all files are located inside `overlays/<environment-id>/`. It is therefore sufficient to delete this folder to cleanup the project repository.

## Cleanup Environment Variables

The cleanup of *public environment variables* is already done for **each** branch the moment you go to delete the `variables.env` file from the project repository.

Since *secreted environment variables* are set at the project level, you must instead go to the "Variables" section of the "Overview" area and manually delete the ones related to the deleted environment (they are easily recognizable because they adopt the environment variables prefix specified at the time of creation).
