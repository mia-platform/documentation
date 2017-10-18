[TOC]

## Introduzione
Mia Platform integra un sistema di SSO, per cui due installazioni della piattaforma possono essere legate fra di loro
e tutti gli utenti che si registrano ad una di esse potrà automaticamente fare login anche sull’altra utilizzando le
stesse credenziali.

## Anatomia di `users`
`users` è l'endpoint REST che espone le funzionalità del SSO (Single Sign On) e su cui si può agire per modificare
le propietà dell’utente loggato in sessione.

Di default `users` si presenta con le seguenti propietà:
- Propietà di base
    - id
    - creatorId
    - createdAt
    - updatorId
    - updatedAt
    - sync
    - trash
- Propietà di user
    - email
    - username
    - groups
    - gravatar
    - globalId
    - news
    - validated
    - hasMadeAPurchase
    - firstPurchaseDate
    - prospectCreatedAt

Le propietà di base sono descritte nel capitolo dedicato alle API che si consiglia di leggere prima di proseguire,
visto che molti concetti non saranno ripetuti in questa guida; passiamo a descrivere le propietà aggiuntive di `user`:

- email: è l’email dell’utente che ha utilizzato per iscriversi
- username: un nome univoco dell’utente, se non necessario può essere inserito uguale alla email durante la registrazione
- groups: un array di stringhe che definisce i gruppi di cui un’utente fa parte, di default alla registrazione tutti
gli utenti fanno parte del gruppo speciale `users`
- gravatar: l’avatar dell’utente, di default viene popolato con un url generato automaticamente che punta al servizio
[Gravatar](https://gravatar.com/)
- globalId: l’id dell’utente per il servizio di SSO, questo id può essere utilizzato per riconoscere lo stesso utente
fra le varie installazioni che sono accumunate dalla stessa login
- news: un booleano che può essere utilizzato per salvare se l’utente ha dato o meno il suo consenso ad essere
contattato da operazioni di marketing
- validated: se l’utente ha validato l’email inserita in fase di registrazione
- hasMadeAPurchase: questo booleno può essere utilizzato per salvare se l’utente ha già eseguito una business logic
tale per cui si può considerare un’utente acquisito
- firstPurhcaseDate: questo campo contiene la data in cui l’utente ha effettuato la prima azione per essere considerato
un utente acquisito
- prospectCreatedAt: se le funzionalità di prospect sono attive per questa installazione, questo campo contiene la data
di quando un’utente è passato da essere un prospect ad essere un utente loggato

Dai campi descritti sopra si può vedere che di default la piattaforma detiene pochi dati personali dell’utente,
ma fornisce dei campi generici pronti per essere integrati nelle propie buisness logic per tracciare le sue azioni
all’interno della nostra installazione.

## Estendere `users`
Come ogni risorsa della piattaforma anche user può essere personalizzato, aggiungendo le delle propietà custom propie
dell’installazione. Questo vuol dire che fra due installazioni differenti legate insieme dalla SSO le propietà custom
possono essere diverse e non sono condivise, quindi entrambe le installazioni possono avere gli stessi campi custom con
valori differenti od avere propietà e/o tipo completamente diversi.

### Registrazione
Per registrare un nuovo utente basta semplicemente fare una `POST` a `/users` passando come JSON nel body almeno
le seguenti propietà:
- email
- username
- password
- news

Oltre a queste possono essere aggiunte tutte le propietà custom che si desidera aggiungere durante il processo di
registrazione.

### Login e Logout
La login di un utente viene eseguita effettuando una `POST` su `/users/login` passando come JSON nel body le seguenti
propietà:
- email
- password

Il logout è effettuato in modo molto semplice chiamando una `POST` su `/users/logout` senza nessun parametro particolare
nel body della chiamata.

La risposta di una chiamata a login è particolare, perché non solo ci torna l’utente loggato ma anche il token di
sessione che ci permetterà di eseguire le varie chiamate alla piattaforma associandole all’utente. La risposta è del
seguente tipo:
```json
{
    "id": "33e1b0e8-21cb-4f68-941d-e2c1e30f5734",
    "uid": "a2c71e83f0f569ab",
    "user": {
        "id": "a2c71e83f0f569ab",
        "creatorId": "a2c71e83f0f569ab",
        "createdAt": 1491579015054,
        "updaterId": "a2c71e83f0f569ab",
        "updatedAt": 1508343125261,
        "trash": 0,
        "sync": 0,
        "email": "marco.rossi@email.it",
        "username": "mrossi",
        "groups": [
            "users"
        ],
        "gravatar": "https://www.gravatar.com/avatar/077576536e6273ae2c76046507971dc0",
        "globalId": "36721ae465e7e961",
        "news": false,
        "validated": true
    },
    "expire": "2001-01-01T00:00:00.000Z",
    "sync": 0,
    "trash": 0
}
```
Come si può vedere le propietà dell’utente loggato si trovano all’interno della chiave user, mentre l’id nell’oggetto
principale è l’identificativo della sessione associata a questa login.

L’id di sessione da questo momento in poi può essere utilizzato nell’header delle chiamate successive per indicare che
la chiamata è da associare all’utente relativo.  
Per passare questo parametro, dobbiamo impostare nell’header delle chiamate il seguente cookie:
```
sid=33e1b0e8-21cb-4f68-941d-e2c1e30f5734
```
