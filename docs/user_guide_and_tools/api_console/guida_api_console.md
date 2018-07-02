API Console  guida all'utilizzo

[TOC]

#Accedere all'Api Console

Per accedere all’API Console è sufficiente collegarsi da un normale Browser all’indirizzo: https://console.cloud.mia-platform.eu/login

In questa schermata iniziale dovrai inserire username e password, dopodichè si dovrà scegliere il progetto sul quale si vorrà andare a lavorare e il branch su cui si vuole lavorare.


Il primo passaggio da fare subito dopo il login è il **“load”** per caricare eventuali modifiche apportate da altri utenti.

#Creare una nuova collezione

CREARE UNA NUOVA COLLEZIONE
Per creare una nuova collezione bisogna selezionare “Collections” sulla sinistra e selezionare Add new.
Ti verrà richiesto di scegliere il nome della collezione ad esempio “libri”.
Di default ci sono dei campi che non possono essere modificati: _id, creatorId, createdAt, updaterId, updatedAt, _STATE_
L’utente dovrà compilare i seguenti campi:
**Name**: va inserito il nome della proprietà, in camelCase. Nel nostro caso sarà “titolo”.
**Type**: le proprietà possono essere di diversi tipi: string se è una classica stringa di testo; number se è un numero; date se è una data con gg/mm/aaaa; boolean se può essere solo true o false;Geopoint se vuoi che salvi un luogo preciso; Array se lo vuoi salvare come un insieme ordinato di proprietà; Object se voglio inserire un oggetto.
Se selezioni **required** la proprietà è obbligatoria.
Se selezioni **Crypted** il dato verrà criptato nel database. Ti consigliamo di adottare questa pratica per dati sensibili o riservati.
Se selezioni **nullable** è possibile dare al dato il valore null.
Nel campo **“Description”** è possibile inserire una breve descrizione.

Per modificare una collezione è sufficiente selezionare la collezione desiderata tra l’elenco in “collection” e modificare i campi nella schermata che viene visualizzata.


#Services
In questa sezione potrai configurare i tuoi servizi.
I servizi possono essere o servizi esterni che vuoi integrare nella piattaforma o servizi custom progettati interamente da te.
L’endpoint può essere o un servizio esterno o un custom plugin configurato da te su git.
Se viene scelto un servizio esterno è necessario indicare l’url alla quale vuoi agganciare il tuo servizio esterno
Se viene scelto un custom service indica l’url di Git nel quale hai configurato il tuo custom plugin che vuoi rilasciare sulla piattaforma, indica il branch che di Git da cui recuperare le configurazioni e se hai già scritto le configurazioni di K8S su Git non dovrai flaggare il componente, altrimenti ti verrà data la possibilità di impostare le variabili successivamente.

#Creare un endpoint
In questa sezione potrai configurare i tuoi servizi e le tue collezioni in endpoint pubblicati all’esterno.
Per creare un endpoint selezionare “Endpoints” e quindi “Add new”.
**Basepath**: è il prefisso della rotta.Si può impostare come l'indirizzo base alla quale è servita l'api, relativo all'host (nome o ip) che fornisce l'endpoint. Nel nostro caso ad esempio potremmo inserire “/libri”.
**Type**: L’endpoint può essere di diversi tipi:
Crud: aggancia il tuo endpoint direttamente ad una delle tue collezioni
External: aggancia il tuo endpoint a uno dei servizi esterni censiti nella sezione servizi
Custom  Microservices: aggancia il tuo endpoint ad un servizio con logiche interamente create da te.
BaaS Legacy: aggancia il tuo endpoint a un servizio presente nel BaaS legacy così da sfruttarlo sulla nuova piattaforma
**Description**: descrizione facoltativa dell’endpoint

Selezionare la collezione di riferimento.

Dopodichè selezionare “create”.

**ENDPOINT**
**Default state**: Con Default State potrai scegliere se gli elementi presenti nella Collezione saranno resi pubblici sugli applicativi appena verranno creati e avranno quindi status Public o se avranno invece come status Draft e dovranno quindi essere resi pubblici dal CMS prima di essere pubblicati.
**Description**: breve descrizione facoltativa
Selezionando un endpoint si apre una scheda contenente le seguenti:

**MANAGEMENT**
**Route access security**: Se la rotta è pubblica, non c’è bisogno di essere loggati per poterla chiamare. Se invece non è pubblica e viene chiamata da un utente non loggato, restituisce 401. Se è secreted per poterla chiamare bisogna settare l’header Secret con il valore corretto (puoi vedere i secret nell’omonima schermata)
**User Group Permission**: E’ un’espressione logica per determinare i gruppi che hanno i permessi di chiamare una determinata rotta. Può anche essere impostata a 0 (nessuno) oppure a 1 (tutti). Se l'espressione risulta vera, allora l'utente può accedere alla rotta.

**ELENCO VERBI**
Selezionando i diversi verbi nella sezione management è possibile dettagliare ulteriormente chi ha i permessi di fare determinate azioni.
Se inherited è attivo il campo erediterà il comportamento dell’endpoint base, de-selezionandolo puoi impostare regole specifiche legate a questa rotta

#CMS

Per visualizzare la nuova collezione sul CMS bisogna selezionare a sinistra “CMS” e selezionare “Add category” o “Add Page” a seconda delle esigenze.
Una **categoria** ti permette di raggruppare più pagine all’interno del tuo CMS. Organizza le categorie in modo semplice per trovare facilmente tutto quelli di cui hai bisogno. L’ordinamento impostato qui è quello che viene usato nel CMS
Per creare una nuova **pagina** bisogna inserire:
**Name**: inserire il nome della categoria
**Endpoint**: selezionare l’endpoint di riferimento (libri)
**Category**: selezionare la categoria di cui farà parte (biblioteca)
**Icon**:Nel campo icon puoi scelgiere con quale icona caratterizzare la tua collezione. Abbiamo una liberira di icone dalle quali potrai scegliere.
**Order**: ordine di visualizzazione

**IMPOSTAZIONE CMS**
**Layout**: selezionare il layout che si desidera. Table è la modalità di visualizzazione più classica a tabella. TableUser è la modalità di visualizzazione per gli utenti. Ha infatti un campo speciale Reset Password all'inizio della tabella. TablePush invece è la tabella perfetta per le push notification o per inviare notifiche ai clienti. A fianco della tabella troverai sempre un tasto Push per inviare il contenuto ai tuoi clienti. Se selezioni Card ogni oggetto sarà rappresentato simile a una Card. Gallery è invece la rappresentazione perfetta per le immagini.
**Highlight**: alcune proprietà possono essere grassettate se sono di tipo booleano.
**Default delete**:ti permette di eliminare definitivamente un elemento una volta che verrà cancellato anche dal Trash del CMS.
**Blocked**: Se blocchi la collezione impedirai agli utenti del CMS di aggiungere degli elementi
**Hidden**: nascosto
**Base Query**:  filtro di visibilità
Dopo aver compilato i campi richiesti per creare la pagina selezionare “Create +”.

Selezionando una pagina possiamo cambiarne le proprietà cliccando “Go to properties”
**GO TO PROPERTIES:**
**Label**:Nel campo label dovrai invece inserire il nome che vorresti che apparisse nel CMS.  
Visibility: Con questa funzionalità puoi controllare quando rendere visibile la tua proprietà. Puoi controllare la visibilità sia in fase di creazione di un nuovo elemento: es vedo la proprietà “allergie” solo se ho selezionato prima che sono allergico a qualcosa. Oppure puoi controllare la visibilità in fase di modifica di un elemento.

**ADD FILTER FOR THE PROPERTY VISIBILITY**
Seleziona la proprietà che controlla la tua visibilità in fase di creazione.
Seleziona la proprietà che controlla la tua visibilità in fase di creazione.
Imposta il valore per controllare la visibilità


#DEPLOY

L’API console permette di deployare direttamente senza più passare tramite Jenkins.

#DOCUMENTAZIONE

Questa sezione contiene il link a Swagger

#MONITORAGGIO
Questa sezione contiene il link a Kibana


Una volta effettuate le modifiche è **NECESSARIO SALVARE** 
