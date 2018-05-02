## Componenti ##
Qui potrai trovare l'elenco dettagliato dei componenti che costituiscono Mia-Platform.

### API Gateway ###

L'API Gateway è il microservizio responsabile del routing delle richieste verso il servizio corretto.
Inoltre gestisce l'autenticazione, esegue il controllo di accesso e il rate limiting.

Il servizio è composto a default da server nginx multipli, 2 in ascolto sulle porte 80 ed 8080, 4 in ascolto su socket unix per ritornare i messaggi di errore.

La porta 80 è utilizzata per il routing applicativo, mentre quello di backoffice è esposto alla 8080.

A questo [link](https://git.tools.mia-platform.eu/platform/core/api-gateway) il progetto e il relativo README.

### Microservice Gateway ###

Questo microservizio fornisce la possibilità di specificare degli hook http da chiamare prima e dopo ogni richiesta, per decorarla con servizi aggiuntivi.
Tali servizi possono modificare la richiesta (hook di `PRE`), ad esempio per aggiungere funzionalità di ACL, oppure agire dopo che la richiesta al servizio è stata effettuata (hook di `POST`), ad esempio per aggiungere ulteriori dati alla risposta.

Il Microservice Gateway si occupa di eseguire le chiamate a questi servizi di hook specificati da configurazione allo startup, e modificare (o interrompere) la richiesta secondo quanto indicato dai servizi.


I microservizi di hook devono soddisfare una precisa interfaccia http per essere interrogati con successo dal Microservice Gateway. Tale interfaccia e maggiori dettagli riguardo al microservizio sono forniti nella [pagina](https://git.tools.mia-platform.eu/platform/core/microservice-gateway) del microservizio su gitlab.

### ACL ###

Il microservizio di ACL è un hook di `PRE` il cui scopo è applicare regole di ACL per ogni richiesta per indicare al CRUD Service quali righe o colonne filtrare.
Queste regole di ACL si basano sull'utente corrente e sui suoi gruppi di appartenenza.


Attualmente due tipologie di ACL sono previste dal servizio:

- *ACL per righe*: prepara una query che filtrerà i documenti sulla base dell'utente corrente (ad esempio per mostrare soltanto i documenti creati dall'utente).
- *ACL per colonne in lettura*: permette di limitare i campi che l'utente può vedere nella risposta sulla base della sua appartenenza a gruppi e del tipo di cliente.

Questo servizio agisce tramite la lettura e scrittura di header http. Infatti le informazioni su utente e gruppi sono recuperate da header, ed il risultato della applicazione delle regole è la scrittura di header di ACL che il CRUD Service è in grado di interpretare per eseguire effettivamente i filtri.
Anche in questo caso le regole da applicare sono specificate in configurazione. Per approfondire come configurare il servizio, fare riferimento alla [pagina](https://git.tools.mia-platform.eu/platform/core/acl-service) del progetto.

### CRUD Service ###

Il progetto CRUD Service ospita sia il CRUD stesso che due microservizi (logici) per permettere la compatibilità con il CMS. La configurazione di questi servizi può essere generata tramite API Console.

Il CRUD Service è un microservizio che serve ad esporre una API HTTP per eseguire operazioni di CRUD (Create, Read, Update, Delete) su collezioni mongodb.
Esso è configurato allo startup tramite la definizione di collezioni (una o più), per fornire una interfaccia HTTP coerente ed effettuare la validazione delle operazioni prima di eseguirle sul database.

La definizione di una collezione prevede di indicare l'elenco e la tipologia dei campi e di opzionalmente specificare indici. Si consiglia di fare riferimento alla [repository](https://git.tools.mia-platform.eu/platform/core/crud-service) ed al readme del servizio [README](https://git.tools.mia-platform.eu/platform/core/crud-service/blob/master/crud/README.md).

#### v1Adapter ####

Questo microservizio permette di utilizzare il CMS con il nuovo servizio di CRUD Service, traducendo le richieste dal CMS in chiamate HTTP adattate alla nuova interfaccia.
Oltre al mapping delle rotte http, si occupa anche della conversione dei tipi (ad esempio date e coordinate geografiche), e della trasformazione da sync e trash al nuovo stato e vice versa.
La repository del servizio è la stessa del CRUD Service, la documentazione specifica del servizio è nel [README](https://git.tools.mia-platform.eu/platform/core/crud-service/blob/master/v1Adapter/README.md).

#### Resources ####

Microservizio che serve per configurare il CMS per mostrare sia collezioni sul BAAS 3 che collezioni gestite dal nuovo CRUD Service. [README](https://git.tools.mia-platform.eu/platform/core/crud-service/tree/master/resources)

### Files Service ###

Questo microservizio offre la funzionalità di caricamento e scaricamento di files utilizzando servizi di terzi (es S3 o MongoDB). L'interfaccia http del microservizio è indipendente dallo specifico servizio di storage utilizzato, che è configurato allo startup. I files caricati vengono anche censiti in una collezione gestita dal CRUD.
Attualmente sono supportati S3 e MongoDB come servizi di storage.

Per configurarlo ed utilizzarlo fare riferimento al [link](https://git.tools.mia-platform.eu/platform/plugins/files-service) alla pagina principale del progetto.

### Pingator ###

Pingator è un servizio che monitora lo stato dei servizi per controllare che siano attivi.

Vedi la pagina del progetto [qui](https://git.tools.mia-platform.eu/platform/core/pingator).

### Client Proxy ###

### Static Files ###

### Certificate Service ###

### Auth Service ###

### Session Manager ###

