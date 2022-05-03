---
id: console-levels-and-permission-management
title:  Console levels and permission management
sidebar_label: Console levels and permission management
---
Assigning different roles and permissions to each user is a key action for defining responsibilities within your platform ecosystem.
The Console is based on hierarchical levels, and for each of them, specific permissions and capabilities have been identified and assigned to users.
Let's see how they are configured.

## Console Levels

The Console resources are organized in a hierarchical structure on three levels:

1. **Console level** is the highest level and allows the general configuration of your Console, at this level you can configure the companies, the different templates for project creation and you have control of your projects and the marketplace;

1. **Company level** is the second hierarchical level. The companycan group several projects within it, with the company a lot of information can be inherited from the underlying projects without having to configure them;

1. **Project Level** is the third level of the Console. The projects are the heart of the Console, it is in fact at this level that developers find themselves developing to create their own platform.

![alt text](img/DevOps_Console_levels.PNG)

## Users Capabilities inside Console

Users can perform a set of predetermined actions along Console levels in accordance with a set of permissions grouped within a specific role; a set of default roles have been defined:

* `Company Owner`: A Company Owner has the ability to manage Company users and has full administrative capabilities on all the Projects (and Runtime Environments) within the Company
* `Project Administrator`: A Project Administrator is able to manage users and the whole Project it is assigned to, thus being able to perform any actions on all the Runtime Environments of the Project, too
* `Maintainer`: A Maintainer can edit Project configuration and Runtime Environments
* `Developer`: A Developer can edit the Project configuration and can view Runtime Environments
* `Reporter`: A Reporter can view Project configuration and Runtime Environments
* `Guest`: A Guest has restricted access on data and can only view basic information of resources it is assigned to

The following table describes the capabilities and how they are mapped on the default Roles.

|              Capabilities                                                  | Permissions key                                        | Guest  | Reporter | Developer | Maintainer | Project Administrator | Company Owner |
|----------------------------------------------------------------------------|--------------------------------------------------------|--------|----------|-----------|------------|-----------------------|---------------|
| View Company basic information                                             | `console.company.view`                                 |✅      | ✅        | ✅       | ✅         | ✅  | ✅ |
| Edit company information                                                   | `console.company.details.update`                       |        |           |          |            |     |✅|
| View all Projects in this Company                                          | `console.company.project.view`                         |        | ✅        | ✅       | ✅         | ✅ | ✅  |
| View Project basic information                                             | `console.project.view`                                 |✅      | ✅        | ✅       | ✅         | ✅ |     |
| View all the Environments in all the Projects of this Company              | `console.company.project.environment.view`             |        | ✅        | ✅       | ✅         | ✅ | ✅  |
| View all Environments of this Project                                      | `console.project.environment.view`                     |        | ✅        |✅          | ✅         | ✅ |     |
| View this Environment of the Project                                       | `console.environment.view`                             |        | ✅           |          | ✅            |    |     |
| Create a service repository for all the Projects of this company           | `console.company.project.service.repository.create`    |        |           | ✅       | ✅          | ✅ | ✅|
| Create a service repository for this Project                               | `console.project.service.repository.create`            |        |           | ✅       | ✅          | ✅ | |
| Commit changes on all the Project configurations of this Company           | `console.company.project.configuration.update`         |        |           | ✅       | ✅         | ✅ | ✅|
| Commit changes on Project configuration                                    | `console.project.configuration.update`                 |        |           | ✅       | ✅          | ✅ | |
| Edit project information                                                   | `console.project.details.update`                       |        |           |          |            |  ✅   |✅|
| Manage secreted environment variables for all the Projects of this Company | `console.company.project.secreted_variables.manage`    |        |           |          |            | ✅ | ✅|
| Manage secreted environment variables                                      | `console.project.secreted_variables.manage`            |        |           |          |            | ✅ | |
| Trigger deploy on all the Environments of all the Projects of this Company | `console.company.project.environment.deploy.trigger`   |        |           |          | ✅         | ✅ |✅ |
| Trigger deploy on any Environment of this Project                          | `console.project.environment.deploy.trigger`           |        |           |          | ✅         | ✅ | |
| Trigger deploy on this specific Environment                                | `console.environment.deploy.trigger`                   |        |           |         | ✅           | | |
| Restart pods on all the Environments of all the Projects of this Company   | `console.company.project.environment.k8s.pod.delete`   |        |           |          | ✅         | ✅ |✅ |
| Restart pods on any project Environment                                    | `console.project.environment.k8s.pod.delete`           |        |           |          | ✅         | ✅ | |
| Restart pods on this specific Environment                                  | `console.environment.k8s.pod.delete`                   |        |           |         | ✅            | | |
| Manage dashboards on all the Project of this Company                       | `console.company.project.environment.dashboard.manage` |        |           |          | ✅         | ✅ |✅ |
| Manage dashboards on any Project Environment                               | `console.project.environment.dashboard.manage`         |        |           |          | ✅         | ✅ | |
| Manage dashboards on this specific Environment                             | `console.environment.dashboard.manage`                 |        |           |         | ✅             | | |
| Manage users of this Company                                               | `console.company.users.manage`                         |        |           |          |            | | ✅|
| Edit company information                                                   | `console.company.details.update`                       |        |           |          |            |     |✅|
| Edit project information of all the Projects of this Company               | `console.company.project.details.update`                       |        |           |          |            |  ✅   |✅|
| Manage users of all the Projects of this Company                           | `console.company.project.users.manage`                 |        |           |          |            | ✅ | |
| Manage users for this Project                                              | `console.project.users.manage`                         |        |           |          |            | ✅ | |
User roles are manageable from CMS by the **Console administrators**, as they are the only one having access to the Console CMS and thus being able to manage the entire Console, including companies, projects, Marketplace.

### Role binding example

Suppose you have a feature team composed by: 1 _Project Manager_ and 1 _Technical Leader_, 1 _Senior Developer_ and 2 _Junior Developers_ and 2 _Designers_.
This team works on a single Project with two environments:

 1. Production, on which only the _Project Manager_, the _Technical Leader_ and _Senior Developer_ can perform actions, and
 1. Staging on which the 2 _Junior Developers_ can perform actions, too.

What you might want could be a similar Role Binding organization:

* The _Project Manager_ and the _Technical Leader_ may want to have full access to the Project so they can be assigned the _Project Administrator_ Role on the Project resource
* The _Designers_ should be able to access the project but they cannot perform any editing action on them, so they can be assigned the _Reporter_ Role on the Project resource
* The _Senior Developers_ can be assigned the _Maintainer_ Role on the Project
* The _Junior Developers_ can be assigned the _Developer_ Role on the Project resource and then can be assigned the _Maintainer_ Role only on the Staging environment

#### Assigning Roles on Resources

When you wish to assign a Role on a specific resource what you have to do is create a binding with a properly configured resource object.

:::info
For more information regarding how a binding is defined and how to configure the resources check out the [following documentation page](./api-console/api-design/rbac#rbac-storage).
:::
