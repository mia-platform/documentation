# Configure Doctor Service

As _core service_, the Doctor Service is easily deployable on every project by using the <a href="https://console.cloud.mia-platform.eu/" target="_blank">Api Console</a>. You just need to add the service and configure it's _configuration file_; we will see how, but first a short overview on _how the service works_.

## How the service works

The _Doctor Service_ is simply based on one file, the _configurations_ file.
With the configurations file it's easy to manage all services to `check-up`.
Specifically, the _Doctor_ allows the user to do two things:

1. `check-up` all services in the configurations file by simply call the _root_ path (e.g. <a href="http://api.dev.gruppocattolica.it/playground/check-up" target="_blank">http://api.dev.gruppocattolica.it/playground/check-up</a>);
2. `check-up` a subgroup of services by specify the tag &rarr; all services can have a list of _tags_ (optional) and the _Doctor_ will expose a route for each tag, that will return the `check-up` of services with that tag.

!!! warning
    **<u>NB</u>**. all the services call by the _Doctor_ **MUST** have the `/-/check-up` route.

## Steps overview

Following an overview of the steps that you have to do to integrate the _Doctor Service_ in your project:

1. Build the configurations file of the _Doctor Service_
2. Create the service using the API Console
3. Set the _Advanced configurations_
4. **Check-up'em all**

!!! Note
    The following example is based on the _Playground_ project of the Cattolica's API Console.

### 1. Build the _configurations_ file

As [previously said](#How-the-service-works), the _Doctor Service_ just needs a _configurations_ file that has to follow this schema:

```json
{
  type: 'array',
  items: {
    type: 'object',
    required: ['hostname'],
    properties: {
      hostname: { type: 'string' },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    additionalProperties: false,
  },
}
```

As specified into the schema, the tags property is optional &rarr; a _Doctor Service_ can have all services without tags and it still works on the root path.

In the following example we will set just one tag, the core tag, just for core services:

```json
apiVersion: v1
data:
  'services.json': |
    [
      { "hostname": "auth-service", "tags": ["core"] },
      { "hostname": "cms-backend", "tags": ["core"] },
      { "hostname": "crud-service", "tags": ["core"] },
      { "hostname": "microservice-gateway", "tags": ["core"] },
      { "hostname": "swagger-aggregator", "tags": ["core"] },
      { "hostname": "v1-adapter", "tags": ["core"] },
      { "hostname": "node-service" },
      { "hostname": "angular-service" },
      { "hostname": "react-service" },
      { "hostname": "java-service" },
    ]
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: doctor-service

```

In this way, we should have the following routes:

- **`baseUrl/check-up`** &rarr; should return the `check-up` response of all services
- **`baseUrl/check-up/core`** &rarr; should return the `check-up` response just of services with the _core_ tag

The _configurations_ file is ready, let's continue.

### 2. Doctor Service creation on the API Console

Now it's time to create the real service.

Following the steps to create the services:

1. Open the API Console and choose the project
2. Click, on the left, on _Services_
3. Click on the **Create new service** button
4. As service type, choose _Import_, to import an existing service
5. Compile the fields as follow:
   - **Name**: the name of the service (in the example is **doctor-service**)
   - **Docker image**: nexus.mia-platform.eu/core/doctor-service:**tag** where _tag_ is the image tag of the service (info on the <a href="https://git.tools.mia-platform.eu/platform/core/doctor-service/blob/master/CHANGELOG.md" target="_blank">CHANGELOG</a>)
   - **Description**: the description of the service
6. Click on the **Create** button
7. Go down and check the **I want to write custom k8s files for this service** checkbox ![alt_image](./img/custom_k8s_configs_check.png)
8. Insert the following _service.yml_

    ```yml
    apiVersion: v1
    kind: Service
    metadata:
      name: doctor-service
    spec:
      type: NodePort
      ports:
        - port: 80
          targetPort: 3000
          protocol: TCP
          name: http
      selector:
        app: doctor-service
    ```

9. Insert the following _deployment.yml_

    ```yml
    apiVersion: v1
    kind: DeploymentConfig
    metadata:
      name: doctor-service
    spec:
      replicas: 1
      revisionHistoryLimit: 3
      strategy:
        type: Rolling
      template:
        metadata:
          labels:
            app: doctor-service
        spec:
          imagePullSecrets:
            - name: nexus-pull-secret
          containers:
            - name: doctor-service
              image: nexus.mia-platform.eu/core/doctor-service:{    {DOCTOR_SERVICE_IMAGE_TAG}}
              imagePullPolicy: Always
              resources:
                limits:
                  memory: 120Mi
                requests:
                  memory: 70Mi
              env:
                - name: LOG_LEVEL
                  value: {{LOG_LEVEL}}
                - name: HTTP_PORT
                  value: '3000'
                - name: SERVICES_LIST_PATH
                  value: /home/node/app/config/services.json
              volumeMounts:
                - name: doctor-service-config
                  mountPath: /home/node/app/config/services.json
                  subPath: services.json
                  readOnly: true
              readinessProbe:
                tcpSocket:
                  port: 3000
                initialDelaySeconds: 5
                periodSeconds: 10
              livenessProbe:
                httpGet:
                  path: /-/healthz
                  port: 3000
                initialDelaySeconds: 15
                periodSeconds: 20
          volumes:
            - name: doctor-service-config
              configMap:
                name: doctor-service
    ```

10. Create a new _configurations_ file by using the specific section ![alt_image](./img/create_configurations_file.png)
11. Insert the [previously created](#1-Build-the-configurations-file) _configurations_ file into the just created file
12. Save (_Commit and generate_ button)
