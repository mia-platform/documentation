# Configura Auth 0

Una volta che hai creato il tuo progetto e vuoi abilitare la gestione degli utenti sul tuo CMS-Backoffice di CMS o su un altro applicativo dovrai seguire questa breve guida.

## Prerequisiti

Prima di leggere questa guida assciurati di avere le seguenti condizioni:

* nel tuo progeto devi avere tra i servizi attivi l'auth0client;   
* devi avere l'accesso ad Auth0 per poterlo configurare;     
* devi creare un nuovo tenant su Auth0 con il nome del tuo cliente.   

## Step.1 Creazione degli applicativi

Per gestire i tuoi utenti su Auth0 dovrai creare gli applicativi:

1. Il primo di tipologia Regular Web Application con il nome del tuo frontend. Es: Name CMS. Se hai 1 Backoffice per Ambiente, ovviamente dovrai creare per ogni ambiente un applicativo. 
2. il secondo di tipologia M2M per la gestione degli utenti. Ti consigliamo di chiamarlo infatti "User Management CMS"

## Step 2. Configurazione delle pagine di callback

Entra nella tua Regular Application, nei setting e imposta questi 3 parametri:

  * **allowed callback url:** indica dove auth0 ti rimanda dopo aver fatto la login  
  * **allowed web origin**: indica l'url da cui arrivi per poi puntare alla pagina di login
  * **allowed logout url**: indica la callback url della logout

  [img](!)

Va anche configurato l' **allowed logout url** a livello di Tenant, accedi quidni sui settings del tenant e nell'area advanced insierisci lo stesso allowed logout url che hai configurato sull'applicazione

## Step 3. Configuriamo più Database per ogni Ambiente

Di default Auth0 ha un solo Database, se volessimo avere un database unico per tutti gli utenti quindi possiamo anche non seguire questo step. 

Per creare invece più ambienti dobbiamo invece creare più database, uno per ogni ambiente. 
Una volta creato il database devi associare ad ogni applicazione il suo DB, quindi torna nell'area **Application**, entra in ogni application nella sezione **Connections** e attiva il database che vuoi utilizzare. 

## Step 4. Configuriamo la pagina di Login e Sign Up 

Questo passaggio dipende interamente dal tuo business e da quello che vorrai far fare ai tuoi utenti. 

All'interno delle Application nella sezione **Conncections** potrai scegleire per ogni applicativo che social login attivare o disattivare. 
Per gestire invece le login Social a livello globale all'interno della sezione **Connections** troverai la pagina **Social** scegli cosa abilitare e cosa no. 

[img-social](!)

Per disattivare invece la possiilità di fare sign-up è un'operazione che va fatta all'interno di ogni singolo database. 
Accedi quindi dentro l'area **Connections** alla pagina **Database**, scegli il Database e nei Settings vedrai l'impostazione **Disable Sign Ups**

## Step 5. Gestione dell'applicativo User Management

Per completare la gestione degli utenti da parte del nostro applicativo dobbiamo fare ancora un paio di azioni:

1. Crare ua APIs: vai nella sezione APIs e crea una API che abbia come identifier l'URL del tuo backoffice.  
2. Accedo alla applicazione User Management creata per la gestione degli utenti e autorizzo l'API Auth0Management andando a definire nell'area permission quali azioni voglio far fare sul mio applicativo. 
[img](!)
3. Ultimo passagio devo creare una RULES custom per abilitare l'accesso del nostro namespace alla gestione degli utenti. 
Accedo quindi alla sezione **Rules** - **Create Rules** - **Empty-Rules** dal nome *inject-id-token* inserire la seguente funzione

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

4. Sempre nella sezione RULES va aggiunta la variabile 


Nella sezioen console advanced 3 valori sono parametrici

clinet id : id dell'applicazione
client secret : secret dell'applicazione
redirect url : url dell'applicazione
nel mangemetn client: insiereie l'id e il secret dell utente m2m

poi impostare i custom claim namespaces
app metadata e user metadata con davanti k'hostname dell'applicativo m2m


Abilitare gli utenti: user & roles
crei un utente -  crea utente, mail passrod  e il database in cui vuoi inserirlo ,
quando fai create a lui arriva un email, a meno che tu non gli dica di resettarsi la password

La cosa più corretta sarebbe perosnalizzare l'email

Cusotmizzazioni
In questo momento se vuoi gestire gli utenti dal CMS non c'è la divisone per ambeinte.



 poi nelle variabili d'ambiente
