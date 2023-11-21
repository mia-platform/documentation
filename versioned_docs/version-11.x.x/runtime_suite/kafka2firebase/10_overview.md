---
id: overview
title: Kafka2Firebase
sidebar_label: Overview
---
This is a plugin made for converting kafka messages into firebase push. It takes as input a kafka message composed as following:

```json
{ 
    "device_tokens" : ["token1", "token2"],         // The list of firebase devices token to which send the push
    "topics": ["topic1", "topic2"],                 // The list of firebase topics to which send the push
    "message_id": "messageId",
    "push_notification": {                          // The information of the push
        "title": "title",
        "subtitle": "subtitle",
        "message": "message"
    }
    "payload": {                                    // The additional information to send to the application
        "description": "any description"
    }

```

The `message_id` and `push_notification` with its inner values are mandatory. The`device_tokens` and `topics` can be both valorized,
only one of the two or even none of them; according to which is not null will be sent push to devices to the topics or to both.
The payload is a generic JSON with all the additional information that want to be sent to the device, it can be null.

Registering this service to some Kafka topics you will receive the push notification directly to the device.

You can also add an OK and KO hook to be notified when the push is sent (or not) correctly. You can put only the OK hook,
only the KO, both or even none. If you need to pass headers in the hook you have the possibility to do (details in next 
paragraph).
