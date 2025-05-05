---
id: extension-sso
title: Extensions Single Sign On
sidebar_label: Extensions Single Sign On
---

# Extensions Single Sign-On (SSO) Integration

The Mia-Platform Console can serve as an **OAuth2 Authorization Server** for iframe-based extensions. When properly configured, this feature ensures that users logged into the Console are automatically authenticated in the embedded extension, eliminating the need for a second login.

Here below you can read how to enable this feature via Console and how the flow for the SSO integration works within your iframe extension.

## Feature Overview

With SSO enabled, users who are authenticated in the Mia-Platform Console do not need to log in again when accessing the extension embedded within the Console. This seamless experience improves user convenience and security by leveraging OAuth2 authentication.

To enable and configure this feature, you can use the Console interface, specifically within the extension’s detail section. After enabling the feature, you will provide a **Callback URL**, which is the route in your extension that will receive the OAuth2 authorization code for further processing and where the Console will redirect the user after completing the login process.

The steps to enable SSO on your extension are therefore the following:

- Go to the detail page of your iframe-based extension.
- In the "Console Single Sign-On" section, enable the toggle to activate SSO support.
- Once enabled, you must provide the Callback URL

## Login Flow

1. **Initiate the Login Flow**
   - The login flow begins when the user opens the initial page of the extension. From this page, the user is redirected to the following Console URL that triggers the login process:
   
     ```
     CONSOLE_BASE_URL/tenants/:tenantId/extension/:extensionId/authz?state={state}
     ```
   
     Where:
     - `state`: A value chosen by the developer to maintain session in the requests flow.
     - `tenantId`: ID of the Company.
     - `extensionId`: ID of the extension.

2. **Redirect to the Extension Frontend**
   - As the login process proceeds, the Mia-Platform Console will redirect the user to the extension’s **Callback URL**, appending the `code` and `state` query parameters.

3. **Send Code and State from Frontend to Backend**
   - The extension’s frontend has a page registered on the callback URL route that receives the `code` and `state` query parameters. With these parameters, the frontend sends them to its backend for further processing.

4. **Exchange Authorization Code for Access Token**
   - The backend then makes a `POST` request to the Mia-Platform Console’s token endpoint:
   
     ```
     POST CONSOLE_BASE_URL/api/oauth/token
     ```
   
     The request body should include the following:
   
     ```json
     {
       "code": "CODE",
       "state": "STATE"
     }
     ```

5. **Receive Access Token**
   - The Console will respond with an access token. The extension's backend returns this token to its frontend, where it can be used to access protected resources in the backend.

6. **Validate the Access Token**
   - The extension backend can validate the token by calling the following Console endpoint:
   
     ```
     GET CONSOLE_BASE_URL/jwks
     ```

## Setup Steps

1. **Enable SSO from the Console UI**
   - Go to the extension detail page in the Console.
   - In the "Console Single Sign-On" section, toggle the switch to enable the feature.
   - After enabling SSO, you’ll be able to insert the **Callback URL** directly in the UI. This URL is where users will be redirected after logging in to the Console.

2. **Develop the Extension Frontend**
   - Implement the redirect from the extension’s initial page to the Console page that triggers the login flow (as explained in the Login Flow section).
   - Create a callback page within your extension’s frontend to handle the `code` and `state` query parameters. This page should match the **Callback URL** you defined in the Console when enabling SSO.

3. **Develop the Extension Backend**
   - Implement an endpoint in your extension's backend (e.g., `/token`) to exchange the authorization code for an access token. This will communicate with the Console’s `/api/oauth/token` endpoint.
   - Ensure that the backend can validate the received access token by calling the Console’s `/jwks` endpoint.

By following these steps, you can seamlessly implement **Single Sign-On (SSO)** for your iframe extensions using Mia-Platform’s OAuth2 Authorization Server. This provides a secure and user-friendly authentication mechanism for your users, allowing them to access your extension without needing to log in again after authenticating with the Console.








Flow overview
- login process starts when  the page `/authz` is reached from inside the extension iframe
- the console generate the `code` and redirects to the page `callbackUrl` of the extension
- the extension can now obtain the token contacting the API `/token`. The extension frontend cannot contact this api directly but via its backend non to incur in CORS errors
- the token is generated and can be used by the extension to further processing (i.e. can be stored in localStorage and send to subsequent calls to its backend) 
- to verify the token the extension backend can call /jkws API, a further check is checking the audience to check that the token is the one generated for that specific extension (the audience must contains the entryUrl of the extension)

Setup steps
- first the extension sso must be enabled and configured with the callbackUrl (more on this in following points) 
- to trigger the login process the extension frontend must navigate to /authz. Tipically this can be done by a manual action (i.e. click on a login button), or programmatically (the details of how this is made are left to the extension developer)
- As the login process continue the extension page in the iFrame is redirected to the callback page configured via the callbackUrl. This page must exist in the extension frontend. and it must be developed so that it reads two query params (`state` and `code`) from URL
The obtained params are necessary to continue in the process of obtaining a valid JWT token. 
To obtain the token a call must be executed to the `/token`. This call must be made by the extension backend  endpont it must call the extension backend passing them to obtain the token
- in the extension BE must be implemented the API that is used to obtain the token (previous point). This API is a Pass-through to contact CONSOLE /token API. the parameters needed are `state` and `code` and a valid token is returned
- once obtained a valid token it can be used by the extension to authorize the subsequent calls. It tipically will be attached to each calls that the extension FE makes to the extension BE API, and the backend can check the token validity calling /jkws console API (and verify that the audience claim is the expected one)

