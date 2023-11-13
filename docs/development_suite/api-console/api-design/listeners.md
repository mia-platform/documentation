---
id: listeners
title: Create Listeners
sidebar_label: Create Listeners
---

## Listeners Management

From the Design area you can manage your Listeners and control where your Endpoints are exposed. This means that you can map Endpoints to different Listeners, which will make them available on different exposed domains.

:::info
Currently only Projects configured with an [**Envoy API Gateway**](/runtime_suite/envoy-api-gateway/overview.md) can access the Listeners feature.
:::

## What is a Listener

A Listener is a logical entity configured on your API Gateway that checks for incoming connection requests directed to your Project namespace.  
Each listener is mapped to a single port and defines rules to route incoming requests from external clients to a resource in your namespace, such as a specific microservice, exposed through endpoints.

This page describes the features of a Listener and how to configure these from the **Listeners** section of the [Design area](/development_suite/api-console/api-design/overview.md) of the Console.


## Create a Listener

There are three main steps needed to make an Endpoint reachable from outside the Console:
- Create the new Listener resource
- Expose the Endpoint on the Listener
- Configure the [Kubernetes Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) to make the new exposed port reachable

### Defining the Listener 

To create a new listener, just click the **Add Listener** button and specify its `name` and `port`. Both fields must be unique in the Project. 

Optionally, during listener creation, you can define whether to:
- **set the listener as default**, so that it is pre-selected when creating new endpoints. This comes in handy if you think you will use the listener to expose many new endpoints. You can always de-select it if needed.
- **expose all existing endpoints** on that listener

![create-listener](img/listeners/create-listener.png)

Creating a new Listener means opening the relative container port on the API Gateway too. This step is automated and in fact you can find the new port under the Container Ports section of the API Gateway.  


:::caution
Container Ports associated to Listeners cannot be deleted. To delete them firstly delete the Listener and then you can delete the port.
:::

![listeners-api-gateway-container-ports](img/listeners/listeners-api-gateway-ports.png)

### Exposing an Endpoint on the Listener

There are two ways to expose an Endpoint on the Listener:
- selecting the desired Listener from the [Listener Settings section](/development_suite/api-console/api-design/endpoints.md#listeners) within the Endpoint detail page of the project
- selecting the desired Listener from the specific [Endpoints table](/development_suite/api-console/api-design/listeners.md#endpoints-overview).


### Listeners overview for Endpoints

This table provides an overview of which Endpoint is exposed by which Listeners.  
It is possible to edit this configuration by just selecting the desired Listener for the desired Endpoint. 

![listeners-api-gateway-container-ports](img/listeners/endpoints-listeners-table.png)


### Configure the Kubernetes Ingress Controller

In order to receive incoming requests from the newly exposed API Gateway port, it is required to configure the [Kubernetes Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) to make the exposed port reachable.  

:::info
For example, if your Kubernetes cluster is configured to use [Traefik](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) as Ingress Controller provider, you may need to define a new [IngressRoute](https://doc.traefik.io/traefik/providers/kubernetes-crd/).

For more details on configuring a new `IngressRoute`, please refer to [this guide](/paas/traefik.md#expose-an-endpoint).
:::

## Edit a Listener

From the **Listeners** section of the [Design area](/development_suite/api-console/api-design/overview.md) of the Console it is possible to update settings of a Listener.

Changes made to the port of the Listener will be reflected on the Container Ports of the API Gateway too.  
This means that changing the port of a Listener will also enable the relative port on the API Gateway. The old port of the API Gateway stays enabled and it is up to the user to disable it if needed. 

:::warning
Make sure to modify the Kubernetes Ingress Controller accordingly.
:::

![edit-listener](img/listeners/edit-listener.png)


## Delete a Listener

To delete a listener just click on the delete action.

:::warning
Be aware that Endpoints that are **only exposed by** the Listener you are deleting, will be deleted as well.
:::

![delete-listener](img/listeners/delete-listener.png)
