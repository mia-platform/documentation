---
id: ck-timeline-detail
title: ck-timeline-detail
sidebar_label: Ck timeline detail
---



The `ck-timeline-detail` web component is a component specialized to show events of a user [Appointments](/runtime-components/plugins/therapy-and-monitoring-manager/10_overview.md).

![ck-timeline-detail](../img/ck-timeline-detail.png)
## Usage

The web component consists of a list of events, a detail when an event is clicked and a drawer to edit settings.

On render it will do a GET query for timeline events, array should be like this:

```
[
  {
        "id": string,
        "type": string,
        "date": string,
        "title": string,
        "description": string,
        "details": Object
    }
]
```

To filter events another call is made to /settings, the returned object must be in this format: 

```
{
  "value1": {
        "label": string,
        "value": boolean,
        "children": {
            "children1": {
                "label": string,
                "value": boolean
            }...
        }
  },
  ...
}
```

Submitting the settings a new POST query has sent with the new object to use for filter timeline events. 
If there's a date selected, timeline will scroll to the first element that is equal or greater that date.

In order to open the `ck-timeline-detail` in a Microfrontend Composer, a configuration is needed. An example configuration follows: 

```
{
  "tag": "ck-timeline-detail",
  "properties": {
    "baseEndpoint": "/timelines",
    "urlMask": "/dashboard/:patientId"
  }
}
```

## Properties & Attributes

| property | type | required | default | description |
|----------|------|----------|---------|-------------|
|`baseEndpoint`| string | true | / | Base path to the timeline events endpoint. |
|`urlMask`| string | true | / | urlMask to get userId . |
|`idKey`| string | true | patientId |  The key to use with urlMask . |
