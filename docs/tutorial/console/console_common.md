---
id: console_common
title: Mia-Platform Console Common Actions
sidebar_label: Mia-Platform Console Common Actions
---

In this page we will see some common actions to perform on the Mia-Platform console.

For an overview of the console please see the [dedicated](/development_suite/overview-dev-suite.md) page.

## Create a new branch

To start making changes on the console you must be working on a **branch**. By default the _master_ branch is present but you can create any number of branches to work on.

This section explains how to create a new branch on the console.

The console internally uses **git repositories** to persist configuration changes you make. This action will create a new git branch on the _Configurations_ repository of the project.

You must be in the _Design_ section of the console to perform this action.

1. Click on the branch selection menu on top of the screen.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/create-new-branch-1.png)
  
  </div>
</div>

2. Click on _Change branch_. The _Select Branch or Tag_ form will appear.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Select branch or tag](img/create-new-branch-2.png)
  
  </div>
</div>

3. Click on _Create new branch_. The _Create new branch_ form will appear.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Create new branch](img/create-new-branch-3.png)
  
  </div>
</div>

4. You can select the source branch from which to start from the drop-down list on top. If a branch is already set, it will be proposed by default.
5. You can enter the new branch name.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Create new branch filled](img/create-new-branch-5.png)
  
  </div>
</div>

6. Click _Create new branch_. The new branch will be created.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch created](img/create-new-branch-6.png)
  
  </div>
</div>

You can also create a new branch while saving your changes. See the next section.

## Save changes

Configuration changes made on the console must be **saved explicitly**. By doing so you save your work for later use or deploy, but you can also let other people see your changes if they have access to your project.

This section explains how to save configuration changes you made on the console.

This action will create a new **git commit** on the _Configurations_ repository of the project.

You must be in the Design section of the console to perform this action.

1. Click on the branch selection menu on top of the screen. If you made some changes, you will see that there are unsaved local changes reported.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/save-changes-1.png)
  
  </div>
</div>

2. Click on _Save configuration_. The _Save configuration_ form will appear.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/save-changes-2.png)
  
  </div>
</div>

3. You must enter a title for the commit. Optionally you can enter a commit description.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/save-changes-3.png)
  
  </div>
</div>

4. If you want to save your changes in a new branch you can set the _Save changes on new branch_ option and enter the new branch name.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/save-changes-4.png)
  
  </div>
</div>

5. Click _Save_ to save your changes.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/save-changes-5.png)
  
  </div>
</div>

:::warning
Always remember to save your changes in order to persist them. Unsaved versions are not visible to other users and you cannot deploy them. If you change branch without saving your current changes, they will be lost.
:::

## Deploy changes

The changes you made on the console must be deployed in order for you to see them in action. Your project is linked with an infrastructure managed with Kubernetes on which you can deploy everything you configured from the console without explicitly having to also configure a cluster.

This section explains how to deploy any changes you made into an environment.

You must be in the _Deploy_ section of the console to perform this action.

1. You can select the changes to deploy from the _Select branch or tag_ drop-down list.

![Branch selection](img/deploy-changes-1.png)

2. Optionally, you can view the list of last 10 commits made on the selected branch.
3. You can choose to enable or disable the _Smart deploy_ feature.
4. You can see the details of the deploy such as services name and versions, deploy outcome and other info in the table below.

![Branch selection](img/deploy-changes-4.png)

5. Click _Smart Deploy_ or _Deploy All_ button (the name changes if you enable the _Smart deploy_ feature).

This action will take some time depending on the amount of changes to deploy.

For more information on deploying please see the [dedicated](/development_suite/deploy/deploy.md) page.

## Monitor infrastructure

Once your changes have been deployed, you can **monitor their status** and see information about the pods running them as well as **application logs**.

This section explains how to monitor your deployed services and pods.

You must be in the _Runtime_ section of the console to perform this action.

1. You can choose the environment to monitor from the drop-down list on top of the screen.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch selection](img/monitoring-1.png)
  
  </div>
</div>

2. On the _Pods_ section you can see the list of pods currently deployed on the current environment. You can see information such as pod status, name, application, etc.

![Branch selection](img/monitoring-2.png)

3. You can click on a specific pod name to view additional details.
4. In the _Overview_ page you can see a summary of the selected pod with information such as CPU and Memory usage, number of Containers Ready, Pods restarts, etc.

![Branch selection](img/monitoring-4.png)

5. Click on _Logs_. From this page you can see the latest logs generated by the pod.

![Branch selection](img/monitoring-5.png)

6. Click on _Describe_. From this page you can see a JSON description of the pod.

![Branch selection](img/monitoring-6.png)

7. Click on _Events_. From this page you can see a list of events occurred in the pod.

![Branch selection](img/monitoring-7.png)

For more information on monitoring the infrastructure please see the [dedicated](/development_suite/monitoring/monitoring.md) page.

For more information about monitoring CPU and memory using Grafana please see the _Set Requests and Limits of a Microservice_ [tutorial](/tutorial/requests_limits/requests_limits_tutorial.mdx#monitoring-cpu-and-memory-usage).

You can also set the console homepage to show environment metrics by using the [Metrics homepage](/development_suite/overview-dev-suite.md#metrics-homepage).

For information on how to directly interact with the Kubernetes infrastructure please see [here](/development_suite/clusters-management/add-edit-remove-cluster.md).

## View repository

If you want to see directly the **code** of the configurations you made, you can check the _Configuration_ repository of your project.

To view the _Configurations_ repository of the project simply click on the Git provider icon (Gitlab in the image below) on the top-right of the screen.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![Branch created](img/view-repository-1.png)
  
  </div>
</div>
