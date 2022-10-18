---
id: overview
title: Teleconsultation Service Frontend
sidebar_label: Overview
---
The teleconsultation service uses the [SaaS Bandyer Service](https://www.bandyer.com/) which allows you to create a video call between two or more people, providing also different tools (like chat, whiteboard, screen sharing, file upload ecc.).

The **Teleconsultation Service Frontend** handles and visualize the teleconsultation UI and all its relative tools for the call using iframe.

It has one Back End, the [Teleconsultation Service Backend](../teleconsultation-service-backend/overview), which allows you to handle all the necessary operations (create, update, delete), on the teleconsultations. The Back End uses the [RESTful APIs](https://docs.bandyer.com/Bandyer-RESTAPI/) provided by Bandyer.

## Teleconsultation Service Frontend Routes
The frontend service exposes the following routes:
 - `GET /teleconsultation/:teleconsultationId`: it allows the start of a teleconsultation;
