---
id: overview
title: Proxy Manager
sidebar_label: Overview
---
The _Proxy Manager_ is a microservice which acts as a proxy between client and external services.

The service exposes an endpoint for each external service defined in the configuration file. Each request to a specific endpoint will be proxied to the related external service, appending to its base url the path extracted from the original request.

The _Proxy Manager_ can either relay the request unmodified or add an accces token for accessing protected resources.

In the latter case, the service takes care of requesting the token from the authorization server and stores it until it expires. At the moment only JWT tokens are supported.
