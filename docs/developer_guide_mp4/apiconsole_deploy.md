##Come creare degli ambienti di deploy su API console in progetti esistenti

L'API Console ha cambiato la gestione degli ambienti di deploy per i progetti: da adesso in poi **potrà esserci un numero arbitrario di ambienti di deploy**, in base alle necessità.

Questa nuova gestione degli ambienti fa si che per alcuni progetti già esistenti non compaiano ambienti di deploy nella sezione "Deploy" dell'API Console.

Nel caso sia urgentissimo avere degli ambienti di deploy, bisogna seguire i seguenti passaggi:

* **Step 1**: Aprire **Postman** (attivare interceptor se non già attivo).

* **Step 2**: Importare la **curl di esempio** qui sotto:

```
curl -X PATCH \
  https://console.AMBIENTE_API_CONSOLE.mia-platform.eu/v2/api/projects/ID_PROGETTO \
  -H 'accept: application/json' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'cookie: sid=7c61836521c5af26f233450f33cc9838a7dd0962ed72f319' \
  -H 'postman-token: 6a7907c1-41bb-1fd8-5b5f-d8a740a4c9e9' \
  -H 'secret: Jh3cQ4bJYh^xyXSN@D94adEZ' \
  -b sid=TUO_SID_DA_BROWSER_COOKIE \
  -d '{


	"$set": {
		"environments": [
			{
				"label": "Development",
				"value": "development",
				"hostname": "https://labidcms.test.mia-platform.eu"
			},
			{
				"label": "Preprod",
				"value": "preproduction",
				"hostname": "https://labidcms.preprod.mia-platform.eu"
			},
			{
				"label": "Production",
				"value": "production",
				"hostname": "https://labidcms.cloud.mia-platform.eu"
			}

		]
	}
}'
```

* **Step 3**: Settare i campi in maiuscolo della curl.


In merito al terzo passaggio, andranno modificati prevalentemente i seguenti campi:

* Indirizzo della console con **AMBIENTE_API_CONSOLE** corretto (test, preprod, cloud) in base alle necessità.

* l'**ID_PROGETTO** del progetto di cui vi interessa settare gli ambienti di deploy; l'id del progetto va in coda all'indirizzo della console di cui sopra.

* il **SID nel campo TUO_SID_DA_BROWSER_COOKIE**: questo lo ottenete loggandovi nell'api console e ispezionando i cookie della pagina

* il **body**, ovviamente, con gli ambienti che vi interessa avere per il progetto, seguendo la struttura della curl di esempio che vi ho passato.
