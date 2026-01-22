---
id: jira
title: Jira
sidebar_label: Jira
---



The Jira source supports to take events from Jira using the Jira Webhook.

## Webhook Integration

The Jira source integrates with webhooks by exposing an endpoint at `/jira/webhook`.
When a webhook event is received, the following steps are performed:

1. **Validation**: The request is validated using the secret passed by the Webhook.
1. **Event Handling**: The event type is extracted from the payload and the corresponding event is sent to the pipeline.
From the event type, it is also set which operation use: `Write` or `Delete` operation are supported by the sink.

### Service Configuration

The following configuration options are supported by the Jira source:

- **type** (*string*): The type of the source, in this case `jira`
- **authentication** (*object*) *optional*: The authentication configuration
  - **secret** ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The secret used to validate the incoming webhook requests
- **webhookPath** (*string*) *optional*: The path where to receive the webhook events. Default to `/jira/webhook`.

#### Example

```json
{
  "type": "jira",
  "webhookPath": "/webhook",
  "authentication": {
    "secret": {
      "fromEnv": "JIRA_SECRET"
    }
  }
}
```

### How to Configure Jira

To configure a webhook in Jira, follow the steps described in [this documentation](https://developer.atlassian.com/server/jira/platform/webhooks/).

As fields, you should set:

- **Name**: a name which identify the Webhook;
- **URL**: the URL where the Webhook will send the events. For the Jira integration, the URL should be `http://<your-agent-host>[/optional-base-path]/jira/webhook`;
- **Secret**: the secret used to validate the incoming webhook requests. This secret should be the same
as the one set in the authentication configuration.

## Supported Events

The Jira source supports the following webhook events:

| Event                 | Event Type                 | Example Payload                               | Operation |
|-----------------------|----------------------------|-----------------------------------------------|-----------|
|  issue created        | `jira:issue_created`       | [link](#issue-event-payload)                  | Write     |
|  issue updated        | `jira:issue_updated`       | [link](#issue-event-payload)                  | Write     |
|  issue deleted        | `jira:issue_deleted`       | [link](#issue-event-payload)                  | Delete    |
|  issue link created   | `issuelink_created`        | [link](#issue-link-event-payload)             | Write     |
|  issue link deleted   | `issuelink_deleted`        | [link](#issue-link-event-payload)             | Delete    |
|  project created      | `project_created`          | [link](#project-event-payload)                | Write     |
|  project updated      | `project_updated`          | [link](#project-event-payload)                | Write     |
|  project deleted      | `project_deleted`          | [link](#project-event-payload)                | Delete    |
|  project soft deleted | `project_soft_deleted`     | [link](#project-event-payload)                | Delete    |
|  project restore      | `project_restored_deleted` | [link](#project-event-payload)                | Write     |
|  version created      | `jira:version_created`     | [link](#project-version-event-payload)        | Write     |
|  version updated      | `jira:version_updated`     | [link](#project-version-event-payload)        | Write     |
|  version deleted      | `jira:version_deleted`     | [link](#project-version-event-payload)        | Deleted   |
|  version merged       | `jira:version_deleted`     | [link](#project-version-merged-event-payload) | Deleted   |
|  version released     | `jira:version_released`    | [link](#project-version-event-payload)        | Write     |
|  version unreleased   | `jira:version_unreleased`  | [link](#project-version-event-payload)        | Write     |

The operation will be used by the sink which supports the upsert of the data to decide if
the event should be inserted/updated or deleted.

### Known Issues

- The archived version is not correctly handled by the Webhook, so when archiving a version the WebHook is correctly
triggered but the `archived` field is always `false`. [Here the opened issue](https://jira.atlassian.com/browse/JRASERVER-71000).

### Issue Events

For the issue events, it is possible to set a filter to receive only the events related to the issues that match the filter.

Example of a filter is `project = "My Project"`.

:::info
The **event ID** used in the webhook payload is extracted from the `issue.id` field.
:::

#### Issue Event payload

The following is an example of an issue event payload.


Issue Event Payload

```json
{
  "id": 2,
  "timestamp": 1525698237764,
  "issue": {
    "id": "99291",
    "self": "https://jira.atlassian.com/rest/api/2/issue/99291",
    "key": "JRA-20002",
    "fields": {
      "summary": "I feel the need for speed",
      "created": "2009-12-16T23:46:10.612-0600",
      "description": "Make the issue nav load 10x faster",
      "labels": [
        "UI",
        "dialogue",
        "move"
      ],
      "priority": "Minor"
    }
  },
  "user": {
    "self": "https://jira.atlassian.com/rest/api/2/user?username=brollins",
    "name": "brollins",
    "key": "brollins",
    "emailAddress": "bryansemail at atlassian dot com",
    "avatarUrls": {
      "16x16": "https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
      "48x48": "https://jira.atlassian.com/secure/useravatar?avatarId=10605"
    },
    "displayName": "Bryan Rollins [Atlassian]",
    "active": "true"
  },
  "changelog": {
    "items": [
      {
        "toString": "A new summary.",
        "to": null,
        "fromString": "What is going on here?????",
        "from": null,
        "fieldtype": "jira",
        "field": "summary"
      },
      {
        "toString": "New Feature",
        "to": "2",
        "fromString": "Improvement",
        "from": "4",
        "fieldtype": "jira",
        "field": "issuetype"
      }
    ],
    "id": 10124
  },
  "comment": {
    "self": "https://jira.atlassian.com/rest/api/2/issue/10148/comment/252789",
    "id": "252789",
    "author": {
      "self": "https://jira.atlassian.com/rest/api/2/user?username=brollins",
      "name": "brollins",
      "emailAddress": "bryansemail@atlassian.com",
      "avatarUrls": {
        "16x16": "https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
        "48x48": "https://jira.atlassian.com/secure/useravatar?avatarId=10605"
      },
      "displayName": "Bryan Rollins [Atlassian]",
      "active": true
    },
    "body": "Just in time for AtlasCamp!",
    "updateAuthor": {
      "self": "https://jira.atlassian.com/rest/api/2/user?username=brollins",
      "name": "brollins",
      "emailAddress": "brollins@atlassian.com",
      "avatarUrls": {
        "16x16": "https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
        "48x48": "https://jira.atlassian.com/secure/useravatar?avatarId=10605"
      },
      "displayName": "Bryan Rollins [Atlassian]",
      "active": true
    },
    "created": "2011-06-07T10:31:26.805-0500",
    "updated": "2011-06-07T10:31:26.805-0500"
  },
  "webhookEvent": "jira:issue_updated"
}
```



#### Issue link Event payload

The following is an example of an issue link event payload.


Issue link Event Payload

```json
{
  "timestamp": 1525698237764,
  "id":                 876,
  "sourceIssueId":      222,
  "destinationIssueId": 333,
  "issueLinkType": {
    "id":                111,
    "name":              "Link name",
    "outwardName":       "executes Test",
    "inwardName":        "is executed by",
    "isSubTaskLinkType": false,
    "isSystemLinkType":  false,
  },
  "systemLink": false,
}
```



### Projects Events

For the project events, the following are some example payloads.

#### Project Event payload

The following is an example of a project event payload.


Project Event Payload

```json
{
  "timestamp": 1525698237764,
  "webhookEvent": "project_created",
  "project": {
    "self": "https://jira.atlassian.com/rest/api/2/project/12345",
    "id": 12345,
    "key": "ACTP",
    "name": "Agent Connector Test Project",
    "avatarUrls": {
      "16x16": "https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
      "48x48": "https://jira.atlassian.com/secure/useravatar?avatarId=10605"
    },
    "projectCategory": {
      "self": "https://jira.atlassian.com/rest/api/2/projectCategory/65432",
      "id": 65432,
      "name": "category name",
      "description": ""
    },
    "projectLead": {
      "self": "https://jira.atlassian.com/rest/api/2/user?accountId=some-id",
      "accountId": "some-id",
      "avatarUrls": {
        "16x16": "https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
        "48x48": "https://jira.atlassian.com/secure/useravatar?avatarId=10605"
      },
      "displayName": "The Lead Name",
      "active": true,
      "timeZone": "Europe/Rome",
      "accountType": "..."
    },
    "assigneeType": "admin.assignee.type.unassigned"
  }
}
```



#### Project Version Event payload

The following is an example of a project version event payload.


Project Version Event Payload

```json
{
  "timestamp": 1732615465165,
  "webhookEvent": "jira:version_created",
  "version": {
    "self": "https://jira.atlassian.com/rest/api/2/version/65456",
    "id": "65456",
    "description": "This is the description",
    "name": "v1",
    "archived": false,
    "released": false,
    "startDate": "2024-11-26",
    "releaseDate": "2024-11-30",
    "overdue": false,
    "userStartDate": "26/Nov/24",
    "userReleaseDate": "30/Nov/24",
    "projectId": 12345
  }
}
```



##### Project Version Merged Event Payload

The `jira:version_deleted` event is used to also notify that a version has been merged into another one.
In this case, a flag `mergedTo` is added to the payload with the information of the version where the version has been merged.


Project Version Merged Event Payload

```json
{
  "timestamp": 1732615465165,
  "webhookEvent": "jira:version_deleted",
  "version": {
    "self": "https://jira.atlassian.com/rest/api/2/version/65456",
    "id": "65456",
    "description": "This is the description",
    "name": "v1-rc.0",
    "archived": false,
    "released": false,
    "startDate": "2024-11-26",
    "releaseDate": "2024-11-30",
    "overdue": false,
    "userStartDate": "26/Nov/24",
    "userReleaseDate": "30/Nov/24",
    "projectId": 12345
  },
  "mergedTo": {
    "self": "https://jira.atlassian.com/rest/api/2/version/99991",
    "id": "99991",
    "description": "This is the version description",
    "name": "v1",
    "archived": false,
    "released": false,
    "startDate": "2024-11-26",
    "releaseDate": "2024-11-30",
    "overdue": false,
    "userStartDate": "26/Nov/24",
    "userReleaseDate": "30/Nov/24",
    "projectId": 12345
  }
}
```


