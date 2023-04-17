---
id: configure-github-actions
title:  Configure deployment with GitHub
sidebar_label: Configure deployment with GitHub
slug: "/development_suite/deploy/"
---
The Mia-Platform Console can be configured to deploy your project through GitHub.

In order to enable your project to be deployed using GitHub, you should edit the configuration of the project through the Console CMS 
(if you do not have access to it, ask your instance administrator). In particular, the `environments.deploy` object 
of the configuration should contain the following information:

```json
{
  "deploy": {
    "type": "github-actions",
    "providerId": "your-github-provider-id"
  }
} 
```

:::info
if you haven't set up a GitHub provider yet, [see this page](/development_suite/set-up-infrastructure/configure-provider) to learn how to configure it.
Remember that the Access Token configured to your provider needs to have the `admin` scope of the organization.
In order for GitHub to send webhook payloads, your server needs to be accessible from the Internet.
:::

:::info
if you haven't set up an environment yet, [see this page](/development_suite/set-up-infrastructure/add-environment) to learn how to configure it.
:::

## Workflow

In your GitHub repository, create a new file `<root>/.github/workflows/deploy.yml`.

Here is an example that you can use to start:
```yaml
name: Deploy

on: deployment

jobs:
  deploy-ENVIRONMENT_NAME:
    name: Deploy to ENVIRONMENT_NAME environment
    if: ${{ github.event.deployment.environment }} == ENVIRONMENT_NAME
    concurrency: ENVIRONMENT_NAME
    permissions:
      deployments: write
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - name: Update deployment status (pending)
        if: success()
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          state: 'pending'
          deployment-id: ${{ github.event.deployment.id }}

      - name: Deploy my app
        run: |
          # add your deployment code here
          echo Deploying...
          sleep 10s
          echo Done!

      - name: Update deployment status (success)
        if: success()
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          state: 'success'
          deployment-id: ${{ github.event.deployment.id }}

      - name: Update deployment status (failure)
        if: failure()
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          state: 'failure'
          deployment-id: ${{ github.event.deployment.id }}
```

When users deploy for the first time, the Console release automatically creates the environments configured inside the project, 
otherwise, you can [follow this tutorial](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#creating-an-environment) 
to set up your environments.

With the above configuration, when a user presses the `Deploy` button inside the console, the following steps will be executed:
* The Console creates new deployments depending on the environment chosen on the GitHub repository
* On deployments creation GitHub dispatches a new deployment event and triggers the job specified inside the workflow
* When the pipeline status of deployments changes, the Console updates to show you its current status

### GitHub Webhooks

When a project is created, the Console subscribes it automatically to GitHub Webhooks.
These webhooks are important to allow the Console to update the project and see your deployment history.

Currently, the events subscribed are: 
* [deployment_status](https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#deployment_status)

### Projects created before v10.8.0

For projects already created before the specified version, you need to subscribe to provider events, manually.
To do this you can use the GitHub interface or the API.

Here's an example of a deployments_status subscription

```text
POST https://gihhub-host.com/orgs/{org}/hooks', {
  org: 'ORG',
  name: 'web',
  active: true,
  events: ['deployment_status'],
  config: {
    url: 'http://{YOUR_ORGANIZATION}.com/{TARGET_URL}',
    content_type: 'json',
    secret: '*****'
  },
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
    'Authorization': 'token {TOKEN}'
  }
})
```
