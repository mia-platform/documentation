# Migrate from v4 to v5

This is a guide to migrate the platform to the v5 version.

## Differences between v4 and v5

The main difference between the two versions of the platform relies in the API authorization checking method.

Previously the authorization rules were checked in `session-manager` (called by `api-gateway` auth request) through an acl expression. The acl expression was evaluated using the information contained in the session token and various other metadata included in the headers.
The correct expression was mapped in the api-gateway, given the method and the path. The `session-manager` always answer 200 with an header identifying if the user was allowed or not. The `api-gateway` checks the correct api host in proxyName map.

The `session manager` is replaced in v5 by the `authorization-service`. To see how this service works, read [the authorization service docs](/runtime_suite/authorization-service/how_to_use/). However, the `api-gateway` continues to verify the correct api host in proxyName map (which has changed, as following point 1 explains).


## How DevOps Console makes updating easier

When you go to the **Design** section of the DevOps Console v5 and you open a project that has not been updated yet, The DevOps Console v5 automatically handles some changes:

1. Convert `proxyName` and `backofficeProxyName` to the new map.
Changed from ```$secreted-$is_allowes-$is_user_logged-$original_request_method-$original_request_uri```
to
```$secreted-$is_allowes-$original_request_method-$original_request_uri```
2. Replaced `api-gateway` group expressions into `authorization-service` configuration.
3. If `auth-service` or `microservice-gateway` was enabled, authorization-service is set as enabled in the MongoDB of the project.

Before saving and deploying the new configuration, you **MUST** verify the correctness of the automatic upgrades. You should also test the permission to the api, since it has changed the way it is computed.
