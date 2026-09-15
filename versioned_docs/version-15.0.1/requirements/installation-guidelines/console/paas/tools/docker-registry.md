---
id: docker-registry
title:  Docker Registry
sidebar_label: Docker Registry
---
Mia-Platform PaaS offers to its users a Docker Registry service where they can host the container images of the microservices they are developing.  
Our Docker Registry is public and hosted at [Nexus Mia-Platform](https://nexus.mia-platform.eu).

## Usage and cleanup policies

We setup daily scheduled cleanup policies in order to avoid our repositories to grow too quickly. If this happens, it will presents many risks such as: performance degradation, server failures, etc.  

Currently, in order to prevent the above risks, our cleanup policies delete all the images that have not been used for more than 2 years.  

