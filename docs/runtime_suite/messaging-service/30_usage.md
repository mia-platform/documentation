---
id: usage
title: Messaging Service Usage
sidebar_label: Usage
---
This sections illustrates how to use the Messaging Service.

## POST /send

With this API you can send a new message to your users through different channels.

### Body

The body of the request should have the following shape.

- **channels (required)** - `array of strings`: list of channels you want to send you message over. Possible values are `email`, `sms`, `push` and `voice`.

:::caution
This list has to be a subset of the `activeChannels` property specified in the [service configuration][service-configuration].
:::

- **recipients** - `array of string`: list of unique identifiers of the users you want to send your messages to. Required
if `clusters` is not defined.

- **clusters** - `array of string`: users' clusters you want to send your messages to. Required if `recipients` is not defined.

- **messageTitle** - `string`: title of the message. It will be used as title for e-mails and push notifications. Required 
if `templateId` is not defined. It will be ignored if `templateId` is defined. It supports [interpolation][message-interpolation].

- **messageContent** - `string`: content of the message. It will be used as content for e-mails, sms, push and voice
notifications. Required if `templateId` is not defined. It will be ignored if `templateId` is defined. It supports 
[interpolation][message-interpolation].

- **templateId** - `ObjectId`: id of the template to be used for composing the message. Required if `messageTitle` and
`messageContent` are not defined.

- **data** - `object`: data used for [messages interpolation][message-interpolation].
 
- **emailAttachments** - `array of strings`: list of filenames that should be sent as mail attachments. The filename must be the same as that used in the file service to download it. It is possible to send attachments no larger than 15 MB. If no File Service is declared in the environment variables an error will be thrown.

:::tip
If you use a template in which some attachments are listed, they will be merged with the attachments specified in the 
`emailAttachments` property of the request body (i.e. both the attachments specified in the template and in the body
will be sent.)
:::

- **emailCarbonCopies** - `array of strings`: list of email addresses that should be included as carbon copies (CC). Any invalid email addresses will be ignored. Available since version 1.4.0.

- **emailBlindCarbonCopies** - `array of strings`: list of email addresses that should be included as blind carbon copies (BCC). Any invalid email addresses will be ignored. Available since version 1.4.0.

### Response

#### Exceptions

If something goes wrong during the request, the response will have a `4xx` or `5xx` status code and the following  payload:

```json
{
  "statusCode": "400",
  "error": "Bad request",
  "message": "Exception description"
}
```

#### Success

A successful response (status code `200`) is issued if the process of messages sending starts without errors. However,
it is still possible that the dispatch of some messages to some users fails on some channels. The body of the response
will contain a list of those failures, with a brief explanation of the error, if applicable.

```json
{
  "failures": [
    {
      "userId": "",
      "channel": "",
      "error": ""
    }
  ]
}
```

## POST /saga/send

With this API you can send a new message to your users through different channels directly with a Flow manager command. You should avoid calling this endpoint in a different way.

### Body

It has the same structure of a [Flow Manager command][flow-manager-command].

### Response

#### Exceptions

If something goes wrong during the request, the response will have a `4xx` or `5xx` status code and the following payload:

```json
{
  "statusCode": "400",
  "error": "Bad request",
  "message": "Exception description"
}
```
Moreover, if enabled by [configuration][service-configuration], it sends an event with `failEventlabel` as messageLabel and empty messagePayload. 

#### Success

A successful response (status code `200`) with an empty body is issued if the process of messages sending starts without errors.

Moreover, if enabled by [configuration][service-configuration], it sends an event with `successEventlabel` as messageLabel and empty messagePayload. 

[message-interpolation]: ./10_overview.md#messages-interpolation
[service-configuration]: ./20_configuration.md#service-configuration
[flow-manager-command]: ../../runtime_suite/flow-manager-service/configuration#sending-commands-1
