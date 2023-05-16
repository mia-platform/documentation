---
id: configuration
title: Temporary Password Generator
sidebar_label: Configuration
---
## Environment variables

The service needs the following environment variable:

- **PEM_PRIVATE_KEY_PATH** (required): the path to a PEM encoded private key used to sign JWT tokens.
- **OTP_HMAC_KEY** (required): A 32 bytes random string that will be used to hash the generated codes before being stored on CRUD.
- **OTP_CRUD_NAME** (optional, default to `otps`): Name of the CRUD used to store the issued codes.
- **CRUD_HOST** (optional, default to `crud-service`): the host of the crud-service.
- **LOG_LEVEL** (optional, default to `info`): level of the log. It could be trace, debug, info, warn, error, fatal.
- **HTTP_PORT** (optional, default to `3000`): port where the web server is exposed.
- **OTP_NUMERIC_ONLY** (optional, default to `false`): flag to enable only 6-digit numeric OTP.

## Create a CRUD
The _Temporary Password Generator_ stores the issued codes in a CRUD. You need to create it according to the following schema:

- _hashedCode_ : string, required.
- _scope_ : string, required.
- _payload_: object, required.
- _expiresAt_: date, required.

Add the required indexes:

- _hashedCode, scope_: unique
- _expiresAt_: ttl, 1. (Optional: useful if you want to delete the expired tokens)

Lastly, set the default CRUD state to **PUBLIC**

## Generate the private key
You can generate a 2048 bit pem encoded private key with the following command:

```bash
openssl genrsa -out privatekey.pem 2048
```
