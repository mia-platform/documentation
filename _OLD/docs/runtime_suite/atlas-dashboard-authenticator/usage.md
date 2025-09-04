---
id: usage
title: Customize the component
sidebar_label: Usage
---
The path of the GET `/login` call is fully customizable.

## Example

If you'd like to make the service callable at `/authorization` and the secret on your MongoDB Atlas Dashboard is `supersecret-secret`, you just need to set the environment variable in this way:

```json
{
  "LOGIN_ENDPOINT": "authorization",
  "AUTH_SECRET": "supersecret-secret"
}
```

You may need to expose the microservice to call it from external applications when using our console. In this case, remember that in your configuration you have to specify the entire endpoint to be called.

Suppose that, in the same example, you exposed this microservice on the `/atlas-dashboard-authenticator` route, in your configuration you'll have to specify `/atlas-dashboard-authenticator/authorization`.
