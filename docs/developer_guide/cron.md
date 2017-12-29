## Introduzione
Mia Platform integra un sistema di cron per schedulare delle operazioni ad intervalli decisi dallo sviluppatore.
L'implementazione del cron prevede due fasi: la configurazione della schedulazione e l'implementazione della funzione da eseguire.

## Implementare un cron
Il cron è disegnato per eseguire nel contesto di un `plugin`, per questo motivo la configurazione e l'implementazione della routine devono esistere a livello di `plugin`.

La configurazione va scritta nel file `options.json` del `plugin`. Di seguito un esempio:

````
{
  "acl": {
    "access": {
      "users": [],
      "groups": ["users"]
    },
    "read": {
      "users": [],
      "groups": ["users"]
    },
    "create": {
      "users": [],
      "groups": ["users"]
    },
    "update": {
      "users": [],
      "groups": ["users"]
    },
    "delete": {
      "users": [],
      "groups": ["users"]
    },
    "enabled": false,
    "secreted": true
  },
  "cronConfiguration": {
    "active": true,
    "period": "30 01 * * * *"
  }
}
````

La parte di file di interesse è nell'oggetto json `cronConfiguration` che contiene due campi:

* active: booleano che attiva o disattiva il cron
* period: stringa per la schedulazione temporale del cron. La sintassi segue lo standard Unix descritto alla seguente pagina di Wikipedia [https://en.wikipedia.org/wiki/Cron](https://en.wikipedia.org/wiki/Cron).

Nell'esempio soprariportato il cron è attivo ed esegue la routine ogni giorno alle ore 01:30.

La routine da eseguire è una funzione Javascript implementata nel file `index.js` del `plugin`. La firma della funzione deve essere obbligatoriamente `cronFunction`. Può essere usata solo questa funzione, con questo nome, senza argomenti e ne può esistere solo una.
Di seguito un esempio:

`````
class MIACronExample extends MIACollection {

  cronFunction() {
      this.log('info', 'Hello cron')
  }
  
}
`````


