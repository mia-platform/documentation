---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to configure the **Teleconsultation Service**, you need to deploy two services: the **Teleconsultation Service Backend** and the **Teleconsultation Service Frontend**.
Both are available in the Marketplace.

## Teleconsultation Service Frontend Configuration

In order to make accessible the route to the page where the teleconsultation will take place, you need to create an additional **endpoint** to expose that route.

Example:
1. Custom **endpoint** to expose teleconsultation-service-fe: `/telecons-fe`
2. Custom **endpoint** to expose route for teleconsultation: `/telecons-fe/teleconsultation`

:::warning
The service won't work if **both endpoints** are not specified.
:::

## Teleconsultation Service Backend Configuration

1. Create the Teleconsultation Service Backend to serve the APIs needed for the correct functionality of the Teleconsultation Service Frontend. To create the Teleconsultation Service Backend you can search for it in the Console Marketplace. Choose a name for the new service (e.g. teleconsultation-service-be).

2. Create the `/api/v1/telecons-be` endpoint for the newly created microservice. The endpoint of this microservice must be exactly this one because the Teleconsultation Service Frontend will use this path as prefix for the API calls to the Teleconsultation Service Backend.

The microservice requires the `BANDYER_API_SECRET_KEY` environment variable in order to communicate with the Bandyer RESTful APIs.

The keys defined inside the **API Key** section on the console are converted in client-types (e.g. `backoffice`, `cms`, etc.). These client-types are used by Auth0 to understand the application the user is authenticating to and get the user's data needed to make the **Teleconsultation Service** works.
If no client-type is provided a default value will be used instead.
You need to add the `DEFAULT_CLIENT_TYPE` environment variable to customize the default value of the client-type.

:::note
In order to retrieve the auth0 user's data, you need to define the `AUTHORIZATION_HEADERS_TO_PROXY` environment variable inside the **authorization-service** with value: `cookie,authorization,client-type`.

The microservice requires the `ADDITIONAL_HEADERS_TO_PROXY` environment variable with value: `x-forwarded-for,x-request-id,x-forwarded-host,cookie,client-type`, in order to forward the auth0 user's data received to the BE services called inside the microservice.
:::

The microservice requires the `TELECONSULTATION_SERVICE_CONFIG_PATH`  environment variable to specify the path where the  `JSON` config file is stored.
If no path is defined a default configuration will be used. 
The default configuration is the following:
```
{
  privileges: {
    basic: {
      groups: [
        'customer',
      ],
      tools: {
        chat: true,
        screen_sharing: true,
        file_upload: true,
        whiteboard: true,
        snapshot: true,
        live_edit: true,
        live_pointer: true,
        present_to_everyone: true,
      },
    },
    plus: {
      groups: [
        'doctor',
      ],
      tools: {
        chat: true,
        screen_sharing: true,
        file_upload: true,
        whiteboard: true,
        snapshot: true,
        live_edit: true,
        live_pointer: true,
        present_to_everyone: true,
      },
    },
  },
  theme: {
    light: {
      primaryColor: '#fff',
      accentColor: '#480ca8',
    },
    dark: {
      primaryColor: '#003049',
      accentColor: '#d62828',
    },
  },
  environment: 'sandbox',
  mode: 'window',
  companyLogo: {
    url: 'https://www.insert.url.it',
  },
}
```

Update the `JSON` configuration file in the ConfigMaps section according to your needs.

### Environment Variables

The Teleconsultation Service Backend accepts the following environment variables.

- **BANDYER_API_SECRET_KEY (required)**: API Secret Key to use in order to communicate with Bandyer's APIs.
- **BANDYER_BASE_URL (required)**: name of the bandyer API endpoint.
- **TELECONSULTATION_SERVICE_CONFIG_PATH**: full path of the updated file defined in the [previous section](#environment-variables).
- **TELECONSULTATIONS_CRUD_NAME**: name of the endpoint of the CRUD with all the teleconsultations.
- **USER_ID_MAP_CRUD_NAME**: name of the endpoint of the CRUD with all the user_ids (e.g. auth0Id, bandyerId), for each user.
- **AUTH_SERVICE**: name of the authentication service.
- **DEFAULT_CLIENT_TYPE**: name of the application that auth0-client uses to retrieve data of the users involved in the teleconsultation.
- **UNLIMITED_TELECONSULTATION**: if true the teleconsultation duration is infinite. 

### Teleconsultation Service Configuration

The Teleconsultation Service Configuration is a JSON object with 5 root properties.

**1. privileges**

-   _type_: object;
-   _required_:  `true`;
-   _description_: contains 2 types of users (*basic* and *plus*) and their privileges details for the call (e.g. The tools they can use during the call).

**2. environment**

-   _type_: string;
-   _required_:  `true`;
-   _description_: can assumes two values: _sandbox_ or _production_. Specify the Bandyer environment's you want to use.

**3. theme**

-   _type_: object;
-   _required_:  `false`;
-   _description_: define the theme of (_light_ and _dark_ mode), of the teleconsultation UI used for the call.

**4. companyLogo**

-   _type_: object;
-   _required_:  `false`;
-   _description_: contains a field called _url_, which specify the url where the company logo is stored.

The `JSON` file is structured like the following example:
```
{
  "privileges": {
    "basic": {...},
    "plus": {...}
  },
  "environment": "sandbox",
  "mode": "window",
  "theme": {
    "light": {...},
    "dark": {...}
  },
  "companyLogo": {
    "url": ""
  }
}
```

##### 1.1 Privileges parameters
This part of the configuration object lets you specify the details for the different types of users (*basic* and *plus*). At the moment the following parameters are supported:

- ##### basic
- ##### plus

Example:
```
"privileges": {
  "basic": {
    "groups": ["customer"],
    "tools": {
      "chat": true,
      "screen_sharing": true,
      "file_upload": true,
      "whiteboard": true,
      "snapshot": true,
      "live_edit": true,
      "live_pointer": true,
      "present_to_everyone": true
    }
  },
  "plus": {
    "groups": ["doctor"],
    "tools": {
      "chat": true,
      "screen_sharing": true,
      "file_upload": true,
      "whiteboard": true,
      "snapshot": true,
      "live_edit": true,
      "live_pointer": true,
      "present_to_everyone": true
    }
  }
}
```

The following specification is valid for both *basic* and *plus*:

- *type*: object;
- *required*: `true`;
- *description*: contains the groups which this user is part of and the tools which this user can use;

##### 1.1.1 Basic / Plus parameters
This part of the configuration object lets you specify the groups which this user belong to and the tools which can be used.
At the moment, the following parameters are supported:

- ##### groups
  - *type*: array;
  - *required*: `true`;
  - *description*: contains the groups' names which this user is part of;

- ##### tools
  - *type*: object;
  - *required*: `false`;
  - *description*: contains the tools which this user can use during the call;
  - *fields list*:
    - chat: 
      - *type*: boolean,
      - *description*: Enable the chat feature
    - screen_sharing: 
      - *type*: boolean,
      - *description*: Enable the screen_sharing feature
    - file_upload:
      - *type*: boolean,
      - *description*: Enable the capability to send file
    - whiteboard:
      - *type*: boolean,
      - *description*: If true enable all the whiteboard tools
    - snapshot:
      - *type*: boolean,
      - *description*: Enable the snapshot feature (let's you take a screenshot during the call)
    - live_edit:
      - *type*: boolean,
      - *description*: Enable the live edit feature
    - live_pointer:
      - *type*: boolean,
      - *description*: Enable to send pointer-events to others participants (always active in reception)
    - present_to_everyone:
      - *type*: boolean,
      - *description*: Enable the capability to force your own video to be featured for other participants

##### 4.1 Theme parameters
Specify two modes for the theme: _light_ and _dark_ mode.

- **light**
- **dark**

Example:
```
"theme": {
  "light": {
    "primaryColor": "#fff",
    "accentColor": "#480ca8"
  },
  "dark": {
    "primaryColor": "#003049",
    "accentColor": "#d62828"
  }
}
```

The following specification is valid for both *light* and *dark*:

- *type*: object;
- *required*: `false`;
- *description*: contains two fields _primaryColor_ and _accentColor_ used to customize the teleconsultation UI colors during the call.

##### 5.1 CompanyLogo parameters
Contains a field **url** which contains the URL of the company's logo.

- *type*: string;
- *required*: `false`;
- *description*: contains the URL of the company's logo.

Example:
```
"companyLogo": {
  "url": ""
}
```

## Teleconsultations CRUD
The Teleconsultation Service requires a CRUD to save the planned and performed teleconsultation data.
The collection can have any name you want, as long as you specify the correct name in the
TELECONSULTATIONS_CRUD_NAME environment variable.

A teleconsultation is the equivalent of a Room (the place where the call will have place).
Look the Overview section for more details about Room in Bandyer.

The teleconsultations CRUD needs the following service-specific fields:
- **bandyerRoomId (required)** - `string`: the id of the Room created on Bandyer for the call;
- **participants (required)** - `array of object`: the list of participants to the call (userBandyerId and accessLinkURL for every participant);
- **teleconsultationState** - `string`: the state of the Room (if it's available ecc.);
- **duration** - `number`: the max duration of the Room expressed in seconds.

##### participants
In order to create a teleconsultation, an array of participants needs to be specified.

The structure of this array is the following:
```
{
  participants: [
    {
      bandyerId: "bandyer_user_id_xxx",
      accessLinkURL: "link_to_the_call_for_user_xxx"
    },
    ...
  ]
}
```

- The field **bandyerId** is the bandyer's id of a user.
- The field **accessLinkURL** is the link required in order to join the call. During the creation of a teleconsultation, every participant receives a link (valid only for that person for that teleconsultation).

## User Id Map CRUD
The Teleconsultation Service requires a CRUD in order to save the Bandyer user id for each user which have used the teleconsultation service at least one time.
The collection can have any name you want, as long as you specify the correct name in the USER_MAP_ID_CRUD_NAME environment variable.

The user-id-map CRUD, stores for every user their auth0Id (which is mainly used to authenticate the users), and the relative Bandyer's id.
This allows the Teleconsultation Service Backend to communicate with Bandyer (a user needs to be registered on Bandyer in order to use their services).

The teleconsultations CRUD needs the following service-specific fields:
- **bandyerId (required)** - `string`: the id of the user on Bandyer;
- **auth0Id (required)** - `string`: the id of the user on Auth0;
