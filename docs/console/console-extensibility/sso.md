---
id: extension-sso
title: Extensions Single Sign On
sidebar_label: Extensions Single Sign On
---

# **Extensions Single Sign-On (SSO) Integration**

The **Mia Platform Console** can serve as an **OAuth2 Authorization Server** for iframe-based extensions. When properly configured, this feature ensures that users logged into the Console are automatically authenticated in the extension eliminating the need for a second login.

Following is described how this Single Sign-On (SSO) process works and how to integrate it into your iframe extension.  

### **Process Overview**

#### 1. **Initiate the Login Flow**
   - The login flow begins when the user navigates to the dedicated page in the extension detail section.
   To start the login flow directly from the extension frontend, you can programmatically navigate from any page within the extension to the URL
     ```
     CONSOLE_BASE_URL/tenants/:tenantId/extension/:extensionId/authz?state={state}
     ```
     where
     - `state`: A value chosen by the developer to maintain session in the requests flow.
     - `tenantId`: ID of the Company
     - `extensionId` ID of the extension 

#### 2. **Redirect to the Extension Frontend**
   - Once the login process is triggered, the Mia Platform Console will redirect the user to the extension’s **callback URL**, appending the `code` and `state` query parameters.

#### 3. **Send Code and State from Frontend to Backend**
   - The extension frontend receives the `code` and `state` query parameters and passes them to its **backend** for further processing.

#### 4. **Exchange Authorization Code for Access Token**
   - The extension's backend then makes a POST request to the Mia Platform Console’s token endpoint utilizing `code` and `state` reccived:
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
   - The console will respond with an **access token** that the extension frontend can use to access protected resources in the backend.

#### 6. **Validate the Access Token**
   - The extension backend can validate the token by calling the following endpoint:
     ```
     GET CONSOLE_BASE_URL/jwks
     ```

---

### **Setup Steps**

To complete the SSO integration, follow these setup steps:

#### 1. **Register an App for the Extension**
   - Register the extension app via an **API call**
   - Include the `callbackUrl`, which should be the full URL where users will be redirected as explained in [Redirect to the Extension Frontend](#2-redirect-to-the-extension-frontend).

#### 2. **Develop the Extension Frontend**
   - Create a **callback page** within the extension’s frontend. This page should match the `callbackUrl` you defined during app registration. It will handle the `code` and `state` query parameters received from the redirect.

#### 3. **Develop the Extension Backend**
   - Implement an endpoint in the extension's backend (e.g., `/token`) that communicates with the console’s `CONSOLE_BASE_URL/api/oauth/token` endpoint. This allows the backend to exchange the authorization code for an access token.

---

By following these steps, you can seamlessly implement **Single Sign-On (SSO)** for your extensions using Mia Platform’s OAuth2 Authorization Server, ensuring secure user authentication and access to protected backend resources.