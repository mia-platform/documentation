---
id: locations
title: Extensible Locations
sidebar_label: Extensible Locations
---
# Extensible Locations

La Console permette di incorporare estensioni in punti ben specifici che hanno già delle voci di menu e dei gruppi che possono essere utilizzati anche dalle nostre estensioni. Queste locations sono:

- `tenant`
- `project`
- `runtime`

## Tenant

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![tenant location](./images/tenantLocation.png)
  
  </div>
</div>

Questa location si trova sulle sezioni riguardanti la Company caratterizzati dal prefisso nell'URL `/tenants/:tenantId`. Come visibile dall'immagine la sidebar contiene già i gruppi di menu utilizzabili tramite parentId: 

- **GENERAL GROUP** (parentId: `general`)
- **INFRASTRUCTURE GROUP** (parentId: `infrastructure`)
- **GOVERNANCE GROUP** (parentId: `governance`)
- **ACCESS MANAGEMENT GROUP** (parentId: `access-management`)
- **ADMINISTRATION GROUP** (parentId: `administration`)
- **EXTENSIBILITY GROUP** (parentId: `extensibility`)

## Project

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![project location](./images/projectLocation.png)
  
  </div>
</div>

Questa location si trova sulle sezioni riguardanti l'overview di Progetto caratterizzati dal prefisso nell'URL `/projects/:projectId`. Come visibile dall'immagine la sidebar contiene già i gruppi di menu utilizzabili tramite parentId: 

- GENERAL GROUP (parentId: `general`)
- ADMINISTRATION GROUP (parentId: `administration`)
- RUNTIME GROUP (parentId: `runtime`)
- ACCESS MANAGEMENT GROUP (parentId: `access-management`)

## Runtime

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '500px'}}> 

![runtime location](./images/runtimeLocation.png)
  
  </div>
</div>

Questa location si trova sulle sezione Runtime di un Progetto caratterizzati dal prefisso nell'URL `/projects/:projectId/monitoring/environments/:envId`. Come visibile dall'immagine la sidebar contiene già i gruppi di menu utilizzabili tramite parentId: 

- WORKLOADS GROUP (parentId: `workloads`)


<!-- TODO: Should be added some mentions about the order of menu items? -->
