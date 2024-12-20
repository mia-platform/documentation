---
id: overview
title: Auth0 Client
sidebar_label: Overview
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

This service handles authentication and user management using Auth0 as identity provider.

This service exposes different endpoints to handle authentication: `/authorize`, `/oauth/token`, `/refreshtoken`, `/logout` and `/userinfo` endpoints. A `/users/me` endpoint is also exposed for backward compatibility but its use is discouraged.

Moreover, it handles users through the auth0 users management api.

## How it works

The *Auth0 Client* service functions as a token broker, interfacing between your frontend application and Auth0.

Upon successful authentication with Auth0, we receive an authorization token which is securely stored and not shared with the frontend application.

Instead, a distinct, service-specific token is issued for user sessions. 

This method ensures secure separation of authentication tokens, safeguarding original provider credentials while facilitating controlled access to our services.
