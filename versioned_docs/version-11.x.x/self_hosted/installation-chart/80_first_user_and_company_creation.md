---
id: first_user_and_company_creation
title: Finalize Console installation and create the first entities
sidebar_label: First User and Company Creation
---
If you have configured everything you need and have deployed the Helm chart, you are going to have all Deployment running and reachable at the host you defined.

Now you might want to start creating the first Company and some initial Projects for your users to work on.

:::info
If the self-hosted Console installation is managed by Mia-Platform PaaS team, in order to serve Mia-Platform Console to your users, you will have a default installation with [Traefik](../../paas/traefik) and [Cert Manager](../../paas/cert-manager), if you need different tooling please contact your Mia-Platform referent.
:::

## Designate a Super User

First of all you need to designate the first Super User, to do so you need to have access to the Console MongoDB Database and to create a document in the `bindings` collection with the following information:

```json
{
  "bindingId": "super-users",
  "subjects": ["<_id of the user you want to be super user>"],
  "roles": ["console-super-user"]
}
```

:::info
If you want to setup multiple Super User you can use the same binding and add multiple `subjects` to the list.
:::

## Create the first company

Now that you have a Super User you can create your fist Company; Company creation can be done via API or via CMS

:::info
For further information head to the Company creation [documentation section](../../development_suite/company/create).
:::

### Use Console API Portal

In order to create a new Company via API you can use the API Portal by heading to the `/documentations/api-portal/` path on your Console host and use the `POST /companies` API; the API will return the id of the company to be used later.

After you have created a Company you will be able to access it from Console at the `/tenants/:id` path, here you'll be able to manage the Company providers and Clusters.

:::info
Some details such as default creation environments, templates etc are still not available within Mia-Platform Console and will require you to access the CMS for further configuration.

You can find out more [here](../../development_suite/company/create#default-configuration-for-a-new-project)
:::
