---
id: how-to-use
title:  Client Credentials Service
sidebar_label: How to use
---
The credentials service allow to expose API to perform OAuth2 compliant client credential flows with third party providers.

In this section, we show you how to use the `client-credentials` service.

## Endpoints

### /oauth/token

In the login flow, you should call the `/oauth/token` endpoint with method POST.

:::note
  There are two main types of authentication methods, which differ by the details emplyed to prove user identity. The _secret basic_ is based on username and password, while the _private key JWT_ requires as input a signed JWT.
:::

#### Client secret basic

Request must have a body in `x-www-form-urlencoded` containing the `grant_type=client_credentials` and a basic authorization header set as `base64(clientId:clientSecret)`.

The client expected response is in `application/json` and contains:

* **access_token**: jwt signed with private key;
* **expires_in**: how many seconds the token is valid;
* **token_type**: type of the token. It is `Bearer`.

If the clientId and clientSecret pair not exists on db, it is returned 401 with specific error.

The access token is created with:

In the header, it contains the `kid` field to address the correct signature key to verify the token.
A token without the `kid` field is invalid.

In the payload, the claims used are:

* **iss**: the issuer of the token. Passed from env variable `ISSUER_CLAIMS`;
* **sub**: the subject requesting the token. It is set to the `clientId`;
* **exp**: the expiration unix timestamp in second of the token;
* **iat**: the time at which the JWT was issued;
* **permissions**: array of the permissions of the client which has issued the token;
* **jti**: the id of the JWT;
* **aud**: the audiences of the JWT.

Example CURL request:

```sh
curl --location \
    --request POST 'http://client-credentials/oauth/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header 'Authorization: Basic base64(client_id:client_secret)' \
    --data-urlencode 'grant_type=client_credentials;audience=aud1'
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
* **client_assertion** set to the assertion JWT
* **client_id** id of the client
* **token_endpoint_auth_method** select which authentication method is adopted (in this case it should be set to `private_key_jwt`)

The assertion JWT must contains the claims specified by [this spec](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication):

* **iss** (*issuer*): client_id of the oauth client;
* **sub** (*subject*): client_id of the oauth client;
* **aud** (*audience*): the issuer given to client credential;
* **jti** (*jwt id*): a unique identifier of the token. The token must be used only once;
* **exp** (*expiration time*): expiration time of the token, in unix timestamp;
* **iat** (*issued at*): time at which the token is issued;
* **requested_audiences**: an array of the requested audience.


### /.well-known/jwks.json

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

```curl
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

### /tokeninfo

Calling this endpoint passing a valid mia JWT, it returns 200 with the claims in an object.
Here it is checked the validity of the JWT, if it is not passed or it is not valid this endpoint returns 401.
If in the JWT is present an audience, it will be checked with the audience passed in `ACCEPTED_AUDIENCES` env variable.

Example CURL request:

```sh
curl --location --request POST 'http://client-credential-host/oauth/token' \
--header 'Authorization: Basic base64(client_id:client_secret)' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials'
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

### /register

The register endpoint has different [auth method](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication). The supported methods are `client_secret_basic` and `private_key_jwt`).
One client has only one method possible.

The default method (if is not passed during registration) is the `client_secret_basic`.

#### Client secret basic

This endpoint generates a new *client id* and *client secret* pair with given *applicationId*. It follows the RFC to [register to a client](https://tools.ietf.org/html/rfc7591).

During the register, it is created the credentials in a specific db and collections, and a client using the given CRUD URL. The *cilent* information are accessible from the CRUD, so it is possible to set a CMS page and change the permissions of the client directly from the CMS.

It returns 201 when credential pair and client is correctly generated, 401 otherwise.

```sh
curl --location --request POST 'http://client-credential-host/register' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "client_name": "my client name",
  }`
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

#### Private key JWT

It is possible to pass the `token_endpoint_auth_method` parameter in input set to `private_key_jwt`.

For this auth method, it is created a client. The *client* information are accessible from the CRUD, so it is possible to set a CMS page and change the permissions of the client directly from the CMS.

It returns 201 when client is correctly generated, 401 otherwise.

```sh
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
  }`
```

Example response:

```json
{
    "client_id": "rPxwZcgeFRJPgnnabMZrJWMemMBJjaSB",
    "client_id_issued_at": 1592229239
}
```

:::note
You can use [this guide](./jwt-private-public-key-generation.md) to generate JWT public and private key suitable for this operation.
:::

## The supported auth flow are

### Login flow

Below it is visible the sequence diagram of the login flow:

```mermaid
sequenceDiagram
title: Login client credentials

participant client
participant clcr_service
participant crud_service

# RFC (https://tools.ietf.org/html/rfc6749#section-4.4)

# Login
note over client: grant_type in body\nclient_id&client_secret in Basic header
# l'endpoint può essere diverso, nel caso cambiarlo tramite AG
client->>clcr_service: POST /oauth/token

# opzione credentials-service
clcr_service->>crud_service: GET {client_id,hash_client_secret}

clcr_service->>clcr_service: generate Mia JWT
note over clcr_service: iss: helvetia-idp\n sub: client-id\n aud: permessi\n exp: expiration\n iat: data di rilascio del jwt\n jti: id del jwt

clcr_service->>client: {access_token, expires_in, token_type}
```

### Authorization flow (internal client)

Below it is visible the sequence diagram of the authorization flow from internal client:

```mermaid
sequenceDiagram
title: Flusso di auth from a console project

participant client
participant api_gateway
participant authorization_service
participant clcr_service
participant resource_owner

# Solo AG frontend. Va gestita lo switch di auth da frontend a backoffice

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

note over authorization_service: authorization_service handle\n groups,client-type and isbackoffice in logical expression,\nwe should add permissions

authorization_service->>authorization_service: evaluate permissions

opt if have not the permission
authorization_service->>api_gateway: 401 with error
api_gateway->>client: 401 with error
end

authorization_service->>api_gateway: 200 \n {miauserid,miausergroups,miauserproperties,client-type}

api_gateway->>resource_owner: GET /foobar {Authorization Bearer AT} + platform headers
```

### Authorization flow (external client)

Below it is visible the sequence diagram of the authorization flow from external client:

```mermaid
sequenceDiagram
title: Flusso di auth from external with an AT

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
```

### Tokeninfo

Below it is visible the sequence diagram to access to the JWT info:

```mermaid
sequenceDiagram
title: Tokeninfo

participant client
participant clcr_service

# RFC (https://tools.ietf.org/html/rfc6749#section-4.4)

client->>clcr_service: GET /tokeninfo header Authorization Bearer AT
clcr_service->>clcr_service: check expiration
clcr_service->>clcr_service: check signature
clcr_service->>clcr_service: decode jwt
clcr_service->>client: {permission: []}
```
