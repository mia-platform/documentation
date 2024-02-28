---
id: create
title: Create a Company
sidebar_label: Create a Company
---

A company is a resource that provides governance on all the projects it contains.

Within a company, it is possible to:

- configure the infrastructure on which new projects will be based;
- analyze the configuration of all existing projects;
- manage users and permissions.

#### SaaS

To create a new company in the Mia-Platform SaaS Console, open a [Service Request](https://makeitapp.atlassian.net/servicedesk/customer/portal/21/group/79/create/340) and the company will be created for you.

#### On-Premise

Before creating a new company in a Mia-Platform On-Premise Console installation, contact your Mia-Platform referent.

Once you made sure you meet all the necessary requirements to create a new company, you can continue with this guide.

<br/>

The next steps will guide you through all the processes to create and correctly configure a new company.

### Requirements

To create and configure a company, you must have:

- access to the Console CMS (granted by the `console_cms` group)
- `Console Super User` role, or `console.root.company.create` permission

## Create a company from API

You can create a new company by making a POST request to the `/api/backend/companies` API. 

:::info
This API is visible inside the Console API Portal (`{{CONSOLE-HOST}}/documentations/api-portal/`), under the `Companies` tag.
:::

You will be asked to set the **name** and the **description** of the company to add (only name is required). 

In addition, you will be added as the first Company user with the role of [`Company Owner`](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console).

##### Example call

```bash
curl 
  --request POST \ 
  --url https://{CONSOLE_HOST}/api/backend/companies \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json'
```

where `CONSOLE_HOST` is the base path of your Console installation.

## Create a company from CMS

It is also possible to manually create a company from the Console CMS. 

However, you will lose some of the automation provided by the company creation API, such as adding the first user or providing a company unique identifier.

:::danger
It is recommended to use the API to create a new company. Use this method only if strictly necessary.
:::

<details>
<summary>Detailed guide</summary>

#### Create the company

Visit the Console CMS page and open the `Companies` section.

Click the `Add new` button, you will be asked to provide an **id**, a **name**, and a **description** for the company (only id and name are required). 

You will be able to set all the optional fields after the creation of the company.
For further information regarding other configuration fields, visit the dedicated [section](#default-configuration-for-a-new-project) later on this page.

#### Add the first Company User

Once your company has been created using CMS, you need to associate the first user to be able to access the company from the Console. 
The first user may either be yourself or another user on the Platform. 

Regardless, head over to the CMS page and click the `Bindings` menu item.

:::caution
Only a restricted set of users have access to the users' management section in CMS, contact your Console Administrator to obtain the right permissions to access this functionality.
:::

In the `Bindings` section, click the `Add new` button and fill in the form:
- type a custom **Binding ID**

:::danger
The _Binding ID_ must be unique in the whole collection!  

As a general recommendation, we suggest `{companyId}-{desiredRole}`, however in some cases, a more complex structure may be necessary.
:::

- select the proper **Role** (since it is the first user, it is recommended to set the role [`Company Owner`](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#users-capabilities-inside-console))

- select the correct user as **Subject**

- assign the correct **Resource** by filling it with an object as follows:

```json
{
  "resourceType": "company",
  "resourceId": "{THE COMPANY ID YOU PROVIDED UPON CREATION}"
}
```

</details>
