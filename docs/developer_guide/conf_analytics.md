
[TOC]

Guida alla configurazione degli analitici
===================

Per configurare gli analitici bisogna accedere al file **_analytics-config** in git.
Il percorso per accedere al file è:

> nomeprogetto-config /  configurations / backoffice / analytics-config 

All'interno del file si trovano due file .json: 

 - **widgets.json**: in questo file sono definiti tutti gli analitici, e cioè quali sono i calcoli e le tipologie di dato
 - **dashboard.json**: in questo file si decide quali grafici del file widget vengono mostrati in dashboard sul CMS

Come configurare file *dashboard*
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

 - *id*: nome del grafico che vedo nella dashboard. Nell'esempio il grafico si chiama installations
 - "order": 3, //ordine di visualizzazione del grafico
 - "width": 12 //larghezza del grafico, può andare da 1 a 12. Se ad esempio si hanno due grafici con larghezza 6, questi si vedranno affiancati.
    
In questo caso, avendo due grafici con larghezza 12, questi verranno visualizzati uno sotto l'altro.


Come configurare file *widget*
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

- **"installation"** //il nome del grafico che si sta costruendo
- **"type"** //il tipo di grafico, che può essere:
 <ul>- stock: grafici con la linea temporale
  - chart: grafici senza linea temporale</ul> **"title"** //titolo del grafico da mostrare
- **"legend"** //*true* per abilitare la legenda, *false* per disabilitarla
  ![legenda di un grafico su CMS](img/legend.png)
- **"series"** //il dettaglio del grafico.
 qualora si volessero visualizzare più linee in un solo grafico, si costruirà un array di oggetti.
 <ul> **"name"** //nome della linea (o barra) mostrato nel grafico
 **"id"** //id della serie (di solito corrisponde al name
 **"type"** //line, spline, area, column
 **"color"** //colore della serie, i valori ammessi sono i principali colori di css ([elenco colori](https://toolset.mrwebmaster.it/colori/colori-del-web.html))
 **"labelType"** //opzionale, usare solo con valore 'euro'. Indica il tipo di valore da mostrare nella legenda  </ul> **"params"** //oggetto di configurazione per la chiamata al backend
 <ul>**"collection"** //da quale collezione nel datamodeller prendere i dati che verranno mostrati nel grafico
 **"groupdate"** //proprietà su cui raggruppare (solo formato data), es. createdAt
 **"group"** // es. appSource
 **"operations"** //tipo di operazione, es. [["count"]]
Operazioni ammesse sono:
 * *count*: number of elements of each group. This operation does not require operands.
 * *sum*: sum the operands of each group;
* *avg*: perform an average of the operands of each group;
* *last|first|min|max*: respectively return the last, first, min, max of each group;
* *constant*: returns in each group the specified string or numeric constant (default 1);

* *operands*: a parameter name or a mongo arithmetic operation accepted by [group accumulator operators](https://docs.mongodb.com/manual/reference/operator/aggregation-group/).
**"format"** //visualizzazione di partenza: 'y' : anni, 'ym' : mesi, 'ymd' : giorni, 'ymdh' : ore, 'ymdhM' : minuti
