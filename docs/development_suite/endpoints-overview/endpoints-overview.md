---
id: endpoints-overview
title: Endpoints Overview
sidebar_label: Endpoints Overview
---
## What is the Endpoints Overview

The Endpoints Overview is a visualization tool accessible from the Projects[TODO ?] section of the console by selecting a specific tenant and clicking on the EP button[TODO ?]. The Endpoints Overview aims to help the user to obtain a graphical cross-project overview of the configuration of all the projects into the selected tenant. A particular focus of this graphical overview is about the projects' endpoints with special attention on the endpoints' security.  

From the project configuration, Endpoints Overview creates the starting tabular visualization of the endpoints where each row shows: 
* *Project*: Project name.
* *Project owner*: Project owner name.
* *Endpoint/API*: Endpoint name.
* *Show in API Portal*: Label that shows if the endpoint appears in the API portal.
* *API-Key*: Label that shows if the endpoint is protected by an API-key.
* *Public*: Label that shows if the endpoint is public.
* *Group Expression*: Label that shows if the endpoint is protected by a group expression and the concerning expressions.
* *Decorator PRE*: Label that shows if a PRE decorator is configured for the endpoint and the concerning decorators.  

An example is in the following picture.

![Endpoints Overview visualization](img/endpoints-overview-visualization.png)

Through this tool the governance entity of the tenant can have a graphical overview of the global configuration and the security of all the projects and endpoints.

## Main functionalities

### Graphical features representation

* The user can consult endpoints status. The status is represented by a painted circle that can be green or red jointly a true or false label respectively representing the presence of the feature or its absence.

* The *Group expression* feature is also represented by a painted circle and has the group expressions as labels.

* The *Decorator PRE* feature is represented by a painted circle that can be grey or orange, that because the presence or the absence of a decorator does not directly influence the security of the endpoint. The painted circle is combined with labels that specify the type of decorators.

![Graphical features](img/graphical-features.png)  
[TODO change the image with the udated one]
### Sorting

The Endpoint Overview output can be sorted by each one of the features by clicking on the attributes presented in the first table row.

![Sort](img/sort.png)

### FIltering

The Endpoints Overview results can be filtered using the drop-down menus concerning the project names and the required features. The Endpoints Overview results are filtered showing only the row that satisfies all the chosen filters.

![Project filter](img/project-name-filter.png)

![Feature filter](img/feature-filter.png)

![Filter](img/filter.png)

In the presented example the Endpoint Overview result is filtered for the endpoints into *Portale Benessere* or *Customers* projects having both *API-Key* and *Group expression* features settled to true.  
[TODO to be changed the projects names]
