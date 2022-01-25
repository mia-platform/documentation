---
id: rbac_api_configuration
title: RBAC API Configuration
sidebar_label: RBAC API Configuration
---

If your service exposes the OpenAPI 3 Specification of its APIs all you have to do when enabling RBAC is:

 1. make sure the API Documentation Path has been specified for your service in the [Microservice section](../../../development_suite/api-console/api-design/services#microservice);
 2. define in your code the `x-permission` custom attribute

The RBAC service will configure itself on boot by contacting your application service, fetching its OpenAPI documentation.

:::info
Any requests that match the `API Documentation Path` with method `GET` will always be proxied to the target service, unless the given OpenAPI Specification or some manual routes provides the path (even with wildcard) registering a policy to this route. In this case the API will be proxied only if the corresponding policy evaluates successfully.
:::

## x-permission attribute

The `x-permission` attribute is shaped as an object with the following properties:

- `allow` **(string, required)**: the name of the Rego policy that should be executed upon the API invocation.
- `resourceFilter` **(object)**: object representing information on what resource the API is looking for to perform filtering operations:
  - `rowFilter` **(object)**: this object contains all the configurations needed to perform filtering operation on rows. Read [RBAC rows filtering](../api-design/rbac.md#rbac-rows-filtering) section for more information about it:
    - `enabled` **(bool)**:  activation value for row filtering
    - `headerName` **(string)**: identifier of the header sent to the requested service in which the interpolated query will be injected. The default values is `x-rbac-row-filter`.
  - `columnFilter` **(object)**: this object contains all the configurations needed to perform filtering operation on columns. Read [RBAC column filtering](../api-design/rbac.md#rbac-column-filtering) section for more information about it: 
    - `onResponse` **(object)**: this object contains the information needed to perform column filtering on the response body provided by the HTTP request:
      
      - `policy`:  the name of the Rego policy that should be executed upon the API invocation.

  

For example, if you want the `greetings_read` policy policy to be evaluated when invoking the `GET /hello` API your custom service must define its API documentation as follows:

```json
{
    "paths": {
        "/hello": {
            "get": {
                "x-permission": {
                    "allow": "greetings_read",
                    "resourceFilter": {
                        "rowFilter": {
                            "enabled": true,
                            "headerName": "x-acl-rows",
                        },
                        "columnFilter":{
                            "onResponse": {
                                "policy": "filter_column_on_response_example
                            }
                        }
                    }
                }
            }
        }
    }
}
```

This way, the `greetings_read` policy that you have written in the [Policies tab](./rbac_policies) will be evaluated.

:::caution
If your service does not expose such API or you want to configure it manually, you can always use [manual routes configuration](./rbac#manual-routes-tab).
:::
<br/>
