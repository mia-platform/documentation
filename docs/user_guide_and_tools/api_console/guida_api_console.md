#API Console  guida all'utilizzo#

Indice

[TOC]

##Registrarsi all'Api Console
Per registrarsi all'api console l'utente deve selezionare "Register", inserire un username, un indirozzo email, una password e il "gitlab user id".

Per ottenere il Gitlab user id l'utente deve accedere a Gitlab, cliccare l'icona in alto a destra e aprire settings. Accanto al nome è presente l'user ID che dovrà essere copiato e incollato nel modulo di registrazione dell'Api console.

##Accedere all'Api Console
Per accedere all’API Console è sufficiente collegarsi da un normale Browser all’indirizzo: https://console.cloud.mia-platform.eu/login

In questa schermata iniziale si deve inserire username e password.

Una volta effettuato il login si deve scegliere il progetto e il branch sul quale si vuole lavorare.

Il primo passaggio da fare subito dopo il login è il **“load”** per caricare eventuali modifiche apportate da altri utenti.

##Creare una nuova collezione
Immaginiamo di dover creare una nuova collezione che contenga i libri di una biblioteca e andiamo a capire quali sono i passagi da svolgere.

Per creare una nuova collezione bisogna selezionare “Collections” sulla sinistra e selezionare "Add new".

Per prima cosa è necessario inserire il nome della collezione in camelCase, nel nostro caso inseriremo "libri".

Di default ci sono dei campi che non possono essere modificati: _id, creatorId, createdAt, updaterId, updatedAt, _STATE_

L’utente dovrà compilare i seguenti campi:

**Name**: va inserito il nome della proprietà, in camelCase, nel nostro caso inseriremo “titolo”, "autore", "anno" etc.

**Type**: le proprietà possono essere di diversi tipi: string se è una classica stringa di testo; number se è un numero; date se è una data con gg/mm/aaaa; boolean se può essere solo true o false;Geopoint se si desidera salvare un luogo preciso; Array se si desidera salvare come un insieme ordinato di proprietà; Object se si desidera inserire un oggetto.

Se selezioni **required** la proprietà è obbligatoria.

Se selezioni **Crypted** il dato verrà criptato nel database. Consigliamo di adottare questa pratica per dati sensibili o riservati.

Se selezioni **nullable** è possibile dare al dato il valore null.

Nel campo **“Description”** è possibile inserire una breve descrizione.

La collezione viene creata in automatico non è necessario premere alcun tasto aggiuntivo. **NB: la collezione non è ancora salvata è necessario svolgere i passaggi descritti di seguito**

**Indexes**: questa sezione serve per velocizzare la ricerca  

Per modificare una collezione è sufficiente selezionare la collezione desiderata tra l’elenco in “collection” e modificare i campi nella schermata che viene visualizzata.


##Services
In questa sezione l'utente può configurare i propri servizi.

I servizi possono essere: servizi esterni che si vogliono integrare nella piattaforma o servizi ccustom plugin configurato dall'utente su git.

Se viene scelto un custom service indica l’url di Git nel quale hai configurato il tuo custom plugin che vuoi rilasciare sulla piattaforma, indica il branch di Git da cui recuperare le configurazioni e se hai già scritto le configurazioni di K8S su Git non dovrai flaggare il componente, altrimenti ti verrà data la possibilità di impostare le variabili successivamente.

##Creare un endpoint
In questa sezione potrai configurare i tuoi servizi e le tue collezioni in endpoint pubblicati all’esterno.

Per creare un endpoint selezionare “Endpoints” e quindi “Add new”.

**Basepath**: è il prefisso della rotta. Si può impostare come l'indirizzo base alla quale è servita l'Api, relativo all'host (nome o ip) che fornisce l'endpoint. Nel nostro caso ad esempio potremmo inserire “/libri”.

**Type**: L’endpoint può essere di diversi tipi:

Crud: aggancia il tuo endpoint direttamente ad una delle tue collezioni.

External: aggancia il tuo endpoint a uno dei servizi esterni censiti nella sezione servizi.

Custom  Microservices: aggancia il tuo endpoint ad un servizio con logiche interamente create da te.

BaaS Legacy: aggancia il tuo endpoint a un servizio presente nel BaaS legacy così da sfruttarlo sulla nuova piattaforma.

**Description**: descrizione facoltativa dell’endpoint

Selezionare la collezione di riferimento, nel nostro caso potra essere "ciblioteca"-

Dopodichè selezionare “Create +”.

Se selezionamo un endpoint già creato comparirà una scheda con i seguenti campi:

####Endpoint /nome/
**Default state**: Con Default State potrai scegliere se gli elementi presenti nella Collezione saranno resi pubblici sugli applicativi appena verranno creati e avranno quindi status Public o se avranno invece come status Draft e dovranno quindi essere resi pubblici dal CMS prima di essere pubblicati.

**Description**: breve descrizione facoltativa

####Management
**Route access security**: Se la rotta è pubblica, non c’è bisogno di essere loggati per poterla chiamare. Se invece non è pubblica e viene chiamata da un utente non loggato, restituisce 401. Se è secreted per poterla chiamare bisogna settare l’header Secret con il valore corretto (puoi vedere i secret nell’omonima schermata)

**User Group Permission**: E’ un’espressione logica per determinare i gruppi che hanno i permessi di chiamare una determinata rotta. Può anche essere impostata a 0 (nessuno) oppure a 1 (tutti). Se l'espressione risulta vera, allora l'utente può accedere alla rotta.

####Eleneco verbi
Selezionando i diversi verbi nella sezione management è possibile dettagliare ulteriormente chi ha i permessi di fare determinate azioni.

Se **inherited** è attivo il campo erediterà il comportamento dell’endpoint base, de-selezionandolo puoi impostare regole specifiche legate a questa rotta

##CMS
Per visualizzare la nuova collezione sul CMS bisogna selezionare a sinistra “CMS” e selezionare “Add category” o “Add Page” a seconda delle esigenze.

Una **categoria** ti permette di raggruppare più pagine all’interno del tuo CMS, come nel nostro caso "biblioteca" in cui potremmo avere diverse collezioni come "libri", "dvd", "audiolibri" etc. Organizza le categorie in modo semplice per trovare facilmente tutto quelli di cui hai bisogno. L’ordinamento impostato qui è quello che viene usato nel CMS.

Per creare una nuova **pagina** bisogna inserire:

**Name**: inserire il nome della categoria che verrà visualizzato nel CMS, nel nostro caso "Libri".

**Endpoint**: selezionare l’endpoint di riferimento (libri)

**Category**: selezionare la categoria di cui farà parte (biblioteca)

**Icon**: nel campo icon puoi scegliere con quale icona caratterizzare la tua collezione. Abbiamo una liberira di icone dalle quali potrai scegliere.

**Order**: ordine di visualizzazione all'interno della category.

####Impostazione CMS
**Layout**: selezionare il layout che si desidera. Table è la modalità di visualizzazione più classica a tabella. TableUser è la modalità di visualizzazione per gli utenti. Ha infatti un campo speciale Reset Password all'inizio della tabella. TablePush invece è la tabella perfetta per le push notification o per inviare notifiche ai clienti. A fianco della tabella troverai sempre un tasto Push per inviare il contenuto ai tuoi clienti. Se selezioni Card ogni oggetto sarà rappresentato simile a una Card. Gallery è invece la rappresentazione perfetta per le immagini.

**Highlight**: alcune proprietà possono essere grassettate se sono di tipo booleano.

**Default delete**: ti permette di eliminare definitivamente un elemento una volta che verrà cancellato anche dal Trash del CMS.

**Blocked**: se blocchi la collezione impedirai agli utenti del CMS di aggiungere degli elementi

**Hidden**: se selezionato nasconde la collezione nel CMS.

**Base Query**: filtro di visibilità

Dopo aver compilato i campi richiesti per creare la pagina selezionare “Create +”.

Selezionando una pagina possiamo cambiarne le singole proprietà cliccando “Go to properties”

####Go to properties:
Selezioniamo ad esempio la proprietà "titolo" che abbiamo creato in precedenza. Di questa proprietà potremmo andare a modificare:

**Interface Type**: come spiegato in precedenza con questa funzione si può cambiare il tipo: stringa, date, geopoint etc.  

**Label**: nel campo label dovrai invece inserire la data nel campo il tipo sia date, lo zoom nel caso il tipo sia Geopoint, il nome che vorresti che apparisse nel CMS nel caso l'utente abbia selezionato un altro tipo.   

**Description**: possibilità di inserire una breve descrizione

**Oder**: ordine di visualizzazione della proprietà nella collezione

**Visibility**: Con questa funzionalità puoi controllare quando rendere visibile la tua proprietà. Puoi controllare la visibilità sia in fase di creazione di un nuovo elemento: es vedo la proprietà “allergie” solo se ho selezionato prima che sono allergico a qualcosa. Oppure puoi controllare la visibilità in fase di modifica di un elemento.

###Add filter for the property visibility
**Property Name** Seleziona la proprietà che controlla la tua visibilità in fase di creazione.

**Comparator** Seleziona la proprietà che controlla la tua visibilità in fase di creazione.

**Value** Imposta il valore per controllare la visibilità


##Deploy
L’API console permette di deployare direttamente senza più passare tramite Jenkins.

##Documentazione
Questa sezione contiene il link a Swagger

##Monitoraggio
Questa sezione contiene il link a Kibana



Una volta effettuate le modifiche è **NECESSARIO SALVARE**
