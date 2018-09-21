## REST API ##
#Mia-Platform REST Vademecum


REST è un tipo di architettura software per i sistemi distribuiti. In un’architettura REST, un insieme di **servizi** rendono disponibili un insieme di **risorse**, servendole su una una o più **rotte**.
Questo vademecum riassume i principi e le linee guida per il design di API REST.

##CRUD RISORSA
Un esempio di REST per la risorsa veicolo

**GET**

https://api.mia-platform.it/vehicles/

Lista di tutti i veicoli. Filtri tramite i parametri di query

**POST**

https://api.mia-platform.it/vehicles/

Inserimento nuovo veicolo

**PUT**

https://api.mia-platform.it/vehicles/{id}

Modifica completa del veicolo con id={id}

**PUT**

https://api.mia-platform.it/vehicles/bulk

Modifica massiva e completa dei veicoli specificati nel body

**PATCH**

https://api.mia-platform.it/vehicles/{id}

Modifica parziale del veicolo con id={id}

**PATCH**

https://api.mia-platform.it/vehicles/bulk

Modifica massiva e parziale dei veicoli specificati nel body

**DELETE**

https://api.mia-platform.it/vehicles/{id}

Cancellazione del veicolo con id={id}


##NOMENCLATURA E FORMATTAZIONE
Come chiamare e formattare rotte, parametri di query e proprietà del modello.

https://api.mia-platform.it/crash-reports/?city=Milan


##ROTTE
* Nomi in inglese

* Nomi in plurale

* Nomi in minuscolo

* Separazione delle parole tramite trattino ‘-’

##PARAMETRI DI QUERY E MODELLO DATI
* Nomi in inglese

* Nomi in formato ‘camelCase’


##VERSIONAMENTO
Il versionamento delle API REST viene fatto inserendo la versione nel path. Esempio: http://api.mia-platform.it/progetto/v1/api-del-progetto

##MODELLO DATI
Il modello dati viene scambiato nel body dei messaggi HTTP ed è espresso in JSON.

**GET**

https://api.mia-platform.it/vehicles/

Array di oggetti JSON

**POST**

https://api.mia-platform.it/vehicles/

Oggetto JSON

**PUT**

https://api.mia-platform.it/vehicles/{id}

Oggetto JSON

**PUT**
https://api.mia-platform.it/vehicles/bulk

Array di oggetti JSON

**PATCH**

https://api.mia-platform.it/vehicles/{id}

Oggetto JSON

**PATCH**

https://api.mia-platform.it/vehicles/bulk

Array di oggetti JSON

**DELETE**

https://api.mia-platform.it/vehicles/{id}

Body vuoto sia per la richiesta che per la risposta

##ESITO RISPOSTA
L’esito di una chiamata viene comunicato tramite HTTP status code (RFC 2616).

**2xx**

Successo, solitamente 200, 204 per body vuoto

**3xx**

Reindirizzamento

**4xx**

Errore applicativo, 400 richiesta errata, 401 necessaria autenticazione utente, 403 richiesta non permessa, 404 risorsa non trovata, 422 validazione semantica fallita.

**5xx**

Errore del server

Il body contiene il modello dati nel caso di 2xx o, negli altri casi, un messaggio che descriva in modo particolare lo status code restituito.

##BACK-END FOR FRONT-END
Come distinguere le API specifiche per le funzionalità di front-end (BFF) dalle API di back-end (BE)?

I front-end sono rilasciati in un dominio differente dal dominio delle API di BE. Le API del BFF sono rilasciate sotto lo stesso dominio dell’applicazione front-end.

https://cms.mia-platform.it/

Esempio FE

https://cms.mia-platform.it/api/agencies/

Esempio BFF

https://api.mia-platform/agencies/

Esempio BE
