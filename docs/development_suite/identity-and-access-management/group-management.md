---
id: group-management
title: Manage Groups
sidebar_label: Manage Groups
---

Mia-Platform Console allows you to assign and manage authorization privileges to groups of users at Company level. Groups aim to simplify the management of a large number of users who have to be assigned the same privileges (e.g. a work team).

<!-- 

ITA version: 
Mia-Platform Console permette di assegnare e gestire privilegi di autorizzazione a gruppi di utenti presenti o meno a livello di Company. In questo modo risulta più agevole gestire un grande numero di utenti a cui dover assegnare gli stessi privilegi (es. work team).


Mia-Platform Console enables certain Users to control other identities ability to access resources. This grants them ownership over the decision-making process regarding which resources are accessible and at what level of authorization. -->


Groups is considered a type of [Identity](/development_suite/identity-and-access-management/overview.md#identity-and-access-management) to which Users with enough permissions can assign and manage roles on the following resources:

* Company
* Project
* Runtime Environment

:::note
To find out more about Roles management, check out the available [Capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an Identity.
:::


<!-- In particular, a User can be assigned a Role on the following resources:

* Company
* Project
* Runtime Environment -->


<!-- Only Users with enough privileges will be granted access to the Identities administration portal and will be able to change identity Roles. -->

## Managing Company Groups
<!-- A User with enough administrative permission on a specific Company will be able to view the existing identities in the Company, add new ones and change the existing identities' Roles. -->

Each Company has its own Groups, which are configurable and manageable solely by Company Owner from the dedicated Groups section inside the Company Overview. 

At Company level, for each Group, it is possible to manage:

* Name: the name assigned to the Group
* Role: the Group Company Role
* Members: adding and/or removing Users from the Group

Existing Groups can also be found within the Identities portal at both Company and Project level, where it is possible to manage Roles assigned to them as well as for Users and Service Account Users. 

<!-- TODO: ![Group table](./img/group-management/group_table.png) -->

:::caution
Please note that some permissions defined by the Company Role may be inherited on the Projects and Runtime Environment owned by the Company itself.  
Always pay attention when assigning Roles in order to avoid providing undesired access to resources!
:::

### Creating a Group

<!-- The Company Owner can add a new User by pressing the *Add user* button. The User invitation process will require the invited User email to be provided. -->

<!-- Si può creare un gruppo utilizzando il bottone *Add User* e nel processo di creazione si possono definire il suo nome, il suo ruolo sulla Company e tutti i suoi membri. I membri aggiunti al gruppo possono anche non appartenere alla Company (cioè non hanno mai avuto un ruolo come Identities sulla Company in questione) e in tal caso viene richiesta la loro email. -->

The Company Owner can start the group creation process by pressing *Create group* button inside the Groups section. In the creation process it is required to define the Group name and the Company role to assign. It is also possible to add members to the Group.

:::info
During the creation process, the Group can be also created without members added to it. This action can be performed even after the Group creation.
:::

<!-- <div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

TODO: ![Add group](./img/group-management/add_user.png)

  </div>
</div> -->

It is possible to add to a Group both Users who already have access to the Company and new Users who will consequently be given access to the Company. For the latter, it is necessary to insert the e-mail address to which the invitation to join the Company will be sent.

The provided email will be searched throughout existing users on the Platform and if a match is found the user will be invited to the Company with the defined Role.

:::info
If the User does not exist in the Platform, please open a Service Request for it to be invited to registering in the Platform.
:::

### Editing a Group

After having created a Group, it is possible to enter its detail page.
Once entered, a Company Owner can perform the following actions:

* Changing Group name
* Editing Group Company role
* Adding new members to the Group
* Removing members to the Group

:::info
In the case that a User has access to the Company solely from its membership of that Group, the removal from that Group will result in loss of access to the Company for that User.  

In the case that a User has access even to other Company Groups, or has a specific Company role assigned, the removal from that Group will NOT result in loss of access to the Company for that User; however, it is necessary to pay attention to what privileges are still left to that User on the Company resources. 
:::

<!-- A User Role in the Company can be modified: to do so, simply click on the edit button for the desired User row and select the new Role. -->

<!-- 
<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

TODO: ![Edit group](./img/group-management/edit_group.png)

  </div>
</div> -->

### Deleting a Group

A Group can be deleted by accessing its detail page and clicking on the *Delete* button at the bottom of the page and confirming the action.

:::caution
Group deletion may result in loss of access to the Company for those Group members who are not members of at least one other Company Group or who do not have a specific company role assigned.   

In the case that a group member has access to the Company solely from its membership of the deleted Group, the removal from that Group will result in loss of access to the Company for that User.  

In the case that a User has access even to other Company Groups, or has a specific Company role assigned, the deletion of the Group will NOT result in loss of access to the Company for that User; however, it is necessary to pay attention to what privileges are still left to that User on the Company resources.
:::

<!-- A User can be removed from the Company by clicking the trash icon on the table and confirming the action. -->

<!-- 
<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

TODO: ![Delete group](./img/group-management/delete_group.png)

  </div>
</div> -->

<!-- :::warning
Removing a User from the Company will kick the User out of every Project and Runtime Environment. While the User may be invited back in the Company, all their previously existing Roles will be lost and cannot be recovered, meaning they must be reassigned from scratch.
::: -->
