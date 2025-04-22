---
id: infrastructure-project
title: Infrastructure Projects
sidebar_label: Infrastructure Projects
sidebar_order: 2
---

**Infrastructure Projects** are a dedicated Project type in Console specifically dedicated to the provisioning and management of infrastructure, following the *Infrastructure as Code* paradigm.

They are designed primarily for **Operations teams**, who can use them to define, version, and deploy infrastructure resources while ensuring consistency, transparency, and control over infrastructure changes.  

These Projects are distinct from traditional Application Projects as they are specifically designed to manage infrastructure resources, enabling better control, automation, and governance in the context of Infrastructure as Code.

## Creating an Infrastructure Project

When creating a new Project in your Company, you can select the **Infrastructure** type.  
This option unlocks a dedicated setup flow and enables the creation of a Project tailored to infrastructure workflows.

![Infrastructure Project selection](./img/infrastructure-project-selection.png)

## Managing Infrastructure Components

Each Infrastructure Project includes a specific section for managing **infrastructure components**.

You can currently create an infrastructure component from scratch; in future releases, you’ll also be able to instantiate components from a **Marketplace**.  

To create a new infrastructure component from scratch, you need to provide the following information:

- **Name**: The name of the component.  
- **Repository URL**: The URL of the Git repository where the component's code is hosted.  
- **Git Ref Name**: The Git branch, tag, or commit that the deployment pipeline will run on.  
- **Repository Project ID**: The project ID associated with the Git repository.

![Add Infrastructure Component](./img/add-infrastructure-component.png)

Creating a component automatically generates a new repository, which you can manage to evolve your infrastructure.


## Deploying your Infrastructure

From within your Project, you can manage the deployment flow of your infrastructure components by:

- Running a **plan** to preview proposed infrastructure changes  
- Executing an **apply** to confirm and release your infrastructure changes

This enables control and consistency in your infrastructure.

## Runtime Visibility

After deployment, the current state of the released infrastructure is available for monitoring directly in the Runtime area of your Infrastructure Project.  

## Access and Permissions

Currently, all members of a Company can view Infrastructure Projects.  
However, only users with the role of **Project Administrator** or **Company Owner** are allowed to perform changes within them. 
