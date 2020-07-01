# Console levels and permits management

Assigning different roles and permissions to each user is a key action for defining responsibilities within your platform ecosystem. 
The DevOps Console offers a preset groups and permissions to be assigned to users. 
Let's see how they are configured. 

## Console Levels

The DevOps Console is a hierarchical structure on three levels:

1. **DevOps Console level** is the highest level and allows the general configuration of your console, at this level you can configure the tenants, the different templates for project creation and you have control of your projects and the marketplace;

2. **Tenant level** is the second hierarchical level. The tenant can group several projects within it, with the tenant a lot of information can be inherited from the underlying projects without having to configure them;

3. **Project Level**  is the third level of the console. The projects are the heart of the DevOps Console, it is in fact at this level that developers find themselves developing to create their own platform. 

![alt text](img/DevOps_Console_levels.PNG)

## User groups by console level

For each level of the hierarchical structure the console offers a set of groups with associated permissions to assign different users.

### DevOps Console Group

The only user group present at this level is the **console admin**. The console admins are the only ones having access to the Console CMS and being able to manage the entire Console, the tenants, the projects, the Marketplace and can create and manage the various tenants.

### Tenant Groups

User groups at this level have permissions for one or more tenants defined by the console admins. Their permissions are extended to all existing projects whitin these tenants.

The user groups present at this level are:

- **Tenant Admin**: the tenant admin user group can create new projects or modify existing ones. They have all permissions related to all the projects that are within their tenant. They can use all the various areas of the console in both production and non-production environments. It is the only tenant level group that is allowed to Debug;

- **Tenant Operations Prod**: users defined as Tenant Operations Prod unlike Tenant Admin do not have access to Debug functionality. They have access to all information and all other project functionality but with read only permissions;

- **Tenant Operations NO Prod**: users defined as Tenant Operations NO Prod have the same rights as Tenant Operations Prod but have permissions limited to environments other than the production one.

### Projects Groups

User groups in this level have limited access to one or more projects they have been assigned and are working on.

The user groups present at this level are:

- **Project Admin**: the project admin user group has all existing permissions whithin specific projects level. It has both read and edit permissions on all information and functionality in both production and non-production environments;

- **Project Developer**: the user defined as a project developer, unlike the project admin, can neither create nor modify projects but only view information about the project he is working on. He also has no access to the Production Log&Monitoring nor can he view the secret production environment variables;

- **Project Reader**: the user defined as project reader has few and selected read-only permissions in the areas of project information, set up, design, deploy, dashboard and Log&Monitoring. The project reader cannot access the Debug area nor modify or deploy the project;

- **Project Operations Prod**: the user defined as Project Operations Prod has extended permissions related to the projects to which it is assigned, in all the different environments. Unlike the project admin, he cannot create or edit projects, nor access the Debug section;

- **Project Operations NO Prod**: users defined as Project Operations NO Prod have the same rights as Project Operations Prod but have permissions limited to environments other than the production one.















