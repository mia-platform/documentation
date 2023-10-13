---
id: rtu_violates_unique_keys
title: The Real-Time Updater violates unique keys
sidebar_label: RTU violates unique keys
---

<!-- Task Jira FDBM-102 -->
<!--
USE CASE
In the System of Records we are receiving a combination of a delete and an insert ingestion message for 4 different records. The collection involved has a  secondary unique index that differs from the primary key one. To be able to update the unique key fields inside the records without violating the condition, they went on to delete all 4 the records on the original DB and then insert them again with updated values of the UK shortly after.
Our RTU looks like he’s ignoring the delete messages, going straight with the inserts, violating the UK and throwing an error. 
PAUSE_TOPIC_CONSUMPTION_ON_ERROR env variable is disabled, so the RTU will restart itself after the error.

This bug has been fixed with the new service Projection Storer. It was caused by the fact that the RTU executes a compaction of the messages having the same id, resulting in keeping only the insert messages, hence violating the unique key.

The solution is to try to pass to the new version of the projection storer. If that's not possible, unique indexes on non PK fields should be deactivated in the projections.
-->

## Problem

The Real-Time Updater violates unique keys on MongoDB. This usually happens when a combination of a delete and an insert ingestion message for the same record comes from the CDC, and the collection involved has a secondary unique index that differs from the primary key one.

## Cause

The RTU was executing a compaction of the messages having the same id, resulting in keeping only the insert messages, hence violating the unique key when trying to apply the update on the projections.

## Solution

There are two possible solutions to this problem:

1. Try to adopt the Projection Storer. This new plugin has a fix for this bug and should prevent it from happening.

2. If employing the new plugin is not possible, unique indexes on non-primary key fields should be deactivated in the projections. This will prevent the RTU from violating the unique key constraint.

### How to deactivate unique indexes on non-primary key fields

1. Go to the *Projections* page of the *Fast Data* section in the Console and select your System of Record.

2. In the *Projections* list, select the projection you want to edit.

3. In the **Indexes** section, click on the index tab that presents the unique constraint and deactivate the Unique checkbox.
