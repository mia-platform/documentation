---
id: service-account-management
title: Manage Service Accounts
sidebar_label: Manage Service Accounts
---

The Mia-Platform Console allows the creation of Service Accounts, which are typically used for automated processes or to allow a service to access resources on behalf of multiple Users.  
Note that Service Accounts are created at Company level, so there cannot be a Service Account inside a Project or an Environment if it does not also exist in the respective Company.  
Just like human Users, Service Accounts can be assigned Roles on Company, Project or Runtime Environment level, based on which they will be able to perform different types of action.  

:::note
To find out more about Roles check out the available [Capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an identity.
:::

### What can you do with a Service Account?

Virtually anything a User can do inside the Console can be entrusted to a dedicated Service Account, which will perform the desired actions automatically.

For instance, a Service Account could be granted permissions to make automatic deploys, which can greatly streamline the process of deploying code changes to an application. The Service Account could use its credentials to access the appropriate deployment resources and automatically deploy new versions of the application as soon as new code is pushed to the source code repository.  
This allows teams to implement a CI/CD workflow that can improve the speed, reliability, and scalability of their software development processes. 

A Service Account can also be used to monitor and log Kubernetes resources, such as pods, deployments and services. Once authorized, the Service Account can use logging and monitoring tools to collect and analyze data on resource usage, performance metrics, and other important indicators.

## Managing Company Service Accounts

A User with enough administrative permission on a specific Company will be able to view the existing Service Accounts in the Company, to add new ones and to change the existing Service Accounts' Roles.

<!-- TODO: inserire screenshot dell'admin portal per la Company, con filtro attivo per identity type = Service Account -->

:::caution
Please note that some permissions defined by the Company Role may be inherited on the Projects and Runtime Environment owned by the Company itself.  
Always pay attention when assigning Roles in order to avoid providing undesired access to resources!
:::

### Adding a new Service Account

The Company Owner can add a new Service Account by clicking the *Add Service Account* option inside the *Add User* split button, on the top-right corner of the Identities page. 

<!-- TODO: SCREENSHOT OF COMPANY ADD SA MODAL -->

The the Service Account creation process will require the following information:
- Name: a human-readable name to identify the Service Account
- Role: the Company Role to be assigned to the Service Account
- Authentication method: it is necessary to verify the identity of the Service Account and can be of two types <!-- TODO: SCREENSHOT OF THE DIFFERENT FLOWS -->
    - `client_secret_basic`: the Service Account authenticates by presenting its `client_id` and `client_secret` in the Authorization header of the request, in the format `Authorization: Basic <base64 encoded client_id:client_secret>`. The server then decodes the header and validates the credentials against its records to authenticate the client.  
    - `private_key_jwt`: the Service Account authenticates by signing a JWT (JSON Web Token) using its private key. The client includes a JWT in the `Authorization` header of the request, with specific claims set to appropriate values. The server then verifies the JWT by validating the signature using the client's public key, and checking that the claims are valid and match its records.  

For further information on how to perform OAuth2 compliant client credential flows, check out the [Client Credentials Service documentation](../../runtime_suite/client-credentials/configuration.md)

### Editing a Service Account Role

A Service Account Role in the Company can be modified: to do so, simply click on the pencil-shaped button on the desired Service Account row and select the new Role.

<!-- TODO: SCREENSHOT OF COMPANY EDIT SA MODAL -->

### Removing a Service Account from the Company

A Service Account can be removed from the Company by clicking the trash icon on the table and confirming the action.

<!-- TODO: SCREENSHOT OF COMPANY DELETE SA MODAL -->

:::warning
Removing a Service Account from the Company will permanently delete the account and all its existing Roles, which will be lost and cannot be recovered.
:::

## Managing Project and Environment Service Accounts

A User with enough administrative permission on a specific Project will be able to view all the existing Service Accounts in the Company and edit their Role on the specific Project (and, optionally, on each existing Runtime Environment).

<!-- TODO: ADD SCREENSHOT OF PROJECT ADMIN PORTAL FILTERED BY SA IDENTITY TYPE -->

:::note
Although the Project Identities administration portal shows all the Company's identities, this does not mean that all of the identities have access to the Project, since this depends on the Role they are assigned in the Company and how the permissions are inherited.

For further information about permissions and Role inheritance check out the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md) page.
:::

### Editing a User Role at Project level

A User Role in the Project or any of the Project's Runtime Environments can be modified. To do so, just open the editing dialog and select the proper Role for the Project itself or for each Runtime Environment.

<!-- TODO: SCREENSHOT OF COMPANY EDIT SA MODAL -->
