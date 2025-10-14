---
id: use-cases
title: When should I use the Orchestrator Generator extension?
sidebar_label: Use Cases
---

In most scenarios, Mia-Platform Console is just enough when it comes on deploying your applications on your orchestrator. In some other specific situations however, you may want more control and flexibility from your deployments.

[Orchestrator Generator extension](/console/company-configuration/providers/extensions/orchestrator-generator/overview.mdx) is the Mia-Platform go-to solution when you need to generate orchestrator manifest files tailored to your specific needs. 

To help you better understand the power of this tool, let's inspect more in detail a few scenarios in which you may want to opt for Orchestrator Generator.

### Deploying on Non-Supported Orchestrators

Console currently only generates manifest files to deploy your services on your Kubernetes namespace. However there are several orchestrators or container management services out there other than Kubernetes.  
Think about:

1. **Container Orchestrators:** these are Kubernetes alternatives such as Docker Swarm or Apache Mesos.
1. **Managed Container Services:** an abstraction over the container orchestrator that provides a place to host your application with a monitoring system already in place, that let you forget about the cluster management. To name a few AWS ECS, Azure ACS or GCP Cloud Run.
1. **Serverless Computing Services:** another serverless fully managed resource that makes you focus solely on the logic you need without caring about the bare metal under the hood. Here you can find Aws Lambdas, Azure Functions or GCP Cloud Functions.

If you are deploying on one of these resources, you can simply build your own mapping layer that takes in the configuration of your Project and translates it into your favorite cloud resources.

### Using alternative Kubernetes Package Managers

While Kubernetes provides its own system for deploying applications, tools like Helm gained popularity due to their ability to manage deployments as reusable charts.  
If this is your case, the Orchestrator Generator extension can help you achieving this: you just need to create a mapper from the Project configuration into the structure and format expected by your package manager (in this case, the constructs required for Helm charts).

### Integrating with Existing Orchestrator Workflows

Many organizations already adopted custom deployment tools, processes and scripts tailored to their chosen orchestrator and their specific infrastructure requirements. Some other companies might even have different personas for application development and containerization management. Rather than forcing you to adopt the Mia-Platform workflow, the Orchestrator Generator Extension can act as a bridge providing another level of flexibility.

In this case, your already established workflows can be integrated with the Console, consuming your Project configuration as input while leaving all the rest unchanged streamlining your overall deployment process.
