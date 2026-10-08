---
id: mia_platform
title: Mia Platform
sidebar_label: Mia platform
---



## Events

### User created on Identity Provider - Okta
`event: okta.create.user`

On this event the `mia console` provider will proxy the Okta event hook to the console endpoint used to synchronize the console with the identity provider used.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "appId": { "type": "string" }, // appId on the console. Value should be "console"
        "appProviderId": { "type": "string" }, // providerId on the console. Value should be "okta"
    },
    "required": [
        "providerId",
        "appId",
        "appProviderId",
        ]
}

```

### User deleted from Identity Provider - Okta
`event: okta.delete.user`

On this event the `mia console` provider will proxy the Okta event hook to the console endpoint used to synchronize the console with the identity provider used.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "appId": { "type": "string" }, // appId on the console. Value should be "console"
        "appProviderId": { "type": "string" }, // providerId on the console. Value should be "okta"
    },
    "required": [
        "providerId",
        "appId",
        "appProviderId",
        ]
}

```

## Configuration
`type: mia_console`

The `configuration` object for is defined by the following JSON schema:

```jsonc
{
    "type": "object",
    "properties": {
        "consoleUrl": { "type": "string" }, // url to Mia Platform Console
        "clientId": { "type": "string" }, // client ID of the service account used to interact with the console
        "privateKeyPath": { "type": "string" }, // path to the PEM file with the prive key
        "passphrase": { "type": "string" }, // is present is used to read the private key file
        "kid": { "type": "string" }, // kid related to the service account used to interact with the console
        "jwtExpirationTimeInSec": { "type": "string" }, // jwt expiration time in second use on the jwt claim
    },
    "required": [
        "consoleUrl",
        "clientId",
        "privateKeyPath",
        "kid", 
        "jwtExpirationTimeInSec"
        ]
}

```
