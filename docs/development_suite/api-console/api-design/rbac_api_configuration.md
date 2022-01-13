---
id: rbac_api_configuration
title: RBAC API Configuration
sidebar_label: RBAC API Configuration
---

# RBAC API Configuration

If your service exposes the OpenAPI 3 Specification of its APIs all you have to do when enabling RBAC is:

 1. make sure the API Documentation Path has been specified for your service in the [Microservice section](../../../development_suite/api-console/api-design/services#microservice);
 2. define in your code the `x-permission` custom attribute


The RBAC service will configure itself on boot by contacting your application service, fetching its OpenAPI documentation.

## x-permission attribute

The `x-permission` attribute is shaped as an object with the following properties:

 - `allow`: the name of the Rego policy that should be executed upon the API invocation.

For example, if you want the `project_read` policy to be evaluated when invoking the `GET /hello` API your custom service must define its API documentation as follows: 

```json
{
    "paths": {
        "/hello": {
            "get": {
                "x-permission": {
                    "allow": "project_read",
                }
            }
        }
    }
}
```

This way, the `project_read` policy that you have written in the [Policies tab](./rbac_policies) will be evaluated.

:::caution
If your service does not expose such API or you want to configure it manually, you can always use [manual routes configuration](./rbac#manual-routes-tab).
:::
<br/>
