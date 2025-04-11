---
id: infrastructure-projects
title: Projects for Infrastructure Provisioning
sidebar_label: Infrastructure Projects
---

# Infrastructure Projects 

**Infrastructure Projects** are a dedicated Project type in Console that enable the provisioning and management of infrastructure following the *Infrastructure as Code* paradigm.

They are designed primarily for **Operations teams**, who can use them to define, version, and deploy infrastructure resources while ensuring consistency, transparency, and control over infrastructure changes.  
These Projects are distinct from traditional Application Projects as they are specifically designed to manage infrastructure resources, enabling better control, automation, and governance in the context of Infrastructure as Code.

## Creating an Infrastructure Project

When creating a new project in Console, you can select the **Infrastructure** type.  
This option unlocks a dedicated setup flow and enables project sections tailored to infrastructure workflows.

![Infrastructure Projects creation](/)

## Managing Infrastructure Components

Each Infrastructure Project includes a specific section for managing **infrastructure components**.

You can currently create a component from scratch; in future releases, you’ll also be able to instantiate components from a **Marketplace**.  

TO DO: components creation steps explanation

![Infrastructure component creation](/)

Creating a component automatically provisions a new repository, which you can manage independently to evolve your infrastructure definitions.


## Deploying your Infrastructure

From within your Project, you can manage the deployment flow of your infrastructure components by:

- Running a **plan** to preview proposed infrastructure changes  
- Executing an **apply** to confirm and release your infrastructure changes

![Infrastructure Projects apply](/)

This enables controlled and consistent infrastructure delivery, aligned with DevOps practices.

## Runtime Visibility

After deployment, the current state of the released infrastructure is available for monitoring directly in the Runtime area of your Infrastructure Project.  

![Infrastructure Projects Runtime](/)

## Access and Permissions

Currently, all members of a Company can view Infrastructure Projects.  
However, only users with the role of **Project Administrator** or **Company Owner** are allowed to perform changes within them.
