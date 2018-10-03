# Come aggiornare il CMS

Qui troverai tutti i passi per aggiornare il CMS.

## 1. Come capire la tua versione del CMS

Per capire la versione corrente del tuo CMS, apri la pagina del CMS. Scorri il **menu laterale di sinistra** fino in fondo: alla fine di tutte le collezioni, troverai la scritta **"Mia API CMS v.x.x.xx"** con l'indicazione della versione (es. v.7.0.10).
A questo [link](https://docs.mia-platform.eu/release_notes/cms_releasenotes/) troverai l'elenco delle versioni rilasciate del CMS e le rispettive funzionalità supportate.


## 2. Come aggiornare la versione del CMS

Per aggiornare la versione del CMS gli step sono due:

1. Modificare la **configurazione del CMS**. Il percorso per accedere al file di configurazione su git è:

`>nomeprogetto / Webapp / custom CMS / .gitlab-ci.yml`

Nella sezione "variables" si trova **"CMS_VERSION"**, che deve essere aggiornata con l'ultima versione disponibile o voluta del CMS. A questo punto si salva e si visualizza il CMS in test.

!!! note
      L'aggiornamento automatico della versione del CMS accade solo per l'ambiente di **test**. Infatti, nel file ".gitlab-ci.yml" alla sezione "script" si può vedere che l'ambiente di test è configurato in modo tale da aggiornare automaticamente la versione da git.

2. Si procede con la **configurazione per gli ambienti di preprod e prod**. Per farlo il percorso su git è:

`>nomeprogetto / config / .gitlab-ci.yml`

  Nel file è possibile trovare la configurazione di tutti gli ambienti (development, preprod e cloud), composta da tre sezioni:

   * stage;

   * variables;

   * variables only.

  Per entrambi gli ambienti di preprod e cloud, nella sezione "variables" è possibile aggiornare la versione del CMS al campo **"CMS_IMAGE_NAME"**.

  Poi si salva e si deploya il progetto da API Console in entrambi gli ambienti. A questo punto sarà possibile vedere la versione del CMS aggiornata anche negli ambienti di preprod e cloud.
