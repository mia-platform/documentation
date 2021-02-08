# Create your first Mia-Platform real project

Take a walkthrough that covers creating your first real project. You will:

* use [CRUDs](../../development_suite/api-console/api-design/crud_advanced.md).
* create [microservices](../../development_suite/api-console/api-design/plugin_baas_4.md).
* Use and configure a [Plugin](../../business_suite/overview-business-suite.md).
* configure the [CMS](../../business_suite/cms_configuration/config_cms.md).

At the end of these steps, your services will run on Mia-Platform PaaS.

Thanks to this brief guide, you will be able to experience the potential of Mia-Platform.

## What are we building

The company *Serial Eater* has entrusted your team with the creation of a platform for food delivery. What he asks you is to make a first working version in **two days**.

This guide will help you achieve it in **half a day** using the components of Mia-Platform.

For ease of operation, the first version will not have a frontend for end-users and does not manage the algorithm for allocating orders to riders. In this first version all riders see all orders.

## Prerequisites

We’ll assume that you have some familiarity with **JavaScript** and **Node.js**, but you can follow along even if you're coming from a different programming language. All concepts explained following are valid for all languages and frameworks.

Prepare your favourite IDE to interact with Git repositories.
Don't scary, you won't write too much code. One of the main Mia-Platform goals is to give you an **open ready-to-use infrastructure to allow to focus on business logic**.

## What features we will implement

The company will rely on **two external partners** for the development of the app and website for final customer and riders.

The first version of the platform will allow to:

**Manage with a back-office:**

* dishes.
* rider.
* orders, with statistics.

**Allow a third party partner who is developing the frontend of the website:**

* Send orders to the platform via API.
* Engage with a payment gateway to process the payment of the order.
* Know when the order is coming.
* Calculate the delivery time of the order with respect to the time traffic.
* Notify the user by e-mail of the order acceptance.
* Notify the user via e-mail when the order has been delivered.
* Notify the rider's position.
* Notify when an order has been delivered.

**Allow a partner who is developing the app to:**

* Notify the rider's position.
* Notify when an order has been delivered.

!!! info
    For a quick start, you will find a project named *Your First Project* installed in your Console.

## Create CRUDs

First of all, your platform should be able to store information. With Mia-Platform you can easily create [MongoDB](https://www.mongodb.com/) collections to be manipulated by a CRUD.

We will need the following collections to manage this information:

* Dishes collection.
* Ingredients collection.
* Riders collection.
* Orders collection.
* Customers collection (the users of the platform).

### Create a CRUD for dishes

This collection will contain dishes with images. In order to create the CRUD follow these steps:

1. Select the project *Your First Project*.
2. Select *Design section*.
3. Select the branch *master*.
4. Go to section [CRUD](../../development_suite/api-console/api-design/crud_advanced.md) and click *Create new CRUD*.
5. Insert the name `dishes` and press *Create*.
6. Now you have to set your collection's fields. Scroll to *Fields* section and click *Add New* to create the following fields:

| **Field name**             | **Type**         |
| -------------------------- | ---------------- |
| **name** (required)        | String           |
| **description**            | String           |
| **vegetarian** (required)  | Boolean          |
| **vegan** (required)       | Boolean          |
| **ingredients** (required) | Array of Objects |
| **price** (required)       | Number           |
| **calories**               | Number           |
| **images**                 | Array of objects |

!!! Warning
    Be careful to set each field correctly. You won't be able to change later.

![Mia-Platform](img/walktrough-crud-dishes.png)

That's it? Yes! We have just created a MongoDB collection and a CRUD ready to be exposed by an API with very few steps.

**Now you should expose your collection through an Endpoint and create your first API.**

1. Go to section [Endpoints](../../development_suite/api-console/api-design/endpoints.md) and click *Create new endpoint*. Then enter the following information:
   */dishes* as **Base path**.
   *CRUD* as **Type**.
    Select *dishes* as **CRUD**.

   ![Mia-Platform](img/walktrough-endpoint-dishes-conf.png)

2. Click *Create*. You have just created your first API!  

   The detail view shows other configurations that we'll use later. Scroll down to *Routes* section to see an overview of routes of your API:

   ![Mia-Platform](img/walktrough-endpoint-dishes-routes.png)

3. To confirm changes just press **Commit & Generate**. We suggest to write a proper title for each commit, in this case, we can enter *Created CRUD "dishes" and the related endpoint".

    !!! Warning
        All items in design area **are not saved** until you click **Commit & Generate**. However, you can create different entities and then save all the work only at the end.  
        Internally, when you commit, the Console properly updates and commit the Kubernetes files on configuration repository of your project.

Checkout the [endpoint documentation](../../development_suite/api-console/api-design/endpoints.md) for more information about the section and to discover all the potentialities of this feature.

### Create a CRUD for ingredients

After the dishes, we have to create the collection of ingredients, storing the name and a description.
Then create a new `ingredients` CRUD with the following fields:

| **Field name**      | **Type** |
| ------------------- | -------- |
| **name** (required) | String   |
| **description**     | String   |

As did earlier, you should expose your collection through an Endpoint and create the relative API.

Create the endpoint entering the following information:

* */ingredients* as **Base path**.
* *CRUD* as **Type**.
* Select *riders* as **CRUD**.

### Create a CRUD for riders

Now we have to create the collection of riders. We have to know their personal data, the used mean of transport, their position, rank and the data to get in touch with them.
Then create a new `riders` CRUD with the following fields:

| **Field name**         | **Type**        |
| ---------------------- | --------------- |
| **name** (required)    | String          |
| **surname** (required) | String          |
| **email** (required)   | String          |
| **phone** (required)   | String          |
| **rating** (required)  | Array of number |
| **position**           | GeoPoint        |
| **transportType**      | String          |

Expose your collection through an Endpoint and create the relative API.

Create the endpoint entering the following information:

* */riders* as **Base path**.
* *CRUD* as **Type**.
* Select *riders* as **CRUD**.

### Create a CRUD for customers

We need to create a collection of customers. We need to know their personal data and above all the addresses to which we can send the order.  
Then create a new `customers` CRUD with the following fields:

| **Field name**         | **Type**        |
| ---------------------- | --------------- |
| **name** (required)    | String          |
| **surname** (required) | String          |
| **email** (required)   | String          |
| **phone** (required)   | Number          |
| **addresses**          | Array of string |

Expose your collection through an Endpoint entering the following information:

* */customers* as **Base path**.
* *CRUD* as **Type**.
* Select *customers* as **CRUD**.

### Create a CRUD for orders

By collecting the orders, we want to have all the primary information about our order: the order data and the customer who requested it, the driver and the plates. Last but not least the address to send the order.
So we will create an `orders` collection with the following fields:

| **Field name**            | **Type**        |
| ------------------------- | --------------- |
| **status** (required)     | String          |
| **isLate**                | Boolean         |
| **orderedAt**             | Date            |
| **customerId** (required) | ObjectId        |
| **dishes**                | Array of object |
| **address**               | String          |
| **amount**                | Number          |

!!! info
    The *dishes* field will contain an array of objects where each element is a single document from the *dishes* collection, instead the *customerId* field contains the id of customer document.

Expose your collection through an Endpoint entering the following information:

* */orders* as **Base path**.
* *CRUD* as **Type**.
* Select *orders* as **CRUD**.

Now let's commit and save our work to be ready to deploy.

## Let's deploy

Now, to test our CRUDs, we have to deploy our project:

1. Go to section [Deploy](../../development_suite/deploy/deploy.md) and click *Create new CRUD*.
2. As environment select *Development*
3. Select the branch master *Master*. You can see the related last commit.
4. Click *Deploy*

Once deployed our endpoints can immediately be tested with the API Portal.

!!! info
    Internally, the Console starts CI/CD pipeline of the repository of your project. The pipeline will push the image to docker and upload it to Nexus. Then the image will pull to Kubernetes in order to your services go immediately online

## Try your API

To try our CRUDs automatically exposed by an API, let's how access to [API Portal](../../development_suite/api-portal/api-documentations.md) to try it and see the auto-generated API documentation.

Select from navigation bar *Documentation*, then select *Development*. You'll see the list of your CRUDs, each list contains the routes of your API, with a functionality description.

Try to get a list of dishes:

1. Click route `GET /v2/dishes/`.
2. You'll see a params section where you enter values to try the route. In this case not specify anything.
3. Click *Try it* to test the route. You should see the results of the call in the *Results* box, under *Examples* that contains ready-to-use code to make the HTTP request.

Don't you see anything? Do not worry! There is no data in our CRUD yet. In the next step, we will create our first service and it will be just dedicated to generating test data.

!!! info
    You may already share the specs of your APIs with partners that are building the apps. You can export them to a JSON/Yaml file compliant with OpenAPI 3/Swagger format.  Check out the [API Portal documentation](../../development_suite/api-portal/api-documentations.md) to further detail.

### Create services

Mia-Platform adopts a microservices architecture, so our food delivery platform will be sliced into a set of smaller and interconnected services. Each microservices will be responsible for a single business logic.  
With Mia-Platform you can easily create and orchestrate your microservices. You can create a service from [examples](../../marketplace/examples/mia_examples.md) and [templates](../../marketplace/templates/mia_templates.md) or get one ready to use. There is a [whole set](../../runtime_suite/mia-platform-plugins.md based on different use cases.  

:::info
For this walkthrough we'll use a ready-to-use service that we'll customize. You can find this in the [Marketplace](../../marketplace/overview_marketplace.md), with many other templates, example and ready-to-use services.
:::

### Create data generator service

As mentioned above there is no data in our CRUDs, and in order to correctly develop the service, we need to create and consume test data. Now will create our first service that will be responsible to create these data. In order to create the service follow these steps:

1. In *Design area*,go to [Microservices section](../../development_suite/api-console/api-design/services.md) and click *Create a Microservice*.
2. Search the example `Data generator example`, then click the related tab.
3. Now you have to set your collection's fields. Scroll to *Fields* section and click *Add New* to create the following fields:
