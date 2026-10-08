---
id: events
title: Events
sidebar_label: Events
---



Every API exposed by the service is related to an event occurred on either Mia Platform Console or another tool. 
The following events are currently available. 

| event                          | console | okta | gitlab | github |
|:-------------------------------|:--------|:-----|:-------|:-------|
| console.update.user.permission |         | ✓    | ✓      | ✓      |
| console.create.project         |         | ✓    |        |        |
| okta.create.user               | ✓       |      | ✓      |        |
| okta.delete.user               | ✓       |      | ✓      | ✓      |
| okta.verify.email              |         |      |        |        |

## User creation on Identity Provider - Okta
`event: user.lifecycle.activate`

`endpoint: POST /okta/create/user`

When a user is created on Okta this endpoint can intercept the event hook from Okta.
Are accepted only events with Okta event type `user.lifecycle.delete.initiated`.

### Requirements
 No requirements are needed for this event.

## Update user permission on Mia Console
`event: console.update.user.permission`

`endpoint: POST /console/update/user/permissions`

When a user permission is updated this endpoint can intercept the webhook from Mia Platform Console.

### Requirements

In order to validate the rule are needed the minimum permissions that the user needs to have. 

Below you can find the JSON schema used to configure this requirement.

```jsonc
{
    "type": "object",
    "properties": {
        "necessaryPermissions": { 
            "type": "array",
            "items": {
                "type": "string"
                }
        }, // List of permissions on Mia Platform Console
    },
    "required": [
        "necessaryPermissions",
        ]
}

```
## User creation on Identity Provider - Okta
`event: okta.delete.user`

`endpoint: POST /okta/delete/user`

When a user is deleted on Okta this endpoint can intercept the event hook from Okta.
Are accepted only events with Okta event type `user.lifecycle.delete.initiated`.

### Requirements
No requirements are needed for this event.

## Verify Email - Okta
`event: okta.verify.email`

`endpoint: POST /okta/verify/email`

It is possible to use this endpoint to verify if the email of the user is one of the domains allowed.
No actions are performed related to this event, that means providers will not be called.

Below you can find the JSON schema of the response:


```jsonc
{
    "type": "object",
    "properties": {
        "commands": { 
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                        "type": {"type": "string"} // static value com.okta.user.profile.update,
                        "value": {
                            "type": "object",
                            "properties": {
                                    "login": {"type": "string"}
                                }
                        }
                    }
                }
        }, 
    },
}

```

### Requirements
In order to validate the rule are needed the minimum permissions that the user needs to have.

Below you can find the JSON schema used to configure this requirement.

```jsonc
{
    "type": "object",
    "properties": {
        "allowedDomains": { 
            "type": "array",
            "items": {
                "type": "string"
                }
        }, // List of domains allowed
    },
    "required": [
        "allowedDomains",
        ]
}

```
