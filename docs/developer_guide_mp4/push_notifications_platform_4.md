# Mandare Notifiche Push con la piattaforma 4

[TOC]

## Introduzione
Un servizio plugin della piattaforma 4 espone le funzionalità per mandare notifiche push a client Andorid ed Ios in modo trasparente e gestisce la loro registrazione.
Questo servizio va esplicitamente incluso all'interno di un progetto nel caso si vogliano inviare notifiche push. Il servizio, da configurare con le chiavi `Firebase` e `APN`, utilizza anche due collezioni del `CRUD service` da includere anch'esse nel progetto.

## API

### Sottoscrizione al servizio da parte delle App
Le app possono registrarsi alle notifiche push chiamando il servizio in POST al path `/subscription/` indicando il proprio token di notifica, oltre alla piattaforma (android o ios) e ad una lista di tag (o topic) che indicano tipi di notifiche di cui il cliente vuole essere notificato. Questa rotta restituirà un `deviceId` che è un identificatore del dispositivo che le app dovranno salvare in locale per poter aggiornare la sottscrizione cambiando i tags o per aggiornare il token (che può scadere), eseguendo la chiamata a questa stessa rotta con anche il deviceId.


Se la chiamata viene eseguita con autenticazione, l'id dell'utente verrà salvato insieme alle informazioni del dispositivo. `ATTENZIONE:` se la chiamata viene eseguita senza autenticazione, l'utente verrà dissociato dal dispositivo: questa operazione è equivalente ad una `deregistrazione` dell'utente, che non riceverà quindi più notifiche esplicitamente rivolte a lui.

Esempio di payload di sottoscrizione:
```json
{
  "token": "<long_alphanumeric_id specific to the couple app-device>",
  "platform": "android",
  "tags": [
    "app_updates", "news", "finance", "early_user", "some", "other", "tag", "app_version_1.1.0"
  ]
}
```

Risposta servizio:
```json
{
  "deviceId":"<alphanumeric_id>"
}
```

In ogni successiva chiamata andrà sempre inviato anche il `deviceId`, per mantenere aggiornato il token e le preferenze:
```json
{
  "deviceId":"<alphanumeric_id>",
  "token": "<long_alphanumeric_id specific to the couple app-device>",
  "platform": "android",
  "tags": [
    "app_updates", "news", "finance", "early_user", "some", "other", "tag", "app_version_1.1.0"
  ]
}
```

Per associare l'utente loggato al device, basta eseguire la stessa chiamata con autenticazione, mentre per dissociarlo bisogna fare la chiamata senza autenticazione.

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


- userId: string o ObjectId, riferimento all'utente che si è registrato
- token: string, il token ios o android che identifica il device e la app
- tags: list of strings, contrassegni di utenti interessati a topic o raggruppati come insieme di utenti
- platform: string, la piattaforma del dispositivo `android`, `ios`, `mock` (case-sensitive!)

### Notifications
Questa collezione mantiene lo storico delle notifiche inviate. Proprietà:


- title: string, il titolo indipendente dalla piattaforma
- body: string, il messaggio indipendente dalla piattaforma
- payload: il payload custom indipendente dalla piattaforma
- platformSpecificContent: object, personalizzazioni della notifica dipendendìti dalla piattaforma
- destination: object, un descrittore che contiene il tipo `type` della destinazione e la lista dei destinatari
- outcome: object, il risultato dell'invio della notifica
