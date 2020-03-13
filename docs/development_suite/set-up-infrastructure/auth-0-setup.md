# Configurare Auth0

Una volta che hai creato il tuo progetto e vuoi abilitare la gestione degli utenti sul tuo Headless CMS o su un altro applicativo dovrai seguire questa breve guida.

## Prerequisiti

Prima di leggere questa guida assciurati di avere le seguenti condizioni:

* nel tuo progetto devi avere tra i servizi attivi l'auth0-client;
* devi avere l'accesso ad Auth0 per poterlo configurare;
* devi creare un nuovo tenant su Auth0 con il nome del tuo cliente.

## Step 1. Creazione degli applicativi

Per gestire i tuoi utenti su Auth0 dovrai creare due applications:

1. il primo di tipologia **Regular Web Application** con un nome che identifichi il tuo applicativo. Es: Name CMS. Se hai le applicazioni differenziate permbiente, ovviamente dovrai creare per ogni ambiente un applicativo;
2. il secondo di tipologia **M2M** per la gestione degli utenti. Ti consigliamo di chiamarlo infatti "User Management CMS".

## Step 2. Configurazione delle pagine di callback

Sempre su Auth0, accedi nella tua Regular Application e nella sezione settings imposta:

  * **allowed callback url**: indica dove auth0 ti rimanda dopo aver fatto la login. Per il cms il valore da utilizzare è `BASE_URL/web-login/callback`;
  * **allowed web origin**: lista degli allowed origins da cui poter fare la login;
  * **allowed logout url**: indica la callback url della logout. Per il cms il valore da utilizzare è `BASE_URL/web-login`.

  [img](!)

Va anche configurato l' **allowed logout url** a livello di Tenant, accedi quindi sui settings del tenant (li trovi in alto a destra, dove c'è l'icona del tuo utente) e nell'area advanced (l'ultimo tab sulla destra) insierisci gli stessi **allowed logout url** che hai configurato sull'applicazione.

## Step 3. Configuriamo un Database per ciascun ambiente

Di default Auth0 ha attivo solo Database (lo trovi nel menù Connections, sezione Database), se volessimo avere un database unico per tutti gli utenti quindi possiamo anche non seguire questo step. 

Per creare invece più ambienti dobbiamo invece creare più database, uno per ogni ambiente. 
Per crearli, una volta acceduto tramite il menù alla sezione Connections e Database, cliccare su Create DB Connection e impostare un nome per il database che si sta creando.

!!! Warning
N.B. Fai attenzione a disabilitare la possibilità di signup (impostazione **Disable Sign Ups**) se non vuoi che gli utenti possano registrarsi autonomamente alla tua applicazione!

Una volta creato il database devi associare ad ogni applicazione il suo DB.
Per farlo, dal database appena creato vai nella sezione *Applications* e abilita le applicazioni che possono usare quel database.

## Step 4. Configuriamo la login social

Questo passaggio dipende interamente dal tuo business e da quello che vorrai far fare ai tuoi utenti. 

!!! Warning
Di default Auth0 abilita anche la login con Google. Per disabilitarla, vai su *Connections*, *Social* e disattiva lo switch Google, che dovrebbe essere abilitato.  

All'interno delle *Applications* nella sezione **Connections** potrai scegliere per ogni applicativo che social login attivare o disattivare. 
Per gestire invece le login Social a livello globale all'interno della sezione **Connections** troverai la pagina **Social** scegli cosa abilitare e cosa no. 

[img-social](!)

## Step 5. Gestione dell'applicativo User Management

Per completare la gestione degli utenti da parte del nostro applicativo:

1. Creare una API: vai nella sezione APIs e crea una API che abbia come identifier l'URL del tuo backoffice.      
2. Accedo alla applicazione User Management creata per la gestione degli utenti e autorizzo l'API Auth0Management andando a definire nell'area permission quali azioni voglio far fare sul mio applicativo. 
Per la gestione degli utenti, dovrei abilitare tutti i ruoli che trovo filtrando per *user*

[img](!)

3. Ultimo passagio devo creare una RULES custom per abilitare l'accesso del nostro namespace alla gestione degli utenti. 
Accedi quindi alla sezione **Rules** - **Create Rules** - **Empty-Rules**, inserisci il nome *inject-id-token* e copi la seguente funzione:

```javascript
function (user, context, callback) {
  const namespace = configuration.MIA_NAMESPACE;
  if (!user.app_metadata) {
    console.warn("WARNING: user.app_metadata is empty");
		return callback(null, user, context);
  }
  context.idToken[namespace + 'app_metadata'] = user.app_metadata;
  context.idToken[namespace + 'user_metadata'] = user.user_metadata;
  return callback(null, user, context);
}
```

4. Sempre nella sezione RULES, nei settings c'è la possibilità di aggiungere delle variabili. Devi aggiungere la variabile con key `MIA_NAMESPACE` (usata nella funzione sopra). Come `value`, dovresti usare `https://BASE_URL/`, sostituendo l'url identificativo del tuo tenant. Questo url non verrà mai chiamato da Auth0, ma serve per scopizzare l'informazione che viene iniettata all'interno dell'id-token dei tuoi utenti.

!!! Warning
Ricordati il valore che inserisci qua, servirà per il prossimo step e non sarà più visibile!


## Step 6: Scrivi le configurazioni sulla Console

[Link sulla guida per le configurazioni sulla console](https://docs.mia-platform.eu/runtime_suite/auth0-client/configuration/)

Ricordati, quando configuri l'auth0-client, di riutilizzare il valore che hai utilizzato come `MIA_NAMESPACE` nella rule configurata al punto precedente.

e.g.
Se configuro `MIA_NAMESPACE=https://mia-platform.eu/`, nella configurazione dell'auth0-client dovrò settare:

```json
{
  // ... le altre configurazioni,
  customClaimsNamespaces: [
      "https://mia-platform.eu/app_metadata",
      "https://mia-platform.eu/user_metadata"
  ]
}
```

## Abilita i tuoi utenti

[Per configurare i tuoi utenti leggi la documentazione di Auth0](https://auth0.com/docs/users/guides/manage-users-using-the-dashboard)




