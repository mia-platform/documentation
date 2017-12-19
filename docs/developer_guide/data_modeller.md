[TOC]

# Le Look up #

Le lookup servono per compilare i campi di una proprietà incrociando le informazioni da proprietà di altre collezioni.

Esistono varie tipologie di Lookup configurabili da Data Modeller:
* Look a Collection
* Inline Source

## Look a Collection ##
Questo tipo di lookup permette di “chiamare” la proprietà di una collezione e mostrarla all’interno di un'altra proprietà.

Ad esempio: nella collezione Schede Libri, alla proprietà Editore, si vuole mostrare l'elenco degli editori che sono originariamente stati creati nella collezione Editori alla proprietà Nome Editore.

Cosa bisogna fare?

Dopo aver selezionato Look a Collection nel secondo campo scrivere il **nome delle collezione** dalla quale vogliamo prendere i valori. Nel nosto caso ad esempio: editori.

Come **Value** va poi inserito quale valore vogliamo salvare. *Per convenienza è sempre meglio salvarsi l'ID della collezione.*
Quindi nel nostro caso sarà: idEditori.

A questo punto va inserito cosa vogliamo far apparire della collezzione Editori al nostro utente. Noi volevamo far comparire il nome dell'Editore.

In **Text** andremo quindi a indicare come **Properties**: **nome**
e nel caso in cui volessimo far vedere due proprietà differenti, come ad esempio nome e luogo possiamo anche scegliere un delimitatore (**Delimiters**) che può essere uno spazio bianco, un - , un ; , e così via.

Nel Datamodeller abbiamo poi la possibilità di fare una **Query** specifica su quella collezione. Ad esempio vorremmo far comparire solo i nomi di editori con sede a Milano.

Con **Limit** possiamo invece porre un numero massimo di elementi da mostrare in tendina. Se vorremmo far vedere solo 5 editori scriveremmo 5

Abbiamo poi ancora 3 opzioni di scelta:

**Reset**: se vogliamo che si resetti

**AutoSelect**: se vogliamo che selezioni automaticamente il primo valore

**SearchLive**: se vogliamo che mentre scriviamo ci compaiano i risultati (es: scrivo A e mi compaiono sotto le case editrici che cominciano per A)

##Inline Source##
Con la lookup Inline Source scelgo io i valori da far comparire all'interno della lookup. Per fare un esempio sempre restando nell'ambito libri. Voglio selezionare delle categorie di Libri e non ho nessuna collezione di riferimento.

Cosa bisogna fare?

Sotto il campo Inline Source scrivo i diversi valori che voglio far comparire in questo modo:

**[{"label": "Gialli", "value":1}, {"label": "Romantici", "value":2}]**

Con **label** indico l'etichetta che vuoi far comparire.

Con **value** che ordine devono avere nella nostra lookup.

A questo punto in **Text** sotto **Properties** andremo a scrivere *label* e come sempre se abbiamo un *Delimiters* lo andremo ad indicare

Il comportamento degli altri valori è uguale a quello delle Look a Collection
