---
id: ck-book-slot-modal
title: ck-book-slot-modal
sidebar_label: Ck book slot modal
---



The `ck-book-slot-modal` web component is a modal specialized in adding/modify [Appointments](/runtime-components/plugins/therapy-and-monitoring-manager/10_overview.md) in  `am-calendar`.

![ck-book-slot-modal](../img/ck-book-slot-modal.png)
## Usage

The web component consists of a form inside a modal with dynamically generated fields based on a Appointment.

Submitting the form will trigger the post of the appointment.

The web-component also listens to the [selected-data](/products/microfrontend-composer/back-kit/70_events.md#selected-data) event. Upon receiving a `select-data` event, the `ck-book-slot-modal` opens in edit mode. For the modal to open correctly, the payload of the event must contain a valid `_id` of the availability that has to be edited. If the modal was opened in edit mode, the submitting of the form will trigger the patch of the selected appointment.

In order to open the `ck-book-slot-modal` in a Microfrontend Composer, a configuration is needed to configure a button to emit the custom event [`book-slot-modal`](/runtime-components/plugins/care-kit/30_events.md#bookslotmodal). An example configuration follows: 

```
{
  "$ref": {},
  "content": {
    "attributes": {
      "style": "height: calc(100vh - 64px);"
    },
    "type": "row",
    "content": [
            {
        "type": "element",
        "tag": "bk-button",
        "properties": {
          "type": "default",
          "iconId": "PlusOutlined",
          "content": {
            "it": "Aggiungi piano",
            "en": "Add plan"
          },
          "clickConfig": {
            "type": "event",
            "actionConfig": {
              "label": "book-slot-modal",
              "payload": {
                slot:{}
              }
            }
          }
        }
      },
      
      {
        "type": "element",
        "tag": "ck-book-slot-modal",
        "properties": {
          "appointmentManagerEndpoint": "/v2/appointment-manager/appointments/",
          "usersEndpoint": "/v2/mdc-users/?_p=authUserId
          "dataSchema": {
            "type": "object",
            "properties": {
              "address": {
                "type": "string",
                "label": "Site"
              },
              "performance": {
                "type": "string",
                "format": "lookup",
                "label": {
                  "it": "Prestazione",
                  "en": "Performance"
                },
                "lookupOptions": {
                  "lookupDataSource": "performances",
                  "lookupValue": "_id",
                  "lookupFields": ["name"]
                },
                "unique": false,
                "formOptions": {
                  "readOnly": false
                },
                "visualizationOptions": {
                  "hidden": true
                }
              }
            }
          }
        }
      }
    ]
  }
}
```

## Properties & Attributes

| property | type | required | default | description |
|----------|------|----------|---------|-------------|
|`appointmentManagerEndpoint`| string | true | / | Base path to the Therapy and Monitoring Manager. |
|`usersEndpoint`| string | true | /v2/mdc-users/ | Base path to for the users collection . |
|`dataSchema`| DataSchema | false | - |  Defines a dataSchema for additional fields |

## Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|book-slot-modal| Triggers the opening or the closing of the modal. | - | - |
|[selected-data](/products/microfrontend-composer/back-kit/70_events.md#selected-data)| Triggers the opening of the modal in edit mod | book-slot-modal | - |
|LookupLiveFound| Listens to the lookup data | - | - |

## Emits

| event | description |
|-------|-------------|
|book-slot-modal| Custom event, triggers the opening or the closing of the modal. |
