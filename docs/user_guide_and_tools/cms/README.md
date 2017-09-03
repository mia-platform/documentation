CMS 
Guida all’utilizzo

[[TOC]]

# Cos’è il CMS

Un Content Management System (CMS) viene utilizzato per inserire, elaborare, pubblicare, cancellare i contenuti che vengono mostrati in un’app o in un sito.

# Accedere al CMS

Per poter accedere al CMS è sufficiente collegarsi da un normale Browser all’indirizzo: <nome-istanza>cms.baas.makeitapp.eu/app_dataentry/
Questa è la schermata iniziale dove inserire le credenziali: mail, password, key e secret.

![image_0](/uploads/3667a13b44cc54fb4ecbf2df9e861fd2/image_0.png)

## Tipologie di utenti

Possono accedere al CMS solo gli utenti *admin.*

Sul CMS esistono di default due tipologie di utenti: users (tutti gli utenti dell’app o sito) e admin (utenti dell’app abilitati ad accedere al CMS). 

In fase di definizione del progetto è possibile decidere di creare più gruppi di utenti. Avere una segmentazione degli utenti in più gruppi può essere utile per determinate attività di marketing e per l’invio di notifiche push a specifici gruppi. 

L’argomento Notifiche Push verrà approfondito nel paragrafo dedicato.

## Key e Secret

Queste due chiavi, insieme a user e password, sono necessarie per accedere al CMS e verranno fornite da Mia.

Esempio di chiavi:

KEY:
`771c47d353e1bd737c3927aa12a9337dabd7f5c48e69d243caaaa8b9801251a5ec4ea24d0827019dbcff21cfe39e3089ae2b42ff505992b7fe0c72641a8117e9173cedecab3b75cc9c284d8fbaae366bf91f851f3393ac6e9c15eab1819933eeaa006dc61bb7e08570e3baa9e2ea1f10ed32e169e4b60285d4ba97b159d4ad2ff266ae68d1acb25da8cc81a91f9245fb8111f101bd2ccebf62aa1229a95ca8e1f263b58ecae9a10dc9ed752d1c9b55422fe4ca3ed5a20c9e858a8f6c13504b5950143879f71acd5c5ec1a731f8978df66bd082f59cf49b381d04371bd6934b45050e4740b34a4dd62dcab34cf678771022cba1383458215e7c9e2bda672a852f`

SECRET:
6a84d1a0e92bbce2ee47bcfc138710b731e14572f5cd12b7d52d2fc003ea229487cd4fd7d495991ce90a98cfda779ee533562894b4f78e38e7ce9481165dc033b4c17e2572f8df5330d2c5794767f084fd3f278446695789911da8fc7627cd86409e0922d0413b033bde651bfd9bb76c87eb63e5e0820260ba6f2fc1aafac54c45c2ee28cce7bf01dd207dd501347627a8ebe67a9cae1d24716519757c440ae94b66172cee6777497f4f14b08a78e1c182be7149b65246e9c28756aaf65375dc148e0c7820eee3adcca14a8d20b8a641cab8c48d92ab0c811913f47da978c98f5a844db7b40e7c66fa692b249481b580cbf184b2e70460f007d064dfb4afade8


**N.B.** È importante che nel copia/incolla delle due chiavi non vengano aggiunti spazi o a capo, altrimenti non sarà possibile accedere al CMS.

# Dashboard

[text here]

# Gli elementi che compongono il CMS 

## I campi di input

### Inserimento testo

### ![image alt text](image_1.png)

### Campi di selezione

![image alt text](image_2.png)

### Campi required

Sono i campi obbligatori che se non popolati impediscono di salvare l’elemento. Sono contrassegnati dall’asterisco.

![image alt text](image_3.png)

### I tooltip

La "i" accanto al nome di un campo indica la presenza di un suggerimento (tooltip): passandoci sopra col mouse compare la descrizione di quel campo oppure le istruzioni su come popolarlo.

![image alt text](image_4.jpg)

### I campi data

![image alt text](image_5.png)

### Bottone di caricamento allegati

![image alt text](image_6.png)

### La paginazione

Nella parte bassa delle schermate sono presenti i controlli di paginazione utili per consultare il catalogo dei contenuti presenti nella collezione corrente.

![image alt text](image_7.png)

![image alt text](image_8.png)

### Il bottone di logout

Cliccando sulla freccia accanto allo username, comparirà il pop up di logout per eseguire il logout dal CMS.

![image alt text](image_9.png)

# Collezioni

Nel menu laterale del CMS è disponibile l’elenco delle *collezioni* organizzate in *categorie*.

Una collezione è un insieme di dati accomunati da alcune proprietà. Una categoria non è altro che un insieme che contiene le collezioni ed è utile solo all’ordinamento visuale del CMS.

Per rendere più immediato l’uso del CMS si consideri l’esempio seguente: un CMS per la gestione dei contenuti dell’app di una biblioteca con il servizio di prestito libri attivo.

Lo schema seguente esemplifica lo scheletro del CMS, composto da categorie, collezioni e proprietà applicandolo ad una ipotetica biblioteca.

![image alt text](image_10.png)

Eseguito il login nel CMS, il menù laterale mostra l’elenco delle collezioni gestibili.

La categoria Biblioteca raccoglie le collezioni Schede Libri, Prestito Libri e Lista Editori; la categoria Users contiene le collezioni Utenti e Recensioni; Tools include la collezione Media.

Ogni collezione presenta un insieme di dati accomunati da alcune proprietà:

ad esempio nella collezione Schede Libri sono raccolti i libri accomunati dalle proprietà: titolo, genere, autore, trama, immagine di copertina, data di pubblicazione, editore.

Le proprietà di una collezione possono essere visualizzate nella prima tabella e nella scheda di dettaglio del singolo oggetto che compare a destra quando si seleziona su un elemento (come da immagine che segue).

Nell’esempio dell’app biblioteca, nel menu laterale compaiono alcuni campi aggiuntivi che si è scelto di nascondere dalla vista principale dei contenuti della collezione perché proprietà secondarie o non era utile o funzionale vedere nella prima tabella, come la trama o l’immagine di copertina.

![image_11](/uploads/e103ffa08d69dd10f9f08c4bb4b45abe/image_11.png)

<table>
  <tr>
    <td>↑</td>
    <td>↑</td>
    <td>↑</td>
  </tr>
  <tr>
    <td>menu di navigazione fra le collezioni</td>
    <td>vista principale con l’elenco del contenuto presente nella collezione selezionata</td>
    <td>vista di dettaglio del singolo oggetto</td>
  </tr>
</table>


## Gestione dei contenuti

### Nuovo contenuto (draft / publish)

Se ad esempio si volesse aggiungere la scheda di un nuovo libro si procederà in questo modo:

* Collezione Schede Libri

* Clic su "add new" in alto a sinistra

![image alt text](image_12.png)

Si aprirà una finestra nella quale bisognerà compilare tutti i campi utili per la pubblicazione della scheda libro nell’app (le proprietà).

Si ricorda che:

* I campi con l’asterisco sono obbligatori.

* Passando il mouse sulla "i" si legge il tooltip, e cioè la descrizione di quel campo.

![image alt text](image_13.png)

Una volta creata e salvata la scheda libro, questa sarà in draft oppure direttamente pubblicata. 

Lo si riconosce dal simbolo![image alt text](image_14.png)(draft) oppure ![image alt text](image_15.png) (publish) .

In base al tipo di elemento che si deve pubblicare, sarà utile averlo prima in draft oppure direttamente pubblicato. 

*Esempio*: una nuova scheda libro che una volta pubblicata va direttamente nell’app sarà meglio averla prima in draft, in modo da poterne creare diverse e pubblicarle in un secondo momento. Un nuovo editore nella lista editori (vedi par. Lookup ecc) potrà essere direttamente pubblicato perché solo così comparirà nell’elenco di un’altra collezione.

Quando viene selezionato il simbolo *publish* oppure *draft* della riga interessata, compariranno 4 bottoni: **edit**, **trash**, **draft**, **publish**. 

![image alt text](image_16.png)

### Modifica del singolo contenuto (edit)

Cliccando su **edit **si aprirà la finestra con tutti i campi modificabili. 

La x in alto a destra chiude la finestra senza apportare modifiche.

Il tasto Back funziona come la x.

Il tasto Trash elimina la riga.

Il tasto Save salva le modifiche fatte. 

### Cancellare il singolo contenuto (trash)

Per eliminare una riga si clicca su **trash**. In questo modo la riga non sarà eliminata definitivamente: potrà essere recuperata cliccando su trash in alto sotto la barra di ricerca.

Qualsiasi contenuto cancellato dalla cartella trash, allora non sarà più recuperabile.

### Selezione massiva dei contenuti

![image alt text](image_17.png)

**Edit all** apporta la modifica a tutti gli elementi selezionati. 

Per cambiare il genere a più schede basterà selezionare tutte le schede che servono e cliccare su Edit All.

Si aprirà la finestra che segue, dove si possono selezionare i campi da modificare e che verranno applicati a tutti gli elementi.

![image alt text](image_18.png)

## Le Lookup

Le lookup servono per compilare i campi di una proprietà incrociando le informazioni da proprietà di altre collezioni.

Di seguito i vari casi di utilizzo:

*Menù a tendina **preimpostato *

Le lookup possono essere utilizzate per creare dei menù a tendina che possono essere molto utili per evitare errori nella compilazione dei campi. La scelta delle voci del menù avviene in fase di definizione del progetto.

*Menù a tendina modificabile*

Si potrebbe avere bisogno di aggiungere nel tempo elementi a un menu a tendina.

È il caso della lista degli Editori nell’esempio: creando un nuovo elemento nella collezione Lista Editori, questo comparirà nel menù a tendina della proprietà Editore della collezione Schede Libri.

Questo evita che ci siano errori di compilazione e quindi duplicati di editori.

![image alt text](image_19.png)

*Esempio*: se come editore si scrive Baldini & Castoldi per un libro e poi Baldini&Castoldi per un altro, i libri associati verranno considerati di due editori differenti.

*Informazione precompilata*

Nel campo proprietà di una collezione si potrà voler vedere solo determinate informazioni. Non più un menù a tendina quindi, ma un campo che viene popolato automaticamente prendendo le informazioni dalla proprietà di un’altra collezione.

Riprendendo l’esempio della Biblioteca: gli utenti si iscriveranno alla piattaforma con e-mail e username, ma abitualmente nell’app saranno riconoscibili attraverso solo username e con questo potranno scrivere le recensioni dei libri. 

Il personale che gestirà i contenuti sul CMS potrà vedere automaticamente anche l’indirizzo e-mail, non solo lo username. In questo caso quindi, il campo e-mail della collezione Recensioni sarà popolato grazie a una lookup che incrocia gli indirizzi e-mail associati allo username dalla collezione Utenti.

![image alt text](image_20.png)

## Importare / Esportare contenuti

Nel CMS si possono **importare/esportare** dati da file CSV oppure JSON cliccando sul triangolo accanto al nome della collezione in alto nel Cms. Comparirà un pop up dal quale scegliere se importare o esportare dati.

![image alt text](image_21.png)

## Visualizzare i contenuti

Dove sono presenti molti contenuti, ad esempio le tante schede libro di una biblioteca, si possono utilizzare i **filtri tab** in alto sotto alla barra di ricerca.

Si può così visualizzare tutto (All), solo gli elementi pubblicati (Publish), solo gli elementi in bozze (Draft) e infine gli elementi nel cestino (Trash).

![image alt text](image_22.png)

**	**

### Usare i filtri per la ricerca

Cliccando sul simbolo del filtro in alto a destra si può fare una ricerca avanzata, molto utile quando si hanno tanti dati da consultare. 

Da qui si può fare una ricerca per delle specifiche proprietà.

Se ad esempio si vogliono cercare tutti i libri editi da Baldini & Castoldi si procederà in questo modo:

* Primo campo: clic su Editore, che è la proprietà interessata

* Secondo campo: selezione di un comparatore, che in questo caso sarà *equals*

* Terzo campo: digito Baldini & Castoldi che è l’editore che voglio cercare.

I risultati della ricerca compariranno in tabella, sopra saranno presenti dinamicamente i diversi filtri attivi sulla ricerca corrente.

![image alt text](image_23.png)

Si possono inoltre aggiungere dei filtri di ricerca ulteriori che andranno ad aggiungersi a quella appena fatta.

*Esempio*: la ricerca di tutti i libri di Baldini & Castoldi pubblicati dal 1995.

![image alt text](image_24.png)

## Gestione dei media

Nella collezione Media vengono gestiti tutti gli *upload *sul CMS: immagini, video, pdf e altri allegati che possono essere richiamati nelle altre collezioni, o che sono stati caricati in altre collezioni e sono raccolti qua.

Si troveranno, ad esempio, tutte le copertine dei libri della collezione schede libri.

Come per gli altri contenuti, anche nei media si può selezionare un elemento e decidere se pubblicarlo, tenerlo in draft o eliminarlo. Si può inoltre ingrandire l’anteprima con il simbolo ![image alt text](image_25.png) oppure riscaricare il file con il simbolo ![image alt text](image_26.png) 

# Invio notifiche Push

Il CMS è abilitato a inviare notifiche push ai dispositivi degli utenti in due modalità.

1. Dalla collezione Push Notification. Cliccando su Push Notification si aprirà una finestra da compilare con il titolo, il messaggio della push e il gruppo di utenti cui inviarla 

![image alt text](image_27.png)

2. Dal tasto *send push* all’interno di una collezione. Serve per inviare una notifica su uno specifico elemento. Anche in questo caso si dovrà scegliere il gruppo di utenti cui inviare la notifica. 
Esempio: invio la notifica quando viene pubblicato un nuovo libro.

Se in fase di definizione del progetto è stato deciso di creare più gruppi di utenti, allora le push saranno abilitate anche per altre funzioni. 

Si potrà decidere ad esempio di creare dei gruppi dinamici ai quali inviare una notifica a due giorni dalla consegna del libro.

