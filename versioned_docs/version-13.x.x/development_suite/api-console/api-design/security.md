---
id: security
title: Configure Security Features
sidebar_label: Configure Security Features
---

To address the security of the project the console implements the capability of configuring a set of security features provided as pod annotations, pod specs and Security Context.

To better account for the differences between container management systems and compatibilities in the Kubernetes version they provide, these security features are divided in the following attributes:

* **appArmor**
* **privilegedPod**
* **hostProperties**
* **seccompProfile**

These functions properties can be configured through the **securityFeatures** object in the **CMS** area at company level. They can also be set at project level through the "Settings" section of the Console, as described [here](/console/project-configuration/project-settings.md#security-features).

If the security features are not configured for the projects, the respective attributes are collected at company level. 

By default the security features objects sets all of its attributes to `true`.

:::caution
If the Security Features are enabled in your project but not all of them are set up, those features that are not configured are automatically set to `false`.
:::

## appArmor

AppArmor is a Linux Security Module that implements Mandatory Access Control since [Kubernetes v1.4](https://kubernetes.io/docs/tutorials/security/apparmor/).

AppArmor annotations set up a profile used by containerd to harden containerized applications to contrain exploitation.

The template for such profile is available [on GitHub](https://github.com/moby/moby/blob/master/profiles/apparmor/template.go).

## privilegedPod

The **privilegedPod** property configures the following attributes in a `securityContext` object:

* **allowPrivilegeEscalation:** controls whether a process can gain more privileges than its parent process, by default is set to true when the `CAP_SYS_ADMIN` capability is enabled or is run as privileged;
* **privileged:** controls whether the Pod can run privileged containers.

You can learn more about the `securityContext` object by taking a look at the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/).

## hostProperties

The **hostProperties** property sets to `false` the following parameters, which could be used to allow access to shared information and elevate privileges:

* **hostPID:** controls whether containers can share host process namespaces;
* **hostIPC:** enables to read the shared memory between processes that communicate with IPC mechanisms;
* **hostNetwork:** controls whether containers can use the host network and allows to bypass network policies.

These fields are described in the [Pod Security Policies section of the official Kubernetes documentation](https://kubernetes.io/docs/concepts/security/pod-security-policy/).

## seccompProfile

This property enables the **seccompProfile** attribute of the `securityContext` object in order to restrict a Container's syscall.

This feature is available as of Kubernetes v1.19 and you can learn more by taking a look at the [official Kubernetes documentation](https://kubernetes.io/docs/tutorials/security/seccomp/).
