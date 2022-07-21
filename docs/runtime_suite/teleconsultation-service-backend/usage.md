---
id: usage
title: Teleconsultation Service Usage
sidebar_label: Usage
---
## Teleconsultation Service Frontend

The following sections explain the details about the routes in **Teleconsultation Service Frontend**.

### GET /teleconsultation/:roomId

This page will host the call of a specific room.

The parameter **teleconsultationId**, is the CRUD *_id* field of a specific teleconsultation.

Once the user will access the page, the _teleconsultationId_ will be used to connect the user to a specific Room. If the user is one of the participants of the Room, then the call will start, otherwise an error will be shown.

:::note
Bandyer does not support the possibility to make changes to existing rooms. 

For this reason, if the Bandyer room has not yet been created (i.e. some participant's data is not known) or if it could still be replaced by a new one, the `accessLinkURL` is not returned in the response (it is set to `null`). If all the participants are known, starting from `IMMUTABLE_PERIOD_MS` milliseconds before the starting time of the call, the service will refuse all the change requests to the teleconsultation instance and it will return the `accessLinkURL` to `GET /teleconsultation/:roomId` requests.
:::

If the access link URL is given, the user joins the bandyerCall, otherwise he/she must wait until a bandyer room is created and make the call again later to obtain the link (e.g. a possible frontend behavior is adding the user to a waiting room, and perform polling until the access link is available).

In order to start the call, the Front End side needs to instantiate a Bandyer Client Object. The needed data is provided by the API call: `GET /teleconsultation/:teleconsultationId`.

For further details about Bandyer Client Side, check [this link](https://github.com/Bandyer/Bandyer-Chat-Widget#create).

<p align="center">
  <img src="./assets/get_teleconsultation_fe.png" />
</p>

## Teleconsultation Service Backend

The following sections explain the details about the endpoints exposed from the **Teleconsultation Service Backend**.

This service has been develop based on the assumption that the user authentication method uses **auth0** as auth provider and the platform service [*auth0 Client*](../../runtime_suite/auth0-client/overview_and_usage).

In Bandyer there's the concept of _duration_ for a Room.
If a Room has a duration, then after the duration expires, the Room is unavailable.
The **Teleconsultation Service Backend** accepts, as body parameters for some routes, a **start_date** and an **end_date** to calculate the max duration of a teleconsultation.

## Flow example
The following sequence diagram show the usage of the service when:
- Participants data are not a priori known
- An auth0 dependency is not wanted

![flow_example_1](./assets/flow_example_1/image.svg)

### POST /teleconsultation

Adds a new teleconsultation in the CRUD teleconsultations collection, and possibly creates a new room on Bandyer.

:::note
The service will create a bandyer room only if all participants' data is specified in the request.
:::

#### Body parameters

##### participants (required) 
**Type**: `array of string` (only accepted if the service is configured to interact with auth0) or `object`
**Description**: The list of participants to the call. If a list of string is provided, each element of the array needs to be an auth0's user id of the participant. If an object is provided, you must specify:
- the expected `number` of participants;
- an array of participants' `data`, containing, for each participant:
  - a `userExternalId` to be used in GET requests to retrieve the correct link for a given user, if interaction with auth0 is enabled, it must be the auth0 id of the participant,
  - the `groups` (required if auth0 dependency is enabled, not supported otherwise) to be assigned to the user (one of those listed in any of the `privileges.$.groups` array of the service configuration file),
  - the `fullName` (required if auth0 dependency is enabled, not supported otherwise) to be show by the frontend,
  - the `language` to be used by the frontend.

Bandyer needs to know the list of the users which are going to join the call in order to create a Room. For this reason, if the length of the participant data array is less than expected number of participants (i.e. some participants' data is still unknown), the room on Bandyer is not created, otherwise, if all participants are known, it is created. In order to create a room, **Teleconsultation Service Backend** is going to translate each external user id into a Bandyer's user id. This operation is done as soon as the external user id is provide. If the user is still unknown (i.e. it has never been a participant of previous teleconsultation instances), the service creates a new user on Bandyer.

:::note
If a user has multiple roles, the higher role will be selected automatically.
:::

Example: ```['user1_auth0_id', 'user2_auth0_id', ...]```

##### start_date (required)
Type: `Date`
Description: The starting date of an appointment.
This date is used in combination with the end_date in order to calculate the duration of a teleconsultation.
The date follow the **ISO 8601** format: YYYY-MM-DDTHH:mm:ss.sssZ

Example: ```2022-02-22T15:30:00.000Z```

##### end_date (required)
Type: `Date`
Description: The starting date of an appointment.
This date is used in combination with the start_date in order to calculate the duration of a teleconsultation.
The date follow the **ISO 8601** format: YYYY-MM-DDTHH:mm:ss.sssZ

Example: ```2022-02-22T16:30:00.000Z```

<br />

**POST Request Examples**

With auth0 dependency and all a priori known participants:
```
curl -X POST "https://my_project_url/teleconsultation" \
     -d '{
         "participants": ['user1_auth0_id', 'user2_auth0_id', 'user3_auth0_id'],
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```

With auth0 dependency and all a priori known participants:
```
curl -X POST "https://my_project_url/teleconsultation" \
     -d '{
         "participants": {
           "number": 3,
           "data": [
              {
                "userExternalId": "user1_auth0_id",
                "language": "it"
              },
              {
                "userExternalId": "user2_auth0_id",
                "language": "it"
              },
              {
                "userExternalId": "user3_auth0_id",
                "language": "it"
              }
            ]
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```

With auth0 dependency and some a priori unknown participants:
```
curl -X POST "https://my_project_url/teleconsultation" \
     -d '{
         "participants": {
           "number": 3,
           "data": [
              {
                "userExternalId": "user1_auth0_id",
                "language": "it"
              },
              {
                "userExternalId": "user2_auth0_id",
                "language": "it"
              }
            ]
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```


Without auth0 dependency and some a priori unknown participants:
```
curl -X POST "https://my_project_url/teleconsultation" \
     -d '{
         "participants": {
           "number": 3,
           "data": [
              {
                "userExternalId": "user1_external_id",
                "groups": ["doctor"],
                "fullName": "Joe Smith",
                "language": "it"
              }
              {
                "userExternalId": "user3_external_id",
                "groups": ["patient"],
                "fullName": "Jane Doe,
                "language": "it"
              }
            ]
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```

#### Response

In case a teleconsultation is successfully created, a status code of 201 will be returned alongside an object with a field **roomId**, which contains the **_id** field of the teleconsultation on the CRUD just created.
The **roomId** will be used from the **Teleconsultation Service Frontend**, in order to request all the data from the **Teleconsultation Service Backend** to initialize the teleconsultation UI (using iFrame) and start the call. In reality the **roomId**, is the CRUD _id field of that teleconsultation.

Example Response:
```
201: { roomId: room_xyz }
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service POST / request.

If no one of the participants is a `plus` user the service returns the following response:
```
400: { "error": "Failed POST /teleconsultation: no plus user in room" }
```

<br/>

### PATCH /teleconsultation/:roomId

Updates a teleconsultation whose id is equal to roomId.
**roomId** is the **_id** field returned by the CRUD of a specific teleconsultation.

:::note
Bandyer does not support the possibility to make changes existing rooms. 

For this reason, the Bandyer room is created only if all participants data is provided. If the Bandyer room has already been created and a change having effects on its features is requested, the existing Bandyer room is deleted and a new one is created. If all participants' data has been provided, starting from [`IMMUTABLE_PERIOD_MS`](./configuration.md#environment-variables) milliseconds before the starting time of the call, the service will refuse all the change requests to the teleconsultation instance. See [`GET /teleconsultation/:roomId`](#get-teleconsultationroomid) documentation to understand how the service grants that participants cannot access a Bandyer room as long as it could be replaced by a new one. 
:::

#### Body parameters

Same body parameters of the POST request are allowed, but only the ones to be modified are required to be provided.

**PATCH Request Examples**

With auth0 dependency and all a priori known participants:
```
curl -X PATCH "https://my_project_url/teleconsultation/room_xyz" \
     -d '{
         "participants": ['user1_auth0_id', 'user2_auth0_id', 'user3_auth0_id'],
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```

With auth0 dependency and all a priori known participants:
```
curl -X PATCH "https://my_project_url/teleconsultation/room_xyz" \
     -d '{
         "participants": {
           "number": 3,
           "data": [
              {
                "userExternalId": "user1_auth0_id",
                "language": "it"
              },
              {
                "userExternalId": "user2_auth0_id",
                "language": "it"
              },
              {
                "userExternalId": "user3_auth0_id",
                "language": "it"
              }
            ]
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```

With auth0 dependency and some a priori unknown participants:
```
curl -X PATCH "https://my_project_url/teleconsultation/room_xyz" \
     -d '{
         "participants": {
           "number": 3,
           "data": [
              {
                "userExternalId": "user1_auth0_id",
                "language": "it"
              },
              {
                "userExternalId": "user2_auth0_id",
                "language": "it"
              }
            ]
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```


Without auth0 dependency and some a priori unknown participants:
```
curl -X PATCH "https://my_project_url/teleconsultation/room_xyz" \
     -d '{
         "participants": {
           "number": 3,
           "data": [
              {
                "userExternalId": "user1_external_id",
                "groups": ["doctor"],
                "fullName": "Joe Smith",
                "language": "it"
              }
              {
                "userExternalId": "user3_external_id",
                "groups": ["patient"],
                "fullName": "Jane Doe,
                "language": "it"
              }
            ]
         "start_date": "2022-02-22T15:30:00.000Z",
         "end_date": "2022-02-22T16:30:00.000Z"
     }'
```
### POST /teleconsultation/:roomId/participants/data

Pushes a new teleconsultation participant in the `participants.data` array of the teleconsultation instance having id equal to roomId.
**roomId** is the **_id** field returned by the CRUD of a specific teleconsultation.

:::note
Bandyer does not support the possibility to make changes existing rooms. For this reason, the Bandyer room is created only when all participants data is known. If all participants' data has been provided, starting from [`IMMUTABLE_PERIOD_MS`](./configuration.md#environment-variables) milliseconds before the starting time of the call, the service will refuse all the change requests to the teleconsultation instance. See the `GET /teleconsultation/:roomId` documentation to understand how the service ensures that participants cannot access a Bandyer room as long as such room can be replaced by a new one.
:::

#### Body parameters

The data of the participant to be added, that is:
  - a `userExternalId` to be used in GET requests to retrieve the correct link for a given user, if interaction with auth0 is enabled, it must be the auth0 id of the participant,
  - the `group` (required if auth0 dependency is enabled, not supported otherwise) to be assigned to the user (one of those listed in any of the `privileges.$.groups` array of the service configuration file),
  - the `fullName` (required if auth0 dependency is enabled, not supported otherwise) to be show by the frontend,
  - the `language` to be used by the frontend.


**POST Request Examples**

With auth0 dependency and all a priori known participants:
```
curl -X POST "https://my_project_url/teleconsultation/room_xyz/participants/data" \
     -d '{
          "userExternalId": "user3_auth0_id",
          "language": "it"
     }'
```


Without auth0 dependency:
```
curl -X POST "https://my_project_url/teleconsultation/room_xyz/participants/data" \
     -d '{
          "userExternalId": "user1_external_id",
          "groups": ["doctor"],
          "fullName": "Joe Smith",
          "language": "it"
     }'
```

#### Response

In case the participant is successfully added, a 201 status code will be returned.

Example Response:
```
201:
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service POST / request.

If you are requesting to add the last participant and no one of the participants (not the ones previously added neither the one who is requested to be inserted) is a `plus` user, the service returns the following response:
```
400: { "error": "Failed POST /teleconsultation/room_xyz/participants/data: no plus user in room" }
```

<br/>

#### Response

In case a teleconsultation is successfully updated, a status code of 204 will be returned without content. The **_id** field of the teleconsultation will remain the same.

Example Response:
```
204:
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service PATCH /:id request.


If no one of the participants is a `plus` user the service returns the following response:
```
400: { "error": "Failed PATCH /teleconsultation: no plus user in room" }
```

<br/>

### DELETE /teleconsultation/:roomId

Deletes a teleconsultation on Bandyer and set the state of that teleconsultation on CRUD to TRASH.
**roomId** is the **_id** field returned by the CRUD of a specific teleconsultation.

**Example DELETE Request:**
```
curl -X DELETE "https://my_project_url/teleconsultation/room_xyz"
```

#### Response

In case a teleconsultation is successfully deleted, a status code of 204 will be returned without content.

Example Response:
```
204:
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service DELETE /:id request.
