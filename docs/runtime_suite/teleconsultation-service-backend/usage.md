---
id: usage
title: Teleconsultation Service Usage
sidebar_label: Usage
---
## Teleconsultation Service Frontend

The following sections explain the details about the routes in **Teleconsultation Service Frontend**.

### GET /teleconsultation/:teleconsultationId

This page will host the call of a specific room.

The parameter **idTeleconsultation**, is the CRUD *_id* field of a specific teleconsultation.

Once the user will access the page, the _idTeleconsultation_ will be used to connect the user to a specific Room. If the user is one of the participants of the Room, then the call will start, otherwise an error will be shown.

In order to start the call, the Front End side needs to instantiate a Bandyer Client Object. The needed data is provided by the API call: `GET /teleconsultation/:teleconsultationId`.

For further details about Bandyer Client Side, check [this link](https://github.com/Bandyer/Bandyer-Chat-Widget#create).

<p align="center">
  <img src="../assets/doc/get_teleconsultation_fe.png" />
</p>

## Teleconsultation Service Backend

The following sections explain the details about the endpoints exposed from the **Teleconsultation Service Backend**.

This service has been develop based on the assumption that the user authentication method uses **auth0** as auth provider and the platform service [*auth0 Client*](../../runtime_suite/auth0-client/overview_and_usage).

In Bandyer there's the concept of _duration_ for a Room.
If a Room has a duration, then after the duration expires, the Room is unavailable.
The **Teleconsultation Service Backend** accepts, as body parameters for some routes, a **start_date** and an **end_date** to calculate the max duration of a teleconsultation.

### POST /teleconsultation

Creates a new teleconsultation on Bandyer and in the CRUD teleconsultations collection.

#### Body parameters

##### participants (required) 
Type: `array of string`
Description: The list of participants to the call.
Each element of the array needs to be a auth0's user id of the participant.
Bandyer needs to know the list of the users which are going to join the call in order to create a Room. The **Teleconsultation Service Backend** is going to translate each auth0's user id into Bandyer's user id.

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

**Example POST Request:**
```
curl -X POST "https://my_project_url/teleconsultation" \
     -d '{
         "participants": ['user1_auth0_id', 'user2_auth0_id', 'user3_auth0_id'],
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

<br/>

### PATCH /teleconsultation/:roomId

Updates a teleconsultation whose id is equal to roomId.
**roomId** is the **_id** field returned by the CRUD of a specific teleconsultation.

#### Body parameters

##### participants (NOT required) 
Type: `array of string`
Description: The list of participants to the call.
Each element of the array needs to be a auth0's user id of the participant.
Bandyer needs to know the list of the users which are going to join the call in order to create a Room. The **Teleconsultation Service Backend** is going to translate each auth0's user id into Bandyer's user id.

Example: ```['user_xxx', 'user_yyy', ...]```

##### start_date (NOT required) 
Type: `Date`
Description: The starting date of an appointment.
This date is used in combination with the end_date in order to calculate the duration of a teleconsultation.
The date follow the **ISO 8601** format: YYYY-MM-DDTHH:mm:ss.sssZ

Example: ```2022-02-22T15:30:00.000Z```

##### end_date (NOT required) 
Type: `Date`
Description: The starting date of an appointment.
This date is used in combination with the start_date in order to calculate the duration of a teleconsultation.
The date follow the **ISO 8601** format: YYYY-MM-DDTHH:mm:ss.sssZ

Example: ```2022-02-22T16:30:00.000Z```

<br />

**Example PATCH Request:**
```
curl -X PATCH "https://my_project_url/teleconsultation/room_xyz" \
     -d '{
         "participants": ['user1_auth0_id', 'user2_auth0_id']
     }'
```

#### Response

In case a teleconsultation is successfully updated, a status code of 204 will be returned without content. The **_id** field of the teleconsultation will remain the same.

Example Response:
```
204:
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service PATCH /:id request.

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
