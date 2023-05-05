---
id: usage
title: Client Credentials Usage
sidebar_label: Usage
---
import Mermaid from "./../../../src/components/Mermaid";

In this section, we show you how to use the `client-credentials` service.

## Endpoints

### POST /register

The register endpoint is used to register a new client by specifying its name and authentication method.  
In response it generates the client authentication data, which will depend on the chosen auth method. It follows the RFC to [register to a client](https://tools.ietf.org/html/rfc7591).

It returns 201 when credential pair and client is correctly generated, 401 otherwise.

This is a public endpoint meant to allow external applications to create a new client, without the privilege of setting its permissions or audience.  

:::info
To learn how to set specific authorization properties for the client, such as its permissions or audience, go to the [POST /clients endpoint](./20_usage.md#post-clients) section.
:::

Once the endpoint has been called, the client information will be saved in the CRUD with empty audience and permissions. You can add and change the fields manually on the CRUD or set up a CMS page and update them directly from the CMS.

The register endpoint accepts different [auth methods](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication). The supported methods are `client_secret_basic` and `private_key_jwt`, which differ by the details employed to verify client identity.  
The `client_secret basic` method is based on username and password, while the `private_key_jwt` method requires as input a signed JWT.

One client has only one method possible. The default method (if it is not passed during registration) is the `client_secret_basic`.

:::info
Learn more about the differences between these auth methods in the [Authentication methods](./20_usage.md#authentication-methods) section.
:::

Here are some examples of how to call this endpoint with the two different authentication methods:

#### Client secret basic

Example cURL request:

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
Note that the `client_secret` field will only be available during registration so make sure to save it locally.
:::

#### Private key JWT

To use this auth method, the `token_endpoint_auth_method` parameter in input should be set to `private_key_jwt`.

:::note
You can use [this guide](jwt_keys) to generate the necessary JWT public and private keys suitable for this operation.
:::

Example cURL request:

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

### POST /oauth/token
In the login flow, you should call the `/oauth/token` endpoint with method POST to authenticate your client.  
Every time a service account receives a new access token, its `lastLogin` field will be set to the time of generation of the token.

:::note
  Just like the [POST /register](./20_usage.md#post-register) endpoint, the available authentication methods are `client_secret_basic` and `private_key_jwt`.
:::

Here are some examples of how to call the `/oauth/token` endpoint with the two different authentication methods:

#### Client secret basic

Request must have a body in `x-www-form-urlencoded` containing:

* the `grant_type=client_credentials`
* the `audience` (required only if the **REQUIRED_AUDIENCE_IN_TOKEN_REQUEST** environment variable is set to `true`)

and a basic authorization header set as `Basic base64(clientId:clientSecret)`.

The client expected response is in `application/json` and contains:

* **access_token**: JWT signed with private key;
* **expires_in**: how many seconds the token is valid;
* **token_type**: type of the token. It is `Bearer`.

:::note
In case the `clientId` and `clientSecret` pair does not exist on the database, an Unauthorized error (HTTP code 401) is returned with a brief explanation.
:::

The resulting **access token** is structured as follows:

- the **header** contains, besides the *algorithm* adopted to generate the token and the token *type*, the `kid` field, an identifier used to address the correct signature key used in the token verification procedure.

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

Example cURL request:

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

Request must have a body in `x-www-form-urlencoded` containing the following parameters:

* **grant_type** set to `client_credentials`
* **client_assertion_type** set to `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
* **client_assertion** set to the *assertion JWT*
* **client_id** id of the client
* **token_endpoint_auth_method** select which authentication method is adopted (in this case it should be set to `private_key_jwt`)

The *assertion JWT* must contain:
- in the header, the `kid` field, whose value has been defined during the registration phase
- in the payload, the claims specified by [this spec](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication):

  * **iss** (*issuer*): client_id of the oauth client;
  * **sub** (*subject*): client_id of the oauth client;
  * **aud** (*audience*): the issuer given to client credentials;
  * **jti** (*jwt id*): a unique identifier of the token. The token must be used only once;
  * **exp** (*expiration time*): expiration time of the token, in unix timestamp;
  * **iat** (*issued at*): time at which the token is issued;
  * **requested_audiences**: an array of the requested audience.
  * *additional properties*: other properties to be added as custom claims into the JWT generated by the service.

:::caution
In case the *assertion JWT* does not contain all the detailed fields, it is considered invalid and the authentication is rejected with a Forbidden error (code 403 HTTP)
:::

:::caution
The additional properties must be allowed for the used client by adding them into the **allowedCustomClaims** list of strings
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
  "iat": 1604573964,
  "exp": 1604577564,
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
  "iat": 1604573964,
  "exp": 1604577564,
  "requested_audiences": [ "audience-1" ],
  "customerName": "Chester",
  "customerSurname": "Bennington"
}
```

**Generating the assertion JWT**

The following guide will help you generate a valid assertion JWT. Generation via command line is the safest way to do it, because you are not sharing your private key with any external service.

:::note
OpenSSL is required to run the commands
:::

First of all, you need to create the JWT header. To do so, you have to provide the Key ID obtained during the client creation process:

```shell
# create and encode jwt header
jwt_header=$(echo -n "{\"alg\":\"RS256\",\"typ\":\"JWT\",\"kid\":\"$kid\"}" | base64 | sed s/\+/-/g | sed 's/\//_/g' | sed -E s/=+$//)
```

Then, you can create the JWT payload, providing the correct claim values:

```shell
# create and encode jwt payload
jwt_payload=$(echo -n "{\"iss\":\"$issuer\",\"sub\":\"$issuer\",\"aud\":\"$audience\",\"jti\":\"$jti\",\"iat\":$issued_at,\"exp\":$expires_at}" | base64 | sed s/\+/-/g |sed 's/\//_/g' |  sed -E s/=+$//)
```

+Now you can sign the token with the private key previously stored in your local file system:

```shell
# create signature with openssl dgst using private key in local filesystem
signature=$(echo -n "${jwt_header}.${jwt_payload}" |  openssl dgst -sha256 -sign ${private_key_path} -binary | base64  | sed s/\+/-/g | sed 's/\//_/g' | sed -E s/=+$//)
```

At last, you can generate and print the assertion JWT that will be passed in the request:

```shell
# create the full token
jwt="${jwt_header}.${jwt_payload}.${signature}"
echo $jwt
```

Example of cURL request:

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

The Client Credentials service exposes the `.well-known/jwks.json` endpoint to obtain an object that contains an array of valid JWK values in its `keys` field. Those JWKs could be used to verify the signature of the JWT that is presented by a client to another service.

The order of the keys in the array does not have a specific meaning.

The JWK contains:

* **kid**: the Key ID. This key is set in the JWT header. You must use the key with same kid of your JWT to verify the signature. It is not possible to have multiple keys with the same `kid`;
* **use**: use of the JWK. For this service all the keys will be `sig` (signature);
* **alg**: algorithm used by the key. For this service, the `RS256` algorithm is used;
* **kty**: key cryptographic name (`RSA` for RSA keys);
* **n**: the modulus value of the RSA public key. It is represented as a Base64urlUInt-encoded value;
* **e**: the exponent value for the RSA public key. It is represented as a Base64urlUInt-encoded value.

Example cURL request:

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

Calling this endpoint passing a valid Mia-Platform JWT, it returns a 200 status code and an object containing the claims of the provided JWT.
Here the validity of the JWT is checked: if the JWT is missing in the request or if it is not valid, this endpoint returns 401.
If an audience is specified in the JWT, it will be verified against the audiences provided in `ACCEPTED_AUDIENCES` env variable.

Example cURL request:

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

## Client management endpoints

Some of the endpoints exposed by the Client Credentials service are meant to manage clients. These endpoints allow the caller to perform operations such as:

- Create a new client and set all of its properties, like permissions and audiences. The `register` endpoint does not allow the caller to set the new client permissions or audience because it is meant to allow external applications to create a new client without the privilege of assigning it specific authorization properties.

### POST /clients

This endpoint allows the caller to create a new client with certain authorization properties and with a certain state.

:::caution
Since this endpoint allows the caller to assign permissions and audiences of interest to a client, it should be used by internal services only and should not be made publicly available (contrary to the `/register` endpoint). Indeed, the `/clients` endpoint is designed to satisfy all the use cases where a client must be created automatically by some internal service.
:::

The `POST /clients` endpoint is very similar to the `POST /register` endpoint, as it accepts all the client information that are currently accepted by the latter, with the addition of the following client parameters:

- `permissions`: a list of permission identifiers which the client holds.
- `audience`: a list of audience identifiers which the client can communicate with.
- `__STATE__`: the initial CRUD state of the client being created.

:::info
**What is an audience?**

The audience of a service account refers to the intended recipient of a security token that is issued by an authorization server on behalf of the service account. The audience is typically expressed as a URI that identifies the specific service or application that the token is intended for.  
 By restricting the audience of a token to a specific service or application, you prevent the token from being used by unauthorized parties.
:::

:::info
To add custom metadata to the request you can use the `metadata` field in the request payload.
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

At the moment there's no endpoint exposed by the `client-credentials` service to update client settings, like `permissions` or `audience`.
Such an endpoint would be a simple proxy to the `PATCH /clients` endpoint of the `crud-service` that stores clients information in the first place.

For this reason, in order to update client settings, it is recommended to use the `PATCH /clients` endpoint exposed by the `crud-service` that must be deployed together with the `client-credentials` service.
The `crud-service` documentation is available [here](../../runtime_suite/crud-service/overview_and_usage).

## Authentication methods

The method used to verify the identity of a client can be of two types:
  - **Client Secret Basic**: the client includes its `client_id` and `client_secret` in the `Authorization` header of the request. The Authorization header value is a base64-encoded string containing the client id and secret in the format `client_id:client_secret`.  
  The server decodes the Authorization header value and verifies the client's identity by checking the client id and client secret against its own records.  

  The advantage of using Client Secret Basic authentication is that it provides a simple and standardized method of authenticating clients.

  - **Private Key JWT**: the client authenticates by signing a JWT (JSON Web Token) using its private key.  
  The client includes an assertion JWT in the authentication request, with specific claims set to appropriate values. The server then verifies the JWT by validating the signature using the client public key (obtained during client creation), and checking that the claims are valid and match its records.  
  
  This method provides better security than `client_secret_basic`, because the private key is never transmitted over the network neither shared with the server. However, it requires more setup and configuration on the client side to generate and manage the private and public keys.  

  We highly suggest to use this method whenever it is required not to share the credentials with the server or you cannot trust the network the client is using.

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
