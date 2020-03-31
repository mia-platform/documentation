Prerequisiti:

* devi avere il cluster k8s già impostato
* devi avere la console attiva che punti anche a quel cluster
* l'api console possa accedere al cluster
* l'utente deve avere sufficente permessi per creare un progetto su git
* ci deve essere gitlab

Fase 1: Creazione del progetto sulla DevOps Console

Informazione Progetto
Configurazione Environemnts
Configurazone dei servizi attivi

Fase 2: attivazione Pipeline

Fase 3: Esposizione su internet

Creazione del Dns
Creazione del certificato https
Configurazione di Traefik

Fase 4: Aggancio a Mongo

Fase 5: Creazione del Tenant di Auth 0



Fase 3: CMS

Fase 4: Configurazione Progetto Post Creazione

Area Debug: bisogna capire cosa fare - l'api console deve avere censito il cluster k8s
Deploy: script di deploy (capire lo stato attuale)
Deploy-History: non va configurato è sul backend della console
Dashboard: vanno agganciate
Log & Monitoring: - va configurato il mia-k8s service
API Portal: non bisogna fare nulla - funziona solo se hai acceso i servizi

Fase 5: Configurazione Avanzata progetto

IP Filtering

Cache di chiamate HTTP
