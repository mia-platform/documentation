# Granular role-based access control

> This feature is not currently generally available, but is only available as a Closed Preview. For more information and to enable it on your Company, contact your Mia-Platform representative

This feature introduces a mechanism for managing user interactions within the application by restricting specific actions based on user roles and specified rules.

If a user try to save a configuration after performing some changes that are forbidden by the configured the rules, the saving is blocked and an error is returned.

*Rules* and *user roles* can be configured at both the Project and the Company levels.
The following logic is applied:

- **Rules**: project and company rules are combined together without conflict, as only disallow rules are used.  
- **User Roles**: If a user has roles assigned at the project level, only those roles are applied. If no project-level roles are assigned, the roles defined at the company level are used instead.

## Configuration definition

To enable this feature the `project` or `tenant` `configurationManagement.saveChangesRules` field of the configuration must be set with a list of objects with the following structure:

| Field               | Type        | Description                                   | Optional |
| ------------------- | ----------- | --------------------------------------------- | -------- |
| `disallowedRuleSet` | `RuleSet[]` | list of rules that prohibit a specific action | ❌       |
| `roleIds`           | `String[]`  | List of user roles to which the rules apply   | ❌       |

The `RuleSet` object has these fields:

| Field               | Type               | Description                                                     | Optional |
| ------------------- | ------------------ | --------------------------------------------------------------- | -------- |
| `jsonPath`          | `String`           | JSONPath of the resource on which the action must be prevented. | ✅       |
| `processingOptions` | `ProcessingOption` | Additional options of the rule                                  | ✅       |
| `ruleId`            | `String`           | Reference a to a rule from a predefined set                     | ✅       |

___
A `disallowedRuleSet` can be configured in 3 ways:

- [Via `jsonPath`](#via-jsonpath)
- [Via `jsonPath` and `processingOptions`](#via-jsonpath-and-processingoptions)
- [Via `ruleId`](#via-ruleid)

### Via `jsonPath`

The `jsonPath` field is used to extract the target resource. On this resource the edit operation is prevented.

### Via `jsonPath` and `processingOptions`

- The `jsonPath` is used to extract the target resource.
- The `processingOptions` define the `action` (`create`, `delete`) to prevent on the resource. If the resource captured by the jsonPath are of array type, the field `primaryKey` must be specified.

The `ProcessingOption` object has the following structure:

| Field        | Type       | Description                                                                                          | Optional |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------- | -------- |
| `action`     | `string[]` | Action to be prevented on the resource defined via the jsonPath. Possible values: `create`, `delete` | ❌       |
| `primaryKey` | `String`   | Primary key of the resource captured by the jsonPath. Mandatory if resource is of array type         | ✅       |

### Via `ruleId`

The `ruleId` references a rule from a predefined set of rules, that define a specific behavior.

**The available `ruleIds` are**:

| `ruleId`                  | Description                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `endpoints.security.edit` | block edit of the fields [`public`, `acl`, `secreted`] of `endpoints` and `routes` inside endpoints |
|                           |                                                                                                     |

## Configuring Rules Via API

### Updating rules on a Project

The API for updating the rules on a Project is defined as follows

> **NOTE**  
> This API is meant for internal use and will be subject to breaking changes.
>

#### Request

- verb: `PATCH`
- path: `/api/backend/projects/:projectId/rules`

**Authentication required**

##### Body

The **body** of the request has the structure described in [Configuration definition](#configuration-definition)

### Updating rules on a Company

The API for updating the rules on a Companty is defined as follows.

> **NOTE**  
> This API is meant for internal use and will be subject to breaking changes.
>

#### Request

- verb: `PATCH`
- path: `/api/backend/tenants/:tenantId/rules`

**Authentication required**

##### Body

The **body** of the request the structure described in [Configuration definition](#configuration-definition)

### Examples

Here are some examples of request bodies for updating Project or Company rules (the body is the same for the two API)

Prevent edit of the `dockerImage` of all services to the role `maintainer`

```json
{
    "configurationManagement": {
        "saveChangesRules": [
            {
                "disallowedRuleSet": [
                    {
                        "jsonPath": "$.services.*.dockerImage"
                    },
                ],
                "roleIds": [
                    "maintainer"
                ]
            }
        ]
    }
}
```

Prevent creation of the resource `secrets` to the role `maintainer`

```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "disallowedRuleSet": [
          {
            "jsonPath": "$.collections",
            "processingOptions": {
              "action": "create"
            }
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```

Through jsonpath syntax, more complex rules can be configured. The following rule for example prevent the creation of a services of a specific type (`custom-resource`) to the role `maintainer`

```json
{
  "configurationManagement": {
    "saveChangesRules": [
      {
        "disallowedRuleSet": [
          {
            "jsonPath": "$.services.[?(@.type==\"cursom-resource\")]",
            "processingOptions": { "action": "create" }
          }
        ],
        "roleIds": ["maintainer"]
      }
    ]
  }
}
```

Configure the predefined rule with `ruleId` "endpoints.security.edit" to the role `maintainer`

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
