---
id: providers
title: Providers
sidebar_label: Providers
---



## Medisanté

Medisanté provides a suite of medical devices and a portal to manage the devices and the data acquisition.

Since there is no direct integration between the Medisanté portal and the Device Manager, the device enrollment requires two manual steps:

- adding the device on the [Medisanté portal][medisante-devices];
- register the device in the Device Manager.

To receive health data from a Medisanté device, you need to create [a webhook][medisante-webhooks] on the Medisanté portal. A webhook requires several configurations:

- the destination URL, which must point to to the [`POST /health-data/medisante` endpoint][post-health-data-medisante] of the Device Manager;
- the standard (Medisanté or FHIR) and format (JSON or XML) used to send the data: we usually recommend *Medisanté JSON*;
- the authentication mechanism: we natively support the *API Key*, which should be used only with HTTPS connections using TLS 1.2 and CA-signed certificates, or OAuth 2.0, which provides better security but would require a custom middleware.

## Apple HealthKit

[Apple HealthKit][apple-healthkit] is a centralized repository of health data stored on iPhone and Apple Watch devices.

In order to collect health data from a device compatible with HealthKit, you need a mobile application running on your iPhone performing the following steps:

- asking the permissions to access the health data on the device;
- authenticate the user to be able to communicate securely with the Device Manager; 
- enroll a device the first time it's connected to the device using the [`POST /devices/assign` endpoint][post-devices-assign]; 
- send health data to the BFF using the [`POST /health-data` endpoint][post-health-data-format].

To authenticate and authorize the user, you need a custom BFF exposing the endpoints described in the following section.

### BFF endpoints

#### GET /profile

This endpoints returns the profile of the logged-in user and should be compatible with the [OIDC UserInfo Endpoint][oidc-userinfo].

:::tip

When used in combination with the User Manager Service, this endpoint can act as a proxy of the [`GET /userinfo` endpoint of the User Manager Service][ums-user-info].

:::

#### POST /oauth/token

This endpoints allows a user to authenticate with username and password and returns in the `set-cookie` header a new session id (sid) for authenticating API calls.

The request body must provide the username and password:

```json
{
  "username": "...",
  "password": "..."
}
```

and the response will include a `set-cookie` header with the `sid` value.

:::tip

When used in combination with the User Manager Service, this endpoint can act as a proxy of the [`POST /oauth/token` endpoint of the User Manager Service][ums-post-token].

:::

#### POST /reset-password

This endpoint allows a user to reset the password.

The request body must include the user email address:

```json
{
  "email": "user@example.com"
}
```

and, if successfull, the response has a `204` status code and no body.

:::tip

When used in combination with the User Manager Service, this endpoint can trigger the password reset procedure by calling the [`POST /users/change-password` endpoint of the User Manager Service][ums-user-change-password].

:::

#### POST /health-data/:format

This endpoint is responsible of vetting incoming health data and transmitting it to the Device Manager through the [`POST /health-data/healthkit` endpoint][post-health-data-healthkit].


[apple-healthkit]: https://developer.apple.com/documentation/healthkit
[medisante-devices]: https://devices.medisante.net/devices
[medisante-webhooks]: https://devices.medisante.net/webhooks
[oidc-userinfo]: https://openid.net/specs/openid-connect-core-1_0.html#UserInfo

[ums-post-token]: /runtime_suite/user-manager-service/30_usage.md#post-oauthtoken
[ums-user-info]: /runtime_suite/user-manager-service/30_usage.md#get-userinfo
[ums-user-change-password]: /runtime_suite/user-manager-service/30_usage.md#post-userschange-password

[post-devices-assign]: /runtime_suite/device-manager/30_usage.md#post-devicesassign
[post-health-data-healthkit]: /runtime_suite/device-manager/30_usage.md#post-health-datahealthkitformat
[post-health-data-medisante]: /runtime_suite/device-manager/30_usage.md#post-health-datamedisanteformat

[post-health-data-format]: #post-health-dataformat
