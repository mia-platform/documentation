---
id: project-settings
title:  Project Settings
sidebar_label: Project Settings
---

Once you have created your project, you can visualize and change its settings within the "Settings" area of the Console.
The settings are grouped by subject area through a few tabs: "General", "Providers", "Workload & Runtime", and "Early Access Features". 

## General

The "General" tab shows some general information about the project, through a single card called "Project Information".

### Project Information

![project information](img/settings-project-information.png)

This card presents a summary in which the **name** and **description** given to the project are displayed, along with the following information:
- **Project Owner**: project owner information (typically, name and surname);
- **Team Contact**: contact information associated with the project (typically, the project owner's email);
- **Color (Hex)**: color of the top bar of the project-related card on the homepage (in hexadecimal format);
- **Technologies**: tags specifying the different technologies and programming languages used within the project.

The above information can be edited by clicking on the "Edit" button, which will open the modal below. It will then be sufficient to edit the fields to be updated and click the "Save changes" button to implement the change.

![edit project information](img/settings-edit-project-information.png)

## Providers

The "Providers" tab shows information pertaining to the providers (Git Provider, Secret Manager, and CI/CD Tool) configured for the project, through a single homonymous card.

### Providers

![providers](img/settings-providers.png)

This card presents an overview of which Git Provider, Secret Manager, and CI/CD Tool are configured for the project, displaying their icon and name. The following information is also displayed:
- *Configuration Path Repository*
  * **Path**: path to the repository containing the Console configuration information.
- *Secret Manager Storage* (only if the Secret Manager is GitLab)
  * **Type**: type of Secret Manager, used to define where to find environment variables;
  * **Path**: path to the repository containing the Secret Manager configuration information.

## Workload & Runtime

The "Workload & Runtime" tab shows information about the project workload and runtime through 4 cards: "Microservices", "Image Pull Secret", "Runtime Settings", and "Security Features".

### Microservices

![microservices](img/settings-microservices.png)

This card shows and gives the user the ability to change some settings related to the creation of microservices within the project. Specifically:
- **Suggestion for Docker image**: defines the format of the Docker image name suggestion. It is one of `REPOSITORY`, `PROJECT_ID`, `CONSTANT_PREFIX` (the default is `PROJECT_ID`);
- **Prefix** (only if type is `CONSTANT_PREFIX`): defines the prefix that will appear in the suggestion for the Docker image name.

The above information can be edited by clicking on the "Edit" button, which will open a modal very similar to that seen for project information. Upon clicking "Save changes", the information will be updated.

### Image Pull Secrets

![image pull secret](img/settings-image-pull-secret.png)

:::note
An imagePullSecret is a Kubernetes entity used to authenticate and authorize access to private container image registries. 
:::

This card shows the user, in the form of a table, the list of names that will be used in deployment and cronjob files for pulling Docker images. The user has the option of adding new names through the "Add image pull secret" button, which will open a simple modal asking for the secret name. Similarly, a secret can be edited and deleted using the appropriate icons at the respective row in the table.

### Runtime Settings

![runtime settings](img/settings-runtime-settings.png)

This card shows and gives the user the ability to change some runtime settings. Specifically:
- **Runner Tool**: specifies the command line deployment tool used by the project. Either one of "mlp" and "Other tool". In the case of mlp, it is required to have the [Smart Deploy](/development_suite/deploy/overview.md#smart-deploy) feature enabled;
- **Prefix Env**: if enabled, `MIA_` will be used as a prefix for [Public Variables](/development_suite/api-console/api-design/public_variables.md). If the project uses mlp you don't need to use the `MIA_` prefix;

:::note
If you switch off `useMiaPrefixEnvs`, you have to remove the `MIA_` prefix by hand. This operation is not performed automatically by the Console.
:::

- **Monitoring**: tags specifying the different supported monitoring systems.

The above information can be edited by clicking on the "Edit" button, which will open the modal below. It will then be sufficient to edit the fields to be updated and click the "Save changes" button to implement the change.

![edit runtime settings](img/settings-edit-runtime-settings.png)

### Security Features

![security features](img/settings-security-features.png)

This card shows and gives the user the ability to change some security features, provided as pod annotations, pod specs and Security Context. Specifically:
- **Seccomp Profile**: if enabled, is enables the `seccompProfile` attribute of the `securityContext` object in order to restrict a Container's syscall. This feature is available as of Kubernetes v1.19 and you can learn more by taking a look at the [official Kubernetes documentation](https://kubernetes.io/docs/tutorials/security/seccomp/).
- **AppArmor**: it is a Linux Security Module that, if enabled, implements Mandatory Access Control since [Kubernetes v1.4](https://kubernetes.io/docs/tutorials/security/apparmor/). AppArmor annotations set up a profile used by containerd to harden containerized applications to contrain exploitation. The template for such profile is available [on GitHub](https://github.com/moby/moby/blob/master/profiles/apparmor/template.go).
- **Host Properties**: if enabled, it sets to `false` the following parameters, which could be used to allow access to shared information and elevate privileges:
  * `hostPID`: controls whether containers can share host process namespaces;
  * `hostIPC`: enables to read the shared memory between processes that communicate with IPC mechanisms;
  * `hostNetwork`: controls whether containers can use the host network and allows to bypass network policies.

  These fields are described in the [Pod Security Policies section of the official Kubernetes documentation](https://kubernetes.io/docs/concepts/security/pod-security-policy/).
- **Privileged Pod**: if enabled, it configures the following attributes in a `securityContext` object:
  * `allowPrivilegeEscalation`: controls whether a process can gain more privileges than its parent process, by default is set to true when the `CAP_SYS_ADMIN` capability is enabled or is run as privileged;
  * `privileged`: controls whether the Pod can run privileged containers.

  You can learn more about the `securityContext` object by taking a look at the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/).

The above information can be edited by clicking on the "Edit" button, which will open the modal below, through which you can turn on/off the security features. Upon clicking "Save changes", the information will be updated.

![edit security features](img/settings-edit-security-features.png)

## Early Access Features

The "Early access features" tab allows the user to visualize and activate features in early access, through a single homonymous card.

### Early Access Features

![early access features](img/settings-early-access-features.png)

This card presents an overview of the features in early access that can be activated for the project. For each feature, an illustrative image and description are shown, and to turn it on/off it is sufficient to toggle the corresponding switch. Additional feature information can be accessed through the "View Documentation" button located at the bottom of the feature description.
