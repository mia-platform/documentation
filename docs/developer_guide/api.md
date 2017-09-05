[TOC]

## Introduzione
API è l'acronimo per *Application Programming Interface*. Negli ultimi anni le RESTful API sono diventate il metodo
principale per disaccoppiare la parte server dalla parte client di un software applicativo. Una RESTful utilizza i verbi
del protocollo HTTP (GET, PUT, POST, DELETE) per gestire un modello dati chiamato anche risorsa.

Nel dettaglio:

- GET: consente di leggere una risorsa o una lista di risorse
- POST: crea una risorsa
- PUT: aggiorna una risorsa
- DELETE: elimina una risorsa

## Linee guida
Esitono delle buone pratiche per progettare delle API RESTFul che si sono consolidate negli anni grazie ad una ricca
comunità Open Source.Seguono alcuni buoni consigli sulla progettazione delle API. Potete trovare ulteriori 
dettagli sulla [Guideline di Zalando](http://zalando.github.io/restful-api-guidelines).

### L'importanza di progettare le API
Progettare prima le API e poi implementarle non è contro i pricipi Agili.
Anzi consente di velocizzare lo sviluppo perchè disaccoppia il backend dal frontend e aiuta a parallelizzare gli
sviluppi e di conseguenza anche di rilasciare in modo incrementale le funzionalità. Inizialmente le UI saranno
interfacciate ad implementazioni delle API ancora in Draft. Dopo una prima valutazione dell'ergonomia delle API da parte
della UI le API evolveranno e sarà implementata la logica finale lato server.

![Approccio senza progettare le API con una piattaforma](img/no-platform.png)

Approccio senza progettare le API con una piattaforma

![Approccio progettando le API con una piattaforma](img/with-platform.png)

Approccio progettando le API con una piattaforma

Nei due schemi si può vedere come progettando una API e concordando quindi un contratto tra frontend e backend sia 
possibile procedere in parallelo fornendo dapprima dati mock all'interfaccia utente e poi, senza cambiare l'API,
implementare la parte server. Questo approccio ha il vantaggio che le prime versioni dell'API saranno subuito utilizzate
e quindi riceveranno il feedback di chi sta implementando la parte client dell'applicazione. Grazie a questi feedback
le API saranno migliorate ad un costo minore rispetto a farle cambiare una volta che tutta la logica server è stata
completata.

E' comunque auspicabile far evolvere le API man mano che l'interfaccia utente evolve. Il pattern di Backend-for-Frontend
è basilare per rendere facile la vita al frontend e consentire di avere API performanti e utili.

### Usare i nomi per identificare una risorsa
La prima volta che si definisce un'API si tende a pensare all'azione che viene fatta come se fosse un servizio da 
chiamare. Facciamo un esempio, vogliamo fare un gioco su super eroi e la prima cose che vogliamo fare è gestire
il profilo di un super eroe. Ad esempio per leggere tutti gli erori ci potrebbe venir voglia di scrivere

```
/getAllHeroes
```

e poi ...


```
/addNewHero
/updateHero
/deleteHero
/deleteAllHeroes
/evolveHero
/evolveAllHeroes
```

... e non finirebe qui, ci sarebbero molti end-point simili a questi. Tutti questi end-point conterrebbero azioni ridondanti.
Man mano che il sistema evolve nascerebbero ulteriori endpoint e la manutenzione del sistema raggiungerebbe livelli critici.

Cosa è sbagliato in questo approccio?

*Gli URL dovrebbe contenere solo risorse (nomi) e non azioni o verbi!*. Ad esempio il path */addNewHero* contiene 
l'azione *addNew* e la risorsa chiamata *Hero*.

Quindi quale sarebbe la strada corretta?

*/heroes* sarebbe un buon esempio, non contiene azioni ma solo il nome. La domanda successiva è: come dire al server
di eseguire azioni sugli eroi? Qui entrano in gioco i verbi HTTP.

Le risorse usano sempre il *plurale* e se vogliamo accedere ad una sola risorsa possiamo passare l'id nell'URL.
Ad esempio:

```
- il metodo GET sul path /heroes ritorna la lista di tutti gli eroi
- il metodo GET sul path /heroes/100 ritorna l'eroe che ha come id 100
- il metodo DELETE sul path /heroes/100 cancella l'eroe che ha come id 100
- il meotod POST sul path /heroes crea un nuovo eroe e ritorna il dettaglio del nuovo eroe creato.
```

Con questo semplice accorgimento le API sono più concise e consistenti!

Può essere utile questo accorgimento

```
L'API descrive le risorse, quindi l'unico luogo dove le azioni dovrebbero apparire è nei metodi HTTP. 
Negli URL, utilizzare solo i nomi. Invece di pensare alle azioni (verbi), è spesso utile pensare a mettere un messaggio
in una casella di posta: ad esempio, al posto di mettere il verbo delete nell'URL, si pensi di inviare un messaggio per
eliminare un eroe alla casella di deletion lato server.
```

Nei prossimi paragrafi vedremo nel dettaglio come progettare un'API con Mia-Platform.


### Versionare le API
Ci sono diversi dibattiti sul versionare o non versionare le API. Entrambi gli approcci hanno pro e contro.

- Non versionare le API consente di garantire una continuità di servizio a tutti i client che le consumano e poter
accedere agli end-point senza dover cambiare gli endpoint
- Versionare le API consente di introdurre cambiamenti di rottura senza impattare sui client in essere.

Quello che si consiglia è

```
Versionare solo le major version che portano a cambiamenti di rottura del servizio e ridurre il numero di versioni 
supportate in produzione a 2: quella di utilizzo corrente e quella in dismissione.
```

## Creare una API
Per creare un'API si può utilizzare l'API Modeller all'indirizzo
[https://yoururl.com/data_modeller/](https://yoururl.com/data_modeller/).

Maggiori informazioni alla pagina [Data Modeller](data_modeller.md).

### I campi base di una Risorsa

Una risorsa Mia Platform ha dei campi predefiniti e prevalorizzati che servono per la gestione del ciclo di vita del
dato. Se creiamo una risorsa senza proprietà avremo un JSON come il seguente:

```
{
    "creatorId": "public",
    "createdAt": 1504601216920,
    "updaterId": "public",
    "updatedAt": 1504601216920,
    "sync": 0,
    "trash": 0,
    "id": "86c32c9f-194e-46a1-b483-a07c118ff2fc"
  }
```

Nel dettaglio:

- creatorId: id dell'utente che ha creato la risorsa
- createdAt: long che esprime in millisecondi dal 1970 la data e ora di creazione della risorsa
- updaterId: id dell'utente che ha modificato per ultimo la risorsa
- updatedAt: long che esprime in millisecondi dal 1970 la data e ora di ultimo aggiornamento della risorsa
- sync e trash: le proprietà sync e trash appartengono ad ogni risorsa e sono rappresentate da numeri con una semantica ben precisa. 
  La proprietà sync può assumere 3 valori: 0, 1 o 2.
    
    - 0: la risorsa è nello stato "normale": visibile e sincronizzabile a meno del valore di trash;
    - 1: la risorsa è stata modificata localmente e deve essere caricata sul BaaS. Questo valore ha senso solo lato client, non dovrebbe mai comparire sul BaaS.
    - 2: la risorsa è in stato "draft" (bozza). L'applicazione client può scegliere (tramite configurazione) se salvare o no tale risorsa.
    
    La proprietà trash può assumere 4 valori: 0, 1, 2, -1.
    
    - 0: la risorsa è nello stato "normale": visibile e sincronizzabile a meno del valore di sync;
    - 1, 2: la risorsa è nello stato "trash" ovvero non è stata cancellata fisicamente, ma non dovrebbe essere più visibile (2 = non visibile neanche al CMS);
    - -1: la risorsa deve essere eliminata definitivamente dal BaaS. Questo stato ha senso solo lato client, non dovrebbe mai comparire sul BaaS.
    
    Una piccola considerazione su sync == 1 e trash == -1: questi due valori hanno significato solo lato client e servono per la corretta sincronizzazione delle collezioni, in particolare per l'operazione di push. Questi valori non dovrebbero mai comparire sul BaaS, per questo motivo, prima di caricare una risorsa con sync == 1 è doveroso impostare sync = 0, mentre quando si ha trash == -1 l'operazione da effettuare sul BaaS è la cancellazione definitiva della risorsa.
    
    
    | sync                  | trash                 | description               | action  |
    | --------------------- |---------------------- | ------------------------- | --------|
    | 1 (client reserved)   | 0	                    | Changed by the client	    | Upload data (with sync set to 0). If no errors then update local data else re-set sync to 1 and skip.|
    | 2	                    | 0	                    | Draft	                    | Depending on client configuration: keep/delete local data.|
    | 2	                    | 1	                    | Trash (CMS visible)	    | Delete local data.|
    | 2	                    | 2	                    | Trash (CMS not visible)   | Delete local data.|
    | 1	                    | -1 (client reserved)	| Deleted by the client	    | Delete remote data then, if no errors, delete local data.|
    | 1 (client reserved)   | 1	                    | Trashed by the client	    | Upload data (with sync set to 2). If no errors then delete local data else re-set sync to 1 and skip.|
    | -                     | -                     | Undefined	                | Delete local data or just skip.| 
    
- id: identificativo UUID generato da mongo per identificare la risorsa

## Sicurezza di un'API
Le API possono essere protette in due modi:
 - con chiave Secret
 - con ACL
 
L'API Modeller consente di gestire entrambe.

Nel dettaglio

```
{
       "acl": {
           "access": {
               "users": [],
               "groups": [
                   "public"
               ]
           },
           "read": {
               "users": [],
               "groups": [
                   "public"
               ],
               "secreted": false
           },
           "create": {
               "users": [],
               "groups": [
                   "users"
               ]
           },
           "update": {
               "users": [
                   "creator"
               ],
               "groups": []
           },
           "delete": {
               "users": [
                   "creator"
               ],
               "groups": []
           },
           "secreted": true,
           "enabled": false
       }
   }
```

La secret key viene configurata nel file 

```
credentials.json
```

e deve essere passata nell'header


## Consumare una API
Le API configurate con Mia-Platform possono essere consumate con qualsiasi tecnologia che supporta il procollo HTTP.
Per i test durante lo sviluppo consigliamo uno dei seguenti strumenti:

- curl: [https://curl.haxx.se](https://curl.haxx.se/)
- insomnia: [https://insomnia.rest](https://insomnia.rest/)
- postman: [https://www.getpostman.com](https://www.getpostman.com/)

Negli esempi per brevità useremo curl.

Seguono le operazioni tipiche che si possono fare con un'APIRestful CRUD creata con Mia-Platform.

### Creare una Risorsa

Per creare una risorsa è sufficiente inviare una *POST* request all'endpoint passando nel body le informazioni della 
risorsa che si vuole creare.

```
curl -X POST https://your-url/heroes/ 
-H  "accept: application/json" 
-H  "content-type: application/json" 
-H  "secret: secret" -d "{  \"name\": \"Capitan America\",  \"powers\": [    \"agility\", \"strength\", \"speed\", \"endurance\"  ]}"
```

il cui body è

```
{
  "name": "Capitan America",
  "powers": [
    "agility", "strength", "speed", "endurance"
  ]
}
```

in risposta si ottiene la risorsa appena creata

```
{
    "creatorId": "public",
    "createdAt": 1504601266703,
    "updaterId": "public",
    "updatedAt": 1504601266703,
    "sync": 0,
    "trash": 0,
    "name": "Capitan America",
    "powers": [
      "agility",
      "strength",
      "speed",
      "endurance"
    ],
    "id": "ef02dcaa-7a2e-4c31-a505-c2cb014d769e"
  }
```

### Lettura di una lista di Risorse

Per leggere una risorsa è sufficiente chiamare con una GET l'endpoint

```
curl -X GET https://your-url/heroes/ 
-H  "accept: application/json" 
-H  "content-type: application/json" 
-H  "secret: secret"
```

si otterrà un array JSON che contiene tutte le risorse della risorsa. L'ordinamanento è quello di inserimento

```
[
  {
    "creatorId": "public",
    "createdAt": 1504601033071,
    "updaterId": "public",
    "updatedAt": 1504601033071,
    "sync": 0,
    "trash": 0,
    "name": "Ms. Marvel",
    "powers": [
      "superhuman strength",
      "speed",
      "stamina",
      "durability",
      "energy projection and absorption",
      "flight"
    ],
    "id": "ff447759-6a35-405d-89ed-dec38484b6c4"
  },
  {
    "creatorId": "public",
    "createdAt": 1504601216920,
    "updaterId": "public",
    "updatedAt": 1504601216920,
    "sync": 0,
    "trash": 0,
    "name": "Groot",
    "powers": [
      "regenerate",
      "control plants",
      "fire resistant",
      "increase mass"
    ],
    "id": "86c32c9f-194e-46a1-b483-a07c118ff2fc"
  },
  {
    "creatorId": "public",
    "createdAt": 1504601266703,
    "updaterId": "public",
    "updatedAt": 1504601266703,
    "sync": 0,
    "trash": 0,
    "name": "Capitan America",
    "powers": [
      "agility",
      "strength",
      "speed",
      "endurance"
    ],
    "id": "ef02dcaa-7a2e-4c31-a505-c2cb014d769e"
  }
]
```

### Lettura di una singola Risorsa

Per leggere un solo elemento è sufficiente passare alla GET l'id della risorsa che si vuole leggere.

```
curl -X GET https://your-url/heroes/ef02dcaa-7a2e-4c31-a505-c2cb014d769e 
-H  "accept: application/json" 
-H  "content-type: application/json" 
-H  "secret: secret123"
```

si ottiene la risorsa corrispondente all'id *ef02dcaa-7a2e-4c31-a505-c2cb014d769e*

```
{
	"creatorId": "public",
	"createdAt": 1504601266703,
	"updaterId": "public",
	"updatedAt": 1504601266703,
	"sync": 0,
	"trash": 0,
	"name": "Capitan America",
	"powers": ["agility", "strength", "speed", "endurance"],
	"id": "ef02dcaa-7a2e-4c31-a505-c2cb014d769e"
}
```

### Ordinamento e paginazione

Per ordinare una lista di risorse alla GET bisogna passare

### Filtri

### Aggiornare una Risorsa

### Cancellare una Risorsa

### Count del numero di Risorse

### Eliminare tutte le Risorse

## Documentare una API

## Codici di risposta di un'API
When the client raises a request to the server through an API, the client should know the feedback, whether it failed, passed or the request was wrong. HTTP status codes are bunch of standardized codes which has various explanations in various scenarios. The server should always return the right status code.
The following are the important categorization of HTTP codes:
2xx (Success category)
These status codes represent that the requested action was received and successfully processed by the server.
200 Ok The standard HTTP response representing success for GET, PUT or POST.
201 Created This status code should be returned whenever the new instance is created. E.g on creating a new instance, using POST method, should always return 201 status code.
204 No Content represents the request is successfully processed, but has not returned any content.
DELETE can be a good example of this.
The API DELETE /companies/43/employees/2 will delete the employee 2 and in return we do not need any data in the response body of the API, as we explicitly asked the system to delete. If there is any error, like if employee 2 does not exist in the database, then the response code would be not be of 2xx Success Category but around 4xx Client Error category.
3xx (Redirection Category)
304 Not Modified indicates that the client has the response already in its cache. And hence there is no need to transfer the same data again.
4xx (Client Error Category)
These status codes represent that the client has raised a faulty request.
400 Bad Request indicates that the request by the client was not processed, as the server could not understand what the client is asking for.
401 Unauthorized indicates that the client is not allowed to access resources, and should re-request with the required credentials.
403 Forbidden indicates that the request is valid and the client is authenticated, but the client is not allowed access the page or resource for any reason. E.g sometimes the authorized client is not allowed to access the directory on the server.
404 Not Found indicates that the requested resource is not available now.
410 Gone indicates that the requested resource is no longer available which has been intentionally moved.
5xx (Server Error Category)
500 Internal Server Error indicates that the request is valid, but the server is totally confused and the server is asked to serve some unexpected condition.
503 Service Unavailable indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance.

## API con codice custom



## Eventi legati ad una API