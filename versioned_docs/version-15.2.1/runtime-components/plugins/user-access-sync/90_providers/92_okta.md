---
id: okta
title: Okta
sidebar_label: Okta
---



## Events

### Update user permission on Mia Console
`event: console.update.user.permission`

On groups are listed the okta groups to which the user should be included if the minimum permissions are fulfilled, so that:
- if the rules is verified, the middleware adds the user to the groups listed
- otherwise the middleware removes the user from the groups listed

You can use handlebars to add dynamics values to your groups. The following values are handled:
- `{{companyId}}` will be replaced with the company ID related to the event.
- `{{projectId}}` will be replaced with the project ID related to the event.
- `{{environmentId}}` will be replaced with the environment ID related to the event.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "groups": { 
            "type": "array",
            "items": {
                "type": "string"
                }
        }, // List of Okta groups
    },
    "required": [
        "providerId",
        "groups",
        ]
}

```

### Create a new project on Mia Console
`event: console.create.project`
On groups are listed the okta groups to which the user should be included if the minimum permissions are fulfilled, so that:
- if the rules is verified, the middleware adds the user to the groups listed
- otherwise the middleware removes the user from the groups listed

You can use handlebars to add dynamics values to your groups. The following values are handled:
- `{{companyId}}` will be replaced with the company ID related to the event.
- `{{projectId}}` will be replaced with the project ID related to the event.
- `{{environmentId}}` will be replaced with the environment ID related to the event.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "groups": { 
            "type": "array",
            "items": {
                "type": "string"
                }
        }, // List of Okta groups
    },
    "required": [
        "providerId",
        "groups",
        ]
}

```

## Configuration
`type: okta`

In the configuration for the Okta provider you can choose how to authenticate to Okta based on the value of `authorizationMode` field.
`authorizationMode` accepts the following values:
- NONE: No authorization is used. The `configuration` object for is defined by the following JSON schema:

```jsonc
{
    "type": "object",
    "properties": {
        "oktaUrl": { "type": "string" }, // url to Mia Platform Console
        "authorizationMode": { "type": "string" }, // authorization mode used to authenticate with okta
       },
    "required": ["oktaUrl", "authorizationMode"]
}

```
- SWSS: a SWSS token is used to authenticate to Okta. The `configuration` object for is defined by the following JSON schema:
```jsonc
{
    "type": "object",
    "properties": {
    "oktaUrl": { "type": "string" }, // url to Mia Platform Console
    "authorizationMode": { "type": "string" }, // authorization mode used to authenticate with okta
    "sswsSecret": { "type": "string" }, // SWSS secret
        },
    "required": ["oktaUrl", "authorizationMode", "sswsSecret"]
}

```
- OAUTH2: The `configuration` object for is defined by the following JSON schema:
```jsonc
{
    "type": "object",
    "properties": {
    "oktaUrl": { "type": "string" }, // url to Mia Platform Console
    "authorizationMode": { "type": "string" }, // authorization mode used to authenticate with okta
    "privateKeyPath": { "type": "string" }, // Path to the file with private key used to authenticate with okta
    "clientId": { "type": "string" }, // client ID used to authenticate with okta
    "jwtExpirationTimeInSec": { "type": "string" }, // jwt expiration time in second use on the jwt claim
        },
    "required": ["oktaUrl", "authorizationMode", "privateKeyPath", "clientId", "jwtExpirationTimeInSec"]
}

```

For more information on how authentication works with Okta provider you can refer to the [official documentation](https://developer.okta.com/).
