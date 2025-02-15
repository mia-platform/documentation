---
id: configuration
title: Mail Notifications Manager
sidebar_label: Configuration
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

This microservice allows to easily and safely set the status (read/unread) of one or more notifications belonging to the requesting user. It also allows to retrive the notifications of a user, hiding the information that relates to the notifications but not to the user (e.g. the list of users who has read a notification).

## Platform requirements

This service depends on a CRUD collection, whose path name and properties can be mostly configured,
but usually it is called notifications.
This also implies that, in order to work properly, the service needs the env variable CRUD_SERVICE_NAME that specifies the name of the CRUD service within the platform (usually it is crud-service).

## Notifications

This collection stores the sent notifications and their outcome. Fields:

**title**: string, the platform agnostic title

**body**: string, the platform agnostic message

**payload**: object, the platform agnostic custom payload that can be sent to apps

**platformSpecificContent**: platform (and library specific) fields that customize the notification

**destination**: object, a descriptor that contains the type of destination of the notification and the list of destinations for that type.

**outcome**: object, the outcome of the send

**userIds**: array, the list of user ids to whom the notification is destinated. This field is absent if destination.type is broadcast.

**readBy**: array, the list of users that have read the notification
