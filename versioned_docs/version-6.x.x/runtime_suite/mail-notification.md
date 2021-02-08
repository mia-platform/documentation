---
id: mail-notification
title:  Mail Notification Service
sidebar_label: Mail Service
---
## Introduction

This microservice allows sending e-mails via AWS SES or SMTP.
This service must be explicitly included in a project in case you want to send push notifications.

## Requirements

### SES

The microservice uses `Amazon SES` service in order to send email.
You need the `key` and the `secret` of the SES service. You can also specify the `region` you want to rely (it's default value is `us-east-1`).

### SMTP

The microservices uses `SMTP` in order to send email.
You need `HOST` and `PORT` (default: 587) of the `SMTP` server. You can also specify security configurations in order to use `TLS`.

SMTP authentication is by default ensured by `login` method, by providing `username` and `password`.

If you want to use gmail, have a look to [this page](https://nodemailer.com/usage/using-gmail/).

## API

The microservice accepts POST requests at the following path:

- `BASE_URL/send`

- `BASE_URL/send/split-recipients`: each receiver will see itself as single main receiver of the email.

Request `body` has to contain the following parameters:

- `recipient`: string or array of strings with at least an email address

- `subject`: string

- `sender` (or _from_ for [multipart email](#attachments)): string representing an email address

Optionally you can include:

- `cc`: array of strings

- `bcc`: array of strings

- `message` : string

- `htmlMessage` : string representing an html

### Attachments

This service allows to send attachments too, with a little different body.

To send an attachment, there are two main differences with the previous examples:

- the body has to be of type `form-data`
- the `sender` field is replaced by the `from` field

Look at the [example](#4-post-to-send-with-an-attachment) for a concrete example of attachment email.

### Some examples

#### 1. POST to /send with single receiver

This is an example of the body of the POST to the `/send` endpoint to send an email from Alice (`alice@domain.com`) to Bob (`bob@domain.com`) and Carol (`carol@domain.com`) with subject `The subject of the email` and message `This is an example.` Dave (`dave@domain.com`) will receive the email in *cc*.

```json
{
 "recipient": ["bob@domain.com", "carol@domain.com"],
 "subject": "The subject of the email",
 "sender": "alice@domain.com",
 "cc": ["dave@domain.com"],
 "message": "This is an example."
}
```

**Note**: Bob will know that also Carol is receiving the email and viceversa.

#### 2. POST to /send/split-recipients

This is an example of the body of the POST to the `/send/split-recipients` endpoint to send 2 different emails from Alice (`alice@domain.com`) with subject `The subject of the email` and message `This is an example.` The first email will be sent to Bob (`bob@domain.com`) and the second one will be sent to Carol (`carol@domain.com`). Each recipient will not see that the email was also sent to the other recipient.

```json
{
 "recipient": ["bob@domain.com", "carol@domain.com"],
 "subject": "The subject of the email",
 "sender": "alice@domain.com",
 "cc": ["dave@domain.com"],
 "message": "This is an example."
}
```

So this is equivalent to making 2 different POST requests to `/send` having the following bodies:

1. First request's body:

    ```json
    {
      "recipient": "bob@domain.com",
      "subject": "The subject of the email",
      "sender": "alice@domain.com",
      "cc": ["dave@domain.com"],
      "message": "This is an example."
    }
    ```

1. Second request's body:

    ```json
    {
      "recipient": "carol@domain.com",
      "subject": "The subject of the email",
      "sender": "alice@domain.com",
      "cc": ["dave@domain.com"],
      "message": "This is an example."
    }
    ```

#### 3. POST to /send with an html message

The service allows to send email with an html content and the receivers clients will renderize the html.

To send an html message you have just to change the `message` field with the `htmlMessage` one.

Following an example of `/send` request with html template (is not a real template but just a piece):

```json
{
  "recipient": "carol@domain.com",
  "subject": "The subject of the email",
  "sender": "alice@domain.com",
  "cc": ["dave@domain.com"],
  "htmlMessage": "<!doctype html><html><head>  <meta name=\\"viewport\\" content=\\"width=device-width\\" />  <meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\" />  <title>Simple Transactional Email</title>  ...  ...  ...</head><body class=\\"\\"> <span class=\\"preheader\\">This is preheader text. Some clients will show this text as a    preview.</span>  <table role=\\"presentation\\" border=\\"0\\" cellpadding=\\"0\\" cellspacing=\\"0\\" class=\\"body\\">    <tr>      <td>&nbsp;</td>      <td class=\\"container\\">        ...        ...      </td>      <td>&nbsp;</td>    </tr>  </table></body></html>"
}
```

#### 4. POST to /send with an attachment

This service allows to send attachments too.

Following an example of `curl` with two attachments:

```bash
curl --location --request POST 'mail-service/send' \
--form 'from=alice@domain.com' \
--form 'recipient=carol@domain.com' \
--form 'subject=The subject of the email' \
--form 'message=The message of the email' \
--form 'file1=@/path/to/the/file1'
--form 'file2=@/path/to/the/file2'
```

Following an example of form data in node:

```javascript
const fs = require('fs')

const formData = new FormData()
formData.append('from', 'alice@domain.com')
formData.append('recipient', 'carol@domain.com')
formData.append('subject', 'The subject of the email')
formData.append('message', 'The message of the email')

const file1Stream = fs.createReadStream('path/to/the/file1')
const file2Stream = fs.createReadStream('path/to/the/file2')
formData.append('file1', file1Stream)
formData.append('file2', file2Stream)
```
