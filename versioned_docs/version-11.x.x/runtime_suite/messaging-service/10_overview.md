---
id: overview
title: Messaging Service
sidebar_label: Overview
---
Messaging Service allows sending messages to your users through various channels, namely **e-mail**, **SMS**, **push notification** and **voice**.

To send those messages, this service leverages three other Mia-Platform plugins:
- [SES Mail Notification Service][ses-mail-notification]
- [SMS Service][sms-service]
- [Kafka2Firebase Service][kafka2firebase]

:::caution
In order to send a message through a particular channel, you need to deploy the corresponding plugin.
This is not needed for the **voice** channel, for which there is a direct interaction with Kaleyra APIs.
:::

The notification can also be triggered directly by a [Flow Manager][flow-manager] command. See the [Configuration][configuration-flow-manager] section for more information. 

## Users clustering

In order to send messages to a particular group of users, the service supports users clustering. 

Each user in your [users CRUD][crud-users] may belong to one or more groups, saved in a property called
`clusters` (the property can actually be named however you want, as explained in the [dedicated section][crud-users]).

In the body of a [send request][usage-body], you can use `clusters` parameter to specify the groups that should
receive the messages. The service will pick as receivers all the users that belongs to *at least* one of those clusters.

:::tip
In the body of the request you can also specify a list `recipients` that will receive the messages regardless of the
clusters.

If a user belongs to a cluster listed in the `clusters` parameter and its identifier is listed in the `recipients`, he/she
will receive the messages only one time.
:::

## Messages templates

To standardize the messages you send to your users, you can create and save on [an appropriate CRUD][crud-templates]
messages templates. They are pre-defined messages for the various channels that can be referenced in your send requests
using the `templateId` [body parameter][usage-body].

:::tip
Templates supports [message interpolation][message-interpolation].
:::

## Messages interpolation

Whether you use a template or you provide a message in the [body of the send request][usage-body], you can use
interpolation to insert in the text some dynamic information.

The syntax to be used is the [Handlebars][handlebars]. A Handlebars expression 
is a `{{`, some contents, followed by a `}}`. When the text is compiled, these expressions are replaced with values from 
an input object. 

The inputs object that can be used in the Messaging Service are:
- the **user** object (i.e., the data of the user to which you are sending the message)
- the **data** object of the [body of the send request][usage-body]
- the [Handlebars][handlebars] helper `(dateNow)` that provides the `now` date string at execution time
- the [Handlebars][handlebars] helper `dateFormat`using the following syntax: (dateFormat `date` format='DD/MM/YYYY' tz='Europe/Rome')

| Property | Type     | Values                                                                 | Default        |
|----------|----------|------------------------------------------------------------------------|----------------|
| format   | `string` | Any format supported by [Dayjs][dayjs]                                 | ISO8601 format |
| tz       | `string` | Any timezone supported by [ECMAScript2020][ecmascript2020] section 6.4 | UTC            |

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
### Handlebars helpers

:::info

**v1.3.0**. Advanced interpolation is available only since version `1.3.0`.

:::

You can use the functions provided by the [handlebars-helpers][handlebars-helpers] library to perform advanced interpolation of the messages.

In the following example, `firstName` and `lastName` are fields of the `data` object that are displayed only if the `type` field is set to `patients`.

```
{{#if (eq data.type "patients")}}{{data.firstName}} {{data.lastName}}{{/if}}
```

In this case the `eq` function is provided by the [handlebars-helpers][handlebars-helpers] library.


[dayjs]: https://day.js.org/docs/en/display/format
[ecmascript2020]: https://www.ecma-international.org/wp-content/uploads/ECMA-402_7th_edition_june_2020.pdf
[handlebars]: https://handlebarsjs.com/guide/#what-is-handlebars
[handlebars-helpers]: https://github.com/helpers/handlebars-helpers

[ses-mail-notification]: ../../runtime_suite/ses-mail-notification-service/configuration
[sms-service]: ../../runtime_suite/sms-service/configuration
[kafka2firebase]: ../../runtime_suite/kafka2firebase/overview
[flow-manager]: ../../runtime_suite/flow-manager-service/overview

[message-interpolation]: #messages-interpolation
[crud-templates]: ./20_configuration.md#templates-crud
[crud-users]: ./20_configuration.md#users-crud-required
[configuration-flow-manager]: ./20_configuration.md#service-configuration
[usage-body]: ./30_usage.md#body
