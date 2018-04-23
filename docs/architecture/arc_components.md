## Componenti ##
Qui potrai trovare l'elenco  dettagliato dei componenti che costituiscono Mia-Platoform.

### API Gateway ###

L'API Gateway è il microservizio responsabile del routing delle richieste verso il servizio corretto.
Inoltre è anche responsabile della autenticazione, esegue il controllo di accesso e il rate limiting.

Il servizio è composto a default da server nginx multipli, 2 in ascolto sulle porte 80 ed 8080, 4 in ascolto su socket unix per ritornare i messaggi di errore.

La porta 80 è utilizzata per il routing applicativo, mentre per quello di backoffice è esposto alla 8080.


A questo [link](https://git.tools.mia-platform.eu/platform/core/api-gateway) si può trovare il link al progetto e il relativo README.

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
 
Anche in questo caso le regole da applicare sono specificate in configurazione. Per approfondire come configurare il servizio, fare riferimento alla [pagina](https://git.tools.mia-platform.eu/platform/core/acl-service) del progetto. 

### CRUD Service ###

### Files ###

### Resources ###

### Pingator ###
