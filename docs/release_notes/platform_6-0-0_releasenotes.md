---
id: platform_6-0-0_releasenotes
title: v6.0.0 Release Notes
sidebar_label: v6.0.0
---

_September 16, 2020_

:::info
The sixth version of the Mia Platform Console has now been released!  Let's cut the chitchat and get down to business: scroll down to learn more about new features and improvements!
:::

## New features

* **DevOps Console** - **The DevOps Console is now integrated with Github!**
You can choose where to save the code repository! DevOps Console now supports **GitHub** as well as **Gitlab**. You can now choose where the DevOps Console will automatically save the code among **Gitlab** or **Github**. You will also be able to login to the DevOps console directly with your **GitHub** account.

* **Dashboards** - **New dashboards available in the DevOps Console**
The DevOps Console now supports a wide range of monitoring dashboards. Thanks to the integration with **Prometheus** and **Grafana** it will now be possible to monitor the status of your **Kubernetes** clusters directly from the DevOps Console. You will be able to monitor the number of pods, cpu and memory consumption. Monitoring your IT systems has never been easier! You can find more info [here!](https://docs.mia-platform.eu/docs/business_suite/data-visualization#dashboard-configution)

* **DevOps Console** - **Console homepage renewed!**
In the Homepage of the Devops Console you will now see new card representing useful information on individual projects. Every card shows:
* Project name
* Layer label
* Project owner
* Team owner
* Numbers of pods running
* Environment
* Status
* CPU
* RAM

  You can find more info [here!](https://docs.mia-platform.eu/docs/development_suite/set-up-infrastructure/create-project)

* **Design Microservices** - **New Function Service**
In the DevOps Console marketplace you will now find a new ready-to-code plugin named **function service**. The Function service allows you to map functions to endpoints to be executed without creating a fully-fledged dedicated microservice. You can find more info [here!](https://docs.mia-platform.eu/docs/runtime_suite/function-service/configuration)

* **Design Microservices** - **New Flow Manager**
In the DevOps Console marketplace you will now find a ready-to-code plugin named **flow manager**. The Flow Manager is a saga orchestrator.It is capable to manage flows structured by using the Architectural pattern named Saga Pattern and, in particular, the Command/Orchestration approach. You can find more info [here!](https://docs.mia-platform.eu/docs/runtime_suite/flow-manager/index)

* **DevOps Console** - **New product documentation available!**
From today you can consult a new and improved version of the product documentation accessible from this [link!](https://docs.mia-platform.eu/)

## How to update your DevOps Console

For on-premise Console installations, you have to use the [Helm chart version](https://git.tools.mia-platform.eu/platform/devops/console-helm-chart) version `2.2.12`.
