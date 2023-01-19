---
id: am-calendar
title: am-calendar
sidebar_label: Am-calendar
---
The web component is based on the external component `react-big-calendar`, [here is the documentation for more information](https://jquense.github.io/react-big-calendar/examples/?path=/story/about-big-calendar--page).

The web component has been created as the front-end counterpart of the [appointment-manager](../../appointment-manager/overview) microservice to be used in a Backoffice configuration.

## Events type

The calendar is able to represent three kind if events: availabilities, exceptions and appointments.

**Availability**: Availability events are divided in slots. Each slot represents the time range that the user can book. Tha availability cannot start and end in different days. It is possible to create a periodic availability.

![availability](../img/availability.png)

**Exception**: Exception events represent when the resource is not available. Exceptions can span multiple days, but cannot be periodic

![exception](../img/exception.png)

**Appointment**: Appointment are usually represented inside an availability's slot Appointment events represent the booking of a slot. If exception is created on top of an appointment the appointment event is shown in red in the calendar and must be rescheduled. If the availability containing an appointment is delete or edited to not contain a previous appointment, the appointment will be flagged and shown as an independent event.

![exception](../img/flagged-appointment.png)
![exception](../img/appointment.png)

For more information regarding the type of events read the [appointment manager documentation](https://jquense.github.io/react-big-calendar/examples/?path=/story/about-big-calendar--page).

## Modes

The components can be utilized in two different modes.

### Availability Mode

![availability_mode](../img/availability_mode.png)

The "availability mode" is used to show the availabilities and exceptions of a single resource. The calendar in this configuration will show the events of type availability and exceptions. The appointments are not displayed in this mode.

When the calendar is set in availability mode the events are fetched through the back kit web component [bk-crud-client](../../../business_suite/backoffice/Components/clients#bk-crud-client).

Even though this calendar mode has been designed to display the events of only one resource, the event filtering is not performed by the component itself. To filter out the events for a specific property is suggested to pass the filtering property as a URL parameter and filter the data received from the backend utilizing the Backoffice component [bk-url-parameters](../../../business_suite/backoffice/plugin_navigation#bk-url-parameters)).

To improve performance not all the events are loaded in the calendar at the same time. In availability mode, the events are filtered sending [change-query](../../../business_suite/backoffice/Components/data_querying#bk-filters-manager). If the calendar view is day or week the calendar loads events ranging from the first day of the previous week to the last day of the next week of the current visualized date. In month view the events from the previous month until the next one are loaded.

Click on an event calendar will trigger the emission of a [select-data](../../../business_suite/backoffice/events#selected-data) event which contains in the payload the data of the event clicked.

This mode is compatible with version 1.x  of the appointment manager backend.

Here can be found an example <a download target="_blank" href="/docs_files_to_download/care-kit/availabilities.json">configuration</a>.

### Appointment Mode

![appointment_mode](../img/appointment_mode.png)

The "appointment mode" is used to show the events of multiple resources in the same view. In this mode, it is possible to book an appointment in one of the availabilities created for each resource.

A resource is the entity which time is managed through the calendar.

The resources are displayed in the top row of the calendar. The components accept the property [resourceConfig](#resourceconfig) the contains the main configuration options regarding the resources. In particular, `resourceConfig` contains the property resourcesEndpoint which is where you must configure the endpoint from which the resources are fetched.

The resources and the events in the calendar must share a common property used by the calendar to display the events in the correct resource sections. If a event is not associated to any resource it is not displayed in the calendar.

In appointment mode, the events are not fetched using `bk-crud-client` like in availability mode, but they are fetched from the endpoint configured in the property `calendarEndpoint` (this endpoint should coincide with the GET /calendar of the appointment manager backend). Not using the `bk-crud-client` to fetch the events allows us to filter the events using the `bk-filters-manager`. The filtering on the time range of events loaded is executed internally to the component. The web components computes the start and end date of the range as in availability mode and than adds them as query parameter to `calendarEndpoint` call.

Clicking on a slot will make appear a draggable window containing some information about the slot clicked. A slot can be in 3 different states: available, booked, and unavailable. Depending on the state the action button present in the footer allows the user to book an appointment, change or delete an appointment, or visualize the information of the appointment in the selected slot. Unavailable slots and exception are not clickable in this configuration.

All the action buttons present in the appointment detail modal are performed using Backoffice events. For this reason, it is needed in the page a `bk-crud-client` configured with the appointment manager appointment endpoint as URL.

This mode is compatible with version 2.x  of the appointment manager backend.

Here can be found an example <a download target="_blank" href="/docs_files_to_download/care-kit/appointments.json">configuration</a>.

## Extra features

![setting-menu](../img/setting_menu.png)

Through the setting button in the top right it is possible to filter out the events based on their type. In other words it is possible to hide the exceptions, the availability, or both types of event.
In the same dropdown menu is present the time zoom option that allows the user to zoom in the calendar. This feature is especially useful when very short events are present. The default zoom is 1 hour. It is possible to zoom in up to 10 minutes.

## Properties & Attributes

| property | type | required | default | description |
|----------|------|----------|---------|-------------|
|`addressProperty`| string | false | address | Name of the event property that contains the location of the event. If present it is shown in the modal detail popover |
|`appointmentConfig`| [AppointmentConfig](#appointmentconfig) | false |  | Object that contains the name of the appointments properties used to populate booked slot and the draggable modal |
|`appointmentMode`| boolean | false | false | Boolean the define which calendar mode is in use. If false the calendar is in availability mode, if true in appointment mode |
|`calendarEndpoint`| string | false | - | The endpoint used to fetched the events in appointment mode |
|`date`| string | false | new Date() | The date on which the calendar is on load |
|`height`| string | false | '75vh' | css-height the calendar should occupy in the page as described here: [https://developer.mozilla.org/en-US/docs/Web/CSS/height] |
|`popoverConfig`| [EventBoxPopoverConfig](#eventboxpopoverconfig) | false | - | Object that contains the name of the properties used to populate the popover that appears when an event is hovered |
|`resourceConfig`| [ResourceConfig](#resourceconfig) | false | - | Object that contains the name of the resource properties used to populate the header containing the resource information and the endpoint from which the resources are fetched|
|`resourceId`| string | false | resourceId | Provides a unique identifier for each resource in the resources array. Each event should have the same property to be shown in its calendar resource column |
|`reminderMilliseconds`| number | false | 90000 | Number of milliseconds before the booked appointment that the reminder is sent |
|`slotConfig`| [SlotConfig](#slotconfig) | - | - |Object that contains the name of the appointments properties used to populate free slot and the draggable modal |
|`view`| 'month' \| 'week' \| 'day' | false | week | The current view value of the calendar. Determines the visible 'view'  |

## Custom types

### AppointmentConfig

```
{
  titleProperty: string[]
  ownerProperty: string
  additionalProperty?: {property: string; label: Record<string, string> }[]
}
```

| property | description |
|----------|-------------|
| `titleProperty` | Names of the property whose value is shown inside a slot when an appointment is booked |
| `ownerProperty` | Name of the property that contains the identifier of the owner of the slot (ex. customerId) |
| `additionalProperty` | Array of the custom property that is shown in the draggable modal that spawn when clicking an appointment. Each element of the array should contain a field property with the name of the custom property and an object label containing specific translations according to ISO 639-1 code. |

**Example**

```
"appointmentConfig": {
  "titleProperty": ["client", "performance"],
  "ownerProperty": "client",
  "additionalProperty": [
    {
      "property": "performance",
      "label": {
        "it": "Prestazione",
        "en": "Performance"
      }
    }
  ]
}
```

### EventBoxPopoverConfig

```
{
  title:{property: string; value?: Record<string, Record<string, string>> }
  details: { property: string; label: Record<string, string>; value?: Record<string, Record<string, string>> }[]
}
```

| property | description |
|----------|-------------|
| `title` | Names of the property whose value is shown in the header of the popover. If not present the popover will not have a header |
| `details` | Array of the custom properties that are shown in the popover. Each element of the array should contain a field property with the name of the custom property and an object value containing the mapping of the value to the localized translation. |

**Example**

```
"popoverConfig": {
  "details": [
    {
      "property": "status",
      "label": {
        "it": "Stato",
        "en": "Status"
      },
      "value": {
        "AVAILABLE": {
          "it": "Disponibile",
          "en": "Available"
        },
        "BOOKED": {
          "it": "Prenotato",
          "en": "Booked"
        },
        "UNAVAILABLE": {
          "it": "Non disponibile",
          "en": "Unavailable"
        }
      }
    }
  ]
}
```

### ResourceConfig

```
ResourceConfig = {
  resourcesEndpoint: string
  details: ResourceDetails[]
  delimiter: string
}

ResourceDetails = {
  property: string[]
  delimiter: string
}
```

| property | description |
|----------|-------------|
| `resourcesEndpoint` | The endpoint from which the resources are fetched|
| `details` | List of the property inside each resource to be shown in the header and popover. Each detail can be the chian of multiple property divided by a specific delimiter |
| `delimiter` | Character used between details in the popover|

**Example**

```
"resourceConfig": {
  "resourcesEndpoint": "http://localhost:3456/api/v1/resources",
  "details": [
      "name",
      "specialization"
  ]
}
```

### SlotConfig

```
{
  centeredPopover: boolean
  additionalProperty?: {property: string; label: Record<string, string> }[]
}
```

| property | description |
|----------|-------------|
| `centeredPopover` | Boolean to control the spawning position of the draggable modal. If false the modal will spawn near the clicked event, if false in the center of the page |
| `additionalProperty` |Array of the custom properties that are shown in the draggable modal that spawn when clicking a free slot. Each element of the array should contain a field property with the name of the custom property and an object label containing specific translations according to ISO 639-1 code. |

**Example**

```
"slotConfig": {
  "centeredPopover": false,
  "additionalProperty":[
    {
      "property": "performance",
      "label": {
        "it": "Prestazione",
        "en": "Performance"
      }
    }
  ]
}
```

## Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[display-data](../../../business_suite/backoffice/events#display-data)|receives data to display| - | - |

## Emits

| event | description |
|-------|-------------|
|[change-query](../../../business_suite/backoffice/events#change-query)| used to updated the filters in availability mode|
|[add-new](../../../business_suite/backoffice/events#add-new)| trigger for the opening of the component used to add a new event|
|[add-new-external](../../../business_suite/backoffice/events#add-new-external)| trigger for the opening of the appointment detail modal in read-only mode |
|[deleteData](../../../business_suite/backoffice/events#delete-data)| notifies the request for deletion of event|
|[require-confirm](../../../business_suite/backoffice/events#require-confirm)| trigger for the opening of the confirmation modal before deleting an appointment |
|[selected-data](../../../business_suite/backoffice/events#selected-data)| notifies about the click on an event|
|[update-data](../../../business_suite/backoffice/events#update-data)| trigger for the opening of the component to modify the appointment in the clicked slot|
