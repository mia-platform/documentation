---
id: providers-management
title: Providers Management
sidebar_label: Providers Management
---

The Mia-Platform console allows you to interface with the most used git providers on the market. In order to configure a new provider on console you need to call a specific API as documented in the following paragraphs.

:::info
As an on-premise customer you have the ability to configure and use an authentication provider that differs from the git provider (i.e. [Okta](https://www.okta.com/) as authentication provider and [GitLab](https://gitlab.com/) as git provider).
:::

In order to do it, you **must** create and configure a service account, which will be used to interact with the chosen git provider.

:::info
As the service account is the only one to interact with the git provider, you will see it as author of some operations like pipelines trigger.
:::

In the following sections, you will see how to use the relative APIs to create a new provider and associate the respective service account's token, which will be appropriately encrypted to ensure a high standard of security.

## Providers APIs

In order to create a new provider you must call the respective API using the console's API Portal, under the "Providers" tag. 

![Providers tag](./img/providers-tag.png)

Two main APIs are exposed:
- POST - `/api/backend/providers`: used to create a new provider;
- PATCH - `/api/backend/providers/{providerId}`: used to edit an existing provider.

:::info
These APIs are protected and can be used only if you belong to the group `access_token_manager`.
:::


### Provider creation

To create a new provider, you must invoke the API `/api/backend/providers`.

Here is the request body:

![Providers creation body](./img/provider-body.png)

We can divide it in two categories: provider data and credentials data.

The provider data fields are:
- **id (string)**: it will be used to identify the provider;
- **label (string)**: an human-readable name for the provider;
- **type (string)**: the type of provider you are going to insert;
- **urls (object)**: an object that contains:
  - **apiBase (string)**: the API base url of the provider;
  - **base (string)**: the base url of the provider.


The credentials data fields are:
- **type (string)**: the type of credentials that you are going to insert;
:::info
Currently `token` and `userPass` are the only supported values
:::
- **content (object)**: a dynamic object that contains the credentials of the service account.
  - For type `userPass`, content **must** include `userName` and `password` fields;
  - For type `token`, content **must** include only `accessToken` field.


Below you can find a complete example of the request:

```json
{
  "id": "my-github-provider",
  "label": "Mia-Platform GitHub",
  "type": "github",
  "urls": {
    "apiBase": "https://api.github.com",
    "baseUrl": "https://github.com"
  },
  "credentials": {
    "type": "token",
    "content": {
      "accessToken": "my-super-super-super-secret-token"
    }
  }
}
```

:::info
The credentials are stored encrypted in MongoDB.  
For more information, take a look at the dedicated [documentation section](../../runtime_suite/crud-service/encryption_configuration).
:::

#### Associate provider

To associate the created provider to your project, you can use the CMS.

Navigate through the `Projects` section, select the desired project and change the `providerId` in the `Repository` section.

![Insert providerId](./img/providers-cms.png)

### Provider editing

To edit an existing provider, you must invoke the API `/api/backend/providers/{providerId}`.

The request of this endpoint is identical to the [previous one](#associate-provider), except that here you have to insert the `providerId` in the endpoint instead of the request body.

![Provider editing request body](./img/provider-edit-body.png)
