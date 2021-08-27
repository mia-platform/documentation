---
id: release_note
title: Real-Time Updater
sidebar_label: Release Note
---

Here below you can read the release note of the Real-Time Updater service. Only the versions upper than 3.0.0 are available because the lowers versions are not compatible with the Console. 

## 3.1.2 (2021-07-21)

A bug that caused delete operations to be discarded if no value was found on the database has been fixed.

Added support for delta messages in the same bulk operations set

## 3.1.1 (2021-07-15)

A bug that prevented users to disable projections changes generation has been fixed. Now, if you set the environment variable `PROJECTIONS_CHANGES_ENABLED` to false, projections changes will not be generated when a projection is updated.

## 3.1.0 (2021-06-24)

Support to **Object** and **Array Of Object** fields for [Projections](../create_projection) has been added. You can now choose these types of fields in the [Projections Field](../create_projection#projection-fields) section of your Projection and set them to your own cast function or use the default one.

## 3.0.1 (2021-04-28)

In this version some minor fixes have been made.

