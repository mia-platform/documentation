---
id: extensions
title: Manage Extensions
sidebar_label: Manage Extensions
---

Le estensioni permettono di ampliare la sidebar della Console con nuove sezioni private rispetto alla Company e sono utili per integrare strumenti esterni che si possono embeddare dentro un iframe.

## Extension Manager

Le estensioni possono essere gestite attraverso un gestionale apposito alla voce `Extensibility` presente sulla pagina di Overview della Company ed è visibile e utilizzabile solo da chi ha il ruolo di Company Owner.

<!-- TODO: immagine placeholder -->

## Create Extension

Accedendo la prima volta in questa sezione o dalla tabella delle estensioni è possibile creare nuove estensioni cliccando sul bottone `Create Extension`. Si aprirà così un modale con i seguenti campi da compilare:

- `Extension name` (_required_): scegli un nome per la tua estensione
- `Entry URL` (_required_): inserisci un URL della pagina web che dovrà essere caricata accedendo al menu item della tua estensione e embeddata dentro un iframe
- `Destination Area` (_required_): seleziona la destinazione in cui verrà inserito il menu item della tua estensione
- `Category`(_required_): seleziona uno dei gruppi di menu che conterrà il menu item della tua estensione
- `Visibility`: metti un check sui contesti in cui vuoi rendere visibile la tua estensione. Se non è presente alcun check l'estensione risulterà disattiva.

:::info
Le categories options dipendono dalla destination area selezionata e se la destination area viene impostata su `Company Overview` allora la visibility potrà essere applicata solo sulla voce `Whole Company`.
:::

<!-- TODO: immagine create extension modal -->

Compilando i campi cosi come nell'esempio sopra, si potrà refreshare la pagina e verificare che l'estensione è stata aggiunta alla sidebar ed è accessibile.

<!-- TODO: immagine new extension -->

## Extensions Table

Se esiste almeno un estensione sulla sezione `Extensibility` si può consultare una tabella con tutte le estensioni esistenti sulla Company.

<!-- immagine tabella estensioni -->

Su questa pagina si può:
- creare nuove estensioni con il relativo bottone `Create Extension` in alto a destra 
- eliminare una delle estensioni in tabella cliccando sul relativo cestino
- accedere alla pagina di dettaglio di un estensione cliccando sul suo name 

## Extension Detail

La pagina di dettaglio di un estensione permette di consultare le informazioni principali che caratterizzano l'estensione registrate, che possono anche essere modificate attravero i relativi bottoni di `Edit`.  

<!-- immagine dettaglio estensione -->

### Extension Info

Sulla card di `Extension Info` si trovano le informazioni identificative dell'estensione, dei quali si possono modificare solo name e entry URL. 

<!-- immagine edit extension info -->

### Extension Location

Sulla card di `Extension Location` si trovano le informazioni relative al posizionamento del menu item dell'estensione all'interno della Console. Queste informazioni sono interamente modificabili con il relativo modale di modifica.

<!-- immagine edit extension location -->

### Extension Visibility

Sulla card di `Extension Visibility` viene indicato in quali contesti è attiva e visibile l'estensione. Questa informazione può essere modificata in qualsiasi momento dal relativo modale di modifica.

<!-- immagine edit extension info -->

:::info
Cosi come in creazione, la Visibility è vincolata alla Destination Area impostata sull'estensione, infatti se è stato impostata la Destination Area su `Company Overview` allora la visibility potrà essere applicata solo sulla voce `Whole Company`.
:::

<!-- immagine edit extension visibility -->
