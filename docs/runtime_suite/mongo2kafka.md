# Mongo 2 Kafka 

## When to use it

* quando il cliente ha un budget limitato e poco tempo

* quando fai le operazioni direttamente su CRUD

il cliente testimonia che la finestra di opilog non sia troppo piccola e non hai bisogno di un carico sufficiente


Soluzione architetturale
Il microservizio Custom che scrive su Mongo accoda le modifiche corrette su Kafka 


Limitazioni 
la delete del change stream manda esclusivamente la _id 

gli eventi non sono in ordine su kafka.
il mongo2 kafka utilizza come chiave il resume token che essendo univoco faceva round robin sulle partizioni di quel topic. 1 topic = 1 partizione . se ti puoi permettere di scodare da kafka in maniera lenta lo puoi usare

con una partizione non puoi scalare orizzontalmente il consumer 

scalabilità lato producer: diverse istanze di mongo2kafka che accodano su kafka i changestream- mettendone 2 in parallelo sul change stream duplichi gli eventi. Non è shardato il changestream (è possibile nel caso installare diverse installazioni del mongo2kafka - ogni mongo2kafka fa delle querystream diverse) Non hai una scalabilità dinamica tramite replicaset - non sai se l’applicativo è sotto stress e non riesci a gestire i picchi di traffico. 

il tool è scalato orizzontalmente ma il traffico non è omogeneo sulle repliche. 

il changestream funziona solo esclusivamente su un cluster di mongo e non sulla versione standalone

opilog window - (finestra di operazioni in cui il server primario va a dire ogni singola operazione che ha fatto ai server secondari all’interno del cluster mongo) - è una capped collection (è limitata in spazio - ci possono stare solo un tot di giga, è un FIFO - First in First Out - il primo pezzo che entra è l’ultimo che esce
Il resumetoken è la chiave primaria che indica le operazioni effettuate, quando i secondari leggono usano il resumetoken tendono a tenerlo più vicino all’alto del buffer dove scrive il primario. Il resume token viene utilizzato come chiave primaria di kafka. 
Il primario non si frega se hanno fatto o meno le operazioni, quindi uno dei secondari si può perdere delle operazoni. 
Succede quando il tempo di applicazione delle modifica (es: accodo su Kafka) è più lenta di tutte el modifiche richieste dal primario e se questa situazione perdura nel tempo, rischi di perderti degli eventi di modifica. Dipende dalla configurazione di Kafka, dove vive Kafka e dal tuo Cluster Mongo. 

lo sharding di Mongo è un’operazione molto complessa, da valutare, esempio gestione di milioni di dati, milioni di utenti su tutto il mongo, crei degli shared per region. Da tenere presente che su ogni shared ti trovi i problemi di cui sopra. 

quando fai l’aggiornamento o la creazione c'è anche il documento con tutti i campi (puoi richiedere il full document) il full document non è esattamente quello che è stato modificato. se hai operazioni molto vicine nel tempo il full document può essere aggiornato ad una modifica successiva e non a quella che stai visualizzando
