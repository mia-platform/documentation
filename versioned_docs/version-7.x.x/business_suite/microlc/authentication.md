---
id: authentication
title: Authentication
sidebar_label: Authentication
---

## Authentication configuration

The endpoint that expose the authentication configuration is `/api/v1/microlc/authentication`.

### Configuration structure

The authentication configuration is a JSON object with two root properties which defines if the authentication process is expected
and where the user information are provided.

### isAuthNecessary

- *type*: boolean
- *required*: `false`
- *default*: `false`
- *description*: defines if the authentication process is expected.  
  This property can be used to avoid the authentication process or to make a public instance of `micro-lc`.

### userInfoUrl

- *type*: string
- *required*: `false`
- *description*: defines which endpoint expose the user information: it will be called using the `GET` method.  
  If authentication is not expected, this should not be provided, otherwise is mandatory.

### userLogoutUrl

- *type*: string
- *required*: `false`
- *description*: defines the page that will handle the user logout.  
  If authentication is not expected, this should not be provided, otherwise is mandatory.


### Example

```json
{
    "isAuthNecessary": true,
    "userInfoUrl": "https://example.com/your/authentication/api",
    "userLogoutUrl": "https://example.com/your/logout/page"
}
```

## User authentication

The authentication process is optional and completely configurable: 
the first endpoint called is the [authentication](authentication.md#authentication-configuration) one, that expose the authentication configuration.

If authentication isn't necessary ([`isAuthNecessary = false`](authentication.md#isauthnecessary)), 
then only the [configuration](core_configuration.md) endpoint is called.

If authentication is required ([`isAuthNecessary = true`](authentication.md#isauthnecessary)),
then the endpoint provided in the [userInfoUrl](authentication.md#userinfourl) is called,
in parallel with the [configuration](core_configuration.md) one.

The entire flow can be summarized with the following picture:

![Authentication flow](../img/microlc_auth_process.png)

## Plugin ACL

Each plugin can optionally adhere to an *ACL*,
that can be defined using the [`aclExpression`](core_configuration.md#aclexpression) configuration.

:::info
To evaluate, in the `aclExpression` is injected the `groups` object, take from the current user profiles (i.e. `groups.admin && groups.ceo`) 
:::

The match between the `aclExpression` and the current user profiles is made by **be-config**,
which must receive them in a header whose name can be customized in **be-config** instance thanks to the environment variable `GROUPS_HEADER_KEY`.

The only supported separator for the profiles injected in header is the comma `,` (i.e. `admin,developer,owner`).

:::warning
`micro-lc` doesn't inject any header: they must be provided using external services.
:::
