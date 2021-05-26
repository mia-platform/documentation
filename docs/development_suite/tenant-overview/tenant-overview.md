---
id: tenant-overview
title: Tenant Overview
sidebar_label: Tenant Overview
---
## What is the Tenant Overview

The Tenant Overview is a visualization tool accessible from the Tenant Section. This feature is accessible from the console host at the path `/tenants/:tenantId/overview/endpoints` through the url `$HOSTNAME_CONSOLE/tenants/:tenantId/overview/endpoints`. This provides the user with a graphical cross-project overview of the configuration of all the selected tenant's projects. The graphical overview has a particular focus on the security configuration of the projects' endpoints.  

Tenant Overview collects data on the project configuration and creates a table presenting information on all the endpoints, where each row shows:
* *Project*: Project name.
* *Project owner*: Project owner name.
* *Endpoint/API*: Endpoint name.
* *Show in API Portal*: A label that shows if the endpoint appears in the API portal.
* *API Key*: A label that shows if the endpoint is protected by an API-key.
* *Public*: A label that shows if the endpoint is public (the API is accessible even if the user is not logged in).
* *User Group Permission*: A label that shows if the endpoint is protected by a group expression and the concerning expressions.
* *Decorator PRE*: A label that shows if a PRE decorator is configured for the endpoint and the concerning decorators.  

An example is in the following picture.

![Endpoints Overview visualization](img/endpoints-overview-visualization.png)

Through this tool, the government entity of the tenant can have a graphical overview of the global configuration and the security of all the projects and endpoints.

## Main functionalities

### Graphical features representation

The user can consult endpoints' status, represented by a dot and a configuration label. The meaning of the dot depends on its colour:

* Red: the absence of a security feature in the corresponding column.
* Green: the presence of a security feature in the corresponding column.
* Grey: the presence of a feature that does not directly influence the security of the endpoint.
* Orange: the absence of a feature that does not directly influence the security of the endpoint.

The *User Group Permission* column also displays the group expressions as labels, each label represents the expression string provided in the endpoint configuration. In this case the label *"true"* means that there is no check over the group expression and therefore the endpoint is not protected, conversely the label *"false"* means that it is not possible to access the endpoint. A custom group expression is shown as label with a grey dot.  

The *Decorator PRE* column also specifies the type of decorators as labels.  

![Graphical features](img/graphical-features.png)  

### Sorting

The Tenant Overview output can be sorted by each one of the features by clicking on the attributes presented in the first table row.

![Sort](img/sort.png)

### Filtering

The Tenant Overview results can be filtered by the project names and the attributes within the columns using the drop-down menus. By doing so, only the Endpoints Overview's rows satisfying the chosen filters will be shown.

![Project filter](img/project-name-filter.png)

![Feature filter](img/feature-filter.png)

![Filter](img/filter.png)

In the presented example, the Tenant Overview result is filtered to display only the endpoints into *Project_abcd* project having both *API Key* set to *required* and *User Group Permission* features set to *true*.  
