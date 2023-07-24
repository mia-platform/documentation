---
id: manage-groups
title: Manage Groups
sidebar_label: Manage Groups
---

Mia-Platform Console allows you to assign and manage authorization privileges to groups of users at Company level. Groups aim to simplify the management of a large number of users who have to be assigned the same privileges (e.g. a work team).

Groups are considered a type of [identity](/development_suite/identity-and-access-management/overview.md#identity-and-access-management) whereby users with enough permissions can assign and manage roles on the following resources:

* Company
* Project
* Runtime Environment

:::note
To find out more about roles management, check out the available [capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an identity.
:::

## Managing Company Groups

Each Company can have its own groups. This type of identity is configurable and manageable exclusively by a Company Owner from the dedicated **Groups section** within the Company Overview. 

![Group table](./img/manage-groups/groups-portal.png)

At Company level, for each group, it is possible to manage:

* Name: the name assigned to the group
* Role: the group Company role
* Members: adding and/or removing users from the group

Existing groups can also be found within the IAM portal at both Company and Project level, where it is possible to manage roles assigned to them just like for the other identity types. 

Groups allow you to efficiently manage accesses to your users. Nevertheless, they are not the only possible way to manage permissions on a Company. As a matter of fact, you can still manage user privileges at individual level, or even handle them through a combination of both methods. If you want to discover more about user management, visit the dedicated [documentation page](/development_suite/identity-and-access-management/manage-users.md#how-to-best-manage-your-users).

:::caution
Please note that some permissions granted by the assigned Company role may be inherited on the Projects and Runtime Environments of the Company itself.  
Always pay attention when assigning roles in order to avoid providing undesired access to resources!
You can check which capabilities are granted according to the chosen role by visiting the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) documentation page.
:::

### Creating a Group

The Company Owner can start the group creation process by pressing the *Create group* button inside the Groups section. In the creation process it is required to define both the name and Company role of the group. It is also possible to optionally add members to the group.

:::info
During the creation process, the group can be also created without adding members. This action can still be performed later on, after the group has already been created, from the [group detail page](/development_suite/identity-and-access-management/manage-groups.md#editing-a-group).
:::

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Add group](./img/manage-groups/create-group.png)

  </div>
</div>

Both users who are already part of the Company and new users that have no access yet can be added to a group.
For the latter, the user must already be registered on the Platform. In this case, when added to the group, the user will receive an invitation email to join the Company.
As long as a user is part of at least one group of a Company, they will have access to the resources of that Company.  
:::info
If the user does not exist on the Platform, please open a Service Request to invite them to register in the Platform.
:::

### Editing a Group

After a group has been created, it is possible to view its detail page.

![Group detail](./img/manage-groups/group-detail.png)

From this page, a Company Owner can perform the following actions:

* Change group name
* Edit group Company role
* Add new members to the group
* Remove members from the group

When clicking on the *Edit* button in the section header, the edit group modal will show up, where you can change the group name and Company role:

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit group](./img/manage-groups/edit-group.png)

  </div>
</div>

To add new members to the group, simply click the *Add members* button to open this dialog:

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Add group members](./img/manage-groups/add-members.png)

  </div>
</div>

To remove a member from the group, click on the delete button on the corresponding row and confirm your action:

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Remove member](./img/manage-groups/remove-member.png)

  </div>
</div>

:::info
In case a user has access to the Company solely from their membership in that group, the removal from that group will result in a loss of access to the Company for that user.  

In case a user has access to more Company Groups, or has a specific individual Company role assigned, the removal from that Group will NOT result in the loss of access to the Company for that user; for this reason, it is necessary to pay close attention to what privileges are still left to that user on the Company resources. 

You can completely remove user access to a Company with one single action from the [Users section](/development_suite/identity-and-access-management/manage-users.md#removing-a-user).
:::

### Deleting a Group

A group can be deleted by accessing its detail page, clicking on the *Delete* button at the end of the page and then confirming the action.

:::caution
Group deletion may result in loss of access to the Company for those group members who are not members of at least one other Company group or who do not have a specific individual Company role assigned.   

In the event that a member of a group has access to the Company solely by virtue of being a member of a group, the deletion of that group (or the removal of the user's membership) will result in the loss of access to the Company for that user.  

In the case that a user has access to more Company groups, or has a specific individual Company role assigned, the deletion of the group will NOT result in loss of access to the Company for that user; for this reason, it is necessary to pay attention to what privileges are still left to that user on the Company resources.
:::


<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Delete group](./img/manage-groups/delete-group.png)

  </div>
</div>

## Managing Group roles

All identity roles are managed from the [IAM portal](/development_suite/identity-and-access-management/manage-identities.md), which is specifically dedicated to the governance of roles and accesses to the resources of the Company.  

As a result, the Company role of a group can be modified not only from the Groups section, but also from the IAM portal.

### Managing Group role at Company level

To edit a group's role from the IAM portal, simply click on the edit button for the desired group row and select the new role.


<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit group role at Company level](./img/manage-identities/edit-group-role.png)

  </div>
</div>

### Managing Group role at Project level

Groups which have access to a Company are shown in the IAM portal inside the Project Overview area of a Project belonging to that specific Company.
You can change the role of the group in the Project or in any Project Runtime Environment. To do so, just open the editing dialog and select the new role of the group for the Project itself and/or for Project Runtime Environments.


<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit Project Group](./img/manage-identities/edit-group-role-at-project-level.png)

  </div>
</div>

:::note
Even though the Project IAM portal shows all the Company identities, this does not mean that all the identities have also access to the Projects, as this depends on their assigned role in the Company and how the permissions are inherited.

For further information about permissions and role inheritance, check out the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md) page.
:::
