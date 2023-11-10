---
id: usage
title: Mail Service Usage
sidebar_label: Usage
---
The Mail Service accepts **POST** requests at the following paths:

- `BASE_URL/send`

- `BASE_URL/send/split-recipients`: each receiver will see themselves as the single main receiver of the e-mail.

The request `body` has to contain the following parameters:

- `recipient`: string or array of strings with at least one e-mail address

- `subject`: string

- `sender` (or `from` for [multipart e-mail](#attachments)): string representing an e-mail address
  - Only one between `sender` and `from` is admitted, otherwise the request is rejected

Optionally you can include:

- `cc`: array of strings

- `bcc`: array of strings

- `message` : string

- `htmlMessage` : string representing an html

If the operation is successful, the API will respond with the `200` status code and an empty response body.

## Attachments

This service allows to send attachments too, with a slightly different body.

There are two main differences with the previous examples:

- the body has to be of type `form-data`
- the `sender` field is replaced by the `from` field

Look at this [example](#post-to-send-with-an-attachment) for a practical explanation of an e-mail with attachment.

## Some examples

### POST to /send with single receiver

This is an example of the body of the POST to the `/send` endpoint to send an e-mail from Alice (`alice@domain.com`) to Bob (`bob@domain.com`) and Carol (`carol@domain.com`) with subject `The subject of the e-mail` and message `This is an example.` Dave (`dave@domain.com`) will receive the e-mail in *cc*.

```json
{
 "recipient": ["bob@domain.com", "carol@domain.com"],
 "subject": "The subject of the e-mail",
 "sender": "alice@domain.com",
 "cc": ["dave@domain.com"],
 "message": "This is an example."
}
```

:::info
Bob will know that also Carol is receiving the e-mail and viceversa.
:::

### POST to /send/split-recipients

This is an example of the body of the POST to the `/send/split-recipients` endpoint to send two different e-mails from Alice (`alice@domain.com`) with subject `The subject of the e-mail` and message `This is an example.` The first e-mail will be sent to Bob (`bob@domain.com`) and the second one will be sent to Carol (`carol@domain.com`). Each recipient will not see that the e-mail was also sent to the other recipient.

```json
{
 "recipient": ["bob@domain.com", "carol@domain.com"],
 "subject": "The subject of the e-mail",
 "sender": "alice@domain.com",
 "cc": ["dave@domain.com"],
 "message": "This is an example."
}
```

This is equivalent to making two different POST requests to `/send` having the following bodies:

1. First request's body:

    ```json
    {
      "recipient": "bob@domain.com",
      "subject": "The subject of the e-mail",
      "sender": "alice@domain.com",
      "cc": ["dave@domain.com"],
      "message": "This is an example."
    }
    ```

1. Second request's body:

    ```json
    {
      "recipient": "carol@domain.com",
      "subject": "The subject of the e-mail",
      "sender": "alice@domain.com",
      "cc": ["dave@domain.com"],
      "message": "This is an example."
    }
    ```

### POST to /send with an HTML message

The service allows to send e-mails with an HTML content, which the receiver's client will render as HTML.

To send an HTML message you just have to put the e-mail content in the `htmlMessage` field instead of using the regular `message` field.

Here is an example of how the `/send` request would look like with an HTML template:

```json
{
  "recipient": "carol@domain.com",
  "subject": "The subject of the e-mail",
  "sender": "alice@domain.com",
  "cc": ["dave@domain.com"],
  "htmlMessage": "<!doctype html><html><head>  <meta name=\\"viewport\\" content=\\"width=device-width\\" />  <meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\" />  <title>Simple Transactional e-mail</title>  ...  ...  ...</head><body class=\\"\\"> <span class=\\"preheader\\">This is preheader text. Some clients will show this text as a    preview.</span>  <table role=\\"presentation\\" border=\\"0\\" cellpadding=\\"0\\" cellspacing=\\"0\\" class=\\"body\\">    <tr>      <td>&nbsp;</td>      <td class=\\"container\\">        ...        ...      </td>      <td>&nbsp;</td>    </tr>  </table></body></html>"
}
```

:::tip
The HTML content must be converted to a string and should only contain inline styles to obtain the desired rendering. 

You can still write external or embedded CSS and then use online tools like [this CSS Inliner](https://htmlemail.io/inline/) to convert all styles to inline styles.

You can also use your preferred template system to insert dynamic data into the HTML message. Please note that the Mail Notification Service does not provide any support for templating as of today.
:::

### POST to /send with an attachment

This service allows to send attachments too.

Here is an example of `curl` with two attachments:

```bash
curl --location --request POST 'mail-service/send' \
--form 'from=alice@domain.com' \
--form 'recipient=carol@domain.com' \
--form 'subject=The subject of the e-mail' \
--form 'message=The message of the e-mail' \
--form 'file1=@/path/to/the/file1'
--form 'file2=@/path/to/the/file2'
```

Here is an example of form data in node:

:::tip
Since form data is part of JavaScript Web API, to use it under node you should install a library like [form-data](https://www.npmjs.com/package/form-data).
:::

```javascript
const fs = require('fs')
const FormData = require('form-data')

const formData = new FormData()
formData.append('from', 'alice@domain.com')
formData.append('recipient', 'carol@domain.com')
formData.append('subject', 'The subject of the e-mail')
formData.append('message', 'The message of the e-mail')

const file1Stream = fs.createReadStream('path/to/the/file1')
const file2Stream = fs.createReadStream('path/to/the/file2')
formData.append('file1', file1Stream)
formData.append('file2', file2Stream)
```
