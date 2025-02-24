---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.3] 2024-12-18

### Fixed

- Fixed reminders scheduled in the past

## [2.4.2] 2024-12-03

### Fixed

- Fixed appointment reminders aborting

## [2.4.1] 2024-11-12

### Fixed

- Add logs to debug reminders aborting
- Notification settings without the `rule` field are treated as sending rules when merging

## [2.4.0] 2024-10-29

### Added

- Add notification messages MongoDB view
- Add `NOTIFICATIONS_MESSAGES_VIEW_NAME` environment variable to configure the notification messages MongoDB view

### Changed

- `GET /notification-messages/count` is a proxy to the `GET /count` endpoint of the notification messages MongoDB view
- `GET /notification-messages/` is a proxy to the `GET /` endpoint of the notification messages MongoDB view

### Fixed

- Sanitize logs that could leak sensitive or personal information
- Replace newline escape sequences (`\n`, `\n\r`, `\r` and `\r\n`) with `<br/>` tag in HTML email messages

## [2.3.0] 2024-06-11

### Fixed

- Fixed bug causing errors when sending attachments via email

### Added

- Add custom helper to format values according to locale
- Add DEFAULT_LOCALE environment variable
- Add support for custom email attachments to notification events API
- Add endpoint `GET /notifications/count`
- Add endpoint `GET /notification-settings/count`
- Add `USERS_API_ENDPOINT` environment variable and integration with external module for users management
- Add `GET /templates/` endpoint
- Add `GET /templates/:id` endpoint
- Add `GET /templates/count` endpoint
- Add `POST /templates/` endpoint
- Add `PATCH /templates/:id` endpoint
- Add `DELETE /templates/:id` endpoint
- Add `POST /templates/state` endpoint
- Add `GET /notification-messages/` endpoint
- Add `GET /notification-messages/count` endpoint
- Add `POST /notification-settings/state` endpoint

### Changed

- `POST /notification-events/` accepts custom fields in the request body that are merged into the event payload
- Change validation to endpoint `POST /notification-settings`
- Change validation to endpoint `PATCH /notification-settings/:id`
- Remove required CRUD properties from event settings schema, remove `templateName` from required notification message schema

## [2.2.0] 2024-03-28

- Update Node.js to v20 (LTS)

### Added

- Update service configuration to support direct push notifications
- Build direct push notifications using Firebase
- Send direct push notifications using Firebase

## [2.1.1] 2024-02-26

- Fix notification settings changing 'role' with 'rule'

## [2.1.0] 2024-01-05

### Added

- Add `PATCH /user/notification-settings` endpoint
- Add `GET /event-settings/` endpoint
- Add `POST /event-settings/` endpoint
- Add `PATCH /event-settings/:id` endpoint
- Add `DELETE /event-settings/:id` endpoint

### Changed

- The POST /send endpoint now supports the new field **emailSender** to overwrite the sender set in the service config.
- Compile event schemas only once
- Update IC Resource Forbidden Event handler to fetch users from notification settings
- Add supported and enabled channels to the `GET /user/event` endpoint
- `PATCH /user/notification-settings` returns a 400 error if user tries to patch an unsupported channel

### Fixed

- IC RFE handler does not correctly match notification settings with users
- Create user notification settings with message template from group, role or cluster
- Return 403 (`Forbidden`) error if the event is not visible to the user trying to update the notification settings through the `PATCH /user/notification-settings` endpoint

## [2.0.0] 2023-10-23

### BREAKING CHANGES

The following environment variables have been changed:
- `CRUD_SERVICE_NAME` is replaced by `CRUD_SERVICE_URL`, which must provide a URL for the CRUD service instead of the service name.
- `MAIL_SERVICE_NAME` is replaced by `MAIL_SERVICE_URL`, which must provide a URL for the Mail service instead of the service name.
- `SMS_SERVICE_NAME` is replaced by `SMS_SERVICE_URL`, which must provide a URL for the SMS service instead of the service name.
- `FILE_SERVICE_NAME` is replaced by `FILE_SERVICE_URL`, which must provide a URL for the SMS service instead of the service name.
- `KAFKA_2_FIREBASE_SERVICE_NAME` is replaced by `KAFKA_2_FIREBASE_SERVICE_URL`, which must provide a URL for the Kafka2Firebase service instead of the service name

### Added

- Added WhatsApp channel
- Added configuration options for outbound calls
- Add handler for the IC Resource Forbidden Event
- Add POST /notification-events/ endpoint to send notification events
- Add environment variables for Kafka and notifications
- Add custom handlers configuration
- Add GET /notifications endpoint
- Add GET /notifications/:id endpoint
- Add POST /notification-settings endpoint
- Add PATCH /notification-settings endpoint
- Add GET /notification-settings endpoint
- Add GET /notification-settings/:id endpoint
- Add DELETE /notification-settings/:id endpoint
- Add GET /user-notification-settings endpoint
- Add PATCH /user-notification-settings/:id endpoint
- Add DELETE /user-notification-settings/:id endpoint
- Add utils to retrieve notification settings for a user and event
- Add utils to retrieve recipients from query
- Add utils to send notifications
- Add handler for the AM appointment created event
- Add handler for the AM appointment updated event
- Add handler for the AM appointment deleted event
- Add handler for the AM appointment reminder event
- Add handler for the TMM therapy created event
- Add handler for the TMM therapy updated event
- Add handler for the TMM therapy deleted event
- Add handler for the TMM therapy reminder event
- Add handler for the TMM monitoring plan created event 
- Add handler for the TMM monitoring plan updated event
- Add handler for the TMM monitoring plan deleted event
- Add handler for the TMM monitoring plan reminder event
- Add handler for the TMM threshold exceeded event
- Update to Node.js LTS v18
- Add utils to abort active reminders from query
- Add utils to merge notification settings
- Add utils to build messages to send from a list of notification settings
- Add utils to build reminders to schedule
- Add utils to send messages
- Update monitoring handlers to send periodic reminders for detections
- Retrieve notification settings only by event 
- Sort notification settings only by precedence
- Register notification utils
- Integrate default event handlers
- Align notifications returned by the default event handlers
- Add Postman functional test suite for TMM events and fix bugs
- Filter notification settings by emitters
- Update event payload for new and deleted participants of an updated AM appointment
- Update event payload for new and deleted participants of an updated TMM monitoring
- POST /notification-events/ returns notifications without CRUD default fields
- Update buildReminders and setReminders utility functions in order to target only the interested users
- Update documentation for RMM recurring reminders
- Abort recurring reminders in TMM default event handlers
- Add Postman functional test suite for AM events and fix bugs
- Update event handlers with buildReminders and setReminders utility functions that target only the interested users
- Add documentation about event settings
- Add event settings
- Add Rond policies for notification settings endpoints and prevent clients from changing notification settings event name
- Added API GET /user/events
- Save message details in the notifications CRUD
- Ignore user fields missing from AM appointment payloads
- Add support for push notifications to notification utils

### Changed

- Rename environment variables (`CRUD_SERVICE_URL`, `MAIL_SERVICE_URL`, `SMS_SERVICE_URL`, `FILE_SERVICE_URL`, `KAFKA_2_FIREBASE_SERVICE_URL`)

## [1.5.0] 2023-09-25

### Added
- Added the API POST /saga/send that accepts a Flow Manager command as input body.
- Add support for custom metadata to push notifications using pushData template field

## [1.4.0] 2023-08-31

### Added

- The API POST /send now accepts the new field **emailCarbonCopies** for adding email addresses as carbon copies (CC). 
- The API POST /send now accepts the new field **emailBlindCarbonCopies** for adding email addresses as blind carbon copies (BCC). 

## [1.3.0] 2023-06-26

- Upgrade to Node.js v18

### Added

- Added [handlebars-helpers](https://github.com/helpers/handlebars-helpers) library for advanced message interpolation.

### Fixed

- Fixed documentation links

## [1.2.1] 2023-03-07

### Changed

- Configurable android action added via `androidIntentAction`.

## [1.2.0] 2023-01-18

### BREAKING CHANGES

#### CRUD collections

The `message_templates` CRUD collection schema has changed as follows:
- `emailAttachments` (**changed**): update type from `array of string` to `array of object`

### Changed

- Support template attachments: now con be sent a communication with both a message and template attachments.

## [1.1.0] 2022-11-25

### Added

- Logs added to channels and crud.
- Added voice channel to messaging service, exploiting Kaleyra outbound calls service.

## [1.0.3] 2022-06-20

### Fixed

- Fixed the POST /send response that contained `failures` array elements even if emails were delivered correctly to end users.

## [1.0.2] 2022-05-26

### Fixed

- Fixed a bug as described in [#4](https://git.tools.mia-platform.eu/platform/plugins/messaging-service/-/issues/4) to allow Kafka messages to be sent correctly.
- Fixed an issue occurring when omitting the environment variables `KAFKA_CONNECTION_TIMEOUT` and `KAFKA_AUTHENTICATION_TIMEOUT` as described in [#3](https://git.tools.mia-platform.eu/platform/plugins/messaging-service/-/issues/3).

## [1.0.1] 2022-03-29

- Fix to POST /send for emails with attachments.

## [1.0.0] 2021-10-08

- First release
