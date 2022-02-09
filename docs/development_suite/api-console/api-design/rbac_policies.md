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
`bindings` and `roles` object contain only data relative to the user that is making the request **if and only if** is authenticated. Otherwise those two object will be present but empty. For the structure of the two object please refer to the [RBAC data models](./rbac#rbac-storage) section.
:::

## Built-in functions

The OPA instance running your policies is provided with a set of built-in utility functions:

 * `get_header`
 * `find_one`

### get_header

The `get_header` built-in function can be used to extract headers from the `input.request.headers` map using case-insensitive strings.

The function returns the first value present in the `headers` map at key `headerKey`. 
If `headerKey` doesn't exist the output returned is an empty string.

Parameters:
 * `headerKey` (`String`): the key of the header to be retrieved;
 * `headers` (`Map[String]Array<String>`): the map of headers to be read (generally it would be `input.request.headers`).

Example usage:

```rego
output := get_header("x-api-key", input.request.headers)
```

:::caution
When you are using the Console RBAC Testing framework to test a policy using the `get_header` function make sure
that the **headers** keys are written in canonical form (i.e. instead of `x-api-key`, write: `X-Api-Key`).
:::


### find_one 

The `find_one` built-in function can be used to fetch data from a MongoDB collection, it accepts the collection name and a custom query and returns the document that matches the query using the `FindOne` MongoDB API.

Example usage to fetch a rider from the `riders` collection by using the rider identifier provided in the request path parameters:

```rego
riderId := input.request.pathParams.riderId
rider := find_one("riders", { "riderId": riderId })
rider.available == true
```

### find_many

The `find_many` built-in function can be used to fetch multiple data from a MongoDB collection, it accepts the collection name and a custom query and returns the documents that match the query using the `Find` MongoDB API.

Example usage to fetch a rider from the `riders` collection by using the rider identifier provided in the request path parameters:

```rego
riders := find_many("riders", { "available": true })
rider := riders[_]
rider.riderId == input.request.pathParams.riderId
```

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
}`
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
