---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to correctly add this application in your project you must perform the following configuration steps.

## Advanced Configuration

### API Gateway

#### Nginx

If the api gateway used in the project is nginx (docker image __nexus.mia-platform.eu/core/api-gateway__) go to the design area of the console go to **Advanced** and select the `api-gateway` microservice.

Open the file **server-extension.conf** and write the following configuration:

```
error_page 401 = @error401;

location @error401 {
  include /etc/nginx/customization.d/header-debug.conf;

  if ($type = "text/html") {
    return 302 '$original_request_scheme://$original_request_host/web-login?redirect=$original_request_uri$is_args$args';
  }

  default_type $type;
  return 401 $content_401;
}
```

This configuration will tell the API Gateway to redirect (302) any **unauthorized request** (401) to `/web-login` endpoint, without modifying the original request.

#### Envoy

If the api gateway used in the project is envoy (docker image __envoyproxy/envoy__) go to the design area of the console go to **Advanced** and select the `api-gateway-envoy` microservice.

Open the file **local-replies.yml** and write the following configuration:

```
- listener_name: frontend
  filter:
    status_code_filter:
      comparison:
        op: EQ
        value:
          default_value: 401
          runtime_key: key_b
  status_code: 302
  body:
    inline_string: |-
      <html>
        <head>
          <meta http-equiv="content-type" content="text/html;charset=utf-8">
            <title>302 Found</title>
        </head>
      </html>
  headers_to_add:
  - header:
      key: "Location"
      value: "/web-login"
    append: false
- listener_name: frontend
  filter:
    and_filter:
      filters:
      - status_code_filter:
          comparison:
            op: EQ
            value:
              default_value: 404
              runtime_key: key_b
      - header_filter:
          header:
            name: ":path"
            string_match:
              exact: "/"
  status_code: 308
  body:
    inline_string: |-
      <html>
        <head>
          <meta http-equiv="content-type" content="text/html;charset=utf-8">
            <title>308 Permanent Redirect</title>
        </head>
      </html>
  headers_to_add:
  - header:
      key: "Location"
      value: "/"
    append: false
```

### Authorization Service

From the design area of the console go to **Advanced** and select the `authorization-service` microservice.

Open the file **auth.json** and write the following configuration:

```json
{
  "/web-login": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/users": {
    "ALL": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/login-site": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/authorize": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/oauth/token": {
    "POST": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  }
}
```

## Auth0

### Tenant

Configure your Auth0 tenant following the [dedicated documentation](../../runtime_suite/auth0-client/configure_auth0).

### Auth0 Client

Set a value for the `SESSION_SCOPE` variable of the `auth0-client` in order to complete its configuration.

## Public Variables

Set the value for the following public variables

- `AUTH0_NAMESPACE`
- `AUTH0_CALLBACK_URL`

## Environment Variables

Set the value for the following environment variables, used by the Auth0 client service:

- `AUTH0_APPLICATION_URL`: url to the Auth0 application (defined in the Auth0 tenant)
- `AUTH0_CLIENT_ID`: client ID for the Auth0 application used (defined in the Auth0 tenant)
- `AUTH0_CLIENT_SECRET`: client secret for the Auth0 application used (defined in the Auth0 tenant)
- `AUTH0_MANAGEMENT_CLIENT_ID`: client id for the Auth0 machine to machine application used (defined in the Auth0 tenant)
- `AUTH0_MANAGEMENT_CLIENT_SECRET`: client secret for the Auth0 machine to machine application used (defined in the Auth0 tenant)
- `REDIS_HOSTS`: comma separated list of redis hosts

## Microservices

For further configuration on microservices included in the application you can refer to the dedicated documentation:

- [Authorization Service](../../development_suite/api-console/advanced-section/authorization-service/configuration)
- [Oauth Login Site](../../runtime_suite_applications/dev_portal/authentication_configuration#configure-login-site)
- [Auth0 Client](../../runtime_suite/auth0-client/configuration)
