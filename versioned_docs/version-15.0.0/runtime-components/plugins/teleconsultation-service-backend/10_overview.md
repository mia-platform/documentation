---
id: overview
title: Teleconsultation Service Backend
sidebar_label: Overview
---



:::danger

The Teleconsultation Service is deprecated and under maintenance (bug fixes and security updates only) until end-of-life is reached in July 2026.

:::

The Teleconsultation Service Backend is a Mia-Platform plugin that acts as a BFF (Backend For Frontend) for the [Teleconsultation Service Frontend][teleconsultation-service-fe], that manages the teleconsultation UI and all the features and tools available during a call using an iframe.

The teleconsultation service uses the [SaaS Kaleyra Service][kaleyra] which allows you to create a video call between two or more people, providing also different tools (like chat, whiteboard, screen sharing, file upload ecc.). It provides also supports image background management and language management (only `it` and `en` are supported at the moment).

The **Teleconsultation Service Backend** allows you to handle all the necessary operations (create, update, delete), on the teleconsultations. The Back End uses the [RESTful APIs][kaleyra-rest-api] provided by Kaleyra.

:::caution
In order to use this service, you need first to contact Kaleyra to create a Company, for your product and get the BANDYER_API_SECRET_KEY (for the Teleconsultation Service Backend).
:::

:::warning
During the teleconsultation, data is processed by Kaleyra, so please be mindful not to share sensitive or personal information. For more details on data processing, refer to Kaleyra's [Terms of Service](https://www.kaleyra.com/terms-and-conditions/) and [Privacy Policy](https://www.kaleyra.com/privacy-policy-kaleyra/).
:::

## Overview

Before continue reading the documentation, it's important to understand some basic concepts about Kaleyra.

#### Company

A **Company** is an account created by Kaleyra.

In order to use Kaleyra's services, Kaleyra has to provide you the `BANDYER_API_SECRET_KEY` to communicate with their RESTful APIs.

:::note
A company has several customizable parameters, like theme, languages, virtual background, etc.

For additional information about company customization, please check [the REST API][kaleyra-rest-api].
:::

:::warning
At the moment, only the italian and the english language are fully supported by Kaleyra.
:::

#### User

To access their services, a user must be registered on Kaleyra.

There are two types of users:
 - **Plus User** - the one who can organize and participate to a call
 - **Basic User** - the one who participates to a call

:::note
In order to start a call, a **plus user** at least is required as participant in the call.
:::

For additional information about users, check [the REST API][kaleyra-rest-api].

#### Room

The virtual place where a call is hosted, is called a Room.

There's the possibility to specify a max duration for a Room in seconds (max time allowed 24h).

For additional information about rooms, check [this link][kaleyra-rest-api].

## Teleconsultation Service Backend APIs

The **Teleconsultation Service Backend** service exposes the APIs listed in the following table.

| Endpoint                                                           | Minimum version required | Deprecation version | Description                                                                               |
|--------------------------------------------------------------------|--------------------------|---------------------|-------------------------------------------------------------------------------------------|
| `POST /teleconsultation`                                           | 1.0.0                    |                     | Create a new teleconsultation.                                                            |
| `PATCH /teleconsultation/:teleconsultationId`                      | 1.0.0                    |                     | Complete or partial update a teleconsultation (_participants_, *start_date*, *end_date*). |
| ~~`POST /teleconsultation/:teleconsultationId/participants/data`~~ | 1.2.0                    | 2.0.0               | Add a new participant to the teleconsultation.                                            |
| `DELETE /teleconsultation/:teleconsultationId`                     | 1.0.0                    |                     | Delete a teleconsultation.                                                                |
| `GET /teleconsultation/:teleconsultationId`                        | 1.0.0                    |                     | Return all data required to instantiate a teleconsultation UI and start the call.         |
| `DELETE /teleconsultation/:teleconsultationId/uploads`             | 1.5.0                    |                     | Delete all files uploaded by the participants during a teleconsultation.                  |
| `POST /credentials`                                                | 1.4.0                    |                     | Return a valid accessToken for clients using SDK authentication.                          |
| `POST /settings/background-image`                                  | 1.6.0                    |                     |                                                                                           |
| `PATCH /settings/update`                                           | 1.6.0                    |                     |                                                                                           |
| `GET /transcription/:roomId/:sessionId` | 2.1.0 |  | Retrieves the session transcription. Requires `DEFAULT_RECORDING_TYPE` to be set to `automatic` or `manual`. See [USAGE][transcription-usage] for details. |


[kaleyra]: https://www.kaleyra.com/
[kaleyra-rest-api]: https://developers.kaleyra.com/support/home

[teleconsultation-service-fe]: /runtime-components/plugins/teleconsultation-service-frontend/10_overview.md

[transcription-usage]: /runtime-components/plugins/teleconsultation-service-backend/30_usage.md#get-transcriptionroomidsessionid
