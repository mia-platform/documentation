# Auth0 client

This service handles authentication and user management using auth0 as an identity provider.

## How to use Auth0 client

This service exposes different endpoints to handle authentication: `/authorize`, `/oauth/token`, `/logout` and `/userinfo` endpoints. A `/users/me` endpoint is also exposed for backward compatibitity but its use is discouraged.

Moreover, it handles users through the auth0 users management api.
