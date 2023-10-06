---
id: auth-architecture
title: AuthN/AuthZ Architecture
sidebar_label: AuthN/AuthZ Architecture
---

Welcome to the Mia-Platform AuthN/AuthZ Architecture tutorial! This is an holistic guide on the crucial realm of authentication, exploring all the possible AuthN/AuthZ architectures you could implement to secure your Digital Platform built with Mia-Platform.

We'll start with the basics, addressing the simplest scenarios first, and gradually advance, tackling multi-project architectures and integrating multiple external Identity Providers. 

## Prerequisites

## Use cases
For each of the following scenarios, we will provide a brief introduction and complete step-by-step tutorial to implement it.
## Scenario 1: Use a static API Key to secure your endpoints
The simplest authentication method you can implement with Mia-Platform is using the [API Keys](/development_suite/api-console/api-design/api_key.md) offered by our API Gateway (both [Nginix](/runtime_suite/api-gateway/10_overview.md) or [Envoy](/runtime_suite/envoy-api-gateway/overview.md)) to secure your APIs.  

Basically, you can define a static client key for each client that needs to consume the APIs of your project. You can then decide which client has access to which APIs by configuring the correct group expression in the [Endpoints](/development_suite/api-console/api-design/endpoints.md#manage-the-security-of-your-endpoints) section.

![Scenario1](./img/auth-scenario1.png)

The involved microservice of the flow at runtime are:
1. `API Gateway`: Mia-Platform plugin available in [Nginix](/runtime_suite/api-gateway/10_overview.md) or [Envoy](/runtime_suite/envoy-api-gateway/overview.md)
2. [`Authorization Service`](/runtime_suite/authorization-service/10_overview.md): Mia-Platform plugin
3. The microservice connected to the endpoint 

The picture above illustrates the auth flow at runtime:
1. The client calls the endpoint of your project, placing their own API key in the `client-key` header (or in the `mia_client_key` cookie).
2. The API gateway resolves the client type from the `client-key` header. Then, it calls the Authorization Service which is in charge to verify if the resolved client type has access to the requested endpoint.
3. If the client type verification performed by the authentication service is successful, the API Gateway forwards the API call the right microservice of the project.

:::warning
The authentication method suggested in this scenario is straightforward but comes with a lower level of security. Therefore, we recommend using it only in use cases where APIs are not exposed on the public internet or in situations where security is not a critical aspect of the project (e.g., MVPs, internal projects, etc.).
:::

### Tutorial steps
:::note
We suppose that you have already created an API Gateway in your project and you already have some endpoints you want to secure.
:::
In order to implement the flow depicted above, you can perform the following steps on Mia-Platform Console:
1. For each of the client that need to consume your APIs, create an API key:
    - Click on `API Key`
    - Click on `Add new`
    - Either manually create a key or generate a random one
    - Choose a meaningful name for your client and insert it in the `ClientType` textbox
    - Check the `Active` checkbox
    - Click on `Create`
2. Secure the endpoints
    - Select the endpoint you want to secure in the `Endpoints` section
    - Check the box `API Key required` in the Security tab

Once you deploy the above configuration, your clients will be able to call the protected endpoint only by providing one of the configured API keys either in the `client-key` HTTP header or in the `mia_client_key` HTTP cookie.  

Furthermore, you could need to have a more fine-grained authorization to your endpoint. For example, suppose to have three different clients of your project: `A`, `B` and `C` but you want only `A` and `B` to access your endpoint.
In this case, you need to:

3. Create the `Authorization Service` plugin from Marketplace
    - Click on `Microservices`
    - Click on `Create a Microservice` and select `From Markeplace`
    - Search `authorization` in the search bar
    - Select `Authorization Service`
    - Click on `Create`
4. Secure the endpoint
    - Select the endpoint you want to secure in the `Endpoints` section
    - Use the `User Group Permission` textbox to choose which client type is authorized. For the example above you should insert:
      ```
      clientType === 'A' || clientType === 'B'
      ```


## Scenario 2: Integrate an external Identity Provider to your project
In order to provide a higher security level, you may need to protect your endpoints using an external Identity Provider (IDP) such as Okta, Keycloak, etc.

![Scenario2](./img/auth-scenario2.png)

The involved microservice of the flow at runtime are:
1. `API Gateway`: Mia-Platform plugin available in [Nginix](/runtime_suite/api-gateway/10_overview.md) or [Envoy](/runtime_suite/envoy-api-gateway/overview.md)
2. [`Authorization Service`](/runtime_suite/authorization-service/10_overview.md): Mia-Platform plugin
3. `Authentication Service`: a custom microservice that you need to implement. It must integrate with your external IDP to resolve the user token.
4. The microservice connected to the endpoint 

The picture above illustrates the auth flow at runtime:
1. The client, be it a web application or backend software, need to implement the authentication flow required by the IDP to obtain a valid token. With this token, the client will be able to call the endpoints of your project.
2. The client calls the endpoint of your project, including the valid token in the request. Usually this token is placed in the `Authorization` header but it can be placed in other headers or cookies.
3. The API Gateway calls the Authorization Service which is in charge to verify if the user who made the reqeust is authorized to access to the requested endpoint.
4. To do so, the Authorization Service requests to the Authentication Service to resolve the token
5. The Authentication Service resolves the token contacting the external IDP and returns the user payload to the Authorization Service that can now check if the user belongs to the authorized groups 
6. If the verification performed by the Authentication Service is successful, then the API Gateway forwards the API call the right microservice of the project. Note that the target microservice will receive the follwoing additional headers that could be useful for their business logic:
  
  | Header              | Description                                                                                |
  | --------------------| ------------------------------------------------------------------------------------------ |
  | `Miausergroups`     | comma separated list of the groups the user belongs to                                     |
  | `Miauserid`         | the ID of the user                                                                         |
  | `Miauserproperties` | stringified JSON object containing the user payload returned by the Authentication Service |



### Tutorial steps
:::note
We suppose that you have already created an API Gateway in your project and you already have some endpoints you want to secure.
:::
In order to implement the flow depicted above, you can perform the following steps on Mia-Platform Console:
1. Create the `Authentication Service` custom microservice
    - Click on `Microservices`
    - Click on `Create a Microservice` and select `From Markeplace`
    - Choose your preferred template to start coding your custom Authentication Service
    - Implement the `/userinfo` endpoint. It must resolve the token on the external IDP and then return as response body a JSON object with at least the `userID` and the `groups`. An example of response is:
      ```json
      {
        "userID": "123",
        "groups": ["admin", "users"]
      }
      ```
2. Create the [`Authorization Service`](/runtime_suite/authorization-service/10_overview.md) plugin from Marketplace
    - Click on `Microservices`
    - Click on `Create a Microservice` and select `From Markeplace`
    - Search `authorization` in the search bar
    - Select `Authorization Service`
    - Click on `Create`
    - Update the values of the following enviornment variables:

      | Variable                       | Value                                                                        |
      | -------------------------------| ---------------------------------------------------------------------------  |
      | USERINFO_URL                   | http://authentication-service/userinfo                                       |
      | CUSTOM_USER_ID_KEY             | userID                                                                       |
      | HEADERS_TO_PROXY               | <header of the client's request containing the token> (e.g. `Authorization`) |
      | AUTHORIZATION_HEADERS_TO_PROXY | <header of the client's request containing the token> (e.g. `Authorization`) |
      | USER_PROPERTIES_TO_PROXY       | userID,groups                                                                |

3. Secure the endpoint
    - Select the endpoint you want to secure in the `Endpoints` section
    - Use the `User Group Permission` textbox to choose the user groups authorized to call the endpoint. For example, if you want to allow access only to `admin` or `users` you should insert:
      ```
      groups.admin || groups.users
      ```
      :::info
      Scenario 1 and scenario 2 can be combined and you could have complex group expressions like the following:
        ```
        (clientType === 'A' || clientType === 'B') && (groups.admin || groups.users)
        ```
      :::


## Scenario 3: Manage user groups within your project
This scenario is a slight modification of the previous-one: we keep your external Identity Provider (IDP) but we manage the user groups within your project using a dedicated CRUD collection.

To do so, we need to introduce in the architecture the [`Authentication Service`](/runtime_suite/authentication-service/10_overview.md) plugin. Note that, this time, it is a Mia-Platform plugin rather than a custom microservice as in Scenario 2. This imposes a limitations on the presented architecture: your external Identity Provider must be supported by the Authentication Service plugin (see [the list of supported IDPs](/runtime_suite/authentication-service/10_overview.md)) otherwise this scenario is not applicable.

The involved microservices of the flow at runtime are:
1. `API Gateway`: Mia-Platform plugin available in [Nginix](/runtime_suite/api-gateway/10_overview.md) or [Envoy](/runtime_suite/envoy-api-gateway/overview.md)
2. [`Authorization Service`](/runtime_suite/authorization-service/10_overview.md): Mia-Platform plugin
3. [`Authentication Service`](/runtime_suite/authentication-service/10_overview.md): Mia-Platform plugin
4. [`CRUD Service`](/runtime_suite/crud-service/10_overview_and_usage.md): Mia-Platform plugin
5. Your web app and eventually its backend

While in Scenario 2 the client gets the token directily on the IDP, this time the process of obtaining the token goes through the Authentication Service. The complete runtime flow is depicted below:
 
![Scenario3](./img/auth-scenario3.png)

Note that the token is generated by the Authentication Service after merging the user info obtained from the IDP and the ones saved on a dedicated CRUD collection. In particular, the only user attributes that are inherited from the IDP are id, name and email; all the other attributes (`groups` included) must be added on the dedicated CRUD collection.  

Once, your web app has obtained the token following the above flow, the authentication and authorization of the API calls made with that token is similar to Scenario 2 but not identical. 

![Scenario3a](./img/auth-scenario3a.png)

Indeed, as you can notice from the picture above, the token resolution is performed directly from the Authentication Service rather than the Identity Provider.  

### Tutorial steps

## Scenario 4: Multiple projects
-> Problems
 - auth services are replicated
 - inter-project communication: user resolution would be repeated at runtime; (projects need to know API Keys of other projects)
 - maybe you want to centralize Ingress management and API Keys management in a Single project
 - I want to test my APIs without exposing on the internet

### Tutorial steps

## Scenario 5: Entrprise Architecture with edge gateways
- Use edge gateway(s) to centralize user resolution, API Keys, Ingresses (differentiate Ingresses exposed on the internet vs internal)
- What if I have multiple IDPs but still want to centralize -> exploit edge gateways

### Tutorial steps


