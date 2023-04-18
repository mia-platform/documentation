---
id: group-management
title: Manage Groups
sidebar_label: Manage Groups
---

Mia-Platform Console allows you to assign and manage authorization privileges to groups of users at Company level. Groups aim to simplify the management of a large number of users who have to be assigned the same privileges (e.g. a work team).

Groups are considered a type of [Identity](/development_suite/identity-and-access-management/overview.md#identity-and-access-management) whereby Users with enough permissions can assign and manage roles on the following resources:

* Company
* Project
* Runtime Environment

:::note
To find out more about Roles management, check out the available [Capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an Identity.
:::

## Managing Company Groups

Each Company can have its own Groups. These types of Identities are configurable and manageable exclusively by a Company Owner from the dedicated Groups section within the Company Overview. 

At Company level, for each Group, it is possible to manage:

* Name: the name assigned to the Group
* Role: the Group Company Role
* Members: adding and/or removing Users from the Group

Existing Groups can also be found within the Identities portal at both Company and Project level, where it is possible to manage Roles assigned to them as well as for the other Identity types. 

<!-- TODO: ![Group table](./img/group-management/group_table.png) -->

:::caution
Please note that some permissions granted by the assigned Company Role may be inherited on the Projects and Runtime Environments of the Company itself.  
Always pay attention when assigning Roles in order to avoid providing undesired access to resources!
You can check which capabilities are granted according to the chosen role by visiting the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) documentation page.
:::

### Creating a Group

The Company Owner can start the group creation process by pressing the *Create group* button inside the Groups section. In the creation process it is required to define both the name and Company role of the Group. It is also possible to optionally add members to the Group.

:::info
During the creation process, the Group can be also created without members added to it. This action can be performed even after the Group creation.
:::

<!-- <div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

TODO: ![Add group](./img/group-management/add_user.png)

  </div>
</div> -->

It is possible to add to a Group both Users who already have access to the Company and new Users who do not have access to the Company (but which already exist on the Platform). For the latter, once inserted their email address, they will receive an invitation to join that Group of the Company.  As long as they are part of at least one Group of a Company, they can have access to the resources of that Company.

The provided emails will be searched throughout existing users on the Platform and, if a match is found, the user will be invited to the Group with the defined Role of that specific Group.

:::info
If the User does not exist in the Platform, please open a Service Request to invite it to register in the Platform.
:::

### Editing a Group

After the creation of a Group, it is possible to enter its detail page.
Once entered, a Company Owner can perform the following actions:

* Change Group name
* Edit Group Company role
* Add new members to the Group
* Remove members from the Group

:::info
In the case that a User has access to the Company solely from its membership of that Group, the removal from that Group will result in loss of access to the Company for that User.  

In the case that a User has access to more Company Groups, or has a specific individual Company role assigned, the removal from that Group will NOT result in the loss of access to the Company for that User; for this reason, it is necessary to pay close attention to what privileges are still left to that User on the Company resources. 
:::

<!-- 
<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

TODO: ![Edit group](./img/group-management/edit_group.png)

  </div>
</div> -->

### Deleting a Group

A Group can be deleted by accessing its detail page and clicking on the *Delete* button at the end of the page and then confirming the action.

:::caution
Group deletion may result in loss of access to the Company for those Group members who are not members of at least one other Company Group or who do not have a specific individual Company role assigned.   

In the case that a Group member has access to the Company solely from its membership of the deleted Group, the removal from that Group will result in the loss of access to the Company for that User.  

In the case that a User has access to more Company Groups, or has a specific individual Company role assigned, the deletion of the Group will NOT result in loss of access to the Company for that User; for this reason, it is necessary to pay attention to what privileges are still left to that User on the Company resources.
:::

<!-- 
<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

TODO: ![Delete group](./img/group-management/delete_group.png)

  </div>
</div> -->
