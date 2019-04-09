# Send Push Notifications

[TOC]

## Introduction

This microservice allows you to send push notifications to Android and iOS clients.
This service must be explicitly included in a project in case you want to send push notifications. The service, to be configured with the `Firebase` and` APN` keys, also uses two `CRUD service` collections to also be included in the project.

## API

### Subscription to the service by the App

Apps can register with push notifications by calling the service in POST to the `/ subscription /` path indicating their notification token, in addition to the platform (android or ios) and a list of tags (or topics) indicating types of notifications of which the client wants to be notified. This route will return a `deviceId` which is an identifier of the device that the app will have to save locally in order to update the substitution by changing the tags or to update the token (which may expire) by executing the call to this same route with the deviceId .

If the call is made with authentication, the user's id will be saved along with the device information. `WARNING:` if the call is made without authentication, the user will be disassociated from the device: this operation is equivalent to a `deregistration` of the user, who will therefore not receive any more notifications explicitly addressed to him.

Example of subscription payload:
```json
{
  "token": "<long_alphanumeric_id specific to the couple app-device>",
  "platform": "android",
  "tags": [
    "app_updates", "news", "finance", "early_user", "some", "other", "tag", "app_version_1.1.0"
  ]
}
```

Service response:
```json
{
  "deviceId":"<alphanumeric_id>"
}
```

In each subsequent call, the `deviceId` will always be sent to keep the token and preferences up-to-date:
```json
{
  "deviceId":"<alphanumeric_id>",
  "token": "<long_alphanumeric_id specific to the couple app-device>",
  "platform": "android",
  "tags": [
    "app_updates", "news", "finance", "early_user", "some", "other", "tag", "app_version_1.1.0"
  ]
}
```

To associate the user logged in to the device, just run the same call with authentication, while to disassociate it you need to make the call without authentication.

### Sending notifications to devices

Notifications can be sent in different ways depending on the destination: directly the registration tokens, users id, tags, platform, or to all devices.
Calling the following routes, the service will consult the collection in which the apps are registered and in addition to sending notifications, will also save them in a collection (one per call to the API) to be consulted for example via CMS.
The routes are as follows:

- POST `/ tokens`: sends a notification to a set of registration tokens
- POST `/ userids`: sends a notification to a group of users specifying their id
- POST `/ tags`: sends a notification to a group of users marked with a tag (topic or group)
- POST `/ groups`: sends a notification to a list of user groups
- POST `/ platforms`: notifies all devices by specifying a list of platforms, (` ios`, `android` for now)
- POST `/ broadcast`: notifies all devices
- POST `/ multicast`: notifies all devices (you can specify a custom query to send only to an arbitrary subset of devices)


An example of a payload of a call to send a notification to a list of users is as follows:
```json
{
  "title": "Hey",
  "body": "Ciao!",
  "payload": {
    "some": "data"
  },
  "platformSpecificContent": {
    "android": {
      "icon": "ic_launcher",
      "sound": "default"
    },
    "ios": {
      "contentAvailable": true,
      "badge": 3,
      "sound": "ping.aiff",
      "topic": "<your-app-bundle-id>",
      "silent": false
    }
  },
  "userids": [
    "id1", "id2", "id3"
  ]
}
```

`title`,` body` and `payload` are platform independent, while in the` platformSpecificContent` section you can add platform-specific options. The other routes provide an interface equivalent to less than the last field, which depends on the route.

Note for `ios`: to send silent notifications, which are not displayed by the app, but which simply send a payload in push, put in the options ios` silent: true` and `contentAvailable: true`.

## Collection
The service is based on two collections of `CRUD`:` devices` and `notifications` 
An additional `users` collection is needed for `/groups` route to work.

### Devices

This collection contains the register of registered devices, a document for registration token (so there may be multiple documents for each user). _This collection should not be used directly by clients, who have authenticated registration APIs!_
The properties are as follows:

- userId: string or ObjectId, reference to the user who has registered
- token: string, the token ios or android that identifies the device and the app
- tags: list of strings, marks of users interested in topics or grouped as a group of users
- platform: string, the platform of the device `android`,` ios`, `mock` (case-sensitive!)

### Notifications

This collection keeps the history of notifications sent. Property:

- title: string, the title independent from the platform
- body: string, the message independent of the platform
- payload: the custom payload independent from the platform
- platformSpecificContent: object, notification customizations depending on the platform
- destination: object, a descriptor that contains the type `type` of the destination and the list of recipients
- outcome: object, the result of sending the notification

### Users

This collection will be only used by `/groups` route. It contains users data. 
This collection must have property `groups`, an array of strings: it represent the groups an user belongs to.  
This service will send notifications to groups by collecting ids of users belonging to groups specified as input.