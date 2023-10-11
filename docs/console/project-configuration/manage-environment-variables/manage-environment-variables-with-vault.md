---
id: manage-environment-variables-with-vault
title: Manage Environment Variables With Vault
sidebar_label: Manage Environment Variables With Vault
---

[Hashicorp Vault](https://www.vaultproject.io/) is a product useful to store and manage variables with a state-of-the-art level of secrecy, while maintaining them always available for our deployments and applications.

Vault is usually deployed on a separate environment from the application that will need to use the variable kept in his storage, therefore configuring correctly the access to Vault and the policies to authenticate the application is vital for its usage.

Vault is capable of storing a multitude of variable types, but the most important (and useful) remain the **key/value** variables, that Vault can store, encrypt and version with ease. The emphasis of Vault is the high security level that provides to the variables, but it can be used for all types of values.

To correctly set up your Vault backed project, you will need to:

<!-- 1. [Configure the Vault instance and the Kubernetes cluster](#configure-the-vault-instance-and-the-kubernetes-cluster)
2. [Configure your Console project](#configure-your-console-project)
3. [Use Vault variables inside a project](#use-vault-variables-inside-a-project) -->

## Configure the Vault instance and the Kubernetes cluster

In this section, we will discuss how to properly configure your Vault installation to work with the Mia Platform's Console correctly.

You have to perform the following actions on the Vault instance:

- Create the *access policies*
- Create the *secret engines* and related *Vault secrets*
- Setup an *authentication method*

### Create the access Policies

You need to create [one policy](https://developer.hashicorp.com/vault/docs/concepts/policies) for every authentication method on your Vault instance, that will grant the permissions on the project.

An example of a policy is shown below, scoped to grant *admin* access to the project's secrets.

```text
path "secrets/{tenantId}/{projectId}KvV2/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
```

### Create the secret engines and Vault secrets

To be deployed by the Console, the environment variables should be stored in a predefined structure:

1. Create a secret engine named `secrets/<companyId>/<projectId>KvV2`, where `<companyId>` is the identifier of the company the project belongs to and `<projectId>` is the identifier of the project itself. The secret engine should be of type `KV` (Key-Value), the other options can be set according to your needs.
2. Inside the secret engine, create a secret for each environment of the project. The secret should be named the same as the environment identifier of the runtime environment where you want to deploy it.
3. The actual values of the variables can be placed inside the corresponding environment secret in the form of key-value pairs.  

:::tip
Imagine you have a project with project id `project`, inside the company `company`, with 2 runtime environments: `development` and `production`, and you want to store the secret variable `private_key` for the two environments, this is what your secrets should look like:

```text
secret path: secrets/company/projectKvV2/development
{
  private_key: "private_key_development"
}
```

and

```text
secret path: secrets/company/projectKvV2/production
{
  private_key: "private_key_production"
}
```

:::

### Setup an authentication methods

Currently the Console supports two kinds of authentication methods: 

- [Kubernetes authentication method](#kubernetes-authentication-method). 
- [Token authentication method](#token-authentication-method)

#### Kubernetes authentication method

This method allows the Kubernetes cluster and the Console to authenticate using the system accounts present in Kubernetes.

First of all, you will need to enable the *Kubernetes auth method* on Vault. Find out more in the [official documentation](https://www.vaultproject.io/docs/auth/kubernetes).

<!-- 
There are two possible configuration depending on where Vault is deployed:

- Vault deployed on the same Kubernetes cluster where you want to access the secrets
- Vault external to Kubernetes

The Vault documentation has a really clear table to look for these cases. [2](https://www.vaultproject.io/docs/auth/kubernetes#how-to-work-with-short-lived-kubernetes-tokens)
-->

Then you will need to:

- [Create the roles on Vault](#create-the-roles-on-vault)
- [Deploy the *service accounts* on the Kubernetes cluster](#deploy-the-service-accounts)

:::warning
Roles, policies and service accounts configuration changes with the restrictiveness of the policies that you want to apply.
:::

<!-- You can scope the permissions of the service accounts to the projects and you will have one service account per project, with the minimum permissions to work correctly. -->

##### Create the roles on Vault

You need one role for every project in which you created a policy. 

On creation, you will be prompted for:

- Role name: `tenantId_projectId`
- Bound service account names:  `vault-accessor`
- Bound service account namespaces: `<project_namespaces>`
- Generated Token's Policies: `<policy_name>`

Where the `<project_namespaces>` are the namespaces belonging to that project and `<policy_name>` is the policy name with the permissions for that project.

##### Deploy the service accounts

You will need to deploy a service account for each environment for which you want to use Hashicorp Vault. The name of the service account has to be `vault-accessor`.

You will also need to [create a RoleBinding](https://www.vaultproject.io/docs/auth/kubernetes#use-the-vault-client-s-jwt-as-the-reviewer-jwt) in every environment, binding the ClusterRole `system:auth-delegator` to the service account. 

An example of the RoleBinding is shown below. 

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-tokenreview-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:auth-delegator
subjects:
- kind: ServiceAccount
  name: vault-accessor
```

#### Token authentication method 

This authentication method requires the generation of a long-lived access token and can be done in two ways: from the Vault UI or using its APIs. Take a look at the official documentation [page](https://developer.hashicorp.com/vault/docs/auth/token) for more information.

It is also **required** to deploy the corresponding secret in the project's environment namespace on the cluster. Insert the token inside a secret called `vault-token` under the key `vault-token`.

## Configure your Console project

Assuming you have a Vault instance setup and running and a Console project already created, you can configure it to use Vault to store your environment variables. The steps to do that are the following:

1. Create a provider for your Vault instance. This can be done using the dedicated [providers APIs](//console/company-configuration/providers/configure-provider.mdx). The provider is the entity that contains references to the public hostname of your Vault instance and credentials to access its APIs. 
  
  In this step you have to configure:
    - The [provider related fields](/console/company-configuration/providers/configure-provider.mdx?providerType=vault#step-2-provider-details), having type `vault`. Optionally, you can setup a custom Certificate Authority and/or proxy.
    - The provider credentials, depending on the [authentication method chosen](#setup-an-authentication-methods) while the Vault instance was configured, two types of credentials are supported:
      - `token` credentials for the [token authentication method](#token-authentication-method), where `content.accessToken` directly stores your Vault token.
      - `m2m` credentials for the [kubernetes authentication method](#kubernetes-authentication-method). That stores a JWT linked to a service account in the target Kubernetes cluster and a URL to retrieve a short-lived token starting from the JWT via Vault APIs. These pieces of information are stored respectively in the `content.token` and `content.accessTokenURL` properties of the credentials document.

:::warning
`m2m` credentials are not supported yet if your Kubernetes cluster is behind a proxy.
:::

2. Link the provider to the project or environment from the CMS. Retrieve the previously created provider's `_id` (it will be prompted to you in the creation step) and from the CMS edit the `Environments variables` section to look like this:

  ```json
    {
      "type": "vault",
      "providerId": <your provider's _id>
    }
  ```

  You can also differentiate providers for specific environments. In this way, you can set up different Vault providers to be used in different environments. To do this, you must create an `environmentsVariables` object having the same structure as the one shown above inside the target environment object in the `Environments` section on the CMS. Any environment that doesn't specify its own `environmentsVariables` configuration will automatically inherit it from the project.

  :::tip example
  As an example, consider we have two Vault instances setup and running. These instances are configured in two providers having ids `vault-prod` and `vault-dev`. In our project, we want to use the `vault-prod` provider only for the production environment and the `vault-dev` provider for the other ones.

  This is how the `Environments variables` section of the CMS should look like:
  ```json
  {
    "type": "vault",
    "providerId": "vault-dev"
  }
  ```

  And below the `Environments` section of the CMS:
  ```json
  [
    { 
      "envId": "production", 
      "isProduction": true,
      "environmentsVariables": {
        "type": "vault",
        "providerId": "vault-prod"
      }
    },
    { "envId": "development" },
    { "envId": "staging" }
  ]
  ```

  In this way, `development` and `staging` environments will inherit their `environmentsVariables` configuration from the project. While the `production` environment will override it.
  :::

## Use Vault variables inside a project

Variables stored in a Vault provider cannot be directly interpolated in the project's configuration. However, you could access these variables by creating a new microservice environment variable and setting **value type** to **from secret**, **secret name** to `vault-secret`, and **secret key** to the target secreted environment variable name, take a look at the [microservice configuration section](/development_suite/api-console/api-design/services.md#environment-variable-configuration).

Projects that use Vault as the secret provider cannot manage their variables using the Console interface but they need to be manually edited from the Vault instance as described in a [previous section](#create-the-secret-engines-and-vault-secrets).

:::warning
Variables on Vault are not automatically synced with the respective secret on the cluster by design. Instead, every time a variable is added or deleted on Vault you have to regenerate the project's configuration in order to correctly reconfigure the external secret. Meanwhile, when a variable is edited a redeploy of the target environment will suffice to update the variables on the cluster.
:::
