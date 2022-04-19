---
id: crud_data_model_configuration
title: CRUD Data Model Configuration
sidebar_label: CRUD Data Model Configuration
---

This section describes the data model with its related collections used by the Mia-Backoffice (our Content Management System) for the management of the Developer Portal.

Currently, there are four collections: components, categories, requests, icons.

:::info
In order to facilitate the experience, we suggest importing the fields from the following **JSON files**.
:::

<table style={{textAlign:'left'}}>
  <tr>
    <th width='30%'>Name</th>
    <th width='30%'>Internal Endpoint</th>
    <th width='10%' style={{textAlign:'center'}}>JSON File</th>
  </tr>
  <tr>
    <td>components</td><td>/components</td>
    <td style={{textAlign:'center'}}>
      <a download target="_blank" href="/docs_files_to_download/dev-portal/components.json">
        <img src="./img/download.svg" width="10" height="10"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>categories</td><td>/categories</td>
    <td style={{textAlign:'center'}}>
      <a download target="_blank" href="/docs_files_to_download/dev-portal/categories.json">
        <img src="./img/download.svg" width="10" height="10"/>
      </a>
    </td>
  </tr>
    <tr>
    <td>tags</td><td>/tags</td>
    <td style={{textAlign:'center'}}>
      <a download target="_blank" href="/docs_files_to_download/dev-portal/tags.json">
        <img src="./img/download.svg" width="10" height="10"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>requests</td><td>/requests</td>
    <td style={{textAlign:'center'}}>
      <a download target="_blank" href="/docs_files_to_download/dev-portal/requests.json">
        <img src="./img/download.svg" width="10" height="10"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>icons</td><td>/icons</td>
    <td style={{textAlign:'center'}}>
      <a download target="_blank" href="/docs_files_to_download/dev-portal/icons.json">
        <img src="./img/download.svg" width="10" height="10"/>
      </a>
    </td>
  </tr>
</table>

## Components
This collection is used to store the components that will be displayed in the marketplace.

Excluding the default properties of the CRUD (_id, creatorId, createdAt, updaterId, updatedAt, __STATE__), the defined fields are:
- ***title***: the title of the component;
- ***icon***: the Object that contains the file icon definition. For more detail, refer to the [icons section](#icons);
- ***type***: the type of the component (API, Event...);
- ***category***: the category to which the component belongs;
- ***tags***: the tags to which the component is associated to;
- ***description***: the description of the component, that will be displayed in the component detail;
- ***linkApiPortal***: the URL used to redirect the user to the API portal;
- ***linkDocumentation***: the URL used to redirect the documentation portal;
- ***supporterName***: name of the entity that supports the component;
- ***supporterIcon***: the Object that contains the supporter icon definition. For more detail, refer to the [icons section](#icons).

## Categories
This collection is used to save the name and description of the categories that can be used to group your components inside the marketplace.

Excluding the default properties of the CRUD (_id, creatorId, createdAt, updaterId, updatedAt, __STATE__), the defined fields are:
- ***name***: Contains the name of the category;
- ***description***: Contains the description of the category.

## Tags
This collection is used to save the name and description of the tags that can be used to enrich your components inside the Marketplace.

Excluding the default properties of the CRUD (_id, creatorId, createdAt, updaterId, updatedAt, __STATE__), the defined fields are:
- ***name***: Contains the name of the tag;
- ***description***: Contains the description of the tag.

## Requests
This collection is used to save the access requests to your components, made from the components marketplace.

Excluding the default properties of the CRUD (_id, creatorId, createdAt, updaterId, updatedAt, __STATE__), the defined fields are:
- ***userEmail***: the email of the user that is requesting the access;
- ***userName***: the name of the user that is requesting the access;
- ***status***: the current status of the request (open, completed...);
- ***userOrganization***: the organization to which the user belongs to;
- ***requestedComponentId***: ID of the component that the user want to access;
- ***publicKey***: the RSA public key of the user that is requesting the access;
- ***additionalDescription***: an additional description field to include further details regarding the request.

## Icons
This collection is used to icons that you associate with each component.

Excluding the default properties of the CRUD (_id, creatorId, createdAt, updaterId, updatedAt, __STATE__), the defined fields are:
- ***name***: the original name of the uploaded file;
- ***size***: the size of the uploaded file;
- ***location***: the location of the file on the bucket;
- ***file***: the name of the file on the bucket.

