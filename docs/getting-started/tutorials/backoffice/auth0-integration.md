---
id: basics
title: Backoffice Tutorial Basics
sidebar_label: Backoffice Tutorial Basics
---

# Mia-Platform Backoffice Integration with Auth0

In this tutorial, we will integrate the Backoffice with Auth0 that allow us to:
- setup a frontend where users can register or authenticate to get access to the Backoffice
- protect Backoffice pages using ACLs to grant access to certain users

## What We Will Build

Throughout this tutorial, we will:

- [Set Up the Microservices](#setup-the-microservices)
- [Customize the Backoffice Appearance](#customize-the-backoffice-appearance)
- [Create a Backoffice Table Page](#create-a-backoffice-table-page)
- [Connect the Page to the Backoffice Menu](#connect-the-page-with-the-backoffice-menu)
- [Save and Deploy the Backoffice](#save-and-deploy)

## Prerequisites

Before starting this tutorial, we need to be familiar with the concepts of the [Mia-Platform Backoffice](/business_suite/backoffice/10_overview.md) and have completed:
* The [Backoffice Tutorial Basics](/getting-started/tutorials/backoffice/basics.mdx).

This tutorial will follow the following:
* [Secure API Gateway](/runtime_suite_applications/secure-apigateway/overview)

## Setup the Microservices

You can install all the microservices for this tutorial using the `Secure API Gateway` application:
1. Go to Applications and click on the `Create New Application` button.
2. Search for `Secure ApiGateway` and click on the card.
![Secure ApiGateway Application Marketplace](img/basics_01-search-backoffice-application.png)
3. Follow the wizard, selecting if you want to install new microservices or use existing ones.
4. At the end, click the `Create` button and then save the new Application.

In order to handle the users on `Auth0` you need to install the `user-manager-service`:
1. Go to Microservices and click on the `Create a Microservice` button.
2. Search for `User Manager Service` and click on the card.
![User Manager Service Marketplace](img/basics_01-search-backoffice-application.png)
3. Choose the name of the service and then click the `Create` button.

## Configure the Microservices