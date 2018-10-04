## REST API ##
#**Mia-Platform REST Vademecum**


REST è uno **stile architetturale per i sistemi distribuiti**, che consente di esporre risorse attraverso una o più rotte HTTP/HTTPS.

Deve rispettare le seguenti caratteristiche:

* Client–server architecture

* Stateless

* Cacheability

* Layered system

* Uniform interface

Questo vademecum riassume i principi e le linee guida per il design di API REST.


##**CRUD RISORSA**
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

**PATCH**

https://api.mia-platform.it/vehicles/{id}

Modifica parziale del veicolo con id={id}

**DELETE**

https://api.mia-platform.it/vehicles/{id}

Cancellazione del veicolo con id={id}


##**NOMENCLATURA E FORMATTAZIONE**
Come chiamare e formattare rotte, parametri di query e proprietà del modello.

https://api.mia-platform.eu/vehicles/?city=Milan


##**ROTTE**
* Nomi in inglese

* Nomi in plurale

* Nomi in minuscolo

* Separazione delle parole tramite trattino ‘-’

##**PARAMETRI DI QUERY E MODELLO DATI**
* Nomi in inglese

* Nomi in formato ‘camelCase’

!!! warning
    Gli URL devono contenere solo risorse (nomi) e non azioni o verbi!


##**VERSIONAMENTO**
Il versionamento delle API REST viene fatto inserendo la versione nel path. Esempio: http://api.mia-platform.it/progetto/v1/api-del-progetto

##**MODELLO DATI**
Il modello dati viene scambiato nel body dei messaggi HTTP ed è serializzato usando il formato JSON (http://www.json.org/).

**GET**

https://api.mia-platform.it/vehicles/

Array di oggetti JSON

**POST**

https://api.mia-platform.it/vehicles/

Richiesta: oggetto JSON

Risposta: oggetto JSON

**PUT**

https://api.mia-platform.it/vehicles/{id}

Richiesta: oggetto JSON

Risposta: oggetto JSON

**PUT**
https://api.mia-platform.it/vehicles/bulk

Richiesta: Array di oggetti JSON

Risposta: Array di oggetti JSON

**PATCH**

https://api.mia-platform.it/vehicles/{id}

Richiesta: oggetto JSON

Risposta: oggetto JSON

**PATCH**

https://api.mia-platform.it/vehicles/bulk

Richiesta: Array di oggetti JSON

Risposta: Array di oggetti JSON

**DELETE**

https://api.mia-platform.it/vehicles/{id}

Richiesta: Body vuoto

Risposta: Body vuoto


##**ESITO RISPOSTA**
L’esito di una chiamata viene comunicato tramite HTTP status code (RFC 2616).

**2xx**

Successo, solitamente 200, 201 (nuovo documento creato), 204 per body vuoto

**3xx**

Reindirizzamento

**4xx**

Errore applicativo, 400 sintassi errata, 401 necessaria autenticazione utente, 403 richiesta non permessa (possibile anche con utente autenticato), 404 risorsa non trovata, 422 semanticamente errata.

**5xx**

Errore del server: in questo caso è presente una situazione inaspettata, non gestibile a livello di backend o volutamente non gestita.


Il body contiene il modello dati nel caso di 2xx o, negli altri casi, un messaggio che descriva in modo particolare lo status code restituito.
