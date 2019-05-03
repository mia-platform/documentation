# Quickstart

Thanks to this brief guide you will be able to experience the potential of Mia-Platform.

This guide is designed to let you immerse yourself in creating a real project.

## Target

The company Mangio Sano has entrusted your team with the creation of a platform for food delivery. What he asks you is to make a first working version in two days.

This guide will help you achieve it in **half a day** using all the components of Mia-Platform.

For ease of operation, the first version will not have a frontend for end users and does not manage the algorithm for allocating orders to riders. In this first version all riders see all orders.

## Functionality
Mangio Sano will rely on two external partners for the development of the App and Website for Final Customers and App for Riders. What the platform in its first version will allow is:

**Manage with a back office**

   * dishes
   * rider
   * orders
   * have statistics on the status of orders

**Allow a third party partner who is developing the frontend of the website and app to:**

  * send plate orders to the platform via API
  * engage with a payment gateway to process the payment of the order
  * know when the order is coming
  * calculate the delivery time of the order with respect to the time traffic
  * notify the user by e-mail of the order acceptance
  * notify the user via e-mail when the order has been delivered
  * Allow a third party partner who is developing the rider app
  * notify the rider's position
  * notify when an order has been delivered

## Prerequisites

For a quick start your APIC is configured with:

* Project created on the API console
* Installed service file
* Push notification installed

## What to do in 1'

* Create a Crud plate with image
* Create a Crud rider with rider position
* Create a Crud order with order location and order status
* Configure Push Notification Service in order to Send email on the order
* Create an External service on maps for the calculation of the arrival time
* Create a Custom service for order time calculation
* Create a BFF for order and notification
* Create a connection with Mia-platform Payment Gateway
* Debugging you services with telepresence
* Configure you Backoffice with pages and Analytics
* Monitor you Platform reading on Kibana of the logs
* Sending curls for orders and rider positions
* Configure the Mia-Platform Static Hosting service for a frontend react
* Configure the Mia-Platform Mobile SDK download for communicate with the different Apps
* Read your API Documentation and share your API with your Partner

## Create a Crud plate with image

For more information on the CRUD section access [this link]()

Go to Section CRUD and press the Button: "Create new CRUD".
Insert the name **plates** and press "Create".

Now you have to decide your collection's fields.  
For the plates collection we will create the following fields:

* **name**, type: string
* **ingredient**, type: array of string
* **image**, type: array of object
* **calories**, type: string
* **price**, type: number
* **quantity**, type: number

You have create your first collection!  
Now you should expose you collection through an Endpoint and create your first API.

Go to the Section Endpoint and press the button "Create new endpoint". Insert the following information.

 * **Base path** is: plates  
 * **Type** select CRUD
 * **Collection** select plate

 Press "Create". Now you have created your first API!

 For more information about the Endpoint Section and for discover all the potentialities of this section you can read here.

## Create a Crud rider with rider position

Go to Section CRUD and press the Button: "Create new CRUD".  
Insert the name **rider** and press "Create".

Now you have to decide your collection's fields.     
With the collection of riders we can know their personal data, their position and the data to get in touch with them.   
So for the riders collection we will create the following fields:

* **name**, type: string
* **surname**, type: string
* **position**, type: geopoint
* **image**, type: array of object
* **email**, type: string
* **skypeId**, type: string
* **chat**, type: string

Now you should expose you collection through an Endpoint and create the relative API.

Go to the Section Endpoint and press the button "Create new endpoint". Insert the following information.

 * **Base path** is: riders  
 * **Type** select CRUD
 * **Collection** select rider

 Press "Create".

## Create a Crud order with order location and order status

 Go to Section CRUD and press the Button: "Create new CRUD".  
 Insert the name **order** and press "Create".

 Now you have to decide your collection's fields.      
 With the order collection we want to have all the main information about our order: the data of the sender, the rider data, the order data.  
 So for the order collection we will create the following fields:

 * **total**, type: number
 * **plate**, type: array of string
 * **location**, type: geopoint
 * **status**, type: string
 * **orderData**, type: data
 * **rider**, type: string
 * **info**, type: string

 Now you should expose you collection through an Endpoint and create the relative API.

 Go to the Section Endpoint and press the button "Create new endpoint". Insert the following information.

  * **Base path** is: orders  
  * **Type** select CRUD
  * **Collection** select order

  Press "Create".

## Create an External service on maps for the calculation of the arrival time
## Debugging you services with telepresence
## Configure you Backoffice with pages and Analytics

Our client Mangia Sano requested us to manage with a back office:

   * dishes
   * rider
   * orders
   * have statistics on the status of orders.

The Business Suite of Mia-Platform allows you to manage your data through two components: CMS and Analytics.    
With the API Console you can easily configure the CMS and the Analytics.
For discover all the potentialities of our components check the relative section in the documentation:

* [CMS]()
* [Analytics]()

First we should decide how we would like to organize our menu: which are the categories? which are the pages?  We decide to create two categories: Plate and Orders. In the Plate category we will have the Plate page and in the Orders category we will have Orders and Riders pages.

Now let's create the Categories:

1. Creation of the Plate Categories: Press "Create new category", insert the name **Plate** with Order 10 and then press "Create".   

2. Creation of the Orders Categories: Press "Create new category", insert the name **Orders** with Order 20 and then press "Create".

Now we can create the relative pages.

**Create the Plate pages**

Press the button:"Create new page".   
Compile the form:

* Name: Plate
* Endpoint: select /plates
* Category: select Plate
* Icon: [choose you icon]() We have choosen "shopping-cart"
* Order: 10

Press Next

Choose the layout: Table


## Read your API Documentation and share your API with your Partner
