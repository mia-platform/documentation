[TOC]

#Guida alla configurazione degli analitici#

Gli analitici sul CMS di Mia-Platform vengono configurati attraverso due tipi di file JSON:

 - **widgets**: in questo file sono definiti tutti gli analitici, e cioè quali sono i calcoli e le tipologie di dato
 - **file di configurazione grafica**: in questi file si decide quali grafici del file widget vengono mostrati nella pagina desiderata del CMS. I file JSON di configurazione grafica sono: *dashboard.json*, che permette di configurare cosa viene mostrato nella dashboard del CMS, e un file *analytics.json* per ogni collezione del CMS per configurare cosa viene mostrato nella pagina analytics della collezione in oggetto.

Il percorso per accedere ai file di configurazione degli analitici su git è:

> nomeprogetto-config /  configurations / backoffice / _analytics-config

All'interno del file _analytics-config si trovano i due file widget e dashboard.

Per configurare il file analytics.json all'interno di una collezione specifica, il percorso su git è:
> custom plugin / nome della collezione / analytics.json

Creando il file *analytics* viene quindi abilitato il tasto Analitici sul CMS e viene visualizzato il grafico così come è stato configurato all'interno del medesimo file.



##Come configurare il file *widget*##

Il file widget è il file di configurazione dei grafici. In mia platform si ha la possibilità di configurare due tipologie di grafico:

+ ```custom-stock```: è un grafico con in ascissa una serie temporale
![](img/stock.png)
+ ```chart```: è un grafico non legato al tempo
![](img/chart.png)
+ ```chart-summary```: è un grafico nel quale vengono mostrate statistiche riguardanti una o più collezioni dati non legate al tempo
![](img/chart-summary.png)

###Esempio di struttura di configurazione###
```
{
  "installations": {
    "type": "custom_stock",
    "title": "Installations",
    "legend": true,
    "series": [{
      "name": "Installations",
      "id": "installations",
      "type": "line",
      "color": "grey",
      "params": {
        "collection": "installations",
        "groupDate": "createdAt",
        "operations": [
          ["count"]
       ],
        "format": "ymd"
      }
    }]
  }
```
###Gli elementi della struttura###

Questo JSON contiene un oggetto i cui elementi sono i diversi grafici.
La chiave di ogni elemento è il nome del grafico (*installations* nell'esempio sopra) e il valore è un altro oggetto con tutti i parametri di configurazione del grafico.
Il nome del grafico servirà poi per la creazione dei JSON analytics e dashboard per richiamare il grafico che si vuole visualizzare nella pagina.

 - ***type:*** (string) il tipo di grafico, che può essere ```custom-stock```, ```chart``` oppure ```chart-summary```
 - ***title:*** (string) titolo del grafico da mostrare
 - ***sortBy:*** (enum string) determina l'oridnamento delle serie; le chiavi da utilizzare sono : ```label-asc```, ```label-desc```, ```value-asc```, ```value-desc```.
 - ***legend:*** (boolean/array). Se vuoi vedere o non vedere tutta la legend usa un (boolean): false per disabilitarla, in questo modo non vedrai nulla. Se invece scriverai true la legenda conterrà tutte le statistiche: max (valore massimo) , min (valore minimo) , sum (somma), avg (media).
**Se vuoi visualizzare solo dei dati selezionati, dovrai trasformare il boolean in un array.
Es: nel tuo grafico vuoi mostrare solo la somma e la media.
A livello di codice scriverai: ```"legend": ["sum","avg"]```.
Ricorda però che l’array non decide l’ordine, ma è preimpostato.

  ![legenda di un grafico su CMS](img/legend.png)
  
 - ***series:*** (array di oggetti) ogni oggetto del array rappresenta un tracciato/serie all'interno del grafico.
 Qualora si volessero visualizzare più tracciati/serie in un solo grafico, basterà mettere più di un oggetto nel array.
   Ogni oggetto del array *series* è costituito dai seguenti elementi:
   - *name:* (string) nome del tracciato/serie mostrato nel grafico
   - *id:* (string)  id del tracciato/serie, di solito corrisponde al name
   - *type:* (string) line, spline, area, column sono le tipologie di visualizzazione dei dati
   - *color:* (string) colore del tracciato/serie, i valori ammessi sono i principali colori di css ([elenco colori](https://toolset.mrwebmaster.it/colori/colori-del-web.html))
 - ***labelType:*** (string) opzionale, usare solo con valore 'euro'. Indica il tipo di valore da mostrare nella legenda  

 - ***params:*** (oggetto) questo oggetto contiene gli elementi per configurare i valori del tracciato/serie:
   - *collection:* (string) da quale collezione  prendere i dati che verranno mostrati nel tracciato/serie
   - *groupdate:* (string) nome della proprietà su cui raggruppare i dati (solo formato data), es. ```createdAt```
   - *group:* (string) nome della proprietà su cui raggruppare i dati (formati altro rispetto a data), es. ```appSource```
   - *operations:* (array) indica l'operazione da eseguire sui dati, es. [["count"]]

> Il parametro Operation funziona solo con **groupDate** e **group**.
> Permette di specificare le operazioni da applicare nel gruppo creato da groupDate o group.
> Questo parametro è un array e deve essere un JSON valido.
> Ogni operazione è composta da [operationName, operands] dove operationName è un parametro o un'operazione aritmetica di mongo accettata da [group accumulator operators] e operands è il nome della property o una mongo query che restituisca i valori su cui applicare l'operationName  (https://docs.mongodb.com/manual/reference/operator/aggregation-group/).
> Le **operazioni ammesse** sono:

> + ***count***: numera gli elementi di un gruppo, non necessita di un operands.
> + ***sum***: somma gli operands di ogni gruppo
> + ***avg***: calcola la media degli operands di un gruppo
> + ***last|first|min|max***: rispettivamente ritorna l'ultimo, il primo, i minimo e il massimo di ogni gruppo
> + ***constant***: ritorna in un gruppo la specifica stringa o costante numerica (default 1)
> **N.B. Si può impostare una sola operazione per tracciato/serie.** Si possono impostare anche operazioni complesse, ad esempio: ["avg", {"$multiply":
        ["$totalPrice", "$quantity"]}]

 - ***format:*** (string) elemento da popolare solo se si utilizza groupDate per indicare il periodo temporale di raggruppamento di default del tracciato/serie. Formati possibili: ```y``` : anni, ```ym``` : mesi, ```yw``` : settimane, ```ymd``` : giorni, ```ymdh``` : ore, ```ymdhM``` : minuti
 - ***filter:*** (mongoquery) serve per creare il tracciato/serie non su tutti i dati della collezione ma su un sottoinsieme. E' possibile filtrare su una property di tipo data se e solo se questa non è già utilizzata come property per il groupDate.
La documentazione da consultare per le mongoquery è disponibile a questo [link](https://docs.angularjs.org/api/ng/filter/date).

 - ***customRangeDates:*** (boolean) abilita o disabilita i campi date ```startDate``` e ```endDate```, ***solo*** per i grafici di tipo ```chart```.
 - ***start date - end date:*** (number) utilizzabili solo se customRangeDate è settato a true. Inserire il timestamp in millisecondi delle date del periodo di interesse.  
 > Se sono attivi sia rangeDate che customDate su un grafico di tipo custom stock può crearsi confusione. Può essere più funzionale disabilitare rangeDate in quanto lo zoom può essere impostato sia con il cursore che con i bottoni di visualizzazione

 - ***default zoom:*** (number) permette di decidere con quale livello di zoom di periodo partire nella visualizzazione in un custom stock. 0 : day, 1 : week, 2 : month, 3 : 3 months, 4 : 6 months, 5 : year, 6 : all

##Come configurare il file *dashboard* e *analytics*##

I file JSON dashboard e analytics permettono di configurare la visualizzazione dei grafici nel CMS rispettivamente nella dashboard e nella sezione analitici all'interno di una collezione.

###Esempio di struttura di configurazione###
```
[
 {
    "id": "installations",
    "order": 2,
    "width": 12
  },
  {
    "id": "dailyuse",
    "order": 3,
    "width": 12
  }
]
```
###Gli elementi della struttura###


 * ***id:*** (string) nome del grafico nella dashboard (nell'esempio sopra "installations")
 * ***order:*** (number) ordine di visualizzazione del grafico (nell'esempio sopra "2")
 * ***width:*** (number 1-12) larghezza del grafico che può andare **da 1 a 12**. Se ad esempio si hanno due grafici con larghezza 6, questi si vedranno affiancati. Si possono creare diverse combinazioni di visualizzazione in base alla larghezza data.

In questo caso, avendo due grafici con larghezza 12, questi verranno visualizzati uno sotto l'altro.


**INSERIRE SCREEN DI ESEMPIO**
