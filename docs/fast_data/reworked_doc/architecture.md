---
id: architecture
title: Architecture
sidebar_label: Architecture
---

<head>
   <meta name="robots" content="noindex, nofollow" />
</head>

In this page, you will find:
* An overview of the services and technologies used in a Fast Data system; 
* A discussion over the architecture.

## Overview

Fast Data is based on a group of services that communicate with each other via events sent on **Kafka** or **MongoDB**, and persisting Projections and Single Views on MongoDB.
This architectural setup allows for **great horizontal scalability**.

![Fast Data overview](../img/fastdata-overview-new.png)

## Services

### Real Time Updater (RTU)

The Real Time Updater is responsible for listening to the events concerning changes to the SoR and updating the Projections accordingly. Optionally, the RTU can perform other activities:

* Emit `Projection Update` events, notifying the listener that a certain Projection has been updated;
* Check which Single Views should be updated, and emit the relevant `Projection Change` event.

It is up to you to decide whether to make it execute any of these, based on the architecture you prefer to build. For example, if having your Projections up to date in a very short period of time is crucial for your business, you might want to skip the part where you check which Single Views should be updated, delegating this job to the Single View Trigger and decreasing the overhead of the RTU.

### Single View Trigger (SVT)

The Single View Trigger listens to `Projection Update` events, performing the logic needed to get the identifiers of all the Single Views that need to be updated, and emits the relevant `Projection Change` events.
This activity can be performed by the RTU as well. Using the SVT is recommended for a faster update of Projections, and a greater fault tolerance for the RTU.

### Single View Creator (SVC)

The Single View Creator reacts to Projection Change events, updating the Single Views by aggregating the relevant data. It can optionally emit `Single View Event` and `Single View Before After` events.
If the service is configured to read the `Projection Change` events on Kafka, then it will use the usual publish/subscribe pattern, granting support to horizontal scalability and fault tolerance with ease.
If the service is configured to read the `Projection Change` events on MongoDB, then it will poll MongoDB to check if there are any events that need to be handled. To avoid concurrency problems, it reads atomically and marks the `Projection Change`, so that other SVCs won't start processing the same data.

## Technologies

Fast Data revolves around three major technologies: Kubernetes, Kafka, and MongoDB.
The Kubernetes part is pretty much standard, and thanks to the Console you won't need to directly deal with it, but will still enjoy all the advantages it has to offer.

On the other hand, Kafka and MongoDB can be used in different steps of the process, and are thus discussed in the following subsections.

### Kafka

Kafka is a distributed event streaming platform, and it is used for most Fast Data events, starting from the ones produced by the CDC, up to the ones produced by the SVC.
For some intermediate data, however, it is possible to choose whether you want it on Kafka or MongoDB, that is the case for `Projection Change` events.

Kafka is very reliable, and has a great support for topic partitioning. This enables horizontal scalability, since it is possible to have multiple replicas of the same service: each replica will read from its own partition, granting all the required properties and speeding up the process. This way, it is as close to being real-time as possible.

### MongoDB

MongoDB is a non-relational data store, used for storing Projections, Single Views, and some intermediate data, namely `Projection Change` and `Single View Error` collections.
In the case of Fast Data, the Projection and Single View collections are saved in a format that is compatible with the CRUD service, which opens a ton of possibilities for exposing new services and consuming data in innovative ways.

MongoDB is great for horizontal scalability.

#### CRUD Service

Since the MongoDB collections are compatible with the CRUD Service and are automatically registered by the Console, they are ready to be exposed as APIs and are easily customizable (e.g. adding indexes just requires a few clicks in the Console). This allows you to easily connect them to the CMS, your applications, analytics, and third party software.

## Putting it all together

Fast Data architecture is rather streamlined, with just a couple of pivoting points. A regular flow of information follows this path:

1. The CDC emits an event stating that some data in the SoR has changed;
2. The RTU performs the normalization of the messages received by the CDC to select the ones of interest and make them adhere to a standard of interest, and then stores the Projections on MongoDB;
   1. The RTU emits a `Projection Update` event, if it is configured to do so;
3. The RTU or the SVT (depending on which one you chose for your architecture) compute and emit a `Projection Change` event, saving it either on Kafka or on MongoDB
4. The SVC reads the `Projection Change` message, either polling MongoDB or reacting to the Kafka message. Then, it aggregates the Single View using the new data, and stores it to MongoDB;
   1. The SVC emits a `Single View Event` and/or a `Single View Before After` event, if it is configured to do so.

![Fast data architecture](../img/fastdata-arch-new.png)

There are no hard constraints, but generally all the services belong to the same Kubernetes namespace, while the MongoDB and Kafka instances can be on managed hosts, on the same cluster, on premise, etc.

The SoRs usually belong to a different network portion, far from all the processing logics, since they must be kept independent of all the Fast Data flow, with the only exception of the CDC being connected to them.
