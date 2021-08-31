---
id: dashboard
title:  Display Dashboards
sidebar_label: Display Dashboards
---

# Overview 

The Dashboard section of Mia-Platform Console allows you to keep the tools you use to monitor your project close to its configuration. In this section, which is accessible from the main menu, you can visualize as IFrames the dashboards you created with your monitoring tools (such as Grafana, Kibana, etc.). 

# How to integrate a Dashboard

To integrate a dashboard page on developer console you must access your Console CMS.

Once inside the CMS, select `Projects` from the sidebar, then search your project from the top search bar, select it and a side menu should expand.

On that menu look for the Environments configuration value which must satisfy the following JSON schema:

```json
"environments": {
      "type": "array",
      "default": [],
      "items": {
        "type": "object",
        "properties": {
          "label": { "type": "string" },
          "value": { "type": "string" },
          "hostname": { "type": "string" },
          "isProduction": {
            "type": "boolean",
            "default": false
          },
          "cluster": {
            "type": "object",
            "properties": {
              "hostname": { "type": "string" },
              "port": { "type": "number" },
              "namespace": { "type": "string" }
            },
            "required": ["hostname"]
          },
          "dashboards": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "label": { "type": "string" },
                "url": { "type": "string" }
              },
              "required": ["id", "label", "url"]
            }
          }
        }
      },
      "additionalProperties": false
    }
```

Then edit the dashboards array by adding a new dashboard object on the environments in which you want to add it.

The object should be as follows:

```json
{
  "id": "unique-dashboard-identifier",
  "label": "Dashboard Label",
  "url": "https://dashboard-url"
}
```

The url must point to a valid dashboard page that is already configured to show all the metrics or statistics of interest.

Finally `Save` your project configuration and your changes should be visible on developer console.
