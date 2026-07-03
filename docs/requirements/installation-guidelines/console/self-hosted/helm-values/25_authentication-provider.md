---
id: authentication-provider
title: Authentication Provider
sidebar_label: Authentication Provider
---



In order to authenticate users Mia-Platform Console requires a connection to an Identity Provider that is in charge of authenticate users.

## Supported Authentication Providers

Any `OAuth2` compliant Identity Provider is supported, however Mia-Platform Console provides specific integrations with most IDPs, here is a comprehensive list, each provider identified by an id that can be used during configuration:

* Okta (`okta`)
* Keycloak (`keycloak`)
* GitLab (`gitlab`)
* GitHub (`github`)
* Microsoft (`microsoft`)
* Bitbucket (`bitbucket`)

:::info
For provider not listed here, you can use the `generic` authentication provider to configure your own.
:::

## Configure your Authentication Provider

To connect Mia-Platform Console with your Authentication Provider you have to setup the `authProviders` configuration.

:::warning
Please bear in mind that the `authProviders` field is a required field, you can't install Mia-Platform Console without configuring at least one Authentication Provider.
:::

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `name` | string | A unique name for the provider |  | ❌ |
| `type` | string | The type of provider, one of `okta`, `gitlab`, `github`, `microsoft`, `bitbucket`, `keycloak`, `generic` |  | ❌ |
| `baseUrl` | string | The url of the git provider |  | ❌ |
| `apiBaseUrl` | string | The url of the git provider API andpoint | value of `baseUrl` | ✅ |
| `label` | string | The label to be shown to the final user |  | ❌ |
| `clientId` | string | The client Id for authentication |  | ❌ |
| `clientSecret` | string | The client secret for authentication |  | ❌ |
| `authPath` | string | The path for the authentication API |  | ✅ |
| `authUrl` | string | The full url for the authentication API | value of `apiBaseUrl/authPath` | ✅ |
| `tokenPath` | string | The path for retrieving the user token  |  | ✅ |
| `tokenUrl` | string | The full url for retrieving the user token | value of `apiBaseUrl/tokenPath` | ✅ |
| `userInfoPath` | string | The path for retrieving the user data |  | ✅ |
| `userInfoUrl` | string | The full url for retrieving the user data | value of `apiBaseUrl/userInfoPath` | ✅ |
| `userSettingsURL` | string | The full url to the API endpoint for requesting the user data | empty string | ✅ |
| `skipRefreshProviderTokenOnMiaTokenRefresh`| boolean | Skip refresh the provider token when the console one is expired | `true` | ✅ |
| `cmsClientId` | string | The client Id for CMS authentication | value of `clientId` | ✅ |
| `cmsClientSecret` | string | The client secret for CMS authentication | value of `clientSecret` | ✅ |
| `additionalScopes` | string[] | The additional scope for the provider | [] | ✅ |
| `genericProviderOidcKeys` | object | The keys that must be extracted from the provider response, only available for `generic` auth provider type |  | ✅ |

## Expose synchronization webhooks

If you want to control user creation and deletion from an external Identity Provider you can use the `enableUserSynchronizationWebhooks` configuration flag

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
|`enableUserSynchronizationWebhooks`| boolean | Activates webhooks for automatic user synchronization with external Identity providers |  | ✅ |

To know more about user synchronization with an Identity Provider, visit the [dedicated documentation page](/requirements/installation-guidelines/console/self-hosted/helm-values/26_synchronize-users-with-an-identity-provider.md).
