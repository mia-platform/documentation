---
id: configuration
title: Client Credentials
sidebar_label: Configuration
---
The credentials service allow to expose API to perform OAuth2 compliant client credential flows with third party providers.

In this section, we show you how to configure the `client-credentials` service step by step.

## Step 1: Create the client collection

This service uses a [crud-service](../../runtime_suite/crud-service/overview_and_usage) collection to handle clients.

[Create a CRUD collection](../../development_suite/api-console/api-design/crud_advanced) in the MongoDB CRUD section of the Console with the name `clients` (you can choose also another name if already taken in your project), download <a download target="_blank" href="/docs_files_to_download/client-credentials/clients.json">this fields</a>, and import them into the Console ([here a docs on how to import fields](../../development_suite/api-console/api-design/crud_advanced#how-to-create-the-fields-of-your-crud-by-importing-a-json)).

:::info
We suggest you to create a unique index for the `clientId` field (which must not be duplicated).
:::

## Environment variables

This service is configurable with the following environment variables:

* **USERID_HEADER_KEY** (default to `miauserid`): name of the header carrying the identifier of the calling user;
* **ADDITIONAL_HEADERS_TO_PROXY** (default to `miauserid,miausergroups,miauserproperties`): list of comma separated header keys which will be proxied to any external http service the Client Credentials might call (for the moment, is just the CRUD Service). By default, the Client Credentials services proxies the following headers: `Request-Id`, `X-Request-Id`, `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Forwarded-Host`;
* **LOG_LEVEL** (default to `info`): level of the log. It could be trace, debug, info, warn, error, fatal;
* **HTTP_PORT** (default to `3000`): port where the web server is exposed;
* **SERVICE_PREFIX**: path prefix for all the specified endpoints (different from the status routes);
* **DELAY_SHUTDOWN_SECONDS** (default to `10` seconds): seconds to wait before starting the graceful shutdown. This delay is required in k8s to await for the dns rotation;
* **CRUD_CLIENT_BASE_URL** (*required*): base url to the crud collection containing the client information. Example: `http://crud-service/clients` where `clients` is the internal endpoint exposed for the `clients` collection created in the previous step;
* **CLIENT_ID_HASH_SALT** (*required*): static hash salt used to save the client id. For example, can be a random string of 256 characters;
* **CLIENT_SECRET_HASH_COST** (default to `10`): the cost to generate the hash of the client secret (using bcrypt);
* **CREDENTIALS_MONGODB_URL** (*required*): the mongo url pointing to the db which will handle the credentials information;
* **CREDENTIALS_COLLECTION_NAME** (default to `credentials`): collection to save the credentials information;
* **MONGODB_CREDENTIALS_DATABASE_NAME**: the mongo db name which will include the `credentials` collection. If not set, it is taken from the MongoDB URL configured in `CREDENTIALS_MONGODB_URL` env var;
* **PRIVATE_RSA_KEY_FILE_PATH** (*required*): path to mount the private rsa key. [Click here](#rsa-key-management) to see how to create it;
* **PRIVATE_KEY_PASSWORD**: password to decrypt the rsa key, if it is encrypted with a password. If it is empty, rsa key is treated as a non protected rsa key;
* **PRIVATE_RSA_KEY_ID** (*required*): id of the private key. It will be added to the *kid* of the generated JWT. This is a random string;
* **MIA_JWT_ISSUER** (*required*): string containing the issuer to fill the JWT claims. During the login flow, it is added as *iss*;
* **MIA_JWT_EXPIRES_IN** (*required*): expiration time for the generated JWT, in seconds;
* **REQUIRED_AUDIENCE_IN_TOKEN_REQUEST** (default to `false`): if audience is required in token request;
* **ACCEPTED_AUDIENCES**: audience accepted by the service, if included in JWT `aud` claim;
* **OPENID_CONFIG_PATH**: string representing the path to the file contaning the OpenId Connect Configuration.
* **REDIS_HOSTS** (*required*): redis host with port (default Redis port is 6379);
- **REDIS_USERNAME** (*optional*): the username to authenticate to Redis (only supported for `REDIS_MODE=normal`);
- **REDIS_PASSWORD** (*optional*): the password to authenticate to Redis (only supported for `REDIS_MODE=normal`);
* **REDIS_MODE**: defines the redis mode (`normal` or `sentinel`) (default: `normal`);
* **REDIS_MASTER_NAME**: defines the redis master name (required when using `sentinel` mode);
* **CLOCK_SKEW_SECONDS**: defines the skew seconds that will be used into the `/token` request to validate the **iat** and **notBefore** claims of the *client_assertion* and reduce client and server clocks misalignment

## RSA Key Management

### Creation

This service accept a **private RSA key** to sign the generated JWT.
NIST recommends at least 2048-bit keys for RSA. An RSA key length of at least 3072 bits should be used if security is required beyond 2030.
In this guide, we will use a key of 4096 bits.

To generate a new private key, you could run:

```sh
openssl genrsa -out ~/private.key 4096
```

The service also supports private keys with password. The password provided to the algorithm that generates the private key must be set as value for the `PRIVATE_KEY_PASSWORD` environment variable.
You could run the following command to generate the key with password:

```sh
openssl genrsa -des3 -out ~/private.key 4096
```

After the creation, you have the private key.

### Deploy key in the Kubernetes cluster

#### Configure the service volume from Console

In the Console, on the `client-credentials` service, add a new configuration of type secret named `client-credential-private-key` and set the mount path at `/configs`.  
Once this is done, set the environment variable `PRIVATE_RSA_KEY_FILE_PATH` value to `/configs/private.key` to configure it correctly.

#### Deploy with mlp

If you use [*mlp*](../../runtime_suite_tools/mlp/overview), the Mia-Platform deploy cli, to release custom secrets add these lines to the `mlp.yaml` file in your project:

```yaml
secrets:
  - name: "client-credential-private-key"
    when: "always"
    data:
      - from: "literal"
        key: "private.key"
        value: "{{PRIVATE_KEY}}"
```

If you use GitLab as CI tool, set the environment variable `PRIVATE_KEY` with the value of the private key (copy the value using `pbcopy < private.key`).

#### Configure the service volume manually

You should set the key as volume from secret in the `client-credentials` service.

This is an example to add a secret to a volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-pod
    image: my-image
    env:
      - name: PRIVATE_RSA_KEY_FILE_PATH
        value: /configs/private.key
    volumeMounts:
    - name: client-credential-private-key
      mountPath: "/configs"
      readOnly: true
  volumes:
  - name: client-credential-private-key
    secret:
      secretName: client-credentials-private-key
```

With this configuration the created pod will be mounted with the secret generated from file `private.key`; the mount path inside the container will be `/configs/private.key`. Make sure your configuration is correct by checking that this is the value you have set for `PRIVATE_RSA_KEY_FILE_PATH` environment variable.

#### Deploy directly in namespace

You should create the key as secret in kubernetes, using:

```sh
kubectl -n my-namespace create secret generic my-secret --from-file="~/private.key"
```

## OpenID Configuration

To expose correctly the OpenId discovery endpoint you should provide the configuration using a config map. This file must contain the exact JSON that the will be sent as response.

```yml
apiVersion: v1
data:
  config.json: '{ "issuer": "https://www.valid.url", ... }'
kind: ConfigMap
metadata:
  name: client-credentials
```

Now you have to load the config map inside a volume and mount that volume, as follows:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-pod
    image: my-image
    env:
      - name: OPENID_CONFIG_PATH
        value: /openid/config.json
    volumeMounts:
    - name: openid-config-volume
      mountPath: "/openid"
      readOnly: true
  volumes:
  - name: openid-config-volume
    configMap:
      name: openid-config
```

_Note: the custom configuration **MUST** contain at least every required field._

_**Required** fields:_
- _issuer_
- _token_endpoint_
- _jwks_uri_
- _response_types_supported_
- _subject_types_supported_
- _id_token_signing_alg_values_supported_

Reference: [OpenId Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata).

## Reference

* [oauth2 client-credentials RFC](https://tools.ietf.org/html/rfc6749#section-4.4)
* [JWS](https://tools.ietf.org/html/rfc7515)
* [JWE](https://tools.ietf.org/html/rfc7516)
* [JWK](https://tools.ietf.org/html/rfc7517)
* [JWA](https://tools.ietf.org/html/rfc7518)
* [JWT](https://tools.ietf.org/html/rfc7519)
* [OIDC client-credentials](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
* [Explanation of client credentials authentication methods](https://medium.com/@darutk/oauth-2-0-client-authentication-4b5f929305d4)
* [JWT profile for oauth2 client authentication](https://tools.ietf.org/html/rfc7523#section-2.2)
* [Registration of a client](https://tools.ietf.org/html/rfc7591)
* [Client assertions for `private_key_jwt` auth method](https://tools.ietf.org/html/draft-ietf-oauth-assertions-18)
* [JWT auth](https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-12)
