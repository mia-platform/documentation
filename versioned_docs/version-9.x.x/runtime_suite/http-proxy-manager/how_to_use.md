---
id: how_to_use
title: How to use
sidebar_label: How to use
---
Once the _Proxy Manager_ is up and running, you can contact each external service defined in the configuration by sending a request to the proxy at a specific endpoint, which corresponds to the **basePath** field provided in the configuration.

For example, if in the configuration you defined a service with **targetBaseUrl**: `http://example.org` and **basePath**: `/example`, you can tell the proxy to forward your request to this service by calling the `/example` endpoint. 

All the routes exposed by the external service will also be reachable through the proxy.
