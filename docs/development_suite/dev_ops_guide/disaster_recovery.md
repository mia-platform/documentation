# Disaster Recovery

Con Disaster Recovery si intendono le procedure per ripristinare una situazione che ha compromesso il corretto
funzionamento della piattaforma e dove tutti i sistemi di Business Continuity hanno fallito con la conseguente
non disponibilità dei servizi.

Le procedure di Disaster Recovery possono essere divise in tre parti:

- checklist dei sistemi;
- manutenzione e verifica;
- attuazione delle procedure in caso di malfunzionamenti.

## Checklist dei sistemi

Per poter completare con successo le procedure di Disaster Recovery in caso di guasti è fondamentale che:

- tutti i dati di MongoDB siano sotto backup;
- tutte le configurazioni custom di Mia Platform siano sotto repository;
- la catena di continuous delivery e deployment siano attive e funzionanti;
- si abbia traccia delle versioni delle immagini docker installate;
- sia aggiornato il documento di deployment con la descrizione di tutta l'infrastruttura di runtime;
- l'infrastruttura di runtime è generata in automatico da script e gli script sono sotto repository.

## Manutenzione e verifica

E' necessario che periodicamenre siano fatte le seguenti azioni:

- ogni punto della checklist sia verificato;
- il sistema sia stressato spegenendo in modo programmato parti dei servizi;
- si simuli, almeno una volta ogni sei mesi, un'azione di Recovery su un sistema di test.

## Attuazione delle procedure

In caso di problemi le azioni per ripristinare la piattaforma sono:

- installare l'infrastruttura di riferimento con gli script automatici;
- installare i nodi di Mia Platform alle versioni che erano sui sistemi in produzione;
- installare le configurazioni custom;
- ripristinare i backup di MongoDB.

> Si consiglia di far eseguire tutte queste operazioni da script automatici.
