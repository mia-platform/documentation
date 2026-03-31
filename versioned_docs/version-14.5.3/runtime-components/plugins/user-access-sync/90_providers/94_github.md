---
id: github
title: Github
sidebar_label: Github
---



## Events

### User created on Identity Provider - Okta
`event: okta.create.user`

On *organizations* field are listed the GitHub organizations to which the user should be included if the minimum permissions are fulfilled.
On *teams* field are listed the GitHub teams to which the user should be included if the minimum permissions are fulfilled.
For each organization/team:
- if the rules is verified, the middleware adds the user to the organizations/teams listed
- otherwise:
    - if the user has a role greater than or equal to that defined in the rule, the user is removed from the organizations/teams
    - otherwise, nothing gets done

For each group the following information are needed:
- *name*: name of the organizations/teams
- *role*: [Gitlab role](https://docs.gitlab.com/ee/api/members.html#roles) to assign to the user.

You can use handlebars to add dynamics values to your organizations/teams. The following values are handled:
- `{{companyId}}` will be replaced with the company ID related to the event.
- `{{projectId}}` will be replaced with the project ID related to the event.
- `{{environmentId}}` will be replaced with the environment ID related to the event.

Below you can find the JSON schema related to the action used to configure this action.

```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "organizations": {
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
         "teams": {
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
        ]
}

```

### User deleted on Identity Provider - Okta
`event: okta.delete.user`

On this event the *middleware* will block the user from a GitHub organization.
You can use handlebars to add dynamics values to your organizations. The following values are handled:
- `{{companyId}}` will be replaced with the company ID related to the event.
- `{{projectId}}` will be replaced with the project ID related to the event.
- `{{environmentId}}` will be replaced with the environment ID related to the event.

Below you can find the JSON schema related to the action used to configure this action.
```jsonc
{
    "type": "object",
    "properties": {
        "providerId": { "type": "string" }, 
        "organizations": {
             "type": "array",
             "items": {
                "type": "object",
                "properties": {
                    "name": { "type": "string" }
                },
                "required": [
                    "name"
                    ]
             }
    },
    "required": [
        "providerId",
        "organizations",
        ]
}

```

## Configuration
`type: github`

The `configuration` object for is defined by the following JSON schema:

```jsonc
{
    "type": "object",
    "properties": {
        "githubUrl": { "type": "string" }, // url to GitHub
        "appId": { "type": "string" }, // app Id used to authenticate with GitHub
        "privateKeyPath": { "type": "string" }, // Path to the PEM file with the private key use to authenticate with GitHub
        "tokenExpirationTimeInSec": { "type": "string" }, // Time before token expiration in seconds
        "installationId": { "type": "string" }, // Installation ID used to authenticate with GitHub
       },
    "required": [
        "githubUrl",
        "appId",
        "privateKeyPath",
        "tokenExpirationTimeInSec",
        "installationId",
       ]
}

```

For more information on GitHub authentication you can refer to the [official documentation](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app).
