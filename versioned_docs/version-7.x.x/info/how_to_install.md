---
id: how_to_install
title: How to install Console
sidebar_label: How to install
---
Mia-Platform is always aware about the installation status of the Mia-Platform's suites.

Installation Process has to be managed by Mia-Platform or by a system-integrator partner.
Please find here below the installation process detailed:

* The client agrees with Mia-Platform which suite wants to install

* Mia-Platform prepares the configuration for the installation

* Mia-Platform provides an installation key

* The key is injected in the cluster configuration

* When the platform starts, the key is hashed and sent to activation service, hosted by Mia

* If the key is correct, the service provides the authorization and the platform starts

* If the key is corrupted or incorrect,the services don't start
