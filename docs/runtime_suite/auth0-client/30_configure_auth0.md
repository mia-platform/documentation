---
id: configure_auth0
title: Configure Auth0
sidebar_label: Configure Auth0
---
Once you have created your project and want to enable user management on your Headless CMS or another application you will need to follow this short guide.

## Prerequisites

Before reading this guide, make sure you have the following conditions:

* in your project you must have `auth0-client` as an active service;
* you must have access to Auth0 to be able to configure it;
* you need to create a new tenant on Auth0 with your client's name.

## Step 1. Create the applications

To manage your users on Auth0 you will need to create two applications:

1. the first of type **Regular Web Application** with a name that identifies your application (i.e.: CMS). If you have applications differentiated by environment, you will have to create an application for each environment;
2. the second of type **Machine to Machine** for user management. Our suggestion is to name it "User Management CMS".

## Step 2. Configure the callback pages

Still on Auth0, in the settings section of your Regular Application set:

* **allowed callback url**: indicates where auth0 sends you back after logging in. For CMS the value to use is `https://${CMS_HOSTNAME} / web-login / callback`;
* **allowed web origin**: list of allowed origins from which you can log in;
* **allowed logout url**: indicates the url callback of the logout. For CMS the value to use is `https://${CMS_HOSTNAME} / web-login / callback`.

You must also configure the **allowed logout url** at Tenant level, then access the tenant settings (you can find them at the top right, where there is your user icon) and in the advanced area (the last tab on the right) insert the same **allowed logout url** that you have configured on the application.

## Step 3. Configure a Database for each environment

By default Auth0 has one Database active (you can find it in the Connections menu, Database section), so if you only need a single database for all users skip this step.

To create multiple environments instead we must create multiple databases, one for each environment.
To create them, once accessed through the menu in the Connections and Database section, click on Create DB Connection and set a name for the database being created.

:::warning
Be careful to disable the possibility of sign up (setting **Disable Sign Ups**) if you do not want users to be able to register independently to your application!
:::

Once the database has been created, you must associate its DB with each application.
In order to do this, from the newly created database go to the *Applications* section and enable the applications that can use that database.

## Step 4. Configure the social login

This step depends entirely on your business and what you want your users to do.

:::warning
By default Auth0 also enables login with Google. To disable it, go to *Connections*, *Social* and disable the Google switch, which should be enabled.
:::

Within the *Applications* in the **Connections** section you can choose for each application which social login to activate or deactivate.
To manage social logins on a global level inside the **Connections** section you will find the page **Social** choose what to enable and what not.

## Step 5. Configure User Management application

To complete the management of users by our application:

1. Create an API: go to the APIs section and create an API that identifies the URL of your backoffice.

2. Access the User Management application created for user management and authorize the Auth0Management API by defining in the permission area the actions allowed for your application.
For user management, enable all the roles found filtering by *user*.

:::note Access Token and ID Token
Be aware of the fact that the **token expiration** of these tokens must be the **same**.

**Access Token**: Go to `Dashboard > APIs` and click the created API. Locate the `Token Expiration` (seconds) field. Default value is **86400 seconds** (24 hours), maximum value is **2592000 seconds** (30 days).

**ID Token**: Go to `Dashboard > Applications` and click the right application. Scroll to **Token Lifetime Settings** and locate the `ID Token Expiration` (seconds) field. Default value is **36000 seconds** (10 hours). One of the purposes of the ID Token is to improve user experience by caching user information.
:::

3. As last step create a custom action to enable the access of our namespace to user management.
Then access the **Actions** - **Flows** - **Login** - **Add Action** - **Build Custom** section, enter the name *inject-id-token* and copy the following function:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const { user, secrets} = event;
  const { MIA_NAMESPACE } = secrets;
  const { app_metadata, user_metadata } = user;

  if (!app_metadata) {
    console.warn('WARNING: user.app_metadata is empty');
    return;
  }

  api.idToken.setCustomClaim(`${MIA_NAMESPACE}app_metadata`, app_metadata);
  api.idToken.setCustomClaim(`${MIA_NAMESPACE}user_metadata`, user_metadata);
};
```

4. Still in the ACTIONS section, in the settings you can add secrets. Add a secret with key `MIA_NAMESPACE` (used in the function above). As `value`, you should use` https: // BASE_URL / `, replacing your tenant's identifying url. This url will never be called by Auth0, but it is used to finalize the information that is injected into the id-token of your users.

:::warning
Remember the value you enter here: it will be used for the next step and will no longer be visible!
:::

## Step 6. Configure Logout URLs

This configuration is typically used by your CMS to log out the user but it can be used for other web applications too.

While still on Auth0 management dashboard, in the _Advanced_ tab from the _Tenant Settings_ section, edit the Allowed Logout URLs fields including the logout URLs required by your application.

The following template is applicable for allowing CMS logout in most projects:

```
https://cms.<tenant>.test.mia-platform.eu/web-login, https://cms.<tenant>.preprod.mia-platform.eu/web-login, https://cms.<tenant>.cloud.mia-platform.eu/web-login
```

## Step 7: Write the configurations on the Console

Follow this [link](./20_configuration.md) to learn how to configure the Auth0 Client.

Remember, when configuring the auth0-client, to reuse the value you used as `MIA_NAMESPACE` in the action configured in the previous point.

e.g.
If you set `MIA_NAMESPACE = https://mia-platform.eu/`, then configure the `auth0-client` `config.json` using the Advanced section of Console, by adding the following property:  

```Json
{
  // ... the other configurations,
  customClaimsNamespaces: [
      "https://mia-platform.eu/app_metadata"
      "https://mia-platform.eu/user_metadata"
  ]
}
```

:::warning
  To access the user profile you must insert in the scope: **profile**.

  Otherwise, Auth0 will respond with an empty ID Token.

  ```json
  "scopes": [
    "profile",
  ],
  ```

:::

## Step 8: Enable your first user to access CMS

In order to enable your first user to access CMS you need to go to Auth0 User Management dashboard and edit your user. Go to the section `app_metadata` and add the following JSON:  

```Json
{
  "groups": [
    "admin"
  ]
}
```  

Now your user has the required permissions for accessing CMS. From now on you can assign users to groups using CMS.
  
## Enable your users

[To configure your users read the Auth0 documentation](https://auth0.com/docs/users/guides/manage-users-using-the-dashboard)
