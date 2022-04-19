---
id: release_note
title: Release Note
sidebar_label: Release Note
---
Here below you can read the release note of the CRUD Service. Only the versions upper than 3.2.0 are available. Lower versions are not recommended. 

## 4.1.0 (2021-07-06)

The regex pattern on the request schema for the query parameter **_p** has been removed. In this way you are able to make projection over nested fields.

## 4.0.0 (2021-06-17)

Add the support to change state of multiple documents using a filter and without knowing the `_id` of each one.  
This means that now the `POST /{collection}/state` route does not require the `_id` of each document to update.

Furthermore, it is important to note that this version has a breaking change. In fact the mongodb driver configuration has been updated in order to use the unified topology, and health checks have been updated accordingly.

## 3.2.3 (2021-04-29)

This version has a fix about the check on indexes that brought them to not be updated correctly.

## 3.2.2 (2021-03-04)

This version has just some dependencies updates. Timestamp in logs has precision in milliseconds instead of seconds.

## 3.2.1 (2021-01-29)

A fix has been made about PATCH requests with unset of ObjectId field, which did not work properly before.
