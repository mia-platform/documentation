---
id: overview
title: Real-Time Updater
sidebar_label: Overview
---

The Real-Time Updater service consumes [kafka messages](https://kafka.apache.org/intro#intro_concepts_and_terms) in order to keep the fast data projection collections up to date with the connected system.

A Real-Time Updater service is automatically created when you create a new System.
After the new configuration has been saved, this service is visible as one of your services in the `Microservices` section.

## Projection Update

Two actions are necessary for the Real-Time Updater in order to correctly update its projections:

- You must define at least one custom field with the following flags set to true: **Primary Key**, **Required**.
- You must create an index using the previously defined custom field and set the flag **Unique** to true.

When a projection is updated, it changes a collection, called with the value of the following environment variable `PROJECTIONS_CHANGES_COLLECTION_NAME`, by inserting the information of the single view document to update as consequence of the projection update.

## Projection Deletion

When the Real-Time Updater deletes a document, it actually makes a **virtual delete** instead of a real document deletion. (the __STATE__ field is set to **DELETED**)

## Upsert

When performing Insert and Update operations, you can choose if you want to perform both operations as upserts, or differentiate between the two.

- For the Insert operation, upsert set to true means that it overwrites any previous value matching with the primary keys of the new document, false means it fails to insert documents that already exist, causing the service to stop.

- For the Update operation, upsert set to true means that if the document is not present it will be created with the new values, false means it fails when trying to update non-existing documents, causing the service to stop.

You can configure this behavior using the environment variable USE_UPSERT.
