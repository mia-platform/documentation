---
id: unmapped_fields
title: Unmapped Fields
sidebar_label: Unmapped Fields
---

This dashboard will help you to monitor unmapped fields. With unmapped field we mean a field which is in a Kafka message, but it is not included in the projection definition or it can not be casted to the desired field type.

In order to use this dashboard you'll need to set the environment variable `COLLECTION_NAME_UNMAPPED_FIELDS_STORAGE` in any [Real Time Updater](/fast_data/realtime_updater.md) service you want to keep track of the unmapped fields.

The dashboard relies on the MongoDB Query Exporter service and as such you should check out the [MongoDB Query Exporter Configuration section](/fast_data/monitoring/overview.md#mongodb-query-exporter-configuration). Once you have the service set up you need to add the two metrics displayed in the following example to the main configuration file.

```yml
...
metrics:
      - name: unknown_fields
        type: counter #Can also be empty, the default is gauge
        servers: [main] #Can also be empty, if empty the metric will be used for every server defined
        help: 'Count the number of Unknown fields'
        value: total
        labels: []
        mode: pull
        cache: 0
        constLabels:
            collection: unmapped-fields
        database: {{FAST_DATA_PROJECTIONS_DATABASE_NAME}}
        collection: unmapped-fields
        pipeline: |
          [
            {
                "$match": {
                    "type": "UNKNOWN_FIELD",
                    "__STATE__":  "PUBLIC"
                }
            }, {
                "$count": "total"
            }
          ]
      - name: uncastable_fields
        type: counter #Can also be empty, the default is gauge
        servers: [main] #Can also be empty, if empty the metric will be used for every server defined
        help: 'Count the number of Uncastable fields'
        value: total
        labels: []
        mode: pull
        cache: 0
        constLabels:
            collection: unmapped-fields
        database: {{FAST_DATA_PROJECTIONS_DATABASE_NAME}}
        collection: unmapped-fields
        pipeline: |
          [
            {
                "$match": {
                    "type": "UNCASTABLE_FIELD",
                    "__STATE__":  "PUBLIC"
                }
            }, {
                "$count": "total"
            }
          ]
```

After having configured everything you can download the dashboard's json <a download target="_blank" href="/docs_files_to_download/dashboards/unmapped-fields.json">**here**</a> and import it on your Grafana portal.
