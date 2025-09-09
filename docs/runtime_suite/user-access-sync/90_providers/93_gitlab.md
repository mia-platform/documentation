---
id: gitlab
title: Gitlab
sidebar_label: Gitlab
---



## Events

### User created on Identity Provider - Okta
`event: okta.create.user`

On this event the *middleware* will create a new user on Gitlab.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "external": { "type": "boolean" }, // Define wether the user will be created as an external one or not
        "skipConfirmation": { "type": "boolean" }, // Define wether skip the confirmation or not
        "forceRandomPassword": { "type": "boolean" }, // Define wether force a random password or not
    },
    "required": [
        "providerId",
        "external",
        "skipConfirmation",
        "forceRandomPassword",
        ]
}

```
### Update user permission on Mia Console
`event: console.update.user.permission`

On *gitlabGroups* field are listed the groups to which the user should be included if the minimum permissions are fulfilled, so that:
- if the rules is verified, the middleware adds the user to the groups listed
- otherwise:
  - if the user has a role greater than or equal to that defined in the rule, the user is removed from the group
  - otherwise, nothing gets done

For each group the following information are needed:
- *name*: name of the group
- *role*: [Gitlab role](https://docs.gitlab.com/ee/api/members.html#roles) to assign to the user. 

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
        "gitlabGroups": {
         "type": "array",
         "items": {
            "type": "object",
            "properties": {
                "name": { "type": "string" }, 
                "role": { "type": "string" }
            },
            "required": [
                "name",
                "role",
                ]
         }, 
    },
    "required": [
        "providerId",
        "gitlabGroups",
        ]
}

```

### User deleted on Identity Provider - Okta
`event: okta.delete.user`

On this event the *middleware* will delete the user from Gitlab.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "isActive": { "type": "boolean" }, // Define wether this rule is active or not
    },
    "required": [
        "providerId",
        "isActive",
        ]
}

```

## Configuration
`type: gitlab`

In the configuration for the Okta provider you can choose how to authenticate to Gitlab based on the value of `authorizationMode` field.
`authorizationMode` accepts the following values:
- NONE: No authorization is used. The `configuration` object for is defined by the following JSON schema:

```jsonc
{
    "type": "object",
    "properties": {
        "gitlabUrl": { "type": "string" }, // url to Gitlab
        "authorizationMode": { "type": "string" }, // authorization mode used to authenticate with Gitlab
       },
    "required": [
        "gitlabUrl",
        "authorizationMode"
       ]
}

```
- ACCESS_TOKEN: an access token is used to authenticate to Gitlab. The `configuration` object for is defined by the following JSON schema:
```jsonc
{
    "type": "object",
    "properties": {
        "gitlabUrl": { "type": "string" }, // url to Gitlab
        "authorizationMode": { "type": "string" }, // authorization mode used to authenticate with Gitlab
        "accessToken": { "type": "string" }, // access token 
    },
    "required": [
        "gitlabUrl", 
        "authorizationMode", 
        "accessToken"
        ]
}

```
