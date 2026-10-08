---
id: overview
title: Oauth Login Site
sidebar_label: Overview
---



The Oauth Login Site plugin provides you the infrastructure to manage the login process of your application.

:::caution
This plugin will be generally available starting from the release in production of v14.0.2 of Mia-Platform Console (on July 10th)
:::

This service will handle the OAuth login flow for a user with managed redirection to your identity provider authorization page (where the user can enter the correct credentials) and the callback page where the flow is completed by invoking the standard `/oauth/token`.

In this way, you just have to define the flow of your login process and Oauth Login Site will take care of the rest.

Here is an example of a possible flow where a user logins into an application that uses Mia-Platform Oauth Login Site for the login process:

- A user wants to visit `/my-awesome-project/products` of your application but, since he is not authenticated, he is redirected to `/path/to/oauth-login-site` where Oauth Login Site is exposed.

- Once here, the user will be redirected once again to `/authorize`, where you should have configured your chosen third party identity provider.

- The user will type the required login information in your identity provider login page.

- In case of success, Oauth Login Site will make sure that the user obtains the necessary credentials (an access token, for example) by interacting with your identity provider.

- Once user credentials have been obtained, Oauth Login site will redirect him to `/my-awesome-project/products` and, since now the user is correctly authenticated, he is able to access your application.

:::info

If you want an in-depth description of how Mia-Platform authorization flow works after the login process visit the [authorization flow documentation](/products/console/project-configuration/auth-flow/authorization-flow.md)

:::
