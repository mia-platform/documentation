---
id: ck-chart
title: ck-chart
sidebar_label: Ck-chart
---
The `ck-chart` web component is a web-component able to display a chart. The component at its core uses the [Highcharts](https://www.highcharts.com/) library. 

## Usage

![ck-chart](../img/ck-chart.png)

The `ck-chart` web-component is a web-component able to display charts.

Through the `options` property, it is possible to customize the chart. As `options` you can use any valid [highcharts options](https://api.highcharts.com/highcharts/).

The data of the chart are retrieved from the endpoint set in the `dataEndpoint` property. 

:::info
The response of the endpoint is used to populate the `series` property of the highcharts options. So this field can be omitted in `options` property. 
:::


It is possible to filter the data shown in the chart, since the `ck-chart` web-component listens to the [change-query](../../../business_suite/backoffice/events#change-query) event. The `filters` property of every `change-query` event is stringified and attached to the data endpoint as the `filters` query parameter. It is up to the backend service to parse the filters and return the filtered data.

Properties `urlMask` and `idKey` are used to retrieve an `id` from the url: `idKey` is the dynamic value key mapped in the `urlMask`. For example, if the url is `/dashboard/14alGw?pageSize=25` where `14alGw` is the `id`, the `urlMask` will be `/dashboard/:<yourKey>` and `idKey` will be `<yourKey>`.

If an `id` is retrived it will be combined with the `dataEndpoint` and the chart data will be fetched from the path `dataEndpoint`/`<id>`.

An example configuration follows: 

```
{
  "type": "element",
  "tag": "ck-chart",
  "properties": {
    "dataEndpoint": "api/v1/chartdata",
    "urlMask": "/dashboard/:userId",
    "idKey" : "userId",
    "options": {
      "chart": {
        "type": "line"
      }
    }
  }
}
```

## Properties & Attributes

| property | type | required | default | description |
|----------|------|----------|---------|-------------|
|`dataEndpoint`| string | true | '/' | Endpoint used to retrieve the data displayed on the chart. |
|`options`| object | true | {} | Object that contains the Highchart chart options. |
|`urlMask`| string | false |`/:id` | url mask to apply to the current path to extract id dynamically. |
|`idKey`| string | false |`id` | id key in urlMask. | 


## Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|`change-query`| Triggers the fetching of the data with filters applied. | - | - |

## Emits

This component emits no event.
