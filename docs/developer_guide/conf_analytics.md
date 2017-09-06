Guida alla configurazione degli analitici
===================

Per configurare gli analitici bisogna accedere al file **_analytics-config** in git.
Il percorso per accedere al file è:

> nomeprogetto-config /  configurations / backoffice / analytics-config 

All'interno del file si trovano due file .json: 

 - **widgets.json**: in questo file sono definiti tutti gli analitici, e cioè quali sono i calcoli e le tipologie di dato
 - **dashboard.json**: in questo file si decide quali grafici del file widget vengono mostrati in dashboard sul CMS

Come configurare il file *dashboard*
-------

**Struttura di configurazione**
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

Dove:

 - ***id***: nome del grafico nella dashboard (nell'esempio sopra "installation")
 - ***order***: ordine di visualizzazione del grafico (nell'esempio sopra "2")
 - ***width***: larghezza del grafico che può andare **da 1 a 12**. Se ad esempio si hanno due grafici con larghezza 6, questi si vedranno affiancati. Si possono creare diverse combinazioni di visualizzazione in base alla larghezza data.
    
In questo caso, avendo due grafici con larghezza 12, questi verranno visualizzati uno sotto l'altro.
Nell'esempio sotto si vede un grafico larghezza 6 a sinistra e due grafici larghezza 3 ciascuno a destra.

**INSERIRE SCREEN DI ESEMPIO**


Come configurare il file *widget*
-------
**Struttura di configurazione**
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
Dove:

 - ***installation***: il nome del grafico che si sta costruendo
 - ***type***: il tipo di grafico, che può essere:

	 - stock: grafici con la linea temporale
	 - chart: grafici senza linea temporale 
	 
 - ***title***: titolo del grafico da mostrare
 - ***legend***: *true* per abilitare la legenda, *false* per disabilitarla
  ![legenda di un grafico su CMS](img/legend.png)
 - ***series***: il dettaglio del grafico.
 Qualora si volessero visualizzare più linee in un solo grafico, si costruirà un array di oggetti. 
   - *name*: nome della linea (o altro tipo) mostrato nel grafico
   - *id*: id della serie, di solito corrisponde al name
   - *type*: line, spline, area, column sono le tipologie di visualizzazione dei dati **DEVO SPIEGARE LE VARIE TIPOLOGIE?**
   - *color*: colore della serie, i valori ammessi sono i principali colori di css ([elenco colori](https://toolset.mrwebmaster.it/colori/colori-del-web.html))
 - ***labelType***: opzionale, usare solo con valore 'euro'. Indica il tipo di valore da mostrare nella legenda  

 - ***params***: oggetto di configurazione per la chiamata al backend
   - *collection:* da quale collezione nel datamodeller prendere i dati che verranno mostrati nel grafico
   - *"groupdate*: proprietà su cui raggruppare (solo formato data), es. createdAt
   - *group*: proprietà su cui raggruppare (formati altro rispetto a data), es. appSource
 - ***operations*** //tipo di operazione, es. [["count"]]
>   **FARE UN CHECK DELLA TRADUZIONE**
>   Il parametro Operation funziona solo con **groupDate** e **group**.
>   Permette di specificare le operazioni da applicare nel gruppo creato da groupDate o group.
>   Questo parametro è un array e deve essere un JSON valido. Perciò la stringa deve essere *doubled quoted*? ecc.
>   Ogni operazione è un array composta da [operationName, operands] dove operands è un parametro o un'operazione aritmetica di mongo accettata da [group accumulator operators](https://docs.mongodb.com/manual/reference/operator/aggregation-group/). 
>   Le **operazioni ammesse** sono:
>  - *count*: numera gli elementi di un gruppo, non necessita di un operands.
>  - *sum*: somma gli operands di ogni gruppo
>  - *avg*: calcola la media degli operands di un gruppo
>  - *last|first|min|max*: rispettivamente ritorna l'ultimo, il primo, i minimo e il massimo di ogni gruppo
>  - *constant*: ritorna in un gruppo la specifica stringa o costante numerica (default 1)
  

 - ***format***: visualizzazione di partenza: 'y' : anni, 'ym' : mesi, 'ymd' : giorni, 'ymdh' : ore, 'ymdhM' : minuti
 - ***filter***: è una mongoquery, posso mettere condizioni su createdAt se e solo se rageDates è false e il tipo di widget non è stock **CHIEDERE A DAVIDE E BOLLA LINK CORRETTO PER MONGOQUERY - FARE CHECK CON QUELLO CHE C'è NEL DATA MODELLER**
 - ***range date***: decide se mostrare il campo date
 - ***start date - end date***: quali date mostra quando viene aperto il CMS
 - ***default zoom***:  decide con quale livello di zoom di periodo partire nella visualizzazione. 0 : day, 1 : week, 2 : month, 3 : 3 months, 4 : 6 months, 5 : year, 6 : all
