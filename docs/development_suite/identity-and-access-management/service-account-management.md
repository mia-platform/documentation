---
id: service-account-management
title: Manage Service Accounts
sidebar_label: Manage Service Accounts
---

Mia-Platform Console allows the creation of Service Accounts, which are typically used for automated processes or to allow a service to access resources on behalf of multiple Users.  
Note that new Service Accounts can only be created at Company level. For each Project or Environment they will be visible in the Identities section.
Just like human Users, Service Accounts can be assigned Roles on Company, Project or Runtime Environment level, based on which they will be able to perform different types of action.  

:::note
To find out more about Roles check out the available [Capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an identity.
:::

### What can you do with a Service Account?

Virtually anything a User can do inside the Console can be entrusted to a dedicated Service Account, which will perform the desired actions automatically.

For instance, a Service Account could be granted permissions to make automatic deploys, which can greatly streamline the process of deploying code changes to an application. The Service Account could use its credentials to access the appropriate deployment resources and automatically deploy new versions of the application as soon as new code is pushed to the source code repository.  
This allows teams to implement a CI/CD workflow that can improve the speed, reliability, and scalability of their software development processes. 

A Service Account can also be used to monitor and log Kubernetes resources, such as Pods, Deployments and Services. Once authorized, the Service Account can use logging and monitoring tools to collect and analyze data on resource usage, performance metrics, and other important indicators.

## Managing Company Service Accounts

A User with enough administrative permission on a specific Company will be able to view the existing Service Accounts in the Company, to add new ones and to change their Roles.

<!-- TODO: SCREENSHOT OF THE IDENTITIES PAGE WITH FILTER ON IDENTITY TYPE = Service Account -->

:::caution
Please note that some permissions defined by the Company Role may be inherited on the Projects and Runtime Environment owned by the Company itself.  
Always pay attention when assigning Roles in order to avoid providing undesired access to resources!
:::

### Adding a new Service Account

The Company Owner can add a new Service Account by clicking the *Add Service Account* option inside the *Add User* split button, on the top-right corner of the Identities page. 

<!-- TODO: SCREENSHOT OF COMPANY ADD SA MODAL -->

The Service Account creation process will require the following information:
- Name: a human-readable name to identify the Service Account
- Role: the Company Role to be assigned to the Service Account
- Authentication method: it is necessary to verify the identity of the Service Account and can be of two types <!-- TODO: SCREENSHOT OF THE DIFFERENT FLOWS -->
    - **Client Secret Basic**: the Service Account authenticates by presenting its `client_id` and `client_secret` in the Authorization header of the request, in the format `Authorization: Basic <base64 encoded client_id:client_secret>`. The Console then decodes the header and validates the credentials against its records to authenticate the client.  

    It is worth noting that the `client_secret_basic` authentication method is less secure than some other OAuth 2.0 authentication methods, because the client secret is transmitted in cleartext as part of the Authorization header. Therefore, it is important to use this authentication method only in secure environments where the client secret can be properly protected.
    - **Private Key JWT**: the Service Account authenticates by signing a JWT (JSON Web Token) using its private key. The client includes a JWT in the `Authorization` header of the request, with specific claims set to appropriate values. The Console then verifies the JWT by validating the signature using the client public key, and checking that the claims are valid and match its records.  

    This authentication method provides better security than `client_secret_basic`, because the private key is not transmitted over the network. However, it requires more setup and configuration on the client's side to generate and manage the private and public keys.

<!-- TODO: LINK TO THE CORRECT ANCHOR IN THE CLIENT CREDENTIALS SERVICE -->

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

### Adding a new Service Account at Project level

The Company Owner can add a new Service Account by clicking the *Add Service Account* option inside the *Add User* split button, on the top-right corner of the Identities section of the Project settings area. Here, the Service Account can be assigned a Company Role and additional Roles on the specific Project and its Runtime Environments.  

The Service Account invitation process will also require an authentication method, as specified in the [Adding a new Service Account](development_suite/identity-and-access-management/service-account-management.md#adding-a-new-service-account) paragraph.

<!-- TODO: SCREENSHOT OF PROJECT ADD SA MODAL -->

### Editing a Service Account Role at Project level

A Service Account Role in the Project or any of the Project's Runtime Environments can be modified. To do so, just open the editing dialog and select the proper Role for the Project itself or for each Runtime Environment.

<!-- TODO: SCREENSHOT OF PROJECT EDIT SA MODAL -->

## Service Account authentication

In order to authenticate to the Console, a Service Account needs to contact the `/api/m2m/oauth/token` endpoint. Here is an example of CURL request for Service Account authentication with the `client_secret_basic` method:

```shell
curl --location \
    --request POST 'http://[my-console-url]/api/m2m/oauth/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header 'Authorization: Basic base64(client_id:client_secret)' \
    --data-urlencode 'grant_type=client_credentials' \
    --data-urlencode 'audience=aud1'
```

Example response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleUlEIiwidHlwIjoiSldUIn0.eyJleHAiOjE1OTE3OTg1OTYsImlhdCI6MTU5MTc5NDk5NiwiaXNzIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJjbGllbnQtaWQiLCJwZXJtaXNzaW9ucyI6W119.tfuIjL8ZN7dFmtT3n9NQLxY6Jhq1BoVZwb_LhTZS0zLNqxNQjQA-5-bN6-vne1ZJg9fBeRkq3aKxGjWCuruXTjYRfDLZwMSFoP3ki6NtUrdAqbse_c2J6DgI5m_F44NOZJFGZ8fbMydox5HV19swaozF32-aFN7UN53zZ7wV0tMdVXc-Nvf2WU8udGVXlqNtlMpQC2JZjSh8GeOljxZD4O6PDmp55ZoIcp7TscEzywT4yzUVJ78cLvMx1_rgZTto687XPJYdiqjdsI5kg7mSDH7_Bn9BfAR3Ln6qrPC_VieqAWf8-YmloyQNxx8dER8Yl-vDMCkHp3Z9Hla0XOrrm9F8IEyEQj5qmA_3TewppaDn3lu8Q4qYy_7v5lGSWTfx8PwaNHT5rRnDz10FI59KjM4WMzheTkqJ0Bw3dR-p1huF6iqoMsvnw5HfvdyyYP9_mMu0uw4JZiXInIR3qtmGZF6QGeeYK-l1atx1QRq-O5jvqZUy2hYFsJCLQEAHhF2jU5bWjbMjDsgSn1FHnzJY7IjRUNND6BuT4aBJzz0nspwy4fZhJTLrLLwFI3cjt17m5Ngrb9JY88dhGXLhAnWzjIDPWDM7Ao4YfQ2DHp2CM0P5OBB9sy8kXCgvv4ICAXv4cIEXIaMCE7QsPLHX8UqdwvP7-ygOyvCRRY_5seT70GQ",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

:::info
For further information on how to perform OAuth2 compliant client credential flows, check out the [Client Credentials Service documentation](/runtime_suite/client-credentials/usage.md) 
:::