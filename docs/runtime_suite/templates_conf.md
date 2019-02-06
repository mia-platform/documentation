# Configurazione dei template

L'Api-console è in grado di generare nuovi servizi a partire dal custom-plugin Mia, da un progetto git o da un template a scelta.  
Per fare in modo che l'Api-console possa creare nuovi servizi a partire da un template è necessario creare il temlplate su Gitlab e censirlo nella configurazione dell'Api-console.

I template devono essere censiti nel CRUD, nella collezione `templates`, indicando un'etichetta che visualizzerà l'utente ed il percorso al repository git.  
Di seguito un esempio di curl per il censimento di un template:

```bash
curl -d '{ "label": "my-template", "value": "gitlab-url.tar.gz"}' http://api-console-host/v2/templates/
```

Il campo `value` deve essere un URL alla versione tar.gz del progetto git.  
Di seguito un esempio:

```
https://your-gitlab-host/api/v4/projects/:project-id/repository/archive.tar.gz
```

L'Api-console provvederà alla creazione di un repository nel quale copierà i file del template sostituendo tutte le occorrenze delle seguenti stringhe comprese tra `%`:

`%CUSTOM_PLUGIN_IMAGE_NAME%` -> nome dell'immagine nexus inserita dall'utente  
`%CUSTOM_PLUGIN_PROJECT_NAME%` -> nome (label) del progetto api-console  
`%CUSTOM_PLUGIN_PROJECT_NAMESPACE%` -> namespace del progetto api-console  
`%CUSTOM_PLUGIN_SERVICE_NAME%` -> nome del servizio scelto dall'utente  
`%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%` -> descrizione del servizio scelto dall'utente  
`%CUSTOM_PLUGIN_CREATOR_USERNAME%` -> username dell'utente che ha creato il servizio  
`%CUSTOM_PLUGIN_PROJECT_FULL_PATH%` -> percorso completo Gitlab  
`%GITLAB_PROJECT%` -> nome del progetto Gitlab inserito dall'utente  
`%GITLAB_GROUP%` -> nome del gruppo Gitlab inserito dall'utente  
`%GITLAB_BASE_URL%` -> base URL di Gitlab  
`%NEXUS_HOSTNAME%` -> hostname di Nexus  
