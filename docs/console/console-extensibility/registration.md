---
id: registration
title: Register Extensions
sidebar_label: Register Extensions
---
# Register Extensions

Una nuova estensione ha bisogno sempre di essere registrata sulla Console prima di poter essere attivata. L'estensione registrata risulterà cosi sotto il dominio della propria Company ed è per questo che la registrazione e la gestione delle estensioni registrate può essere fatta solo dal Company Owner.

## How to register my extension?

Se vuoi registrare una nuova estensione sarà necessario aver già scelto la Company che ne avrà possesso e assicurarsi di avere il ruolo di Company Owner su tale Company. Una volta fatto questo, la registrazione può essere fatta tramite API e consigliamo di utilizzare l'API Portal per forgiare le richieste.

La rotta da contattare è la `PUT /api/extensibility/tenants/{tenantId}/extensions` e la puoi trovare sotto il tag `Companies` o `Extensibility`. 

![registration example](./images/registrationExample.png)

Come si può vedere dall'immagine di esempio, la registrazione di un estensione richiede di fornire alcune informazioni necessarie per la renderizzazione corretta in Console.

**Path Params**
- `tenantId`: inserire il tenant ID della Company che avrà ownership della nuova estension

**Body Params**
- `name`: riporta il nome della tua estensione
- `contexts`: dichiara in quali contesti potrà essere attivata l'estensione. I valori selezionabili al momento sono Company e Project.
- `description`: fornisci una descrizione breve dell'estensione 
- `entry`: indica l'url dove verrà fetchato l'iframe
- `extensionType`: seleziona il tipo di estensione. Per ora solo il tipo iframe è supportato
- `permissions`: indica quali permessi dovranno avere gli utenti per poter vedere l'estensione una volta attiva (maggiori approfondimenti nella [sezione](#how-to-restrict-the-extension-usage) successiva)
- `routes`: fornisci le voci di menu che dovranno comparire sulla sidebar una volta attivata l'estensione
<!-- TODO: dobbiamo spiegare che possiamo solo mettere un menu item per estensione e bisogna creare più estensioni per metterne più di una in diverse location -->

### How to restrict the extension usage?

Le estensioni registrate possono anche conservare un array di `permissions` che serve per verificare se un utente può vedere l'estensione attiva in Console oppure no. In particolare l'utente dovrà avere **almeno uno dei permessi richiesti nell'array** e i permessi che si possono registrare su un estensione sono quelli della Console riportati in tabella dell'[Identity and access management page](../../development_suite/identity-and-access-management/console-levels-and-permission-management.md#identity-capabilities-inside-console)  

### How to configure correctly the extension menu item? 

![registration example main route](./images/registrationExampleMainRoute.png)

![registration example category route](./images/registrationExampleCategoryRoute.png)

Le rotte rappresentano le voci di menu che verranno aggiunte alla sidebar e che ci permettono di accedere all'estensione. Queste rotte devono specificare una location ben precisa e ad ogni location corrisponderanno anche dei menu groups a cui le rotte si possono agganciare. Inoltre su una location è anche possibile registrare delle rotte di tipo `category` che aggiungono nuovi menu groups e utilizzarli per agganciare i nuovi menu items.

Una rotta richede quindi di fornire le seguenti informazioni:
- `id`: assegnare un id univoco che potrà essere utilizzato per applicare degli override con l'attivazione oppure per agganciare dei menu items se il renderType della rotta è `category`
- `locationId`: scegli una location dove inserire la tua rotta (vedi le [location supportate](./locations.md))
- `renderType`: seleziona `category` se vuoi inserire un nuovo menu group altrimenti lascia un valore vuoto per aggiungere un menu item
- `parentId`: inserisci il route `id` di un menu group dove si vuole agganciare il menu item (trovi i parentId già esistenti corrispondenti alle [location supportate](./locations.md)) oppure aggiungi una route di tipo `category` e usa il suo `id`. Puoi omettere questa informazione se la rotta è di tipo `category`.
- `destinationPath`: indica il suffisso di destinazione a cui si verrà rimandati al click del menu item e comporrà l'URL dove verrà montato l'iframe, infatti l'URL finale sarà composta da 3 pezzi `<locationPath>/extensions/<extensionId><destinationPath>`. Puoi omettere questa informazione se la rotta è di tipo `category`.
- `icon`: seleziona un icona da utilizzare sul nuovo menu item e riportala dentro il campo `name`. Puoi trovare le icone su questo [link](https://react-icons.github.io/react-icons/search/) e sono supportate solo le icone di Ant, Feather e Phosphor. Puoi omettere questa informazione se la rotta è di tipo `category`.
- `labelIntl`: inserisci la label che verrà usata sul menu item o menu group e riportala in un oggetto {"en": string, "it": string} affinchè il testo venga anche internazionalizzato.
- `featureToggles`: TBD
- `order`: TBD
- `matchExactMountPath`: TBD
<!-- TODO: Should be added some mentions about the order of menu items? -->
<!-- TODO: Explain that the route id is required and it is needed to advanced customization (redirect to overrides page) -->

#### Register Backoffice Extension Example

Il seguente esempio mostra come registrare il Backoffice come estensione di Progetto. Per riprodurlo sarà necessario configurare il Backoffice ed esporlo in modo tale che sia possibile utilizzarlo come iframe. I passi preliminari da seguire sono quindi i seguenti:

1. Creare un progetto reso contattabile esternamente (vedi questa [guida](../project-configuration/create-a-project.mdx) per farlo)
2. Aggiungere l'application `Microfrontend Composer Toolkit` seguendo questa [guida](../../microfrontend-composer/tutorials/basics#setup-the-microservices)
3. Assicurati che la risposta dell'endpoint del backoffice permetta di essersi embeddata dentro un iframe (see `Iframe embedding options` on this [link](../../development_suite/api-console/api-design/endpoints.md#manage-advanced-endpoint-parameters) for more info) 

Una volta che questo è stato fatto si può procedere con la registrazione dell'estensione:

**Path Params**
```json
{
  "tenantId": "my-tenant-id"
}
```

**Body Params**
```json
{
  "contexts": ["project"],
  "description": "Extension to integrate backoffice on Console",
  "entry": "https://<my-domain>/mfe-application/home",
  "extensionType": "iframe",
  "name": "Integrated Backoffice",
  "routes": [
    {
      "destinationPath": "/backoffice",
      "icon": {
        "name": "PiProjectorScreenChartLight"
      },
      "id": "backoffice-route",
      "labelIntl": {
        "en": "Integrated Backoffice",
        "it": "Backoffice integrato"
      },
      "locationId": "project",
      "parentId": "my-menu-group"
    },
    {
      "destinationPath": "/something-ignored", // This is required but ignored if renderType is category 
      "id": "my-menu-group",
      "labelIntl": {
        "en": "My Menu Group",
        "it": "Il mio gruppo menu"
      },
      "locationId": "project",
      "renderType": "category"
    }
  ]
}
```

**Response on success**
```json
{
    "extensionId":"my-extension-id"
}
```

L'estension ID sarà un dato richiesto per controllare l'estensione con le restanti API e potrà essere recuperato usando un'apposita API riporta qui di seguito.

## Get registered Extensions

La rotta `GET /api/extensibility/tenants/{tenantId}/extensions` ti permette di consultare tutte l'estensioni registrate sotto una specifica Company e la si può contattare facilmente sull'API Portal sotto il tag `Companies` o `Extensibility` assicurandosi di avere il ruolo di Company Owner sulla Company richiesta. 

![retrieve extensions example](./images/retrieveExtensionsExample.png)

### Get Registered Backoffice Extension Example

**Path Params**
```json
{
  "tenantId": "my-tenant-id"
}
```

**Response**
```json
[
  {
    "extensionId":"my-extension-id",
    "name":"Integrated Backoffice",
    "description":"Extension to integrate backoffice on Console"
  }
]
```

## Edit registered Extension

La rotta `PUT /api/extensibility/tenants/{tenantId}/extensions` può essere usata per modificare un estensione già registrata semplicemente specificando l'`extensionId` e riportando tutte le informazioni da applicare incluse anche quelle che dovranno rimanere invariate. Anche questa rotta si può contattare con l'API Portal sotto il tag `Companies` o `Extensibility` assicurandosi di avere il ruolo di Company Owner sulla Company richiesta. 

![edit registered extension](./images/editRegisteredExtension.png)

#### Edit Backoffice Extension Example

In questo esempio modifichiamo l'estensione del Backoffice registrata [qui](#register-backoffice-extension-example), modificando la label del suo menu item:

**Path Params**
```json
{
  "tenantId": "my-tenant-id"
}
```

**Body Params**
```json
{
  "contexts": ["project"],
  "extensionId": "my-extension-id",
  "description": "Extension to integrate backoffice on Console",
  "entry": "https://<my-domain>/mfe-application/home",
  "extensionType": "iframe",
  "name": "Integrated Backoffice",
  "routes": [
    {
      "destinationPath": "/backoffice",
      "icon": {
        "name": "PiProjectorScreenChartLight"
      },
      "id": "backoffice-route",
      "labelIntl": {
        "en": "Integrated Backoffice Edited",
        "it": "Backoffice integrato Modificato"
      },
      "locationId": "project",
      "parentId": "my-menu-group"
    },
    {
      "destinationPath": "/something-ignored", // This is required but ignored if renderType is category 
      "id": "my-menu-group",
      "labelIntl": {
        "en": "My Menu Group",
        "it": "Il mio gruppo menu"
      },
      "locationId": "project",
      "renderType": "category"
    },
  ]
}
```

**Response on success**: 204 No Content

## Remove registered Extension

La rotta `DELETE /api/extensibility/tenants/{tenantId}/extensions/{extensionId}` può essere usata per rimuovere un estensione già registrata. Si può contattare tramite API Portal sotto il tag `Companies` o `Extensibility` assicurandosi di avere il ruolo di Company Owner sulla Company richiesta. 

:::info
L'eliminazione di un estensione la disattiva automaticamente anche da tutti i contesti in cui era attiva.
:::

![delete registered extension](./images/deleteRegisteredExtension.png)

#### Remove Backoffice Extension Example

Se si vuole eliminare l'estensione del Backoffice registrata [qui](#register-backoffice-extension-example) ci basta specificare il `tenantId` su cui è stata registrato e il suo `extensionId`:

**Path Params**
```json
{
  "tenantId": "my-tenant-id",
  "extensionId": "my-extension-id"
}
```

**Response on success**: 204 No Content
