# Mandare Notifiche Push con la piattaforma 4

[TOC]

## Introduzione
Un servizio plugin della piattaforma 4 espone le funzionalità per mandare notifiche push a client Andorid ed Ios in modo trasparente e gestisce la loro registrazione.
Questo servizio va esplicitamente incluso all'interno di un progetto nel caso si vogliano inviare notifiche push. Il servizio, da configurare con le chiavi `Firebase` e `APN`, utilizza anche due collezioni del `CRUD service` da includere anch'esse nel progetto.

## API

### Registrazione al servizio da parte delle App
Le app al login possono registrarsi alle notifiche push chiamando il servizio in POST al path `/register` ed indicando il proprio token di notifica, oltre alla piattaforma (android o ios) e ad una lista di tag (o topic) che indicano tipi di notifiche di cui il cliente vuole essere notificato. Questa API è autenticata e lega quindi il token anche all'id dell'utente corrente.



Esempio di payload di registrazione:
```json
{
  "token": "<long_alphanumeric_id specific to the couple app-device>",
  "platform": "android",
  "tags": [
    "weather", "finance", "early_user", "some", "other", "tag"
  ]
}
```

Ad ogni logout, bisogna necessariamente chiamare in POST `/unregister` per deregistrare il token dell'utente, altrimenti potrebbero arrivare notifiche anche ad utenti scollegati.


Esempio di payload di deregistrazione (anche questa è una API autenticata, da chiamare al logout):
```json
{
  "token": "<long_alphanumeric_id specific to the couple app-device>"
}
```

### Invio notifiche ai dispositivi
Le notifiche possono essere inviate con diverse modalità a seconda della destinazione: direttamente i token di registrazione, id utenti, tags, piattaforma, o a tutti i dispositivi.
Chiamando le seguenti rotte, il servizio consulterà la collezione in cui si sono registrate le app ed oltre ad inviare le notifiche, le salverà anche in una collezione (una per chiamata alla API) per poterle consultare ad esempio tramite CMS.
Le rotte sono le seguenti:

- POST `/tokens`: invia una notifica ad un insieme di token di registrazione
- POST `/userids`: invia una notifica ad un insieme di utenti specificando i loro id
- POST `/tags`: invia una notifica ad un insieme di utenti contrassegnati da un tag (topic o gruppo)
- POST `/platforms`: invia una notifica a tutti i dispositivi specificando una lista di piattaforme, (`ios`, `android` per ora)
- POST `/broadcast`: invia una notifica a tutti i dispositivi


Un esempio di payload di una chiamata per inviare una notifica ad una lista di utenti è la seguente:
```json
{
  "title": "Hey",
  "body": "Ciao!",
  "payload": {
    "some": "data"
  },
  "platformSpecificContent": {
    "android": {
      "icon": "ic_launcher",
      "sound": "default"
    },
    "ios": {
      "contentAvailable": true,
      "badge": 3,
      "sound": "ping.aiff",
      "topic": "<your-app-bundle-id>",
      "silent": false
    }
  },
  "userids": [
    "id1", "id2", "id3"
  ]
}
```

`title`, `body` e `payload` sono indipendenti dalla piattaforma, mentre nella sezione `platformSpecificContent` si possono aggiungere opzioni specifiche per piattaforma. Le altre rotte prevedono una interfaccia equivalente a meno dell'ultimo campo, che dipende dalla rotta.

Nota per `ios`: per mandare notifiche silenti, che non vengono visualizzate dalla app, ma che mandano semplicemente un payload in push, mettere nelle opzioni ios `silent: true` e `contentAvailable: true`.

## Collezioni
Il servizio si appoggia a due collezioni del `CRUD`: `devices` e `notifications`

### Devices
Questa collezione contiene il registro dei dispositivi registrati, un documento per token di registrazione (quindi possono esserci più documenti per ogni utente). __Questa collezione non va utilizzata direttamente dai client, che hanno le API di registrazione autenticate!__.
Le proprietà sono le seguenti:
- `userId`: string o ObjectId, riferimento all'utente che si è registrato
- `token`: string, il token ios o android che identifica il device e la app
- `tags`: list of strings, contrassegni di utenti interessati a topic o raggruppati come insieme di utenti
- `platform`: string, the platform of the device, currently it can be only `android`, `ios`, `mock` (case-sensitive!)

### Notifications
Questa collezione mantiene lo storico delle notifiche inviate. Proprietà:
- `title`: string, il titolo indipendente dalla piattaforma
- `body`: string, il messaggio indipendente dalla piattaforma
- `payload`: il payload custom indipendente dalla piattaforma
- `platformSpecificContent`: object, personalizzazioni della notifica dipendendìti dalla piattaforma
- `destination`: object, un descrittore che contiene il tipo `type` della destinazione e la lista dei destinatari
- `outcome`: object, il risultato dell'invio della notifica
