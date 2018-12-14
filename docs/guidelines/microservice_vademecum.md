Le applicazioni di microservizi sono costituite da piccoli servizi, scalabili e sottoposti al controllo delle versioni indipendentemente, che comunicano tra di essi tramite protocolli standard e interfacce ben definite.

## Linguaggi ammessi e template disponibili##

È possibile scrivere il proprio microservizio in qualsiasi linguaggio.
Ad oggi sono già presenti i template per microservizi nei linguaggi: NodeJS e Java.

## Template di un nuovo progetto ##

La creazione di un nuovo progetto è facilitata grazie alla disponibilità di alcuni template che garantiscono la corretta configurazione delle diverse impostazioni, tra cui:

- configurazione Docker (Dockerfile)
- configurazione Jenkins (Jenkinsfile)

### Template NodeJS ###
https://git.tools.mia-platform.eu/platform/templates/nodejs-custom-plugin

### Template POJO Java ###
https://github.com/mia-platform/custom-plugin-java

### Template Java - SpringBoot ###
https://github.com/mia-platform/custom-plugin-java-springboot

## Rotte base necessarie ##
Ogni microservizio espone alcune rotte utili all'ecosistema. Tramite ueste rotte è infatti possibile avre informazioni sullo stato di salute dei sistemi, ed effettuare dei check per il debugging.

### Rotte di salute ###
`/-/healts/`
Deve restituire 200 se il servizio e le sue eventuali dipendenze sono in grado di fornire quello per cui è stato creato.
Ed esempio, il servizio comunica correttamente con il database, tutte le sue configurazioni sono corrette, ha le risorse necessarie per essere eseguito.

### Rotte di stato ###
`/-/ready/`
Risponde 200 solo quando, al rilascio, sono completate tutte le operazioni preliminari necessarie al funzionamente del servizio stesso. Questa rotta comunica ad OpenShift la disponibilità del servizio.

### Rotte di documentazione ##
`/documentations/swagger/json/`
Ogni microservizio deve esporre la rotta di documentazione swagger
