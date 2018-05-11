# GIT Vademecum #

GIT è un sistema di controllo di versione distribuito che facilita le attività di Mia-Platform. Questo vademecum riassume i principali comandi e linee guida di GIT per semplificarti il lavoro.

## INSTALLA GIT ##
Comincia ad usare Git installandolo sul tuo PC.

https://git-scm.com/downloads

## CONFIGURAZIONI INIZIALI ##
Configura le informazioni degli utenti valide per tutti i repository.

<span style="color:blue"> $ git config --global user.name "[name]"

Imposta l’username (nome.cognome) che vuoi mostrare sulle tue commit.

<span style="color:blue"> $ git config --global user.email "[email address]"

Imposta l’email aziendale che vuoi mostrare sulle tue commit.

## CONFIGURAZIONI CONSIGLIATE ##
Ti consigliamo una serie di configurazioni che potrebbero aiutarti nel tuo lavoro.

<span style="color:blue"> $ git config --global fetch.prune true

Imposta il fetch.prune come attivo. Ti permette di mantenere allineati i branch in remoto con i tuoi branch locali.

<span style="color:blue"> $ git config --global pull.rebase true

Imposta il rebase automatico al pull. Ti permette di evitare merge inutili su un branch se si lavora in più di una persona sullo stesso branch.

<span style="color:blue"> $ git config --global rebase.autoStash true

Imposta l’autostash come true nelle configurazioni iniziali. Unito alla configurazione precedente ti permette di eseguire un pull anche con delle modifiche non committate.

<span style="color:blue"> $ git config --global alias.gr 'log --graph --full-history --all --color --tags --decorate --pretty=format:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s %x1b[33m%aN <%ae>%x1b[0m (%aI)"'

Colora il tuo GIT per una migliore visualizzazione della history.


## CREA REPOSITORIES ##
Inizia con un nuovo repository o scarica le informazioni da un URL esistente.

<span style="color:blue"> $ git init [project-name]

Crea un nuovo repository locale con il suo nome specifico.

<span style="color:blue"> $ git clone [url]

Scarica un progetto e la sua intera cronologia.

## EFFETTUA MODIFICHE ##
Rivedi i cambiamenti al codice e prepara una commit.

<span style="color:blue"> $ git status

Elenca tutti i file, nuovi o modificati, da committare.

<span style="color:blue"> $ git diff

Mostra le differenze tra i file che sono stati aggiungi e non ignorati nell’area di staging.

<span style="color:blue"> $ git add [file]

Aggiungi i file nuovi e prepararli per il commit.

<span style="color:blue"> $ git diff --staged

Mostra le differenze dei file tra lo staging e ultima modifica.

<span style="color:blue"> $ git reset [file]

Rimuovi un file dall’area di staging, ma mantieni le modifiche.

<span style="color:blue"> $ git commit -m"[descriptive message]"

Aggiungi il file nell’head del repository locale.

<span style="color:blue"> $ git push

Carica tutti i branch locali sul repository remoto.

##GESTISCI I BRANCH ##
Nomina i tuoi commit e uniscili quando hai terminato.

<span style="color:blue"> $ git branch

Elenca tutti i branch nel repository corrente.

<span style="color:blue"> $ git branch [branch-name]

Crea un nuovo branch.


<span style="color:blue"> $ git checkout [branch-name]

Passa al branch specificato e aggiorna la directory corrente.

<span style="color:blue"> $ git merge [branch-name]

Unisci lo storico del branch specificato con quello corrente.

<span style="color:blue"> $ git branch -d [branch-name]

Elimina il branch specificato solo se è stato unito a master.

## Fai refactoring dei tuoi file ##
Ricerca e rimuovi file dallo storico.


<span style="color:blue"> $ git rm [file]

Rimuovi un file dalla directory e prepara l’eliminazione definitiva.

<span style="color:blue"> $ git rm --cached [file]

Elimina il file da GIT, ma mantieni il file locale.


## RIMUOVI I FILE DALLO STORICO ## aa
Escludi file e percorsi temporanei.

<span style="color:blue"> *.log
build/
temp-*

Un file di testo chiamato .gitignore previene il versioning accidentale di file o directory secondo un pattern specificato.

<span style="color:blue"> $ git ls-files --others --ignored --exclude-standard

Elenca tutti i file ignorati in questo progetto.

##SALVA TUTTE LE MODIFICHE ##
Archivia e ripristina cambiamenti incompleti. Utile per scaricare da remoto le modifiche mentre stai lavorando e non vuoi fare ancora commit e push oppure per cambiare da un branch all’altro senza fare commit prima.

<span style="color:blue"> $ git stash

Archivia temporaneamente tutti i file modificati così puoi fare un git pull remoto e scaricare le modifiche fatte dalle altre persone del team.

<span style="color:blue"> $ git stash pop

Ripristina dall’archivio di stash tutti i file messi in stash. In questo modo puoi fare il merge con le modifiche scaricate da remoto con il pull.

<span style="color:blue"> $ git stash list

Elenca i file modificati archiviati in stash.

<span style="color:blue"> $ git stash drop

Elimina i file archiviati in stash.

## RIVEDI LA CRONOLOGIA ##
Sfoglia e controlla l’evoluzione dei file di ogni progetto.

<span style="color:blue"> $ git log

Visualizza lo storico dei commit del branch corrente.

<span style="color:blue"> $ git log --follow [file]

Visualizza lo storico di un file, incluse le modifiche.

<span style="color:blue"> $ git diff [first-branch]...[second-branch]

Mostra la differenza tra due branch.

<span style="color:blue"> $ git show [commit]

Mostra i metadati e i cambiamenti effettuati per uno specifico commit.

## ANNULLA I COMMIT ##
Elimina gli errori e altera lo storico dei cambiamenti.

<span style="color:blue"> $ git reset [commit]

Annulla tutte le commit effettuate dopo [commit], preservando i cambiamenti locali.

<span style="color:blue"> $ git reset --hard [commit]

Elimina tutto lo storico e i cambiamenti fino alla commit specificata.

## Sincronizza le modifiche ##
Collegati a un URL remoto e ottieni lo storico dei cambiamenti.

<span style="color:blue"> $ git fetch [remote]

Scarica lo storico dei cambiamenti dal repository remoto.

<span style="color:blue"> $ git merge [remote]/[branch]

Unisci il branch remoto con quello locale.

<span style="color:blue"> $ git push -u [remote] [branch]

Carica tutti i cambiamenti al branch locale sul repository remoto.

<span style="color:blue"> $ git pull

Aggiorna la tua repository locale con quella online.
