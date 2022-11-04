---
id: overview
title: Temporary Password Generator
sidebar_label: Overview
---
## Summary
The _Temporary Password Generator_ is a microservice that generates Temporary-Passwords associated with arbitrary data _(payload)_.
The generated codes may be subsequently consumed by the _Temporary Password Generator_ and be converted into JWTs.

The _Temporary Password Generator_ may be used to implement a passwordless-login flow:
1. The _Temporary Password Generator_ issues a code linked to the user details _(payload)_.
2. The code is sent to the user (e.g.: via SMS)
3. The user submits the received code to the _Temporary Password Generator_
4. The _Temporary Password Generator_ signs a JWT containing the user details _(payload)_ 

## Exposed endpoints

The service exposes three endpoints:
* _/create_ Used to generate a new code associated with a payload.
* _/verify_ Used to consume a previously-generated code and obtain its details and a signed JWT containing its data.
* _/public-key_ Used to retrieve the public key to verify the signed JWTs.

_/verify_ endpoint may be exposed on the Internet to be used by clients to exchange codes with JWTs.
