#Configure Auth0

Once you have created your project and want to enable user management on your Headless CMS or another application you will need to follow this short guide.

## Prerequisites

Before reading this guide, make sure you have the following conditions:

* in your project you must have auth0-client among the active services;
* you must have access to Auth0 to be able to configure it;
* you need to create a new tenant on Auth0 with your client's name.

## Step 1. Creating the applications

To manage your users on Auth0 you will need to create two applications:

1. the first of type **Regular Web Application** with a name that identifies your application. Ex: Name CMS. If you have applications differentiated by environment, obviously you will have to create an application for each environment;
2. the second of type **M2M** for user management. We advise you to call it "User Management CMS".

## Step 2. Configuring the callback pages

Still on Auth0, log in to your Regular Application and in the settings section set:

  * ** allowed callback url **: indicates where auth0 sends you back after logging in. For the cms the value to use is `BASE_URL / web-login / callback`;
  * **allowed web origin**: list of allowed origins from which you can log in;
  * **allowed logout url**: indicates the url callback of the logout. For cms the value to use is `BASE_URL / web-login`.

You must also configure the **allowed logout url** at Tenant level, then access the tenant settings (you can find them at the top right, where there is your user icon) and in the advanced area (the last tab on the right) insert the same **allowed logout url** that you have configured on the application.

## Step 3. Let's configure a Database for each environment

By default Auth0 has only Database active (you can find it in the Connections menu, Database section), if we wanted to have a single database for all users so we can also not follow this step.

To create multiple environments instead we must create multiple databases, one for each environment.
To create them, once accessed through the menu in the Connections and Database section, click on Create DB Connection and set a name for the database being created.

!!! warning
    N.B. Be careful to disable the possibility of signup (setting **Disable Sign Ups**) if you do not want users to be able to register independently to your application!

Once the database has been created, you must associate its DB with each application.
To do this, from the newly created database go to the *Applications* section and enable the applications that can use that database.

## Step 4. Let's configure the social login

This step depends entirely on your business and what you want your users to do.

!!! warning
    By default Auth0 also enables login with Google. To disable it, go to *Connections*, *Social* and disable the Google switch, which should be enabled.

Within the *Applications* in the **Connections** section you can choose for each application which social login to activate or deactivate.
To manage social logins on a global level inside the ** Connections ** section you will find the page **Social** choose what to enable and what not.


## Step 5. Management of the User Management application

To complete the management of users by our application:

1. Create an API: go to the APIs section and create an API that identifies the URL of your back office.
2. I access the User Management application created for user management and I authorize the Auth0Management API going to define in the permission area which actions I want to do on my application.
For user management, I should enable all the roles I find filtering by *user*


## Step 5. Management of the User Management application

To complete the management of users by our application:

1. Create an API: go to the APIs section and create an API that identifies the URL of your back office.
2. I access the User Management application created for user management and authorize the Auth0Management API by defining in the permission area which actions I want to do on my application.
For user management, I should enable all the roles I find filtering by *user*


3. Last step I have to create a custom RULES to enable the access of our namespace to user management.
Then access the ** Rules ** - **Create Rules** - **Empty-Rules** section, enter the name *inject-id-token* and copy the following function:

```javascript
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

4. Still in the RULES section, in the settings there is the possibility to add variables. You have to add the variable with key `MIA_NAMESPACE` (used in the function above). As `value`, you should use` https: // BASE_URL / `, replacing your tenant's identifying url. This url will never be called by Auth0, but it is used to finalize the information that is injected into the id-token of your users.

!!! warning
    Remember the value you enter here, it will be used for the next step and will no longer be visible!


## Step 6: Write the configurations on the Console

[Link on the console configuration guide](https://docs.mia-platform.eu/runtime_suite/auth0-client/configuration/)

Remember, when configuring the auth0-client, to reuse the value you used as `MIA_NAMESPACE` in the rule configured in the previous point.

e.g.
If I configure `MIA_NAMESPACE = https://my-platform.eu/`, in the configuration of the auth0-client I will have to set:

```Json
{
  // ... the other configurations,
  customClaimsNamespaces: [
      "Https://mia-platform.eu/app_metadata"
      "Https://mia-platform.eu/user_metadata"
  ]
}
```

## Enable your users

[To configure your users read the Auth0 documentation](https://auth0.com/docs/users/guides/manage-users-using-the-dashboard)


