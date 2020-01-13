## How to enable Auth0 as identity provider in your project

1. In the project in mongodb, disable the unused service:
    * baas-legacy
    * login-site
    * session-manager
    * auth-service

    and enable:
    * auth0-client
    * oauth-login-site

2. Delete the configuration files of the disabledd services;

3. Log in to the console, go to Design Section -> Advanced section and create the `auth0-client` configuration from scratch as extension. To configure auth0-client, visit [the docs]('/runtime_suite/auth0-client/configuration/'). Configure also the env variables (`REDIS_HOSTS` is required).

4. Link correctly client-type and secret to use the correct auth0 client.

5. Configure auth0 correctly:
    * add rules to inject user metadata in id token:
      ```js
      function (user, context, callback) {
        const namespace = configuration.MIA_NAMESPACE;
        if (!user.app_metadata) {
          console.warn("WARNING: user.app_metadata is empty");
          return callback(null, user, context);
        }
        context.idToken[namespace + 'app_metadata'] = user.app_metadata;
        context.idToken[namespace + 'user_metadata'] = user.user_metadata;
        return callback(null, user, context);
      }
      ```

      MIA_NAMESPACE is a key written as `customClaimsNamespaces` in `auth0 client` config fill. e.g. `https://mia-platform.eu/`

    * configure the management client to handle user through the **headless cms**. The management client is an application machine 2 machine.

    * configure the required client application (remember to properly set allowed callback and logout url)

    * configure the allowed logout url by the tenant settings

6. To handle users through the **headless cms**, add in `cmsProperties.json` file extensions of `cms backend` service: [user collection]('/development_suite/api-console/api-design/download/users.json')

