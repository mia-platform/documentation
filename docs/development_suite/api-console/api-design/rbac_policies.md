---
id: rbac_policies
title: Write RBAC Policies
sidebar_label: RBAC Policies
---

# Write RBAC Policies

RBAC Policies are expressed by OpenPolicy Agent policies, for this reason they must be written using the **Rego language**.

You can find all the details about it in the following links:

- [Rego Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Rego Reference](https://www.openpolicyagent.org/docs/latest/policy-reference/)

:::caution
All the policies of our rbac must be written with the package **policies** (See further [examples below](#policy-examples)).
:::

```rego
package policies

...
```

For more information on how to write a policy please checkout the [official Rönd documentation](https://rond-authz.io/docs/policy-integration)
## Policy examples

The following examples shows how to write a policy on the permission **api_key**, that checks if the request contains the header **x-api-key**.\
In the first example it uses the headers key of input.request as a map, whereas in the second example it uses the build-in function.

```rego
package policies

default api_key = false

api_key {
  count(input.request.headers["X-Api-Key"]) != 0
}
```

```rego
package policies

default api_key = false
api_key {
  get_header("x-api-key", input.request.headers) != ""
}
```

:::info
You may want to use a `.` character when defining your **allow** `x-permission` to specify a namespace for your permissions (i.e. `dishes.read`, `dishes.write`); however since the `.` character is not supported by Rego as policy name it will be automatically replaced with an `_` by the RBAC Service.
:::

For a more complete cheatsheet please checkout [Rönd documentation](https://rond-authz.io/docs/cheat-sheet) or if you want to have a deep dive into a real example follow the [guided example](https://github.com/rond-authz/example). 

# Write RBAC Policies Tests

The Permission policy testing framework also leverages Open Policy Agent technology and so, in order to write valid tests, 
you have to write rego code (you can read more about it in the [Rego Testing documentation](https://www.openpolicyagent.org/docs/latest/policy-testing/).

## Test Simple Policy

An example of test written for the previous policy example can be:

```rego
package policies

test_api_key_allowed {
  api_key with input as {"request": {"headers": {"X-Api-Key": ["something"]}}}
}

test_api_key_not_allowed {
  not api_key with input as {"request": {"headers": {}}}
}
```

:::caution
If any of your tests does not pass you won't be able to save your permissions changes! 
You may still exit the modal by clicking the close icon on the top right, however all changes done will be discarded.

It's still possible to save your permissions if you have no test implemented, however this is **NOT RECOMMENDED**!
:::

## Test Filters Policy

To test filter policies you will have to mock in addition to the `input` also the `data.resources`

```rego
filter_projects_example {
    bindings := input.user.bindings[_]
    resource := data.resources[_]
    resource._id == bindings.resource.resourceId
}
```

An example of test written for the previous policy example can be:
```rego
test_filter_projects_example {
    filter_projects_example
        with input as {
            "user": {
                "bindings": bindings_mock,
                "roles": roles_mock
            }
        }
        with data.resources as [
          {"_id": "resource1"}, 
          {"_id": "resource2"}
        ]
}
```
<br/>
