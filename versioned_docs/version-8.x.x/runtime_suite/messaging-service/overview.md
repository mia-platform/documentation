---
id: overview
title: Messaging Service
sidebar_label: Overview
---
Messaging Service allows sending messages to your users through various channels, namely **e-mail**, **SMS**, and **push notification**.

To send those messages, this service leverages three other Mia-Platform plugins:
- [SES Mail Notification Service](../ses-mail-notification-service/configuration.md)
- [SMS Service](../sms-service/configuration.md)
- [Kafka2Firebase Service](../kafka2firebase/overview.md)

:::caution
In order to send a message through a particular channel, you need to deploy the corresponding plugin.
:::

## Users clustering

In order to send messages to a particular group of users, the service supports users clustering. 

Each user in your [users CRUD](./configuration.md#users-crud-required) may belong to one or more groups, saved in a property called
`clusters` (the property can actually be named however you want, as explained in the [dedicated section](./configuration.md#users-crud-required)).

In the body of a [send request](./usage.md#body), you can use `clusters` parameter to specify the groups that should
receive the messages. The service will pick as receivers all the users that belongs to *at least* one of those clusters.

:::tip
In the body of the request you can also specify a list `recipients` that will receive the messages regardless of the
clusters.

If a user belongs to a cluster listed in the `clusters` parameter and its identifier is listed in the `recipients`, he/she
will receive the messages only one time.
:::

## Messages templates

To standardize the messages you send to your users, you can create and save on [an appropriate CRUD](./configuration.md#templates-crud)
messages templates. They are pre-defined messages for the various channels that can be referenced in your send requests
using the `templateId` [body parameter](./usage.md#body).

:::tip
Templates supports [message interpolation](#messages-interpolation).
:::

## Messages interpolation

Whether you use a template or you provide a message in the [body of the send request](./usage.md#body), you can use
interpolation to insert in the text some dynamic information.

The syntax to be used is the [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars). A Handlebars expression 
is a `{{`, some contents, followed by a `}}`. When the text is compiled, these expressions are replaced with values from 
an input object. 

The inputs object that can be used in the Messaging Service are:
- the **user** object (i.e., the data of the user to which you are sending the message)
- the **data** object of the [body of the send request](./usage.md#body)
- the [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars) helper `(dateNow)` that provides the `now` date string at execution time
- the [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars) helper `dateFormat`using the following syntax: (dateFormat `date` format='DD/MM/YYYY' tz='Europe/Rome')

>|Property|Type|Values|Default|
>|--------|----|------|-------|
>|format  |`string`|Any format supported by [Dayjs](https://day.js.org/docs/en/display/format)|ISO8601 format|
>|tz      |`string`|Any timezone supported by [ECMAScript2020](https://www.ecma-international.org/wp-content/uploads/ECMA-402_7th_edition_june_2020.pdf) section 6.4|UTC|

For example, given the following `user` object

```json
{
  "name": "Mario",
  "surname": "Rossi"
}
```

and the following `data` object in the body of the send request

```json
{
  "appointmentDate": "01/01/2021"
}
```

this message

```
'Hello, {{user.name}}! Your appointment is dated {{data.appointmentDate}}'
```

will be compiled in

```
'Hello, Mario! Your appointment is dated 01/01/2021'
```
