---
id: api-reference
title: Provider APIs Reference
sidebar_label: API Reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

We report in this section the APIs used to create and modify providers, along with examples of request bodies:

- POST - `/api/backend/tenants/{tenantId}/providers`: used to create a new provider;
- PATCH - `/api/backend/tenants/{tenantId}/providers/{providerId}`: used to edit an existing provider.

:::info
These APIs are protected and can be used only if you belong to the group `access_token_manager`.
:::

### POST

To create a new provider, you need to call the respective API as follows:

```sh
curl --location --request POST 'https://console-url/api/backend/tenants/my-example-company/providers' \
--header 'Cookie: sid={{CHANGE_ME_WITH_YOUR_SID}}' \
--header 'Content-Type: application/json' \
--data-raw '{"credentials":{"type":"token","content":{"accessToken":"my-super-super-super-secret-token"}},"id":"gitlab-id","label":"My GitLab Label","type":"gitlab","urls":{"apiBase":"https://gitlab-test.com/api","base":"https://gitlab-test.com"}}'
```

<details>

<summary>The JSON schema of the request body</summary>

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "providerId": { "type": "string" },
    "label": { "type": "string" },
    "description": { "type": "string" },
    "type": { "type": "string" },
    "capabilities": {
      "description": "Field introduced in v10.8 of the Console",
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["git-provider", "secret-manager", "ci-cd-tool"],
      }
    },
    "urls": {
      "type": "object",
      "properties": {
        "base": { "type": "string" },
        "apiBase": { "type": "string" }
      },
      "required": ["base", "apiBase"]
    },
    "base64CA": { "type": "string" },
    "proxy": {
      "type": "object",
      "properties": {
        "url": { "type": "string" },
        "username": { "type": "string" },
        "password": { "type": "string" }
      },
      "required": ["url"]
    },
    "credentials": {
      "oneOf": [
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "type": {
              "type": "string",
              "const": "token"
            },
            "expirationDate": {
              "description": "Field introduced in v10.8 of the Console",
              "type": "string",
              "format": "date-time"
            },
            "content": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "accessToken": { "type": "string" }
              },
              "required": ["accessToken"]
            }
          },
          "required": ["type", "content"]
        },
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "type": {
              "type": "string",
              "const": "userPass"
            },
            "expirationDate": {
              "description": "Field introduced in v10.8 of the Console",
              "type": "string",
              "format": "date-time"
            },
            "content": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "userName": { "type": "string" },
                "password": { "type": "string" }  
              },
              "required": ["userName", "password"]
            }
          },
          "required": ["type", "content"]
        },
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "type": {
              "type": "string",
              "const": "m2m"
            },
            "expirationDate": {
              "description": "Field introduced in v10.8 of the Console",
              "type": "string",
              "format": "date-time"
            },
            "content": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "accessTokenURL": { "type": "string" },
                "token": { "type": "string" }
              },
              "required": ["accessTokenURL", "token"]
            }
          },
          "required": ["type", "content"]
        },
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "type": {
              "type": "string",
              "const": "client_credentials"
            },
            "expirationDate": {
              "description": "Field introduced in v10.8 of the Console",
              "type": "string",
              "format": "date-time"
            },
            "content": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "accessTokenURL": { "type": "string" },
                "clientId": { "type": "string" },
                "clientSecret": { "type": "string" }
              },
              "required": ["accessTokenURL", "clientId", "clientSecret"]
            }
          },
          "required": ["type", "content"]
        }
      ]
    },
    "required": ["providerId", "type", "urls"]
  }
}
```

</details>

:::info Supported credential types
As discussed [here](/console/company-configuration/providers/configure-provider.mdx#step-3-credentials), different types of providers support different types of credentials. The following table shows the credential types supported by each provider, referring to the data model shown above:

| Credentials Type   | Providers                                                             |
| ------------------ |:---------------------------------------------------------------------:|
| token              | gitlab, github, bitbucket, azure-devops, vault, jenkins               |
| m2m                | vault                                                                 |
| client_credentials | jenkins                                                               |
:::
:::caution Data model update
The fields `capabilities` and `expirationDate` (within `credentials`) have been introduced starting from version 10.8 of the Console.
:::

Examples of request bodies specific to each provider type are shown below. In the examples, the `capabilities` and `expirationDate` fields are omitted, since it is assumed that calls to this API are made by users with a Console version lower than 10.8.

<Tabs>
  <TabItem value="github" label="GitHub" default>

```json
{
  "id": "my-github-provider",
  "label": "Mia-Platform GitHub",
  "type": "github",
  "urls": {
    "apiBase": "https://api.github.com",
    "base": "https://github.com"
  },
  "credentials": {
    "type": "token",
    "content": {
      "accessToken": "my-super-super-super-secret-token"
    }
  }
}
```

  </TabItem>
  <TabItem value="gitlab" label="GitLab">

```json
{
  "id": "gitlab-id",
  "label": "My GitLab Label",
  "type": "gitlab",
  "urls": {
    "apiBase": "https://gitlab-test.com/api",
    "base": "https://gitlab-test.com"
  },
  "credentials": {
    "type": "token",
    "content": {
      "accessToken": "my-super-super-super-secret-token"
    }
  }
}
```

  </TabItem>
  <TabItem value="bitbucket-server" label="BitBucket Server">

```json
{
  "id": "bitbucket-id",
  "label": "My BitBucket Server Label",
  "type": "bitbucket",
  "urls": {
    "apiBase": "https://bitbucket-test.com",
    "base": "https://gitlab-test.com"
  },
  "credentials": {
    "type": "token",
    "content": {
      "accessToken": "my-super-super-super-secret-token"
    }
  }
}
```

  </TabItem>
  <TabItem value="azure-devops" label="Azure DevOps">

```json
{
  "id": "azure-devops-id",
  "label": "Azure DevOps",
  "type": "azure-devops",
  "urls": {
    "apiBase": "https://dev.azure.com",
    "base": "https://dev.azure.com"
  },
  "credentials": {
    "type": "token",
    "content": {
      "accessToken": "my-super-super-super-secret-token"
    }
  }
}
```

  </TabItem>
  <TabItem value="vault" label="Hashicorp Vault">

```json
{
  "type": "vault",
  "urls": {
    "baseUrl": "https://vault.example.com/",
    "apiBaseUrl": "https://vault.example.com/"
  },
  "credentials": {
    "type": "m2m",
    "content": {
      "token": "vault-jwt-token",
      "accessTokenURL": "https://vault.example.com/v1/auth/kubenetes/login"
    }
  }
}
```

  </TabItem>
  <TabItem value="jenkins" label="Jenkins OAuth 2.0">

```json
{
  "type": "jenkins",
  "urls": {
    "baseUrl": "https://jenkins.example.com/",
    "apiBaseUrl": "https://jenkins.example.com/"
  },
  "credentials": {
    "type": "client_credentials",
    "content": {
      "clientId": "id",
      "clientSecret": "secret",
      "accessTokenURL": "https://jenkins.example.com/oauth2/login"
    }
  }
}
```

  </TabItem>
</Tabs>

### PATCH
To edit an existing provider, you need to call the respective API as follows:

```sh
curl --location --request PATCH 'https://console-url/api/backend/tenants/my-example-company/providers/gitlab-id' \
--header 'Cookie: sid={{CHANGE_ME_WITH_YOUR_SID}}' \
--header 'Content-Type: application/json' \
--data-raw '{"credentials":{"type":"token","content":{"accessToken":"my-new-super-super-super-secret-token"}}'
```

The request of this endpoint is identical to the [previous one](#post), except that the `providerId` must be entered inside the endpoint params and not in the request body.
