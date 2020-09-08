## How to create a Rest API in 5'min ##

In this guide you will discover how to create and display a Rest API with simplicity.
What you need is the API Console and the CMS.

!!! info
    Make sure you have GIT permissions to release and install both the API Console and the CMS.

We will guide you step by step in creating a CRUD API.
We will use as an example the creation of an endpoint **/books** imagining to have a library site.

The steps to follow are the following:

1. Create a CRUD.
2. Expose the endpoint.

## Create a new CRUD
So imagine that you have to create a new collection that contains the books of a library. To do this, let's see which steps need to be done:


1. To create a new CRUD, select **CRUD** from the menu on the left of the API and select **Create new CRUD**.

2. First, you need to enter the name of the CRUD in camelCase, in this case we will insert "books". Then you will need to enter an **internal endpoint** that exposes your CRUD internally and its **default state** than could be **draft** or **public**. The default values in the console will be a path equal to /enpointname and default state equal to draft. 
Default fields will appear that can not be changed: *_id*, *creatorId*, *createdAt*, *updaterId*, *updatedAt*, *_STATE_*.  
At this point we have to create our DB schema by creating the properties of our CRUD. In this section you can add a new property by selecting **Add New**. Then you must complete the following fields:    
  ![Crea-collezione-riga-titolo](img/create-CRUD-1.png)
    * **Name**: enter the property name, in camelCase, in our case we will insert "title", "author", "year" etc.

    * **Type**: the properties can be of different types: *string* if it is a classic text string (or an image); *number* if it is a number; *date* if it is a date with dd / mm / yyyy; *boolean* if it can only be true or false; *Geopoint* if you want to save a specific place; *Array* if you want to save as an ordered set of properties; *Object* if you want to insert an object.

    * If you select **required** the property is mandatory.

    * If you select **crypted** the data will be encrypted in the database. We recommend that you adopt this practice for sensitive or confidential data.

    * If you select **nullable**, you can give the value *null*.

    * In the **description** field you can enter a short optional description.

    For this example, we could create two properties: one for the title and one for the author of the book.  
    If you want to delete a property, click the trash icon inside the related row.

3. To create the CRUD at this point just press **Commit & Generate**.

    !!! Warning
        All items in design area **are not saved** until you click **Commit & Generate**. However, you can create different entities and then save all the work only at the end

To **edit a CRUD** simply select the desired item from the list and edit the fields in the screen that is displayed.

## Create an endpoint
At this point you will need to add an endpoint to your newly created book CRUD.

To create an endpoint:

1. Select **Endpoints** and then **Create a new Endpoint**. You can configure the following properties:

    - **Basepath**: is the prefix of the route. It can be set as the base address to which the API is served, relative to the host (name or ip) that supplies the endpoint. In our case, for example, we could insert */books*.

    - **Type**: The endpoint can be of different types:

        * *CRUD*: hook your endpoint directly to one of your CRUD.
        * *Microservice*: hook your endpoint to a service with logics entirely created by you.
        * *Mia-Platform BaaS*: hook your endpoint to some specific mia-platform services.
        * *External proxy*: hook your endpoint to a proxy linked to a service outside of your cluster.
        * *Cross Projects proxy*:  hook your endpoint to a proxy linked to another project contained in your cluster.

2. In this case, we will create a CRUD endpoint to which we will link our CRUD just created. Then, as CRUD select the CRUD of which the endpoint is part. In our case *books*. 
Once you have selected your CRUD, you will need to select one of the existing routes associated with your CRUD. You can find more information on CRUD and how to create a route in the [CRUD](crud_advanced.md) or [endpoint](endpoints.md) documentation. You can also set an optional description. 

The configuration should be like this:

![create-new-endpoint](img/qs-create-endpoint-1.png)

3. Then select *Create*.
At this point we have created our endpoint! 

## Configure the endpoint
Besides of properties previously set, you can configure permissions and security settings of the endpoint:
 
### Manage the security of your endpoints
In the *Management* section you can manage the security at the endpoint level. 

If the route is **public**, you do not need to be logged in to be able to call it. If it is not public and is called by an unregistered user, it returns 401.
If the **Only with an API key** flag is checked to be able to call the endpoint, you need to add the Secret header with the correct API Key that you can set in **API Key** item on the left menu.

**User group permission**: It is a logical expression to determine which groups have permission to call a given route. It can also be set to 0 (none) or to 1 (all). If the expression is true, then the user can access the route.

![secure_endpoint](img/qs-configure-endpoint-api-key.png)

### Routes
In this section, you can view all the paths of a CRUD endpoint that can be called. By selecting the different route, it is possible to further detail who has the permissions to do specific actions.

If **inherited** is active the field will inherit the behaviour of the base endpoint, de-selecting it can set specific security rules related to this route.

For example, we can set that the post can only be reserved for a specific group of users.

## Generate and deploy ##
Now we have created the collection, hooked an endpoint and defined the permissions.
We have therefore created our Rest API.

We just have to save and release in an environment. The steps to follow are the following:

1. Click *Commit & Generate* that you can find on the top of the screen.
2. Then access the [Deploy area](../../deploy/deploy.md) and choose an environment to release.

To populate the collection or to start testing the API you can either directly go to the [Documentation area](../../api-portal/api-documentations.md) and test your API with the Swagger.
