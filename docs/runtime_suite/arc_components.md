Qui potrai trovare l'elenco dettagliato dei componenti che costituiscono Mia-Platform.

![](img/schema.PNG)

# API & Microservice Ecosystem #

## API Gateway ##

L'API Gateway è il microservizio responsabile del routing delle richieste verso il servizio corretto.
Inoltre gestisce l'autenticazione, esegue il controllo di accesso e il rate limiting.

Le sue funzionalità principali sono:

* URL Mapping
* Rate Limit
* Http Secure Headers
* Request Dispaching
* API Secret Management
* Http Utilities
* Proxy-Pass Plain
* SSL Encryption
* URL Rewriting

Il servizio è composto a default da server nginx multipli, 2 in ascolto sulle porte 80 ed 8080, 4 in ascolto su socket unix per ritornare i messaggi di errore.

La porta 80 è utilizzata per il routing applicativo, mentre quello di backoffice è esposto alla 8080.

![](img/gateway.PNG)

### Client Proxy ###

Il microservizio è responsabile della gestione del traffico in entrata, esegue la terminazione SSL e dispaccia le chiamate allo spazio client corretto.

L'immagine è costituita da un file nginx.conf che applica il formato dei registri e le impostazioni di base.
Inoltre fornisce un file secure.conf che implementa la migliore pratica di sicurezza SSL da includere nella dichiarazione del server necessaria. È il percorso è /etc/nginx/secure.conf.
La configurazione SSL si basa sulla disponibilità di tre file all'interno della directory / etc / usr / ssl /:

- dhparam: una chiave Diffie-Helman generata con almeno 2048 bit (4096 bit sono un po 'lenti in questo momento)

- sslcrt: il certificato per la configurazione SSL

- sslkey: la chiave privata per la configurazione SSL

Di default il server Nginx cercherà la dichiarazione del server all'interno del file .conf all'interno della directory /etc/nginx/conf.d
Per scrivere le varie dichiarazioni del server, bisogna seguire la [documentazione ufficiale di Nginx](https://nginx.org/en/docs/).

### Certificate Service ###

Questo microservizio gestisce la creazione dei certificati SSL necessari ad Nginx per consentire le connessioni https al cluster.

## Microservice Ecosystem ##

### Microservice Gateway ###

Questo microservizio fornisce la possibilità di specificare degli hook http da chiamare prima e dopo ogni richiesta, per decorarla con servizi aggiuntivi.
Tali servizi possono modificare la richiesta (hook di `PRE`), ad esempio per aggiungere funzionalità di ACL, oppure agire dopo che la richiesta al servizio è stata effettuata (hook di `POST`), ad esempio per aggiungere ulteriori dati alla risposta.

Il Microservice Gateway si occupa di eseguire le chiamate a questi servizi di hook specificati da configurazione allo startup, e modificare (o interrompere) la richiesta secondo quanto indicato dai servizi.

I microservizi di hook devono soddisfare una precisa interfaccia http per essere interrogati con successo dal Microservice Gateway.

![](img/mg.PNG)

### Marketplace Custom Microservice Template

#### NodJS Template

Un **Custom Microservices** (CM) incapsula logiche di business ad-hoc, sviluppabili da qualsiasi utilizzatore della piattaforma e può potenzialmente essere scritto in qualsiasi linguaggio di programmazione. Tuttiavia, per facilitarne adozione e sviluppo, il team di Mia-Platform ha creato **custom-plugin-lib, una libreria in node.js, basata sulla libreria fastify**. Utilizzando custom-plugin-lib è possibile creare un CM implementando:

* handler di rotte HTTP
* cambiare comportamento in base alle informazioni di quale client ha effetuato la richiesta, dell'utente loggato e dei suoui gruppi di appartenenza
* richieste ad altri servizi o CM della piattaforma
* decoratori di PRE o di POST

[Qui puoi trovare tutte le informazioni per configurarlo](\development_suite/plugin_baas_4.md)

## BaaS ##
### CRUD Service ###

Il CRUD Service è un microservizio che serve ad esporre una API HTTP per eseguire operazioni di CRUD (Create, Read, Update, Delete) su collezioni mongodb.
Esso è configurato allo startup tramite la definizione di collezioni (una o più), per fornire una interfaccia HTTP coerente ed effettuare la validazione delle operazioni prima di eseguirle sul database.

La definizione di una collezione prevede di indicare l'elenco e la tipologia dei campi e di opzionalmente specificare indici.

![](img/crud.PNG)

### Files Manager Service ###

Questo microservizio offre la funzionalità di caricamento e scaricamento di files utilizzando servizi di terzi (es S3 o MongoDB). L'interfaccia http del microservizio è indipendente dallo specifico servizio di storage utilizzato, che è configurato allo startup. I files caricati vengono anche censiti in una collezione gestita dal CRUD.
Attualmente sono supportati S3 e MongoDB come servizi di storage.

### Static Files Service ###

Il microservizio è responsabile dell'hosting e della fornitura di file statici e di secure header configuation.

### Notification Service ###

Questo microservizio consente di inviare notifiche push ai client Android e iOS.
Esso dipende da due raccolte CRUD, i cui nomi di percorso e proprietà possono essere per lo più configurati, per convenzione interna sono chiamati **devices** e **notifications**.
[Qui puoi trovare tutte le informazioni per configurarlo](\runtime_suite/push_notifications_platform_4.md)

#### Mail Notification Service ##

Questo microservizio consente di inviare e-mail tramite AWS SES e SMTP

### SDK Mobile ###

Mia-Platform fornisce un SDK che funziona come intermediario per consentire le interazioni tra l'applicazione e la piattaforma.

Mia fornisce due SDK:

1. iOS SDK: [Leggi come configurarlo](\runtime_suite/sdk_ios.md)
2. Android SDK: [Leggi come configurarlo](\runtime_suite/sdk_android.md)

## Data Management ##

### SQL Generic Reader ###

### CQRS/Event Source Data Management ###

### GraphQL Gateway ###

### ETL Adapters ###

### Secure Data Exchange Service ###

Con questo microservizio è possibile associare dei token ad un payload, verificare la correttezza del token e configuare le impostazioni sul token (scadenza, numero di chiamate possibili ecc).
Grazie a questo microservizi si possono rendere sicuri gli scambi di dati tra fornitori o servizi.

### Soap To Rest ###

Questa libreria fornisce agli sviluppatori alcune utilità per facilitare la conversione da SOAP a REST.
A partire dal describe.json generato dal node-soap client, la libreria crea schemi JSON di richiesta e risposta per ogni operazione wsdl.

## M2M

### Stream-Processing###

### ChatBot (DialogFlow)

### IoT Gateway (MQTT)

### Payment Gateway

## API Automation

### Cronjobs Microservices ###

Il microservizio è responsabile della gestione degli script di cron all'interno della piattaforma.
[A questo link tutte le regole per configurarlo](\runtime_suite/cron.md)

### API workflow (API BPM, business process Management) ###

### API Distributed Transaction

# Security #

## Access Management ##

### Auth Service ###

Il microservizio di Auth è responsabile della gestione dell'autenticazione e della registrazione di un nuovo utente sulla piattaforma.
Il microservizio gestisce inoltre tutte le integrazioni con servizi di autenticazione esterni:
* OAuth2
* Social Auth (Facebook e Google)
* OAM
* LDAP

### ACL ###

Il microservizio di ACL è un hook di `PRE` il cui scopo è applicare regole di ACL per ogni richiesta per indicare al CRUD Service quali righe o colonne filtrare.
Queste regole di ACL si basano sull'utente corrente e sui suoi gruppi di appartenenza.

Attualmente due tipologie di ACL sono previste dal servizio:

- *ACL per righe*: prepara una query che filtrerà i documenti sulla base dell'utente corrente (ad esempio per mostrare soltanto i documenti creati dall'utente).
- *ACL per colonne in lettura*: permette di limitare i campi che l'utente può vedere nella risposta sulla base della sua appartenenza a gruppi e del tipo di cliente.

Questo servizio agisce tramite la lettura e scrittura di header http. Infatti le informazioni su utente e gruppi sono recuperate da header, ed il risultato della applicazione delle regole è la scrittura di header di ACL che il CRUD Service è in grado di interpretare per eseguire effettivamente i filtri.

### Session Manager ###

Il microservizio di Session Manager gestisce la sessione degli utenti all'interno della piattaforma, salvando le informazioni in sessione e gestendo Cookies e JSON Web Token.   

Il Session Manager collabora inoltre con i servizi di gestione dell'utente per la parte di autenticazione. Il controllo che questo microservizio fa attualmente è piuttosto sofisticato e l'espressione logica valuta più parametri:

1. il **gruppo**, una variabile che identifica il gruppo a cui appartiene chi fa la chiamata. Il gruppo deve essere scritto come “groups.nomegruppo”. Per maggiori informazioni vedi il seguente [link](https://docs.mia-platform.eu/configurator/conf_cms/#5-controllo-accessi-sui-gruppi-acl-sui-gruppi).

2. **isBackOffice**, una variabile booleana che valuta se la chiamata viene dal Back-Office oppure no.

3. **clientType**, che identifica da dove arriva la chiamata (ex. CMS, sito, ...).

### User Service ###

Il microservizio di User è respoansabile della gestione degli Utenti nella Piattaforma.
Permette la Login, la registrazione e la richiesta delle informazioni realtive a un utente.

Dialoga con i componenti: Auth, Session Manager, Email Service, Credential per garantire sicurezza e per permettere numerose configurazioni in base alle esigenze dei clienti.

Al microservizio possono anche essere aggiunte delle **user-properties** per arricchire l'utente di tutte le informaizoni necessarie ai servizi.

### Credential Service ###

Credential Service è il microservizio che collabora con user per la login e la registrazione degli utenti. é responsabile infatti di gestire le credenziali degli utenti.

Il microservizio è inoltre responsabile della gestione dei gruppi.

### Swagger Aggregator ###

Questo microservizio è responsabile di aggregare i singoli swagger di tutti i microservizi indicati nella configurazione.
Raccoglie tutti i percorsi dagli swagger dei microservizi specificati e li mostra tutti in un'unica pagina di swagger.
Poiché i microservizi non sono a conoscenza dei prefissi url anteposti dai gateway, questo servizio può essere configurato per correggere i percorsi di swagger con il prefisso corretto.
Infine controlla i duplicati nelle coppie del percorso (ad esempio due microservizi rispondono a GET / prefisso / me), segnalando questo con un errore.
[A questo link tutte le regole per configurarlo](\runtime_suite/swagger_conf.md)

### PDF Service ###

Questo plugin fornise un modo semplice per generare file PDF da un modello HTML iniziale. Questo servizio si basa sulla libreria [Puppeteer](https://github.com/GoogleChrome/puppeteer).
Se si utilizza questo servizio nel proprio computer, è molto importante impostare la variabile di ambiente DOCKER su false.

### Pingator ###

Pingator è un servizio che monitora lo stato dei servizi per controllare che siano attivi.
Permette quindi di monitorare lo stato di un servizio offrendo un set di allarmi per il monitoraggio.

### v1Adapter ###

Questo microservizio permette di utilizzare il CMS con il nuovo servizio di CRUD Service, traducendo le richieste dal CMS in chiamate HTTP adattate alla nuova interfaccia.
Oltre al mapping delle rotte http, si occupa anche della conversione dei tipi (ad esempio date e coordinate geografiche), e della trasformazione da sync e trash al nuovo stato e vice versa.

### CMS Backend ###

Microservizio che serve per configurare il CMS per mostrare sia collezioni sul BAAS 3 che collezioni gestite dal nuovo CRUD Service.
