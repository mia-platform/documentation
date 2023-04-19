---
id: console-levels-and-permission-management
title:  Console levels and permission management
sidebar_label: Console Levels and Permission Management
---
Assigning different Roles and permissions to each [Identity](/development_suite/identity-and-access-management/overview.md#identity-and-access-management) that has access to Mia-Platform Console is a key action for defining responsibilities within your Platform ecosystem.
The Console is based on hierarchical levels and, for each of them, specific permissions and capabilities have been identified and can be assigned.  

Let's see how they are configured.

## Console Levels

The Console resources are organized in a hierarchical structure on three levels:

1. **Console level** is the highest level and allows the general configuration of your Console. At this level you can configure the Companies, the different templates for Project creation and you have control of your Projects and the Marketplace;

1. **Company level** is the second hierarchical level. A Company can contain several underlying Projects, which can inherit different kinds of information from the Company without needing further configuration.

1. **Project Level** is the third level of the Console. Projects are the heart of the Console: in fact, it is at this level that developers engage in creating new features and building their own Platform.

![alt text](../img/DevOps_Console_levels.PNG)

## Identity Capabilities inside Console

Identities can perform a set of predetermined actions along Console levels, in accordance with a set of permissions grouped for each specific role. A brief presentation of the default roles that can be assigned to each Identity is provided here below:

* `Company Owner`: A Company Owner has the ability to manage Company Users and Service Accounts, and has full administrative capabilities on all the Projects (and Runtime Environments) within the Company
* `Project Administrator`: A Project Administrator is able to manage identities and all other aspects of a Project, thus being able to perform any actions on all the Runtime Environments of the Project as well
* `Maintainer`: A Maintainer can edit both Project configuration and Runtime Environments
* `Developer`: A Developer can edit Project configuration and view Runtime Environments
* `Reporter`: A Reporter can view Project configuration and Runtime Environments
* `Guest`: A Guest has restricted access to data and can only view basic information for a selected subset of resources

The following table describes the capabilities and how they are mapped on the default roles.

|              Capabilities                                                  | Permissions key                                        | Guest  | Reporter | Developer | Maintainer | Project Administrator | Company Owner |
|----------------------------------------------------------------------------|--------------------------------------------------------|--------|----------|-----------|------------|-----------------------|---------------|
| View Company basic information                                             | `console.company.view`                                 | ✅     | ✅       | ✅        | ✅         | ✅                    | ✅            |
| Edit Company information                                                   | `console.company.details.update`                       |        |          |           |            |                       | ✅            |
| Create a Projects inside a Company                                         | `console.company.project.create`                       |        |          |           |            |                       | ✅            |
| View all Projects in this Company                                          | `console.company.project.view`                         |        | ✅       | ✅        | ✅         | ✅                    | ✅            |
| View Project basic information                                             | `console.project.view`                                 | ✅     | ✅       | ✅        | ✅         | ✅                    |               |
| View all the Environments in all the Projects of this Company              | `console.company.project.environment.view`             |        | ✅       | ✅        | ✅         | ✅                    | ✅            |
| View all Environments of this Project                                      | `console.project.environment.view`                     |        | ✅       | ✅        | ✅         | ✅                    |               |
| View this Environment of the Project                                       | `console.environment.view`                             |        | ✅       |           | ✅         |                       |               |
| Create a service repository for all the Projects of this Company           | `console.company.project.service.repository.create`    |        |          | ✅        | ✅         | ✅                    | ✅            |
| Create a service repository for this Project                               | `console.project.service.repository.create`            |        |          | ✅        | ✅         | ✅                    |               |
| Commit changes on all the Project configurations of this Company           | `console.company.project.configuration.update`         |        |          | ✅        | ✅         | ✅                    | ✅            |
| Commit changes on Project configuration                                    | `console.project.configuration.update`                 |        |          | ✅        | ✅         | ✅                    |               |
| Edit Project information                                                   | `console.project.details.update`                       |        |          |           |            | ✅                    | ✅            |
| Manage secreted environment variables for all the Projects of this Company | `console.company.project.secreted_variables.manage`    |        |          |           |            | ✅                    | ✅            |
| Manage secreted environment variables                                      | `console.project.secreted_variables.manage`            |        |          |           |            | ✅                    |               |
| Trigger deploy on all the Environments of all the Projects of this Company | `console.company.project.environment.deploy.trigger`   |        |          |           | ✅         | ✅                    | ✅            |
| Trigger deploy on any Environment of this Project                          | `console.project.environment.deploy.trigger`           |        |          |           | ✅         | ✅                    |               |
| Trigger deploy on this specific Environment                                | `console.environment.deploy.trigger`                   |        |          |           | ✅         |                       |               |
| Restart pods on all the Environments of all the Projects of this Company   | `console.company.project.environment.k8s.pod.delete`   |        |          |           | ✅         | ✅                    | ✅            |
| Restart pods on any Project Environment                                    | `console.project.environment.k8s.pod.delete`           |        |          |           | ✅         | ✅                    |               |
| Restart pods on this specific Environment                                  | `console.environment.k8s.pod.delete`                   |        |          |           | ✅         |                       |               |
| Manage dashboards on all the Project of this Company                       | `console.company.project.environment.dashboard.manage` |        |          |           |            | ✅                    | ✅            |
| Manage dashboards on any Project Environment                               | `console.project.environment.dashboard.manage`         |        |          |           |            | ✅                    |               |
| Manage dashboards on this specific Environment                             | `console.environment.dashboard.manage`                 |        |          |           |            |                       |               |
| Manage identities of this Company                                          | `console.company.users.manage`                         |        |          |           |            |                       | ✅            |
| Edit Project information of all the Projects of this Company               | `console.company.project.details.update`               |        |          |           |            | ✅                    | ✅            |
| Manage identities of all the Projects of this Company                      | `console.company.project.users.manage`                 |        |          |           |            | ✅                    |               |
| Manage identities for this Project                                         | `console.project.users.manage`                         |        |          |           |            | ✅                    |               |
| Delete a Company                                                           | `console.company.delete`                               |        |          |           |            |                       | ✅            |
| Delete a single Project                                                    | `console.project.delete`                               |        |          |           |            |                       | ✅            |
| Delete all the Projects of a Company                                       | `console.company.project.delete`                       |        |          |           |            | ✅                    | ✅            |
| Manage Providers for a Company                                             | `console.company.providers.manage`                     |        |          |           |            |                       | ✅            |
| View Company Providers information                                         | `console.company.providers.view`                       | ✅     | ✅       | ✅        | ✅         | ✅                    | ✅            |
| Manage Clusters for a Company                                              | `console.company.cluster.manage`                       |        |          |           |            |                       | ✅            |
| View Company Clusters information                                          | `console.company.cluster.view`                         | ✅     | ✅       | ✅        | ✅         | ✅                    | ✅            |
| Create a new Company                                                       | `console.root.company.create`                          |        |          |           |            |                       |               |
| Delete any Company                                                         | `console.root.company.delete`                          |        |          |           |            |                       |               |
| Create a new Project                                                       | `console.root.project.create`                          |        |          |           |            |                       |               |
| Edit any Project                                                           | `console.root.project.details.update`                  |        |          |           |            |                       |               |
| Delete any Project                                                         | `console.root.project.delete`                          |        |          |           |            |                       |               |
| View all Console resources                                                 | `console.root.view`                                    |        |          |           |            |                       |               |
| Manage identity Roles, Groups and Bindings                                 | `console.root.user.bind`                               |        |          |           |            |                       |               |
| Create and delete any user                                                 | `console.root.user.manage`                             |        |          |           |            |                       |               |
| Manage all private and public Project Templates                            | `console.root.templates.manage`                        |        |          |           |            |                       |               |
| Manage available features                                                  | `console.root.features.manage`                         |        |          |           |            |                       |               |
| Manage Company Project Templates                                           | `console.company.templates.manage`                     |        |          |           |            |                       | ✅            |

User roles are manageable from CMS by **Console Super Users**, which are particular Console Administrators having access to the Console CMS and thus being able to manage the entire Console, including Companies, Projects and the Marketplace.

### Role binding example

Suppose you have a feature team composed by: 1 _Project Manager_ and 1 _Technical Leader_, 1 _Senior Developer_ and 2 _Junior Developers_ and 2 _Designers_.
This team works on a single Project with two environments:

 1. Production, on which only the _Project Manager_, the _Technical Leader_ and _Senior Developer_ can perform actions, and
 1. Staging on which the 2 _Junior Developers_ can perform actions, too.

What you might want could be a similar Role Binding organization:

* The _Project Manager_ and the _Technical Leader_ may want to have full access to the Project so they can be assigned the _Project Administrator_ Role on the Project resource
* The _Designers_ should be able to access the Project but they cannot perform any editing action on it, so they can be assigned the _Reporter_ Role on the Project resource
* The _Senior Developers_ can be assigned the _Maintainer_ Role on the Project
* The _Junior Developers_ can be assigned the _Developer_ Role on the Project resource and then can be assigned the _Maintainer_ Role only on the Staging environment

#### Assigning Roles on Resources

When you wish to assign a Role on a specific resource what you have to do is create a binding with a properly configured resource object.

:::info
For more information regarding how a binding is defined and how to configure the resources check out the [following documentation page](/development_suite/api-console/api-design/authorization.md#rbac-storage).
:::
