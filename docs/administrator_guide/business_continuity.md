# Business Continuiti

Con Business Continuity si intendono tutti gli accorgimenti atti a rendere il sistema e i suoi servizi
disponibili senza interruzioni.

In caso di probemi della piattaforma, grazie a questi accorgimenti, gli utenti non hanno percezione dei problemi
e il servzio continua funzionare regolarmente.

La continuità di business si misura in tempo di down rispetto al tempo di riferimento. Tipicamente si prende come
riferimento l'anno. La continuità di servizio può essere interrotta da fattori che non sono sotto il controllo
del piano di Business Continuity, come ad esempio: down dei datacenter, calamità naturali, attacchi hacker.

In questi casi entra in funzione il piano di Disaster Recovery. [Si veda la sezione dedicata per maggiori dettagli](disaster_recovery.md)

## Piano di Business Continuity

I fattori che possono influire sulla business continuity di Mia Platform sono possono essere:


- pianificati:
    - aggiornamenti della piattaforma;
    - aggiornamenti dell'infrastruttura;
    - rilascio di nuove funzionalità;
- non pianificati:
    - down dell'infrastruttura;
    - attachi hacker;
    - calamità naturali;
    - rilasci di hotfix urgenti;
    - carico della piattaform che supera i limiti di progettazione;
    - errori umani.

Per gli eventi pianificati è possibile garantire al 100% la business continuity, invece per quelli non pianificati,
non sempre sarà possibile garantire la continuità di servizio ma mitigare gli effetti dell'interruzioni o far
subentrare il piano di [disaster recovery](disaster_recovery.md).

## Fattori che consentono la Business Continuity

Mia Platform ha un'architettura a microservizi stateless. Questo significa che ogni microservizio della piattaforma è:
- ridondato;
- scalabile;
- stateless, cioè non ha un comportamento differente legato all'ordine di come riceve le chiamate ma la sessione è gestita
a livello applicativo.

L'orchestrazione dei microservizi è delegata a Kubernetes che ha un sistema di gestione del monitoraggio dello stato
dei servizi distribuito e quindi non ha un singolo punto di fallimento.

La persistenza è garantita da un cluster mongodb che garantisce la persistenza e il failover grazie al sistema
di replica set del database server stesso.

L'accesso ai servizi via API passa attraverso web server Openresty ridondabili che fanno reverse proxy sui vari servizi
interni.

Nel caso di applicazioni ad elvata affidabilità il reverse proxy si appoggia ad un service registry dove tutti i
servizi sono catalogati.

La piattaforma può essere installata sia onpremise che su cloud, anche di diversi vendor, anche contemporaneamente. 
Questo garantisce che la probabilità di down del servizio sia ridotta ulteriormente.


## Gestione eventi pianificati

### Mia Platoform
Seguono le azioni per garantire la business continuity nel caso di eventi pianificati per Mia Platform:

- prima di iniziare un evento pianificato verificare che:
    - i backup siano aggiornati;
    - se si rilascia un aggiornamento i test in pre-produzione siano tutti passati e le configurazioni siano tutte sotto repository;
    - la pipeline di delivery sia aggiornata e correttamente funzionante senza notifiche di errore;
    - i microservizi siano ridondati su almeno due nodi;
    - nel caso ci siano aggiornamenti NON retroconpatibili, tutte le applicazioni che accedono ai servizi in aggiornamento siano state testate con successo in pre-produzione
- se si sta rilasciando un aggiornamento o una nuova funzionalità aggiornare un nodo alla volta e testare quel nodo prima di propagare la modifica;
- nel caso di errori fare rollback sul nodo alla versione precedente.

### Infrastruttura

Le azioni per garantire la business continuity durante l'aggiornamento dell'infrastruttura dipendono dall'implementazione
dell'infrastruttura stessa. Si consiglia di seguire le buone pratiche di utilizzo comune per l'infrastruttura utilizzata.

Su consigliano comunque le seguenti azioni:

- verificare che gli aggiornamenti siano stati fatti prima in pre-produzione e i test siano tutti ok;
- ove possibile aggiornare un nodo alla volta dell'infrastruttura in modo da poter fare i test graduali e poter fare rollback
  se serve.


## Gestione eventi non pianificati

Gli eventi non pianificati, per loro natura, sono più difficili da gestire e necessitano di azioni automatiche per mitigare
i possibili impatti sulla continuità del servzio.

Seguono le azioni di mitigazione per ogni evento non pianificato

### Down dell'infrastruttura o calamità naturale

Per evitare l'interruzione di servizio di Mia Platform nel caso di problemi dell'infrastruttura è necessario ridondare 
tutti i servizi della piattaforma su infrastrutture differenti.

Questo è possibile farlo disaccoppiando l'infrastruttura fisica e virtual dall'orchestratore.

Un'installazione tipica è utilizzare Kubernetes in modalità Federated Replica Set. Esistono diversi servizi sul mercato
per implementare questa configurazione.

### Attacco hacker o sovraccarico

Nel caso di DOS o DDOS la garanzia della continutà di servizio è offerta da:

- autoscaling dei nodi per assorbire il traffico in eccesso
- filtri HTTP/HTTPS posti a monte di Mia Platform che bloccano gli IP che effettuano troppe richieste identiche e frequenti
- drop delle connessioni in eccesso per non fare accedere ulteriori utenti fino a quando gli utenti con chiamate in corso non hanno finito la loro chiamata

### Rilascio hotfix urgente

Nel caso di hotfix urgente si raccomandano gli stessi accorgimenti utilizzati per il rilascio di aggiornamenti pianificati.


### Errore umano

Nel caso di errore è possibile ripristinare la versione precedente se si sono fatti gli aggiornamenti graduali.
Nel caso di errore distruttivo e nessuna delle opzioni sopra riesce a mitigare gli impatti si rimanda al [Disaster Recovery](disaster_recovery.md).

