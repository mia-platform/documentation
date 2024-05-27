---
id: audit_process
title: Audit Process
sidebar_label: Audit Process
---
## Audit Introduction

Mia-Platform reserves the right to audit the Client's environments in order to inspect that any usage of Mia-Platform product is licensed.  
Audit is necessary when the license is hosted on PaaS or On Premise by the client.

In particular, but not limited to, MIA srl shall inspect:

* if the amount of Production Nodes purchased is equal or higher than the amount of Production Nodes actually used;

* if the amount of Pre-production Nodes purchased is equal or higher than the amount of Pre-production Nodes actually used;

* if the number of Users - Editor, admin and developer - purchased is equal or higher than the number of Active Users;

* if the number of API CMS and API Console Requests is equal or higher than the number of Requests purchased.

* which components are installed on the Platform

Mia-Platform activates the Audit procedure with a written notice to the Client of
thirty (30) days.

## Requirements

Mia-Platform would need the following information for the audit:

* List of the name of the clusters that host Mia-Platform;

* History of the cluster configurations, starting from the last audit/installation. For this the Clients can choose between the two following options:
  1. Enabling AWS Config Service on the Kubernetes clusters: <https://aws.amazon.com/config/>;
  2. Providing Mia-Platform with a logging service where we can log periodically the sizing of the license.

## Process

We will perform the audit providing to the Client a script that will create a plain text file + hmac-sha256 report that the Client has to sent back to us.

The script needs a temporary full access to the Kubernetes API of the clusters.
