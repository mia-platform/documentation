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

L’utente potrà aggiungere una nuova riga selezionando "aggiungi riga". Dopodichè dovrà completare i seguenti campi:

**Nome**: va inserito il nome della proprietà, in camelCase, nel nostro caso inseriremo “titolo”, "autore", "anno" etc.

**Tipo**: le proprietà possono essere di diversi tipi: string se è una classica stringa di testo; number se è un numero; date se è una data con gg/mm/aaaa; boolean se può essere solo true o false;Geopoint se si desidera salvare un luogo preciso; Array se si desidera salvare come un insieme ordinato di proprietà; Object se si desidera inserire un oggetto.

Se selezioni **required** la proprietà è obbligatoria.

Se selezioni **crypted** il dato verrà criptato nel database. Consigliamo di adottare questa pratica per dati sensibili o riservati.

Se selezioni **nullable** è possibile dare al dato il valore null.

Nel campo **descrizione** è possibile inserire una breve descrizione.

Per creare la collezione selezionare **crea**. **(NB: la collezione non è ancora salvata è necessario svolgere i passaggi descritti di seguito)**

Se si desidera eliminare una riga selezionare la riga e selezionare **cancella** (vicino ad aggiungi riga).

Una volta creata la riga di default viene data la possibilità all'utente di crearne un'altra. Una volta finito di creare tutte le righe necessarie, è sufficente premere un qualsiasi altro punto dello schermo per uscire dalla sezione "aggiungi riga".

Per modificare una collezione è sufficiente selezionare la collezione desiderata tra l’elenco in “collection” e modificare i campi nella schermata che viene visualizzata.

####Indici
Un indice (nel campo dei database) è una struttura dati realizzata per migliorare i tempi di ricerca (query) dei dati. Se una tabella non ha indici, ogni ricerca obbliga il sistema a leggere tutti i dati presenti in essa. L'indice consente invece di ridurre l'insieme dei dati da leggere per completare la ricerca.

Per creare un nuovo indice selezionare **crea un nuovo indice**.

Una volta inserito il nome dell'indice l'utente dovorà scegliere il tipo selezionando tra: normal, geo e hash. Dopodichè l'utente potrà scegliere se rendere unico l'indice selezionando "unique".

##Servizi
In questa sezione l'utente può configurare i propri servizi.

I servizi possono essere: servizi esterni che si vogliono integrare nella piattaforma o servizi ccustom plugin configurato dall'utente su git.

Se viene scelto un custom service indica l’url di Git nel quale hai configurato il tuo custom plugin che vuoi rilasciare sulla piattaforma, indica il branch di Git da cui recuperare le configurazioni e se hai già scritto le configurazioni di K8S su Git non dovrai flaggare il componente, altrimenti ti verrà data la possibilità di impostare le variabili successivamente.

Per creare il servizio infine selezionare **crea**

##Decorators
In questa sezione l'utente potrà configurare i pre e post hook.

Per aggiungere ad esempio un pre Hook, selezionare "PRE", ed inserire: nome, protocollo, servizio, porta, path ed evenutale descrizione. Dopodichè selezionare crea.

##Creare un endpoint
In questa sezione potrai configurare i tuoi servizi e le tue collezioni in endpoint pubblicati all’esterno.

Per creare un endpoint selezionare “Endpoints” e quindi “Add new”.

**Basepath**: è il prefisso della rotta. Si può impostare come l'indirizzo base alla quale è servita l'Api, relativo all'host (nome o ip) che fornisce l'endpoint. Nel nostro caso ad esempio potremmo inserire “/libri”.

**Type**: L’endpoint può essere di diversi tipi:

Crud: aggancia il tuo endpoint direttamente ad una delle tue collezioni.

External: aggancia il tuo endpoint a uno dei servizi esterni censiti nella sezione servizi.

Custom  Microservices: aggancia il tuo endpoint ad un servizio con logiche interamente create da te.

BaaS Legacy: aggancia il tuo endpoint a un servizio presente nel BaaS legacy così da sfruttarlo sulla nuova piattaforma.

**Collezzione**: selezionare la collezione di cui l'endpoint fa parte. Nel nostro caso "editori"

**Description**: descrizione facoltativa dell’endpoint

Selezionare la collezione di riferimento, nel nostro caso potra essere "ciblioteca"-

Dopodichè selezionare “Crea”. Verrà visualizzata una schermata con le seguenti:

####Nome dell'Endpoint /nome/
**Stato di Default**: Con Default State potrai scegliere se gli elementi presenti nella Collezione saranno resi pubblici sugli applicativi appena verranno creati e avranno quindi status Public o se avranno invece come status Draft e dovranno quindi essere resi pubblici dal CMS prima di essere pubblicati.

**Collezione**: viene visualizzata la collezione di cui l'endpoint fa parte.

**Descrizione**: breve descrizione facoltativa

####Gestisci la sicurzza dei tuoi endpoint
Se la rotta è **pubblica**, non c’è bisogno di essere loggati per poterla chiamare. Se invece non è pubblica e viene chiamata da un utente non loggato, restituisce 401.
Se è **secreted** per poterla chiamare bisogna settare l’header Secret con il valore corretto (puoi vedere i secret nell’omonima schermata)

**Gruppi di utenti che vi possono accedere**: E’ un’espressione logica per determinare i gruppi che hanno i permessi di chiamare una determinata rotta. Può anche essere impostata a 0 (nessuno) oppure a 1 (tutti). Se l'espressione risulta vera, allora l'utente può accedere alla rotta.

####Eleneco verbi
Selezionando i diversi verbi nella sezione management è possibile dettagliare ulteriormente chi ha i permessi di fare determinate azioni.

Se **inherited** è attivo il campo erediterà il comportamento dell’endpoint base, de-selezionandolo puoi impostare regole specifiche legate a questa rotta.

Per esempio possiamo impostare che la post può essere riservata solo ad un gruppo specifico di utenti.  

##Secret
Da questa pagina è possibile definire la "secret" per accedere al CMS dei diversi progetti.

##CMS
Per visualizzare la nuova collezione sul CMS bisogna selezionare a sinistra “CMS” e selezionare “Add category” o “Add Page” a seconda delle esigenze.

Una **categoria** ti permette di raggruppare più pagine all’interno del tuo CMS, come nel nostro caso "biblioteca" in cui potremmo avere diverse collezioni come "libri", "dvd", "audiolibri" etc. Organizza le categorie in modo semplice per trovare facilmente tutto quelli di cui hai bisogno. L’ordinamento impostato qui è quello che viene usato nel CMS.

Per creare una nuova **pagina** bisogna inserire:

**Name**: inserire il nome della categoria che verrà visualizzato nel CMS, nel nostro caso "Libri".

**Endpoint**: selezionare l’endpoint di riferimento (libri)

**Category**: selezionare la categoria di cui farà parte (biblioteca)

**Icon**: nel campo icon puoi scegliere con quale icona caratterizzare la tua collezione. Abbiamo una liberira di icone dalle quali potrai scegliere.

**Order**: ordine di visualizzazione all'interno della category.

####Impostazione Generali della Pagina
**Layout**: selezionare il layout che si desidera. Table è la modalità di visualizzazione più classica a tabella. TableUser è la modalità di visualizzazione per gli utenti. Ha infatti un campo speciale Reset Password all'inizio della tabella. TablePush invece è la tabella perfetta per le push notification o per inviare notifiche ai clienti. A fianco della tabella troverai sempre un tasto Push per inviare il contenuto ai tuoi clienti. Se selezioni Card ogni oggetto sarà rappresentato simile a una Card. Gallery è invece la rappresentazione perfetta per le immagini.

**Evidenzia un campo**: alcune proprietà possono essere grassettate se sono di tipo booleano.

**Default delete**: ti permette di eliminare definitivamente un elemento una volta che verrà cancellato anche dal Trash del CMS.

**Blocca**: se blocchi la collezione impedirai agli utenti del CMS di aggiungere degli elementi

**Nascondi**: se selezionato nasconde la collezione nel CMS.

**Applica un filtro**: filtro di visibilità

Dopo aver compilato i campi richiesti per creare la pagina selezionare “Crea”.

Selezionando una pagina possiamo cambiarne le singole proprietà cliccando “Go to properties”

####Go to properties:
Selezioniamo ad esempio la proprietà "titolo" che abbiamo creato in precedenza. Di questa proprietà potremmo andare a modificare:

**Tipo di interfaccia**: come spiegato in precedenza con questa funzione si può cambiare il tipo: stringa, date, geopoint etc.  

**Etichetta**: nel campo label dovrai invece inserire la data nel campo il tipo sia date, lo zoom nel caso il tipo sia Geopoint, il nome che vorresti che apparisse nel CMS nel caso l'utente abbia selezionato un altro tipo.   

**Descrizione**: possibilità di inserire una breve descrizione

**Ordine**: ordine di visualizzazione della proprietà nella collezione

**Visibilità**: Con questa funzionalità puoi controllare quando rendere visibile la tua proprietà. Puoi controllare la visibilità sia in fase di creazione di un nuovo elemento: es vedo la proprietà “allergie” solo se ho selezionato prima che sono allergico a qualcosa. Oppure puoi controllare la visibilità in fase di modifica di un elemento.

###Controlla con dei filtri la visibilità delle tue proprietà
**Property Name** Seleziona la proprietà che controlla la tua visibilità in fase di creazione.

**Comparator** Seleziona la proprietà che controlla la tua visibilità in fase di creazione.

**Value** Imposta il valore per controllare la visibilità

##Deploy
L’API console permette di deployare direttamente senza più passare tramite Jenkins.

L'utente dovrà selezionare l'ambiente (produzione o preproduzione) e il branch.

##Documentazione
Questa sezione contiene il link a Swagger

##Monitoraggio
Questa sezione contiene il link a Kibana



Una volta effettuate le modifiche è **NECESSARIO SALVARE**
