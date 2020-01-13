# Configuration

## Configuration

The configuration must follow the schema described in [json schema config](https://git.tools.mia-platform.eu/platform/core/auth0-client/blob/master/serviceconfig/config.schema.json) file.

Clients are indexed by their client type name; please note that the default client is only used when there's no specified client in the request and the default client is configured.
If a wrong/malicious/misconfigured client is being used in the request then the response will be immediately rejected with Unauthorized (401) status code.

### Example of configuration

```json
{
  "clients": {
    "cms": {
      "auth0Url": "my auth0 url",
      "clientId": "{{AUTH0_CLIENT_ID}}",
      "clientSecret": "{{AUTH0_CLIENT_SECRET}}",
      "redirectUrl": "https://my-host/web-login/callback",
      "scopes": [
        "offline_access",
        "profile",
        "email",
        "website"
      ],
      "audience": "https://my-host.test.mia-platform.eu"
    }
  },
  "defaultClient"s: "",
  "managementClient": {
    "auth0Url": "my auth0 url",
    "clientId": "{{AUTH0_MANAGEMENT_CLIENT_ID}}",
    "clientSecret": "{{AUTH0_MANAGEMENT_CLIENT_SECRET}}"
  },
  "customClaimsNamespaces": [
    "https://mia-platform.eu/app_metadata",
    "https://mia-platform.eu/user_metadata"
  ]
}
```

### Supported redis modes

This service handles the session saving into redis either the session id or the access token.

You must configure it through these env variables:

* `REDIS_HOSTS` [**required**]: comma separated list of redis hosts. If port is not specified, use default port (6379);
* `REDIS_MODE` [**required**] (default: *normal*): available values are `normal` or `sentinel`;
* `REDIS_MASTER_NAME` [**optional**]: master name if redis mode is sentinel; in normal mode this variable is ignored.

Session created could have a scope, settable through `SESSION_SCOPE` env variable.

### Sync user metadata into mongodb

Usign this service, user are saved only in auth0 database. If links to user id are required in a project, you could sync auth0 user metadata in a mongodb collection.

This feature is disabled by default, but you could activate adding all those envs:

* `MONGO_DB_URL` [**optional**]: mongodb url to connect to your mongo instance;
* `USERS_DATABASE_NAME` [**optional**]: mongodb database name where you want to save user metadata;
* `USERS_COLLECTION_NAME` [**optional**]: mongodb collection name where you want to save user metadata;
* `USERS_PROPERTIES_TO_SAVE` [**optional**]: comma separated list of properties to mantain in sync.
