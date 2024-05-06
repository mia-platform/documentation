---
id: configuration
title: Configuration
sidebar_label: Configuration
---
To configure the chat service it is necessary to deploy the docker image available as plugin in the Marketplace using the Mia Platform DevOps Console. Eventually, some configurations of environment variables and config maps are needed.

## Environment variables

* **`STREAM_API_KEY`** your Stream application's API key
* **`STREAM_API_SECRET`** your Stream application's API key secret
* **`STREAM_AUTH_TOKEN`** a JWT authentication token generated using the API key secret. Token must be a JWT token including a signature generated with the HS256 algorithm and an empty payload
* **`PERMISSIONS_VERSION`** either `1` or `2` (default is `2`)
* **`PERMISSIONS_CONFIG`** the location of the Stream permissions configuration file (e.g. `/home/app/permissions.json`) added into the project using a k8s config map. If no config map is provided, the default permission system is used
* **`STYLE_CONFIG`** the location of the style configuration file (e.g. `/home/app/style.json`) added into the project using a k8s config map.
* **`EXPIRATION_TOKEN_DURATION`** the duration (in seconds) of the token before it expires. If not set the token has no expiration.
* **`USERID_HEADER_KEY`** [required] the key inside the headers used to retrieve the userId of the logged-in user. When specifying the property with a dot notation, it will be assumed that the property is a nested property of a stringified object.
* For instance, `miauserproperties._id` will be considered as the property `_id` of a stringified object inside `miauserproperties`.

You can read more about API keys and tokens [here](https://getstream.io/chat/docs/rest/#api-keys-and-tokens).

### How to generate a JWT token

To generate a JWT token you can use [jwt.io](https://jwt.io/) or any other tool. The payload must be empty and the signature must be generated using the HS256 algorithm. Use the Stream API key secret as the secret key.

## Permissions

Permissions allow a high level of control over what users are allowed to do. There are two versions available: `v1` allows to define permissions by associating them to channel types (i.e. additional channel types can be created with their own separate set of permissions); `v2`, on the other hand, allows to define a role-based access control (RBAC). Permissions are updated at each service restart.

:::info

Please refer to the [documentation](https://getstream.io/chat/docs/node/chat_permission_policies/?language=javascript) for further instructions and differences between the two permission systems.

### Permissions v1 JSON schema

The permissions schema is a JSON object whose keys are channel types and their values are an array of Permission objects. Custom channel types are created and updated at each service restart.

* Example of the expected JSON type:

```json
{
  [key: ChannelType]: [
    {
      "name": string,
      "resources": string[],
      "roles": Role[],
      "owner": boolean,
      "action": "allow" | "deny",
      "priority": number
    }
  ]
}
```

```typescript
type ChannelType = 'messaging' | 'livestream' | 'team' | 'commerce' | 'gaming' | string

type Role = 'admin' | 'user' | 'guest' | 'anonymous' | 'channel_member' | 'channel_moderator' | string;
```

#### Ownership

_Owner_, as per Stream documentation, _is an optional field that you can use to match actions performed on objects that the user owns. Ownership only applies to some resources like messages and channels. When set to true the policy will only match if the user is owner of the resource part for the request (when applicable)_.

#### Default values

If not specified, the default resources value is `AnyResource`, the default role value is `AnyRole`, default owner value is `false` and default action type is `Allow`. A complete list of resources can be found [here](https://getstream.io/chat/docs/node/legacy_permissions/?language=javascript#permission-resources), while the default permissions for each channel type are listed [here](https://getstream.io/chat/docs/node/legacy_permissions/?language=javascript#default-permissions).

### Permissions v2 JSON schema

The Permissions v2 system is based on [three terms](https://getstream.io/chat/docs/node/user_permissions/?language=javascript#getting-started):

* `Subject` - an actor which attempts to perform certain Action. It could be represented by a User or by a ChannelMember
* `Resource` - an item that Subject attempts to perform an Action against. It could be a Channel, Message, Attachment or another User
* `Action` - the exact action that is being performed. For example `CreateChannel`, `DeleteMessage`, `AddLinks`

The concepts behind how permissions are checked are `Permission`, `Role` and `Grants`. Channel-level permissions are not supported whilst channel-type permissions are. In order to allow channel-level permissions it is possible to use APIs for a higher customization.

* Example of expected JSON type:

```json
{
  "app": {
    [role: Role]: Grant[]
  },
  [channel: ChannelType]: {
    [role: Role]: Grant[]
  }
}
```

```ts
type ChannelType = 'messaging' | 'livestream' | 'team' | 'commerce' | 'gaming' | string

type Role = 'admin' | 'user' | 'guest' | 'anonymous' | 'channel_member' | 'channel_moderator' | string
```

#### Roles

Custom roles are allowed and ensured to exist at service startup.

#### Grants

A reference about grants and default grants can be found [here](https://getstream.io/chat/docs/node/permissions_reference/?language=javascript). Grants are provided as array of strings and "revoke" modifiers are allowed using the exclamation mark `!` as grant prefix (e.g. `"!ban-user"` to ensure a specific role cannot ban users in the chat).

## Styles

It is possible to edit your client's style server-side by providing a theme object whose root keys are the client type (i.e. `web`, `mobile`, etc.) and values are specific object dependant on the UI SDK you are using.

As described in the [Overview](./10_overview_and_usage.md) section, calling the `/config?clientType=` endpoint with the right client type (e.g. `/config?clientType=web`) the service will return a theme object.
