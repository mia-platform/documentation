#Api Console Release Note

## v0.15.0 (Nov 14, 2018)  
### Breaking change api-console-configuration v0.3.0

Abbiamo rilasciato i seguenti aggiornamenti:

* **nuova versione di api-console-configuration** che è passato dalla v0.2.0 alla v0.3.0.  
In questa nuovo configurazione sono state aggiunte le seguenti novità:
        * supportiamo l'**ultima versione del CRUD** con l'aggiunte di due nuove rotte: PATCH/ e POST/upsert-one;
        * abbiamo reso possibile **editare il nome della categoria e della Pagina**.

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
