---
id: rbac_policies
title: Write RBAC Permissions
sidebar_label: RBAC Permissions
---

# Write RBAC Permission

RBAC Permission are expressed by OpenPolicy Agent policies, for this reason they must be written using the **Rego language**.

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

## Policies input data

In your policies you can use the rego `input` variable, that is structured as follows:

```json
{
  "request": {
    "method":  String,
    "path":    String,
    "headers": Object {
      String: Array[String]
    },
    "body": Object{},
    "pathParams": Object{},
    "queryParams": Object{},
    "query":   Object {
      String: Array[String]
    },
    "response": {
      "body": Object{}
    }
  },
  "user": {
    "properties": Object{
    "bindings": Object{}, 
    "roles":  Object{}
      // this object contains the user properties inserted by the
      // authorization service in the request user properties platform header 
    },
    "groups": Array[String],
  },
  "clientType": String
}
```

:::info
  `bindings` and `roles` object contain only data relative to the user that is making the request **if and only if** he his authenticated. Otherwise those two object will be present but empty. For the structure of the two object please refer to the [RBAC data models](./rbac#rbac-storage) section.
:::

## get_header Built-in function

:::caution
The **headers** keys are in written canonical form (i.e. "x-api-key" become "X-Api-Key"). 
:::

In order to read the headers in a case-insensitive mode, you can use our built-in function [`get_header`](#get_header-built-in-function)

Example usage:

```rego
output := get_header(headerKey: String, headers: Map[String]Array<String>) 
```

The function returns the first value present in the `headers` map at key `headerKey`. 
If `headerKey` doesn't exist the output returned is an empty string.

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

# Write RBAC Permission Tests

The Permission policy testing framework also leverages Open Policy Agent technology and so, n order to write valid tests, you have to write rego code (you can read more about it in the [Rego Testing documentation](https://www.openpolicyagent.org/docs/latest/policy-testing/).

An example of test written for the previous policy example can be:

```rego
package policies

test_api_key_allowed {
  api_key with input as {"request": {"headers": {"X-Api-Key": ["something"]}}}
}

test_api_key_not_allowed {
  not api_key with input as {"request": {"headers": {}}}
}`
```

:::caution
If any of your tests does not pass you won't be able to save your permissions changes! You may still exit the modal by clicking the close icon on the top right, however all changes done will be discarded.

It's still possible to save your permissions if you have no test implemented, however this is **NOT RECOMMENDED**!
:::
<br/>
