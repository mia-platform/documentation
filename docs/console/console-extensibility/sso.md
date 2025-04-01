---
id: extension-sso
title: Extensions Single Sign On
sidebar_label: Extensions Single Sign On
---

# **Extensions Single Sign-On (SSO) Integration**

The **Mia Platform Console** can serve as an **OAuth2 Authorization Server** for iframe-based extensions. When properly configured, this feature ensures that users logged into the Console are automatically authenticated in the embedded extension, eliminating the need for a second login.

Following is described how this Single Sign-On (SSO) process works and how to integrate it into your iframe extension.  

### **Process Overview**

#### 1. **Initiate the Login Flow**
   - The login flow begins when the user open the extension initial page. From this page of the extension the user is redirected to the following Console URL that triggers the login process:
     ```
     CONSOLE_BASE_URL/tenants/:tenantId/extension/:extensionId/authz?state={state}
     ```
     where
     - `state`: A value chosen by the developer to maintain session in the requests flow.
     - `tenantId`: ID of the Company
     - `extensionId` ID of the extension 

#### 2. **Redirect to the Extension Frontend**
   - As login process proceeds, the Mia Platform Console will redirect the user to the extension’s **callback URL**, appending the `code` and `state` query parameters.

#### 3. **Send Code and State from Frontend to Backend**
   - The extension frontend has a page registered on the *callback URL* route that receives the `code` and `state` query parameters. With these parameters, the extension calls its **backend** passing them for further processing.

#### 4. **Exchange Authorization Code for Access Token**
   - The extension's backend then makes a POST request to the Mia Platform Console’s token endpoint using `code` and `state` received:
     ```
     POST CONSOLE_BASE_URL/api/oauth/token
     ```
     - The request body should include the following:
       ```json
       {
         "code": "CODE",
         "state": "STATE"
       }
       ```

#### 5. **Receive Access Token**
   - The Console will respond with an **access token** that the extension backend return to its frontend and that can be uses to access protected resources in the backend.

#### 6. **Validate the Access Token**
   - The extension backend can validate the token by calling the following Console endpoint:
     ```
     GET CONSOLE_BASE_URL/jwks
     ```

---

### **Setup Steps**

Here is a review of the preliminary operations and the changes needed in the extension code to implement the SSO integration:

#### **Register an App for the Extension**
   - Register the extension app via an **API call**
   - Include the `callbackUrl`, which should be the full URL where users will be redirected as explained in [Redirect to the Extension Frontend](#2-redirect-to-the-extension-frontend).

#### **Develop the Extension Frontend**
  - Implement the redirect from the extension initial page to the Console page that trigger the login process (see [Initiate the Login Flow](#1-initiate-the-login-flow)).
  - Create a **callback page** within the extension’s frontend. This page should match the `callbackUrl` you defined during app registration. It will handle the `code` and `state` query parameters received from the redirect.

#### **Develop the Extension Backend**
  - Implement an endpoint in the extension's backend (e.g., `/token`) that communicates with the Console’s `CONSOLE_BASE_URL/api/oauth/token` endpoint. This allows the backend to exchange the authorization code for an access token.

---

By following these steps, you can seamlessly implement **Single Sign-On (SSO)** for your extensions using Mia Platform’s OAuth2 Authorization Server, ensuring secure user authentication and access to protected backend resources.