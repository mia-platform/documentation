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
