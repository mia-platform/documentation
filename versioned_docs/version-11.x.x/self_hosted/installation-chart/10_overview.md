---
id: overview
title: Overview
sidebar_label: Overview
---
The Mia-Platform Console installation Chart is a Helm Chart that helps you installing Mia-Platform Console starting from some required configuration. The purpose of this documentation is to provide knowledge and understand all the possible configuration that can be provided to better customize your installation and to make the whole installation process as straightforward as possible.

## System Requirements and Dependencies

To install Mia-Platform Console make sure you meet the necessary installation requirements, you can find all the information you may need in the [Self-Hosted installation requirements documentation page](../../self_hosted/self_hosted_requirements).

Before starting with the installation make sure you have also addressed these requirements:

* Define the URLs on which the console (and its CMS) will be exposed;
* Prepare the connections needed to work with your authentication provider;
* Create a MongoDB cluster and have the connection string at hand to a DB with reading, writing and administrative privileges;
* Create a Redis cluster and have its host, username and password at hand;
* Configure a GCP KMS provider (or a local Master Key) for MongoDB client-side encryption;
* A JWT Token Signing Key and a passphrase for it
* Create the name of the secret with the credentials to your private docker repository;
* Define the hostname of your private docker repository;
* Create a connection to a bucket storage (either S3/GCP Storage/MongoDB GridFS) to be used by the Console to store files;
* Prepare one or more Git provider configurations. In particular you will need URLs and Access Tokens from service account that will be used by the Console for managing project configurations.

## Get access to the Mia-Platform Docker Registry

To be able to install Mia-Platform Console you will need access to the Mia-Platform Docker Container Registry which hosts both the Mia-Platform Console Installation Helm Chart and the container images for the application.

Ask you Mia-Platform referent how to get access and to obtain the necessary credentials.
