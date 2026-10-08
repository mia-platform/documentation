---
id: environment-variables-introduction
title:  Environment Variables Introduction
sidebar_label: Environment Variables Introduction
---

An environment variable is a variable whose value is set outside the program, typically through a functionality built into the operating system or microservice.
An environment variable is made up of a name/value pair, and any number may be created and available for reference at a point in time.

Environment variables are excellent for decoupling application configurations. Typically, our applications require many variables to be set in order for them to work. By relying on external configurations, your app can easily be deployed on different environments. These changes are independent of code changes, so they do not require your application to be rebuilt to change.

They externalize all environment specific aspects of your app and keep your app encapsulated. Now you can run your app anywhere by modifying the environment variables without changing your code and without rebuilding it!

Some specific examples of common scenarios when you should consider using environment variables.

* Which HTTP port to listen on;
* What path and folder your files are located in, that you want to serve;
* Pointing to a development, staging, test, or production database.

## Variables providers

Environment variables are stored in external services that the Console can interact with. The supported services are:

- [Gitlab](https://gitlab.com) 
- [Vault](https://www.vaultproject.io/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault)

To use one service or another some configuration must be done at the project level.
