---
id: import-brownfield-project-tutorial
title: Import Brownfield Project
sidebar_label: Import Brownfield Project
---

# Import Brownfield Project

Starting from version `0.17` of `miactl`, the `import` command is supported. This command allows you to import declarative YML definitions of Kubernetes resources into an empty project in the Mia-Platform Console. 

The `import` command takes one or more YML files describing Kubernetes resources as input and converts them into configurations for the Mia-Platform Console, so they can be used within the project where they are being imported.

This feature is very useful when migrating a `brownfield project` into a Mia-Platform console project, as it helps avoid long and tedious initial manual setup steps.

In this tutorial, we will see how to import a simple workload describing an `NGNIX API Gateway` into the mia-platform console.

## Prerequisites

To continue with this tutorial, you first need to `install miactl locally`. To install the CLI, follow the section dedicated to your operating system in [this guide](/cli/miactl/setup).

After installing miactl, before proceeding with the import of Kubernetes resources into our project, we need to configure miactl with the context of our target Console instance. Configuring a `context` means providing miactl with the necessary information to connect to the console instance we want to target, such as the `console URL`, the `tenant ID` of the company we want to work with, and the `authentication method`.

For the authentication method, you can choose to use either your personal account or a `service account`. For instructions on creating a service account, refer to [this documentation page](/development_suite/identity-and-access-management/manage-service-accounts). To learn in detail how to configure the `context` for miactl, refer to [this documentation page](/cli/miactl/commands#context).

## Import Kubernetes resources into an empty Mia-Platform Console Project

::: caution
Kubernetes resources can only be imported into an empty project. Additionally, at the time of writing this tutorial, the `import` command is lossy, meaning that some advanced configurations might be lost during the process. We recommend reviewing the generated files before attempting a deployment to ensure that nothing is missing or incorrect.
:::

### Seting up miactl

After installing miactl, the first step is to verify that the installation was successful. To do this, run the command: 

```bash
miactl -h
``` 

The output of this command should display a help message with a list of available commands, similar to the image below:

![Miactl installed](img/import-miactl-1.png)

Now that we’ve verified that miactl is installed correctly, we need to select the context to use for the import.

To view all available contexts in miactl, run the following command:

```bash
miactl context list
```

The output of this command should display a list of available contexts, similar to the image below:

![Miactl available contexts](img/import-miactl-2.png)

If no context is configured, or if you want to create a new one, follow the steps described on [this documentation page](/cli/miactl/commands#context).

Once you have verified the existence of a context or created a new one, you can set it as the active context using the following command:

```bash
miactl context use <context-name>
```

The output of this command should confirm the context switch, showing a message similar to the image below.

![Miactl switch contexts](img/import-miactl-3.png)

### Prepare the Kubernetes manifests

Now that miactl is configured, before running the import command, we need to retrieve the YML manifests describing the Kubernetes resources we want to import into the console.

For this tutorial, we will import the `Deployment` of an Nginx API Gateway, which you can also find in the official Kubernetes documentation at [this link](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

The manifest we are going to import in our project looks like this:

```yaml 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Import the resources

Now that we also have the YML file we want to import into the console, all that’s left is to run the `import` command to bring our workloads directly into the console project.

To import the resources, run the following command:

```bash
miactl import --filename <path-to-your-manifests> 
  --project-id <your-target-project-id> 
  --company-id <your-target-company-id> 
  --revision <your-target-revision>
```

To learn more about the other optional flags available for this command, refer to [this documentation page](/cli/miactl/commands#import).

If everything worked correctly, the output of the command will be similar to the image below:

![Miactl import](img/import-miactl-4.png)

:::info
In this tutorial, to keep things simple, we imported only a Deployment, but the command works with multiple files simultaneously, including different types of resources (e.g., Deployments, Services, etc.)
:::

Moving to the Design section of our project, in the revision where the import was performed, we can see the imported workloads on the Microservices page, ready to be modified or deployed directly using the Mia-Platform Console.

![Miactl import result](img/import-miactl-5.png)

## Conclusion

The import of Kubernetes resources via miactl is a very powerful feature that saves time and manual setup operations when migrating resources generated externally into the console. This feature allows us to automate most of the work by migrating the majority of resources simply by running a command, and then we can focus on manually fine-tuning these resources to ensure they work optimally within the context of a Mia-Platform Console project.






























