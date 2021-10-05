---
id: overview_and_usage
title: JWT Token Validator
sidebar_label: Overview and Usage
---
The `JWT Token Validator` service allows verifying if a given JWT token is valid.

## Usage

The service exposes the `GET - /verify` endpoint to validate a JWT token.
The JWT token on the call is passed in the header `Authorization: Bearer <JWT token>`

The endpoint will return:
an error in case the token is malformed or is not valid,
the payload of the JWT, if valid.

## Configuration

To correctly work, the service needs a `configMap` configuration. 
The configuration is `json` with a **jwtConfig** field which is an array of objects.
Each object has the following fields:
**JWKSSignatureEndpoint**: the endpoint that returns a list of JWKS used to validate the signature of a JWT token.
**requiredClaims**: list of required claims.
**issuer**: issuer of the JWT
**audience**: a string or an array of strings that lists the audience. 
 
Following an example of the configuration:
```json
{
  "jwtConfig": [
    {
      "JWKSSignatureEndpoint": "https://endpoint-issuer/.well-known/jwks.json",
      "requiredClaims": "",
      "issuer": "issuer",
      "audience": "dih"
    },
    {
      "JWKSSignatureEndpoint": "https://endpoint-issuer-two/.well-known/jwks.json",
      "requiredClaims": "",
      "issuer": "issuer-two",
      "audience": [
		"dih"
	]
    }
  ]
}
```

The service also needs to have the following environment variables set:
`JWKS_ENCRYPTION_KEYS_PATH`: path to a `json` file that contains the JWKS used to decrypt a JWE token.
`ISSUER_CONFIGURATION_PATH`: path to the configuration (e.g. `/configs`).
`ISSUER_CONFIGURATION_FILENAME`: filename of the configuration, without the file extension (e.g. `./issuer-config`).

At the moment, it's only possible to support JWE supplied by a single issuer.
