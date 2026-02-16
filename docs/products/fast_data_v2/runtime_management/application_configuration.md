---
id: application_configuration
title: Application Configuration
sidebar_label: Application Configuration
---

## Application Configuration

In order to configure the Fast Data Control Plane application in your Fast Data Project, enter the Project Design Area, and find it inside the Application section.

![Control Plane Fast Data Application Item](img/control-plane-app-item.png)

The application is composed by 3 services (Control Plane, Control Plane Frontend, Envoy API Gateway), and 2 endpoints. Follow the creation wizard to instantiate these components in few clicks.

:::note
In case the application is not available in your Marketplace, please contact your Console administrator to verify if the Fast Data license is active for your Company.
:::

In the following paragraphs, you can find the guidelines to configure the Fast Data Control Plane resources to deploy them on your namespace.

### Control Plane

Once you have successfully created the application in the Design Area, move to the Control Plane microservice detail page.

:::note
Control Plane service does not work with more replicas. Be sure to **assign 1 Static Replicas** to this microservice.
:::

#### Configuration File

Fill the `config.json` file of the `piper-configuration` configMap with the correct MongoDB connection.  
To know more how to set properly the connection configuration properties, visit the [secret resolution](/products/fast_data_v2/secrets_resolution.md) documentation page.

Control Plane microservice handles and persists in a MongoDB collection the desired states of each Fast Data pipeline step. This persistence layer allows to retrieve in every moment the last saved runtime states for your Fast Data pipeline even in worst cases of service restarts or failures.

#### Required Kubernetes Permissions

The Control Plane service requires specific RBAC permissions to automatically discover and manage Fast Data workloads in your namespace. Follow these steps to configure the necessary permissions:

**Step 1: Identify the Service Account**

Identify the service account name within the Control Plane microservice detail page. According the application setup, this name corresponds to the microservice itself, resulting in `control-plane`.

**Step 2: Create the RBAC Configuration**

Create two separate YAML files in your project Git repository to define the Role and RoleBinding:

**`control-plane-role.yaml` file**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: control-plane-role
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
```

**`control-plane-role-binding.yaml` file**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: control-plane-role-binding
subjects:
  - kind: ServiceAccount
    name: control-plane
    namespace: {KUBE_NAMESPACE}
roleRef:
  kind: Role
  name: control-plane-role
  apiGroup: rbac.authorization.k8s.io
```

Commit these two files inside the `overlays/<YOUR_ENV>` project git folder, according to the specific runtime environment in which Fast Data control plane, as well as Fast Data workloads, will be deployed.

:::note
Note that these two YAML files must be committed **in each runtime environment** of your project in which we want to deploy the Fast Data Control Plane.
:::

**Step 3: Apply the Configuration**

During the deployment process, the files will be automatically applied to the according namespace, and the `{KUBE_NAMESPACE}` placeholder will be automatically replaced with your project's actual Kubernetes namespace.

Without these permissions, the Control Plane service cannot discover Fast Data workloads (Mongezium, Stream Processor, Farm Data, Kango) in your namespace and the Control Plane Frontend will not display your pipeline.

#### In-Memory Storage

You can opt for in-memory storage for your pipeline runtime states instead of persisting them.  
To do so, change the control plane dockerImage by removing the `-mongodb` suffix from the image (e.g., use `/data-fabric/piper:0.1.1` instead of `/data-fabric/piper:0.1.1-mongodb`).

:::caution
Please note that in-memory storage is volatile. Unlike the persistence layer, it **does not support state recovery**; any service restart or failure will result in the **permanent loss** of all active pipeline runtime states.  
The in-memory option is discouraged for production environments.
:::

### Control Plane Frontend

The Control Plane Frontend enables to:

- visualize pipelines structure and receive live updates about the runtime state of the Fast Data pipeline edges;
- execute actions on pipelines state, that is pausing or resuming data consumption from one or more data streams

The Control Plane Frontend is already pre-configured and ready to be deployed. No further user action is required to configure it.

### Envoy API Gateway

The Envoy API Gateway serves as the entry point for the Fast Data Control Plane application, providing essential routing and security capabilities.

The Envoy API Gateway microservice is pre-configured and ready to be deployed. The routing configuration is automatically generated based on the endpoint definitions, and no manual intervention is required.

#### Exposed Endpoints

The application pre-configures two endpoints that are automatically routed by Envoy:

- **`/api`** - Routes requests to the Control Plane service

- **`/`** - Routes requests to the Control Plane Frontend service  

## Workloads Configuration

To enable proper communication between the Control Plane and the Fast Data workloads deployed in your namespace, each Fast Data workload must be configured to connect to the Control Plane.

For each of the Fast Data workloads (Mongezium, Stream Processor, Farm Data, and Kango), you need to add the following configuration block to their respective JSON configuration files:

```json
{
  "controlPlane": {
    "grpcAddress": "http://control-plane:50051"
  }
}
```

:::note
Without this configuration, the Fast Data workloads will operate independently and will not be visible or controllable through the Control Plane interface.
:::

### Additional Configuration Parameters

Optionally, it is possible to add other parameters to the "control plane" config block, in particular:
- **`resumeAfterMs`**: Time in milliseconds to wait before automatically resuming operations after a pause (15 seconds)
- **`onCreate`**: Initial state when the workload for the first time is deployed and connects to the control plane. Available values are `"pause"` or `"resume"`. Set to `"pause"` to ensure the workload waits for explicit Control Plane commands from UI before start data consumption from data streams.

:::note
If no `onCreate` behavior is defined in the microservice ConfigMap, the **default runtime state** is **Running**. This design choice safeguards real-time data flows by preventing service interruptions when adding Control Plane connectivity to established Fast Data workloads.

`onCreate` is applied solely if the Fast Data workload is the first time that is deployed. Otherwise, the parameter will be not considered by Control Plane, as it reads the last saved runtime state.
:::

```json
{
  "controlPlane": {
    "grpcAddress": "http://control-plane:50051",
    "resumeAfterMs": 15000,
    "onCreate": "pause"
  }
}
```

## Application Deployment

Once you have concluded all the above mentioned configuration steps, you can easily deploy your Project configuration!

Verify the success of your deploy by:

1. Opening the Control Plane Frontend UI
2. Checking that all the configured Fast Data pipeline appears in the pipeline visualization
3. Confirming that all the pipeline configuration details appears inside the details of each pipeline artifact
4. Verifying that all execution steps implemented by Fast DAta workloads start in "paused" state as configured

## Embed as Console Extension

The Control Plane UI can be easily embedded as iFrame in either Overview Area or Runtime Area of your Fast Data Project.
To know how to manage extensions in Console, visit the dedicated [documentation page](/products/console/company-configuration/extensions.md).
