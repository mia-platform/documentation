---
id: overview
title: Messaging Service
sidebar_label: Overview
---



:::danger

The Messaging Service is under maintenance (bug fixes and security updates only) and will reach end-of-life in December 2025.

The plugin is deprecated in favor of the Notification Manager, which inherits all the Messaging Service features and APIs.

:::

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

The syntax to be used is the [Handlebars][handlebars]. A Handlebars expression is an expression enclosed by double or triple curly brackets, like `{{ user.firstName }}` or `{{{ appointment.notes }}}`. They only difference is that HTML characters are escaped automatically only when using double curly brackets, which are safer and recommended to use unless you need to preserve text formatting.

:::danger
Be very careful sanitizing your input when using triple curly brackets, otherwise your users may be exposed to code injection attacks.
:::

When the text is compiled, these expressions are replaced with values from an input object.
The input objects that can be used in the Notification Manager are:

- the **user** object (i.e., the data of the user to which you are sending the message)

- the **data** object of the [body of the send request][usage-body]

In addition, you can use the following [custom helpers][handlebars-custom-helpers]: 

- `(dateNow)`: return the current date/time as ISO string

```
{{ dateNow }} // e.g. 2023-10-15T09:30:00.123Z
```

- `dateFormat`: format a date/time value in a given time zone (default: UTC)

```
{{ dateFormat data.startDate format='DD/MM/YYYY' tz='Europe/Rome' }} // e.g. 15/10/2023
```

| Property | Type     | Values                                                                 | Default        |
|----------|----------|------------------------------------------------------------------------|----------------|
| format   | `string` | Any format supported by [Dayjs][dayjs]                                 | ISO8601 format |
| tz       | `string` | Any timezone supported by [ECMAScript2020][ecmascript2020] section 6.4 | UTC            |

- `toLocale` (available since version `2.3.0`): return a string representing a value in a given locale, if the value is undefined an empty string is returned instead

```
{{ toLocale data.amount }} // Use default locale -- e.g. 1.234.567,89
{{ toLocale data.amount locale='it-IT' }} // e.g. 1.234.567,89
```

| Property | Type     | Values                                       | Default                                   |
|----------|----------|----------------------------------------------|-------------------------------------------|
| locale   | `string` | A [BCP 47 language tag][bcp-47-language-tag] | [`DEFAULT_LOCALE`][environment-variables] |

For example, given the following `user` object

```json
{
  "name": "Mario",
  "surname": "Rossi",
}
```

and the following `data` object in the body of the send request

```json
{
  "appointmentDate": "01/01/2021",
  "serviceAmount": 1234567.89
}
```

this message

```
'Hello, {{user.name}}! You have a new appointment on {{data.appointmentDate}} and you are going to pay ${{toLocale data.serviceAmount "en-US"}}'
```

will be compiled in

```
'Hello, Mario! You have a new appointment on 01/01/2021 and you are going to pay $1,234,567.89'
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
[handlebars-custom-helpers]: https://handlebarsjs.com/guide/#custom-helpers
[handlebars-helpers]: https://github.com/helpers/handlebars-helpers
[bcp-47-language-tag]: https://en.wikipedia.org/wiki/IETF_language_tag

[ses-mail-notification]: /runtime_suite/ses-mail-notification-service/configuration.md
[sms-service]: /runtime_suite/sms-service/20_configuration.md
[kafka2firebase]: /runtime_suite/kafka2firebase/10_overview.md
[flow-manager]: /runtime_suite/flow-manager-service/10_overview.md

[message-interpolation]: #messages-interpolation
[crud-templates]: /runtime_suite/messaging-service/20_configuration.md#templates-crud
[crud-users]: /runtime_suite/messaging-service/20_configuration.md#users-crud-required
[configuration-flow-manager]: /runtime_suite/messaging-service/20_configuration.md#service-configuration
[usage-body]: /runtime_suite/messaging-service/30_usage.md#body
