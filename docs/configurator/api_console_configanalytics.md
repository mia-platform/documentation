# Come Configurare Gli Analitici da API Console

Dall'Api Console puoi comodamente configurare e gestire i tuoi analitici.

!!! note
    Ricordati che prima di poter configurare gli analitici devi avere già creato le tue collezioni nell'are Collezioni ed esposto i relativi Endpoint.

Nel menù verticale di sinistra troverai la sezione **"Analitici"**: in questa sezione è possibile creare tutti gli analitici per monitorare i KPI. Clicca sul bottone **"Aggiungi nuovo"** per iniziare a configurarne uno.

![](img/add_new.PNG)


Una volta che si inizia a configurare un analitico, si è guidati in un percorso a quattro step.

##**Step 1: Seleziona tipologia**

In questa fase devi decidere la tipologia di analitico che vuoi configurare. Al momento è possibile creare un analitico di tre tipologie:

* tipo **custom-stock**, cioè un grafico con in ascissa una serie temporale;


![](img/stock.PNG)

* tipo **chart**, cioè un grafico non legato al tempo;


![](img/chart.PNG)

* **chart-summary**, cioè un grafico nel quale vengono mostrate statistiche riguardanti una o più collezioni dati non legate al tempo.


![](img/chart-summary.PNG)

Cliccando su "next" si passa al prossimo step.


##**Step 2: Configurazione**

In questa sezione puoi scegliere:

* il **titolo** del grafico, che è un campo obbligatorio e non può contenere spazi bianchi;

* la **legenda** del grafico, che è un campo obbligatorio e può essere visibile o non visibile.

Cliccando su "next" si passa al prossimo step.

##**Step 3: Impostazione Serie**

In questa sezione si configurano la maggior parte delle proprietà dell'analitico:

* il **nome della serie**, che è un campo obbligatorio e non può contenere spazi bianchi;

* il **tipo di grafico**. Le visualizzazioni dei dati possibili sono line, spline, area e column.

* il **colore** del grafico;

* il campo **euro**, che permette di impostare l'unità di misura del grafico automaticamente in euro;

*  la **collezione**, dove si sceglie da quale collezione andare a prendere i dati che verranno mostrati nella serie, es. eroi_buoni;

* il **filtro**,

* **groupDate**, dove si trovano solo le proprietà di tipo data ed è possibile selezionare la proprietà su cui raggruppare i dati (solo formato data), es.createdAt

* il **formato dei dati**, dove si può scegliere l'unità temporale su cui raggruppare e quindi visualizzare i dati. Questo campo è da compilare solo se si utilizza **groupDate**. Il periodo di raggruppamento temporale può essere l'anno (y), il mese (ym), la settimana (yw), il giorno (ymd), l' ora (ymdh) oppure il minuto (ymdhM).

* l'**operatore**, dove si può scegliere l'operazione da svolgere sui dati raggrupati. Le operazioni possibili sono:
  * count: conta il numero di elementi di un gruppo;

  * sum:


dove si inserisce il nome della proprietà della collezione sulla quale si vogliono filtare i dati. In questo campo si scelgono tutti  i formati a parte la data, es. nome;
