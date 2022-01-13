---
id: rbac_policies
title: Write RBAC Policies
sidebar_label: RBAC Policies
---

# Write RBAC Policies

RBAC Policies is expressed by OpenPolicy Agent policies, for this reason they must be written using the **Rego language**.

You can find all the details about it in the following links:

- [Rego Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Rego Reference](https://www.openpolicyagent.org/docs/latest/policy-reference/)

:::caution
All the policies of our RBAC must be written with the package **policies** (See further [examples below](#policy-examples)).
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
    "query":   Object {
      String: Array[String]
    },
  },
  "user": {
    "properties": Object{
      // this object contains the user properties inserted by the
      // authorization service in the request user properties platform header 
    },
    "groups": Array[String],
  },
  "clientType": String
}
```

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

The following examples show how to write a policy named **api_key**, that checks if the request contains the header **x-api-key**.
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

# Write RBAC Policies Tests

The policies testing framework also leverages Open Policy Agent technology and so, in order to write valid tests, you have to write rego code (you can read more about it in the [Rego Testing documentation](https://www.openpolicyagent.org/docs/latest/policy-testing/).

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
If any of your tests do not pass you won't be able to save your policies changes! You may still exit the modal by clicking the close icon on the top right, however all changes done will be discarded.

It's still possible to save your policies if you have no test implemented, however this is **NOT RECOMMENDED**!
:::
<br/>
