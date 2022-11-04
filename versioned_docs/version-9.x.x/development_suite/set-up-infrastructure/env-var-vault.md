---
id: env-var-vault
title: Manage Environment Variables With Vault
sidebar_label: Vault Environment Variables
---

[Hashicorp Vault](https://www.vaultproject.io/) is a product useful to store and manage variables with a state-of-the-art level of secrecy, while maintaining them always available for our deployments and applications.

Vault is usually deployed on a separate environment from the application that will need to use the variable kept in his storage, therefore configuring correctly the access to Vault and the policies to authenticate the application is vital for its usage.

Vault is capable of storing a multitude of variable types, but the most important (and useful) remain the **key/value** variables, that Vault can store, encrypt and version with ease. The emphasis of Vault is the high security level that provides to the variables, but it can be used for all types of values.

# Configure your Vault instance

In this section we will discuss how to configure correctly your Vault installation to correctly work with tha Mia Platform's console.

## Configure the authentication from Kubernetes to Vault

To correctly authenticate Kubernetes in a Vault deployment, we need two components:

- The *Policy*, that will grant the correct right to the token that will manage our secrets. [Official policy documentation](https://www.vaultproject.io/docs/concepts/policies).
- The *Auth method*, that will expose an API endpoint for out Kubernetes to receive Vault tokens at request. [2](https://www.vaultproject.io/docs/auth/kubernetes)

The Console supports two different *Auth methods*:
- The Kubernetes auth method
- The Token auth method (preconfigured on Vault)

### Policy

We want to grant the minimum necessary amount of permissions to the tokens that both the Console and the Kubernetes installation that will be use Vault secrets will be using.

An example of policy is shown below, scoped to grant admin access to the project secrets.

```yaml
path "secrets/{tenantId}/{projectId}KvV2/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
```

### Kubernetes Auth Method

This method will be used from both the Console and the Kubernetes installation to retrieve tokens to manage secrets since it only requires the JWT of an authorized Service Account. The console is treated as a *trusted entity* since it will need to manage the secrets stored in Vault.

This authentication method will need a configuration of the method itself and the creation of a role with the specified service account that will access Vault.

#### Method configuration

This part of the configuration needs to be adapted to the existent configuration of Vault and the Kubernetes cluster. The two main differences that we can have are:

- Vault deployed on the Kubernetes itself
- Vault external to Kubernetes

The Vault [documentation](https://www.vaultproject.io/docs/auth/kubernetes#how-to-work-with-short-lived-kubernetes-tokens) has a really clear table to look for these cases.

##### Vault installed on Kubernetes

It is enough to specify the Kubernetes endpoint of the Control Plane, used by Vault to make API call to Kubernetes.

##### Vault outside Kubernetes

As specified in the documentation, we need to specify the Kubernetes endpoint, omit the field `token_reviewer_jwt` and set the field `disable_local_ca_jwt=true`. To allow TLS connection from Vault we need to also set the correct Certificate for the cluster in the method.

#### **Role configuration**

The configurations for the role are fixed, and needed to allow the console to authenticate correctly.

- `role name: companyId_projectId`
- `Bound service account names:  "vault-accessor"`
- `Bound service account namespaces:  *`
- `Generated Token's Policies: {policy name}`

Note: The  `Bound service account namespaces` field is meant to allow automatically every different namespace to get Vault variables. If your cluster configuration has the concept of *multitenancy* or you don't want to let every namespace to populate Vault secrets, it is possible to restrict it to a list of Namespaces.

#### Console auth

The console will use the same "Kubernetes auth method" configured for the cluster, but it will use a JWT stored (and encrypted) in our MongoDB.

To allow connection between the Console and Vault you need to create a provider of the correct type in the console. The procedure is described in the Section "Configure your project" of this guide (m2m provider). 

### Token auth method configuration

The Token auth method is built-in in every Vault installation at the */auth/token* path.

To use this auth method you need to create a provider of the correct type in the console. The procedure is described in the Section "Configure your project" of this guide (token provider). 

## Deployment of the resources 

The necessary resources for an external secrets backend to work consist of the operator [External Secrets](https://external-secrets.io/). This operator does not need particular configurations (aside from replication, limits and tolerations based on your cluster) and resides in its Namespace *external secrets*.

This operator, at deploy time, will create Kubernetes secrets in the namespaces where the Console has deployed an *externalSecret* resource and will populate it with the Values stored in Vault.

## Configure your project

Assuming you have a Vault instance setup and running and a Console project already created, you can configure it to use Vault to store your environment variables. The steps to do that are the following:

1. Create a provider for your Vault instance. This can be done using the dedicated [providers APIs](configure-provider.mdx). The provider is the entity that contains references to the public hostname of your Vault instance and credentials to access its APIs. 

  Depending on the authentication method chosen while the Vault instance was configured, two kinds of credentials are supported :
    - `token` credentials, this is the most simple type of authentication available and works in any scenario. It simply consists of a long-lived token generated in advance from the Vault instance and will be used by the Console when making APIs requests against it. For more information on how to enable this kind of authentication from Vault, take a look at the dedicated [page](https://www.vaultproject.io/docs/auth/token) in the official documentation. It is also **required** to deploy the corresponding secret in the project namespace on the cluster, the secret has to be named `vault-token` and the token inserted in `vault-token` key.
    - `m2m` credentials, this kind of credentials involves the usage of a Kubernetes cluster. These credentials store a JWT linked to a service account in the target Kubernetes cluster and a URL to retrieve a short-lived token starting from the JWT via Vault APIs. These pieces of information are stored respectively in the `content.token` and `content.accessTokenURL` properties of the credentials document. For more information on how to enable this kind of authentication from Vault and how it works, take a look at the official documentation [page](https://www.vaultproject.io/docs/auth/kubernetes). When you enable this authentication method from Vault remember to set the role to `companyId_projectId`, where `companyId` is your company identifier and `projectId` is the identifier of your project.

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

:::info
Vault providers can even be linked to the environments-level, in a way that different environments can manage their variables in different Vault instances. To do so, edit the environment configuration from the CMS and put an object similar to that of the project-level in the environment's `environmentsVariables` property.

Any environment that doesn't specify its own `environmentsVariables` configuration will automatically inherit it from the project.
:::

## Manage your variables

:::caution
Projects that use Vault as the secret provider cannot manage their variables using the console interface but they need to be manually edited from the Vault instance.
:::

To be deployed by the console, the environment variables should be stored in a predefined structure:

1. Create a secret engine named `secrets/<companyId>/<projectId>KvV2` where `<companyId>` is the identifier of the company the project belongs to and `<projectId>` is the identifier of the project itself. The secret engine should be of type `KV` (Key-Value), the other options can be set according to your needs.
2. Inside the secret engine create a secret for each environment of the project. The variable should be named the same as the environment identifier of the runtime environment where you want to deploy the secret.
3. The actual values of the variables can be placed inside the corresponding environment secret in the form of key-value pairs. 

:::warning
Variables stored in a Vault provider cannot be directly interpolated in the project's configuration. However, you could access these variables by creating a new microservice environment variable and setting **value type** to **from secret**, **secret name** to `vault-secret`, and **secret key** to the target secreted environment variable name.
:::