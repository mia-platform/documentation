---
id: listeners
title: Create Listeners
sidebar_label: Create Listeners
---

## What is a Listener

A Listener is a logical entity configured on your API Gateway that checks for incoming connection requests directed to your cluster.  
Each listener is mapped to a single port and defines rules to route incoming requests from external clients to a resource in your cluster, such as a specific microservice, exposed through endpoints.

This page describes the features of a Listener and how to configure these from the **Listeners** section of the [Design area](/development_suite/api-console/api-design/overview.md) of the Console.

:::info
Currently Listeners are only available to Projects using an **Envoy API Gateway**.
:::

## Create a Listener

Follow these three steps in order to create a new Listener and make an Endpoint reachable from outside the Console:
- create the new Listener resource
- expose the Endpoint on the Listener
- define a new Traefik IngressRoute for the newly exposed API Gateway port

### Defining the Listener 

To create a new listener, just click the **Add Listener** button and specify its `name` and `port`. Both fields must be unique in the Project. 

Optionally, you can define whether to:
- **expose new endpoints on the listener** by default
- **expose all existing endpoints** on the listener

![create-listener](img/listeners/create-listener.png)

Creating a new Listener means opening the relative container port on the API Gateway too. This step is automated and in fact you can find the new port under the Container Ports section of the API Gateway.  
:::caution
Container Ports associated to Listeners cannot be deleted. To delete them firstly delete the Listener and then you can delete the port.
:::

<!-- TODO: update image with disabled buttons -->
![listeners-api-gateway-container-ports](img/listeners/listeners-api-gateway-ports.png)

### Exposing an Endpoint on the Listener

Once the new Listener has been created, it can be selected from the [Listener Settings section](/development_suite/api-console/api-design/endpoints.md#listeners) within the Endpoint detail page of the project.

### Define the Kubernetes Ingress

In order to receive incoming requests from the newly exposed API Gateway port, it is required to define the [Traefik IngressRoute](https://doc.traefik.io/traefik/routing/providers/kubernetes-crd/#kind-ingressroute) for the same port too.  
To do this, on the git repository of your Project locate the correct `.ingressroute.yaml` file for your environment and extend it with the new route and defining a new `host`. The resulting file should look like this:

``` yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata: # your metadata here ...
spec:
  entrypoints: # your entrypoints config here ...
  routes:
  - # some already existing route here ...
  - match: Host(`<put-a-host-here>.<your-domain-here>`) # e.g.: Host(`mobile-apis.your-domain.com`)
    kind: Rule
    services:
      - name: api-gateway # the name of your API Gateway service
        port: 8082 # the port just exposed

```

## Delete a Listener

To delete a listener just click on the delete action.

:::warning
Be aware that any Endpoint that is exposed **only** on the Listener you want to delete, will be deleted too.
:::

![delete-listener](img/listeners/delete-listener.png)