## How to create a Rest API in 5'min ##

In this guide you will discover how to create and display a Rest API with simplicity.
What you need is the API Console and the CMS.

!!! info
    Make sure you have GIT permissions to release and install both the API Console and the CMS.

We will guide you step by step in creating a CRUD API.
We will use as an example the creation of an endpoint **/books** imagining to have a library site.

The steps to follow are the following:

1. create the collection
2. expose the endpoint

## Create a new collection
So imagine that you have to create a new collection that contains the books of a library and let's understand what are the steps to be done.

To create a new collection, select **Collections** from the menu on the left of the API and select **Create a collection**.

First you need to enter the name of the collection in camelCase, in our case we will insert "books".

Default fields will appear that can not be changed: _id, creatorId, createdAt, updaterId, updatedAt, _STATE_

At this point we have to create our DB schema by creating the properties of our collection. The user can add a new property by selecting **add line**. Then you must complete the following fields:

![Crea-collezione-riga-titolo](img/crea_collezione.PNG)

* **Name**: enter the property name, in camelCase, in our case we will insert "title", "author", "year" etc.

* **Type**: the properties can be of different types: *string* if it is a classic text string (or an image); *number* if it is a number; *date* if it is a date with dd / mm / yyyy; *boolean* if it can only be true or false; *Geopoint* if you want to save a specific place; *Array* if you want to save as an ordered set of properties; *Object* if you want to insert an object.

* If you select **required** the property is mandatory.

* If you select **crypted** the data will be encrypted in the database. We recommend that you adopt this practice for sensitive or confidential data.

* If you select **nullable**, you can give the value *null*.

* In the **description** field you can enter a short optional description.

To create the collection at this point just select **create**.

!!! Warning
    the collection **is not saved yet** you need to press **save**. However, you should complete the endpoint and then save all the work

If you want to delete a property, select the line and select **delete** (next to "add line").

To **edit a collection** simply select the desired collection from the list in "collection" and edit the fields in the screen that is displayed.

## Create an endpoint
At this point you will need to add an endpoint to your newly created book collection.

To create an endpoint, select **Endpoints** and then **Create a new Endpoint**.

**Basepath**: is the prefix of the route. It can be set as the base address to which the API is served, relative to the host (name or ip) that supplies the endpoint. In our case, for example, we could insert "/books".

**Type**: The endpoint can be of different types:

* *Crud*: hook your endpoint directly to one of your collections.
* *External*: hook your endpoint to one of the external services registered in the services section.
* *Custom Microservices*: hook your endpoint to a service with logics entirely created by you.

In this section we will create a CRUD endpoint to which we will link our collection

**Collection**: select the collection of which the endpoint is part. In our case "books"

**Description**: optional description of the endpoint

Then select *Create*.
At this point we have created our endpoint!

Now you can configure your endpoint by assigning permissions and changing security.
The parameters you can configure are the following:

![crea-nuovo-endpoint](img/crea_endpoint.PNG)

### Name of the Endpoint
**Default Status**: With Default State you can choose whether the elements in the Collection will be made public on the applications as soon as they will be created and will therefore have Public status or if they will instead have Draft status and must therefore be made public by the CMS before being published.

**Collection**: the collection of which the endpoint belongs is displayed.

**Description**: short optional description

### Manage the security of your endpoints
If the route is **public**, you do not need to be logged in to be able to call it. If it is not public and is called by an unregistered user, it returns 401.
If it is **secreted** to be able to call it you need to set the Secret header with the correct value (you can see the secret in the homonymous screen)

**Groups of users that can access**: It is a logical expression to determine which groups have permission to call a given route. It can also be set to 0 (none) or to 1 (all). If the expression is true, then the user can access the route.

![sicurezza_endpoint](img/endpoint2.PNG)

### List of verbs
In this section you can view all the path that can be called of a CRUD endpoint. By selecting the different verbs in the management section it is possible to further detail who has the permissions to do certain actions.

If **inherited** is active the field will inherit the behavior of the base endpoint, de-selecting it can set specific rules related to this route.

For example, we can set that the post can only be reserved for a specific group of users.


## Save ##

Now we have created the collection, hooked an endpoint and defined the permissions.
We have therefore created our Rest API.
We just have to save and release in an environment.

You must then press save and commit the work done and then access the deployment area and choose an environment to release.

To populate the collection or to start testing the API you can either directly go to the **Documentation** area and test your API with the Swagger or [create a new CMS page](../../../business_suite/api_console_configcms.md) and take advantage of your API from the CMS.
