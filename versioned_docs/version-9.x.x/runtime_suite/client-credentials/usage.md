---
id: usage
title: Client Credentials Usage
sidebar_label: Usage
---
import Mermaid from "../../../../src/components/Mermaid";

In this section, we show you how to use the `client-credentials` service.

## Endpoints

### POST /oauth/token

In the login flow, you should call the `/oauth/token` endpoint with method POST.

:::note
  There are two main types of authentication methods, which differ by the details employed to prove user identity. The _secret basic_ is based on username and password, while the _private key JWT_ requires as input a signed JWT.
:::

#### Client secret basic

Request must have a body in `x-www-form-urlencoded` containing:

* the `grant_type=client_credentials`
* the `audience` (required only if the **REQUIRED_AUDIENCE_IN_TOKEN_REQUEST** environment variable is set to `true`)

and a basic authorization header set as `Basic base64(clientId:clientSecret)`.

The client expected response is in `application/json` and contains:

* **access_token**: jwt signed with private key;
* **expires_in**: how many seconds the token is valid;
* **token_type**: type of the token. It is `Bearer`.

In case the `clientId` and `clientSecret` pair does not exist on the database, it is returned an unauthorized error (HTTP code 401) with a brief explanation.

The returned **access token** is structured as follows:

- the **header** contains, besides the *algorithm* adopted to generate the token and the token *type*, the `kid` field to address the correct signature key used in the token verification procedure.

  :::caution
  A token without the `kid` field is considered invalid.
  :::

- the **payload** containing the following claims:

    * **iss**: the issuer of the token. Passed from env variable `ISSUER_CLAIMS`;
    * **sub**: the subject requesting the token. It is set to the `clientId`;
    * **exp**: the expiration unix timestamp in second of the token;
    * **iat**: the time at which the JWT was issued;
    * **permissions**: array of the permissions of the client which has issued the token;
    * **jti**: the id of the JWT;
    * **aud**: the audiences of the JWT.
- its signature

Example CURL request:

```shell
curl --location \
    --request POST 'http://client-credentials/oauth/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header 'Authorization: Basic base64(client_id:client_secret)' \
    --data-urlencode 'grant_type=client_credentials' \
    --data-urlencode 'audience=aud1'
```

Example response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleUlEIiwidHlwIjoiSldUIn0.eyJleHAiOjE1OTE3OTg1OTYsImlhdCI6MTU5MTc5NDk5NiwiaXNzIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJjbGllbnQtaWQiLCJwZXJtaXNzaW9ucyI6W119.tfuIjL8ZN7dFmtT3n9NQLxY6Jhq1BoVZwb_LhTZS0zLNqxNQjQA-5-bN6-vne1ZJg9fBeRkq3aKxGjWCuruXTjYRfDLZwMSFoP3ki6NtUrdAqbse_c2J6DgI5m_F44NOZJFGZ8fbMydox5HV19swaozF32-aFN7UN53zZ7wV0tMdVXc-Nvf2WU8udGVXlqNtlMpQC2JZjSh8GeOljxZD4O6PDmp55ZoIcp7TscEzywT4yzUVJ78cLvMx1_rgZTto687XPJYdiqjdsI5kg7mSDH7_Bn9BfAR3Ln6qrPC_VieqAWf8-YmloyQNxx8dER8Yl-vDMCkHp3Z9Hla0XOrrm9F8IEyEQj5qmA_3TewppaDn3lu8Q4qYy_7v5lGSWTfx8PwaNHT5rRnDz10FI59KjM4WMzheTkqJ0Bw3dR-p1huF6iqoMsvnw5HfvdyyYP9_mMu0uw4JZiXInIR3qtmGZF6QGeeYK-l1atx1QRq-O5jvqZUy2hYFsJCLQEAHhF2jU5bWjbMjDsgSn1FHnzJY7IjRUNND6BuT4aBJzz0nspwy4fZhJTLrLLwFI3cjt17m5Ngrb9JY88dhGXLhAnWzjIDPWDM7Ao4YfQ2DHp2CM0P5OBB9sy8kXCgvv4ICAXv4cIEXIaMCE7QsPLHX8UqdwvP7-ygOyvCRRY_5seT70GQ",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### Private key JWT

Request must have a body in `x-www-form-urlencoded` containing the follow parameters:

* **grant_type** set to `client_credentials`
* **client_assertion_type** set to `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
* **client_assertion** set to the *assertion JWT*
* **client_id** id of the client
* **token_endpoint_auth_method** select which authentication method is adopted (in this case it should be set to `private_key_jwt`)

The *assertion JWT* must contain:
- in the header the `kid` field, whose value has been defined during the registration phase
- in the payload the claims specified by [this spec](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication):

  * **iss** (*issuer*): client_id of the oauth client;
  * **sub** (*subject*): client_id of the oauth client;
  * **aud** (*audience*): the issuer given to client credential;
  * **jti** (*jwt id*): a unique identifier of the token. The token must be used only once;
  * **exp** (*expiration time*): expiration time of the token, in unix timestamp;
  * **iat** (*issued at*): time at which the token is issued;
  * **requested_audiences**: an array of the requested audience.
  * *additional properties*: other properties to be added as custom claims into the JWT generated by the service.

:::caution
In case the *assertion JWT* does not contain all the detailed fields, it is considered invalid and the authentication is rejected with a forbidden error (code 403 HTTP)
:::

:::caution
The additional properties must be allowed for the used client by adding it into the **allowedCustomClaims** list of strings
:::

Below is provided an example of *assertion JWT* components:

Header:
```json
{
  "alg": "RS256",
  "kid": "kid-1",
  "typ": "JWT"
}
```

Payload **without custom claims**:
```json
{
  "iss": "<client-id>",
  "sub": "<client-id>",
  "aud": "test-issuer",
  "jti": "0cda23a7b55ef6fa8afd01cbd1c7c70e",
  "iat": "1604573964",
  "exp": "1604577564",
  "requested_audiences": [ "audience-1" ]
}
```

Payload **with custom claims**:
```json
{
  "iss": "<client-id>",
  "sub": "<client-id>",
  "aud": "test-issuer",
  "jti": "0cda23a7b55ef6fa8afd01cbd1c7c70e",
  "iat": "1604573964",
  "exp": "1604577564",
  "requested_audiences": [ "audience-1" ],
  "customerName": "Chester",
  "customerSurname": "Bennington"
}
```

Example of CURL request:

```shell
curl --location \
  --request POST 'http://client-credentials/oauth/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer' \
  --data-urlencode 'client_assertion=<assertion-JWT>' \
  --data-urlencode 'client_id=<client-id>' \
  --data-urlencode 'token_endpoint_auth_method=private_key_jwt'
```

### GET /.well-known/jwks.json

Client credentials service exposes an endpoint `.well-known/jwks.json` with an object with the key `keys`, containing an array of JWK values. Those JWKs could be used to verify the signature of the JWT.

The order of the keys in array has not a specific meaning.

The JWK contains:

* **kid**: the key id. This key is set in JWT header. You must use the key with same kid of your JWT to verify the signature. It is not possible to have multiple key with the same `kid`;
* **use**: use of the JWK. For this service all the keys will be `sig` (signature);
* **alg**: algorithm used by the key. For this service is used `RS256`;
* **kty**: key cryptographic name (`RSA` for RSA keys);
* **n**: the modulus value of the RSA public key. It is represented as a Base64urlUInt-encoded value;
* **e**: the exponent value for the RSA public key. It is represented as a Base64urlUInt-encoded value.

Example CURL request:

```shell
curl 'http://localhost:8080/.well-known/jwks.json'
```

Example response:

```json
{
  "keys": [
    {
      "kid": "kid",
      "use": "sig",
      "kty": "RSA",
      "alg": "RSA256",
      "n": "sR6WjRHDNXgzBTgYr-ayhSlxdt65FIrhTytZN9dZczDC8Uqt6Cynstq3eoAfLcrxKAyj4X3J4TRxSEOL78WUisLAADHU6oEsqeuB97kVN4PcPnd63H3naOiLioc2-9L1TtUMVB4H6G5ZkKQAgrwjpHSztJF0iYaXOQhEcBlCynltuEVuyK96tvnDVqXCfhsSFweP7KorcfMj4YYj5OT2ADlAFzBQ2qppd9BpJidHGD6auCsI7vjmNCEq49v9UOiQs2XbjN-ddr9nvNBBK5bVtjGkfUPNt6uAV1AWMboVjobcAnDH2AD8W--3JUl1ffguC_fsHpPjrNoH0hCbPFfEb2YK2DX1vKhYKX3u199gc4B1q0l1JTs8AJcFbf7d63FKa6O-5V97fLK9lJYd8adF8NZiJlXjFCR-LmAYmjxmsBmByImEenEzDxuuubitSWFt47L9eGV9eY7zmnD0FV_jbwXYCcod4R46vnjabzpUcnd3VqiruUwnquHNGgj2yJpT7CMCHpK9dVlMUY8cWIfYXn4si_RrRp_E2EIkWKkSyplBWMjIK_KhjuSi_YOYNSg3OKXOGmYMcCxXUnwPIIW5n-MdbO6WC8bqhpLU1_XisfaL-V8jEOjAs0dQ9dQyvvP9ckrC753FGARXtdqwnyb2d3r3r3cLh-eQo05TyLqHoEk",
      "e": "AQAB"
    }
  ]
}
```

It is important to emphasize that, as stated by [RFC7517](https://tools.ietf.org/html/rfc7517#section-5)

> The member names within a JWK Set MUST be unique; JWK Set parsers MUST either reject JWK Sets with duplicate member names or use a JSON parser that returns only the lexically last duplicate member name [...].

### GET /tokeninfo

Calling this endpoint passing a valid Mia-Platform JWT, it returns 200 with the claims in an object.
Here it is checked the validity of the JWT, if it is not passed or it is not valid this endpoint returns 401.
If in the JWT is present an audience, it will be checked with the audience passed in `ACCEPTED_AUDIENCES` env variable.

Example CURL request:

```shell
curl --location --request GET 'http://client-credential-host/tokeninfo' \
--header 'Authorization: Bearer {{myJWT}}' \
```

Example response:

```json
{
    "exp": 1592233216,
    "jti": "b29b64dd-1d62-461b-9be6-6efe3ff32237",
    "iat": 1592229616,
    "iss": "mia-issuer",
    "sub": "rPxwZcgeFRJPgnnabMZrJWMemMBJjaSB",
    "permissions": ["my permission 1", "my permission 2"],
    "aud": ["my-aud"]
}
```

### POST /register

The register endpoint has different [auth method](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication). The supported methods are `client_secret_basic` and `private_key_jwt`).
One client has only one method possible.

The default method (if is not passed during registration) is the `client_secret_basic`.

Once called the endpoint, the client information will be saved in the CRUD with empty audience and permissions. You can add and change the fields manually on the CRUD or set up a CMS page and update them directly from the CMS.

#### Client secret basic

This endpoint generates a new *client id* and *client secret* pair with given *applicationId*. It follows the RFC to [register to a client](https://tools.ietf.org/html/rfc7591).

It returns 201 when credential pair and client is correctly generated, 401 otherwise.

```sh
curl --location --request POST 'http://client-credential-host/register' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "client_name": "my client name"
    }'
```

Example response:

```json
{
    "client_id": "rPxwZcgeFRJPgnnabMZrJWMemMBJjaSB",
    "client_secret": "ugmWIVfZoTBKTXzADXJsJJexuMhCYxocxaKqkOlEYavgcEBr",
    "client_secret_expires_at": 0,
    "client_id_issued_at": 1592229239
}
```

:::note
Note that the `client_secret` field will only be available during registration so take care to save it locally.
:::
#### Private key JWT

It is possible to pass the `token_endpoint_auth_method` parameter in input set to `private_key_jwt`.

:::note
You can use [this guide](jwt_keys) to generate JWT public and private key suitable for this operation.
:::

For this auth method, it is created a client. The *client* information are accessible from the CRUD, so it is possible to set a CMS page and change the permissions of the client directly from the CMS.

It returns 201 when client is correctly generated, 401 otherwise.

```shell
curl --location --request POST 'http://client-credential-host/register' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "client_name": "my client name",
    "token_endpoint_auth_method": "private_key_jwt",
    "public_key": {
      "kid": "kid",
      "use": "sig",
      "kty": "RSA",
      "alg": "RSA256",
      "n": "sR6WjRHDNXgzBTgYr-ayhSlxdt65FIrhTytZN9dZczDC8Uqt6Cynstq3eoAfLcrxKAyj4X3J4TRxSEOL78WUisLAADHU6oEsqeuB97kVN4PcPnd63H3naOiLioc2-9L1TtUMVB4H6G5ZkKQAgrwjpHSztJF0iYaXOQhEcBlCynltuEVuyK96tvnDVqXCfhsSFweP7KorcfMj4YYj5OT2ADlAFzBQ2qppd9BpJidHGD6auCsI7vjmNCEq49v9UOiQs2XbjN-ddr9nvNBBK5bVtjGkfUPNt6uAV1AWMboVjobcAnDH2AD8W--3JUl1ffguC_fsHpPjrNoH0hCbPFfEb2YK2DX1vKhYKX3u199gc4B1q0l1JTs8AJcFbf7d63FKa6O-5V97fLK9lJYd8adF8NZiJlXjFCR-LmAYmjxmsBmByImEenEzDxuuubitSWFt47L9eGV9eY7zmnD0FV_jbwXYCcod4R46vnjabzpUcnd3VqiruUwnquHNGgj2yJpT7CMCHpK9dVlMUY8cWIfYXn4si_RrRp_E2EIkWKkSyplBWMjIK_KhjuSi_YOYNSg3OKXOGmYMcCxXUnwPIIW5n-MdbO6WC8bqhpLU1_XisfaL-V8jEOjAs0dQ9dQyvvP9ckrC753FGARXtdqwnyb2d3r3r3cLh-eQo05TyLqHoEk",
      "e": "AQAB"
    }
  }'
```

Example response:

```json
{
    "client_id": "rPxwZcgeFRJPgnnabMZrJWMemMBJjaSB",
    "client_id_issued_at": 1592229239
}
```

## Client management endpoints

Some of the endpoints exposed by the service are meant to manage clients. These endpoints allow the caller to perform operations such as:

- Create a new client and set all of its properties, like permissions and audiences. The register endpoint doesn't allow the caller to set the new client permissions or audience because it is meant to allow external applications to create a new client without the privilege of setting its permissions or audience.

### POST /clients

This endpoint allows the caller to create a new client with certain authorization properties and with a certain state.
Contrary to the `/register` endpoint, the `/clients` endpoint isn't meant to be public, since it allows the creation of a new client with certain authorization properties.
Indeed, the `/clients` endpoint is designed to satisfy all the use cases where a client must be created automatically by some internal service.

The `POST /clients` endpoint is very similar to the `POST /register` endpoint, as it accepts all the client information that are currently accepted by the latter, with the addition of the following client parameters:

- `permissions`: a list of permission identifiers which the client holds.
- `audience`: a list of audience identifiers which the client can communicate with.
- `__STATE__`: the initial CRUD state of the client being created.

:::caution
Since this endpoint allows the caller to create a client with some permissions and audiences of interest, it should be used by internal services only and should not be made publicly available.
:::

An example of invocation of the `POST /clients` is the following one:

```shell
curl --location --request POST 'http://client-credentials/clients' \
--header 'Content-Type: application/json' \
--data-raw '{
	"client_name": "<client name>",
	"token_endpoint_auth_method": "private_key_jwt",
	"public_key": {
		<public key in JWK infos>
	},
  "permissions": ["permission-1", "permission-2"],
  "audience": ["audience-1", "audience-2", "audience-3"],
  "__STATE__": "DRAFT"
}'
```

The result of the `POST /clients` endpoint is the same as the one returned by the `POST /register` endpoint.

An example of response, when a private key client is created, is the following:

```json
{
  "client_id": "KQxcpHfuAqgAOJictCygckXuUwXSZqyz",
  "client_id_issued_at": 1643640599
}
```

### Update clients settings

At the moment there's no endpoint exposed by the `client-credentials` service to update a client settings, like `permissions` or `audience`.
Such an endpoint would be a simple proxy to the `PATCH /clients` endpoint of the `crud-service` that stores clients information in the first place.
For this reason, in order to the update a client settings, is recommended to use the `PATCH /clients` endpoint exposed by the `crud-service` that must be deployed together with the `client-credentials` service.
The `crud-service` documentation is available [here](../../runtime_suite/crud-service/overview_and_usage).

## Supported Authentication Flow

Below are reported the authentication flows that are supported by Client Credentials service. The flows are sequence diagrams descriptions.

### Login flow

Below it is visible the sequence diagram of the login flow:

<Mermaid chart={`
sequenceDiagram
title: Login client credentials
participant client
participant clcr_service
participant crud_service
note over client: grant_type in body <br> client_id&client_secret in Basic header
client->>clcr_service: POST /oauth/token
clcr_service->>crud_service: GET {client_id,hash_client_secret}
clcr_service->>clcr_service: generate Mia JWT
note over clcr_service: iss: my-idp <br> sub: client-id <br> aud: permission <br> exp: expiration <br> iat: jwt issue date <br> jti: jwt id
clcr_service->>client: {access_token, expires_in, token_type}
`}/>

### Authorization flow (internal client)

Below it is visible the sequence diagram of the authorization flow from internal client:

<Mermaid chart={`
sequenceDiagram
title: Authentication flow from a console project
participant client
participant api_gateway
participant authorization_service
participant clcr_service
participant resource_owner
client->>api_gateway: GET /foobar
api_gateway->>authorization_service: /auth {client-type,isbackoffice,method,path}
authorization_service->>clcr_service: /tokeninfo {authorization Bearer AT}
clcr_service->>clcr_service: verify token expiration,signature
opt if not logged
clcr_service->>authorization_service: 401 with error
authorization_service->>api_gateway: 401 with error
api_gateway->>client: 401 with error
end
clcr_service->>authorization_service: 200 {aud or permission,sub}
note over authorization_service: authorization_service handle <br>  groups,client-type and isbackoffice in logical expression, <br> we should add permissions
authorization_service->>authorization_service: evaluate permissions
opt if have not the permission
authorization_service->>api_gateway: 401 with error
api_gateway->>client: 401 with error
end
authorization_service->>api_gateway: 200  <br>  {miauserid,miausergroups,miauserproperties,client-type}
api_gateway->>resource_owner: GET /foobar {Authorization Bearer AT} + platform headers
`}/>

### Authorization flow (external client)

Below it is visible the sequence diagram of the authorization flow from external client:

<Mermaid chart={`
sequenceDiagram
title: Authentication flow from external with an AT
participant client
participant resource_owner
participant clcr_service
client->>resource_owner: GET /foobar {Authorization Bearer AT}
resource_owner->>resource_owner: Take AT from request
opt if AT not in request
resource_owner->>client: 401
end
resource_owner->>clcr_service: GET /.well-known/jwks.json
clcr_service->>resource_owner: [keys]
resource_owner->>resource_owner: validate AT JWT {expire,signature,..}
opt if AT not valid
resource_owner->>client: 401
end
resource_owner->>resource_owner: verify permission
opt if not enough permission
resource_owner->client: 403
end
resource_owner->>resource_owner: make some stuff
resource_owner->>client: ok
`}/>

### Tokeninfo

Below it is visible the sequence diagram to access to the JWT info:

<Mermaid chart={`
sequenceDiagram
title: Tokeninfo
participant client
participant clcr_service
client->>clcr_service: GET /tokeninfo header Authorization Bearer AT
clcr_service->>clcr_service: check expiration
clcr_service->>clcr_service: check signature
clcr_service->>clcr_service: decode jwt
clcr_service->>client: {permission: []}
`}/>
