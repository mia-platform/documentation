# Identity and Access Management

The Console allows access to Company resources with specific authorisation levels to three types of Identities:
- User: an actual individual whose account is configured for human-to-machine communication. Find out how to manage Users in the [User Management](/development_suite/identity-and-access-management/user-management.md) page. 
- Service Account: a non-human client which is used for automated processes and machine-to-machine communication. Learn all about Service Accounts in the [Service Account Management](/development_suite/identity-and-access-management/service-account-management.md) page. 
- Group: a group of Users who are assigned the same privileges on a set of resources. Learn all about Groups in the [Groups Management](/development_suite/identity-and-access-management/group-management.md) page. 

The Console is based on hierarchical resources: assigning specific roles and permissions to the above mentioned types of Identities is important for defining responsibilities and privileges within your Companies and Projects. Discover more about it in the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md) documentation.

Users with enough administrative permission on a specific Company or Project can view the existing Users, Service Accounts and Groups and perform actions on them. Here is an example of the Identities table of a Company, which can be found in the IAM (Identity and Access Management) section from the Company Overview:  

![identities table](./img/identities_table.png)

:::caution Important: Git provider vs Console permissions
The management of Roles and permissions aims at regulating access on resources solely at Console level.  
Roles and permissions of Users on the same resources at the Git provider level are not managed in this Console area; thus, Roles at Git-level must be verified in order to prevent possible discrepancies that may appear between permissions the User has at the Console-level and those the User has at the Git repository level.

For example, it could happen that a User who does not even have permissions to access a Company from the Console is, however, in a Git group with an assigned Role that gives them Git-level permissions on these Company resources!

Therefore, by giving permissions on resources to Users, it is strongly suggested a double check on both Console-level and Git-level permissions.
:::