#Api Console Release Note

##v0.16.0 (Dec 18, 2018)
* Evoluzioni nell'area di configurazione del CMS:
    * è possibile **evidenziare dei campi nella tabella impostando una query**, il colore di background e il colore del testo. Questo permetterà di avere da parte dell'utente del CMS evidenziati i dati più siginificativi.
    * abbiamo anche rilasciato la possibilità di **configurare delle notifiche nel menù del cms**. Basterà attivare le notifiche e scegliere la query sui dati che si vuole visualizzare. In questo modo comparirà un badge a fianco alla pagina in cui avete attivato le notifiche che conterà gli elementi presenti in quella collezione in base alla vostra query.

* Abbiamo impostato la **cancellazione** delle dipedenze anche per quanto riguada la cancellazione dei decoratori all'interno delle are di **Pre e Post Hook**.

* Abbiamo ristilizzato l'header del sito per consentire all'utente una migliore consapevolezza del progetto e del branch in cui sta lavorando.

* è possibile iniziare la **creazione di un progetto dall'home page**. Grazie a questa nuova funzionalità verrà creato un progetto su GitLab vuoto e verrà aggiunto al DB dell'API Console.

## v0.15.0 (Nov 21, 2018)  
### Breaking change api-console-configuration v0.3.0

Abbiamo rilasciato i seguenti aggiornamenti:

* **nuova versione di api-console-configuration** che è passato dalla v0.2.0 alla v0.3.0.  
In questa nuova configurazione sono state aggiunte le seguenti novità:
        * supportiamo l'**ultima versione del CRUD** con l'aggiunta di due nuove rotte: PATCH/ e POST/upsert-one;
        * abbiamo reso possibile **editare il nome della categoria e della Pagina nel CMS**.

* abbiamo inoltre abilitato la **cancellazione degli analitici** e fatto un fix sui filtri.

##v.0.14.0 (Oct 31, 2018)

Con la versione 0.14 abbiamo rilasciato due aggiornamenti:

* **è stato risolto il conflitto tra due persone che lavorano sullo stesso branch**. Se due persone lavorano sullo stesso branch, il secondo che prova a committare viene ora bloccato. Gli compare infatti un messaggio di errore al commit. Lo sviluppatore può però nella pagina di salva cambiare il branch da rilasciare e creare un branch dal suo commit. In questo modo può visualizzare le sue configurazioni su un nuovo branch.

* Sono state create **due nuove interfaceType** per supportare gli oggetti e gli array nella sezione del CMS:
       * rawobject
       * rawarray
Con queste interfacce è possibile modificare direttamente l'oggetto e l'array in formato json.

##v.0.13.0 (Oct 23, 2018)

In questa versione abbiamo rilasciato l'**aggiornamento al session manager** e alla nuova acl expression syntax e abbiamo effettuato dei fix sulla configurazione degli analitici.

##v. 0.12.0 (Oct 10, 2018)  
### Configurazione Analitici

Con la versione 0.12.0 sarà possibile **configurare gli analitici da API Console**.
A questo [link](https://docs.mia-platform.eu/configurator/api_console_configanalytics/) la documentazione su come è possibile configurarli.

E' stata inoltre rilasciata la possibilità di impostare un acl ai gruppi che accedono alle pagine del CMS. In questo modo alcune pagine possono essere viste solo da alcuni gruppi di utenti.
