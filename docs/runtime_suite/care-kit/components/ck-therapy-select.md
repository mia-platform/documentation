---
id: ck-therapy-select
title: ck-therapy-select
sidebar_label: Ck-therapy-select
---
The `ck-therapy-select` web component is used to select a therapy/monitoring between the ones associated to a specific user. The selection of a option will trigger the emission of `therapy-config` event.

![ck-therapy-select](../img/ck-therapy-selector.png)
## Usage
The `ck-therapy-select` component recovers the therapies/monitorings associated to a specific user. The data received are used to populate the selectable options. The web-component's `type` property defines if therapies or monitorings are fetched. The property accepts two values `monitoring` and `therapy`.
The other property, `planBasePath`, has to be set to the endpoint that expose the [Therapy and Monitoring Manager service](../../runtime_suite/therapy-and-monitoring-manager/overview). The user id used to filter the options is retrieved from the `window localtion`. In order for the `userId` to be recovered correctly the page's path has to follow the following pattern '{hostname}/{plugin_name}/`userId`'.

On initialization, after the options have been retrieved, the first options is selected (if present). Every time an option is selected a `therapy-config` event, containing the information of the selected value, is sent . If no options are presents the select will be disabled. 

## Properties & Attributes

| property | type | required | default | description |
|----------|------|----------|---------|-------------|
|`planBasePath`| string | true | / | Path the expose the Therapy and Monitoring Manager service. The path must not have the trailing slash. |
|`type`| monitoring \| therapy| true | monitoring | Defines if the monitoring or therapy are fetched. |


## Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|   -   |    -   |   -   |     -    |


## Emits

| event | description |
|-------|-------------|
|therapy-config| Custom event that contains the information of the selected options. |
