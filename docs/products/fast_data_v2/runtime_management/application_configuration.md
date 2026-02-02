---
id: application_configuration
title: Application Configuration
sidebar_label: Application Configuration
---

## Application Configuration

In order to configure in your Fast Data Project the Fast Data Control Plane application, enter the Project Design Area, and find it inside the Application section.

:::note
In case the application is not available in your Marketplace, please contact your Console administrator to verify if the Fast Data license is active for your Company.
:::

The application is composed by 3 services (Control Plane, Control Plane Frontend, Envoy API Gateway), and 2 endpoints.

In the following paragraph, you can find the guidelines to instantiate Control Plane application in few clicks and to deploy it on your Fast Data namespace.

### Control Plane

Once the application has been instantiated inside the Design Area, move to the Control Plane microservice detail page.

#### Configuration File

Fill the `config.json` file of the `piper-configuration` configMap with the correct MongoDB connection.  
To know more how to set properly the connection configuration properties, give a look to the [secret resolution](/products/fast_data_v2/secrets_resolution.md) documentation page.

The MongoDB connection set is useful to correctly handle and persist in a MongoDB collection the desired states of each Fast Data pipeline steps. This persistence layer allows to retrieve in every moment the last saved runtime steps even in worst cases of service restarts or failures.

#### Required Kubernetes Permissions

The Control Plane service requires specific RBAC permissions to automatically discover and manage Fast Data workloads in your namespace. Follow these steps to configure the necessary permissions:

**Step 1: Identify the Service Account**

Go to your Control Plane microservice detail page in the Console and check the **Container** section to find the service account name. It's typically something like `my-control-plane-service-account` or follows your project naming convention.

**Step 2: Create the RBAC Configuration**

Create a YAML file (e.g., `control-plane-rbac.yaml`) with the following content:

```yaml
# Role that allows operations on deployments and configmaps
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: control-plane-role
  namespace: {YOUR_NAMESPACE}
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]

---

# Binding of the role above to the control plane service account
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: control-plane-role-binding
  namespace: {YOUR_NAMESPACE}
subjects:
  - kind: ServiceAccount
    name: {YOUR_SERVICE_ACCOUNT_NAME}
    namespace: {YOUR_NAMESPACE}
roleRef:
  kind: Role
  name: control-plane-role
  apiGroup: rbac.authorization.k8s.io
```

**Step 3: Apply the Configuration**

Replace the placeholders:
- `{YOUR_NAMESPACE}`: Your Fast Data project namespace
- `{YOUR_SERVICE_ACCOUNT_NAME}`: The service account name found in Step 1

Apply the configuration to your Kubernetes cluster:

```bash
kubectl apply -f control-plane-rbac.yaml
```

**Step 4: Verify the Configuration**

Check that the role and binding were created successfully:

```bash
kubectl get role,rolebinding -n {YOUR_NAMESPACE}
```

Without these permissions, the Control Plane service cannot discover Fast Data workloads (Mongezium, Stream Processor, Farm Data, Kango) in your namespace and the Control Plane Frontend will not display your pipeline.

#### In-Memory Storage

You can opt for in-memory storage for your pipeline runtime states instead of persisting them.  
To do so, change the control plane dockerImage by removing the `-mongodb` suffix from the image (e.g., use `-piper:0.1.1` instead of `-piper:0.1.1-mongodb`).

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

#### Secure Access

For production environments, it is strongly recommended to secure access to the Control Plane Frontend UI to prevent unauthorized pipeline management operations.

**Basic Authentication with Traefik**

If your infrastructure uses Traefik as ingress controller, you can implement basic authentication by creating a middleware and applying it to your ingress routes:

1. **Create an authentication secret:**

```bash
# Create htpasswd file with username/password
htpasswd -c auth myuser
kubectl create secret generic authsecret --from-file=auth
```

2. **Create a Traefik middleware for basic auth:**

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: control-plane-basicauth
spec:
  basicAuth:
    secret: authsecret
```

3. **Apply the middleware to your IngressRoute:**

```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: control-plane-ingress
spec:
  entryPoints:
    - websecure
  routes:
    - match: "Host(`your-domain.com`) && PathPrefix(`/`)"
      kind: Rule
      middlewares:
        - name: control-plane-basicauth
      services:
        - name: api-gateway
          port: 8080
```

:::warning
The Control Plane Frontend provides direct control over data pipeline operations. Ensure that only authorized users have access to prevent accidental data flow interruptions or unauthorized pipeline runtime states modifications.
:::

## Workloads Configuration

To enable proper communication between the Control Plane and the Fast Data workloads deployed in your namespace, each Fast Data workload must be configured to connect to the Control Plane.

For each of the Fast Data workloads (Mongezium, Stream Processor, Farm Data, and Kango), you need to add the following configuration block to their respective JSON configuration files:

```json
{
  "controlPlane": {
    "grpcAddress": "http://control-plane:50051",
    "resumeAfterMs": 15000,
    "onCreate": "pause"
  }
}
```

### Configuration Parameters

- **`grpcAddress`**: The gRPC endpoint of the Control Plane service. Uses the internal Kubernetes service name `control-plane` on port `50051`
- **`resumeAfterMs`**: Time in milliseconds to wait before automatically resuming operations after a pause (15 seconds)
- **`onCreate`**: Initial state when the workload starts. Set to `"pause"` to ensure workloads wait for explicit Control Plane commands before processing data

:::note
Without this configuration, the Fast Data workloads will operate independently and will not be visible or controllable through the Control Plane interface.
:::

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
