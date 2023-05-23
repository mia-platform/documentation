---
id: user-management
title: Manage Users
sidebar_label: Manage Users
---

Mia-Platform Console enables certain users to control the access privileges to Company resources of other users. 
Granting accesses and permissions to Company resources can be performed through the [Identities portal](/development_suite/identity-and-access-management/overview.md#identities-portal) section, which allows roles assignment on the following Console resources:

* Company
* Project
* Runtime Environment

:::note
To find out more about roles check out the available [capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an [identity](/development_suite/identity-and-access-management/overview.md#identity-and-access-management).
:::

## Managing Company Users

At Company level, inside the Company Overview, a Company Owner has visibility of the Identity and Access Management (IAM) section. In particular, from the Identities portal, a Company Owner can add new users to the Company, manage their accesses, and remove them.

![Identities portal filtered by User](./img/user-management/identities_portal_filtered_by_user.png)

:::caution
Please note that some permissions defined by the Company role may be inherited on the Projects and Runtime Environment owned by the Company itself.  
Always pay attention when assigning roles in order to avoid providing undesired access to resources!
:::

In the following paragraphs, we will describe how to manage your users access privileges to the company resources through individual role assignment.

Alternatively, you may consider also to manage your users through groups. If you want to discover more about, [go to the groups documentation](/development_suite/identity-and-access-management/group-management.md#managing-company-groups).

If you want to find out how to best manage your users according to your business needs, you can have a look at these [use cases](#how-to-best-manage-your-users) where we show you both individual and group access management.

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

![Remove User Direct Access](./img/user-management/remove_user_direct_access.png)

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

![Edit Project User](./img/user-management/edit_at_project_level.png)

  </div>
</div>

## How to best manage your users

Are you wondering whether organizing your users through individual role assignments is the smartest and most effective way to manage the user access to your Company? Or whether the best solution would be to organize them into groups instead?
There is no right or wrong answer to this question: it depends on your organizational needs.  
Here below you can find some helpful hints that can help you find an answer that better suits your own requirements.

For example, if you need to provide the same access privileges to multiple users in your Company, for sure the simplest and most efficient way is to manage them through groups.  

On this purpose, imagine that you have to manage a team composed by a large number of developers. You can create a group (e.g., "My Company Developers"), add them all as group members, and assign the most appropriate role (e.g., `Developer` role) to the group. This will result in all your users becoming users of the Company with `Developer` role by virtue of being part of that group of developers.  
In this use case, the choice of managing your users through groups allows you to avoid having to manually assign the same role to each user, which may be a time-consuming and tedious activity, especially when you have to deal with a large number of users.  

Furthermore, having all of your users grouped within such a group allows you to have a quick comprehensive view of who the members of the group are (in our example, the developers) and what access permissions to the Company are assigned to them (`Developer` role in this case).

Alternatively, if the composition of your Company team is small and heterogeneous (e.g., there is a Project Manager, a Senior Developer, a Junior Developer, and a Designer), it might still be functional to manage those users through individual role assignment.  
For example, at Company level, you may assign the `Company Owner` role to the Project Manager, the `Project Administrator` role to the Senior Developer, the `Developer` role to the Junior Developer, and the `Reporter` role to the Designer. 

However, keep in mind that these different user management methods are not mutually exclusive! You can decide to apply them both, in order to find your specific needs. 

For instance – going on with the aforementioned example – imagine that your team has now expanded by welcoming new Junior Developers. At this point, it may be particularly useful to create an ad-hoc group of users (e.g., "My Company Developers") in which to include all the Junior Developers of your Company (the new ones plus the initial one).  
Now let us remember, however, that one of those Developers (the first one) was initially assigned the `Developer` role at individual level. This means that one Developer will have both an individual role and a role conferred by the group membership. You don’t have to worry about this, as roles in Console always add up and therefore it does not represent a problem of any kind.

The dual management of users – through a combination of individual roles and group roles – also allows for more personalized governance of access to the resources of your Company: imagine, for example, that the initial Junior Developer (who has both an individual role and the role attributed by group membership) has now become a Developer Expert, having increased the responsibilities within some of the Projects of your Company. At that point, you might want to give that user additional privileges only on those specific Projects.  
You can do it by assigning, to that user, a role at Project level that expands the capabilities currently enabled by the `Developer` role assignment at Company level (e.g., being able to deploy on a specific Projects by assigning the `Maintainer` role to that user).

Nevertheless, once again, managing users through groups can be useful even in this case, especially when the number of users to which to assign roles on specific resources increases. As a matter of fact, thanks to groups, you can actually increase the capabilities on specific resources for a batch of users in your Company in an easier way.

More practically speaking, if you want – for instance – to extend privileges to all your Junior developers on a specific Project/Runtime Environment (e.g., by elevating that group's role to `Maintainer` on a specific Project, in order to provide them with Deploy trigger permission on that), thanks to groups you can extend with just one action that privilege to all of your Junior developers: you only have to assign to the "My Company Developers" group the `Maintainer` role specifically on the desired Project/Runtime Environment.

Otherwise, if they were not managed through groups, this action of assigning `Maintainer` role on that Project (or Project Runtime Environment) would have to be repeated for each of the members, which is – again – a time-consuming (and even error-prone) activity.  
Moreover, if you wanted to grant this privilege only for a limited period of time, then restoring the initial role setting would again have to be done manually for each of these members, highlighting this bottleneck even more.

By contrast, through groups, for instance, the `Maintainer` role disassignment from that specific Project (or Project Runtime Environment) – to restore the initial `Developer` role assigned at Company level – would have been a more effective and circumscribed activity, keeping access governance on that Project more organized and flexible.

To sum up, user management use cases are many, as well as the different organizational needs, and – in this landscape – Mia-Platform Console allows you to better structure access to resources as you prefer, giving you freedom in governing access levels of your Company users.