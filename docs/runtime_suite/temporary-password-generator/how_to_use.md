---
id: how_to_use
title: How to use
sidebar_label: How to use
---
Once the _Temporary Password Generator_ is configured, you can start issuing password:

## Create a code
To issue a new code, send a `POST` request to the `/create` endpoint with the JSON payload to be associated to the code.

The endpoint accepts a JSON body with the following mandatory parameters:
* _scope_: (Example: `web-app-login`) The scope is used to distinguish codes requested by different applications. 
* _ttl_: (Example: `180`) Specifies the Time To Live of the issued code in seconds. The code and the issued JWT will expire `ttl` seconds after the `/create` endpoint replies.
* _payload_:* A required, empty-allowed, JSON object to be associated with the generated code.

_Example Request_
```bash
curl -X POST "http://127.0.0.1:3000/create" -d "{ \"scope\":\"web-app-login\", \"ttl\":180, \"payload\":{ \"key\":\"value\" } }"
```
_Response_
```json
{"code":"10b1dca7-e626-4169-9f0c-8d7e3fdc49e5"}
```

## Verify a code
To verify and consume a code, a `GET` request may be sent to the `/verify` endpoint.

The endpoint accepts the following mandatory query parameters:

* _scope_: (Example: `web-app-login`) The scope is used to distinguish codes requested by different applications. 
* _code_: (Example: `10b1dca7-e626-4169-9f0c-8d7e3fdc49e5`) The code to be validated and exchanged with a JWT token.

_Example Request_
```bash
curl -X GET "http://127.0.0.1:3000/verify?scope=web-app-login&code=10b1dca7-e626-4169-9f0c-8d7e3fdc49e5" 
```
_Response_
```json
{
   "accessToken":"XXXXXX.YYYYYY.ZZZZZ",
   "payload":{
      "key":"value"
   },
   "expiresAt":"2021-04-29T16:12:08.704Z"
}
```

The endpoints reply contains the payload both as plain value and JWT (`accessToken`). The code and the JWT both expire at the same moment.

## Verify the JWT
You can verify the signature of the JWT by mean of the public key exposed on the endpoint `/public-key`.

_Example Request_
```bash
curl -X GET "http://127.0.0.1:3000/public-key" 
```
_Response_
```json
{
   "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFA..."
}
```
