---
id: email_setup
title: Email Setup
sidebar_label: Email Setup
---
To allow Mia-Platform Console to send email to the users (e.g. for company invitations) there are a few configurations available; first of all
however you need to setup your own SMTP server or AWS SES instance.

## Mail sender configuration

The whole configuration is wrapped in the `configurations.mailSender` object, which accepts the following values:

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `notifier` | string | Email sender provider (`smtp` or `ses`) | | ❌ |
| `senderAddress` | string | Email sender. It can also be formatted using something like "Name" email@test.com | | ❌ |
| `ses` |[object](#ses-configuration) | Configuration to use SES email configuration |  | ✅ |
| `smtp` |[object](#smtp-configuration) | Configuration to use SMTP email configuration |  | ✅ |

### SES Configuration

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `key` | string | The key defined by SES | | ❌ |
| `secret` | string | The secret defined by SES | | ❌ |
| `region` | string | The region defined by SES | | ❌ |

### SMTP Configuration

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `host` | string | The key defined by SES | | ❌ |
| `port` | string | The secret defined by SES | | ❌ |
| `username` | string | The region defined by SES | | ❌ |
| `password` | string | The key defined by SES | | ❌ |
| `tlsSecure` | boolean | The secret defined by SES | | ❌ |
| `tlsIgnore` | boolean | The region defined by SES | | ❌ |

### Examples

```yaml
mia-console:
  configurations:
    ...
    mailSender:
      senderAddress: "Mia-Platform Console no-reply@selfhostedconsoledomain.com"
      notifier: "smtp"
      smtp:
        host: "email-smtp.us-west-1.amazonaws.com"
        port: "587"
        username: "{{SES_SMTP_USERNAME}}"
        password: "{{SES_SMTP_PASSWORD}}"
```
