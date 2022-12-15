---
id: add-environment
title: Configure a New Environment
sidebar_label: Configure a New Environment
---

After you have followed the steps needed to add a new environment to your Console project, you must properly configure your project on your Git provider to allow the Console to successfully run the deploy task.

## Enabling the Pipeline

Once you have created the environment on the Console you have to modify your pipeline, by modifying the CI file or via the UI of your pipeline tool for allowing the deployment to the new environment.

After the creation of the environment, the Console will prompt you to save the necessary data to connect to the target cluster for this environment. Be sure to copy all the data and save them inside your pipeline tool to use them for the remote connection. These data will be:

- the cluster CA;
- the cluster Endpoint;
- the cluster Service Account Token that can deploy inside the namespace created by the Console.

With this information, you can likely setup the tool of your choice to deploy against the
Kubernetes clusters. In your tool, you should add a step or a clause to the environment selection where to deploy the project from the parameters that the Console will provide you.

For example, if you use GitLab as deployment tool, you have to add something like this to your `.gitlab-ci.yml`:

```yaml
<environment-id>:
  variables:
    KUBE_URL: "${KUBE_CLUSTER_URL}"
    KUBE_TOKEN: "${KUBE_CLUSTER_TOKEN}"
    KUBE_CA_PEM: "${KUBE_CLUSTER_CA_PEM}"

  scripts:
    - your script for deploy

  only:
    variables:
      - $ENVIRONMENT_TO_DEPLOY == "<environment-id>"
```

In this example, the user has added as `KUBE_CLUSTER_*` variables the values of the target cluster for the new environment
(which can be different from each other), and used their value to set up the standard one that tools like `kubectl` use by default.

In this instance, the Console will call the pipeline with the `ENVIRONMENT_TO_DEPLOY` env set to the chosen `environment-id`,
which is used as a trigger to run only one job. This may differ in your pipeline.

## Setup Git Provider

Based on the development flow of your project, this setup must be done on all branches currently used with the new environment. You can choose to replicate the same commit in all branches, by doing the work on one and cherry-picking the commit in the others, or rebase development branches from the main one.

### Plain Project

If your Console project has configured resources that are not managed by the Console in one or more environments through yaml files inside the configurations subfolders, you have to create an additional folder for the new environment with the name that your deploy tool will expect for the environment, and add all the files you need.

For setting up a starting point for the Public Variables, you can create a new file inside the `variables` folder named `<environment-id>.env` copying the content from one of the other files inside that folder from one of the existing environments that is the more similar to the new one and than changing the values accordingly.

### Kustomize Project

If your project is of type Kustomize, you have to prepare the new environment folder inside `overlays`. In this folder you have to create at least two files: one called `variables.env`, which will be filled with the Public Variables of the project, and one called `kustomization.yaml`. The content of this last file **must** be the following:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- ../../configuration
```

The `variables.env` file can be created starting from a copy of one of the similar files contained in the others `overlays` subfolder choosing the one of the existing environment that is the more similar to the new one and than changing the values accordingly

After those two files, you will have to add all custom files not managed by the Console to the new `overlays` subfolder, just like the plain project case.

## Environment Variables

The last step before to deploy a new runtime environment is to create the secreted Environment Variable from the specified environment.
To do so you must have the permission to manage Environment Variables section inside Console and add the various overrides for your environment using the correct prefix when is needed. For example if you have a variable with the key `ENV_KEY` that must have a different values for every environments you must add a `<ENV_PREFIX>_ENV_KEY` with the correct value for it.
