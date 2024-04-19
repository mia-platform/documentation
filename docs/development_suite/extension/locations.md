---
id: locations
title: Extensible Locations
sidebar_label: Extensible Locations
---
# Extensible Locations


<!-- TODO: Add a Console image for each location also to show the base menu groups  -->
<!-- TODO: List all the locationId that can be used on the registered extension -->
<!-- TODO: For each extension list the routeId of each menu groups that can be used as parentId to registering an extension and add its menu item inside one of these extisting menu groups -->
<!-- TODO: Should be added some mentions about the order of menu items? -->

- 'tenant' -> '/tenants/:tenantId'

- GENERAL GROUP (parentId: `general`)
- INFRASTRUCTURE GROUP (parentId: `infrastructure`)
- GOVERNANCE GROUP (parentId: `governance`)
- ACCESS MANAGEMENT GROUP (parentId: `access-management`)
- ADMINISTRATION GROUP (parentId: `administration`)
- EXTENSIBILITY GROUP (parentId: `extensibility`)


- 'project' -> '/projects/:projectId'

- GENERAL GROUP (parentId: `general`)
- ADMINISTRATION GROUP (parentId: `administration`)
- RUNTIME GROUP (parentId: `runtime`)
- ACCESS MANAGEMENT GROUP (parentId: `access-management`)

- 'runtime' -> '/projects/:projectId/monitoring/environments/:envId'

- WORKLOADS GROUP (parentId: `workloads`)
