---
id: how_to_use
title: How to Use
sidebar_label: How to use
---
This section will detail how to setup correctly the menu items and the active users chart.

## Menu Items Configuration

After installing the application, two new menu items, `Users` and `Services`, need to be created in the Backoffice application. These will be used to integrate the dashboards using iFrame. 
In order to do this you have to edit the `configurations.json`  of `micro-lc-backend` microservice, as follows:


```json
"plugins": [
    {
      "id": "dashboards",
      "label": "Dashboards",
      "icon": "fa fa-th",
      "content": [
        {
          "id": "dashboards-analytics-users",
          "label": "Users",
          "icon": "fas fa-chart-bar",
          "integrationMode": "iframe",
          "pluginRoute": "/dashboard-analytics-users",
          "pluginUrl": "/data-visualization/#/users",
          "props": {}
        },
        {
          "id": "dashboards-analytics-services",
          "label": "Services",
          "icon": "fas fa-chart-bar",
          "integrationMode": "iframe",
          "pluginRoute": "/dashboard-analytics-services",
          "pluginUrl": "/data-visualization/#/services",
          "props": {}
        },
      ]
    },
]
```

Make sure that `pluginurl` is correctly configured with the desired dashboard to be shown.

For more details: [Application | Mia-Platform Documentation](../../runtime_suite_applications/backoffice/overview)

## Active Users Chart

To properly configure the active user counter, you must manually create a cronjob.
In this regard you can follow the following guide: [Create and Manage Cronjobs.](../../development_suite/api-console/api-design/jobs-cronjob)

The cronjob is used to call the `Active User Updater` micro service, which communicates with `auth0-client` to get a list of active users and update the crud `active-users`.
To do this, the cronjob needs to be able to make curl calls, so we need to use the following docker image [curlimages/curl](https://hub.docker.com/r/curlimages/curl).

:::warning
Auth0 Client version 3.3.0 is required in order to retrieve the number of active users.
:::

### YAML Setup

As for the `schedule` field, it indicates the schedule time and it uses a CronTab expression (you can find some examples [here](https://crontab.guru/examples.html)).

Curl to call the `Active User Updater` microservice correctly must have specified the `BASE_PATH` of the project in the headers. The latter is configurable through the public variables.


:::warning
It is currently not possible to automatically deploy cronjobs with an application.
:::


```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: invoke-active-user-updater
  labels:
    app: invoke-active-user-updater
    app.kubernetes.io/name: invoke-active-user-updater
    app.kubernetes.io/component: cronjob
    app.kubernetes.io/part-of: mia-care-demo
    app.kubernetes.io/managed-by: mia-platform
    mia-platform.eu/stage: '{{STAGE_TO_DEPLOY}}'
spec:
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  schedule: '*/2 * * * *'
  jobTemplate:
    spec:
      backoffLimit: 1
      template:
        metadata:
          name: invoke-active-user-updater
          labels:
            app: invoke-active-user-updater
            app.kubernetes.io/name: invoke-active-user-updater
            app.kubernetes.io/component: cronjob
            app.kubernetes.io/part-of: mia-care-demo
            app.kubernetes.io/managed-by: mia-platform
            mia-platform.eu/stage: '{{STAGE_TO_DEPLOY}}'
        spec:
          imagePullSecrets:
            - name: nexus-gcloud
          containers:
            - name: invoke-active-user-updater
              image: curlimages/curl:7.84.0
              args:
              - /bin/sh
              - -ec
              - "curl -X POST -d '{}' -H 'Content-Type: application/json' -H 'x-forwarded-host: {{BASE_PATH}}' \"http://active-user-updater/update-active-users\""
          restartPolicy: Never
```
