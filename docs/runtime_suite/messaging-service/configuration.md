---
id: configuration
title: Messaging Service configuration
sidebar_label: Configuration
---
The Messaging Service seed some configuration work in order to be used effectively.

## CRUD configuration

To use the Messaging Service you need to create and configure a couple of CRUD collections.

### Users CRUD (required)

This collection should contain the data about the users you want to send messages to. The collection is mandatory and
can be named however you want (we suggest `users`) as long as you specify the correct name in the `USERS_CRUD_NAME`
[environment variable](#environment-variables).

The properties used by the service are the following.

- **emailAddress** - `string`: a valid e-mail address.

- **phoneNumber** - `string`: a phone number in [E.164](https://www.twilio.com/docs/glossary/what-e164) format.

- **deviceToken** - `string`: a Firebase devices token.

- **clusters** - `array of strings`: a list of clusters to which the user belongs (used to decide whether the user 
should be included as a recipient or not when sending a message to a particular cluster).

:::tip
The naming of these four properties is up to you. By default, the service will look for the names listed above, but if
you prefer using other names you just need to map them correctly in the `userFields` properties of the 
[service configuration](#service-configuration).
:::

:::tip
None of these properties are required. If the service does not find a value for a user, it will simply not send messages
to that user over the missing channel(s).
:::

:::tip
The collection can have any number of additional properties, the service will ignore them.
:::

### Templates CRUD

If you want to use templates in your messages, you should store them in this collection. As for the `users` collection
it does not matter how the CRUD is named (we suggest `message_templates`) as long as you specify the correct name in the
`TEMPLATES_CRUD_NAME` [environment variable](#environment-variables).

This collection is not mandatory, but if you don't create it and try to use a template anyway, you will receive an error.

It follows a description of the fields of the collection.

- **name** - `string`: human-readable name of the template.

- **emailTitle (required)** - `string`: title of the e-mail. It supports [interpolation](./overview.md#messages-interpolation).

- **emailMessage** - `string`: body the e-mail. Required if `htmlMessage` is not defined. It will be ignored if both
`emailMessage` and `emailHtmlMessage` are provided. It supports [interpolation](./overview.md#messages-interpolation).

- **emailHtmlMessage** - `string`: html body the e-mail. Required if `message` is not defined. If both are defined, only 
`emailHtmlMessage` is used. It supports [interpolation](./overview.md#messages-interpolation).

- **emailAttachments** - `array of strings`: list of path to files that should be sent as mail attachments.

- **smsMessage (required)** - `string`: body the SMS. It supports [interpolation](./overview.md#messages-interpolation).

- **pushTitle (required)** - `string`: title of the notification. It supports [interpolation](./overview.md#messages-interpolation).

- **pushSubtitle** - `string`: subtitle of the notification. It supports [interpolation](./overview.md#messages-interpolation).

- **pushMessage (required)** - `string`: message of the notification. It supports [interpolation](./overview.md#messages-interpolation).

:::tip
The fields relative to a channel are required only if plan to use templates, and you want to send messages through that
channel (this applies also to the fields marked as **required** in the list above).
:::

## Environment variables

The Messaging Service accepts the following environment variables.

- **CRUD_SERVICE_NAME (required)**: name of the CRUD Service.

- **USERS_CRUD_NAME (required)**: name of the CRUD collection containing users data.

- **TEMPLATES_CRUD_NAME**: name of the CRUD collection containing messaging templates. Required if you want to use templates for your messages. 

- **MAIL_SERVICE_NAME**: name of the SES Mail Notification Service. Required if you want to send e-mails.

- **SMS_SERVICE_NAME**: name of the SMS Service. Required if you want to send SMS.

- **FILE_SERVICE_NAME**: name of the File Service. Required if you want to send emails with attachments.

- **KAFKA_2_FIREBASE_SERVICE_NAME**: name of the Kafka2Firebase Service. Required if you want to send push notifications.

- **KAFKA_CLIENT_ID**: required if you want to send push notifications.

- **KAFKA_BROKERS**: list of comma separated brokers address. Required if you want to send push notifications.

- **KAFKA_TOPICS**: list of comma separated topics. Required if you want to send push notifications.

- **KAFKA_AUTH_MECHANISM**: authentication mechanism, used only if `KAFKA_USERNAME` and `KAFKA_PASSWORD` have a value. Defaults to `PLAIN`.

- **KAFKA_USERNAME**

- **KAFKA_PASSWORD**

- **KAFKA_CONNECTION_TIMEOUT**: time in milliseconds to wait for a successful connection. Defaults to 1000.

- **KAFKA_AUTHENTICATION_TIMEOUT**: time in milliseconds to wait for a successful authentication. Defaults to 1000.

- **CONFIGURATION_PATH (required)**: path of the config map file containing the service configuration.

## Service configuration

The service needs a configuration file in JSON format, that can be provided to it as a configmap. You can choose the
name and mounting point of the map, as long as you specify the correct path in the `CONFIGURATION_PATH` [environment variable](#environment-variables).

It follows a description of the fields of the map.

- **userFields** - `object`: if you have given a different name to any of the properties listed in the 
[Users CRUD](#users-crud-required) section, you can use this map to tell the service how to find them.
  - **id** - `string`: the name of the property in the Users CRUD containing the user's unique identifier. It will be
matched with the values specified in the [`recipients` field](./usage.md#body). If not set, the service will use `_id` 
as default.
  - **emailAddress** - `string`: the name of the property in the Users CRUD containing the user's e-mail address.
  - **phoneNumber** - `string`: the name of the property in the Users CRUD containing the user's phone number.
  - **deviceToken** - `string`: the name of the property in the Users CRUD containing the user's device token.
  - **clusters** - `string`: the name of the property in the Users CRUD containing the user's cluster list.
  
- **activeChannels (required)** - `string array`: the list of active channels over which each message will be delivered.
  Possible values are `email`, `sms` and `push`.

:::tip
Keep in mind that even if a channel is active, a user will not receive messages over that channel if the correspondent
property in the [Users CRUD](#users-crud-required) does not have a value.
:::

- **sender** - `object`: the senders for the various channels. Required if at least one among the `email` and the `sms` channels are enabled.
  - **email** - `string`: the e-mail address that will appear as the sender of e-mail messages. Required if the `email` channel is enabled.
  - **sms** - `string`: the sender of the SMS messages. Required if the `sms` channel is enabled. It can be one of the following:
    - a phone number in [E.164](https://www.twilio.com/docs/glossary/what-e164) format
    - an [alphanumeric sender ID](https://www.twilio.com/docs/glossary/what-alphanumeric-sender-id)

It follows an example of a valid configuration file.

```json
{
  "userFields": {
    "id": "fiscalCode",
    "emailAddress": "mail",
    "clusters": "groups"
  },
  "activeChannels": [
    "email",
    "push"
  ],
  "sender": {
    "email": "email@test.com"
  }
}
```
