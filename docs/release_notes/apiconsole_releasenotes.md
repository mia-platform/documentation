#Piattaforma Release Note
##v.4.15.0 (Jan 16, 2019)
Novità:

* Abbiamo ristilizzato l'area dei servizi con **l'introduzione della possibilità di aggiungere dei template custom**

* Abbiamo **risitlizzato l'area di deploy** e **l'header** dell'appliczione

* Abbiamo abilitato la possiblità di scrivere delle **query complesse** per filtrare le singole **proprietà nel CMS**


##v4.14.0 (Dec 18, 2018)
* Evoluzioni nell'area di configurazione del CMS:
    * è possibile **evidenziare dei campi nella tabella impostando una query**, il colore di background e il colore del testo. Questo permetterà di avere da parte dell'utente del CMS evidenziati i dati più siginificativi.
    * abbiamo anche rilasciato la possibilità di **configurare delle notifiche nel menù del cms**. Basterà attivare le notifiche e scegliere la query sui dati che si vuole visualizzare. In questo modo comparirà un badge a fianco alla pagina in cui avete attivato le notifiche che conterà gli elementi presenti in quella collezione in base alla vostra query.

* Abbiamo impostato la **cancellazione** delle dipedenze anche per quanto riguada la cancellazione dei decoratori all'interno delle are di **Pre e Post Hook**.

* Abbiamo ristilizzato l'header del sito per consentire all'utente una migliore consapevolezza del progetto e del branch in cui sta lavorando.

* è possibile iniziare la **creazione di un progetto dall'home page**. Grazie a questa nuova funzionalità verrà creato un progetto su GitLab vuoto e verrà aggiunto al DB dell'API Console.

**Evoluzione nell'import del CMS. - v7.0.16**

Da oggi se viene importato un file con id già esistenti, i dati non vengono duplicati, ma aggiornati.
Se l'id non esiste invece viene creato un nuovo dato.

!!! warning
    Se viene passato un id sbagliato fallisce l'intero import.

## v4.13.0 (Nov 14, 2018)  
### Breaking change api-console-configuration v0.3.0

Abbiamo rilasciato i seguenti aggiornamenti:

* **nuova versione di api-console-configuration** che è passato dalla v0.2.0 alla v0.3.0.  
In questa nuova configurazione sono state aggiunte le seguenti novità:
        * supportiamo l'**ultima versione del CRUD** con l'aggiunta di due nuove rotte: PATCH/ e POST/upsert-one;
        * abbiamo reso possibile **editare il nome della categoria e della Pagina nel CMS**.

* abbiamo inoltre abilitato la **cancellazione degli analitici** e fatto un fix sui filtri.

##v.4.12.0 (Oct 31, 2018)

Con la versione 0.14 abbiamo rilasciato due aggiornamenti:

* **è stato risolto il conflitto tra due persone che lavorano sullo stesso branch**. Se due persone lavorano sullo stesso branch, il secondo che prova a committare viene ora bloccato. Gli compare infatti un messaggio di errore al commit. Lo sviluppatore può però nella pagina di salva cambiare il branch da rilasciare e creare un branch dal suo commit. In questo modo può visualizzare le sue configurazioni su un nuovo branch.

* Sono state create **due nuove interfaceType** per supportare gli oggetti e gli array nella sezione del CMS:
       * rawobject
       * rawarray
Con queste interfacce è possibile modificare direttamente l'oggetto e l'array in formato json.

**CMS - v.7.0.14**

Abbiamo rilasciato le seguenti funzionalità:

* gestione delle **nuove interfacce rawObject e rawArray**
* **cambio delle etichette** nelle azioni di Pubblica ed Elimina
* fix alla gestione delle **icone**
* **ACL sui gruppi** che possono accedere al CMS. A questo [link](https://docs.mia-platform.eu/configurator/conf_cms/#5-controllo-accessi-sui-gruppi-acl-sui-gruppi) si trova come configurare questa estensione del CMS.

##v.4.11.0 (Oct 23, 2018)

In questa versione abbiamo rilasciato l'**aggiornamento al session manager** e alla nuova acl expression syntax e abbiamo effettuato dei fix sulla configurazione degli analitici.

##v. 4.10.0 (Oct 10, 2018)  
### Configurazione Analitici

Con la versione 0.12.0 sarà possibile **configurare gli analitici da API Console**.
A questo [link](https://docs.mia-platform.eu/configurator/api_console_configanalytics/) la documentazione su come è possibile configurarli.

E' stata inoltre rilasciata la possibilità di impostare un acl ai gruppi che accedono alle pagine del CMS. In questo modo alcune pagine possono essere viste solo da alcuni gruppi di utenti.

**CMS - v.7.0.11**

In questa versione del CMS è possibile selezionare le **icone da font-awesome fino alla versione v.5.3.1**, che è l'ultima versione supportata (qui si trova il [link](https://fontawesome.com/icons?d=gallery) per le icone).

!!! warning
    Se si scelgono icone che erano già utilizzate nella versione precedente, si continueranno a visualizzare nel CMS le icone vecchie. Questo perchè si dà priorità alla retrocompatibilità.

## v.4.7.0 (Sept 30, 2018)

**CMS v7.0.4**

In questa versione sono state rilasciate delle nuove personalizzazioni del CMS.

Sarà infatti possibile definire le seguenti variabili di css:

* color brand gradient 1= permette di personalizzare il colore del **testo nella sidebar del menù**
* color badge - bg notification= permette di personalizzare il **background color dei badge delle notifiche**
* color badge - text notification= permette di personalizzare il colore del **testo del badge delle notifiche**

Inoltre da questa versione il font del CMS sarà in **Proxima-nuova**


**CMS v7.0.0 - Breaking Change (per le Card)**
Con la versione 7 sono state rilasciate 3 funzionalità importanti:

1) la **nuova struttura delle Card** con la possibilità di configurare diversi tipi di widget e avere una struttura interamente personalizzabile. Puoi leggere la Documentazione su come configurare le nuove card [qui](https://docs.mia-platform.eu/configurator/conf_cms/#1-configurare-le-card).

2) la funzione di **highlight** è evoluta. Con questa versione è possibile evidenziare delle righe del CMS scrivendo una query e l'utente può configurare anche i colori per evidenziare la riga (colore del testo e dello sfondo). A questo [link](https://docs.mia-platform.eu/configurator/conf_cms/#3-configurare-gli-highlight) un esempio di highlight.

3) è stata aggiunta la possbilità di avere delle **notifiche** nel menù. Leggere a questo [link](https://docs.mia-platform.eu/configurator/conf_cms/#2-configurare-le-notifiche) la documentazione per visualizzare un esempio.


**CMS v6.1.0**

Con la versione 6.1.0 abbiamo rilasciato nuove funzionalità nell'area export del CMS.
Da questa versione sarà infatti possibile:

1. **Scegliere se esportare la label o l'id**:  quando esporterai un file visualizzerai un caso le tue proprietà con l'id in un altro con la label. Quesat funzionalità ti permette di avere dei file più leggibili qualora gli id non fossero chiari.
2. **Scegliere il delimitatore**: potrai scegliere se esportare un file con delimitatore la , o il ; . Questa funzionalità permette a chi utilizza excel di avere una conversione immediata da .csv a excel
