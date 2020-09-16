---
id: platform_5-1-0_releasenotes
title:  Platform v5.1
sidebar_label: v5.1
---
## v5.1.0 (February 7, 2020)

### DevOps Console

New Section: Debug!

You’ll find in your DevOps Console the new Test & Debug section, that allows you to run a single service locally while connecting that service to a remote Kubernetes cluster. [Read here](https://docs.mia-platform.eu/development_suite/debugging/telepresence/) to discover the full potentiality of this new area.

New functionality: Horizontal Pod Autoscaling

In this new section of the design area I could set the number of replicas for your custom services.

![](img/replicas.png)

:::note

* the feature is active for non-advanced custom services
* when you choose to generate the replicas they only work for environments that have the isProduction flag set to true
* to set the values ​​you must set both the minimum and the maximum of cpu to your custom services in the services section.
:::

* **Create a tag**

    You can tag your configurations from the console. In the area "Commit and Generate" you will find a new section for tag. Typically people use this functionality to mark release points (v1.0.0, and so on). Tag your configuration when you have a stable version of your platform.

    ![](img/create-tag.png)

* **Log&Monitoring**

* in the table there is a new column "Component" that show you the name of the services associated to the pods and it's version number.
* added autofocus on search inputs

![](img/components-column.png)

### Backend

Added:

* In each project it's been added a new parameter: pipeline object. For each project you can set what type of pipeline it should trigger. Currently the types are managed: gitlab-ci, jenkins and webhook (for custom pipelines)

* Marketplace configuration:  To add templates, examples or more to your marketplace there is a new parameter to add to each service: the pipeline object.

```JSON
{
  "gitlab-ci": {
    "path": "/projects/yourpath"
  }
}
```

With this object you must indicate the type of pipeline with which to start your service and which path to go to get the pipeline.

**CMS 9.7.1**

* Added: e have enabled the possibility of creating quick links also towards custom front-ends. the desired filter will appear in the parameter queries. Read here how to configure them

* Fixed: the menu occasionally got stuck when switching from the dashboard to another page  
