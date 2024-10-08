---
id: how_to_use
title: How to use
sidebar_label: How to use
---
## Rule

All the rules managed through the *rule service* are stored on a database with the following schema:
```jsonc
{
    "ruleId": { "type": "string" },
    "priority": { "type": "number" },
    "type": { "type": "string" },
    "rules": { 
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "key": { "type": "string" },
                "operator": { "type": "string" },
                "value": { "type": "object" },
            }
        }
    },
    "response": { "type": "object" }
}
```

Where:
- `ruleId` is a unique identifier for the rule item
- `priority` is used to sort rules
- `type` is a label used to group rules
- `rules` is the list of conditions that have to match in order to verify the rule
- `response` is the data returned when the rule is matched

Each condition have the following fields:
- `key` is the path to the field used to validate the condition, e.g. "/path/to/field"
- `operator` defines which type of operation to verify; it can be one of the following values:
  - `equals`
  - `not_equals`
  - `in`
  - `not_in`
  - `greater_than`
  - `greater_or_equal_than`
  - `less_than`
  - `less_or_equal_than`
- `value` is the value to use to verify the condition: the value must be consistent with the `operator` used.

### Manage rules

To manage your rules the following endpoints are available:
- `POST /rule` Used to create a new rule. The request body is the same as the rule schema describe above.
- `PATCH /rule/{ruleId}` Used to update a rule based on the `ruleId`. The request body contains the rule fields to update following the rule schema describe above.
- `DELETE /rule/{ruleId}` Used to delete a rule based on the `ruleId`.

### Check rule

Using the `POST /check` endpoint you can use the *rule service* to verify if your data match some of the rules defined. 
When this endpoint is called, the service performs the following steps:
1. load rules from the database with the same `type` defined in the request body
2. sort the rules by the `priority` field in descending order
3. compares the payload with the rules found
4. returns the data defined in the first verified rule; if no rule is verified then a 404 is returned
