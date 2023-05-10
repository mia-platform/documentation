---
id: configuration
title: Push Notification Sender
sidebar_label: Configuration
---
## Environment Variables

The service requires the following environment variables:
- `CONFIG_FILE_PATH`: the path where the configuration file is mounted

## Configuration File
The service requires a configuration file in JSON format with the following fields:
- `sendersInitOptions`: object, specifies the configuration for Android and iOS senders. It has the following fields:
  - `android`: object, specifies the configuration for Android sender. It has the following fields:
    - `key`: string, the Firebase key for sending Android notifications
  - `ios`: object, specifies the configuration for iOS sender. This object is passed directly to the APN Provider. So you can specify the options listed [here](https://github.com/node-apn/node-apn/blob/38a357ed0c153aad09c2857e48a710527e685bfc/doc/provider.markdown#apnprovideroptions).
- `collectionsOptions`: object, specifies the configuration of the CRUD collection used by the service. It has the following fields:
  - `notificationsCollectionsPath`: path to the `notifications` CRUD collection
  - `devicesCollectionPath`: path to the `devices` CRUD collection
  - `usersCollectionPath`: path to the `users` CRUD collection
  - `bufferSize`: maximum number of notifications to be sent a once

An example of configuration file is the following:
```json
{
  "sendersInitOptions": {
    "ios": {
      "cert": "/home/node/app/config/cert.pem",
      "key": "/home/node/app/config/key.pem",
      "production": true,
      "defaultTopic": "{{IOS_PUSH_NOTIFICATION_TOPIC}}"
    },
    "mock": {},
    "android": {
      "key": "{{NOTIFICATIONS_ANDROID_KEY}}"
    }
  },
  "collectionsOptions": {
    "devicesCollectionPath": "/devices/",
    "notificationsCollectionsPath": "/notifications/",
    "usersCollectionPath": "/users/",
    "bufferSize": 5000
  }
}
```

In the case above, you must mount the `cert.pem` and `key.pem` files of the iOS certificates at the paths indicated in the configuration file.

## CRUD Collections

The service is based on two `CRUD` collections: `devices` and `notifications`
An additional `users` collection is needed for `/groups` route to work.
[Here](../../development_suite/api-console/api-design/crud_advanced) you can see how to create a CRUD collection from Mia-Platform Console.

### Devices

This collection contains the registered devices, a document containing the registration token (so there may be multiple documents for each user). _This collection should not be used directly by clients, who have authenticated registration APIs!_
The properties are as follows:

- `userId`: string or ObjectId, reference to the user who has registered
- `token`: string, the token ios or android that identifies the device and the app
- `tags`: list of strings, marks of users interested in topics or grouped as a group of users
- `platform`: string, the platform of the device `android`,`ios`, `mock` (case-sensitive!)

### Notifications

This collection keeps the history of notifications sent. Property:

- `title`: string, the title independent from the platform
- `body`: string, the message independent of the platform
- `payload`: the custom payload independent from the platform
- `platformSpecificContent`: object, notification customizations depending on the platform
- `destination`: object, a descriptor that contains the type `type` of the destination and the list of recipients
- `outcome`: object, the result of sending the notification

### Users

This collection will be only used by `/groups` route. It contains users' data.
This collection must have property `groups`, an array of strings: it represents the groups a user belongs to.  
This service will send notifications to groups by collecting the ids of users belonging to groups specified as input.
