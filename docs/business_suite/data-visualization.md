#Data Visualization

This page explains how to configure the new frontend for analytics. It is possible to configure multiple dashboards that can be visualized on the CMS. 

To be able to configure your charts and dashboards, in the **Services** section of the DevOps Console, you need to have for each chart:

1. a set of APIs that are responsible for providing properly formatted data;
2. data-visualization, which is the service that provides the web application;
3. charts-service, which allows other services to download frontend configurations for a specific dashboard `:dd` from a fixed endpoint `/api/charts/dashboards/:dd`.

All the configurations are managed from the charts-service in the `configmap.yml`file.

##General Configuration

The following configuration allows to manage **both the dashboard configuration and the single chart configuration**, in order to control how you want to visualize your analytics. The configuration is edited in the DevOps Console in the Services area directly in the `service.configmap.yml file`.

Each **chart** is identified by a name and has:

* **Id**;
* **constructorType**, which sets the type of chart you want. It can be *mapChart* to set a map, *chart* to set an histogram, *stockChart* to set a temporal series.
* **options**, which control directly highmaps configuration. Within the options there is also the **series configuration**, which always has an id, an endpoint to download data and a name. 
* **filters**, which are not mandatory and allow to configure filters on the chart.

The **series configuration** is an array of objects that has:

* a univocal id;
* an endpointData, where you have to specify the endpoint that provides data;
* a name, that will be showed as a popup label when the users looks at the chart;
* a color, which can be set only if the constructorType is *chart*.

Each **dashboard** is identified by its name and has many rows. Each row is an array of object because you can insert more charts per row.

Here you can find the configuration of one chart and the configuration of one dashboard that contains one chart in the first row, two charts in the second row and one chart in the third row.

```
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
              "id": "12341658ebueòbbfq",
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

## Map Configuration

Here you can find an example of the configuration of a map, that has as constructorType `mapChart`.

```
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
              "id": "serie1",
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
```
This example, shows some of the **options** that (highmaps)[https://api.highcharts.com/highmaps/] enable to control, such as:

* title of the chart;

* subtitle of the chart;

* the navigation within the map and the zoom, which can be set to true or false;

* the color of the map, which can be managed with a darker scale according to the values.


These are not the only configurations that highcharts enable to control: having a look at the configuration more fields can be controlled.

## Tile Map Configuration

The Tile Map Chart configuration allows you to insert a custom leaflet map (https://leafletjs.com/) with a set of markers. Generally, to configure it you need to set the following properties:

```
"yourMap": {
  "id": "<some-unique-id>",
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
      center:[40.52, 9.43] //Intial center of the map (LatLng)
      zoom: 5 // Initial zoom map level
    },
    
    "title": {
      "text": "This is your title"
    },
    "subtitle": {
      "text": "This is your subtitle"
    },
    "series": [
      {
      "id": "serie1",
      "endpointData": "/charts/your-endpoint/json",
      "name": "yourName",
      "markerType": "circleMarker" // Currently, only one supported
      "markerOptions": {
        // Options of the marker
        color: " #8989ff"
      }
      // Required additional options for circleMarker
      minSize: 5,
      maxSize: 15
      }
    ]
  }
}
```
*Options -> Chart:*

In this section you can insert all the options that you want in order to customize your leaflet map (see https://leafletjs.com/reference-1.6.0.html#map-option), the only ones required are center and zoom. In addition to the map properties defined by leaflet documentation, you have to set maps. Here, you can insert different tile layers URLs to personalize the map design, with the associated attributions depending on the provider chosen. You can choose them at https://leaflet-extras.github.io/leaflet-providers/preview/. Currently, the only providers supported are **OpenStreetMap** and **BaseMap**.

*Series:*

Here you specify the *endpointData* that you want to show on the map through the usage of markers. Data recovered from endpoints should be in a specific format:
```
{
  label: "name to show on hover", 
  lat: 40.52, //latitude
  lng: 9.45, //longitude
  value: 100 //Can be a quantity
}
```

* **markerType**: The only marker supported right now is the *'circleMarker'*, which allows showing bubbles with a radius that depends on the value of each data.

* **markerOptions**: Here you can insert all the options defined by leaflet documentation (except the radius which is computed based on the data value -  see https://leafletjs.com/reference-1.6.0.html#circlemarker) in order to customize the *circleMarker*. 

* **minSize**: Integer indicating the minimum radius of the *circleMarker* (in pixels).

* **maxSize**: Integer indicating the maximum radius of the *circleMarker* (in pixels).


## Stock Chart Configuration

Here you can find an example of the configuration of a stock chart.

```
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
              "id": "stock-serie1",
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
```
This example, shows some of the options that (highcharts)[https://api.highcharts.com/highcharts/] enable to control. 

The property **fill** allows to control how the chart manages the case in which the data are equal to zero.

## Filters Configuration

There are several types of filters:

* **Select filters**, which enable to set one value per time in the filter. For example in the `orders` collection, if there is a boolean property `shipped`, the select filter can be on the shipped or not shipped data.

* **Multiselect filters**, which allow to select more than one value of the property. For example in the `orders` collection, if you have a property `country`, the multiselect filter can be on country, allowing you to see at the same time all the orders coming from Italy and Sweden.


Moreover, you can filter on the properties of the collection that is providing you with the data or on a property of another collection. Therefore, there are two types of filters:

* **inline filter**, which allows to create a filter on a property of the same collection, specifing the values that the users sees in the `values`field of the configuration;

   ```
   
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



