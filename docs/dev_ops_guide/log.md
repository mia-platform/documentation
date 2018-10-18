# Linee Guida per i log

Ogni buon programma deve essere testato nella sua interezza per evitare bug, ma **anche un coverage del 100% non assicura una esperienza “bug free”**; questo perché il pezzo di software difficilmente si troverà ad essere eseguito in totale autonomia senza rientrare in un sistema composto da più parti mobili che comunicano fra di loro.

Per facilitare questa parte di debug ogni programmatore ha a sua disposizione i log applicativi; ma come nel caso dei test, **scrivere dei log senza seguire una logica e/o senza disciplina può portare ad avere codice non facilmente analizzabile a runtime**.

!!!info
    Questa guida vuole indicare le buone pratiche individuate all’interno di Mia-Platform per scrivere dei log che possono indicare dove il flusso di esecuzione sta trovando degli intoppi e possibilmente il motivo.

## Prerequisiti
All’inizio dello sviluppo di ogni applicativo, **bisogna valutare bene che libreria di log che si vuole utilizzare e/o se l’eventuale framework http utilizzato non ne fornisce già una adatta allo scopo** o facilmente personalizzabile per essere conforme ai seguenti prerequisiti:

1. supportare almeno i **seguenti livelli di log**
    * *error*: pari ad un log level di 10
    * *warn*: pari ad un log level di 20
    * *info*: pari ad un log level di 30
    * *debug*: pari ad un log level di 40
    * *trace*: pari ad un log level di 50
2. supportare la configurazione del livello via variabile di ambiente chiamata **LOG_LEVEL**
3. supportare la scrittura del **log solo su stdout**
4. serializzare **ogni riga di log come json**
5. supportare l’arricchimento del log con **valori aggiuntivi**
6. scrittura di default dei seguenti parametri con le **chiavi descritte**:
    * *reqId*: deve contenere il parametro contenuto nell’header X-Request-ID
    * *time*: deve continuare il timestamp in millisecondi o la data codificata in stringa iso8601 in UTC
    * *level*: deve contenere in numero associato al livello di log impostato in stringa o number
    * *hostname*: deve contenere se possibile il valore dell’header X-Forwarded-Host oppure dell’header Host
    * *msg*: una stringa intelligibile del motivo per cui il log è stato emesso
7. se possibile deve fornire un modo di modificare il valore di alcune chiavi sensibili per **evitare di loggare dati sensibili dell’utente** che potrebbero transitare, il comportamento accettato è di avere il valore reale sostituito con una stringa tipo **[REDACTED] o [CONFIDENTIAL]**, non di avere la chiave rimossa dal log

!!! tip
    Un nice to have è quella di avere la possibilità di passare il log ad un programma non installato in produzione per fare il “pretty-printing” dei log durante lo sviluppo locale, o quando si accede allo stream diretto dei log su k8s.

## Linee Guida

I log di un programma non devono essere necessariamente verbosi di natura per evitare troppo “rumore” che potrebbe far perdere informazioni importanti ma nemmeno troppo “silenziosi” ed ottenere l'effetto contrario e cioè perdere l’idea di come stia procedendo il flusso di informazioni all’interno del programma.

>Di seguito proponiamo delle linee guida generali su cosa ci si aspetta all’interno dei vari livelli di log.

## Log di default

Durante lo sviluppo **tenete sempre accesi i log ad un livello pari almeno ad info**, se a questo livello nella console non leggete nulla o non riuscite a ricostruire interamente il flusso delle informazioni all’interno del vostro codice, i log che state scrivendo probabilmente non sono abbastanza.

!!! tip
     Tenendo sempre accesi i log durante lo sviluppo ed il test in locale inoltre avete la possibilità di vedere anche i log che i framework e le librerie che state usando scrivono di default ed evitare quindi inutili ripetizioni.

## Error
In questo livello si suppone di trovare solo messaggi di errori inerenti ad errori logici incontrati durante l’esecuzione del programma.

!!! warning
    Il log è inerente all’errore incontrato **non a quello che verrà eventualmente tornato all’utente**, infatti se è possibile arricchite il log con informazioni riguardanti il perché sia avvenuto, per esempio:

```javascript
const expectAlwaysAtLeastOneResult = httpRequest(host, query)
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.error(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    return httpError.serverError()
}

```

In questo caso non trovare dei risultati provoca un errore nella logica del codice perché per come è stato strutturato il codice con i dati nell’oggetto query non può essere possibile non trovare almeno un risultato, e quindi è utile venire a sapere dove il flusso si è fermato ed il perché soprattutto visto che la risposta sarebbe solo una pagina standard di errore 500. Come potete vedere non viene utilizzato nessun log per tracciare il fatto che la risposta restituita all’utente è un errore perché nell’esempio possiamo supporre che sia il framework http sottostante che stiamo usando a farlo per noi e sarebbe quindi un inutile ripetizione.

## Warn

!!! info
    Anche se questo è uno dei livelli più scarsamente utilizzati a volte può essere utile sapere che si è presa una strada che potrebbe evidenziare un problema evitato per precauzione ma che richiede la nostra attenzione.

Per esempio possiamo modificare leggermente l’esempio precedente per renderlo un warning invece di un errore:

```javascript

let expectAlwaysAtLeastOneResult = httpRequest(host, query)
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.warn(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    expectAlwaysAtLeastOneResult = recoverADefaultValue()
}

```

In questo caso il codice è strutturato per resistere ad un eventuale dato mancante, ma vogliamo rendere evidente questo caso loggando il fatto che la query utilizzata per recuperare un valore non ha tornato il risultato aspettato ma abbiamo dovuto usare dei valori standard che potrebbero degradare l’esperienza dell’utente.

##Info

Se seguite questa guida il livello info dovrebbe essere quello più utilizzato all’interno del vostro codice. È questo il livello che verrà passato ai vostri applicativi quando verranno eseguiti in pre-produzione e in produzione ed è per questo che è quello fondamentale per individuare il flusso del vostro programma.

!!! warning
    Non fatevi però prendere la mano inserendolo prima e dopo ogni chiamata di funzione inseritelo solo in punti di attenzione del vostro codice, dove la presenza o meno di un log nella console vi può fare capire che scelte logiche si stanno eseguendo nel vostro codice:

```javascript

const expectAlwaysAtLeastOneResult = httpRequest(host, query)
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.error(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    return httpError.serverError()
}
log.info('expectAlwaysAtLeastOneResult has been retrived')

```

In questo esempio dopo il blocco if è stato inserito un log per indicare che la chiamata HTTP effettuata per recuperare un valore obbligatorio da un servizio terzo è stata effettuata con successo e non ha tornato un errore o un valore non consono. In questo caso presumiamo che la chiamata httpRequest lanci una eccezione contenente l'errore HTTP relativo e che venga gestita in un altra parte del codice che non può sapere esattamente quale chiamata sia fallita, per aiutarci a capire fino a che punto sia arriva il codice possiamo lasciare questi indizi tramite info per farci capire che la chiamata fallita non sia proprio questa; infatti nella console vedremo o il log di errore o quello di info, se nessuno dei due appare vuol dire che il codice non è mai arrivata a questo punto del nostro codice.

!!! tip
    Se però la funzione httpRequest si preoccupa già di scrivere dei log intelligibili in console è inutile inserire questo log di info. Come potete capire info è il livello più utile ma anche quello più difficile da utilizzare correttamente senza ottenere un log troppo verboso inutilmente.

## Debug

Al livello debug ci si aspetterà di trovare quelle informazioni utili durante la fase test locale o appunto di debug di problemi riscontrati durante l’utilizzo dell’applicazione nell’ambiente di test; infatti è questo il livello che verrà passato ai vari applicativi quando verranno lanciati in quell’ambiente.

!!! tip
     Una buona regola da seguire per inserire dei log di debug è se per qualsiasi motivo durante lo sviluppo o i test è stato necessario fermarsi ed aggiungere dei comandi per scrivere in console dei parametri passati nel nostro codice per capire cosa non stesse funzionando. Ogni volta che capita questa cosa è un buon momento per capire se non è meglio trasformare quell’inserimento temporaneo in un log di debug permanente.

Nei log di debug cerchiamo di inserire più informazioni aggiuntive possibile in riferimento al log in questione, per aiutarci a risolvere il problema riscontrato.

```javascript

let expectAlwaysAtLeastOneResult = httpRequest(host, query)
log.debug({ originalResults: expectAlwaysAtLeastOneResult }, 'Result returned from HTTP call')
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.warn(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    expectAlwaysAtLeastOneResult = recoverADefaultValue()
}
log.debug({ expectAlwaysAtLeastOneResult }, 'result to use')

```

In questo stiamo cercando di capire perché il programma si comporti in modo anomalo e quindi vogliamo assicurarci che in questa parte del programma venga chiamato il servizio corretto con i parametri giusti e che il risultato tornato sia quello che ci aspettiamo.

## Trace
Il livello trace è da utilizzare solo per entrare in modalità “paranoia”, quando durante il debug del codice si cominciano ad aggiungere dei log per individuare il più piccolo progresso del flusso di informazioni o il progredire delle modifiche apportate ad un oggetto od al contrario di validare che un oggetto non viene mai modificato quando viene passato all’interno delle funzioni.

```javascript

log.trace({ host, query }, 'Calling third party service')
let expectAlwaysAtLeastOneResult = httpRequest(host, query)
log.trace({ query }, 'Query after the call')
log.debug({ originalResults: expectAlwaysAtLeastOneResult }, 'Result returned from HTTP call')
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.warn(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    expectAlwaysAtLeastOneResult = recoverADefaultValue()
}
log.debug({ expectAlwaysAtLeastOneResult }, 'result to use')

```

In questo esempio sono state aggiunte due nuove righe in trace per tracciare il progresso del codice e notare come un oggetto query passato alla funzione httpRequest possa venire modificato per errore invalidando così la chiamata al servizio terzo.

## Conclusione

>I log per un programmatore sono uno strumento essenziale da utilizzare al meglio sia in fase di sviluppo per individuare al più presto errori di logica che i test non stanno individuando (e quindi poterli integrare di conseguenza), sia durante il normale utilizzo durante i vari stadi di deploy.

Inoltre è utile tenere sempre a mente che i log degli ambienti in pre-produzione e produzione vengono raccolti ed indicizzati da Elasticsearch, e quindi i dati aggiuntivi che si inseriscono fino al livello info è meglio che siano facilmente indicizzabili o utilizzabili come elementi per filtrare dei log ben specifici.
