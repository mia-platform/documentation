# How to configure monitoring

To enable the monitoring dashboard, you should modify the api console configuration adding, in the kubernetes-service deployment env variables.

You must add:

* `CLUSTER_TO_SECRET_NAME_MAP`

      This is a key value map `host:token_variable`. The variables described in this map are provided as env variables of the service

    e.g. env variables to add to `kubernetes-service`:

    ```yaml
    env:
      - name: CLUSTER_TO_SECRET_NAME_MAP
        value: '{"127.0.0.1": "MY_TOKEN"}'
      - name: MY_TOKEN
        value: 'secret value of the token to access pods with read and write access (should be authorized to read logs and delete pods)'
    ```

After this change, deploy the configuration.

# How to enable monitoring on developers console

To enable moninoring dashboard on developer console, change the configuration of the project on mongo.

For the project, add a `cluster` key in the environment. The cluster is an object:

```json
PROJECT
{
  environments: [
    {
      value: 'environment',
      label: 'Environment',
      hostname: 'https://my-env.eu',
      cluster: {
        hostname: '<my kubernetes cluster hostname>',
        port: '<my kubernetes cluster port>'
      }
    }
  ]
}
```

Environments JSON schema in the following:

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
