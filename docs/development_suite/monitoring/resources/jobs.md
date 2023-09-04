---
id: jobs
title:  Monitor your Jobs
sidebar_label: Monitor your Jobs
slug: "/development_suite/monitoring/resources/jobs"
---

In Kubernetes, a [Job](https://kubernetes.io/docs/concepts/workloads/controllers/job/) is the resource that creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate.  

On this section you can monitor all your Jobs and the relative properties.

## Jobs Table
The table presented here shows the following information:

* **Name**: the name of the Job.
* **Finished Pods**: the number of succeeded Pods out of all the Pods that have been created. For more info check the [kubernetes documentation](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus).
* **Duration**: the time when the Job was completed.
* **Age**: the date when the Job was lastly deployed.

![list_of_jobs](../img/jobs_list.png)

## Deleting a Job

By clicking on the **Delete button** on the last column of the Job table, the Job will be permanently deleted.

A modal will ask for confirmation for the action to be performed.

Any related resources, such as Pods, will be marked for deletion, and Kubernetes may [cascading delete](https://kubernetes.io/docs/concepts/architecture/garbage-collection/#cascading-deletion) them at any time.

:::warning

The deletion is permanent, therefore make sure to save elsewhere any important information before deleting a Job.
Please note that also the related Pod(s) are marked for deletion, along with their information such as logs.

:::

## Inspecting a Job

By clicking on the Job name you can inspect some details about the Job.
  
### Job Describe

In the `Describe` view you can find information about the selected Job in JSON format.
These details are the ones exposed by the [Kubernetes APIs](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/job-v1).

![describe](../img/jobs_describe.png)
