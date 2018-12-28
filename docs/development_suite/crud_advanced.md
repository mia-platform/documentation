##Creare una nuovo CRUD
Immaginiamo di dover creare una nuova collezione che contenga i libri di una biblioteca e andiamo a capire quali sono i passaggi da svolgere.

Per creare una nuova collezione bisogna selezionare **Collezioni** sulla sinistra e selezionare **Add new**.

Per prima cosa è necessario inserire il nome della collezione in camelCase, nel nostro caso inseriremo "libri".

Di default ci sono dei campi che non possono essere modificati: _id, creatorId, createdAt, updaterId, updatedAt, _STATE_

L’utente potrà aggiungere una nuova riga selezionando **aggiungi riga**. Dopodichè dovrà completare i seguenti campi:

![Crea-collezione-riga-titolo](img/Crea-collezione-riga-titolo.PNG)

* **Nome**: inserire il nome della proprietà, in camelCase, nel nostro caso inseriremo “titolo”, "autore", "anno" etc.

* **Tipo**: le proprietà possono essere di diversi tipi: *string* se è una classica stringa di testo (oppure un immagine); *number* se è un numero; *date* se è una data con gg/mm/aaaa; *boolean* se può essere solo true o false;*Geopoint* se si desidera salvare un luogo preciso; *Array* se si desidera salvare come un insieme ordinato di proprietà; *Object* se si desidera inserire un oggetto.

* Se selezioni **required** la proprietà è obbligatoria.

* Se selezioni **crypted** il dato verrà criptato nel database. Consigliamo di adottare questa pratica per dati sensibili o riservati.

* Se selezioni **nullable** è possibile dare al dato il valore *null*.

* Nel campo **descrizione** è possibile inserire una breve descrizione facoltativa.

Per creare la collezione selezionare **crea**.

!!! Warning
    la collezione **non è ancora salvata** è necessario svolgere i passaggi descritti di seguito

![tabella_prop](img/tabella_prop.PNG)

Se si desidera eliminare una riga selezionare la riga e selezionare **cancella** (vicino ad "aggiungi riga").

Una volta creata la riga di default viene data la possibilità all'utente di crearne un'altra. Una volta finito di creare tutte le righe necessarie, è sufficente premere un qualsiasi altro punto dello schermo per uscire dalla sezione aggiungi riga.

Per **modificare una collezione** è sufficiente selezionare la collezione desiderata tra l’elenco in “collection” e modificare i campi nella schermata che viene visualizzata.

###Indici
Un indice (nel campo dei database) è una struttura dati realizzata per **migliorare i tempi di ricerca (query) dei dati**. Se una tabella non ha indici, ogni ricerca obbliga il sistema a leggere tutti i dati presenti in essa. L'indice consente invece di ridurre l'insieme dei dati da leggere per completare la ricerca.Tuttavia la creazione di un indice comporta una **riduzione  nelle performance di scrittura**.

Per creare un nuovo indice selezionare **crea un nuovo indice**.

Una volta inserito il nome dell'indice l'utente dovorà scegliere il tipo selezionando tra: *normal, geo e hash*. Dopodichè l'utente potrà scegliere se rendere unico l'indice selezionando **unique**.

![Indice](img/Indice.PNG)
