---
id: usage
title: SMS Service Usage
sidebar_label: Usage
---



This sections illustrates how to use the SMS Service.

## POST /send

With this API you can send a new SMS.

:::danger

According to GDPR, personal and sensitive information shall not be shared via SMS.

:::

### Body

The body of the request should have the fields listed in the following table.

| Name       | Required | Description                                                                                                                                                                    |
|------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sender`   | Yes      | Message sender. Twilio supports phone numbers in [E.164 format][e164] or an [alphanumeric ID][twilio-sender-id], Kaleyra requires a [registered sender ID][kaleyra-sender-id]. |
| `receiver` | Yes      | The recipient phone number in [E.164][e164] format.                                                                                                                            |
| `body`     | Yes      | The text of the SMS you want to send.                                                                                                                                          |

:::note

By default, Kaleyra will create a Sender ID during the signup. However, using this default ID, you can only send SMS messages to your registered mobile number and the numbers that are added to the Team. Hence, you must create your own Sender ID to send an SMS to other mobile numbers.

:::

:::caution

The body of a single SMS can be up to **1600 characters** long.
If it's longer, the service will send the message as a segmented SMS and your account will be charged accordingly.

:::

Here's an example of a valid request body:

```json
{
  "sender": "+15017122661",
  "receiver": "+15558675310",
  "body": "Your SMS body"
}
```

### Response

#### Exceptions

If something goes wrong during the request, the response will have a `4xx` or `5xx` status code and the following
payload:

```json
{
  "statusCode": "400",
  "error": "Bad request",
  "message": "Exception description"
}
```

A notable status code is **429**, which means that you have reached the REST API concurrency limit of Twilio (more
information [here][twilio-rate-limits]).

#### Success

In case of successful response with status code `200`, the body of the response has the following structure:

```json
{
  "dateEvent": "2021-08-13T12:53:52.959Z",
  "numSegments": "1",
  "sid": "124354",
  "status": "sent"
}
```

| Name          | Type   | Description                                                        |
|---------------|--------|--------------------------------------------------------------------|
| `dateEvent`   | String | Date/time in ISO 8601 format when the message was delivered.       |
| `numSegments` | String | Number of SMS messages it took to deliver the body of the message. |
| `sid`         | String | Unique identifier of the SMS.                                      |
| `status`      | String | Message delivery status.                                           |


[e164]: https://www.twilio.com/docs/glossary/what-e164
[kaleyra-sender-id]: https://developers.kaleyra.io/docs/sender-id
[twilio-sender-id]: https://www.twilio.com/docs/glossary/what-alphanumeric-sender-id
[twilio-rate-limits]: https://support.twilio.com/hc/en-us/articles/115002943027-Understanding-Twilio-Rate-Limits-and-Message-Queues
