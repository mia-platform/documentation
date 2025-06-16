--- 
id: fine-grained-access-control
title: Fine-Grained Access Control in Design
sidebar_label: Fine-Grained Access Control
---

# Fine-Grained Access Control in Design

:::info
This feature is currently available exclusively as a **Closed Preview** and is not yet generally available. For more information and to request its activation for your Company, please contact your Mia-Platform referent.
:::

This feature introduces a mechanism for managing user interactions within the application by restricting specific actions based on user roles and specified rules in the Design section.

If a user attempts to save a configuration after performing some changes that are forbidden by the configured rules, the saving is blocked and an error is returned.

*Rules* and *user roles* can be configured at both the Project and the Company levels.
The following logic is applied:

**Rules:**  
Project and Company rules are combined together. Both allow and disallow rules can be used.  
- Allow rules (`allowedRuleSet`) start from a default state where no action is permitted. This means that only actions explicitly allowed by the rules are permitted; all other actions are denied.  
- Disallow rules (`disallowedRuleSet`) start from a default state where all actions are permitted. In this case, only actions explicitly disallowed by the rules are denied; all other actions are allowed.  

When evaluating rules, disallow rules are always checked first. If a violation in a disallow rule is found, the allow rules are not evaluated for that action.

**User Roles:**  
If a user has roles assigned at the Project level, only those roles are used to find the applicable rules. If no Project-level roles are assigned, the roles defined at the Company level are used instead.

## Configuration definition

To enable this feature the `Project` or `Company` `configurationManagement.saveChangesRules` field of the configuration must be set with a list of objects with the following structure:

| Field               | Type        | Description                                   | Optional |
| ------------------- | ----------- | --------------------------------------------- | -------- |
| `disallowedRuleSet` | `RuleSet[]` | list of rules that prohibit a specific action | See note |
| `allowedRuleSet`    | `RuleSet[]` | list of rules that allow a specific action    | See note |
| `roleIds`           | `String[]`  | List of user roles to which the rules apply   | ❌       |

> **Note:**  
> At least one of `disallowedRuleSet` or `allowedRuleSet` must be specified. You can provide either or both these fields.

The `RuleSet` object has these fields:

| Field               | Type               | Description                                                     | Optional |
| ------------------- | ------------------ | --------------------------------------------------------------- | -------- |
| `jsonPath`          | `String`           | JSONPath of the resource on which the action must be controlled.| ✅       |
| `processingOptions` | `ProcessingOption` | Additional options of the rule                                  | ✅       |
| `ruleId`            | `String`           | Reference to a rule from a predefined set                       | ✅       |

___
A `RuleSet` can be configured in 3 ways, and these apply to both `allowedRuleSet` and `disallowedRuleSet`:

- [Via `jsonPath`](#via-jsonpath)
- [Via `jsonPath` and `processingOptions`](#via-jsonpath-and-processingoptions)
- [Via `ruleId`](#via-ruleid)

### Via `jsonPath`

The `jsonPath` field is used to extract a target resource by applying a JSONPath expression on the JSON structure of the configuration. The rule will control (allow or disallow) any updates on the extracted resource, depending on whether it is in the `allowedRuleSet` or `disallowedRuleSet`.

### Via `jsonPath` and `processingOptions`

- The `jsonPath` is used to extract the target resource.
- The `processingOptions` define the `actions` (`create`, `delete`, or both) to allow or prevent on the resource. If the resource captured by the jsonPath is of array type, the field `primaryKey` must be specified.

The `ProcessingOption` object has the following structure:

| Field        | Type         | Description                                                                                              | Optional |
| ------------ | ------------ | -------------------------------------------------------------------------------------------------------- | -------- |
| `actions`    | `string[]`   | Actions to be controlled on the resource defined via the jsonPath. Possible values: `create`, `delete`. You can specify more than one action in the array. | ❌       |
| `primaryKey` | `String`     | Primary key of the resource captured by the jsonPath. Mandatory if resource is of array type             | ✅       |

> **Note:**  
> The `actions` field replaces the previous `action` field and must be an array. You can specify multiple actions to be controlled by the rule.

### Via `ruleId`

The `ruleId` references a rule from a predefined set of rules, that define a specific behavior.

**The available `ruleIds` are**:

| `ruleId`                  | Description                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `endpoints.security.edit` | Controls edit of the fields [`public`, `acl`, `secreted`] of `endpoints` and `routes` inside endpoints |

## Examples of allow and disallow rules

Below are examples of request bodies for the Update Rules API. The request body format is identical for both the Update Project and Update Company APIs.  
Each example is shown for both `allowedRuleSet` (to explicitly allow an action) and `disallowedRuleSet` (to explicitly disallow an action).

- **Control edit of the `dockerImage` of all services for the role `maintainer`**

_Disallow: prevent editing_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "disallowedRuleSet": [
          {
            "jsonPath": "$.services.*.dockerImage"
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```
_Allow: only allow editing_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "allowedRuleSet": [
          {
            "jsonPath": "$.services.*.dockerImage"
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```

- **Control creation of the resource `collections` for the role `maintainer`**

_Disallow: prevent creation and deletion_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "disallowedRuleSet": [
          {
            "jsonPath": "$.collections",
            "processingOptions": {
              "actions": ["create", "delete"]
            }
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```
_Allow: only allow creation and deletion_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "allowedRuleSet": [
          {
            "jsonPath": "$.collections",
            "processingOptions": {
              "actions": ["create", "delete"]
            }
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```

- **Control creation of services of a specific type (`custom-resource`) for the role `maintainer`**

_Disallow: prevent creation and deletion_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "disallowedRuleSet": [
          {
            "jsonPath": "$.services.[?(@.type==\"custom-resource\")]",
            "processingOptions": { "actions": ["create", "delete"] }
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```
_Allow: only allow creation and deletion_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "allowedRuleSet": [
          {
            "jsonPath": "$.services.[?(@.type==\"custom-resource\")]",
            "processingOptions": { "actions": ["create", "delete"] }
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```

- **Configure the predefined rule with `ruleId` "endpoints.security.edit" for the role `maintainer`**

_Disallow: prevent edit_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "disallowedRuleSet": [
          {
            "ruleId": "endpoints.security.edit"
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```
_Allow: only allow edit_
```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "allowedRuleSet": [
          {
            "ruleId": "endpoints.security.edit"
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```

> **Note:**  
> When using only `allowedRuleSet`, all actions are denied except those explicitly allowed.  
> When using only `disallowedRuleSet`, all actions are allowed except those explicitly disallowed.  
> If both are specified, disallow rules take precedence: if a disallow rule violation is found, allow rules are not evaluated for that action.

## Fetching and configuring rules with `miactl`

:::tip
The following commands are available from [miactl v0.16.0](https://github.com/mia-platform/miactl/releases/tag/v0.16.0), make sure you upgrade.

For the full command specification, please refer to the [related miactl documentation](/cli/miactl/30_commands.md#rules).
:::

Command examples:

```bash
miactl company rules list --company-id=my-company
miactl company rules list --company-id=my-company --project-id=my-project
miactl company rules update --company-id=my-company  -f ~/my-rules.json
miactl company rules update --company-id=my-company --project-id=my-project  -f ~/my-rules.json
```

## Configuring rules via API

### Updating rules on a Project

The API for updating the rules on a Project is defined as follows

:::caution
This API is meant for internal use and will be subject to breaking changes.
:::

#### Request

- verb: `PATCH`
- path: `/api/backend/projects/:projectId/rules`

##### Security

| Security                | Check                           |
|-------------------------|---------------------------------|
| Authentication required | ✅                              |
| RBAC permissions        | console.company.details.update  |

##### Body

The **body** of the request has the structure described in [Configuration definition](#configuration-definition)

### Updating rules on a Company

The API for updating the rules on a Company is defined as follows.

:::caution
This API is meant for internal use and will be subject to breaking changes.
:::

#### Request

- verb: `PATCH`
- path: `/api/backend/tenants/:tenantId/rules`

##### Security

| Security                | Check                           |
|-------------------------|---------------------------------|
| Authentication required | ✅                              |
| RBAC permissions        | console.company.details.update  |

##### Body

The **body** of the request the structure described in [Configuration definition](#configuration-definition)
