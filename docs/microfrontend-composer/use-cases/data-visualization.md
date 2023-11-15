---
id: data-visualization
title:  Data Visualization
sidebar_label: Dashboard configuration
sidebar_position: 10
---

This page explains how to configure the new frontend for analytics. It is possible to configure multiple dashboards that can be visualized on the CMS.

To be able to configure your charts and dashboards, in the **Services** section of the Console, you need to have for each chart:

1. a set of APIs that are responsible for providing properly formatted data;
2. data-visualization, which is the service that provides the web application;
3. charts-service, which allows other services to download frontend configurations for a specific dashboard `:dd` from a fixed endpoint `/api/charts/dashboards/:dd`.

All the configurations are managed from the charts-service in the `configmap.yml`file.

## General Configuration

### Dashboard configuration

A dashboard is configured as a set of rows with specific charts (identified by their id).

Some configurations can be applied to dashboards in order to customize settings:

* **rowFullViewportHeight** (Boolean): if set to `true` each row will fit the full browser viewport height.

### Charts configuration

The following configuration allows to manage **both the dashboard configuration and the single chart configuration**, in order to control how you want to visualize your analytics. The configuration is edited in the Console in the Services area directly in the `service.configmap.yml file`.

Each **chart** is identified by a name and has:

* **Id**;
* **constructorType**, which sets the type of chart you want. It can be *mapChart* to set a map, *chart* to set an histogram, *stockChart* to set a temporal series.
* **options**, which control directly highmaps configuration. Within the options there is also the **series configuration**, which always has an id, an endpoint to download data and a name.
* **filters**, which are not mandatory and allow to configure filters on the chart.

:::info
As **options** you can use any valid `highcharts` options, based on the **constructorType** chosen. Only the **series configuration** is different from the `highcharts` one, because is mandatory to use an endpoint as data source
:::

The **series configuration** is an array of objects that has:

* a univocal id;
* an endpointData, where you have to specify the endpoint that provides data;
* a name, that will be showed as a popup label when the users looks at the chart;
* a color, which can be set only if the constructorType is *chart*.

Each **dashboard** is identified by its name and has many rows. Each row is an array of object because you can insert more charts per row.

Here you can find the configuration of one chart and the configuration of one dashboard that contains one chart in the first row, two charts in the second row and one chart in the third row.

```json
dashboardAndChartsConfig.json: |-
  {
    "charts": {
      "chartName": {
        "id": "univocalId",
        "constructorType": "chartType",
        "options": {
          "title": {
            "text": "Your Title"
          },
          "subtitle": {
            "text": "This is your subtitle"
          },
          "legend": {
            "enabled": false
          },
          "series": [{
            "id": "12341658",
            "endpointData": "/charts/your-chart/json",
            "name": "Your Name",
            "color": "#1d6eb5",
            "fill": {
              "granularity": "days",
              "untilNow": true,
              "value": 0
            }
          }]
        },
        "filters": {
          "filterName": {
            "type": "SELECT",
            "fieldName": "success",
            "placeholder": "Your precompiled text",
            "title": "Title of the filter",
            "description": "Subtitle of the filter",
            "options": {
              "type": "inline",
              "values": [
                {"label": "Value1", "value": "true"},
                {"label": "Value2", "value": "false"}
              ]
            }
          }
        }
      }
    },
    "dashboard": {
      "dashboardName": {
        "rows": [{
          "charts": [
            {"id": "chartName1"}
          ]
        }, {
          "charts": [
            {"id": "chartName2"},
            {"id": "chartName3"}
          ]
        },{
          "charts": [
            {"id": "chartName4"}
          ]
        }]
      }
    }
  }
```

#### Map Configuration

Here you can find an example of the configuration of a map, that has as constructorType `mapChart`.

```json
{
  ...
  "yourMap": {
    "id": "_id",
    "constructorType": "mapChart",
    "options": {
      "chart": {
        "map": "custom/world-highres"
      },
      "mapNavigation": {
        "enabled": true,
        "enableMouseWheelZoom": false
      },
      "title": {
        "text": "This is your title"
      },
      "subtitle": {
        "text": "This is your subtitle"
      },
      "series": [{
        "id": "series1",
        "endpointData": "/charts/your-endpoint/json",
        "name": "yourName"
      }],
      "colorAxis": {
        "min": 0,
        "stops": [
          [0, "#cfe2f3"],
          [0.3, "#7da9d1"],
          [0.6, "#4697e0"],
          [1, "#1d6eb5"]
        ]
      }
    }
  }
}
```

This example, shows some of the **options** that [highmaps](https://api.highcharts.com/highmaps/) enable to control, such as:

* title of the chart;

* subtitle of the chart;

* the navigation within the map and the zoom, which can be set to true or false;

* the color of the map, which can be managed with a darker scale according to the values.

These are not the only configurations that highcharts enable to control: having a look at the configuration more fields can be controlled.

-------

#### Tile Map Configuration

The Tile Map Chart configuration allows you to insert a custom [leaflet map](https://leafletjs.com/) with a set of markers. Generally, to configure it you need to set the following properties:

```json
{
  ...
  "yourMap": {
    "id": "_id",
    "constructorType": "tileMapChart",
    "options": {
      "chart": {
        "maps": [
          {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution: "@OpenStreetMap"
          }
        ],
        // Required Map options
        center:[40.52, 9.43] // Initial center of the map (Lat, Lng)
        zoom: 5 // Initial zoom map level
      },

      "title": {
        "text": "This is your title"
      },
      "subtitle": {
        "text": "This is your subtitle"
      },
      "series": [{
        "id": "series1",
        "endpointData": "/charts/your-endpoint/json",
        "name": "yourName",
        "markerType": "circleMarker" // The only one currently supported
        "markerOptions": {
          // Options of the marker
          color: " #8989ff"
        }
        // Required additional options for circleMarker
        minSize: 5,
        maxSize: 15
      }],
      "colorAxis": {
        "stops": [
          [0, "#cfe2f3"],
          [0.3, "#7da9d1"],
          [0.6, "#4697e0"],
          [1, "#1d6eb5"]
        ]
      },
      "tooltip": {
        "pointFormat": "<b>{point.label}</b>: {point.actualValue}"
      }
    }
  }
}
```

##### Chart

In this section you can insert all the options that you want in order to customize your leaflet map (see [Leaflet API reference](https://leafletjs.com/reference-1.6.0.html#map-option)), the only ones required are center and zoom.

In addition to the map properties defined by leaflet documentation, you have to set `maps`. Here, you can insert different tile layers URLs to personalize the map design, with the associated attributions depending on the chosen provider. You can choose them [here](https://leaflet-extras.github.io/leaflet-providers/preview/).

Currently the only supported providers are **OpenStreetMap** and **BaseMap**.

##### Series

In this section you list the different series of data that you want to show on the map. Each series should have an *endpointData*, which specifies the path to be called in order to download the data points. Each data point should have the following format:

```json
{
  label: "name to show on hover",
  lat: 40.52, // Latitude
  lng: 9.45, // Longitude
  value: 100 // Can be a quantity
}
```

Along with the *endpointData*, you can add the following property to fully customize the markers displayed on the map:

* **markerType** *(*required*): The only marker supported right now is the*'circleMarker'*, which allows showing bubbles with a radius that depends on the value of each data.

* **markerOptions**: Here you can insert all the options defined by leaflet documentation (except the radius which is computed based on the data value -  see <https://leafletjs.com/reference-1.6.0.html#circlemarker>) in order to customize the *circleMarker*.
By default, the markers are displayed without any clustering. To add the clusterization, you should define an additional *cluster* property in the **markerOptions**.
  * *cluster*: Object with the following properties.

```
{
  type: ['weighted' | 'single'] // Required,
  color: '#F08080', // Optional, color of the cluster group of markers
  textColor: '#FFFFFF' // Optional, color of the text inside the cluster groups
}

```

By default the *color* of cluster groups is equal to the color of markers and the *textColor* is white. Instead the *type* is required. Currently we support two type of cluster
     **Weighted*- To display the cluster groups with the sum of values specified for each series data point. (e.g. group of 3 markers with values 10, 10, and 10 respectively, diplays a cluster with 30 as text)
     * *Single* - To display the cluster groups with the number of markers not weighted by custom values. (e.g. group of 3 markers with any value diplays a cluster with 3 as text)
 ------

* **minSize**: Integer indicating the minimum radius of the *circleMarker* (in pixels, default: 3).

* **maxSize**: Integer indicating the maximum radius of the *circleMarker* (in pixels, default: 15).

* **convergenceSpeed**: Integer indicating the convergence speed for optimizing bubble sizes depending on data values (default: 100)

Example of series with cluster option:

```json
"series": [{
        "id": "series1",
        "endpointData": "/charts/your-endpoint/json",
        "name": "yourName",
        "markerType": "circleMarker" // The only one currently supported
        "markerOptions": {
          // Options of the marker
          color: " #8989ff",
          // Cluster
          cluster: {
            type: "weighted",
            color: "#ffffff",
            colorText: "#000000"
          }
        }
        // Required additional options for circleMarker
        minSize: 5,
        maxSize: 15,
}]
```

##### Color Axis

`colorAxis` property can be specified to display different marker colors depending on the value of data. To configure it, we can follow two schema:

- **Absolute Data**

By default data are considered as absolute values. In this case `colorAxis` accepts the following properties:

```
"colorAxis": {
  "min": 2,
  "max": 100,
  "stops": [
    [0, "#cfe2f3"],
    [0.3, "#7da9d1"],
    [0.6, "#4697e0"],
    [1, "#1d6eb5"]
  ]
}
```

**min** and **max** properties define the minimum and maximum threshold to compute the color assigned to each marker data. If not defined, the min/max value of data is used.

**stops** define all the different colors to display with the corresponding lower bound (*percentage*).

- **Relative Data**

Data are relative if its value is expressed by a *percentage*. In this case `colorAxis` accepts only the following properties, both **required**:

```
"colorAxis": {
  "isDataRelative": true,
  "stops": [
    [0, "#cfe2f3"],
    [0.3, "#7da9d1"],
    [0.6, "#4697e0"],
    [1, "#1d6eb5"]
  ]
}
```

**NB:** Currently, we are not supporting `colorAxis` with relative data when *cluster* (see section *Series*) is active.

##### Tooltip

An additional property that can be inserted in `options` is `tooltip`, which represent the message that appears over each marker. By default, it shows the *label* specified in data or the *name of the series* with the *data value*.

Suppose we have the following data structure:

```js
myData = [
  {label: 'Milan Centrale', value: 300, peopleCapacity: 600}
]
```

To customize this message, it can be inserted the *tooltip* property in the configuration with the following formatting:

```json
"tooltip": {
  "pointFormat": "<b>{point.label}</b>: {point.peopleCapacity}"
}
```

`pointFormat` allows you to write an HTML string with data properties by using the annotation `{point.propertyName}`.

---

#### Stock Chart Configuration

Here you can find an example of the configuration of a stock chart.

```json
{
  ...
  "yourStockChart": {
    "id": "789",
    "constructorType": "stockChart",
    "options": {
      "rangeSelector": {
        "selected": 1
      },
      "title": {
        "text": "Your Title"
      },
      "subtitle": {
        "text": "Your subtitle"
      },
      "legend": {
        "enabled": false
      },
      "series": [{
        "id": "stock-series1",
        "endpointData": "/charts/your-endpoint/json",
        "name": "yourName",
        "color": "#1d6eb5",
        "fill": {
          "granularity": "days",
          "untilNow": true,
          "value": 0
        }
      }]
    }
  }
}
```

This example, shows some of the options that [highcharts](https://api.highcharts.com/highcharts/) enable to control.

The property **fill** allows to control how the chart manages the case in which the data are equal to zero.

### Filters Configuration

There are several types of filters:

* **Select filters**, which enable to set one value per time in the filter. For example in the `orders` collection, if there is a boolean property `shipped`, the select filter can be on the shipped or not shipped data.

* **Multiselect filters**, which allow to select more than one value of the property. For example in the `orders` collection, if you have a property `country`, the multiselect filter can be on country, allowing you to see at the same time all the orders coming from Italy and Sweden.

Moreover, you can filter on the properties of the collection that is providing you with the data or on a property of another collection. Therefore, there are two types of filters:

* **inline filter**, which allows to create a filter on a property of the same collection, specifing the values that the users sees in the `values`field of the configuration;

  ```
  {
    "filterSelect": {
      "type": "SELECT",
      "fieldName": "success",
      "placeholder": "Your placeholder",
      "title": "Your Title",
      "description": "Your description",
      "options": {
        "type": "inline",
          "values": [
            {"label": "Value1", "value": "true"},   // es. {"label": "shipped", "value": "true"}
            {"label": "Value2", "value": "false"}   // es. {"label": "not shipped", "value": "false"}
        ]
      }
    }
  }
  ```

* **lookup filter**, which allows to create a filter on a property of another collection. Here is an example of the configuration:

  ```
  {
    "filterMultiselect": {
      "type": "MULTISELECT",
      "fieldName": "yourProperty",  //here you need to set the property of the collection that is providing the data for the chart on which you want to filter the data
      "placeholder": "Your placeholder in the filter",
      "title": "Your Filter name",
      "description": "Your filter description",
      "options": {
        "type": "lookup",
        "endpoint": "/v2/your-endpoint/",   //here you need to set the target endpoint from which the data are downloaded (es. /v2/menus/)
        "valueProperty": "propertyName",  //here you need to the name of the property in the target collection on which you want to set the filter (es. _id)
        "label": {
          "pattern": "{{name}}",
          "properties": ["labelPropertyName"]  //here you need to set the name of the property in the target collection that you want to show to the user as a label (es. name)
        }
      }
    }
  }
  ```

:::caution
Filters are not supported when visualizing two or more series.
:::
### Actions Configuration

It is possible to add one or more link button in order to perform a GET action targeting a specific url. To set up the actions, you should define an array with the following properties:

```
{
  "actions": [{
    "label": "Test button",
    "url": "/bubble-map",
    "openInNewTab": true,
    "applyActiveFilters": true
  }]
}
```

* **label** (*required*): String value that represents the label displayed on the link button.

* **url** (*required*): GET url.

* **openInNewTab** (*optional*): Boolean value representing wheather or not the link should be open in a new tab. It is *false* by default.

* **applyActiveFilters** (*optional*): Boolean value indicating wheather or not the query parameters of the chart filters should be applied to the specified `url`. It is *false* by default.

The `actions` property should be inserted at the same level of `filters`.
