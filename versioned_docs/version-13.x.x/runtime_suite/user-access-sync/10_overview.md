---
id: overview
title: Overview
sidebar_label: Overview
---



The *User Access Sync* allows to intercept webhook, from both Mia Platform and other infrastructure tools, and perform some configurable actions.
This service could be useful to automatize action that otherwise DevOps team should do by hand.

## How it Works

Once the *User Access Sync* receive a webhook it performs the following actions:
1. it loads all the *rules* configured from the database
2. it verifies which rules match with the actual context or *scope*
3. it performs actions on external tools or *providers*

### Basic Concepts

#### Providers
A provider is a tool that the *User Access Sync* can interact with.
Some example of providers are:
- Mia Platform
- Okta
- Gitlab
- Github

#### Rule
All rules are stored on a database.
A rule is composed by:
- *Id*: unique identifier
- *Description*: (optional) a description for the rule
- *Requirements*: object with information needed to defined if the rule is matched or not
- *Scope*: an object with information on how to use the current rule:
    - *Event*: identifier of the event for which use the current rule
    - *Use Always*: a boolean to define if the current rule has to be used every time the **event** is received by the *User Access Sync*, if false the following fields will be used to filter rules
    - *Evaluate For Each Environment*: a boolean to define if the rule has to be evaluated differently for each scope
    - *Is Production*: (optional) a boolean to define if the rule has to be evaluated if the environment is a production environment or not. Considered only if *Evaluate For Each Environment* flag is true.
    - *Company Ids*: a list of company ids for which the current rule has to be applied; ignored if *useAlways* flag is *true*
    - *Project Ids*: a list of project ids for which the current rule has to be applied; ignored if *useAlways* flag is *true*
- *Actions*: a list of objects with information needed to perform action on a specific provider; the information required by the action can be different between providers. The following fields are in common and required by all actions:
    - *Provider Id*: identifier for the provider related to the action; this has to match with the id used in the *provider configuration file*
```jsonc
{
    "type": "object",
    "properties": {
        "id": { "type": "string" },
        "description": { "type": "string" },
        "scope": { 
            "type": "object",
            "properties": {
                "event": {"type": "string"},
                "userAlways": {"type": "boolean"},
                "evaluateForEachEnvironment": {"type": "boolean"},
                "isProduction": {"type": "boolean"},
                "companyIds": { 
                    "type": "array",
                    "items": { "type": "string"}
                },
                "projectIds": { 
                    "type": "array",
                    "items": { "type": "string"}
                },
            },
            "required": ["useAlways", "event"]
        },
        "requirements": { 
            "type": "object",
        },
        "actions": { 
            "type": "array",
            "items": { "type": "object" }
        },
    },
    "required": ["id", "scope", "requirements", "actions"]
}

```


### Logging
At the end of each action and for each provider you can find a log in the following format to keep track of the outcome of each action:
```jsonc
{
    "type": "object",
    "properties": {
        "message": { "type": "string" },
        "summary": {
          "type": "object",
          "properties": {
            "providerId":  { "type": "string" },
            "event":  { "type": "string" },
            "ruleId":  { "type": "string" },
            "status":  { "type": "string" }, // either "completed" or "failed"
            "details": {
              "type": "object",
              "properties": {
                "action" :  { "type": "string" },
                "status":  { "type": "string" },
                "message":  { "type": "string" },
                "httpEndpoint":  { "type": "string" },
                "httpMethod":  { "type": "string" },
                "details":  { "type": "object" }, // optional futher information related to the action
              }
            }
          }
        }
      
    },
    "required": ["message", "summary"]
}
```
