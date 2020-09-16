---
id: configuration
title:  Configuration
sidebar_label: Configuration
---
This service is configurable with env variables.

## Environment variables

The environment variables accepted by this service:

* **LOG_LEVEL** (defaults to `info`): level of the log. It could be trace, debug, info, warn, error, fatal;
* **HTTP_PORT** (defaults to `3000`): port where the web server is exposed;
* **SERVICE_PREFIX**: path prefix for all the specified endpoints (different from the status routes);
* **SERVICE_VERSION**: version of the service;
* **DELAY_SHUTDOWN_SECONDS** (defaults to `10` second): seconds to wait before starting the graceful shutdown. This delay is required in k8s to await for the dns rotation;
* **CRUD_CLIENT_BASE_URL** (*required*): base url to the crud colection containing the client information;
* **CLIENT_ID_HASH_SALT** (*required*): static hash salt used to save the client id;
* **CLIENT_SECRET_HASH_COST** (defaults to `10`): the cost to generate the hash of the client secret (using bcrypt);
* **CREDENTIALS_MONGODB_URL** (*required*): the mongo url pointing to the db which will handle the credentials information;
* **MONGODB_CREDENTIALS_DATABASE_NAME** (*required*): the mongo db name which will include the `credentials` collection;
* **PRIVATE_RSA_KEY_FILE_PATH** (*required*): path to mount the private rsa key;
* **PRIVATE_KEY_PASSWORD**: password to decrypt the rsa key, if it is encrypted with a password. If it is empty, rsa key is treated as a non protected rsa key;
* **PRIVATE_RSA_KEY_ID** (*required*): id of the private key. It will be added to the *kid* of the generated JWT;
* **MIA_JWT_ISSUER** (*required*): string containing the issuer to fill the JWT claims. During the login flow, it is added as *iss*;
* **MIA_JWT_EXPIRES_IN** (*required*): expiration time for the generated jwt, in seconds;
* **CREDENTIALS_COLLECTION_NAME** (defaults to `credentials`): collection to save the credentials information;
* **REQUIRED_AUDIENCE_IN_TOKEN_REQUEST** (default to `false`): if audience is required in token request;
* **ACCEPTED_AUDIENCES**: audience accepted by the service, if included in JWT `aud` claim.

## RSA Key Management

### Creation

This service accept a **private RSA key** to sign the generated jwt.
NIST recommends 2048-bit keys for RSA. An RSA key length of 3072 bits should be used if security is required beyond 2030.

To generate a new private key, you could run:

```sh
openssl genrsa -out ~/private.key 4096
```

The service also supports private keys with password. The password provided to the algorithm that generates the private key must be set as value for the `PRIVATE_KEY_PASSWORD` environment variable. You could run the following command to generate the key:

```sh
openssl genrsa -des3 -out ~/private.key 4096
```

After the creation, you have the private key.

You should create the key as secret in kubernetes, using:

```sh
kubectl -n my-namespace create secret generic prova-secret --from-file="~/private.key"
```

### Configure the service volume

You should set the key as volume from secret in the `client-credentials` service.

This is an example to add a secret to a volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: my-image
    env:
      - name: PRIVATE_RSA_KEY_FILE_PATH
        value: /configs/private.key
    volumeMounts:
    - name: private-key
      mountPath: "/configs"
      readOnly: true
  volumes:
  - name: private-key
    secret:
      secretName: client-credentials-private-key
```

With this configuration, with the secret generated from file `private.key`, in will be mount to the pod in `/configs/private.key`. To complete the configuration, you should set this path as value of `PRIVATE_RSA_KEY_FILE_PATH` env var.

## Reference

* [oauth2 client-credentials RFC](https://tools.ietf.org/html/rfc6749#section-4.4)
* [JWS](https://tools.ietf.org/html/rfc7515)
* [JWE](https://tools.ietf.org/html/rfc7516)
* [JWK](https://tools.ietf.org/html/rfc7517)
* [JWA](https://tools.ietf.org/html/rfc7518)
* [JWT](https://tools.ietf.org/html/rfc7519)
* [OIDC client-credentials](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
* [Explaination of client credentials authentication methods](https://medium.com/@darutk/oauth-2-0-client-authentication-4b5f929305d4)
* [JWT profile for oauth2 client authentication](https://tools.ietf.org/html/rfc7523#section-2.2)
* [Registration of a client](https://tools.ietf.org/html/rfc7591)
* [Client assertions for `private_key_jwt` auth method](https://tools.ietf.org/html/draft-ietf-oauth-assertions-18)
<<<<<<< HEAD
=======
* [JWT auth](https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-12)
>>>>>>> master
