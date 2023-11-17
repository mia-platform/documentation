---
id: microservice-container-ports
title: Microservice Container Ports
sidebar_label: Define Container Ports
---

In the detail page of a microservice, you can configure its container ports in the dedicated Container ports card.

:::info
At least one container port is needed in order to expose the microservice. If you do not set any container port the microservice will be unreachable by any other service in the Project.
:::

![container-ports-section](img/container-ports-card.png)

To define a container port, four properties are needed:

- Port name
- Port
- Target Port
- Protocol

The **Port name** is the identifier of the port, which can be used to refer to that port in the Console.  
The **Port** field contains the abstracted Kubernetes Service port; this is the port that must be used by other pods to access the Service. The default port value is 80.  
The **Target Port** represents the port that the Kubernetes container accepts traffic on. Our default is 3000.  
The **Protocol** field defines the network protocol used for the Service. The default is TCP but UDP is also supported.

:::caution
Remember that the port used to contact the probes is always (and only) the one indicated in the environment variable "HTTP_PORT". For more information on the [probes](/development_suite/api-console/api-design/microservice-runtime-resources.md#liveness--readiness-probes), click here.   
For more information on environment variables, [click here](/development_suite/api-console/api-design/services.md#environment-variable-configuration).
:::
