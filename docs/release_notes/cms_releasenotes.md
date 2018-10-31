# CMS Release Notes

## v.7.0.14 (31 Oct 2018)
Abbiamo rilasciato le seguenti funzionalità:

* gestione delle **nuove interfacce rawObject e rawArray**
* **cambio delle etichette** nelle azioni di Pubblica ed Elimina
* fix alla gestione delle **icone** 

##v7.0.11 (04 Oct 2018)

In questa versione del CMS è possibile selezionare le **icone da font-awesome fino alla versione v.5.3.1**, che è l'ultima versione supportata (qui si trova il [link](https://fontawesome.com/icons?d=gallery) per le icone).

!!! warning
    Se si scelgono icone che erano già utilizzate nella versione precedente, si continueranno a visualizzare nel CMS le icone vecchie. Questo perchè si dà priorità alla retrocompatibilità.


##v7.0.9 (24 Sept 2018)

In questa versione del CMS sono state rilasciate le seguenti evolutive:

* Fix all'**opacità** e al layout di **bulk** edit.

* Possibilità di **personalizzare il colore dello spinner** di caricamento e **delle scritte della legend degli analitici**.


##v7.0.7

In questa versione del CMS sono state rilasciate le seguenti evolutive:

* possibilità di fare delle **query complesse nella visualizzazione di una proprietà**. A questo [link](https://docs.mia-platform.eu/configurator/conf_cms/#propertiesjson) potrai visualizzare degli esempi.

* creazione di un nuovo tipo di bottoni da inserire nella card. Sono stati creati i bottoni link, che anzichè avere come azione una chiamata rest hanno un link. Sono già disponibili tre bottoni da riutilizzare in tutti i progetti: i bottoni **Invia Mail**, **Chiama Skype** e **Chat Skype**. A questo
[link](https://docs.mia-platform.eu/configurator/conf_cms/#1-configurare-le-card) potrai leggere la configurazione dei bottoni.


##v7.0.4

In questa versione sono state rilasciate delle nuove personalizzazioni del CMS.

Sarà infatti possibile definire le seguenti variabili di css:

* color brand gradient 1= permette di personalizzare il colore del **testo nella sidebar del menù**
* color badge - bg notification= permette di personalizzare il **background color dei badge delle notifiche**
* color badge - text notification= permette di personalizzare il colore del **testo del badge delle notifiche**

Inoltre da questa versione il font del CMS sarà in **Proxima-nuova**


## v7.0.0 - Breaking Change (per le Card)
Con la versione 7 sono state rilasciate 3 funzionalità importanti:

1) la **nuova struttura delle Card** con la possibilità di configurare diversi tipi di widget e avere una struttura interamente personalizzabile. Puoi leggere la Documentazione su come configurare le nuove card [qui](https://docs.mia-platform.eu/configurator/conf_cms/#1-configurare-le-card).

2) la funzione di **highlight** è evoluta. Con questa versione è possibile evidenziare delle righe del CMS scrivendo una query e l'utente può configurare anche i colori per evidenziare la riga (colore del testo e dello sfondo). A questo [link](https://docs.mia-platform.eu/configurator/conf_cms/#3-configurare-gli-highlight) un esempio di highlight.

3) è stata aggiunta la possbilità di avere delle **notifiche** nel menù. Leggere a questo [link](https://docs.mia-platform.eu/configurator/conf_cms/#2-configurare-le-notifiche) la documentazione per visualizzare un esempio.


## v6.1.0

Con la versione 6.1.0 abbiamo rilasciato nuove funzionalità nell'area export del CMS.
Da questa versione sarà infatti possibile:

1. **Scegliere se esportare la label o l'id**:  quando esporterai un file visualizzerai un caso le tue proprietà con l'id in un altro con la label. Quesat funzionalità ti permette di avere dei file più leggibili qualora gli id non fossero chiari.
2. **Scegliere il delimitatore**: potrai scegliere se esportare un file con delimitatore la , o il ; . Questa funzionalità permette a chi utilizza excel di avere una conversione immediata da .csv a excel
