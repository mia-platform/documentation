---
id: manage-environment-variables-with-akv
title: Manage Environment Variables with Azure Key Vault
sidebar_label: Manage Environment Variables with Azure Key Vault
---

:::info
This feature is supported from version vX.Y.Z upward
:::

[Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault), serves as a valuable solution for securely storing and managing a wide range of sensitive information. This includes not only fundamental key-value pairs but also digital certificates and private keys. It ensures the continuous availability of these resources for our deployments and applications, enhancing security and accessibility.

:::warning
The current version of the Console can only acquire key-value pairs (aka secrets) from Key Vault.
:::

You can directly manage the secrets stored in Key Vault using the web interface of your Key Vault instance. The exclusive role of Console is to retrieve these secrets during deployment and subsequently supply them to your runtime environment in the format of Kubernetes Secrets.

<!-- The management of the secrets stored in Key Vault is done directly from the web interface of your Key Vault instance, the Console is responsible for solely fetching the secrets at deploy time and providing them to your runtime environment in the form of Kubernetes Secrets. -->

To correctly configure a Key Vault in your project follow these steps:

1. [Install the `external-secrets` operator](https://external-secrets.io/) in the Kubernetes cluster where your project will be deployed
2. [Setup the Key Vault instance for the operator authentication](#setup-the-key-vault-instance)
3. [Setup the project to use the Azure Key Vault provider as a secret manager](#project-configuration)

## Setup the Key Vault instance

There are several ways to enable the operator authentication against the Key Vault instance, the one we support at the moment is the Workload Identity authentication. This authentication method does not require sharing any secret between the cluster and Key Vault.

### Workload Identity setup

The [Workload Identity](https://azure.github.io/azure-workload-identity/docs/) authentication works by establishing a trust relationship between a service account from the namespace of the Kubernetes cluster where your project will be deployed and the Azure Active Directory service that is responsible for the authentication and authorization against the Key Vault instance.

#### 1. Create an Azure Active Directory application

First off, you need to create an Azure application aka Service Principal. This application will be used as a conduit to Azure Key Vault and will set up all the required permissions and credentials. Follow the steps reported [here](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).

#### 2. Authorize the AAD application

Once the AAD Application has been created you need to authorize it to read the secrets stored in Key Vault. This process depends on your organization's policies and the authorization method chosen, if you are using the RBAC authorization model follow [these steps](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide).

#### 3. Enable your cluster as an Open ID Connect provider

In this step, we are going to enable the cluster to act as an Open ID Connect provider. This step allows the verification of the token signed by the operator by Key Vault.

The actions to be performed in this step depend on the nature of your cluster:

- Managed clusters (i.e. AKS, GCP, ...) are usually easier to configure as an OIDC provider. In fact, GCP clusters usually are by default OIDC providers. While AKS clusters can be configured in [this way](https://azure.github.io/azure-workload-identity/docs/installation/managed-clusters.html).
- Self-managed clusters require a bit more work but [here](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters.html) there is a well-explained tutorial.

#### 4. Add the federated credentials to the application

In this last step, we are ready to associate the service account that will be automatically deployed in the cluster namespace associated to the environment of the project with the AAD Application created before.

On the Application main page, click on the `Certificates & secrets` menu voice on the left, then switch to the `Federated credential` tab and click `Add credential`, you will be prompted with a form. Inside the form fill in the `Subject identifier` field in the following way:

```
system:serviceaccount:<namespace>:akv-accessor
```

Where:

- `<namespace>` is the namespace where your project will be deployed. it depends on the environment of the project, its value can be retrieved from the [environments page](/console/project-configuration/manage-runtime-environments/index.md) in the Console.

The other fields of the form can be filled in as you wish.

This configuration can also be done from the Azure CLI program `az`, as explained [here](https://azure.github.io/azure-workload-identity/docs/topics/federated-identity-credential.html#federated-identity-credential-for-an-azure-ad-application).

## Setup the Console project

Once the Key Vault instance is configured, we are now ready to set up the Console project. The project set up can be split into three steps:

1. Azure Key Vault provider creation
2. Project configuration
3. Microservices configuration

### Azure Key Vault provider

In order to connect to the Azure Key Vault instance you have to create a provider. In the provider creation modal, select the `Azure Key Vault` type when prompted, then fill the fields as described in the [providers management page](/development_suite/set-up-infrastructure/configure-provider.mdx#connect-a-provider)

:::warning
Please notice that each provider is linked to an Azure Key Vault store, we advice to setup at least two providers for each project, one for production data and another for noprod data, each associated with the respective environment of the project.
:::

### Project configuration

Connect the provider to the project or environment through the CMS. Retrieve the previously generated provider's `_id` (you can find it inside the `Providers` section of the CMS) and use it to modify the `Environments variables` section in the CMS as follows:

```json
{
  "type": "azure-key-vault",
  "providerId": <providerId>,
  "azureClientId": <azureClientId>,
  "azureTenantId": <azureTenantId>,
  "serviceAccountName": <serviceAccountName>,
}
```

Where:

- `<providerId>` (**required**) is the `_id` of the provider created before
- `<azureClientId>` (**required**) is the client id of the Azure Active Directory application that will fetch the secrets from the cluster
- `<azureTenantId>` (**required**) the tenant identifier for your company on Azure
- `<serviceAccountName>` an optional name for the service account to use in the authentication process. Defaults to `akv-accessor`

:::warning
If `serviceAccountName` is defined the Console will not deploy the service account automatically but is your responsibility to provision it.
:::

You also have the option to distinguish between providers for specific environments. This enables you to establish various Azure Key Vault providers for different environments. To achieve this, you need to create an `environmentsVariables` object with the same structure as the one demonstrated above within the target environment object found in the `Environments` section of the project's page in the CMS. Any environment that doesn't specify its own `environmentsVariables` configuration will automatically inherit it from the project.

### Use Azure Key Vault secrets inside the Console

Secrets stored within an Azure Key Vault provider cannot be directly utilized as interpolations in the project's configuration. However, you can access these variables by creating a new microservice environment variable with the value type set to `from secret` the secret name designated as `akv-secret` and the secret key specified as the desired secret name. Detailed instructions for this process can be found in the [microservice configuration section](/development_suite/api-console/api-design/services.md#environment-variable-configuration).

By design, the `akv-secret` in the cluster is not automatically synchronized with its corresponding secrets on Azure Key Vault. Instead, when a new variable is added or removed in Key Vault, it is necessary to regenerate the Design configuration of the project to properly reconfigure the Kubernetes secret. Conversely, if a variable is edited, a new deploy of the target environment is required to update the variables on the cluster.