---
id: overview
title: Teleconsultation Service
sidebar_label: Overview
---
The teleconsultation service uses the [SaaS Bandyer Service](https://www.bandyer.com/) which allows you to create a video call between two or more people, providing also different tools (like chat, whiteboard, screen sharing, file upload ecc.).

It has one Front End, the **Teleconsultation Service Frontend**, to handle and visualize the UI widget and all its relative tools for the call. The Front End uses a [WEB SDK](https://github.com/Bandyer/Bandyer-Chat-Widget) provided by Bandyer.

It has one Back End, the **Teleconsultation Service Backend**, which allows you to handle all the necessary operations (create, update, delete), on the teleconsultations. The Back End uses the [RESTful APIs](https://docs.bandyer.com/Bandyer-RESTAPI/) provided by Bandyer.

:::caution
In order to use this service, you need first to contact Bandyer to create a Company, for your product and get the API_SECRET_KEY (for the Teleconsultation Service Backend) and the APP_ID (for the Teleconsultation Service Frontend).
:::

## Concepts you should be familiar with
Before continue reading the documentation, it's important to understand some basic concepts about Bandyer.

#### Company
A **Company** is an account created by Bandyer.
In order to use Bandyer's services, Bandyer has to provide you the SECRET_API_KEY (communicate with their RESTful APIs) and the APP_ID (in order to use their WEB SDK).

#### User
To access their services, a user must be registered on Bandyer.
There are two types of users:
 - **Plus User** - the one who can organize and participate to a call
 - **Basic User** - the one who participates to a call

:::note
In order to start a call, a **plus user** at least is required as participant in the call.
:::

For additional information about users, check [this link](https://docs.bandyer.com/Bandyer-RESTAPI/?shell#create-user).

#### Room
The virtual place where a call is hosted, is called a Room.
There's the possibility to specify a max duration for a Room in seconds (max time allowed 24h).

For additional information about rooms, check [this link](https://docs.bandyer.com/Bandyer-RESTAPI/?shell#create-room).

## Teleconsultation Service Frontend Routes
The frontend service exposes the following routes:
 - `GET /teleconsultation/:teleconsultationId`: it allows the start of a teleconsultation;

## Teleconsultation Service Backend APIs
The **Teleconsultation Service Backend** service exposes the following APIs:

 - `POST /teleconsultation`: it allows the creation of a new teleconsultation;
 - `PATCH /teleconsultation/:teleconsultationId`: it allows the complete or partial update of a teleconsultation (_participants_, *start_date*, *end_date*);
 - `DELETE /teleconsultation/:teleconsultationId`: it allows the deletion of a teleconsultation;
 - `GET /teleconsultation/:teleconsultationId`: it returns all the data needed to instantiate a UI widget to start the call.
