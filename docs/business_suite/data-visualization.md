#Data Visualization

This page explains how to configure the new frontend for analytics. It is possible to configure multiple dashboards that can be visualized on the CMS. 

##Configuration

The following configuration allows to manage **both the dashboard configuration and the single chart configuration**, in order to control how you want to visualize your analytics. The configuration is edited in the DevOps Console in the Services area directly in the `service.configmap.yml file`.

Each chart is identified by a name and has:

* **Id**;
* **constructorType**, which sets the type of chart you want. It can be *mapChart* to set a map, *chart* to set an histogram, *stockChart* to set a temporal series.
* **options**, which control directly highmaps configuration. Within the options there is also the **series configuration**.
* **filters**, which are not mandatory and allow to configure filters on the chart.

Each dashboard is identified by its name and has many rows. Each row is an array of object because you can insert more charts per row.


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
              "text": "All taps"
            },
            "subtitle": {
              "text": "The graph shows users taps on all your products over time"
            },
            "legend": {
              "enabled": false
            },
            "series": [{
              "id": "stock-serie1",
              "endpointData": "/charts/success-stock/json",
              "name": "Taps",
              "color": "#1d6eb5",
              "fill": {
                "granularity": "days",
                "untilNow": true,
                "value": 0
              }
            }]
          },
          "filters": {
            "outcomeResult": {
              "type": "SELECT",
              "fieldName": "success",
              "placeholder": "Filter taps",
              "title": "Taps Authenticity",
              "description": "Select authentic or not authentic taps",
              "options": {
                "type": "inline",
                "values": [
                  {"label": "Authentic", "value": "true"},
                  {"label": "Not Authentic", "value": "false"}
                ]
              }
            }
          }
        }
      },
      "dashboard": {
        "taps": {
          "rows": [{ 
            "charts": [
              {"id": "outcomesResultsStock"}
            ]
          }, { 
            "charts": [
              {"id": "tapsPerCountryWorldMap"},
              {"id": "tapsPerCityBars"}
            ]
          },{
            "charts": [
              {"id": "alarmsBars"}
            ]
          }]
        }
      }
    }
```





