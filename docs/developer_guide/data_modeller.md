# Guida al Datamodeller #
Il Datamodeller è l'interfaccia utente per gli sviluppatori.

#Come configurare il CMS tramite il Datamodeller #
Il Datamodeller è lo strumento principale per riuscire a configurare il proprio CMS con semplicità.

Se vuoi approfondire la sua struttura [leggi la nostra guida del CMS](https://docs.mia-platform.eu/user_guide_and_tools/cms/)

# Le Collezioni #

La Collezione è la struttura principale del CMS

## Come creare una collezione ##
Nel menù in basso a sinistra troverai un bottone con su scritto **Aggiungi nuova (alt+shift+C)**

Immagine

A questo punto ti si aprirà una modale da compilare.

Facciamo un esempio vuoi creare la collezione **Editori**

Nel campo `nome` dovrai inserire il nome della collezione che vorresti savare sul database, quindi dovrà essere scritto tutto in minuscolo. Nel nostro caso sarà **editori**

Nel campo `Label` dovrai invece inserire il nome che vorresti che apparisse nel CMS. Nel nostro caso sarà **Editori**

Con `Layout` puoi decidere il Layout che vorrai dare alla tua collezione. *Table* è la modalità di visualizzazione più classica. *TableUser* è .... e *TablePush* e--- . Se selezioni *Card* ogni oggetto sarà rappresentato simile a una Card. *Gallery* è invece la rappresentazione perfetta per le immagini.

Nel nostro caso sceglieremo *Table*

`DefaultStatus`può invece essere o *Draft* o *Publish*. Se selezioni *Draft* -------. Se selezioni invece *Publish*-----




# Le Look up #

Le lookup servono per compilare i campi di una proprietà incrociando le informazioni da proprietà di altre collezioni.

Esistono varie tipologie di Lookup configurabili da Data Modeller:

- Look a Collection
- Inline Source

## Look a Collection ##
Questo tipo di lookup permette di “chiamare” la proprietà di una collezione e mostrarla all’interno di un'altra proprietà.

Ad esempio: nella collezione Schede Libri, alla proprietà Editore, si vuole mostrare l'elenco degli editori che sono originariamente stati creati nella collezione Editori alla proprietà Nome Editore.

Cosa bisogna fare?
Dopo aver selezionato Look a Collection nel secondo campo scrivere il **nome delle collezione** dalla quale vogliamo prendere i valori. Nel nosto caso ad esempio: editori.

Come **Value** va poi inserito quale valore vogliamo salvare. Il value che va insierito deve essere un valore univoco, tendenzialmente è quindi buona pratica salvarsi l'Id della collezione.
Quindi nel nostro caso sarà: idEditori.

A questo punto va inserito cosa vogliamo far apparire della collezione Editori al nostro utente. Noi volevamo far comparire il nome dell'Editore.

In **Text** andremo quindi a indicare come **Properties**: **nome**
e nel caso in cui volessimo far vedere due proprietà differenti, come ad esempio nome e luogo possiamo scegliere un delimitatore (**Delimiters**) che può essere uno spazio bianco, un - , un ; , e così via.

Nel Datamodeller abbiamo poi la possibilità di fare una **Query** specifica su quella collezione. Ad esempio vorremmo far comparire solo i nomi di editori con sede a Milano.*Inserire Link*

Con **Limit** possiamo invece porre un numero massimo di elementi da mostrare in tendina. Se vorremmo far vedere solo 5 editori scriveremmo 5.

Abbiamo poi ancora 3 opzioni di scelta:

- **Reset**: se vogliamo che si resetti, ovvero dopo aver compilato la cella se vogliamo svuotarla

- **AutoSelect**: se vogliamo che selezioni automaticamente il primo valore

- **SearchLive**: se vogliamo che mentre scriviamo ci compaiano i risultati (es: scrivo A e mi compaiono sotto le case editrici che cominciano per A)

![Look a collection](\img\look-a-collection.PNG)

##Inline Source##
Con la lookup Inline Source scelgo io i valori da far comparire all'interno della lookup. Per fare un esempio sempre restando nell'ambito libri. Voglio selezionare delle categorie di Libri e non ho nessuna collezione di riferimento.

Cosa bisogna fare?

Sotto il campo Inline Source scrivo i diversi valori che voglio far comparire in questo modo:

- **[{"label": "Gialli", "value":1}, {"label": "Romantici", "value":2}]**

Con **label** indico l'etichetta che voglio far comparire.

Con **value** indico l'odine di comparsa nella nostra lookup.

A questo punto in **Text** sotto **Properties** andremo a scrivere *label* e come sempre se abbiamo un *Delimiters* lo andremo ad indicare nell'apposito spazio

Il comportamento degli altri valori è uguale a quello delle Look a Collection.

![Inline Source](\img\inline-source.PNG)
