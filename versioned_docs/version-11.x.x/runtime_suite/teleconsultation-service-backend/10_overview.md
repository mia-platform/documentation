---
id: overview
title: Teleconsultation Service Backend
sidebar_label: Overview
---
The Teleconsultation Service Backend is a Mia-Platform plugin that acts as a BFF (Backend For Frontend) for the [Teleconsultation Service Frontend](../../runtime_suite/teleconsultation-service-frontend/overview). The **Teleconsultation Service Frontend** handles and visualizes the teleconsultation UI and all its relative tools for the call using iframe.

The teleconsultation service uses the [SaaS Kaleyra Service](https://www.bandyer.com/) which allows you to create a video call between two or more people, providing also different tools (like chat, whiteboard, screen sharing, file upload ecc.).

The **Teleconsultation Service Backend** allows you to handle all the necessary operations (create, update, delete), on the teleconsultations. The Back End uses the [RESTful APIs](https://docs.bandyer.com/Bandyer-RESTAPI/) provided by Kaleyra.

:::caution
In order to use this service, you need first to contact Kaleyra to create a Company, for your product and get the BANDYER_API_SECRET_KEY (for the Teleconsultation Service Backend).
:::

## Concepts you should be familiar with
Before continue reading the documentation, it's important to understand some basic concepts about Kaleyra.

#### Company
A **Company** is an account created by Kaleyra.
In order to use Kaleyra's services, Kaleyra has to provide you the BANDYER_API_SECRET_KEY (to communicate with their RESTful APIs).

:::note
A company has several customizable parameters, like theme, languages, virtual background, etc.

For additional information about company customization, please follow [this link](https://docs.bandyer.com/Bandyer-RESTAPI/?shell#customization).
:::

#### User
To access their services, a user must be registered on Kaleyra.
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

## Teleconsultation Service Backend APIs

The **Teleconsultation Service Backend** service exposes the APIs listed in the following table.

| Endpoint                                                       | Minimum version required | Description                                                                               |
|----------------------------------------------------------------|--------------------------|-------------------------------------------------------------------------------------------|
| `POST /teleconsultation`                                       | 1.0.0                    | Create a new teleconsultation.                                                            |
| `PATCH /teleconsultation/:teleconsultationId`                  | 1.0.0                    | Complete or partial update a teleconsultation (_participants_, *start_date*, *end_date*). |
| `POST /teleconsultation/:teleconsultationId/participants/data` | 1.2.0                    | Add a new participant to the teleconsultation.                                            |
| `DELETE /teleconsultation/:teleconsultationId`                 | 1.0.0                    | Delete a teleconsultation.                                                                |
| `GET /teleconsultation/:teleconsultationId`                    | 1.0.0                    | Return all data required to instantiate a teleconsultation UI and start the call.         |
| `DELETE /teleconsultation/:teleconsultationId/uploads`         | 1.5.0                    | Delete all files uploaded by the participants during a teleconsultation.                  |
| `POST /credentials`                                            | 1.4.0                    | Return a valid accessToken for clients using SDK authentication.                          |
