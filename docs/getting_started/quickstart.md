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

## What to do in a minute

* Create a Crud rider with rider position
* Create a Crud order with order and location and order status
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

## Create a Crud with rider position
