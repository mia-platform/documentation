##Servizi
In questa sezione l'utente può configurare i propri servizi.

I servizi possono essere di due tipi:

* servizi esterni che si vogliono integrare nella piattaforma
* servizi custom plugin configurati dall'utente su git.

**Servizi esterni**: L'utente ha la possibilità di chiamare servizi esterni come ad esempio Google Maps.
In questo caso l'utente dovrà inserire il nome del servizio, selezionare tipo *external services* e inserire l'URL del servizio esterno desiderato. Infine l'utente può inserire una descrizione facoltativa.

![Services](img/Services.PNG)

**Servizi custom**: I servizi custom sono di due tipi:

* *Already exist*: il servizio è già esistente e quindi l'utente dovrà chiamare il servizio indicando l'url da git.
* *Generate*: l'utente crea il suo servizio custom.

In entrambi i casi l'utente può configurare servizi di tipo:

* *Avanzato*: l'utente deve sempre inserire l'url di git e la revision, dopodichè deve assicurarsi che nella cartella configurazione ci siao due file: deployment.yml e services.yml. Oltre a questi opzionalmente ci può essere il file configmap.yml.
* *Non avanzato*:  l'utente deve specificare l'url di GIT e la revision. Dopodichè è necessario assicurarsi che dentro la cartella configurazione ci sia il file Docker image che contiente il nome dell'immagine docker del servizio.
Inoltre è possibile aggiungere delle variabili ambientali.

**Importante** il nome viene dato al servizio sull'api console deve essere uguale al "name" che c'è nel file deployment.yml.

In caso il servizio sia di tipo *Generate*, l'utente deve inserire il gruppo di Gitlab su cui vuole generare il progetto, il nome, il nome immagine docker. Selezionado *crea* viene creata realmente la cartella su git (viene infatti richiesta un ulteriore autorizzazione all'utente).

Per creare il servizio infine selezionare **crea**.
