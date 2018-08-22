# Comunicazione fra microservizi all'interno della piattaforma 4

[TOC]

## Introduzione
La piattaforma 4 è composta da microservizi, in cui ciascuno espone un insieme specifico di funzionalità. Per far comunicare i microservizi tra loro, abbiamo individuato delle best practice e convenzioni per rendere il più possibile uniforme la modalità di comunicazione, sia tra componenti core che tra microservizi custom.

## Convenzioni

### Protocollo
Il protocollo di comunicazione scelto per la comunicazione interna è `http`.

### Hostname e porta
I servizi vengono rilasciati con hostname uguale al nome del servizio, sulla porta `80`. Quindi ad esempio il crud-service sarà raggiungibile all'url `http://crud-service` (`http://crud-service:80`), il microservice-gateway all'url `http://microservice-gateway` e così via. Questo vale anche per tutti i servizi custom.

### Formato dati
Il formato più diffuso nella comunicazione fra i servizi è il `JSON`, che è il più consigliato per la trasmissione di dati strutturati in API REST.
Non è però scontato il suo utilizzo per tutte le API, infatti, ad esempio per il trasferimento di file si utilizza direttamente il protocollo HTTP per il download, e tipicamente richieste multipart per l'upload.

### Documentazione
Si invita a consultare la documentazione `OpenAPI` (swagger) dei servizi per controllare effettivamente le rotte e il formato dei dati. Caldamente consigliata è l'esposizione di una documentazione `live`, che sia servita dal servizio stesso e rifletta le effettive rotte del servizio (meglio se generata). Per convenzione la rotta su cui ci si aspetta la documentazione è `/documentation` (per i file statici HTML) e `/documentation/json` o `/documentation/yaml` per il file swagger.

## Comunicazione tra servizi
Ci sono due possibilità per raggiungere i servizi in generale:


- tramite `microservice-gateway`
- diretta

In ogni caso, è molto importante ricordarsi di portare avanti gli header di Mia che contengono l'id dell'utente, i suoi gruppi etc, in modo che anche il servizio invocato abbia accesso a tali informazioni!


Per facilitare la comunicazione tra i servizi è stata scritta una [libreria in node](plugin_baas_4.md), è comunque possibile chiamare i servizi direttamente tramite http nel caso si utilizzino altre tecnologie.

### Comunicazione tramite microservice-gateway
Il microservice-gateway raccoglie tutte le API dei microservizi, e offre la possibilità di agganciare web-hook alle chiamate che agiscono come decoratori di PRE (prima della chiamata) e di POST (dopo la chiamata). Le chiamata ai microservizi da fuori potrebbe quindi scatenare altre chiamate ed altra logica a complemento della chiamata stessa. Per avere un comportamento consistente anche quando si chiamano i servizi dall'interno, si consiglia di passare per il microservice-gateway.


Per chiamare un CRUD tramite il microservice-gateway, bisogna contattare `http://microservice-gateway/<nome-collezione>/<rotte del CRUD>`.
Per contattare un servizio tramite il microservice-gateway, bisogna contattare `http://microservice-gateway/<nome-servizio>/<rotte-del-servizio>`

### Comunicazione diretta
Se si vuole evitare il passaggio attraverso il microservice-gateway, si può contattare il servizio direttamente come illustrato sopra. Questo è generalmente sconsigliato perché si eludono evenuali decoratori della chiamata, ma è comunque possibile.
