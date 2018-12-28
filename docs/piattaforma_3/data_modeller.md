# Guida al Datamodeller #
Il Datamodeller è l'interfaccia utente per gli sviluppatori.

#Come configurare il CMS tramite il Datamodeller #
Il Datamodeller è lo strumento principale per riuscire a configurare il proprio CMS con semplicità.

Se vuoi approfondire la sua struttura [leggi la nostra guida del CMS](https://docs.mia-platform.eu/user_guide_and_tools/cms/)

# Le Collezioni #

La Collezione è la struttura principale del CMS

## Come creare una collezione ##
Nel menù in basso a sinistra troverai un bottone con su scritto **Aggiungi nuova (alt+shift+C)**

A questo punto ti si aprirà una modale da compilare.

Facciamo un esempio: vuoi creare la collezione **Libri**

Nel campo `nome` dovrai inserire il nome della collezione che vorresti salvare sul database. Nel nostro caso sarà **libri**

Nel campo `Label` dovrai invece inserire il nome che vorresti che apparisse nel CMS. Nel nostro caso sarà **Libri**

Con `Layout` puoi decidere il Layout che vorrai dare alla tua collezione. *Table* è la modalità di visualizzazione più classica a tabella. *TableUser* è la modalità di visulizzazione per gli utenti. Ha infatti un campo speciale *Reset Password* all'inizio della tabella. *TablePush* invece è la tabella perfetta per le push notification o per inviare notifiche ai clienti. A fianco della tabella troverai sempre un tasto *Push* per inivare il contenuto ai tuoi clienti. Se selezioni *Card* ogni oggetto sarà rappresentato simile a una Card. *Gallery* è invece la rappresentazione perfetta per le immagini.

Nel nostro caso sceglieremo *Table*.

`DefaultStatus`può invece essere o *Draft* o *Publish*. Se selezioni *Draft* una volta che caricherai un elemento non verrà pubblicato automaticamente sui tuoi applicativi, ma dovrai dargli successivamente il comando pubblica. Se selezioni invece *Publish* ogni volta che modifichi o che carichi un elemento verrà pubblicato automaticamente. Nel nostro caso metteremo *Draft*.

Troverai poi la possibilità di spuntare `DefDelete`. Se lo abiliti gli elementi non andranno in trash dove potrai comunque recuperarli, ma verranno elimininati definitivamente.

Nel campo `Icon` potrai scegliere con quale icona caratterizzare la tua collezione. Abbiamo una libreria di icone dalle quale potrai scegliere. Nel nostro caso per i libri scegliamo l'iconcina **book**.

Uno degli ultimi campi è `Categoria`. Per *Categoria* si intende il nome della categoria in cui inserire le diverse collezioni. Noi potremmo quindi o creare una categoria nuova con un nuovo nome (importante il nome deve essere univoco!).

Es. di una nuova categoria. Voglio creare la categoria *Libri*
sarà: `{"name": "Libri","order":30}`. **"order":30** è l'ordine della categoria dentro il CMS.

*Ti consigliamo di mettere sempre cifre dell'ordine delle decine.* Ti capiterà infatti ti volere inserire in futuro altre collezioni o categorie. Se prima per esempio avremmo avuto già una categoria in ordine 3 per posizionare questa avremmo dovuto cambiare anche tutte le altre a cascata. Con le decine invece basta mettere un numero intermedio.

Nel caso invece in cui tu sappia già in che Categoria inserirlo ti basterà ricopiare il nome della categoria prescelta sempre con lo stesso formato. Se volessimo quindi inserirla dentro una categoria chiamata General già esistente sarà:

 `{ "name"  : "General", "order" : 0 }`

 Poi dovrai selezionare `Hidden`se vuoi che sia nascosta. e `Blocked`se vuoi che sia bloccata. Ovvero che nessuno possa modificarla.

 Gli ultimi due campi sono: `Order` che indica l'ordine all'interno della categoria e `Highlight`. Per `Order`ti consigliamo di usare sempre la regola delle decine. Nel nostro caso mettermo 10 per averla come prima.

 Non ti resta ora quindi che premere `Crea`.

## Aggiungere proprietà a una nuova collezione ##

Una volta creata una collezione devi aggiungere le proprietà che andranno a caratterizzare quella collezione.

Nel nostro caso le proprietà della collezione Libri saranno: il titolo, l'autore, la casa editrice e il prezzo.

Quando apriamo la schermata della proprietà dovremmo compilare i seguenti campi:

`Nome`: va inserito il nome della proprietà, in camelCase. Nel nostro caso sarà **titolo**

`Tipo`: le proprietà possono essere di diversi tipi: *string* se è una classica stringa di testo; *number* se è un numero; *date* se è una data con gg/mm/aaaa; *datetime* è invece una data completa con anche ore, minuti e secondi; *boolean* se può essere solo true o false; *text* se vogliamo che il contenuto venga letto come html; *textArea* se è un campo di testo, quindi ad esempio una descrizione; *Lookup* servono per poter selezionare alcuni valori o tra una gamma di valori scelti da me o tra una gamma di valori presi da un'altra collezione. Se ti interessa il tema delle Lookup più sotto troverai una sezione dedicata; *Multilookup* se vuoi selezionare più valori; *Array* se lo vuoi salvare come un insieme ordinato di proprietà; *oggetto* è un insieme di proprietà non ordinato; *Geopoint* se vuoi che salvi un luogo preciso; *Files* se è un file come ad esempio un immagine o un pdf.
Nel nostro caso sceglieremo **string** volendo semplicemente scrivere il nome del titolo.

`Label`: è l'etichetta che vuoi dare alla tua proprietà, nel nostro caso può essere: **Titolo**

`Property description`: è una breve descrizione della proprietà. Es: è il titolo del libro

`CmsOrder`: è l'ordine che gli vuoi dare all'interno della collezione. nel nostro caso sarà il primo, quindi scrivermo **10**

`CmsVisibility`: indica a che livello del CMS vuoi mostrare una proprietà. I livelli possono essere: **0** e non è visibile; **1** ed è visibile nella tabella principale; **2** ed è visibile quando clicci nella tabella, nella zona destra del tuo CMS, al livello 2 tendenzialmente si mettono le informazioni non prioritarie, ma che portano valore, gli approfondimenti. Nel nostro caso mettermo **1** in quando l'informazione è prioritaria.

`New`

`Edit`

`CmsEditable`: se selezioni true se vuoi poter modificare il tuo dato da CMS. Nel nostro caso si. Quindi lo selezioneremo.

`Required`: se vuoi che il dato sia obbligatorio. Nel nostro caso il titolo è obbligatorio, quindi selezionerò required.

`CmsCardPosition`: questo campo lo devi riempire solo se la tua collezione ha come layout la Card e devi scegliere l'ordine della posizione, altrimenti puoi non compilarlo.

Alla fine non ti resta che premere **Aggiungi Proprietà** e la proprietà verrà aggiunta alla tua collezione.

## Aggiungere un elemento da Datamodeller ##

Una volta create tutte le proprietà della nostra collezione è ora possibile aggiungere degli elementi. Puoi anche aggiungerli da CMS.

Nel menù laterale troverai la tua collezione con le proprietà che hai appena creato. In alto a destra troverai scritto: **Aggiungi elemento**

A questo punto ti appararià una tabella da compilare. Per ogni proprietà data dovrai scrivere un valore. Andando avanti con l'esempio dei libri proviamo a caricare *Il nome della Rosa* di Eco.

Una volta compilati i campi hai due possibilità:

* Aggiungi elemento: continui ad aggiungere elementi
* Salva gli elementi nella collezione: salvi l'elemento che hai appena caricato

Nel nostro caso faremo salva, ed ecco comparire l'elemento nella collezione.

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


##Inline Source##
Con la lookup Inline Source scelgo io i valori da far comparire all'interno della lookup. Per fare un esempio sempre restando nell'ambito libri. Voglio selezionare delle categorie di Libri e non ho nessuna collezione di riferimento.

Cosa bisogna fare?

Sotto il campo Inline Source scrivo i diversi valori che voglio far comparire in questo modo:

- **[{"label": "Gialli", "value":1}, {"label": "Romantici", "value":2}]**

Con **label** indico l'etichetta che voglio far comparire.

Con **value** indico l'odine di comparsa nella nostra lookup.

A questo punto in **Text** sotto **Properties** andremo a scrivere *label* e come sempre se abbiamo un *Delimiters* lo andremo ad indicare nell'apposito spazio

Il comportamento degli altri valori è uguale a quello delle Look a Collection.
