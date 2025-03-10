---
id: overview_and_usage
title: JWT Token Validator
sidebar_label: Overview and Usage
---
The `JWT Token Validator` service allows verifying if a given JWT token is valid.

## Usage

The service exposes the `GET-/verify` endpoint that validates a JWT token.
The JWT token is passed to the endpoint inside the header `Authorization: Bearer <JWT token>`

The endpoint will return:

- if the JWT is valid, its payload,
- an error indicating that the JWT is malformed or is not valid, and why.

## Configuration

The service needs to be configured using the Mia-Platform Console.
The environment variables needed are:

- **JWKS_ENCRYPTION_KEYS_PATH**: path to the file containing all the information required to decrypt the JWE.
- **ISSUER_CONFIGURATION_PATH**: the runtime mount path of the `ConfigMap` containing the configuration file of the service (e.g. `./configs`).
- **ISSUER_CONFIGURATION_FILENAME**: the file name of the configuration (e.g. `./issuer-config`). It must be a `json` file. 
Note: remove the file format in the environment variable as the service will append `.json` at the end.

As described above, the service requires a `ConfigMap` configuration. 
The configuration is a `json` object with a **jwtConfig** field which is an array of objects.
Each object has the following fields:

- **JWKSSignatureEndpoint**: the endpoint supplied by the issuer that contains the public keys information in JWKS format. They are needed to validate the signature of the JWT token. 
- **requiredClaims**: list of required claims (e.g. `aud,iss`). It could be an empty string.
If a claim is not required, its validation will return true if the value is valid or is unset. 
These are the claims validated by the service: `exp`, `iat`, `nbf`, `aud`, `iss`. 
- **issuer**: the issuer of the JWT
- **audience**: a string or an array of strings that lists all the audiences. In case the JWT token inside its `aud` claim has different values from the ones defined in this field, it won't be valid. 
The `aud` claim identifies the recipients that the JWT is intended for. This means that the service tells that it's identifying itself with the defined value. 
- **customGroups**: array of strings that allow to set one or more custom groups to a issuer. The values are added to the response of the `/verify` when the issuer is in the JWT claims. In case the claim `groups` is already present in the JWT payload, a union of the values is returned. 

Given the example below, the service is identifying itself with a *dih* value for a JWT coming from the issuer *issuer-one*. Supposing that the JWT has an `aud` value that does not appear in the audience list, the JWT will be rejected as it is not meant for the service.
 
Following is an example of the configuration:
```json
{
  "jwtConfig": [
    {
      "JWKSSignatureEndpoint": "https://endpoint-issuer/.well-known/jwks.json",
      "requiredClaims": "aud,iss",
      "issuer": "issuer-one",
      "audience": "dih",
      "customGroups": []
    },
    {
      "JWKSSignatureEndpoint": "https://endpoint-issuer-two/.well-known/jwks.json",
      "requiredClaims": "",
      "issuer": "issuer-two",
      "audience": [
        "dih",
        "another_audience"
      ],
      "customGroups": [
        "groupA",
        "groupB"
      ]
    }
  ]
}
```

With this configuration, you can support as many issuers as you need for JWT tokens.
At the moment, it's only possible to support JWE supplied by a single issuer.
