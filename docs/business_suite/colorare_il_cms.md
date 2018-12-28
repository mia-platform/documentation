# Colorare il CMS

## I file di cui hai bisogno

Per customizzare i colori del CMS devi inanzitutto avere accesso alla Cartella: "Custom CMS" all'interno del repository di GitLab del tuo progetto.

Se non è presente la cartella ti consigliamo di:

* Prendere un progetto di esempio con il Custom CMS creato da git lab.

* Fare un git clone

!!! warning
    Attenzione! se cloni un progetto esistente verifica in tutti i file creati che sia presente il nome del tuo cliente e non del cliente da cui hai clonato il percorso.

Il percorso per trovare la tua cartella è: Nome Progetto > Web Apps > Custom CMS

All'inerno di questa cartella deve essere presente un'altra cartella che per convenzione ha il nome del cms, tendenzialmente ha quindi il nome del cliente.

In questa cartella devono essere presenti altre due cartelle:

* una **custom** che contiene il file: *variables.css*

* una **img** che contiene il file per personalizzare la tua immagine del CMS.

Una volta che hai tutti questi file sul tuo progetto GIT puoi cominciare a customizzare il tuo CMS!

## Controllo delle variabili di progetto

Per far si che il tuo progetto venga deployato correttamente aggiorna o verifica che siano state aggiornate le seguenti variabili

* 1.  Vai nel fil di gitlab-ci del progetto all'interno di Custom CMS.

      Inserisci per ogni path, il nome del progetto cliente e scegli la versione del CMS che vuoi far buildare

* 2. Vai al path gilab/clients/:nome-cliente/configuration/gitlab-cli.yaml

     Controlla e guarda la versione del CMS che vuoi buildare

```

     image: nexus.mia-platform.eu/tools/kubectl:1.11.2

     variables:
       GIT_DEPTH: 1
       CMS_IMAGE_NAME: "nexus.mia-platform.eu/gls-ego/cms-site:7.0.4"

     stages:
       - release

     .deploy-job: &deploy_job
       before_script:
         - ./scripts/setup-context.sh "${KUBE_CONTEXT}" "${KUBE_CERT}" "${KUBE_URL}" "${KUBE_TOKEN}"

       script:
         - ./scripts/interpolate.sh
         - ./scripts/deploy.sh

       artifacts:
         paths:
           - interpolated-files/

     development:
       stage: release

       variables:
         KUBE_CONTEXT: "dev"
         KUBE_CERT: "${KUBE_DEV_CERT}"
         KUBE_URL: "${KUBE_DEV_URL}"
         KUBE_TOKEN: "${KUBE_DEV_TOKEN}"
         LOG_LEVEL: "${DEV_LOG_LEVEL}"
         MONGODB_URL: "${PREPROD_MONGODB_URL}"
         REDIS_URL: "${PREPROD_REDIS_URL}"

         CORE_LEGACY_IMAGE_NAME: "nexus.mia-platform.eu/demo/baas-legacy:0.2.0"
         MONGODB_LEGACY_URL: "${PREPROD_MONGODB_LEGACY_URL}"
         REDIS_LEGACY_URL: "${PREPROD_REDIS_LEGACY_URL}"

       only:
         variables:
           - $ENVIRONMENT_TO_DEPLOY == "development"

       <<: \*deploy_job

     preprod:
       stage: release

       variables:
         KUBE_CONTEXT: "preprod"
         KUBE_CERT: "${KUBE_PREPROD_CERT}"
         KUBE_URL: "${KUBE_PREPROD_URL}"
         KUBE_TOKEN: "${KUBE_PREPROD_TOKEN}"
         LOG_LEVEL: "${PREPROD_LOG_LEVEL}"
         MONGODB_URL: "${PREPROD_MONGODB_URL}"
         REDIS_URL: "${PREPROD_REDIS_URL}"

         CORE_LEGACY_IMAGE_NAME: "nexus.mia-platform.eu/demo/baas-legacy:0.2.0"
         MONGODB_LEGACY_URL: "${PREPROD_MONGODB_LEGACY_URL}"
         REDIS_LEGACY_URL: "${PREPROD_REDIS_LEGACY_URL}"

       only:
         variables:
           - $ENVIRONMENT_TO_DEPLOY == "preproduction"

       <<: \*deploy_job

     cloud:
       stage: release

       variables:
         KUBE_CONTEXT: "cloud"
         KUBE_CERT: "${KUBE_CLOUD_CERT}"
         KUBE_URL: "${KUBE_CLOUD_URL}"
         KUBE_TOKEN: "${KUBE_CLOUD_TOKEN}"
         LOG_LEVEL: "${CLOUD_LOG_LEVEL}"
         MONGODB_URL: "${CLOUD_MONGODB_URL}"
         REDIS_URL: "${CLOUD_REDIS_URL}"

         CMS_IMAGE_NAME: "nexus.mia-platform.eu/gls-ego/cms-site:7.0.0"
         CORE_LEGACY_IMAGE_NAME: "nexus.mia-platform.eu/demo/baas-legacy:0.2.0"
         MONGODB_LEGACY_URL: "${CLOUD_MONGODB_LEGACY_URL}"
         REDIS_LEGACY_URL: "${CLOUD_REDIS_LEGACY_URL}"

       <<: \*deploy_job

       only:
         variables:
           - $ENVIRONMENT_TO_DEPLOY == "production"
```


## I colori delle variabili - variables.css

**body-bg**: colore di background generale. Tendenzialmente è meglio metterlo sul grigio #f4f4f4

**color-search**: colore di background della search

**color-brand**: colore di background della sidebar

**color-text-special**: Sono i titoli delle categorie delle sidebar, il testo dell'utente, e la navigaton bar

**color-text-special-2**: come i titoli delle proprietà vengono visualizzate in fase di editing e creazione

**color-text-special-3**: alcune variabili particolari come: quando clicco su all publish o draft, i placeholder nelle pagine, il colore della barra delle pagine che si caricano

**color-text-negative**: il colore dei campi nella tabella

**color-brand-gradient**: colore secondario

**color-brand-gradient-3**: quando viene selezionato un elemento nel left menù e il colore dei Mia Api CMS in basso a sx nella barra laterale

**color-brand-gradient-4**: allert

**color-brand-gradient-5**: tasti error e warning

**color-search-text**: il colore del testo nella search

**color-button**: il colore dei bottoni

**color-brand-gradient-1**: Il colore del titolo delle pagine nel menù laterale

**color-brand-bg-notification**: se attivi le notifiche il colore di sfondo del badge

**color-brand-text-notification**: il colore del testo interno alle notifiche
