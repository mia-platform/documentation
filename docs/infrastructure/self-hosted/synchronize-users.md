---
id: synchronize-users
title: Synchronize users with an Identity Provider
sidebar_label: Synchronize Users
---

The Console uses external Identity Providers to manage user identities and authentication; configuration details can be found in the Console Installation documentation section dedicated to the [Authentication Provider](./installation-chart/30-authentication-provider.md#supported-authentication-providers).

The list of supported providers is:

  - Okta
  - Keycloak
  - GitLab
  - GitHub
  - Microsoft
  - Bitbucket

# How to setup user synchronization

If you want to synchronize users between the Identity Provider and the Console, making it possible to automatically create or delete users in the Console when you create or delete them on your Identity Provider, you can use the following webhook:

```sh
POST /api/webhooks/apps/console/providers/:providerId/user
```

Where `providerId` must be set based on the [`authProvider.name` configuration field](./installation-chart/30-authentication-provider.md#configure-your-authentication-provider) set in the installation chart

:::info
Webhooks **are not** exposed by default, to make them available check-out [user synchronization activation flag](./installation-chart/30-authentication-provider.md#expose-synchronization-webhooks).
:::

:::caution
User synchronization is officially supported only for [Okta OIE](https://developer.okta.com/docs/concepts/oie-intro/).

To find out more about Event Hooks and how to configure them check out the [official documentation page](https://developer.okta.com/docs/concepts/event-hooks/).
:::
