---
id: user-management
title: Manage Users
sidebar_label: Manage Users
---

Mia-Platform Console enables certain users to control privileges of other users to access Company resources. 
Granting accesses and permissions to Company resources can be managed thanks to the [Identities portal](/development_suite/identity-and-access-management/overview.md#identities-portal), that allows roles assignment on the following Console resources:

* Company
* Project
* Runtime Environment

:::note
To find out more about roles check out the available [capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an [identity](/development_suite/identity-and-access-management/overview.md#identity-and-access-management).
:::

## Managing Company Users

At Company level, inside the Company Overview, a Company Owner has visibility of the Identity and Access Management (IAM) section. In particular, from the Identities portal, a Company Owner can add new users to the Company, manage their accesses, and remove them.

![Identities table filtered by User](./img/user-management/identities_table_filtered_by_user.png)

:::caution
Please note that some permissions defined by the Company role may be inherited on the Projects and Runtime Environment owned by the Company itself.  
Always pay attention when assigning roles in order to avoid providing undesired access to resources!
:::

### Adding a new User at Company Level

From the Identities portal, a Company Owner can add a new user by pressing the *Add user* button. The User invitation process will require the invited user email to be provided.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Add Company User](./img/user-management/add_company_user.png)

  </div>
</div>

The provided email will be searched throughout existing users and, if a match is found, the user will be invited to the Company with the specified role.

:::info
If the user does not exist in the Platform, please open a Service Request for it to be created.
:::

### Editing User Company Role

A User role in the Company can be modified: to do so, simply click on the edit button for the desired user row and select the new role.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit Company User](./img/user-management/edit_company_user.png)

  </div>
</div>

### Removing access to the Company

Removing a user from the Identity table results in removing the role assignment to that user.
Without permission granted, user access to the Company is always removed **with the exception** of when that user also belongs to at least one [Company group](/development_suite/identity-and-access-management/group-management.md).
In that specific case, the user does not lose their access to the Company, and their permissions on it are defined solely by the privileges given to the group/groups to which the user belongs.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Delete Company User](./img/user-management/delete_company_user.png)

  </div>
</div>

:::warning
Removing a user from the Identities portal will remove permissions specifically assigned to that user on every Project and Runtime Environment of the Company.  
While the user may be invited back in the Company, all their previously existing roles will be lost and cannot be recovered, meaning they must be reassigned from scratch.
:::

## Managing User Roles at Project and Environment levels

A user with enough administrative permission on a specific Project will be able to view all the existing identities in the Company and assign them the desired role on the specific Project (and, optionally, on each existing Runtime Environment).

![Project identities](./img/user-management/project_identities.png)

:::note
Even though the Project Identities administration portal shows all the Company identities, this does not mean that all the identities have access to the Project, as this depends on their assigned role in the Company and how the permissions are inherited.

For further information about permissions and role inheritance, check out the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md) page.
:::

### Adding a new User at Project level

The Company Owner can add a new user to a Company by pressing the *Add user* button in the Identities section of the Project settings Area. Here, the user can be assigned a Company role and additional roles on the specific Project and its Runtime Environments. The user invitation process will also require the invited user email to be provided.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Add Project User](./img/user-management/add_project_user.png)

  </div>
</div>

The provided email will be searched throughout existing users and, if a match is found, the user will be invited to the Company with the defined roles.

:::info
If the user does not exist in the Platform, please open a Service Request.
:::


### Editing a User Role at Project level

A user role in the Project or any of the Project Runtime Environments can be modified. To do so, just open the editing dialog and select the proper role for the Project itself or for each Runtime Environment.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit Project User](./img/user-management/edit_project_user.png)

  </div>
</div>