---
id: manage-service-accounts
title: Manage Service Accounts
sidebar_label: Manage Service Accounts
---

Mia-Platform Console allows the creation of service accounts, which are typically used for automated processes or to allow a service to access resources on behalf of multiple users.  

Just like human users, service accounts can be assigned roles at Console, Company, Project or Runtime Environment levels, according to which they can perform different types of actions.

:::note
To find out more about roles check out the available [capabilities](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console) that can be assigned to an [identity](/development_suite/identity-and-access-management/index.md#identity-and-access-management).
:::

### What can you do with a Service Account?

Potentially, every action a user can perform in the Console can be entrusted to a dedicated service account, which will execute it automatically.

For instance, you can grant a service account the permissions to make automatic deploys: this can significantly streamline the whole process of deploying code changes to an application. The service account could use its credentials to access the appropriate deployment resources and automatically deploy new versions of the application as soon as new code is pushed to the source code repository.  
This allows teams to implement a CI/CD workflow that can improve the speed, reliability and scalability of their software development processes. 

A service account can also be used to monitor and log Kubernetes resources, such as Pods, Deployments and Services. Once authorized, the service account can use logging and monitoring tools to collect and analyze data on resource usage, performance metrics and other important indicators.

:::info  
In this [article](https://blog.mia-platform.eu/en/service-account-m2m-with-security-in-mind), you can have an in-depth look at some best practices for effectively managing service accounts.
:::
## Managing Company Service Accounts

A user with enough administrative permission on a specific Company will be able to view the existing service accounts in the Company, add new ones and delete existing ones from the **Service accounts section**.

![Service accounts portal](./img/manage-service-accounts/service-accounts-portal.png)

### Adding a Service Account

The Company Owner can add a new service account by clicking on the *Add Service Account* button.

The service account creation process will require the following information:
- Name: a human-readable name to identify the service account
- Role: the Company role to be assigned to the service account
- Authentication method: the method used to verify the identity of the service account can be of two types
    - **Client Secret Basic**: the service account authenticates by presenting its `client_id` and `client_secret` in the Authorization header of the request, in the format `Authorization: Basic <base64 encoded client_id:client_secret>`. The Console then decodes the header and validates the credentials against its records to authenticate the client. 
    
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', width: '600px'}}>

    ![Add Company service account with client secret basic auth](./img/manage-service-accounts/add_company_sa_client_secret.png)

      </div>
    </div>

    - **Private Key JWT**: the service account authenticates by signing a JWT (JSON Web Token) using its private key. The client includes a JWT in the authentication request, with specific claims set to appropriate values. The Console then verifies the JWT by validating the signature using the client public key provided during service account creation, and checking that the claims are valid and match its records.  
    
      This authentication method provides better security than `client_secret_basic`, because the private key is never transmitted over the network neither shared with the server. However, it requires more setup and configuration on the client side to generate and manage the private and public keys.  
      We highly suggest to use this method whenever it is required not to share the credentials with the server or you cannot trust the network the service account is using.

    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', width: '600px'}}>
    
    ![Add Company service account with private key jwt auth](./img/manage-service-accounts/add_company_sa_private_key_jwt.png)

      </div>
    </div>

:::info
Find out more about how these authentication methods work in the Console in the [service account authentication](/development_suite/identity-and-access-management/manage-service-accounts.md#service-account-authentication) paragraph.
:::

### Removing a Service Account

A service account can be removed from the Company by clicking the delete icon on the corresponding table row and confirming the action.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Delete Company Service Account](./img/manage-service-accounts/delete_company_sa.png)

  </div>
</div>

:::warning
Removing a service account from the Company will permanently delete the account and all its existing roles, which will be lost and cannot be recovered.
:::

## Managing service account roles

Service account roles are managed from the [IAM portal](/development_suite/identity-and-access-management/manage-identities.md), which is specifically dedicated to the governance of roles and accesses to the resources of the Company.

### Managing Service Account role at Company level

To modify a service account role in the Company, simply click on the edit button for the desired service account row and select the new role.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit Company Service Account](./img/manage-service-accounts/edit_company_sa.png)

  </div>
</div>

:::caution
Please note that some permissions defined by the Company role may be inherited on the Projects and Runtime Environment owned by the Company itself.  
Always pay attention when assigning roles, in order to avoid providing undesired access to resources!
:::

### Managing Service Accounts at Project level

A user with enough administrative permission on a specific Project will be able to view all the existing service accounts inside the Project Overview area of a Project belonging to that specific Company. From there, the user can edit the role of service accounts on the specific Project (and, optionally, on each existing Runtime Environment).

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '600px'}}>

![Edit project service account](./img/manage-identities/edit-project-sa.png)

  </div>
</div>

:::note
Although the Project IAM portal shows all the Company's identities, this does not mean that all of the identities have access to the Project, since this depends on the role they are assigned in the Company and how the permissions are inherited.

For further information about permissions and role inheritance check out the [Console Levels and Permission Management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md) page.
:::

## Managing Company-independent Service Accounts

Root service accounts are a special kind of Company-independent service accounts that can be assigned permissions to perform [root-level operations](//development_suite/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions).

:::info
Only Console Super Users with administrative capabilities can add or delete service accounts independent from the Company, since they are the only ones who can assign root-level permissions to identities. Note that Company-independent service accounts with assigned root-level permissions are only visible and manageable at back-office level, and they will never be visible from a Company IAM portal.
:::

### Creating Root Service Accounts

In order to create a new Root service account, you need to contact the `/api/service-accounts` endpoint.

You will need to provide the following parameters in the body:

- `tokenEndpointAuthMethod`: `client_secret_basic` or `private_key_jwt`.
- `publicKey` (optional): only necessary if you choose `private_key_jwt` as an authentication method. Read [Adding a new Service Account](#adding-a-new-service-account) for further information.
- `name`: the Root service account name.
- `permissions`: a list of permissions to assign to the service account, separated by a comma. See [Console levels and permission management](/development_suite/identity-and-access-management/console-levels-and-permission-management.md) for a reference of the available permissions.

To authenticate your request, you will need to provide your access token and the Console client key.

Here is an example of cURL request for creating a Root service account with the `client_secret_basic` authentication method:

```shell
curl --location --request POST 'http://[my-console-url]/api/service-accounts' \
    --header 'Content-Type: application/json' \
    --header 'Client-key: [console-client-key]' \
    --header 'Authorization: Bearer [my-access-token]'
    --data '{
        "name": "Example Service Account",
        "permissions": ["console.root.user.bind", "console.root.user.manage"],
        "tokenEndpointAuthMethod": "client_secret_basic"
    }'
```

Example response:

```json
{
  "clientId": "[clientId]",
  "clientSecret": "[clientSecret]",
  "clientIdIssuedAt": 1681984988
}
```

:::warning
Remember to store in a secure place both the `clientId` and `clientSecret` as those will be needed to authenticate requests from the service account.
:::

### Deleting Root Service Accounts

To delete a Root service account, you need to contact the `/api/service-accounts/{clientId}` endpoint, providing the `clientId` obtained from the creation response.

To authenticate your request, you will need to provide your access token and the Console client key.

Here is an example of cURL request for deleting a Root service account:

```shell
curl --location --request DELETE 'http://[my-console-url]/api/service-accounts/[clientId]' \
    --header 'Content-Type: application/json' \
    --header 'Client-key: [console-client-key]' \
    --header 'Authorization: Bearer [my-access-token]'
```

## Service Account authentication

In order to authenticate to the Console, a service account needs to contact the `/api/m2m/oauth/token` endpoint, providing the correct authentication information based on the chosen authentication method.

:::note
The access token you obtain in this process has an expiration date, after which you will necessarily need to contact the endpoint again to get a new one.
:::

Here is an example of cURL request for service account authentication with the `client_secret_basic` method:

```shell
curl --location \
    --request POST 'http://[my-console-url]/api/m2m/oauth/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header 'Authorization: Basic base64(client_id:client_secret)' \
    --data-urlencode 'grant_type=client_credentials'
```

Example response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleUlEIiwidHlwIjoiSldUIn0.eyJleHAiOjE1OTE3OTg1OTYsImlhdCI6MTU5MTc5NDk5NiwiaXNzIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJjbGllbnQtaWQiLCJwZXJtaXNzaW9ucyI6W119.tfuIjL8ZN7dFmtT3n9NQLxY6Jhq1BoVZwb_LhTZS0zLNqxNQjQA-5-bN6-vne1ZJg9fBeRkq3aKxGjWCuruXTjYRfDLZwMSFoP3ki6NtUrdAqbse_c2J6DgI5m_F44NOZJFGZ8fbMydox5HV19swaozF32-aFN7UN53zZ7wV0tMdVXc-Nvf2WU8udGVXlqNtlMpQC2JZjSh8GeOljxZD4O6PDmp55ZoIcp7TscEzywT4yzUVJ78cLvMx1_rgZTto687XPJYdiqjdsI5kg7mSDH7_Bn9BfAR3Ln6qrPC_VieqAWf8-YmloyQNxx8dER8Yl-vDMCkHp3Z9Hla0XOrrm9F8IEyEQj5qmA_3TewppaDn3lu8Q4qYy_7v5lGSWTfx8PwaNHT5rRnDz10FI59KjM4WMzheTkqJ0Bw3dR-p1huF6iqoMsvnw5HfvdyyYP9_mMu0uw4JZiXInIR3qtmGZF6QGeeYK-l1atx1QRq-O5jvqZUy2hYFsJCLQEAHhF2jU5bWjbMjDsgSn1FHnzJY7IjRUNND6BuT4aBJzz0nspwy4fZhJTLrLLwFI3cjt17m5Ngrb9JY88dhGXLhAnWzjIDPWDM7Ao4YfQ2DHp2CM0P5OBB9sy8kXCgvv4ICAXv4cIEXIaMCE7QsPLHX8UqdwvP7-ygOyvCRRY_5seT70GQ",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

The same request can be made with the `private_key_jwt` authentication method:

```shell
curl --location \
  --request POST 'http://[my-console-url]/api/m2m/oauth/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer' \
  --data-urlencode 'client_assertion=<assertion-JWT>' \
  --data-urlencode 'client_id=<client-id>' \
  --data-urlencode 'token_endpoint_auth_method=private_key_jwt'
```

:::info
**What are the main components of an assertion JWT?**

- **Header**: The header of a JWT contains metadata about the token, such as the algorithm used to sign the token. The header is a JSON object that should be encoded in Base64Url format and has the following fields:
  - `alg`: `RS256`
  - `typ`: `JWT`
  - `kid`: the Key ID (`kid`) that the is returned during service account creation

- **Payload**: The payload of a JWT contains the claims that are being made about the identity of the client. The payload is also a JSON object that is encoded in Base64Url format and has the following fields:
  - `iss` (issuer): the Client ID that the is returned during service account creation
  - `sub` (subject): the Client ID that the is returned during service account creation
  - `aud` (audience): `console-client-credentials`
  - `jti` (JWT ID): a custom string that will be used against replay attacks
  - `iad` (issued at): timestamp when this JWT is being issued
  - `exp` (expires at): timestamp when this JWT will have to be considered expired

- **Signature**: The signature of a JWT is used to verify the integrity of the token and to ensure that it has not been tampered with. The signature is created by combining the encoded header and payload with a secret key using a specified cryptographic algorithm.
:::

:::info
For further details and practical examples on how to perform OAuth2 compliant client credential flows, check out the [Client Credentials Service documentation](/runtime_suite/client-credentials/20_usage.md) 
:::
