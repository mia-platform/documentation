---
id: configure-github-actions
title: Deploy with GitHub Actions
sidebar_label: Deploy with GitHub
---
The Mia-Platform Console can be configured to deploy your project through GitHub Actions.

To enable your project to be deployed using GitHub Actions, you should edit the configuration of the project through the Console CMS 
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
If you haven't set up a GitHub provider yet, check out [here](/development_suite/set-up-infrastructure/configure-provider.mdx) how to configure it.
Remember that the Access Token configured to your provider needs at least `read-level access scope for the "Deployments" of the organization.
In order for GitHub to send webhook payloads, your console instance needs to be accessible from the Internet.
:::
:::info
If you haven't set up an environment yet, check out [here](/console/project-configuration/manage-runtime-environments/configure-a-new-environment.mdx) how to configure it.
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

When users deploy for the first time, the Console automatically creates the environments configured inside the project, 
otherwise, you can [follow this tutorial](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#creating-an-environment) 
to set up your environments.

With the above configuration, when a user clicks the `Deploy` button inside the Console, the following steps will be executed:
* The Console creates new deployments depending on the environment chosen on the GitHub repository
* On deployments creation GitHub dispatches a new deployment event and triggers the job specified inside the workflow
* When the pipeline status of deployments changes, the Console updates to show you its current status

### GitHub Webhooks

When a project is created, the Console subscribes it automatically to GitHub Webhooks.
These webhooks are important to allow the Console to update the project and see your deployment history.

Currently, the events that the Console needs to handle are: 
* [deployment_status](https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#deployment_status)

