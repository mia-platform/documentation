# Come Configurare Gli Analitici da API Console

Dall'Api Console puoi comodamente configurare e gestire i tuoi analitici.

!!! note
    Ricordati che prima di poter configurare gli analitici devi avere già creato le tue collezioni nell'area Collezioni ed esposto i relativi Endpoint.

Nel menù verticale di sinistra troverai la sezione **"Analitici"**: in questa sezione è possibile creare tutti gli analitici per monitorare i KPI. Clicca sul bottone **"Aggiungi nuovo"** per iniziare a configurarne uno.

![](img/add_new.png)


Una volta che si inizia a configurare un analitico, si è guidati in un percorso a step. E' possibile configurare analitici a una o due serie (solo nel caso di un grafico di tipo *custom stock*) e nel secondo caso il proocesso è leggermente più articolato.

## **Step 1: Seleziona tipologia**

In questa fase devi decidere la tipologia di analitico che vuoi configurare. Al momento è possibile creare un analitico di tre tipologie:

* tipo **custom-stock**, cioè un grafico con in ascissa una serie temporale;


![](img/stock.png)

* tipo **chart**, cioè un grafico non legato al tempo;


![](img/chart.png)

* tipo **chart-summary**, cioè un grafico nel quale vengono mostrate statistiche riguardanti una o più collezioni dati non legate al tempo.


![](img/chart-summary.png)

!!! note
    E' possibile fare grafici a più serie solo per i grafici di tipo *custom-stock*.


Cliccando su "next" si passa al prossimo step.


## **Step 2: Configurazione**

In questa sezione puoi scegliere:

* il **titolo** del grafico, che è un campo obbligatorio e non può contenere spazi bianchi;

* la **legenda** del grafico, che è un campo obbligatorio e può essere visibile o non visibile. La legenda mostra automaticamente alcune informazioni extra sull'analitico: il valore massimo del grafico (*max*), il valore minimo del grafico (*min*), la somma di tutti i valori del grafico (*sum*), la media dei valori del grafico (*avg*).

In questa fase, se si è scelto un grafico di tipo *chart*, si può scegliere un **ordinamento**. Le possibilità sono:

* *label-asc*, che ordina dalla A alla Z;

* *label-desc*, che ordina dalla Z alla A;

* *value-asc*, che ordina dal più piccolo al più grande;

* *value-desc*, che ordina dal più grande al più piccolo.


Cliccando su "next" si passa al prossimo step.

##**Step 3: Impostazione Serie**

In questa sezione si configurano la maggior parte delle proprietà dell'analitico:

* il **nome della serie**, che è un campo obbligatorio e non può contenere spazi bianchi;

* il **Tipo di grafico**. Le visualizzazioni dei dati possibili sono line, spline, area e column.

* il **Colore** del grafico;

* il campo **Euro**, che permette di impostare l'unità di misura del grafico automaticamente in euro;

*  la **Collezione**, dove si sceglie da quale collezione andare a prendere i dati che verranno mostrati nella serie, es. eroi_buoni;

* il **Filtro**, dove si può scegliere di applicare un filtro ai dati che si vogliono visualizzare dalla collezione. Per esempio sulla collezione ordini non si vogliono visualizzare tutti gli ordini, ma solo quelli con un fatturato maggiore di 30€. Questo campo non è obbligatorio ed è una query, quindi bisogna scrivere in formato json.

![](img/impostaz_serie1.png)

* **Group**, dove è possibile selezionare la proprietà su cui raggruppare i dati. Questo campo è obbligatorio per i grafici di tipo **chart** e **chart-summary**, ed è possibile selezionare tutte le proprietà di una collezione (es. nome);

* **GroupDate**,  dove è possibile selezionare la proprietà di tipo data su cui raggruppare i dati. Questo campo è obblogatorio per i grafici **custom-stock** ed è possibile selezionare solo le proprietà di tipo data (es.createdAt). Nel caso di grafici custom-stock, in questa fase saà possibile anche modificare il campo **formato dei dati**, per scegliere l'unità temporale su cui raggruppare e quindi visualizzare i dati. Il periodo di raggruppamento temporale può essere l'anno, il mese, la settimana, il giorno, l'ora oppure il minuto.

* l'**operatore**, dove si può scegliere l'operazione da svolgere sui dati raggrupati. Le operazioni possibili sono:


    * *count*: conta il numero di elementi di un gruppo;


    * *sum*: somma gli elementi di un gruppo (es. se ho raggruppato gli ordini per nome del cliente, l'operatore restituirà il totale degli ordini di ogni cliente)


    * avg: fa la media degli elementi di un gruppo (es. se ho raggruppato gli ordini per nome del cliente, l'operatore restituirà la media degli ordini di ogni cliente)


    * *last | first | min | max*: rispettivamente ritorna l'ultimo, il primo, i minimo e il massimo di ogni gruppo;


    * *constant*: ritorna in un gruppo la specifica stringa o costante numerica (default 1). Si può impostare una sola operazione per tracciato/serie.


* la **proprietà**. In questo campo trovi tutte le proprietà della collezione selezionata e puoi scegliere la proprietà che vuoi mostrare e su cui impostare l'operazione. Il campo è obbligatorio per tutti gli operatori, ad eccezione dell'operatore di *count* che conta automaticamente l'identificativo univoco degli elementi del gruppo.


In questa fase è anche possibile abilitare una mongoquery cliccando sullo **switch mongoquery abilitata / disabilitata**. Questo campo permette di scrivere una query su mongo per poter fare delle operazioni più complesse riferite all'operatore scelto (es. si vuole fare una somma sugli ordini di due clienti, ma solo se l'ordine è compreso tra i 50€ e i 100€). Il campo si attiva per tutti gli operatori, ad esclusione dell'operatore di count. Quando si attiva questo switch compare il campo **Type** dove si scrive in formato json la query.

![](img/impostaz_serie3.png)

Una volta che si è configurata una serie, è possibile inserire nello stesso grafico una seconda serie attraverso il bottone **"Aggiungi una serie"**.

!!! warning
    La seconda serie che si imposta avrà nuovamente tutti i campi sopra elencati, ma il **formato dei dati** dovrà essere lo stesso della prima serie.



Cliccando su "next" si passa alla fase successiva.

## **Step 4: Configura Asse Y**

La fase di configurazione dell'asse Y si ha solo nel caso di analitici con più serie. E' possibile scegliere di condividere l'asse Y tra i due grafici: questa scelta si fa quando le due serie hanno la stessa scala (numerica, ...). Nel caso in cui l'unità di misura del grafico sia euro si può selezionare automaticamente dal rispettivo switch. Infine si può inserire il titolo dell'asse Y.  

Cliccando su "next" si passa alla fase successiva.

## **Step 5: Avanzate**

Nelle avanzate è possibile scegliere l'arco temporale dei dati che si voglionon mostrare nell'analitico configurato. Nel caso di un grafico *custom-stock* alla voce **Zoom** si possono scegliere i sgeuenti formati: giorno, settimana, mese, trimestre, semestre, anno, tutto l'arco temporale disponibile.

Nel caso di un grafico *chart*, è possibile un **intervallo personalizzato** di visualizzazione dei dati: tramite una visualizzazione a calendario si possono scegliere la data di inizio e di fine.

![](img/avanzate_calendar.png)




Durante tutto il processo di configurazione tramite il bottone **Previous** è possibile tornare alla fase precedente per modificare i campi. Quando si ha finito di configurare l'analitico è necessario cliccare su **Done**. A questo punto si salva la configurazione su API Console e si deploya il branch nell'ambiente desiderato. A questo punto, accedendo al CMS nell' ambiente in cui si è deployato, sarà possibile vedere il proprio analitico.
